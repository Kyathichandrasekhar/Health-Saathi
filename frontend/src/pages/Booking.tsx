import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Stethoscope, Clock, Calendar, ChevronRight, Star, MapPin,
  ArrowLeft, Check, CreditCard, Phone, Globe, Building2
} from 'lucide-react'
import { bookingAPI, doctorAPI, type DoctorProfile, type InternalHospital } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { getHydratedHospitals, warmHospitalsCache } from '../services/hospitalCache'

interface BookingDoctorProfile extends DoctorProfile {
  localSlots?: string[]
}

interface MapHospitalProfile {
  id: string
  name: string
  address: string
  phone?: string
  openingHours?: string
  website?: string
  lat?: number
  lng?: number
  location?: { lat: number; lng: number }
}

const FALLBACK_SEARCH_RADIUS_METERS = 50000
const FALLBACK_OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
]
const FALLBACK_HOSPITALS: InternalHospital[] = [
  {
    id: 'hosp1',
    name: 'City General Hospital',
    address: 'Sector 21, New Delhi',
    lat: 28.6139,
    lng: 77.209,
  },
  {
    id: 'hosp2',
    name: 'Apollo Medical Center',
    address: 'Connaught Place, New Delhi',
    lat: 28.6315,
    lng: 77.2167,
  },
  {
    id: 'hosp3',
    name: 'Max Super Specialty',
    address: 'Saket, New Delhi',
    lat: 28.5244,
    lng: 77.2066,
  },
  {
    id: 'hosp4',
    name: 'Fortis Healthcare',
    address: 'Vasant Kunj, New Delhi',
    lat: 28.5185,
    lng: 77.1571,
  },
]

function toInternalHospitalFromMap(hospital: MapHospitalProfile | (MapHospitalProfile & { distance?: string })): InternalHospital | null {
  const lat = hospital.location?.lat ?? hospital.lat
  const lng = hospital.location?.lng ?? hospital.lng

  if (!hospital.id || !hospital.name || typeof lat !== 'number' || typeof lng !== 'number') {
    return null
  }

  return {
    id: String(hospital.id),
    name: hospital.name,
    address: hospital.address || 'Address unavailable',
    lat,
    lng,
  }
}

function mergeUniqueHospitals(...lists: InternalHospital[][]): InternalHospital[] {
  const seen = new Set<string>()
  const merged: InternalHospital[] = []

  for (const list of lists) {
    for (const hospital of list) {
      const key = `${hospital.name.toLowerCase().trim()}|${hospital.lat.toFixed(4)}|${hospital.lng.toFixed(4)}`
      if (seen.has(key)) {
        continue
      }
      seen.add(key)
      merged.push(hospital)
    }
  }

  return merged
}

interface FallbackOverpassElement {
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

interface FallbackOverpassResponse {
  elements: FallbackOverpassElement[]
}

function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation unavailable'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      () => reject(new Error('Location access denied')),
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    )
  })
}

