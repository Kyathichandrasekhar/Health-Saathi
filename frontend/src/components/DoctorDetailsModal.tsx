import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Star,
  Award,
  IndianRupee,
  MapPin,
  Clock,
  Phone,
  Globe2,
  Calendar,
  Navigation,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Doctor } from '../types/doctor'
import DoctorIcon from './DoctorIcon'

interface DoctorDetailsModalProps {
  doctor: Doctor | null
  distance?: string
  onClose: () => void
  onNavigateToHospital?: (doctor: Doctor) => void
}

export default function DoctorDetailsModal({
  doctor,
  distance,
  onClose,
  onNavigateToHospital,
}: DoctorDetailsModalProps) {
  const navigate = useNavigate()

  if (!doctor) return null

  const handleBook = () => {
    onClose()
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
  }

  const handleNavigate = () => {
    onClose()
    if (onNavigateToHospital) {
      onNavigateToHospital(doctor)
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${doctor.latitude},${doctor.longitude}`
      window.open(url, '_blank')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-dark-900/80 backdrop-blur-md">
        {/* Backdrop click to dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl glass-card border border-white/10 rounded-3xl overflow-hidden shadow-glass-lg z-10 my-8"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="relative bg-gradient-to-r from-primary-900/60 via-dark-800 to-secondary-900/60 p-6 sm:p-8 pt-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                <DoctorIcon 
                  specialization={doctor.specialization} 
                  wrapperClassName="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shrink-0 border-4 border-primary-500/30 shadow-glass"
                  className="w-12 h-12 text-white"
                />
                <span
                  className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold border border-white/20 ${
                    doctor.availableToday ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                  }`}
                >
                  {doctor.availability}
                </span>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-semibold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Healthcare Specialist
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">{doctor.name}</h2>
                <p className="text-primary-400 font-bold text-base mt-1">{doctor.specialization}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-sm text-dark-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-secondary-400" />
                    {doctor.hospitalName}
                  </span>
                  {distance && (
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-dark-300 text-xs font-medium">
                      {distance}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
              <div>
                <p className="text-xs text-dark-400 uppercase font-semibold">Rating</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-base font-bold text-white">{doctor.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="border-x border-white/10">
                <p className="text-xs text-dark-400 uppercase font-semibold">Experience</p>
                <p className="text-base font-bold text-white mt-1">{doctor.experience}+ Years</p>
              </div>

              <div>
                <p className="text-xs text-dark-400 uppercase font-semibold">Fee</p>
                <p className="text-base font-bold text-emerald-400 mt-1">₹{doctor.consultationFee}</p>
              </div>
            </div>

            {/* Details Section */}
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs font-semibold text-dark-400 mb-1">Qualification</p>
                <p className="text-white font-medium">{doctor.qualification}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs font-semibold text-dark-400 mb-1">Languages Spoken</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {doctor.languages.map((lang) => (
                    <span key={lang} className="px-2 py-0.5 rounded-md bg-secondary-500/10 text-secondary-300 text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs font-semibold text-dark-400 mb-1">Contact Hospital</p>
                <p className="text-white font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary-400" />
                  {doctor.phone}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-xs font-semibold text-dark-400 mb-1">Available Today</p>
                <p className="text-white font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {doctor.availableToday ? 'Yes - Book slots below' : 'Next Available: Tomorrow'}
                </p>
              </div>
            </div>

            {/* Available Time Slots */}
            {doctor.availableSlots && doctor.availableSlots.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-dark-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary-400" />
                  Next Available Slots
                </h4>
                <div className="flex flex-wrap gap-2">
                  {doctor.availableSlots.map((slot) => (
                    <span
                      key={slot}
                      className="px-3 py-1.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-semibold"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={handleNavigate}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors border border-white/10"
              >
                <Navigation className="w-4 h-4 text-primary-400" />
                Navigate to Hospital
              </button>

              <button
                type="button"
                onClick={handleBook}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl btn-gradient text-white font-semibold text-sm shadow-glass transition-all hover:scale-[1.02]"
              >
                Book Appointment
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
