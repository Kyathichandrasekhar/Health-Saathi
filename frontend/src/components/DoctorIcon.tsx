import React from 'react'
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Ear,
  Stethoscope,
  Eye,
  Droplet,
  Activity,
  Smile,
  UserPlus
} from 'lucide-react'

interface DoctorIconProps {
  specialization: string
  className?: string
  wrapperClassName?: string
}

export default function DoctorIcon({ 
  specialization, 
  className = "w-6 h-6 text-white", 
  wrapperClassName = "w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 shadow-glow flex items-center justify-center shrink-0" 
}: DoctorIconProps) {
  
  const getIcon = () => {
    const spec = specialization.toLowerCase()
    
    if (spec.includes('cardio')) return <Heart className={className} />
    if (spec.includes('neuro') || spec.includes('psychiatry') || spec.includes('spine')) return <Brain className={className} />
    if (spec.includes('ortho') || spec.includes('bone') || spec.includes('sports')) return <Bone className={className} />
    if (spec.includes('pediatric')) return <Baby className={className} />
    if (spec.includes('ent') || spec.includes('ear') || spec.includes('neck')) return <Ear className={className} />
    if (spec.includes('dental') || spec.includes('dentist') || spec.includes('canal') || spec.includes('invisalign')) return <Smile className={className} /> 
    if (spec.includes('ophthalmology') || spec.includes('eye')) return <Eye className={className} />
    if (spec.includes('urology') || spec.includes('nephrology')) return <Droplet className={className} />
    if (spec.includes('gynecology') || spec.includes('women')) return <UserPlus className={className} />
    if (spec.includes('general') || spec.includes('medicine') || spec.includes('consultant')) return <Stethoscope className={className} />
    
    // Default fallback for Pulmonology, Gastroenterology, Oncology, Endocrinology, Surgery, etc.
    return <Activity className={className} />
  }

  return (
    <div className={wrapperClassName}>
      {getIcon()}
    </div>
  )
}
