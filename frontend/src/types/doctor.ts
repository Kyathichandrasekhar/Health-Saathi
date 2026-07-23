export interface Doctor {
  id: string
  name: string
  specialization: string
  hospitalId: string
  hospitalName: string
  latitude: number
  longitude: number
  experience: number // in years
  rating: number
  consultationFee: number
  availableToday: boolean
  availability: 'Today' | 'Tomorrow' | 'Weekend'
  profileImage: string
  qualification: string
  languages: string[]
  phone: string
  gender: 'Male' | 'Female'
  availableSlots?: string[]
}

export interface DoctorFilterOptions {
  experience?: string // '1+', '5+', '10+', '15+'
  rating?: string // '4+', '4.5+'
  maxFee?: number // 200, 500, 1000
  availability?: string // 'Today', 'Tomorrow', 'Weekend'
  gender?: string // 'All', 'Male', 'Female'
  language?: string
  hospitalId?: string
  specialization?: string
}

export const SPECIALIZATIONS = [
  'Cardiologist',
  'Neurologist',
  'Orthopedic',
  'Dentist',
  'Dermatologist',
  'ENT',
  'Pediatrician',
  'Gynecologist',
  'Psychiatrist',
  'General Physician',
  'Ophthalmologist',
  'Pulmonologist',
  'Nephrologist',
  'Urologist',
] as const

export type SpecializationCategory = typeof SPECIALIZATIONS[number]
