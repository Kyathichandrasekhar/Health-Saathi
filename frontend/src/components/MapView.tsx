import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { ArrowRight, Clock, MapPin, Navigation, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

interface MapViewProps {
  onHospitalsLoaded?: (hospitals: HospitalData[]) => void
}

interface LatLng {
  lat: number
  lng: number
}

interface HospitalData {
  id: string
  name: string
  address: string
  phone: string
  openingHours: string
  website: string
  lat: number
  lng: number
  location: LatLng
  distance: string
  rating: number
  specialties: string[]
  eta: string
  availableDoctors: number
}

interface OverpassElement {
  id: number
  type: 'node' | 'way' | 'relation'
  lat?: number
  lon?: number
  center?: {
    lat: number
    lon: number
  }
  tags?: Record<string, string>
}

interface OverpassResponse {
  elements: OverpassElement[]
}

interface OsrmRouteResponse {
  routes?: Array<{
    geometry: {
      coordinates: [number, number][]
    }
  }>
}

interface NominatimReverseResponse {
  display_name?: string
  address?: Record<string, string>
}

interface GeoFix {
  location: LatLng
  ts: number
  accuracy: number
}

const FALLBACK_LOCATION: LatLng = { lat: 16.5062, lng: 80.648 }
const SEARCH_RADIUS_METERS = 35000
const SEARCH_DEBOUNCE_MS = 220
const MIN_FETCH_MOVEMENT_KM = 0.3
const MIN_GEO_UPDATE_MOVEMENT_KM = 0.03
const MIN_GEO_UPDATE_INTERVAL_MS = 4000
const MAX_ACCEPTABLE_ACCURACY_METERS = 120
const MAX_COARSE_ACCURACY_WITHOUT_FIX_METERS = 2000
const MAX_REALISTIC_SPEED_KMH = 250
const NEARBY_PRIORITY_RADIUS_KM = 12
const FAST_NEARBY_RADIUS_METERS = 14000
const FAST_OVERPASS_TIMEOUT_SEC = 6
const MAX_VISIBLE_MARKERS = 120
const MAX_REVERSE_GEOCODE_ITEMS = 20
const MAX_HOSPITAL_RESULTS = 140
const HOSPITAL_CACHE_KEY = 'hs_nearby_hospitals_cache_v1'
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
]

