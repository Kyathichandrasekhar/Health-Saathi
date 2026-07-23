import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import { ArrowRight, Clock, MapPin, Navigation, Search, Star, Stethoscope, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MarkerClusterGroup from 'react-leaflet-cluster'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import { Doctor, SPECIALIZATIONS } from '../types/doctor'

interface MapViewProps {
  onHospitalsLoaded?: (hospitals: HospitalData[]) => void
  searchMode?: 'hospitals' | 'specialists'
  onSearchModeChange?: (mode: 'hospitals' | 'specialists') => void
  doctors?: Doctor[]
  selectedDoctor?: Doctor | null
  onSelectDoctor?: (doctor: Doctor | null) => void
  onSearchQueryChange?: (query: string) => void
  initialSearchQuery?: string
  isDoctorsLoading?: boolean
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
const SEARCH_RADIUS_METERS = 50000
const SEARCH_DEBOUNCE_MS = 220
const MIN_FETCH_MOVEMENT_KM = 0.3
const MIN_GEO_UPDATE_MOVEMENT_KM = 0.03
const MIN_GEO_UPDATE_INTERVAL_MS = 4000
const MAX_ACCEPTABLE_ACCURACY_METERS = 120
const MAX_COARSE_ACCURACY_WITHOUT_FIX_METERS = 2000
const MAX_REALISTIC_SPEED_KMH = 250
const FAST_NEARBY_RADIUS_METERS = 40000
const FAST_OVERPASS_TIMEOUT_SEC = 10
const MAX_VISIBLE_MARKERS = 600
const MAX_REVERSE_GEOCODE_ITEMS = 30
const MAX_HOSPITAL_RESULTS = 800
const INITIAL_HOSPITAL_RESULTS = 150

const TILE_SKELETON_MAX_MS = 500
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

const doctorIcon = L.divIcon({
  className: 'custom-doctor-dot',
  html: '<span style="display:block;width:18px;height:18px;border-radius:9999px;background:#10b981;border:2px solid #ffffff;box-shadow:0 0 0 8px rgba(16,185,129,0.35);"></span>',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const highlightedDoctorIcon = L.divIcon({
  className: 'custom-doctor-dot-selected',
  html: '<span style="display:block;width:22px;height:22px;border-radius:9999px;background:#059669;border:3px solid #ffffff;box-shadow:0 0 0 12px rgba(5,150,105,0.45);"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
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
        rating: Number.isFinite(Number(tags?.stars)) ? Number(tags?.stars) : 4.5,
        specialties: parseSpecialties(tags),
        eta: `${Math.max(4, Math.round((km / 25) * 60))} min`,
        availableDoctors: 5,
      } satisfies HospitalData
    })
    .filter((hospital): hospital is HospitalData => hospital !== null)

  rawHospitals.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))

  const uniqueHospitals: HospitalData[] = []

  for (const hospital of rawHospitals) {
    const isDuplicate = uniqueHospitals.some((existing) => {
      const n1 = existing.name.toLowerCase().replace(/hospital|clinic|care|centre|center|multi|speciality|super/g, '').trim()
      const n2 = hospital.name.toLowerCase().replace(/hospital|clinic|care|centre|center|multi|speciality|super/g, '').trim()
      const dist = calculateDistance(existing.lat, existing.lng, hospital.lat, hospital.lng)

      if (n1 && n2 && n1 === n2) return dist <= 8.0
      if (nameSimilarity(existing.name, hospital.name) >= 0.75) return dist <= 4.0
      if (existing.lat.toFixed(5) === hospital.lat.toFixed(5) && existing.lng.toFixed(5) === hospital.lng.toFixed(5)) return true

      return false
    })

    if (!isDuplicate) {
      uniqueHospitals.push(hospital)
    }
  }

  return uniqueHospitals.slice(0, MAX_HOSPITAL_RESULTS)
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

function MapView({
  onHospitalsLoaded,
  searchMode = 'hospitals',
  onSearchModeChange,
  doctors = [],
  selectedDoctor = null,
  onSelectDoctor,
  onSearchQueryChange,
  initialSearchQuery = '',
  isDoctorsLoading = false,
}: MapViewProps) {
  const navigate = useNavigate()

  const [mode, setMode] = useState<'hospitals' | 'specialists'>(searchMode)
  const [userLocation, setUserLocation] = useState<LatLng>(FALLBACK_LOCATION)
  const [locationStatus, setLocationStatus] = useState('Detecting your location...')
  const [isHospitalsLoading, setIsHospitalsLoading] = useState(true)
  const [isRouting, setIsRouting] = useState(false)
  const [searchInput, setSearchInput] = useState(initialSearchQuery)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | null>(null)
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(selectedDoctor)
  const [mapTarget, setMapTarget] = useState<LatLng>(FALLBACK_LOCATION)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [hospitals, setHospitals] = useState<HospitalData[]>([])
  const [routePath, setRoutePath] = useState<LatLng[]>([])
  const [isMapTilesReady, setIsMapTilesReady] = useState(false)
  const [showTileSkeleton, setShowTileSkeleton] = useState(true)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const lastFetchedLocationRef = useRef<LatLng | null>(null)
  const lastGeoUpdateRef = useRef<GeoFix | null>(null)
  const routeControllerRef = useRef<AbortController | null>(null)
  const hasCenteredRef = useRef(false)
  // Stable ref for user location — prevents distance re-computation during typing
  const userLocationRef = useRef<LatLng>(FALLBACK_LOCATION)
  // Pre-computed distance cache: doctorId → distance in km (computed once per location change)
  const doctorDistanceCacheRef = useRef<Map<string, number>>(new Map())

  // Sync prop mode changes
  useEffect(() => {
    setMode(searchMode)
  }, [searchMode])

  useEffect(() => {
    if (selectedDoctor) {
      setActiveDoctor(selectedDoctor)
      setMapTarget({ lat: selectedDoctor.latitude, lng: selectedDoctor.longitude })
    }
  }, [selectedDoctor])

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchInput(initialSearchQuery)
      setSearchQuery(initialSearchQuery)
    }
  }, [initialSearchQuery])

  // Keep userLocationRef in sync so distance calc reads stable value during typing
  useEffect(() => {
    userLocationRef.current = userLocation
  }, [userLocation])

  // Pre-compute all doctor distances whenever doctors list or user location changes.
  // This runs ONCE per location/doctors update — never during typing.
  useEffect(() => {
    const cache = new Map<string, number>()
    const { lat, lng } = userLocationRef.current
    for (const d of doctors) {
      cache.set(d.id, calculateDistance(lat, lng, d.latitude, d.longitude))
    }
    doctorDistanceCacheRef.current = cache
  }, [doctors, userLocation])

  const handleModeToggle = (newMode: 'hospitals' | 'specialists') => {
    setMode(newMode)
    onSearchModeChange?.(newMode)
    setShowSuggestions(false)
    if (newMode === 'specialists') {
      setSelectedHospital(null)
    } else {
      setActiveDoctor(null)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowTileSkeleton(false)
    }, TILE_SKELETON_MAX_MS)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const hosts = ['https://tile.openstreetmap.org', 'https://a.tile.openstreetmap.org']
    const createdLinks: HTMLLinkElement[] = []

    hosts.forEach((host) => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = host
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
      createdLinks.push(link)
    })

    return () => {
      createdLinks.forEach((link) => {
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }
      })
    }
  }, [])

  const readHospitalsFromCache = useCallback(() => {
    try {
      const raw = localStorage.getItem(HOSPITAL_CACHE_KEY)
      if (!raw) return [] as HospitalData[]
      const parsed = JSON.parse(raw) as { ts?: number; hospitals?: HospitalData[] }
      if (!Array.isArray(parsed?.hospitals)) return [] as HospitalData[]
      return parsed.hospitals
    } catch {
      return [] as HospitalData[]
    }
  }, [])

  const shouldAcceptGeoFix = useCallback((position: GeolocationPosition, previousFix: GeoFix | null) => {
    const accuracy = Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : Infinity
    const liveLoc = { lat: position.coords.latitude, lng: position.coords.longitude }

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
    lastGeoUpdateRef.current = { location, ts: Date.now(), accuracy }
    setUserLocation(location)
    setLocationStatus('Live Location Active')
  }, [])

  const handleSelectHospital = useCallback((hospital: HospitalData) => {
    setSelectedHospital(hospital)
    setActiveDoctor(null)
    setMapTarget({ lat: hospital.lat, lng: hospital.lng })
    setShowSuggestions(false)
  }, [])

  const handleSelectDoctorMarker = useCallback((doctor: Doctor) => {
    setActiveDoctor(doctor)
    setSelectedHospital(null)
    setMapTarget({ lat: doctor.latitude, lng: doctor.longitude })
    onSelectDoctor?.(doctor)
  }, [onSelectDoctor])

  const handleBookHospitalAppointment = useCallback((hospital: HospitalData) => {
    navigate('/booking', {
      state: { preSelectedHospital: hospital },
    })
  }, [navigate])

  const handleBookDoctorAppointment = useCallback((doctor: Doctor) => {
    navigate('/booking', {
      state: {
        preSelectedDoctor: doctor,
        preSelectedHospital: {
          id: doctor.hospitalId,
          name: doctor.hospitalName,
          address: doctor.hospitalName,
          lat: doctor.latitude,
          lng: doctor.longitude,
        },
        preSelectedSpecialization: doctor.specialization,
        preSelectedFee: doctor.consultationFee,
        preSelectedTime: doctor.availableSlots?.[0] || '10:00 AM',
      },
    })
  }, [navigate])

  // Load cached hospitals on mount
  useEffect(() => {
    const cachedHospitals = readHospitalsFromCache()
    if (cachedHospitals.length > 0) {
      setHospitals(cachedHospitals.slice(0, MAX_HOSPITAL_RESULTS))
      setIsHospitalsLoading(false)
      setLocationStatus((current) =>
        current === 'Detecting your location...' ? 'Loading live nearby hospitals...' : current,
      )
    } else {
      const earlyController = new AbortController()
      fetchOverpassWithFallback(
        buildOverpassQuery(FALLBACK_LOCATION, FAST_NEARBY_RADIUS_METERS, FAST_OVERPASS_TIMEOUT_SEC, true),
        earlyController.signal,
      )
        .then((data) => {
          const earlyHospitals = normalizeOverpassHospitals(data.elements, FALLBACK_LOCATION)
          if (earlyHospitals.length > 0) {
            setHospitals((current) =>
              current.length === 0 ? earlyHospitals.slice(0, INITIAL_HOSPITAL_RESULTS) : current,
            )
            setIsHospitalsLoading(false)
          }
        })
        .catch(() => {})
      return () => earlyController.abort()
    }
  }, [readHospitalsFromCache])

  // Geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation(FALLBACK_LOCATION)
      setMapTarget(FALLBACK_LOCATION)
      setLocationStatus('Live location unavailable, showing Vijayawada')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const check = shouldAcceptGeoFix(position, lastGeoUpdateRef.current)
        if (!check.accepted) {
          setLocationStatus('Waiting for precise GPS fix...')
          return
        }
        applyAcceptedGeoFix(check.location, check.accuracy)
        if (!hasCenteredRef.current) {
          setMapTarget(check.location)
          hasCenteredRef.current = true
          return
        }
        if (!selectedHospital && !activeDoctor && routePath.length === 0) {
          setMapTarget(check.location)
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    )

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const check = shouldAcceptGeoFix(position, lastGeoUpdateRef.current)
        if (!check.accepted) {
          if (!lastGeoUpdateRef.current) setLocationStatus('Waiting for precise GPS fix...')
          return
        }
        applyAcceptedGeoFix(check.location, check.accuracy)
        if (!hasCenteredRef.current) {
          setMapTarget(check.location)
          hasCenteredRef.current = true
          return
        }
        if (!selectedHospital && !activeDoctor && routePath.length === 0) {
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
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [applyAcceptedGeoFix, activeDoctor, routePath.length, selectedHospital, shouldAcceptGeoFix])

  useEffect(() => {
    if (!hospitals.length) return
    try {
      localStorage.setItem(HOSPITAL_CACHE_KEY, JSON.stringify({ ts: Date.now(), hospitals }))
    } catch {}
  }, [hospitals])

  useEffect(() => {
    // Local filter debounce: 300ms — only updates searchQuery (used for filtering, NOT passed to parent)
    const filterTimer = window.setTimeout(() => {
      setSearchQuery(searchInput.trim())
    }, 300)

    // Parent notification debounce: 600ms — delays Home.tsx re-render until user pauses longer
    const parentTimer = window.setTimeout(() => {
      onSearchQueryChange?.(searchInput.trim())
    }, 600)

    return () => {
      window.clearTimeout(filterTimer)
      window.clearTimeout(parentTimer)
    }
  }, [searchInput, onSearchQueryChange])

  // Overpass fetch
  useEffect(() => {
    const shouldFetch = () => {
      const lastLocation = lastFetchedLocationRef.current
      if (!lastLocation) return true
      const movedKm = calculateDistance(lastLocation.lat, lastLocation.lng, userLocation.lat, userLocation.lng)
      return movedKm >= MIN_FETCH_MOVEMENT_KM
    }

    if (!shouldFetch()) return

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
          const immediateHospitals = fastHospitals.slice(0, INITIAL_HOSPITAL_RESULTS)
          if (fastHospitals.length > 0) {
            hasFastResult = true
            setHospitals((current) => (hasHospitalListChanged(current, immediateHospitals) ? immediateHospitals : current))
          }
        } catch {}

        const overpassData = await fetchOverpassWithFallback(buildOverpassQuery(userLocation), controller.signal)
        const nearestHospitals = normalizeOverpassHospitals(overpassData.elements, userLocation)
        setHospitals((current) => (hasHospitalListChanged(current, nearestHospitals) ? nearestHospitals : current))

        const missingAddressIds = new Set(
          nearestHospitals.filter((h) => !h.address).slice(0, MAX_REVERSE_GEOCODE_ITEMS).map((h) => h.id),
        )

        const withResolvedAddresses = await Promise.all(
          nearestHospitals.map(async (hospital) => {
            if (hospital.address || !missingAddressIds.has(hospital.id)) return hospital
            const reverseAddress = await reverseGeocodeAddress(hospital.lat, hospital.lng)
            return { ...hospital, address: reverseAddress || '' }
          }),
        )

        withResolvedAddresses.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
        setHospitals((current) => (hasHospitalListChanged(current, withResolvedAddresses) ? withResolvedAddresses : current))
        lastFetchedLocationRef.current = userLocation
      } catch {
        setLocationStatus((current) =>
          current === 'Live Location Active' ? 'Live Location Active (hospital data temporarily unavailable)' : current,
        )
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

  // Hospital filter
  const filteredHospitals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return hospitals.slice(0, 30)

    const queryWords = q.split(/\s+/).filter(Boolean)
    return hospitals
      .map((hospital) => {
        const name = hospital.name.toLowerCase().trim()
        const address = (hospital.address || '').toLowerCase().trim()
        const specs = (hospital.specialties || []).join(' ').toLowerCase()
        let score = 0
        if (name.includes(q)) score += 10
        if (name.startsWith(q)) score += 5
        for (const word of queryWords) {
          if (name.includes(word)) score += 3
        }
        if (address.includes(q)) score += 2
        if (specs.includes(q)) score += 2
        return { hospital, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || parseFloat(a.hospital.distance) - parseFloat(b.hospital.distance))
      .map((item) => item.hospital)
  }, [hospitals, searchQuery])

  // ── Specialist suggestion list: filtered + sorted + distance-enriched ──────
  // Uses pre-computed doctorDistanceCacheRef — never re-computes distance while typing.
  const doctorSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const distCache = doctorDistanceCacheRef.current

    const matchedSpecs = !q
      ? SPECIALIZATIONS.slice(0, 8)
      : SPECIALIZATIONS.filter((spec) => spec.toLowerCase().includes(q))

    const pool = !q ? doctors : doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        d.qualification.toLowerCase().includes(q) ||
        d.hospitalName.toLowerCase().includes(q),
    )

    // Sort: nearest → higher rating → available today → lower fee
    const sorted = [...pool].sort((a, b) => {
      const distA = distCache.get(a.id) ?? calculateDistance(userLocationRef.current.lat, userLocationRef.current.lng, a.latitude, a.longitude)
      const distB = distCache.get(b.id) ?? calculateDistance(userLocationRef.current.lat, userLocationRef.current.lng, b.latitude, b.longitude)
      if (Math.abs(distA - distB) > 0.3) return distA - distB       // nearest first
      if (b.rating !== a.rating) return b.rating - a.rating           // higher rating
      const availA = a.availableToday ? 0 : 1
      const availB = b.availableToday ? 0 : 1
      if (availA !== availB) return availA - availB                    // available today
      return a.consultationFee - b.consultationFee                     // lower fee
    })

    return { specializations: matchedSpecs, matchingDoctors: sorted }
  }, [doctors, searchQuery])

  const visibleHospitals = useMemo(() => {
    const source = searchQuery && mode === 'hospitals' ? filteredHospitals : hospitals
    return source.slice(0, MAX_VISIBLE_MARKERS)
  }, [filteredHospitals, hospitals, mode, searchQuery])

  // sortedDoctors for map markers — only re-sorts when doctors array or location changes (NOT on typing)
  const sortedDoctors = useMemo(() => {
    const distCache = doctorDistanceCacheRef.current
    return [...doctors].sort((a, b) => {
      const distA = distCache.get(a.id) ?? 0
      const distB = distCache.get(b.id) ?? 0
      return distA - distB
    })
  }, [doctors, userLocation])

  const handleNavigateToTarget = async (lat: number, lng: number) => {
    const controller = new AbortController()
    try {
      setIsRouting(true)
      routeControllerRef.current?.abort()
      routeControllerRef.current = controller
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${lng},${lat}?overview=full&geometries=geojson`,
        { signal: controller.signal },
      )

      if (!response.ok) throw new Error('Route fetch failed')
      const data = (await response.json()) as OsrmRouteResponse
      const coordinates = data.routes?.[0]?.geometry?.coordinates || []
      const path = coordinates.map(([l1, l2]) => ({ lat: l2, lng: l1 }))
      if (path.length > 1) {
        setRoutePath(path)
      }
      setMapTarget({ lat, lng })
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
    setActiveDoctor(null)
    setRoutePath([])
    setMapTarget(userLocation)
    setLocationStatus('Live Location Active')
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-glass-lg">
      <MapContainer
        center={[mapTarget.lat, mapTarget.lng]}
        zoom={15}
        className="w-full h-full z-0"
        zoomControl={true}
        preferCanvas={true}
      >
        <MapViewportController
          target={mapTarget}
          animate={Boolean(selectedHospital) || Boolean(activeDoctor) || routePath.length > 0}
        />
        <RouteViewportController route={routePath} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

        {/* User Location Marker */}
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="text-sm text-gray-800 font-medium">You are here</div>
          </Popup>
        </Marker>

        {/* Hospital Markers */}
        <MarkerClusterGroup
          chunkedLoading
          chunkInterval={120}
          chunkDelay={0}
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
                  setActiveDoctor(null)
                  setMapTarget({ lat: hospital.lat, lng: hospital.lng })
                },
              }}
            />
          ))}

          {/* Doctor Markers (Higher Priority) */}
          {mode === 'specialists' &&
            sortedDoctors.map((docItem) => (
              <Marker
                key={`doc-marker-${docItem.id}`}
                position={[docItem.latitude, docItem.longitude]}
                icon={activeDoctor?.id === docItem.id ? highlightedDoctorIcon : doctorIcon}
                eventHandlers={{
                  click: () => handleSelectDoctorMarker(docItem),
                }}
              />
            ))}
        </MarkerClusterGroup>

        {/* Hospital Selected Popup */}
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
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${selectedHospital.lat},${selectedHospital.lng}`
                    window.open(url, '_blank')
                    handleNavigateToTarget(selectedHospital.lat, selectedHospital.lng)
                  }}
                  className="flex items-center justify-center gap-1 py-2 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Navigate
                </button>
                <button
                  onClick={() => handleBookHospitalAppointment(selectedHospital)}
                  className="flex items-center justify-center gap-1 py-2 px-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Book Now
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Popup>
        )}

        {/* Doctor Selected Popup (Step 8) */}
        {activeDoctor && (
          <Popup
            position={[activeDoctor.latitude, activeDoctor.longitude]}
            closeButton={true}
            eventHandlers={{
              remove: () => setActiveDoctor(null),
            }}
          >
            <div className="px-1 py-1 text-dark-900 max-w-xs min-w-[240px]">
              <div className="flex items-start gap-2.5 mb-2">
                <img
                  src={activeDoctor.profileImage}
                  alt={activeDoctor.name}
                  className="w-10 h-10 rounded-lg object-cover border shrink-0"
                />
                <div>
                  <h3 className="font-bold text-sm text-gray-900 leading-tight">{activeDoctor.name}</h3>
                  <p className="text-xs font-semibold text-emerald-700">{activeDoctor.specialization}</p>
                  <p className="text-[11px] text-gray-600 truncate">{activeDoctor.hospitalName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-2 gap-y-1 my-2 py-1.5 border-y border-gray-100 text-[11px] text-gray-700">
                <div>
                  <span className="text-gray-500">Rating:</span>{' '}
                  <span className="font-bold text-amber-600">★ {activeDoctor.rating.toFixed(1)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Exp:</span>{' '}
                  <span className="font-bold text-gray-800">{activeDoctor.experience}+ yrs</span>
                </div>
                <div>
                  <span className="text-gray-500">Fee:</span>{' '}
                  <span className="font-bold text-emerald-700">₹{activeDoctor.consultationFee}</span>
                </div>
                <div>
                  <span className="text-gray-500">Available:</span>{' '}
                  <span className="font-semibold text-blue-700">{activeDoctor.availability}</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-500 mb-2 font-medium">
                Distance:{' '}
                {calculateDistance(userLocation.lat, userLocation.lng, activeDoctor.latitude, activeDoctor.longitude).toFixed(1)}{' '}
                km
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${activeDoctor.latitude},${activeDoctor.longitude}`
                    window.open(url, '_blank')
                    handleNavigateToTarget(activeDoctor.latitude, activeDoctor.longitude)
                  }}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Navigate
                </button>

                <button
                  onClick={() => handleBookDoctorAppointment(activeDoctor)}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  Book Appt
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </Popup>
        )}
      </MapContainer>

      {/* Top Search Controls with Segmented Mode Toggle (Step 1, 3) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md z-[800]">
        <div className="flex items-center justify-center p-1 bg-dark-900/90 backdrop-blur-md rounded-2xl border border-white/10 mb-2 shadow-glass">
          <button
            type="button"
            onClick={() => handleModeToggle('hospitals')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              mode === 'hospitals'
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                : 'text-dark-300 hover:text-white'
            }`}
          >
            Hospitals
          </button>

          <button
            type="button"
            onClick={() => handleModeToggle('specialists')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              mode === 'specialists'
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                : 'text-dark-300 hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            Specialists
          </button>
        </div>

        {/* Input Box */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 z-10 pointer-events-none" />
          <input
            id="hospital-search-input"
            ref={searchInputRef}
            type="text"
            placeholder={mode === 'hospitals' ? 'Search hospitals nearby...' : 'Search doctors or specialists...'}
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              window.setTimeout(() => setShowSuggestions(false), 180)
            }}
            className="w-full pl-12 pr-4 py-3 bg-dark-800/95 backdrop-blur-md text-white border border-white/10 rounded-2xl shadow-glass focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all placeholder:text-dark-400 font-medium text-sm"
          />

          {/* Suggestions Dropdown (Step 3) */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-dark-800/95 border border-white/10 rounded-2xl shadow-glass backdrop-blur-md max-h-[320px] overflow-y-auto z-[900] divide-y divide-white/5">
              {mode === 'hospitals' ? (
                /* Hospital Autocomplete */
                isHospitalsLoading && hospitals.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-dark-300 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                    Discovering nearby hospitals...
                  </div>
                ) : filteredHospitals.length > 0 ? (
                  filteredHospitals.slice(0, 15).map((hospital) => (
                    <button
                      key={hospital.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectHospital(hospital)}
                      className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white font-medium truncate flex-1">{hospital.name}</p>
                        <span className="text-xs text-dark-400 ml-2 shrink-0">{hospital.distance}</span>
                      </div>
                      {hospital.address && <p className="text-xs text-dark-300 truncate mt-0.5">{hospital.address}</p>}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-dark-300">No match for "{searchQuery}"</div>
                )
              ) : searchInput !== searchQuery || isDoctorsLoading ? (
                /* Specialist Search Loading State */
                <div className="p-4 flex items-center gap-3 text-sm text-dark-300">
                  <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  {isDoctorsLoading ? 'Loading specialists data...' : `Searching for ${searchInput}...`}
                </div>
              ) : (
                /* Specialist Mode Autocomplete (Step 3: 14 Specializations + Doctors) */
                <>
                  {doctorSuggestions.specializations.length > 0 && (
                    <div className="p-2">
                      <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-400">
                        Specializations
                      </p>
                      {doctorSuggestions.specializations.map((spec) => (
                        <button
                          key={spec}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSearchInput(spec)
                            setSearchQuery(spec)
                            setShowSuggestions(false)
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-primary-500/10 rounded-xl transition-colors text-sm text-white flex items-center gap-2 font-medium"
                        >
                          <Stethoscope className="w-4 h-4 text-emerald-400" />
                          <span>{spec}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {doctorSuggestions.matchingDoctors.length > 0 && (
                    <div className="p-2">
                      <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary-400">
                        Doctors
                      </p>
                      {doctorSuggestions.matchingDoctors.slice(0, 10).map((docItem) => {
                        const distKm = doctorDistanceCacheRef.current.get(docItem.id)
                        const distLabel = distKm !== undefined ? `${distKm.toFixed(1)} km away` : 'Nearby'
                        return (
                          <button
                            key={docItem.id}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelectDoctorMarker(docItem)}
                            className="w-full text-left px-3 py-2.5 hover:bg-white/5 rounded-xl transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={docItem.profileImage}
                                alt={docItem.name}
                                className="w-9 h-9 rounded-lg object-cover border border-white/10 shrink-0 mt-0.5"
                                onError={(e) => {
                                  ;(e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                {/* Row 1: Name + availability badge */}
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-white truncate leading-tight">
                                    {docItem.name}
                                  </p>
                                  {docItem.availableToday && (
                                    <span className="shrink-0 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold leading-none">
                                      Today
                                    </span>
                                  )}
                                </div>
                                {/* Row 2: Specialization */}
                                <p className="text-xs text-primary-300 font-semibold mt-0.5 truncate">
                                  {docItem.specialization}
                                </p>
                                {/* Row 3: Hospital */}
                                <p className="text-[11px] text-dark-300 truncate flex items-center gap-1 mt-0.5">
                                  <span className="opacity-70">🏥</span>
                                  {docItem.hospitalName}
                                </p>
                                {/* Row 4: Distance · Rating · Fee */}
                                <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
                                  <span className="flex items-center gap-0.5 text-[11px] text-cyan-300 font-semibold">
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    {distLabel}
                                  </span>
                                  <span className="flex items-center gap-0.5 text-[11px] text-yellow-400 font-semibold">
                                    <Star className="w-3 h-3 shrink-0 fill-yellow-400" />
                                    {docItem.rating.toFixed(1)}
                                  </span>
                                  <span className="text-[11px] text-emerald-400 font-bold">
                                    ₹{docItem.consultationFee}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {doctorSuggestions.specializations.length === 0 && doctorSuggestions.matchingDoctors.length === 0 && (
                    <div className="px-4 py-3 text-sm text-dark-300">No doctors or specialists found matching "{searchQuery}"</div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map Tile Loading Overlay */}
      {!isMapTilesReady && showTileSkeleton && (
        <div className="absolute inset-0 z-[700] pointer-events-none bg-dark-900/45 backdrop-blur-[1px]">
          <div className="h-full w-full p-4 grid grid-cols-3 gap-2 animate-pulse opacity-70">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-white/10" />
            ))}
          </div>
        </div>
      )}

      {/* Status Bar */}
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

      {/* Recenter Button */}
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

export default memo(MapView)
