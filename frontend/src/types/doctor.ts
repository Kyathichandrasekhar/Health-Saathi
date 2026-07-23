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
  qualification: string
  languages: string[]
  phone: string
  gender: 'Male' | 'Female'
  patientsServed: number
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
  'Pulmonology',
  'General Medicine',
  'Neurosurgery',
  'Surgery/Orthopedics',
  'Consultant',
  'Spine Surgery',
  'Pediatrics',
  'Neuro Psychiatry',
  'Cardiology/Vascular',
  'Gastroenterology',
  'Gynecology',
  'Surgical Gastroenterology',
  'ENT',
  'Cardiology',
  'Orthopedics',
  'General Surgery',
  'Sports Medicine',
  'Neuro/Spine Surgery',
  'Pediatric Surgery',
  'Dental'
] as const

export type SpecializationCategory = typeof SPECIALIZATIONS[number]