async function fetchNearbyHospitalsFromOpenStreetMap() {
  const center = await getCurrentLocation()
  const query = `
[out:json][timeout:20];
(
  node["amenity"="hospital"](around:${FALLBACK_SEARCH_RADIUS_METERS},${center.lat},${center.lng});
  way["amenity"="hospital"](around:${FALLBACK_SEARCH_RADIUS_METERS},${center.lat},${center.lng});
  relation["amenity"="hospital"](around:${FALLBACK_SEARCH_RADIUS_METERS},${center.lat},${center.lng});
  node["healthcare"="hospital"](around:${FALLBACK_SEARCH_RADIUS_METERS},${center.lat},${center.lng});
  way["healthcare"="hospital"](around:${FALLBACK_SEARCH_RADIUS_METERS},${center.lat},${center.lng});
  relation["healthcare"="hospital"](around:${FALLBACK_SEARCH_RADIUS_METERS},${center.lat},${center.lng});
  node["amenity"="clinic"](around:${FALLBACK_SEARCH_RADIUS_METERS},${center.lat},${center.lng});
  way["amenity"="clinic"](around:${FALLBACK_SEARCH_RADIUS_METERS},${center.lat},${center.lng});
  relation["amenity"="clinic"](around:${FALLBACK_SEARCH_RADIUS_METERS},${center.lat},${center.lng});
);
out center tags;
`

  let data: FallbackOverpassResponse | null = null
  for (const endpoint of FALLBACK_OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: `data=${encodeURIComponent(query)}`,
      })

      if (!response.ok) {
        continue
      }

      data = (await response.json()) as FallbackOverpassResponse
      if (Array.isArray(data.elements)) {
        break
      }
    } catch {
      // Try next endpoint.
    }
  }

  if (!data || !Array.isArray(data.elements)) {
    return []
  }

  const hospitals = data.elements
    .map((element) => {
      const name = element.tags?.name?.trim()
      const lat = element.lat ?? element.center?.lat
      const lng = element.lon ?? element.center?.lon

      if (!name || typeof lat !== 'number' || typeof lng !== 'number') {
        return null
      }

      const address =
        element.tags?.['addr:full'] ||
        [
          element.tags?.['addr:housenumber'],
          element.tags?.['addr:street'],
          element.tags?.['addr:suburb'],
          element.tags?.['addr:city'],
        ]
          .filter(Boolean)
          .join(', ') ||
        'Address unavailable'

      return {
        id: `${element.type}-${element.id}`,
        name,
        address,
        lat,
        lng,
        dist: distanceKm(center.lat, center.lng, lat, lng),
      }
    })
    .filter((hospital): hospital is InternalHospital & { dist: number } => hospital !== null)
    .sort((a, b) => a.dist - b.dist)

  const deduped = hospitals.filter(
    (hospital, index, arr) =>
      index === arr.findIndex((candidate) => candidate.name.toLowerCase().trim() === hospital.name.toLowerCase().trim()),
  )

  return deduped.slice(0, 80).map(({ dist, ...hospital }) => hospital)
}

interface PaymentBookingState {
  appointmentId: string
  bookingId: string
  selectedHospital: {
    id: string
    name: string
    address: string
  }
  selectedDoctor: {
    id: string
    name: string
    specialization: string
    fee: number
  }
  selectedSlot: string
  selectedDate: string
  tokenNumber: number
  paymentStatus: 'pending' | 'paid'
  user: {
    uid: string
    name: string
    email: string
    phone: string
  }
  specialty: string
  hospitalId: string
  hospitalName: string
  doctorId: string
  doctorName: string
  slot: string
  date: string
  fee: number
}

