/**
 * Internal structured hospital + doctor scheduling data.
 * This can be replaced by Firestore reads while preserving the same shape.
 */

const HOSPITALS = [
  {
    id: 'hosp1',
    name: 'City General Hospital',
    address: 'Sector 21, New Delhi',
    lat: 28.6139,
    lng: 77.209,
    rating: 4.5,
    specialties: ['Cardiology', 'Orthopedics', 'Neurology'],
    available_doctors: 3,
  },
  {
    id: 'hosp2',
    name: 'Apollo Medical Center',
    address: 'Connaught Place, New Delhi',
    lat: 28.6315,
    lng: 77.2167,
    rating: 4.8,
    specialties: ['General Medicine', 'Pediatrics', 'Dermatology'],
    available_doctors: 2,
  },
  {
    id: 'hosp3',
    name: 'Max Super Specialty',
    address: 'Saket, New Delhi',
    lat: 28.5244,
    lng: 77.2066,
    rating: 4.3,
    specialties: ['Surgery', 'ENT', 'Ophthalmology'],
    available_doctors: 2,
  },
  {
    id: 'hosp4',
    name: 'Fortis Healthcare',
    address: 'Vasant Kunj, New Delhi',
    lat: 28.5185,
    lng: 77.1571,
    rating: 4.6,
    specialties: ['Oncology', 'Gastroenterology', 'Pulmonology'],
    available_doctors: 2,
  },
]

const DOCTORS_BY_HOSPITAL_ID = {
  hosp1: [
    {
      id: 'doc1',
      name: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      specialization: 'Cardiology',
      rating: 4.8,
      experience: '12 yrs',
      fee: 500,
      contact_number: '+91-9876542101',
      slot_timings: 'Mon-Sat, 09:00 AM - 11:30 AM',
    },
    {
      id: 'doc2',
      name: 'Dr. Rajesh Kumar',
      specialty: 'Orthopedics',
      specialization: 'Orthopedics',
      rating: 4.5,
      experience: '8 yrs',
      fee: 400,
      contact_number: '+91-9876542102',
      slot_timings: 'Mon-Fri, 02:00 PM - 04:30 PM',
    },
    {
      id: 'doc3',
      name: 'Dr. Anita Verma',
      specialty: 'Neurology',
      specialization: 'Neurology',
      rating: 4.9,
      experience: '15 yrs',
      fee: 700,
      contact_number: '+91-9876542103',
      slot_timings: 'Tue-Sat, 10:00 AM - 12:30 PM',
    },
  ],
  hosp2: [
    {
      id: 'doc4',
      name: 'Dr. Arjun Patel',
      specialty: 'General Medicine',
      specialization: 'General Medicine',
      rating: 4.6,
      experience: '10 yrs',
      fee: 300,
      contact_number: '+91-9876542104',
      slot_timings: 'Mon-Sat, 09:30 AM - 12:00 PM',
    },
    {
      id: 'doc5',
      name: 'Dr. Neha Singh',
      specialty: 'Pediatrics',
      specialization: 'Pediatrics',
      rating: 4.7,
      experience: '9 yrs',
      fee: 450,
      contact_number: '+91-9876542105',
      slot_timings: 'Mon-Fri, 03:00 PM - 05:30 PM',
    },
  ],
  hosp3: [
    {
      id: 'doc6',
      name: 'Dr. Vikram Reddy',
      specialty: 'General Surgery',
      specialization: 'General Surgery',
      rating: 4.4,
      experience: '20 yrs',
      fee: 800,
      contact_number: '+91-9876542106',
      slot_timings: 'Mon-Sat, 10:00 AM - 12:30 PM',
    },
    {
      id: 'doc7',
      name: 'Dr. Meera Joshi',
      specialty: 'ENT',
      specialization: 'ENT',
      rating: 4.3,
      experience: '7 yrs',
      fee: 350,
      contact_number: '+91-9876542107',
      slot_timings: 'Tue-Sun, 02:30 PM - 05:00 PM',
    },
  ],
  hosp4: [
    {
      id: 'doc8',
      name: 'Dr. Suresh Iyer',
      specialty: 'Oncology',
      specialization: 'Oncology',
      rating: 4.7,
      experience: '18 yrs',
      fee: 900,
      contact_number: '+91-9876542108',
      slot_timings: 'Mon-Fri, 11:00 AM - 01:30 PM',
    },
    {
      id: 'doc9',
      name: 'Dr. Kavita Rao',
      specialty: 'Gastroenterology',
      specialization: 'Gastroenterology',
      rating: 4.5,
      experience: '11 yrs',
      fee: 600,
      contact_number: '+91-9876542109',
      slot_timings: 'Mon-Sat, 04:00 PM - 06:30 PM',
    },
  ],
}

