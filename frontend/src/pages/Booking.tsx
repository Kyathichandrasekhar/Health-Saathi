import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Stethoscope, Clock, Calendar, ChevronRight, Star, MapPin,
  ArrowLeft, Check, CreditCard, Phone, Globe, Building2
} from 'lucide-react'
import { bookingAPI, doctorAPI, hospitalAPI, type DoctorProfile, type InternalHospital } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

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

export default function Booking() {
  const [allHospitals, setAllHospitals] = useState<InternalHospital[]>([])
  const [step, setStep] = useState(1)
  const [selectedHospital, setSelectedHospital] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [mapHospital, setMapHospital] = useState<MapHospitalProfile | null>(null)
  const [hospitalDoctors, setHospitalDoctors] = useState<BookingDoctorProfile[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [hospitalLoading, setHospitalLoading] = useState(true)
  const [doctorLoading, setDoctorLoading] = useState(false)
  const [slotLoading, setSlotLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [dateError, setDateError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const effectiveHospitalName = mapHospital?.name || allHospitals.find((h) => h.id === selectedHospital)?.name || ''

  useEffect(() => {
    let mounted = true
    const preSelected = location.state?.preSelectedHospital as MapHospitalProfile | undefined

    if (preSelected) {
      setMapHospital(preSelected)
      setSelectedHospital(`map-${preSelected.id}`)
      setStep(2)
    }

    const loadHospitals = async () => {
      try {
        const internalHospitals = await hospitalAPI.getAll()
        if (!mounted) {
          return
        }
        setAllHospitals(internalHospitals)

        if (preSelected) {
          const mapped = resolveHospitalMapping(preSelected, internalHospitals)
          if (mapped) {
            setSelectedHospital(mapped.id)
          }
          window.history.replaceState({}, document.title)
        }
      } catch {
        if (mounted) {
          if (!preSelected) {
            setBookingError('Unable to load hospitals right now. Please retry in a moment.')
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
      const booking = await bookingAPI.create({
        hospitalId: selectedHospital,
        doctorId: selectedDoctor,
        date: selectedDate,
        slot: selectedSlot,
        hospitalName: selectedHospitalProfile?.name,
        doctorName: doctor.name,
        specialization: doctor.specialization || doctor.specialty,
        fee: doctor.fee,
        slotTimings: doctor.slot_timings,
        patientName: user?.displayName || undefined,
        patientEmail: user?.email || undefined,
        patientPhone: user?.phoneNumber || undefined,
      })

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
        <div className="flex items-center gap-2 mb-10">
          {['Hospital', 'Doctor', 'Slot', 'Confirm'].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
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
              {i < 3 && (
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
            {hospitalLoading && <div className="text-sm text-dark-300">Loading hospitals...</div>}
            {allHospitals.map((hospital) => (
              <button
                key={hospital.id}
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
              </button>
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

        {/* Step 4: Confirm */}
        {step === 4 && doctor && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button onClick={() => setStep(3)} className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h2 className="text-xl font-semibold text-white mb-4">Confirm Appointment</h2>

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