const userIcon = L.divIcon({
  className: 'custom-user-dot',
  html: '<span style="display:block;width:14px;height:14px;border-radius:9999px;background:#3b82f6;border:2px solid #ffffff;box-shadow:0 0 0 7px rgba(59,130,246,0.22);"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const hospitalIcon = L.divIcon({
  className: 'custom-hospital-dot',
  html: '<span style="display:block;width:16px;height:16px;border-radius:9999px;background:#2563eb;border:2px solid #ffffff;box-shadow:0 0 0 7px rgba(37,99,235,0.28);"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

const highlightedHospitalIcon = L.divIcon({
  className: 'custom-hospital-dot-selected',
  html: '<span style="display:block;width:20px;height:20px;border-radius:9999px;background:#1d4ed8;border:3px solid #ffffff;box-shadow:0 0 0 10px rgba(29,78,216,0.3);"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function parseSpecialties(tags?: Record<string, string>) {
  const raw = tags?.['healthcare:speciality'] || tags?.speciality || tags?.specialty
  if (!raw) {
    if (tags?.healthcare === 'physiotherapist') {
      return ['Physiotherapy']
    }
    if (tags?.healthcare === 'clinic' || tags?.amenity === 'clinic') {
      return ['Clinic']
    }
    if (tags?.amenity === 'hospital' || tags?.healthcare === 'hospital') {
      return ['Hospital Care']
    }
    return ['Medical Care']
  }

  return raw
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3)
}

function formatAddressParts(address?: Partial<Record<string, string>>) {
  if (!address) {
    return ''
  }

  const locality =
    address.suburb ||
    address.neighbourhood ||
    address.village ||
    address.town ||
    address.city_district ||
    address.county

  const city = address.city || address.town || address.village || address.municipality

  const parts = [address.road, locality, city].filter(Boolean)
  return parts.join(', ')
}

function formatAddressFromTags(tags?: Record<string, string>) {
  if (!tags) {
    return ''
  }

  const full = tags['addr:full']
  if (full) {
    return full
  }

  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'] || tags.street,
    tags['addr:suburb'] || tags['is_in:suburb'] || tags['addr:neighbourhood'] || tags['addr:neighborhood'],
    tags['addr:district'] || tags['is_in:district'],
    tags['addr:place'] || tags['is_in'],
    tags['addr:city'] || tags['is_in:city'] || tags['addr:town'] || tags['addr:village'],
    tags['addr:state'],
  ].filter(Boolean)

  return parts.join(', ')
}

function extractHospitalPhone(tags?: Record<string, string>) {
  if (!tags) {
    return ''
  }

  const phone = tags['contact:phone'] || tags.phone || tags['phone:mobile'] || tags['contact:mobile']
  return phone?.trim() || ''
}

function extractHospitalWebsite(tags?: Record<string, string>) {
  if (!tags) {
    return ''
  }

  const site = tags['contact:website'] || tags.website || tags.url
  return site?.trim() || ''
}

function extractOpeningHours(tags?: Record<string, string>) {
  if (!tags) {
    return ''
  }

  return tags.opening_hours?.trim() || ''
}

function canonicalHospitalName(name: string) {
  return name
    .toLowerCase()
    .replace(/[.,'"()\-]/g, ' ')
    .replace(/\b(hospitals?|clinic|clinics|medical|center|centre)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function levenshteinDistance(a: string, b: string) {
  if (a === b) {
    return 0
  }
  if (!a.length) {
    return b.length
  }
  if (!b.length) {
    return a.length
  }

  const dp = Array.from({ length: a.length + 1 }, (_, i) => Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i += 1) {
    dp[i][0] = i
  }
  for (let j = 0; j <= b.length; j += 1) {
    dp[0][j] = j
  }

  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      )
    }
  }

  return dp[a.length][b.length]
}

function nameSimilarity(a: string, b: string) {
  const left = canonicalHospitalName(a)
  const right = canonicalHospitalName(b)

  if (!left || !right) {
    return 0
  }

  const maxLen = Math.max(left.length, right.length)
  if (maxLen === 0) {
    return 1
  }

  const distance = levenshteinDistance(left, right)
  return 1 - distance / maxLen
}

function hasHospitalListChanged(previous: HospitalData[], next: HospitalData[]) {
  if (previous.length !== next.length) {
    return true
  }

  for (let i = 0; i < next.length; i += 1) {
    const prev = previous[i]
    const curr = next[i]
    if (!prev || prev.id !== curr.id || prev.distance !== curr.distance || prev.address !== curr.address) {
      return true
    }
  }

  return false
}

async function fetchOverpassWithFallback(query: string, signal: AbortSignal) {
  let lastError: Error | null = null

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal,
      })

      if (!response.ok) {
        throw new Error(`Overpass failed at ${endpoint} with status ${response.status}`)
      }

      const data = (await response.json()) as OverpassResponse
      if (!Array.isArray(data.elements)) {
        throw new Error(`Invalid Overpass response at ${endpoint}`)
      }

      return data
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        throw error
      }
      lastError = error as Error
    }
  }

  throw lastError || new Error('All Overpass endpoints failed')
}

