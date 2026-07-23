import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Activity, Search, Filter, Stethoscope, Building2, SlidersHorizontal, RefreshCw } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import HospitalCard from '../components/HospitalCard'
import DoctorCard from '../components/DoctorCard'
import DoctorDetailsModal from '../components/DoctorDetailsModal'
import HospitalDetailsModal from '../components/HospitalDetailsModal'

import { Doctor, SPECIALIZATIONS } from '../types/doctor'
import { getDoctors, getFirestoreHospitals } from '../services/doctorFirestore'
import { SampleHospital } from '../services/doctorData'

const MapView = lazy(() => import('../components/MapView'))

const HOSPITAL_CACHE_KEY = 'hs_nearby_hospitals_cache_v1'

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function Home() {
  const location = useLocation()

  // State
  const [mode, setMode] = useState<'hospitals' | 'specialists'>('hospitals')
  const [realHospitals, setRealHospitals] = useState<any[]>([])
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(true)
  const [shouldMountMap, setShouldMountMap] = useState(true)
  const [showMapSkeleton, setShowMapSkeleton] = useState(true)

  // Doctor Discovery State
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([])
  const [sampleHospitals, setSampleHospitals] = useState<SampleHospital[]>([])
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true)
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<Doctor | null>(null)
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<SampleHospital | null>(null)

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [filterExp, setFilterExp] = useState<string>('All')
  const [filterRating, setFilterRating] = useState<string>('All')
  const [filterFee, setFilterFee] = useState<string>('All')
  const [filterAvailability, setFilterAvailability] = useState<string>('All')
  const [filterGender, setFilterGender] = useState<string>('All')
  const [filterLanguage, setFilterLanguage] = useState<string>('All')
  const [filterHospital, setFilterHospital] = useState<string>('All')
  const [filterSpecialization, setFilterSpecialization] = useState<string>('All')

  // User coordinates fallback
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>({ lat: 16.5062, lng: 80.648 })

  // Handle deep-link location state e.g. from AI assistant "Find Nearby Cardiologists" (Step 15)
  useEffect(() => {
    if (location.state) {
      const state = location.state as { searchMode?: 'hospitals' | 'specialists'; query?: string; specialization?: string }
      if (state.searchMode) {
        setMode(state.searchMode)
      }
      if (state.query || state.specialization) {
        const queryText = state.query || state.specialization || ''
        setSearchQuery(queryText)
        if (SPECIALIZATIONS.includes(queryText as any)) {
          setFilterSpecialization(queryText)
        }
      }
    }
  }, [location.state])

  // Get user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        },
        () => {},
        { timeout: 8000 },
      )
    }
  }, [])

  // Prefetch & initial setup
  useEffect(() => {
    const prefetchTimer = window.setTimeout(() => {
      void import('../components/MapView')
    }, 0)

    const skeletonTimer = window.setTimeout(() => {
      setShowMapSkeleton(false)
    }, 600)

    return () => {
      window.clearTimeout(prefetchTimer)
      window.clearTimeout(skeletonTimer)
    }
  }, [])

  // Load hospitals from cache
  useEffect(() => {
    try {
      const cached = localStorage.getItem(HOSPITAL_CACHE_KEY)
      if (!cached) return
      const parsed = JSON.parse(cached) as { hospitals?: any[] }
      if (Array.isArray(parsed?.hospitals) && parsed.hospitals.length > 0) {
        setRealHospitals(parsed.hospitals)
        setIsLoadingHospitals(false)
      }
    } catch {
      // Ignore
    }
  }, [])

  // Load doctors from Firestore & cache — fires once; memory cache means no Firestore hit on re-mount
  useEffect(() => {
    let isMounted = true
    const loadDoctorsData = async () => {
      setIsLoadingDoctors(true)
      try {
        const [docs, hosps] = await Promise.all([
          getDoctors(),
          getFirestoreHospitals(),
        ])
        if (isMounted) {
          setAllDoctors(docs)
          setSampleHospitals(hosps)
        }
      } catch {
        // Fallback handled in service
      } finally {
        if (isMounted) setIsLoadingDoctors(false)
      }
    }

    loadDoctorsData()
    return () => {
      isMounted = false
    }
  }, [])

  const handleHospitalsLoaded = useCallback((hospitals: any[]) => {
    setRealHospitals(hospitals)
    setIsLoadingHospitals(false)

    try {
      localStorage.setItem(
        HOSPITAL_CACHE_KEY,
        JSON.stringify({ ts: Date.now(), hospitals }),
      )
    } catch {}
  }, [])

  // Pre-compute distances ONCE per doctors-list or coords change — never during typing/filtering
  const doctorDistances = useMemo(() => {
    const map = new Map<string, number>()
    for (const d of allDoctors) {
      map.set(d.id, calculateDistanceKm(userCoords.lat, userCoords.lng, d.latitude, d.longitude))
    }
    return map
  }, [allDoctors, userCoords.lat, userCoords.lng])

  // Step 6, 12, 13: Doctor Filtering & Nearest sorting
  const filteredDoctors = useMemo(() => {
    let result = [...allDoctors]

    // Search Query matching
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.qualification.toLowerCase().includes(q) ||
          d.hospitalName.toLowerCase().includes(q),
      )
    }

    // Specialization Filter
    if (filterSpecialization !== 'All') {
      result = result.filter((d) => d.specialization === filterSpecialization)
    }

    // Experience Filter
    if (filterExp !== 'All') {
      const minExp = parseInt(filterExp.replace('+', ''), 10)
      if (!isNaN(minExp)) {
        result = result.filter((d) => d.experience >= minExp)
      }
    }

    // Rating Filter
    if (filterRating !== 'All') {
      const minRating = parseFloat(filterRating.replace('+', ''))
      if (!isNaN(minRating)) {
        result = result.filter((d) => d.rating >= minRating)
      }
    }

    // Consultation Fee Filter
    if (filterFee !== 'All') {
      const maxFee = parseInt(filterFee.replace('₹', '').replace('+', ''), 10)
      if (!isNaN(maxFee)) {
        result = result.filter((d) => d.consultationFee <= maxFee)
      }
    }

    // Availability Filter
    if (filterAvailability !== 'All') {
      if (filterAvailability === 'Today') {
        result = result.filter((d) => d.availableToday || d.availability === 'Today')
      } else {
        result = result.filter((d) => d.availability === filterAvailability)
      }
    }

    // Gender Filter
    if (filterGender !== 'All') {
      result = result.filter((d) => d.gender === filterGender)
    }

    // Language Filter
    if (filterLanguage !== 'All') {
      result = result.filter((d) => d.languages.includes(filterLanguage))
    }

    // Hospital Filter
    if (filterHospital !== 'All') {
      result = result.filter((d) => d.hospitalId === filterHospital || d.hospitalName.includes(filterHospital))
    }

    // Step 12: Sort using pre-computed distances (no recalculation during typing)
    result.sort((a, b) => (doctorDistances.get(a.id) ?? 0) - (doctorDistances.get(b.id) ?? 0))

    return result
  }, [
    allDoctors,
    doctorDistances,
    filterAvailability,
    filterExp,
    filterFee,
    filterGender,
    filterHospital,
    filterLanguage,
    filterRating,
    filterSpecialization,
    searchQuery,
  ])

  const resetFilters = () => {
    setSearchQuery('')
    setFilterExp('All')
    setFilterRating('All')
    setFilterFee('All')
    setFilterAvailability('All')
    setFilterGender('All')
    setFilterLanguage('All')
    setFilterHospital('All')
    setFilterSpecialization('All')
  }

  return (
    <div className="page-enter pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
                <Activity className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-primary-300">Smart Healthcare Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                <span className="text-white">Your Health,</span>
                <br />
                <span className="gradient-text">Our Priority</span>
              </h1>

              <p className="mt-6 text-lg text-dark-300 leading-relaxed max-w-lg">
                Find nearby hospitals, discover expert doctors, book instant appointments, and skip the queue — all in one place.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <button
                  onClick={() => {
                    setMode('hospitals')
                    const input = document.getElementById('hospital-search-input') as HTMLInputElement | null
                    if (input) {
                      input.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      setTimeout(() => input.focus(), 400)
                    }
                  }}
                  className="btn-gradient flex items-center justify-center gap-2 text-base px-6 py-3.5"
                >
                  <Building2 className="w-5 h-5" />
                  Find Hospitals
                </button>

                <button
                  onClick={() => {
                    setMode('specialists')
                    const input = document.getElementById('hospital-search-input') as HTMLInputElement | null
                    if (input) {
                      input.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      setTimeout(() => input.focus(), 400)
                    }
                  }}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold flex items-center justify-center gap-2 shadow-glass hover:opacity-95 transition-all"
                >
                  <Stethoscope className="w-5 h-5" />
                  Find Doctors
                </button>

                <Link
                  to="/assistant"
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
                >
                  Health Assistant
                </Link>
              </div>
            </motion.div>

            {/* Right: Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-glass-lg"
            >
              {shouldMountMap ? (
                <Suspense fallback={<div className="h-full w-full bg-dark-900/80" />}>
                  <MapView
                    onHospitalsLoaded={handleHospitalsLoaded}
                    searchMode={mode}
                    onSearchModeChange={setMode}
                    doctors={filteredDoctors}
                    selectedDoctor={selectedDoctorForModal}
                    onSelectDoctor={setSelectedDoctorForModal}
                    onSearchQueryChange={setSearchQuery}
                    initialSearchQuery={searchQuery}
                    isDoctorsLoading={isLoadingDoctors}
                  />
                </Suspense>
              ) : (
                <div className="h-full w-full bg-dark-900/80" />
              )}

              {showMapSkeleton && (
                <div className="absolute inset-0 z-10 h-full w-full bg-dark-900/80 animate-pulse pointer-events-none">
                  <div className="h-full w-full grid grid-cols-3 gap-2 p-4 opacity-60">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="rounded-xl bg-white/5" />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Discovery Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Mode Selector & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {mode === 'hospitals' ? 'Nearby Hospitals' : 'Nearby Specialist Doctors'}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary-500/20 border border-primary-500/30 text-primary-300">
                {mode === 'hospitals' ? `${realHospitals.length} Found` : `${filteredDoctors.length} Doctors`}
              </span>
            </div>
            <p className="text-dark-400 mt-1 text-sm">
              {mode === 'hospitals'
                ? 'Discover top medical facilities based on your current location'
                : 'Browse verified doctors and book instant appointments'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switch Pills */}
            <div className="p-1 bg-dark-800 border border-white/10 rounded-xl flex items-center">
              <button
                type="button"
                onClick={() => setMode('hospitals')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'hospitals'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'text-dark-300 hover:text-white'
                }`}
              >
                Hospitals
              </button>
              <button
                type="button"
                onClick={() => setMode('specialists')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  mode === 'specialists'
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-md'
                    : 'text-dark-300 hover:text-white'
                }`}
              >
                Specialists
              </button>
            </div>

            <Link
              to="/booking"
              className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1 hidden sm:flex"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Step 13 Filters Bar for Specialist Mode */}
        {mode === 'specialists' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl glass-card border border-white/10 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <SlidersHorizontal className="w-4 h-4 text-primary-400" />
                Filter Doctors
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-medium text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Filters
              </button>
            </div>

            {/* Specialization Quick Select */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                type="button"
                onClick={() => setFilterSpecialization('All')}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  filterSpecialization === 'All'
                    ? 'bg-primary-500 text-white'
                    : 'bg-white/5 text-dark-300 hover:bg-white/10'
                }`}
              >
                All Specializations
              </button>
              {SPECIALIZATIONS.map((spec) => (
                <button
                  key={spec}
                  type="button"
                  onClick={() => setFilterSpecialization(filterSpecialization === spec ? 'All' : spec)}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    filterSpecialization === spec
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/5 text-dark-300 hover:bg-white/10'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>

            {/* Filter Dropdowns Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-white/5 text-xs">
              {/* Experience */}
              <div>
                <label className="block text-dark-400 font-semibold mb-1">Experience</label>
                <select
                  value={filterExp}
                  onChange={(e) => setFilterExp(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-medium focus:ring-1 focus:ring-primary-500"
                >
                  <option value="All">All Exp</option>
                  <option value="1+">1+ Years</option>
                  <option value="5+">5+ Years</option>
                  <option value="10+">10+ Years</option>
                  <option value="15+">15+ Years</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-dark-400 font-semibold mb-1">Rating</label>
                <select
                  value={filterRating}
                  onChange={(e) => setFilterRating(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-medium focus:ring-1 focus:ring-primary-500"
                >
                  <option value="All">All Ratings</option>
                  <option value="4+">4.0+ Stars</option>
                  <option value="4.5+">4.5+ Stars</option>
                </select>
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-dark-400 font-semibold mb-1">Max Fee</label>
                <select
                  value={filterFee}
                  onChange={(e) => setFilterFee(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-medium focus:ring-1 focus:ring-primary-500"
                >
                  <option value="All">Any Fee</option>
                  <option value="₹200">Up to ₹200</option>
                  <option value="₹500">Up to ₹500</option>
                  <option value="₹1000">Up to ₹1000</option>
                </select>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-dark-400 font-semibold mb-1">Availability</label>
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-medium focus:ring-1 focus:ring-primary-500"
                >
                  <option value="All">Any Day</option>
                  <option value="Today">Available Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Weekend">Weekend</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-dark-400 font-semibold mb-1">Gender</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-medium focus:ring-1 focus:ring-primary-500"
                >
                  <option value="All">All Genders</option>
                  <option value="Male">Male Doctor</option>
                  <option value="Female">Female Doctor</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-dark-400 font-semibold mb-1">Language</label>
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="w-full bg-dark-800 border border-white/10 rounded-xl px-2.5 py-1.5 text-white font-medium focus:ring-1 focus:ring-primary-500"
                >
                  <option value="All">All Languages</option>
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid Display: Hospitals OR Doctors (Step 14) */}
        {mode === 'hospitals' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingHospitals ? (
              <div className="col-span-full flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : realHospitals.length > 0 ? (
              realHospitals.slice(0, 8).map((hospital: any, i: number) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <HospitalCard {...hospital} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center text-dark-300 py-10">
                No hospitals found near your location.
              </div>
            )}
          </div>
        ) : (
          /* Specialist Mode: Doctor Cards Grid (Step 14) */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoadingDoctors ? (
              <div className="col-span-full flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredDoctors.length > 0 ? (
              filteredDoctors.map((docItem: Doctor, i: number) => {
                const distanceKm = (doctorDistances.get(docItem.id) ?? 0).toFixed(1)

                return (
                  <motion.div
                    key={docItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <DoctorCard
                      doctor={docItem}
                      distance={`${distanceKm} km`}
                      onSelectDoctor={setSelectedDoctorForModal}
                      onNavigateToHospital={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${docItem.latitude},${docItem.longitude}`
                        window.open(url, '_blank')
                      }}
                    />
                  </motion.div>
                )
              })
            ) : (
              <div className="col-span-full text-center text-dark-300 py-12 glass-card rounded-2xl">
                <Stethoscope className="w-10 h-10 text-dark-400 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-bold text-white">No doctors found.</p>
                <p className="text-sm text-dark-400 mt-1">Try resetting your filters or searching for a different specialization.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-primary-500/20 text-primary-300 text-xs font-semibold hover:bg-primary-500/30 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to skip the queue?</h2>
            <p className="text-dark-300 mb-8 max-w-lg mx-auto">
              Book your doctor appointment online, get live token status, and visit the hospital stress-free.
            </p>
            <Link to="/signup" className="btn-gradient text-lg px-8 py-4 inline-flex items-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Doctor Details Modal (Step 11) */}
      {selectedDoctorForModal && (
        <DoctorDetailsModal
          doctor={selectedDoctorForModal}
          distance={`${(doctorDistances.get(selectedDoctorForModal.id) ?? calculateDistanceKm(userCoords.lat, userCoords.lng, selectedDoctorForModal.latitude, selectedDoctorForModal.longitude)).toFixed(1)} km`}
          onClose={() => setSelectedDoctorForModal(null)}
          onNavigateToHospital={(docItem) => {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${docItem.latitude},${docItem.longitude}`
            window.open(url, '_blank')
          }}
        />
      )}

      {/* Hospital Details Modal (Step 16) */}
      {selectedHospitalForModal && (
        <HospitalDetailsModal
          hospital={selectedHospitalForModal}
          doctors={allDoctors}
          onClose={() => setSelectedHospitalForModal(null)}
          onSelectDoctor={(docItem) => {
            setSelectedHospitalForModal(null)
            setSelectedDoctorForModal(docItem)
          }}
        />
      )}
    </div>
  )
}