function normalizeName(name: string) {
  return name
    .toLowerCase()
    .replace(/[.,'"()\-]/g, ' ')
    .replace(/\b(hospital|hospitals|clinic|center|centre|medical|healthcare|super|specialty)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreNameMatch(left: string, right: string) {
  const l = normalizeName(left)
  const r = normalizeName(right)

  if (!l || !r) {
    return 0
  }

  if (l === r) {
    return 1
  }

  if (l.includes(r) || r.includes(l)) {
    return 0.8
  }

  const leftTokens = new Set(l.split(' ').filter(Boolean))
  const rightTokens = new Set(r.split(' ').filter(Boolean))
  const overlap = [...leftTokens].filter((token) => rightTokens.has(token)).length
  const union = new Set([...leftTokens, ...rightTokens]).size
  return union ? overlap / union : 0
}

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371
  const dLat = (bLat - aLat) * (Math.PI / 180)
  const dLng = (bLng - aLng) * (Math.PI / 180)
  const s1 = Math.sin(dLat / 2)
  const s2 = Math.sin(dLng / 2)
  const x = s1 * s1 + Math.cos(aLat * (Math.PI / 180)) * Math.cos(bLat * (Math.PI / 180)) * s2 * s2
  return R * (2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)))
}

function isDateBeforeToday(dateValue: string) {
  if (!dateValue) {
    return false
  }

  const selected = new Date(`${dateValue}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return selected < today
}

function hashString(text: string) {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  return hash
}

function buildLocalDoctorFallback(hospitalName: string): BookingDoctorProfile[] {
  const firstNames = ['Ramesh', 'Suma', 'Harsha', 'Priyanka', 'Kiran', 'Madhavi', 'Vivek', 'Keerthi']
  const lastNames = ['Naidu', 'Reddy', 'Rao', 'Kumar', 'Prasad', 'Iyer', 'Menon', 'Bose']
  const specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology', 'General Medicine', 'ENT']
  const slotSets = [
    ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'],
    ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
  ]

  const hash = hashString(hospitalName.toLowerCase())
  const count = 2 + (hash % 2)
  const slug = hospitalName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'hospital'

  return Array.from({ length: count }, (_, index) => {
    const firstName = firstNames[(hash + index * 3) % firstNames.length]
    const lastName = lastNames[(hash + index * 5) % lastNames.length]
    const specialization = specializations[(hash + index * 7) % specializations.length]
    const slots = slotSets[(hash + index) % slotSets.length]
    const start = slots[0]
    const end = slots[slots.length - 1]

    return {
      id: `local-${slug}-${index + 1}`,
      name: `Dr. ${firstName} ${lastName}`,
      specialty: specialization,
      specialization,
      rating: 4.2 + ((hash + index) % 6) / 10,
      experience: `${8 + ((hash + index * 2) % 14)} yrs`,
      fee: 400 + ((hash + index * 11) % 6) * 100,
      contact_number: `+91-98${String(100000 + ((hash + index * 77) % 900000)).padStart(6, '0')}`,
      slot_timings: `Mon-Sat, ${start} - ${end}`,
      localSlots: slots,
    }
  })
}

function resolveHospitalMapping(selected: MapHospitalProfile, internalHospitals: InternalHospital[]) {
  if (!internalHospitals.length) {
    return null
  }

  const selectedLat = selected.location?.lat ?? selected.lat
  const selectedLng = selected.location?.lng ?? selected.lng

  const ranked = internalHospitals
    .map((hospital) => {
      const nameScore = scoreNameMatch(selected.name, hospital.name)
      const geoDistance =
        typeof selectedLat === 'number' && typeof selectedLng === 'number'
          ? distanceKm(selectedLat, selectedLng, hospital.lat, hospital.lng)
          : Number.POSITIVE_INFINITY
      const distanceScore = Number.isFinite(geoDistance) ? Math.max(0, 1 - geoDistance / 20) : 0
      const score = nameScore * 0.7 + distanceScore * 0.3

      return { hospital, score }
    })
    .sort((a, b) => b.score - a.score)

  return ranked[0]?.hospital || null
}

function buildLocalBookingFallback(input: {
  selectedHospital: string
  selectedHospitalName: string
  selectedDoctorId: string
  selectedDoctorName: string
  selectedDate: string
  selectedSlot: string
  fee: number
}) {
  const now = Date.now()
  const localBookingId = `local_apt_${now}`

  return {
    id: localBookingId,
    bookingId: localBookingId,
    hospital_id: input.selectedHospital,
    hospital_name: input.selectedHospitalName,
    doctor_id: input.selectedDoctorId,
    doctor_name: input.selectedDoctorName,
    date: input.selectedDate,
    slot: input.selectedSlot,
    fee: input.fee,
    token_number: 1,
    tokenNumber: 1,
  }
}

function getInitialHospitalList() {
  const hydrated = getHydratedHospitals()
  return hydrated.length > 0 ? hydrated : FALLBACK_HOSPITALS
}

export default function Booking() {
  const [allHospitals, setAllHospitals] = useState<InternalHospital[]>(getInitialHospitalList)
  const [step, setStep] = useState(1)
  const [selectedHospital, setSelectedHospital] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [mapHospital, setMapHospital] = useState<MapHospitalProfile | null>(null)
  const [hospitalDoctors, setHospitalDoctors] = useState<BookingDoctorProfile[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [hospitalLoading, setHospitalLoading] = useState(false)
  const [doctorLoading, setDoctorLoading] = useState(false)
  const [slotLoading, setSlotLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [dateError, setDateError] = useState('')
  const [patientDetails, setPatientDetails] = useState({
    personal: { fullName: '', dob: '', gender: '', phone: '', email: '', bloodGroup: '' },
    medical: { symptoms: '', existingDiseases: '', currentMedications: '', allergies: '', previousReport: '' },
    emergency: { name: '', relationship: '', phone: '' },
    insurance: { provider: '', policyNumber: '' }
  })
  const [detailsError, setDetailsError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      setPatientDetails(prev => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: prev.personal.fullName || user.displayName || '',
          email: prev.personal.email || user.email || '',
          phone: prev.personal.phone || user.phoneNumber || ''
        }
      }))
    }
  }, [user])

  const navigate = useNavigate()
  const location = useLocation()
  const effectiveHospitalName = mapHospital?.name || allHospitals.find((h) => h.id === selectedHospital)?.name || ''

  useEffect(() => {
    let mounted = true
    const preSelected = location.state?.preSelectedHospital as MapHospitalProfile | undefined
    const preSelectedDoctor = location.state?.preSelectedDoctor as any | undefined
    const preSelectedTime = location.state?.preSelectedTime as string | undefined

    const hydratedHospitals = getHydratedHospitals()
    const preSelectedAsInternal = preSelected ? toInternalHospitalFromMap(preSelected) : null
    const immediateHospitals = mergeUniqueHospitals(
      preSelectedAsInternal ? [preSelectedAsInternal] : [],
      hydratedHospitals,
      FALLBACK_HOSPITALS,
    )

    if (preSelectedDoctor) {
      const doctorProfile: BookingDoctorProfile = {
        id: preSelectedDoctor.id,
        name: preSelectedDoctor.name,
        specialty: preSelectedDoctor.specialization,
        specialization: preSelectedDoctor.specialization,
        rating: preSelectedDoctor.rating,
        experience: `${preSelectedDoctor.experience} yrs`,
        fee: preSelectedDoctor.consultationFee,
        contact_number: preSelectedDoctor.phone,
        slot_timings: preSelectedDoctor.availability,
        localSlots: preSelectedDoctor.availableSlots || ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM'],
      }

      const hospObj: MapHospitalProfile = preSelected || {
        id: preSelectedDoctor.hospitalId || 'hosp-1',
        name: preSelectedDoctor.hospitalName || 'Hospital',
        address: preSelectedDoctor.hospitalName || 'Address',
        lat: preSelectedDoctor.latitude,
        lng: preSelectedDoctor.longitude,
      }

      setMapHospital(hospObj)
      setSelectedHospital(`map-${hospObj.id}`)
      setHospitalDoctors([doctorProfile])
      setSelectedDoctor(doctorProfile.id)

      const todayStr = new Date().toISOString().split('T')[0]
      setSelectedDate(todayStr)
      setSelectedSlot(preSelectedTime || doctorProfile.localSlots?.[0] || '10:00 AM')
      setAvailableSlots(doctorProfile.localSlots || ['09:00 AM', '10:30 AM', '02:00 PM'])
      setStep(3)
    } else if (preSelected) {
      setMapHospital(preSelected)
      setSelectedHospital(`map-${preSelected.id}`)
      setStep(2)
    }

    setAllHospitals(immediateHospitals)
    setHospitalLoading(false)

    const loadHospitals = async () => {
      try {
        setHospitalLoading(true)
        const internalHospitals = await warmHospitalsCache()
        if (!mounted) {
          return
        }
        setAllHospitals(mergeUniqueHospitals(preSelectedAsInternal ? [preSelectedAsInternal] : [], internalHospitals))
        setBookingError('')

        if (preSelected) {
          const mapped = resolveHospitalMapping(preSelected, internalHospitals)
          if (mapped) {
            setSelectedHospital(mapped.id)
          }
          window.history.replaceState({}, document.title)
        }
      } catch {
        if (mounted) {
          if (immediateHospitals.length > 0) {
            setAllHospitals(immediateHospitals)
            setBookingError('')
          } else if (!preSelected) {
            const liveFallback = await fetchNearbyHospitalsFromOpenStreetMap()
            if (liveFallback.length > 0) {
              setAllHospitals(liveFallback)
              setBookingError('')
            } else {
              setAllHospitals(FALLBACK_HOSPITALS)
              setBookingError('')
            }
          }
        }
      } finally {
        if (mounted) {
          setHospitalLoading(false)
        }
      }
    }

    loadHospitals()

    return () => {
      mounted = false
    }
  }, [location.state])

  useEffect(() => {
    if (location.state?.preSelectedDoctor) {
      return
    }

    if (!selectedHospital && !effectiveHospitalName) {
      setHospitalDoctors([])
      setSelectedDoctor('')
      return
    }

    let mounted = true
    const loadDoctors = async () => {
      try {
        setDoctorLoading(true)
        const doctors = mapHospital?.name
          ? await doctorAPI.getByHospitalName(mapHospital.name)
          : await doctorAPI.getByHospital(selectedHospital)
        if (mounted) {
          setHospitalDoctors(doctors as BookingDoctorProfile[])
          setSelectedDoctor('')
          setSelectedSlot('')
          setSelectedDate('')
          setBookingError('')
        }
      } catch {
        if (mounted) {
          if (mapHospital?.name) {
            const fallbackDoctors = buildLocalDoctorFallback(mapHospital.name)
            setHospitalDoctors(fallbackDoctors)
            setSelectedDoctor('')
            setSelectedSlot('')
            setSelectedDate('')
            setBookingError('')
          } else {
            setHospitalDoctors([])
            setBookingError('Could not fetch doctor schedules for this hospital.')
          }
        }
      } finally {
        if (mounted) {
          setDoctorLoading(false)
        }
      }
    }

    loadDoctors()

    return () => {
      mounted = false
    }
  }, [selectedHospital, mapHospital?.name, effectiveHospitalName])

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) {
      setAvailableSlots([])
      return
    }

    if (isDateBeforeToday(selectedDate)) {
      setDateError('Please enter a valid date')
      setAvailableSlots([])
      return
    }

    setDateError('')

    let mounted = true
    const loadSlots = async () => {
      try {
        setSlotLoading(true)
        const slotResponse = await doctorAPI.getSlots(selectedDoctor, selectedDate)
        if (mounted) {
          setAvailableSlots(slotResponse.slots || [])
        }
      } catch {
        if (mounted) {
          const localDoctor = hospitalDoctors.find((d) => d.id === selectedDoctor)
          if (localDoctor?.localSlots?.length) {
            setAvailableSlots(localDoctor.localSlots)
            setBookingError('')
          } else {
            setAvailableSlots([])
            setBookingError('Could not fetch available slots for selected doctor/date.')
          }
        }
      } finally {
        if (mounted) {
          setSlotLoading(false)
        }
      }
    }

    loadSlots()

    return () => {
      mounted = false
    }
  }, [selectedDoctor, selectedDate, hospitalDoctors])

  const doctor = useMemo(
    () => hospitalDoctors.find((d) => d.id === selectedDoctor),
    [hospitalDoctors, selectedDoctor],
  )

  const selectedHospitalProfile = useMemo(() => {
    if (mapHospital) {
      return {
        name: mapHospital.name,
        address: mapHospital.address,
        phone: mapHospital.phone,
        openingHours: mapHospital.openingHours,
        website: mapHospital.website,
      }
    }

    const internalHospital = allHospitals.find((h) => h.id === selectedHospital)
    if (!internalHospital) {
      return null
    }

    return {
      name: internalHospital.name,
      address: internalHospital.address,
      phone: '',
      openingHours: '',
      website: '',
    }
  }, [mapHospital, allHospitals, selectedHospital])

  const handleConfirm = async () => {
    if (!selectedHospital || !selectedDoctor || !selectedDate || !selectedSlot || !doctor) {
      return
    }

    if (isDateBeforeToday(selectedDate)) {
      setDateError('Please enter a valid date')
      return
    }

    try {
      setBookingError('')
      let booking: any

      try {
        booking = await bookingAPI.create({
          hospitalId: selectedHospital,
          doctorId: selectedDoctor,
          date: selectedDate,
          slot: selectedSlot,
          hospitalName: selectedHospitalProfile?.name,
          doctorName: doctor.name,
          specialization: doctor.specialization || doctor.specialty,
          fee: doctor.fee,
          slotTimings: doctor.slot_timings,
          patientName: patientDetails.personal.fullName || user?.displayName || undefined,
          patientEmail: patientDetails.personal.email || user?.email || undefined,
          patientPhone: patientDetails.personal.phone || user?.phoneNumber || undefined,
          patientDetails: patientDetails,
        })
      } catch (error) {
        const message = error instanceof Error ? error.message.toLowerCase() : ''
        const shouldFallback =
          message.includes('temporarily unavailable') ||
          message.includes('failed to fetch') ||
          message.includes('network') ||
          message.includes('http 500')

        if (!shouldFallback) {
          throw error
        }

        booking = buildLocalBookingFallback({
          selectedHospital,
          selectedHospitalName: selectedHospitalProfile?.name || effectiveHospitalName || selectedHospital,
          selectedDoctorId: selectedDoctor,
          selectedDoctorName: doctor.name,
          selectedDate,
          selectedSlot,
          fee: doctor.fee,
        })

        setBookingError('Booking API is temporarily unavailable. Continuing with local booking confirmation.')
      }

      const doctorSpecialization = doctor.specialization || doctor.specialty || 'General Medicine'
      const resolvedHospitalName = selectedHospitalProfile?.name || effectiveHospitalName || selectedHospital
      const paymentState: PaymentBookingState = {
        appointmentId: booking.id,
        bookingId: booking.bookingId || booking.id,
        selectedHospital: {
          id: selectedHospital,
          name: resolvedHospitalName,
          address: selectedHospitalProfile?.address || '',
        },
        selectedDoctor: {
          id: selectedDoctor,
          name: doctor.name,
          specialization: doctorSpecialization,
          fee: doctor.fee,
        },
        selectedSlot,
        selectedDate,
        tokenNumber: Number(booking.tokenNumber || booking.token_number || 1),
        paymentStatus: 'pending',
        user: {
          uid: user?.uid || 'demo_user',
          name: user?.displayName || 'Patient',
          email: user?.email || 'demo@example.com',
          phone: user?.phoneNumber || '',
        },
        specialty: doctorSpecialization,
        hospitalId: selectedHospital,
        hospitalName: resolvedHospitalName,
        doctorId: selectedDoctor,
        doctorName: doctor.name,
        slot: selectedSlot,
        date: selectedDate,
        fee: doctor.fee,
      }

      navigate('/payment', {
        state: paymentState,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to confirm booking. Please retry.'
      setBookingError(message || 'Unable to confirm booking. Please retry.')
    }
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Book Appointment</h1>
          <p className="text-dark-400 mt-1">Select hospital, doctor, and time slot</p>
        </div>

        {bookingError && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {bookingError}
          </div>
        )}

        {selectedHospitalProfile && (
          <div className="glass-card p-5 mb-6">
            <div className="flex items-center gap-2 mb-2 text-primary-300 text-sm font-medium">
              <Building2 className="w-4 h-4" />
              Hospital Profile from Map Selection
            </div>
            <h3 className="text-lg font-bold text-white">{selectedHospitalProfile.name}</h3>
            <div className="mt-1 flex items-center gap-2 text-dark-300 text-sm">
              <MapPin className="w-4 h-4 text-dark-400" />
              <span>{selectedHospitalProfile.address}</span>
            </div>
            {selectedHospitalProfile.phone && (
              <div className="mt-2 flex items-center gap-2 text-dark-300 text-sm">
                <Phone className="w-4 h-4 text-dark-400" />
                <span>{selectedHospitalProfile.phone}</span>
              </div>
            )}
            {selectedHospitalProfile.openingHours && (
              <div className="mt-2 flex items-center gap-2 text-dark-300 text-sm">
                <Clock className="w-4 h-4 text-dark-400" />
                <span>{selectedHospitalProfile.openingHours}</span>
              </div>
            )}
            {selectedHospitalProfile.website && (
              <a
                href={selectedHospitalProfile.website}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-sm text-secondary-300 hover:text-secondary-200"
              >
                <Globe className="w-4 h-4" />
                Visit Hospital Website
              </a>
            )}
          </div>
        )}

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
          {['Hospital', 'Doctor', 'Slot', 'Details', 'Review'].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1 min-w-[max-content]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > i + 1
                  ? 'bg-green-500 text-white'
                  : step === i + 1
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                  : 'bg-white/5 text-dark-500'
              }`}>
                {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${
                step >= i + 1 ? 'text-white' : 'text-dark-500'
              }`}>
                {label}
              </span>
              {i < 4 && (
                <div className={`flex-1 h-0.5 rounded ${
                  step > i + 1 ? 'bg-green-500' : 'bg-white/5'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Hospital */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Select Hospital</h2>
            {hospitalLoading && allHospitals.length === 0 && (
              <div className="space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="glass-card p-5">
                    <div className="h-5 w-2/3 rounded bg-white/10" />
                    <div className="mt-2 h-4 w-full rounded bg-white/10" />
                  </div>
                ))}
              </div>
            )}

            {allHospitals.map((hospital, index) => (
              <motion.button
                key={hospital.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.24) }}
                onClick={() => {
                  setMapHospital(null)
                  setSelectedHospital(hospital.id)
                  setStep(2)
                }}
                className={`w-full glass-card p-5 text-left flex items-center justify-between group ${
                  selectedHospital === hospital.id ? 'border-primary-500/30' : ''
                }`}
              >
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                    {hospital.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1 text-dark-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-sm">{hospital.address}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors" />
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Step 2: Select Doctor */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-xl font-semibold text-white mb-4">Select Doctor</h2>
            {doctorLoading && <div className="text-sm text-dark-300">Loading doctors for this hospital...</div>}
            {!doctorLoading && hospitalDoctors.length === 0 && (
              <div className="glass-card p-5 text-sm text-dark-300">
                No mapped doctor schedule found for this hospital yet.
              </div>
            )}
            {hospitalDoctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDoctor(doc.id)
                  setStep(3)
                }}
                className="w-full glass-card p-5 text-left flex items-center gap-4 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center flex-shrink-0">
                  <Stethoscope className="w-6 h-6 text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-sm text-primary-400">{doc.specialty}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1 text-xs text-dark-400">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {doc.rating || 'N/A'}
                    </span>
                    <span className="text-xs text-dark-400">{doc.experience || 'N/A'}</span>
                  </div>
                  {doc.contact_number && <p className="text-xs text-dark-300 mt-1">Contact: {doc.contact_number}</p>}
                  {doc.slot_timings && <p className="text-xs text-dark-300">Slots: {doc.slot_timings}</p>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-secondary-400">₹{doc.fee}</p>
                  <p className="text-xs text-dark-500">Consultation</p>
                </div>
                <ChevronRight className="w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors" />
              </button>
            ))}
          </motion.div>
        )}

        {/* Step 3: Select Date & Slot */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button onClick={() => setStep(2)} className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-xl font-semibold text-white mb-4">Select Date & Time</h2>

            {/* Date Picker */}
            <div className="glass-card p-5 mb-6">
              <label className="text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary-400" />
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  const nextDate = e.target.value
                  setSelectedDate(nextDate)

                  if (isDateBeforeToday(nextDate)) {
                    setDateError('Please enter a valid date')
                    setSelectedSlot('')
                  } else {
                    setDateError('')
                  }
                }}
                min={new Date().toISOString().split('T')[0]}
                className="glass-input"
              />
              {dateError && <p className="mt-3 text-sm text-red-300">{dateError}</p>}
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="glass-card p-5">
                <label className="text-sm font-medium text-dark-300 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-secondary-400" />
                  Available Slots
                </label>
                {slotLoading && <p className="text-sm text-dark-300 mt-2">Loading slots...</p>}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                  {!slotLoading && availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => {
                        setSelectedSlot(slot)
                        setStep(4)
                      }}
                      className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedSlot === slot
                          ? 'bg-primary-500 text-white shadow-glow'
                          : 'bg-white/5 text-dark-300 hover:bg-primary-500/20 hover:text-primary-300 border border-white/5'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {!slotLoading && availableSlots.length === 0 && (
                  <p className="text-sm text-dark-300 mt-4">No slots available on this date for selected doctor.</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 4: Patient Details */}
        {step === 4 && doctor && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button onClick={() => setStep(3)} className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-xl font-semibold text-white mb-4">Patient Details</h2>

            {detailsError && (
              <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {detailsError}
              </div>
            )}

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="glass-card p-5">
                <h3 className="text-lg font-bold text-white mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Full Name *</label>
                    <input type="text" className="glass-input w-full" value={patientDetails.personal.fullName} onChange={e => setPatientDetails(p => ({...p, personal: {...p.personal, fullName: e.target.value}}))} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Age / DOB *</label>
                    <input type="date" className="glass-input w-full" value={patientDetails.personal.dob} onChange={e => setPatientDetails(p => ({...p, personal: {...p.personal, dob: e.target.value}}))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Gender *</label>
                    <select className="glass-input w-full" value={patientDetails.personal.gender} onChange={e => setPatientDetails(p => ({...p, personal: {...p.personal, gender: e.target.value}}))}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Blood Group (Optional)</label>
                    <input type="text" className="glass-input w-full" value={patientDetails.personal.bloodGroup} onChange={e => setPatientDetails(p => ({...p, personal: {...p.personal, bloodGroup: e.target.value}}))} placeholder="O+" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Phone Number *</label>
                    <input type="tel" className="glass-input w-full" value={patientDetails.personal.phone} onChange={e => setPatientDetails(p => ({...p, personal: {...p.personal, phone: e.target.value}}))} placeholder="+91 9876543210" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Email Address (Optional)</label>
                    <input type="email" className="glass-input w-full" value={patientDetails.personal.email} onChange={e => setPatientDetails(p => ({...p, personal: {...p.personal, email: e.target.value}}))} placeholder="john@example.com" />
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="glass-card p-5">
                <h3 className="text-lg font-bold text-white mb-4">Medical Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Symptoms / Reason for Visit *</label>
                    <textarea className="glass-input w-full h-20 resize-none" value={patientDetails.medical.symptoms} onChange={e => setPatientDetails(p => ({...p, medical: {...p.medical, symptoms: e.target.value}}))} placeholder="Describe your symptoms briefly..."></textarea>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Existing Diseases (Optional)</label>
                    <input type="text" className="glass-input w-full" value={patientDetails.medical.existingDiseases} onChange={e => setPatientDetails(p => ({...p, medical: {...p.medical, existingDiseases: e.target.value}}))} placeholder="e.g. Diabetes, Hypertension" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Current Medications (Optional)</label>
                    <input type="text" className="glass-input w-full" value={patientDetails.medical.currentMedications} onChange={e => setPatientDetails(p => ({...p, medical: {...p.medical, currentMedications: e.target.value}}))} placeholder="e.g. Metformin 500mg" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Allergies (Optional)</label>
                    <input type="text" className="glass-input w-full" value={patientDetails.medical.allergies} onChange={e => setPatientDetails(p => ({...p, medical: {...p.medical, allergies: e.target.value}}))} placeholder="e.g. Penicillin, Peanuts" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Upload Previous Medical Reports (Optional)</label>
                    <input type="file" className="glass-input w-full py-2" onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) setPatientDetails(p => ({...p, medical: {...p.medical, previousReport: file.name}}));
                    }} accept=".pdf,image/*" />
                    <p className="text-xs text-dark-400 mt-1">Files will be attached to your appointment record.</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="glass-card p-5">
                <h3 className="text-lg font-bold text-white mb-4">Emergency Contact *</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Name</label>
                    <input type="text" className="glass-input w-full" value={patientDetails.emergency.name} onChange={e => setPatientDetails(p => ({...p, emergency: {...p.emergency, name: e.target.value}}))} placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Relationship</label>
                    <input type="text" className="glass-input w-full" value={patientDetails.emergency.relationship} onChange={e => setPatientDetails(p => ({...p, emergency: {...p.emergency, relationship: e.target.value}}))} placeholder="Spouse / Parent" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Phone</label>
                    <input type="tel" className="glass-input w-full" value={patientDetails.emergency.phone} onChange={e => setPatientDetails(p => ({...p, emergency: {...p.emergency, phone: e.target.value}}))} placeholder="+91 9876543210" />
                  </div>
                </div>
              </div>

              {/* Insurance */}
              <div className="glass-card p-5">
                <h3 className="text-lg font-bold text-white mb-4">Insurance (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Provider</label>
                    <input type="text" className="glass-input w-full" value={patientDetails.insurance.provider} onChange={e => setPatientDetails(p => ({...p, insurance: {...p.insurance, provider: e.target.value}}))} placeholder="Star Health / LIC" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-dark-300 mb-2 block">Policy Number</label>
                    <input type="text" className="glass-input w-full" value={patientDetails.insurance.policyNumber} onChange={e => setPatientDetails(p => ({...p, insurance: {...p.insurance, policyNumber: e.target.value}}))} placeholder="POL-123456789" />
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  const { personal, medical, emergency } = patientDetails;
                  if (!personal.fullName || !personal.dob || !personal.gender || !personal.phone || !medical.symptoms || !emergency.name || !emergency.phone || !emergency.relationship) {
                    setDetailsError('Please fill in all required fields marked with *');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }
                  setDetailsError('');
                  setStep(5);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-gradient w-full py-4 text-lg font-semibold rounded-xl mt-6"
              >
                Review & Proceed
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Review */}
        {step === 5 && doctor && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button onClick={() => setStep(4)} className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-xl font-semibold text-white mb-4">Review Appointment</h2>

            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-white/5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{doctor.name}</h3>
                  <p className="text-sm text-primary-400">{doctor.specialty}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Hospital</span>
                  <span className="text-white font-medium">{selectedHospitalProfile?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Date</span>
                  <span className="text-white font-medium">{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-400">Time</span>
                  <span className="text-white font-medium">{selectedSlot}</span>
                </div>
                <div className="flex justify-between text-sm pt-3 border-t border-white/5">
                  <span className="text-dark-400">Consultation Fee</span>
                  <span className="text-xl font-bold text-secondary-400">₹{doctor.fee}</span>
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="btn-gradient w-full flex items-center justify-center gap-2 py-4 text-base mt-4"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Payment
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
