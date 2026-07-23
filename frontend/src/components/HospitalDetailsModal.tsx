import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Phone, Building2, User, Star, Calendar, ArrowRight, Stethoscope } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Doctor } from '../types/doctor'
import { SampleHospital } from '../services/doctorData'

interface HospitalDetailsModalProps {
  hospital: SampleHospital | null
  doctors: Doctor[]
  onClose: () => void
  onSelectDoctor?: (doctor: Doctor) => void
}

export default function HospitalDetailsModal({
  hospital,
  doctors,
  onClose,
  onSelectDoctor,
}: HospitalDetailsModalProps) {
  const navigate = useNavigate()

  if (!hospital) return null

  const hospitalDoctors = doctors.filter(
    (d) => d.hospitalId === hospital.id || d.hospitalName.toLowerCase().includes(hospital.name.toLowerCase()),
  )

  const handleBookHospitalDoctor = (doctor: Doctor) => {
    onClose()
    navigate('/booking', {
      state: {
        preSelectedDoctor: doctor,
        preSelectedHospital: {
          id: hospital.id,
          name: hospital.name,
          address: hospital.address,
          lat: hospital.latitude,
          lng: hospital.longitude,
        },
        preSelectedSpecialization: doctor.specialization,
        preSelectedFee: doctor.consultationFee,
        preSelectedTime: doctor.availableSlots?.[0] || '10:00 AM',
      },
    })
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-dark-900/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl glass-card border border-white/10 rounded-3xl overflow-hidden shadow-glass-lg z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-primary-900/40 via-dark-800 to-secondary-900/40 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-2xl bg-primary-500/20 border border-primary-500/30 text-primary-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{hospital.name}</h2>
                <div className="flex items-center gap-2 text-xs text-dark-300 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-secondary-400" />
                  <span>{hospital.address}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-dark-300 pt-3 border-t border-white/5">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-white text-sm">{hospital.rating.toFixed(1)} Rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-primary-400" />
                <span>{hospital.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-secondary-400" />
                <span>{hospitalDoctors.length} Specialists Available</span>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Departments */}
            <div>
              <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider mb-3">
                Hospital Departments
              </h3>
              <div className="flex flex-wrap gap-2">
                {hospital.departments.map((dept) => (
                  <span
                    key={dept}
                    className="px-3 py-1.5 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-300 text-xs font-medium"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            {/* Doctors List */}
            <div>
              <h3 className="text-xs font-bold text-dark-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Associated Doctors & Specialists</span>
                <span className="text-primary-400 text-[11px] font-normal">{hospitalDoctors.length} Doctors</span>
              </h3>

              {hospitalDoctors.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {hospitalDoctors.map((docItem) => (
                    <div
                      key={docItem.id}
                      onClick={() => onSelectDoctor?.(docItem)}
                      className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary-500/30 transition-all cursor-pointer flex items-center gap-3 group"
                    >
                      <img
                        src={docItem.profileImage}
                        alt={docItem.name}
                        className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white group-hover:text-primary-300 truncate">
                          {docItem.name}
                        </h4>
                        <p className="text-xs text-primary-400 font-medium truncate">{docItem.specialization}</p>
                        <div className="flex items-center justify-between mt-1 text-[11px] text-dark-300">
                          <span>₹{docItem.consultationFee}</span>
                          <span className="text-emerald-400 font-semibold">{docItem.availability}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBookHospitalDoctor(docItem)
                        }}
                        className="p-2 rounded-xl bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 transition-colors shrink-0"
                        title="Book Doctor"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-dark-400 italic">No specialist doctors currently listed for this hospital.</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
