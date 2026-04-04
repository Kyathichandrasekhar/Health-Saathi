import { MapPin, Star, Clock, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface HospitalCardProps {
  id: string
  name: string
  address: string
  rating: number
  specialties: string[]
  eta?: string
  distance?: string
  availableDoctors: number
  lat?: number
  lng?: number
  location?: { lat: number; lng: number }
}

export default function HospitalCard({
  id,
  name,
  address,
  rating,
  specialties,
  eta,
  distance,
  availableDoctors,
  lat,
  lng,
  location,
}: HospitalCardProps) {
  const navigate = useNavigate()

  const handleBookNow = () => {
    navigate('/booking', {
      state: {
        preSelectedHospital: {
          id,
          name,
          address,
          lat: location?.lat ?? lat,
          lng: location?.lng ?? lng,
        },
      },
    })
  }

  return (
    <div className="glass-card p-6 group cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1 text-dark-400">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-sm">{address}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-yellow-500/10 px-2.5 py-1 rounded-lg">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold text-yellow-400">{rating}</span>
        </div>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-2 mt-3">
        {specialties.map((spec) => (
          <span
            key={spec}
            className="px-2.5 py-1 rounded-lg bg-primary-500/10 text-primary-300 text-xs font-medium"
          >
            {spec}
          </span>
        ))}
      </div>

      {/* Info Row */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
        {eta && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-secondary-400" />
            <span className="text-sm text-dark-300">ETA: {eta}</span>
          </div>
        )}
        {distance && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-secondary-400" />
            <span className="text-sm text-dark-300">{distance}</span>
          </div>
        )}
        <div className="ml-auto text-sm text-dark-400">
          <span className="text-secondary-400 font-semibold">{availableDoctors}</span> doctors
        </div>
      </div>

      {/* Action */}
      <button
        onClick={handleBookNow}
        className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-primary-600/20 to-secondary-600/20 text-white text-sm font-semibold hover:from-primary-600/30 hover:to-secondary-600/30 transition-all duration-300 group/btn"
      >
        Book Appointment
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
