import { MapPin, Star, Award, IndianRupee, Clock, Navigation, ArrowRight, UserCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Doctor } from '../types/doctor'
import DoctorIcon from './DoctorIcon'

interface DoctorCardProps {
  doctor: Doctor
  distance?: string
  onSelectDoctor?: (doctor: Doctor) => void
  onNavigateToHospital?: (doctor: Doctor) => void
}

export default function DoctorCard({
  doctor,
  distance,
  onSelectDoctor,
  onNavigateToHospital,
}: DoctorCardProps) {
  const navigate = useNavigate()

  const handleBookAppointment = (e: React.MouseEvent) => {
    e.stopPropagation()
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

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onNavigateToHospital) {
      onNavigateToHospital(doctor)
    } else {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${doctor.latitude},${doctor.longitude}`
      window.open(url, '_blank')
    }
  }

  return (
    <div
      onClick={() => onSelectDoctor?.(doctor)}
      className="glass-card p-6 group cursor-pointer hover:border-primary-500/40 transition-all duration-300 relative flex flex-col justify-between"
    >
      <div>
        {/* Header: Photo + Info + Rating */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <DoctorIcon specialization={doctor.specialization} />
            {doctor.availableToday && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-dark-900 rounded-full" title="Available Today" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors truncate">
                {doctor.name}
              </h3>
              <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-lg shrink-0 border border-yellow-500/20">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-semibold text-yellow-400">{doctor.rating.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-sm font-semibold text-primary-400">{doctor.specialization}</p>

            <div className="flex items-center gap-1.5 mt-1 text-dark-300 text-xs">
              <MapPin className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
              <span className="truncate">{doctor.hospitalName}</span>
            </div>
          </div>
        </div>

        {/* Qualification & Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-300 text-xs font-medium border border-primary-500/20">
            {doctor.qualification}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-secondary-500/10 text-secondary-300 text-xs font-medium border border-secondary-500/20 flex items-center gap-1">
            <Award className="w-3 h-3 text-secondary-400" />
            {doctor.experience}+ yrs exp
          </span>
        </div>

        {/* Info Row: Fee, Distance, Availability */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-xs text-dark-300">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white">₹{doctor.consultationFee}</span>
          </div>

          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
            <span className="truncate">{distance || 'Nearby'}</span>
          </div>

          <div className="flex items-center gap-1 justify-end">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span
              className={`font-medium ${
                doctor.availableToday ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {doctor.availability}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Navigate & Book Appointment */}
      <div className="grid grid-cols-2 gap-2 mt-5">
        <button
          type="button"
          onClick={handleNavigate}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all duration-300"
        >
          <Navigation className="w-3.5 h-3.5 text-primary-400" />
          Navigate
        </button>

        <button
          type="button"
          onClick={handleBookAppointment}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl btn-gradient text-white text-xs font-semibold transition-all duration-300 shadow-glass group/btn"
        >
          Book Now
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