const DOCTORS_BY_HOSPITAL_NAME = {
  'Capital Hospital': [
    {
      id: 'doc_cap_1',
      name: 'Dr. Ramesh Naidu',
      specialty: 'Cardiology',
      specialization: 'Cardiology',
      rating: 4.8,
      experience: '12 yrs',
      fee: 500,
      contact_number: '+91-9876543210',
      slot_timings: 'Mon-Sat, 09:00 AM - 12:00 PM',
      slots_array: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
    },
    {
      id: 'doc_cap_2',
      name: 'Dr. Suma Reddy',
      specialty: 'Neurology',
      specialization: 'Neurology',
      rating: 4.7,
      experience: '10 yrs',
      fee: 600,
      contact_number: '+91-9876543211',
      slot_timings: 'Mon-Fri, 02:00 PM - 05:00 PM',
      slots_array: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'],
    },
  ],
  'Apollo Hospital': [
    {
      id: 'doc_apo_1',
      name: 'Dr. Harsha Vardhan',
      specialty: 'Orthopedics',
      specialization: 'Orthopedics',
      rating: 4.6,
      experience: '8 yrs',
      fee: 700,
      contact_number: '+91-9876543212',
      slot_timings: 'Mon-Sat, 10:00 AM - 01:00 PM',
      slots_array: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
    },
    {
      id: 'doc_apo_2',
      name: 'Dr. Priyanka Rao',
      specialty: 'Dermatology',
      specialization: 'Dermatology',
      rating: 4.7,
      experience: '9 yrs',
      fee: 550,
      contact_number: '+91-9876543213',
      slot_timings: 'Tue-Sun, 03:00 PM - 06:00 PM',
      slots_array: ['03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'],
    },
  ],
  'Care Hospital': [
    {
      id: 'doc_care_1',
      name: 'Dr. Kiran Kumar',
      specialty: 'General Medicine',
      specialization: 'General Medicine',
      rating: 4.8,
      experience: '15 yrs',
      fee: 450,
      contact_number: '+91-9876543214',
      slot_timings: 'Mon-Sat, 08:00 AM - 11:00 AM',
      slots_array: ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM'],
    },
  ],
}

const DOCTOR_SLOT_SCHEDULE = {
  doc1: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  doc2: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'],
  doc3: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
  doc4: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
  doc5: ['03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'],
  doc6: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
  doc7: ['02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'],
  doc8: ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM'],
  doc9: ['04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM'],
}

const GENERATED_DOCTORS_BY_HOSPITAL_NAME = {}

const FIRST_NAMES = ['Raghav', 'Sanjana', 'Vivek', 'Madhavi', 'Tarun', 'Keerthi', 'Nikhil', 'Sharvani']
const LAST_NAMES = ['Rao', 'Naik', 'Reddy', 'Prasad', 'Menon', 'Kulkarni', 'Bose', 'Iyer']
const SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Dermatology',
  'General Medicine',
  'Pediatrics',
  'ENT',
  'Pulmonology',
]
const SLOT_PATTERNS = [
  {
    slot_timings: 'Mon-Sat, 09:00 AM - 12:00 PM',
    slots_array: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  },
  {
    slot_timings: 'Mon-Fri, 02:00 PM - 05:00 PM',
    slots_array: ['02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'],
  },
  {
    slot_timings: 'Tue-Sun, 10:00 AM - 01:00 PM',
    slots_array: ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM'],
  },
]