async function reverseGeocodeAddress(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=19&addressdetails=1`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en',
        },
      },
    )

    if (!response.ok) {
      return ''
    }

    const data = (await response.json()) as NominatimReverseResponse
    return formatAddressParts(data.address) || data.display_name || ''
  } catch {
    return ''
  }
}

function buildOverpassQuery(center: LatLng, radiusMeters = SEARCH_RADIUS_METERS, timeoutSeconds = 12, includeClinic = true) {
  const clinicClauses = includeClinic
    ? `
  node["amenity"="clinic"](around:${radiusMeters},${center.lat},${center.lng});
  way["amenity"="clinic"](around:${radiusMeters},${center.lat},${center.lng});
  relation["amenity"="clinic"](around:${radiusMeters},${center.lat},${center.lng});
  node["healthcare"~"^(clinic|medical_center|centre)$"](around:${radiusMeters},${center.lat},${center.lng});
  way["healthcare"~"^(clinic|medical_center|centre)$"](around:${radiusMeters},${center.lat},${center.lng});
  relation["healthcare"~"^(clinic|medical_center|centre)$"](around:${radiusMeters},${center.lat},${center.lng});`
    : ''

  return `
[out:json][timeout:${timeoutSeconds}];
(
  node["amenity"="hospital"](around:${radiusMeters},${center.lat},${center.lng});
  way["amenity"="hospital"](around:${radiusMeters},${center.lat},${center.lng});
  relation["amenity"="hospital"](around:${radiusMeters},${center.lat},${center.lng});
  node["healthcare"="hospital"](around:${radiusMeters},${center.lat},${center.lng});
  way["healthcare"="hospital"](around:${radiusMeters},${center.lat},${center.lng});
  relation["healthcare"="hospital"](around:${radiusMeters},${center.lat},${center.lng});${clinicClauses}
);
out center tags;
`
}

function normalizeOverpassHospitals(elements: OverpassElement[], center: LatLng) {
  const rawHospitals = elements
    .map((element) => {
      const tags = element.tags
      const lat = element.lat ?? element.center?.lat
      const lng = element.lon ?? element.center?.lon
      const name = tags?.name?.trim() || 'Hospital'

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return null
      }

      const km = calculateDistance(center.lat, center.lng, lat, lng)
      const addressFromTags = formatAddressFromTags(tags)

      return {
        id: `${element.type}-${element.id}`,
        name,
        address: addressFromTags,
        phone: extractHospitalPhone(tags),
        openingHours: extractOpeningHours(tags),
        website: extractHospitalWebsite(tags),
        lat,
        lng,
        location: { lat, lng },
        distance: `${km.toFixed(1)} km`,
        rating: Number.isFinite(Number(tags?.stars)) ? Number(tags?.stars) : 0,
        specialties: parseSpecialties(tags),
        eta: `${Math.max(4, Math.round((km / 25) * 60))} min`,
        availableDoctors: 0,
      } satisfies HospitalData
    })
    .filter((hospital): hospital is HospitalData => hospital !== null)

  const dedupeByExactNameAndPoint = rawHospitals.filter(
    (hospital, index, arr) =>
      index ===
      arr.findIndex(
        (candidate) =>
          candidate.name.trim().toLowerCase() === hospital.name.trim().toLowerCase() &&
          candidate.lat.toFixed(6) === hospital.lat.toFixed(6) &&
          candidate.lng.toFixed(6) === hospital.lng.toFixed(6),
      ),
  )

  dedupeByExactNameAndPoint.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))

  const nearbyHospitals = dedupeByExactNameAndPoint.filter(
    (hospital) => parseFloat(hospital.distance) <= NEARBY_PRIORITY_RADIUS_KM,
  )
  const farHospitals = dedupeByExactNameAndPoint.filter(
    (hospital) => parseFloat(hospital.distance) > NEARBY_PRIORITY_RADIUS_KM,
  )

  const dedupedFarAliases = farHospitals.filter((hospital, index, arr) => {
    return (
      index ===
      arr.findIndex((candidate) => {
        const similarity = nameSimilarity(candidate.name, hospital.name)
        const spacingKm = calculateDistance(candidate.lat, candidate.lng, hospital.lat, hospital.lng)
        if (similarity < 0.72) {
          return false
        }
        return spacingKm <= 0.8
      })
    )
  })

  return [...nearbyHospitals, ...dedupedFarAliases].slice(0, MAX_HOSPITAL_RESULTS)
}

function MapViewportController({ target, animate }: { target: LatLng; animate: boolean }) {
  const map = useMap()

  useEffect(() => {
    if (animate) {
      map.flyTo([target.lat, target.lng], 15, { duration: 0.8 })
      return
    }

    map.setView([target.lat, target.lng], map.getZoom(), {
      animate: false,
    })
  }, [animate, map, target.lat, target.lng])

  return null
}

function RouteViewportController({ route }: { route: LatLng[] }) {
  const map = useMap()

  useEffect(() => {
    if (route.length < 2) {
      return
    }

    const bounds = L.latLngBounds(route.map((point) => [point.lat, point.lng]))
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, route])

  return null
}

export default function MapView({ onHospitalsLoaded }: MapViewProps) {
  const navigate = useNavigate()

  const [userLocation, setUserLocation] = useState<LatLng>(FALLBACK_LOCATION)
  const [locationStatus, setLocationStatus] = useState('Detecting your location...')
  const [isHospitalsLoading, setIsHospitalsLoading] = useState(false)
  const [isRouting, setIsRouting] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | null>(null)
  const [mapTarget, setMapTarget] = useState<LatLng>(FALLBACK_LOCATION)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [hospitals, setHospitals] = useState<HospitalData[]>([])
  const [routePath, setRoutePath] = useState<LatLng[]>([])
  const [isMapTilesReady, setIsMapTilesReady] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const lastFetchedLocationRef = useRef<LatLng | null>(null)
  const lastGeoUpdateRef = useRef<GeoFix | null>(null)
  const routeControllerRef = useRef<AbortController | null>(null)

  const readHospitalsFromCache = useCallback(() => {
    try {
      const raw = localStorage.getItem(HOSPITAL_CACHE_KEY)
      if (!raw) {
        return [] as HospitalData[]
      }

      const parsed = JSON.parse(raw) as { ts?: number; hospitals?: HospitalData[] }
      if (!Array.isArray(parsed?.hospitals)) {
        return [] as HospitalData[]
      }

      return parsed.hospitals
    } catch {
      return [] as HospitalData[]
    }
  }, [])

  const shouldAcceptGeoFix = useCallback((position: GeolocationPosition, previousFix: GeoFix | null) => {
    const accuracy = Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : Infinity
    const liveLoc = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    }

    if (!previousFix) {
      if (accuracy > MAX_COARSE_ACCURACY_WITHOUT_FIX_METERS) {
        return { accepted: false, location: liveLoc, accuracy }
      }
      return { accepted: true, location: liveLoc, accuracy }
    }

    const now = Date.now()
    const movedKm = calculateDistance(previousFix.location.lat, previousFix.location.lng, liveLoc.lat, liveLoc.lng)
    const elapsedMs = now - previousFix.ts
    const elapsedHours = elapsedMs / 3600000
    const estimatedSpeedKmh = elapsedHours > 0 ? movedKm / elapsedHours : 0

    if (estimatedSpeedKmh > MAX_REALISTIC_SPEED_KMH) {
      return { accepted: false, location: liveLoc, accuracy }
    }

    if (accuracy > MAX_ACCEPTABLE_ACCURACY_METERS && accuracy > previousFix.accuracy * 1.8) {
      return { accepted: false, location: liveLoc, accuracy }
    }

    if (movedKm < MIN_GEO_UPDATE_MOVEMENT_KM && elapsedMs < MIN_GEO_UPDATE_INTERVAL_MS) {
      return { accepted: false, location: liveLoc, accuracy }
    }

    return { accepted: true, location: liveLoc, accuracy }
  }, [])

  const applyAcceptedGeoFix = useCallback((location: LatLng, accuracy: number) => {
    lastGeoUpdateRef.current = {
      location,
      ts: Date.now(),
      accuracy,
    }

    setUserLocation(location)
    setLocationStatus('Live Location Active')
  }, [])

  const handleSelectHospital = useCallback((hospital: HospitalData) => {
    setSelectedHospital(hospital)
    setMapTarget({ lat: hospital.lat, lng: hospital.lng })
    setLocationStatus(`Navigating to ${hospital.name}...`)
    setShowSuggestions(false)
  }, [])

  const handleBookAppointment = useCallback((hospital: HospitalData) => {
    navigate('/booking', {
      state: {
        preSelectedHospital: hospital,
      },
    })
  }, [navigate])

  useEffect(() => {
    const cachedHospitals = readHospitalsFromCache()
    if (cachedHospitals.length > 0) {
      setHospitals(cachedHospitals.slice(0, MAX_HOSPITAL_RESULTS))
      setLocationStatus((current) =>
        current === 'Detecting your location...' ? 'Loading live nearby hospitals...' : current,
      )
    }
  }, [readHospitalsFromCache])

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(FALLBACK_LOCATION)
      setMapTarget(FALLBACK_LOCATION)
      setLocationStatus('Live location unavailable, showing Vijayawada')
      return
    }

    let hasCentered = false

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const check = shouldAcceptGeoFix(position, lastGeoUpdateRef.current)
        if (!check.accepted) {
          setLocationStatus('Waiting for precise GPS fix...')
          return
        }
        applyAcceptedGeoFix(check.location, check.accuracy)
        setMapTarget(check.location)
        hasCentered = true
      },
      () => {
        // Keep watchPosition active as fallback if one-time lock fails.
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    )

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const check = shouldAcceptGeoFix(position, lastGeoUpdateRef.current)
        if (!check.accepted) {
          if (!lastGeoUpdateRef.current) {
            setLocationStatus('Waiting for precise GPS fix...')
          }
          return
        }

        applyAcceptedGeoFix(check.location, check.accuracy)

        if (!hasCentered) {
          setMapTarget(check.location)
          hasCentered = true
          return
        }

        if (!selectedHospital && routePath.length === 0) {
          setMapTarget(check.location)
        }
      },
      () => {
        if (!lastGeoUpdateRef.current) {
          setUserLocation(FALLBACK_LOCATION)
          setMapTarget(FALLBACK_LOCATION)
          setLocationStatus('Location permission denied, showing Vijayawada')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [applyAcceptedGeoFix, routePath.length, selectedHospital, shouldAcceptGeoFix])

  useEffect(() => {
    if (!hospitals.length) {
      return
    }

    try {
      const cachePayload = JSON.stringify({
        ts: Date.now(),
        hospitals,
      })
      localStorage.setItem(HOSPITAL_CACHE_KEY, cachePayload)
    } catch {
      // Ignore localStorage write failures.
    }
  }, [hospitals])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearchQuery(searchInput.trim())
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeout)
  }, [searchInput])

  useEffect(() => {
    const shouldFetch = () => {
      const lastLocation = lastFetchedLocationRef.current
      if (!lastLocation) {
        return true
      }
      const movedKm = calculateDistance(lastLocation.lat, lastLocation.lng, userLocation.lat, userLocation.lng)
      return movedKm >= MIN_FETCH_MOVEMENT_KM
    }

    if (!shouldFetch()) {
      return
    }

    const controller = new AbortController()

    const fetchNearbyHospitals = async () => {
      let hasFastResult = false

      try {
        setIsHospitalsLoading(true)

        try {
          const fastOverpassData = await fetchOverpassWithFallback(
            buildOverpassQuery(userLocation, FAST_NEARBY_RADIUS_METERS, FAST_OVERPASS_TIMEOUT_SEC, true),
            controller.signal,
          )
          const fastHospitals = normalizeOverpassHospitals(fastOverpassData.elements, userLocation)
          if (fastHospitals.length > 0) {
            hasFastResult = true
            setHospitals((current) => (hasHospitalListChanged(current, fastHospitals) ? fastHospitals : current))
            setSelectedHospital((current) => {
              if (!current) {
                return null
              }
              const refreshed = fastHospitals.find((hospital) => hospital.id === current.id)
              return refreshed || null
            })
          }
        } catch {
          // Continue to full fetch.
        }

        const overpassData = await fetchOverpassWithFallback(buildOverpassQuery(userLocation), controller.signal)
        const nearestHospitals = normalizeOverpassHospitals(overpassData.elements, userLocation)
        setHospitals((current) => (hasHospitalListChanged(current, nearestHospitals) ? nearestHospitals : current))
        setSelectedHospital((current) => {
          if (!current) {
            return null
          }
          const refreshed = nearestHospitals.find((hospital) => hospital.id === current.id)
          return refreshed || null
        })

        const missingAddressIds = new Set(
          nearestHospitals
            .filter((hospital) => !hospital.address)
            .slice(0, MAX_REVERSE_GEOCODE_ITEMS)
            .map((hospital) => hospital.id),
        )

        const withResolvedAddresses = await Promise.all(
          nearestHospitals.map(async (hospital) => {
            if (hospital.address || !missingAddressIds.has(hospital.id)) {
              return hospital
            }
            const reverseAddress = await reverseGeocodeAddress(hospital.lat, hospital.lng)
            return {
              ...hospital,
              address: reverseAddress || '',
            }
          }),
        )

        withResolvedAddresses.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        setHospitals((current) => (hasHospitalListChanged(current, withResolvedAddresses) ? withResolvedAddresses : current))
        setSelectedHospital((current) => {
          if (!current) {
            return null
          }
          const refreshed = withResolvedAddresses.find((hospital) => hospital.id === current.id)
          return refreshed || null
        })
        lastFetchedLocationRef.current = userLocation
      } catch {
        setLocationStatus((current) =>
          current === 'Live Location Active' ? 'Live Location Active (hospital data temporarily unavailable)' : current,
        )
        if (!hasFastResult) {
          setHospitals([])
        }
      } finally {
        setIsHospitalsLoading(false)
      }
    }

    fetchNearbyHospitals()

    return () => controller.abort()
  }, [userLocation])

  useEffect(() => {
    if (onHospitalsLoaded) {
      onHospitalsLoaded(hospitals)
    }
  }, [hospitals, onHospitalsLoaded])

  const filteredHospitals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    const scored = hospitals
      .map((hospital) => {
        if (!q) {
          return { hospital, score: 1 }
        }

        const name = hospital.name.toLowerCase()
        const address = hospital.address.toLowerCase()

        let score = 0
        if (name.startsWith(q)) {
          score += 5
        }
        if (name.includes(q)) {
          score += 3
        }
        if (address.includes(q)) {
          score += 1
        }

        return { hospital, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score
        }
        return parseFloat(a.hospital.distance) - parseFloat(b.hospital.distance)
      })

    const ordered = scored.map((item) => item.hospital)

    return ordered.filter((hospital, index, arr) => {
      return (
        index ===
        arr.findIndex((candidate) => {
          const similarity = nameSimilarity(candidate.name, hospital.name)
          if (similarity < 0.72) {
            return false
          }
          const spacingKm = calculateDistance(candidate.lat, candidate.lng, hospital.lat, hospital.lng)
          return spacingKm <= 0.8
        })
      )
    })
  }, [hospitals, searchQuery])

  const visibleHospitals = useMemo(() => {
    const source = searchQuery ? filteredHospitals : hospitals
    return source.slice(0, MAX_VISIBLE_MARKERS)
  }, [filteredHospitals, hospitals, searchQuery])

  const handleNavigateToHospital = async (hospital: HospitalData) => {
    const controller = new AbortController()
    try {
      setIsRouting(true)
      routeControllerRef.current?.abort()
      routeControllerRef.current = controller
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${hospital.lng},${hospital.lat}?overview=full&geometries=geojson`,
        { signal: controller.signal },
      )

      if (!response.ok) {
        throw new Error('Route fetch failed')
      }

      const data = (await response.json()) as OsrmRouteResponse
      const coordinates = data.routes?.[0]?.geometry?.coordinates || []

      const path = coordinates.map(([lng, lat]) => ({ lat, lng }))
      if (path.length > 1) {
        setRoutePath(path)
      }

      setMapTarget({ lat: hospital.lat, lng: hospital.lng })
      setSelectedHospital(hospital)
    } catch {
      setRoutePath([])
    } finally {
      setIsRouting(false)
      if (routeControllerRef.current === controller) {
        routeControllerRef.current = null
      }
    }
  }

  useEffect(() => {
    return () => {
      routeControllerRef.current?.abort()
    }
  }, [])

  const handleRecenter = () => {
    setSelectedHospital(null)
    setRoutePath([])
    setMapTarget(userLocation)
    setLocationStatus('Live Location Active')
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-glass-lg">
      <MapContainer center={[mapTarget.lat, mapTarget.lng]} zoom={15} className="w-full h-full" zoomControl={true}>
        <MapViewportController target={mapTarget} animate={Boolean(selectedHospital) || routePath.length > 0} />
        <RouteViewportController route={routePath} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          eventHandlers={{
            load: () => setIsMapTilesReady(true),
          }}
        />

        {routePath.length > 1 && (
          <Polyline
            positions={routePath.map((point) => [point.lat, point.lng] as [number, number])}
            pathOptions={{ color: '#3b82f6', weight: 5, opacity: 0.85 }}
          />
        )}

        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="text-sm text-gray-800 font-medium">You are here</div>
          </Popup>
        </Marker>

        <MarkerClusterGroup
          chunkedLoading
          removeOutsideVisibleBounds
          maxClusterRadius={38}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
        >
          {visibleHospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.lat, hospital.lng]}
              icon={selectedHospital?.id === hospital.id ? highlightedHospitalIcon : hospitalIcon}
              eventHandlers={{
                click: () => {
                  setSelectedHospital(hospital)
                  setMapTarget({ lat: hospital.lat, lng: hospital.lng })
                },
              }}
            />
          ))}
        </MarkerClusterGroup>

        {selectedHospital && (
          <Popup
            position={[selectedHospital.lat, selectedHospital.lng]}
            closeButton={true}
            eventHandlers={{
              remove: () => setSelectedHospital(null),
            }}
          >
            <div className="px-1 py-1 text-dark-900 max-w-xs min-w-[210px]">
              <h3 className="font-bold text-base mb-1 text-gray-800">{selectedHospital.name}</h3>
              {selectedHospital.address && <p className="text-xs text-gray-600 mb-3">{selectedHospital.address}</p>}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                  {selectedHospital.distance}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavigateToHospital(selectedHospital)}
                  className="flex items-center justify-center gap-1 py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {isRouting ? 'Routing...' : 'Navigate'}
                </button>
                <button
                  onClick={() => handleBookAppointment(selectedHospital)}
                  className="flex items-center justify-center gap-1 py-2 px-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Book
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Popup>
        )}
      </MapContainer>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-[800]">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 z-10 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search hospitals"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              window.setTimeout(() => setShowSuggestions(false), 140)
            }}
            className="w-full pl-12 pr-4 py-3.5 bg-dark-800/90 backdrop-blur-md text-white border border-white/10 rounded-2xl shadow-glass focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-dark-400 font-medium"
          />

          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800/95 border border-white/10 rounded-xl shadow-glass backdrop-blur-md max-h-[250px] overflow-y-auto">
              {isHospitalsLoading ? (
                <div className="px-4 py-3 text-sm text-dark-300">Loading nearby hospitals...</div>
              ) : filteredHospitals.length > 0 ? (
                filteredHospitals.map((hospital) => (
                  <button
                    key={hospital.id}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectHospital(hospital)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                  >
                    <p className="text-sm text-white font-medium truncate">{hospital.name}</p>
                    {hospital.address && <p className="text-xs text-dark-300 truncate">{hospital.address}</p>}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-dark-300">No hospitals found</div>
              )}
            </div>
          )}
        </div>
      </div>

      {(!isMapTilesReady || isHospitalsLoading) && (
        <div className="absolute inset-0 z-[700] pointer-events-none bg-dark-900/45 backdrop-blur-[1px]">
          <div className="h-full w-full p-4 grid grid-cols-3 gap-2 animate-pulse opacity-70">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-white/10" />
            ))}
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-6 pointer-events-none z-[800]">
        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3 w-max max-w-full backdrop-blur-md shadow-lg pointer-events-auto">
          <MapPin className="w-5 h-5 text-primary-400 shrink-0" />
          <span className="text-sm text-white font-medium truncate">{locationStatus}</span>
          <div className="h-4 w-px bg-white/20 mx-1 shrink-0" />
          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs text-emerald-300 font-semibold px-2 py-0.5 bg-emerald-500/20 rounded-full shrink-0">
            Live
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 pointer-events-auto z-[800]">
        <button
          onClick={handleRecenter}
          className="w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-glass hover:scale-105 active:scale-95"
          title="Recenter Map"
        >
          <Navigation className="w-5 h-5 text-primary-400" />
        </button>
      </div>
    </div>
  )
}