function normalizeHospitalName(name = '') {
  return String(name)
    .toLowerCase()
    .replace(/[.,'"()\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function stringHash(text) {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  return hash
}

function hospitalSlug(hospitalName) {
  return normalizeHospitalName(hospitalName).replace(/\s+/g, '_').slice(0, 18) || 'hospital'
}

function registerDoctorSchedules(doctors) {
  doctors.forEach((doctor) => {
    if (Array.isArray(doctor.slots_array) && doctor.slots_array.length > 0) {
      DOCTOR_SLOT_SCHEDULE[doctor.id] = doctor.slots_array
    }
  })
}

function buildFallbackDoctorsForHospital(hospitalName) {
  const normalized = normalizeHospitalName(hospitalName)
  const hash = stringHash(normalized)
  const slug = hospitalSlug(hospitalName)
  const count = 2 + (hash % 2)

  const doctors = Array.from({ length: count }, (_, index) => {
    const firstName = FIRST_NAMES[(hash + index * 3) % FIRST_NAMES.length]
    const lastName = LAST_NAMES[(hash + index * 5) % LAST_NAMES.length]
    const specialization = SPECIALIZATIONS[(hash + index * 2) % SPECIALIZATIONS.length]
    const pattern = SLOT_PATTERNS[(hash + index) % SLOT_PATTERNS.length]
    const years = 7 + ((hash + index * 7) % 12)
    const fee = 400 + ((hash + index * 11) % 6) * 100
    const phoneSuffix = String(100000 + ((hash + index * 91) % 900000)).padStart(6, '0')

    return {
      id: `doc_${slug}_${index + 1}`,
      name: `Dr. ${firstName} ${lastName}`,
      specialty: specialization,
      specialization,
      rating: 4.2 + ((hash + index) % 6) / 10,
      experience: `${years} yrs`,
      fee,
      contact_number: `+91-98${phoneSuffix}`,
      slot_timings: pattern.slot_timings,
      slots_array: pattern.slots_array,
    }
  })

  registerDoctorSchedules(doctors)
  return doctors
}

function getDoctorsByHospitalName(hospitalName = '') {
  const normalized = normalizeHospitalName(hospitalName)
  if (!normalized) {
    return []
  }

  const knownName = Object.keys(DOCTORS_BY_HOSPITAL_NAME).find(
    (name) => normalizeHospitalName(name) === normalized,
  )

  if (knownName) {
    const doctors = DOCTORS_BY_HOSPITAL_NAME[knownName]
    registerDoctorSchedules(doctors)
    return doctors
  }

  if (!GENERATED_DOCTORS_BY_HOSPITAL_NAME[normalized]) {
    GENERATED_DOCTORS_BY_HOSPITAL_NAME[normalized] = buildFallbackDoctorsForHospital(hospitalName)
  }

  return GENERATED_DOCTORS_BY_HOSPITAL_NAME[normalized]
}

function getDoctorsByHospital(hospitalId) {
  const doctors = DOCTORS_BY_HOSPITAL_ID[hospitalId] || []
  registerDoctorSchedules(doctors)
  return doctors
}

function getDoctorById(doctorId) {
  const allDoctors = [
    ...Object.values(DOCTORS_BY_HOSPITAL_ID).flat(),
    ...Object.values(DOCTORS_BY_HOSPITAL_NAME).flat(),
    ...Object.values(GENERATED_DOCTORS_BY_HOSPITAL_NAME).flat(),
  ]
  return allDoctors.find((doctor) => doctor.id === doctorId) || null
}

function getSlotsForDoctor(doctorId) {
  return DOCTOR_SLOT_SCHEDULE[doctorId] || []
}

module.exports = {
  HOSPITALS,
  DOCTORS_BY_HOSPITAL_ID,
  DOCTORS_BY_HOSPITAL_NAME,
  DOCTOR_SLOT_SCHEDULE,
  getDoctorsByHospital,
  getDoctorsByHospitalName,
  getDoctorById,
  getSlotsForDoctor,
}
