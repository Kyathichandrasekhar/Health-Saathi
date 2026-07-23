import { Doctor } from '../types/doctor'

export interface SampleHospital {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  phone: string
  rating: number
  departments: string[]
}

export const SAMPLE_HOSPITALS: SampleHospital[] = [
  {
    "id": "H001",
    "name": "Sentini City Hospital",
    "address": "Kaleswararao Rd, Suryaraopet, Vijayawada, AP 520002",
    "departments": [
      "Multi-Specialty",
      "Pulmonology",
      "Cardiology",
      "Neurology",
      "Urology"
    ],
    "latitude": 16.5116021,
    "longitude": 80.6329639,
    "phone": "+91 73521 04108",
    "rating": 4.8
  },
  {
    "id": "H002",
    "name": "Cherish Multispeciality Hospital",
    "address": "Vishnu Vardhana Rao St, Suryaraopeta, Governor Peta, Vijayawada, AP 520002",
    "departments": [
      "Multi-Specialty",
      "Neurosurgery"
    ],
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "phone": "+91 82474 42686",
    "rating": 4.9
  },
  {
    "id": "H003",
    "name": "Unity Hospitals",
    "address": "Cherukupalli vari St, Governor Peta, Vijayawada, AP 520002",
    "departments": [
      "Multi-Specialty",
      "Orthopedics",
      "General Medicine",
      "Dental"
    ],
    "latitude": 16.51228,
    "longitude": 80.6315048,
    "phone": "+91 866 663 3108",
    "rating": 4.8
  },
  {
    "id": "H004",
    "name": "Sri Venkateswara Children & Multispeciality Hospital",
    "address": "Kaleswararao Rd, Suryaraopeta, Vijayawada, AP 520002",
    "departments": [
      "Pediatrics"
    ],
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "phone": "+91 83097 81565",
    "rating": 4.9
  },
  {
    "id": "H005",
    "name": "Latha Super Speciality Hospital",
    "address": "Road No. 5, Prakasham Road, Suryaraopeta, Vijayawada, AP 520010",
    "departments": [
      "Multi-Specialty",
      "Neuro Psychiatry",
      "Neurosurgery"
    ],
    "latitude": 16.5095838,
    "longitude": 80.635925,
    "phone": "+91 98484 09889",
    "rating": 4.8
  },
  {
    "id": "H006",
    "name": "Aster Ramesh Hospital (Main Branch)",
    "address": "Dr Ramesh Hospital Rd, Prashant Nagar, Jayaprakash Nagar, Vijayawada, AP 520008",
    "departments": [
      "Multi-Specialty",
      "Cardiology",
      "Vascular Surgery"
    ],
    "latitude": 16.5069006,
    "longitude": 80.6560892,
    "phone": "+91 866 246 3463",
    "rating": 4.8
  },
  {
    "id": "H007",
    "name": "Crest Hospital",
    "address": "Mahanadu Rd, Nagarjuna Nagar, Currency Nagar, Kanuru, Vijayawada, AP 520008",
    "departments": [
      "Gastroenterology",
      "Gynecology",
      "Multi-Specialty"
    ],
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "phone": "+91 92819 99934",
    "rating": 5
  },
  {
    "id": "H008",
    "name": "Vise Hospitals",
    "address": "Pantakalava cross road, Kamayyathopu, Padmaja Nagar, Tadigadapa, Kanuru, Vijayawada, AP 520007",
    "departments": [
      "Gynecology",
      "Gastroenterology"
    ],
    "latitude": 16.4859047,
    "longitude": 80.6862126,
    "phone": "+91 62626 27799",
    "rating": 4.9
  },
  {
    "id": "H009",
    "name": "Peddeswar Health Care Center (PHCC)",
    "address": "Dornakal Road, Venkataratnam St, Suryaraopeta, Vijayawada, AP 520002",
    "departments": [
      "Multi-Specialty",
      "ENT",
      "Neurology",
      "Nephrology",
      "Cardiology"
    ],
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "phone": "+91 866 243 8688",
    "rating": 4.9
  },
  {
    "id": "H010",
    "name": "Dr. Sivaprasad Hrudayalaya",
    "address": "Supriya Crown, Near Auto Nagar Gate, Patamata, Vijayawada, AP 520010",
    "departments": [
      "Cardiology"
    ],
    "latitude": 16.4920663,
    "longitude": 80.6671572,
    "phone": "+91 98492 73634",
    "rating": 4.9
  },
  {
    "id": "H011",
    "name": "Vamsi Heart Care Centre",
    "address": "Bellapu Sobhanadri St, New Giri Puram, Suryaraopeta, Vijayawada, AP 520002",
    "departments": [
      "Cardiology"
    ],
    "latitude": 16.5112914,
    "longitude": 80.6385617,
    "phone": "+91 95422 53858",
    "rating": 4.8
  },
  {
    "id": "H012",
    "name": "Andhra Hospital Heart And Brain Institute",
    "address": "Tagore Chamber, Nakkala Rd, Governor Peta, Vijayawada, AP 520002",
    "departments": [
      "Cardiology",
      "Neurology"
    ],
    "latitude": 16.510797,
    "longitude": 80.6319443,
    "phone": "+91 866 244 2333",
    "rating": 4.6
  },
  {
    "id": "H013",
    "name": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "address": "Prakasam Rd, Buckinghamipeta, Vijayawada, AP 520010",
    "departments": [
      "Cardiology"
    ],
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "phone": "+91 73966 26379",
    "rating": 4.7
  },
  {
    "id": "H014",
    "name": "MJ Naidu Super Speciality Hospital",
    "address": "Bramaihyaa Naidu St, Suryaraopeta, Vijayawada, AP 520002",
    "departments": [
      "Orthopedics"
    ],
    "latitude": 16.5112572,
    "longitude": 80.6381876,
    "phone": "+91 90401 33302",
    "rating": 4.6
  },
  {
    "id": "H015",
    "name": "Shreyas Ortho & Skin Multispeciality Hospital",
    "address": "Urmila Nagar Church, Bhavanipuram, Jojinagar, Vijayawada, AP 520012",
    "departments": [
      "Orthopedics",
      "Dermatology"
    ],
    "latitude": 16.5384146,
    "longitude": 80.5996132,
    "phone": "+91 91549 65555",
    "rating": 4.9
  },
  {
    "id": "H016",
    "name": "Roopa Orthopaedic & Joint Replacement Hospital",
    "address": "JD Nagar, Sivasankar Nagar, Vijayawada, AP 520010",
    "departments": [
      "Orthopedics"
    ],
    "latitude": 16.4923374,
    "longitude": 80.6655711,
    "phone": "+91 80069 00600",
    "rating": 4.8
  },
  {
    "id": "H017",
    "name": "Srikara Hospitals",
    "address": "Donka Road, Kanuru, Penamaluru, Vijayawada, AP 520007",
    "departments": [
      "Orthopedics",
      "General Surgery"
    ],
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "phone": "+91 866 661 2345",
    "rating": 4.8
  },
  {
    "id": "H018",
    "name": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "address": "Bezwada Hospitals & Diagnostics, Governor Peta, Vijayawada, AP 520002",
    "departments": [
      "Orthopedics",
      "Sports Medicine"
    ],
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "phone": "+91 96925 25969",
    "rating": 5
  },
  {
    "id": "H019",
    "name": "Bright Children's Hospital",
    "address": "Tadigadapa Centre, MG Road, Poranki, AP 521137",
    "departments": [
      "Pediatrics"
    ],
    "latitude": 16.479441,
    "longitude": 80.6992296,
    "phone": "+91 80000 00000",
    "rating": 4.9
  },
  {
    "id": "H020",
    "name": "Sri Srinivasa Children's Hospital",
    "address": "Chiluku Durgayya Veedhi, Nakkala Rd, Suryaraopeta, Vijayawada, AP 520002",
    "departments": [
      "Pediatrics"
    ],
    "latitude": 16.5134943,
    "longitude": 80.6339568,
    "phone": "+91 866 243 8090",
    "rating": 4.9
  },
  {
    "id": "H021",
    "name": "Rainbow Children's Hospital",
    "address": "Service Road, Nagarjuna Nagar, Currency Nagar, Kanuru, Vijayawada, AP 520008",
    "departments": [
      "Pediatrics",
      "Gynecology"
    ],
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "phone": "+91 80 6966 2201",
    "rating": 4.7
  },
  {
    "id": "H022",
    "name": "Blossoms Mother & Child Hospital",
    "address": "Sikhamani Centre Rd, Mogalrajapuram, Giripuram, Labbipet, Vijayawada, AP 520010",
    "departments": [
      "Gynecology",
      "Pediatrics",
      "ENT",
      "Pediatric Surgery",
      "Urology"
    ],
    "latitude": 16.5070262,
    "longitude": 80.6403374,
    "phone": "+91 800 241 9999",
    "rating": 4.8
  },
  {
    "id": "H023",
    "name": "Asian Dental",
    "address": "MG Rd, Sidhartha Nagar, Labbipet, Vijayawada, AP 520010",
    "departments": [
      "Dental"
    ],
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "phone": "+91 70756 75299",
    "rating": 4.9
  },
  {
    "id": "H024",
    "name": "Happy Dental and General Health Care",
    "address": "Bus Stop, Governor Peta, Vijayawada, AP 520002",
    "departments": [
      "Dental"
    ],
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "phone": "+91 90597 68696",
    "rating": 4.9
  },
  {
    "id": "H025",
    "name": "Andhra Dental",
    "address": "Durga Agraharam, Arundalpet, Governor Peta, Vijayawada, AP 520002",
    "departments": [
      "Dental"
    ],
    "latitude": 16.5161392,
    "longitude": 80.6395497,
    "phone": "+91 99085 04974",
    "rating": 4.9
  },
  {
    "id": "H026",
    "name": "Sky Dental",
    "address": "Kollipara Street, Eluru Rd, Seetharampuram, Vijayawada, AP 520002",
    "departments": [
      "Dental"
    ],
    "latitude": 16.5165514,
    "longitude": 80.6383039,
    "phone": "+91 70138 09070",
    "rating": 4.9
  },
  {
    "id": "H027",
    "name": "Yashwanth's Lotus Dental Care",
    "address": "CK Reddy Rd, Ayodhya Nagar, Vijayawada, AP 520003",
    "departments": [
      "Dental"
    ],
    "latitude": 16.5255674,
    "longitude": 80.6312231,
    "phone": "+91 90325 55844",
    "rating": 5
  },
  {
    "id": "H028",
    "name": "Vijaywada ENT and Multispeciality Hospital",
    "address": "Chilukudurgaiah Street, Nakkala Rd, Suryaraopeta, Vijayawada, AP 520002",
    "departments": [
      "ENT",
      "Physiotherapy"
    ],
    "latitude": 16.5138113,
    "longitude": 80.6332426,
    "phone": "+91 92921 04108",
    "rating": 3.6
  },
  {
    "id": "H029",
    "name": "Sagar ENT - Head & Neck Super Speciality Hospital",
    "address": "Kovelamudivari Street, New Giri Puram, Suryaraopeta, Vijayawada, AP 520002",
    "departments": [
      "ENT",
      "Head & Neck Surgery"
    ],
    "latitude": 16.5124697,
    "longitude": 80.637907,
    "phone": "+91 866 244 0806",
    "rating": 4.6
  },
  {
    "id": "H030",
    "name": "Sai Krishna ENT Hospital",
    "address": "Venkataratnam Street, Nakkala Rd, Suryaraopeta, Vijayawada, AP 520002",
    "departments": [
      "ENT"
    ],
    "latitude": 16.511899,
    "longitude": 80.6338337,
    "phone": "+91 866 243 6799",
    "rating": 4.6
  },
  {
    "id": "H031",
    "name": "Pradeep's ENT Hospital",
    "address": "Road No. 6, Nagarjuna Nagar, Currency Nagar, Kanuru, Vijayawada, AP 520008",
    "departments": [
      "ENT"
    ],
    "latitude": 16.5161647,
    "longitude": 80.6739827,
    "phone": "+91 94942 44233",
    "rating": 4.9
  },
  {
    "id": "H032",
    "name": "Dr. Sandeep VVK Clinic",
    "address": "Manipal Hospital, Near Kanakadurga Varadhi, Tadepalle, AP 522501",
    "departments": [
      "ENT",
      "Head & Neck Surgery",
      "Cochlear Implants"
    ],
    "latitude": 16.4844704,
    "longitude": 80.6166102,
    "phone": "+91 1800 102 4647",
    "rating": 5
  }
]

export const SAMPLE_DOCTORS: Doctor[] = [
  {
    "id": "D0001",
    "name": "Dr. Jyothi Trivedi",
    "specialization": "Cardiology",
    "hospitalId": "H007",
    "hospitalName": "Crest Hospital",
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "experience": 17,
    "consultationFee": 400,
    "rating": 4.6,
    "patientsServed": 7141,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 66652 32620",
    "gender": "Female",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0002",
    "name": "Dr. Saraswathi Chowdary",
    "specialization": "Neurology",
    "hospitalId": "H029",
    "hospitalName": "Sagar ENT - Head & Neck Super Speciality Hospital",
    "latitude": 16.5124697,
    "longitude": 80.637907,
    "experience": 11,
    "consultationFee": 800,
    "rating": 5,
    "patientsServed": 4326,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 92349 80374",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0003",
    "name": "Dr. Pawan Verma",
    "specialization": "Orthopedics",
    "hospitalId": "H030",
    "hospitalName": "Sai Krishna ENT Hospital",
    "latitude": 16.511899,
    "longitude": 80.6338337,
    "experience": 24,
    "consultationFee": 1200,
    "rating": 4.2,
    "patientsServed": 5762,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 72891 76279",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0004",
    "name": "Dr. Sanjay Yadav",
    "specialization": "Pediatrics",
    "hospitalId": "H028",
    "hospitalName": "Vijaywada ENT and Multispeciality Hospital",
    "latitude": 16.5138113,
    "longitude": 80.6332426,
    "experience": 29,
    "consultationFee": 1500,
    "rating": 4.1,
    "patientsServed": 7595,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 64491 85629",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0005",
    "name": "Dr. Chandrika Desai",
    "specialization": "ENT",
    "hospitalId": "H002",
    "hospitalName": "Cherish Multispeciality Hospital",
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "experience": 22,
    "consultationFee": 500,
    "rating": 4.7,
    "patientsServed": 6776,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 65924 97599",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0006",
    "name": "Dr. Seetha Reddy",
    "specialization": "Dental",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 15,
    "consultationFee": 1200,
    "rating": 4.3,
    "patientsServed": 2444,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 73596 29857",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0007",
    "name": "Dr. Anil Dutta",
    "specialization": "Dermatology",
    "hospitalId": "H007",
    "hospitalName": "Crest Hospital",
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "experience": 21,
    "consultationFee": 400,
    "rating": 4.9,
    "patientsServed": 7727,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 73662 47475",
    "gender": "Male",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0008",
    "name": "Dr. Patel Banerjee",
    "specialization": "Gynecology",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 24,
    "consultationFee": 1000,
    "rating": 4.2,
    "patientsServed": 7896,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 67318 17720",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0009",
    "name": "Dr. Kumar Trivedi",
    "specialization": "General Medicine",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 12,
    "consultationFee": 1100,
    "rating": 4.5,
    "patientsServed": 944,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 78123 23369",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0010",
    "name": "Dr. Aadhya Yadav",
    "specialization": "Pulmonology",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "experience": 23,
    "consultationFee": 600,
    "rating": 4.7,
    "patientsServed": 1954,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 99322 61809",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0011",
    "name": "Dr. Ayaan Chatterjee",
    "specialization": "Gastroenterology",
    "hospitalId": "H026",
    "hospitalName": "Sky Dental",
    "latitude": 16.5165514,
    "longitude": 80.6383039,
    "experience": 7,
    "consultationFee": 1100,
    "rating": 4.2,
    "patientsServed": 7587,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 66046 55494",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0012",
    "name": "Dr. Ramesh Kulkarni",
    "specialization": "Urology",
    "hospitalId": "H026",
    "hospitalName": "Sky Dental",
    "latitude": 16.5165514,
    "longitude": 80.6383039,
    "experience": 22,
    "consultationFee": 1400,
    "rating": 4.4,
    "patientsServed": 3805,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 70387 90722",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0013",
    "name": "Dr. Choudhary Naidu",
    "specialization": "Nephrology",
    "hospitalId": "H001",
    "hospitalName": "Sentini City Hospital",
    "latitude": 16.5116021,
    "longitude": 80.6329639,
    "experience": 19,
    "consultationFee": 300,
    "rating": 4.2,
    "patientsServed": 1463,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 98619 84892",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0014",
    "name": "Dr. Fatima Joshi",
    "specialization": "Oncology",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 21,
    "consultationFee": 1300,
    "rating": 4.4,
    "patientsServed": 1884,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 66248 60402",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0015",
    "name": "Dr. Saraswathi Nair",
    "specialization": "Ophthalmology",
    "hospitalId": "H026",
    "hospitalName": "Sky Dental",
    "latitude": 16.5165514,
    "longitude": 80.6383039,
    "experience": 27,
    "consultationFee": 800,
    "rating": 4.7,
    "patientsServed": 5159,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 75525 44659",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0016",
    "name": "Dr. Pawan Banerjee",
    "specialization": "Psychiatry",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 18,
    "consultationFee": 600,
    "rating": 4.5,
    "patientsServed": 7230,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 65970 74896",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0017",
    "name": "Dr. Ramesh Desai",
    "specialization": "Endocrinology",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "experience": 4,
    "consultationFee": 1500,
    "rating": 4.7,
    "patientsServed": 3932,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 87280 73247",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0018",
    "name": "Dr. Sunil Menon",
    "specialization": "Cardiology",
    "hospitalId": "H017",
    "hospitalName": "Srikara Hospitals",
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "experience": 22,
    "consultationFee": 600,
    "rating": 4.7,
    "patientsServed": 3117,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 93362 32145",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0019",
    "name": "Dr. Ravi Kulkarni",
    "specialization": "Neurology",
    "hospitalId": "H006",
    "hospitalName": "Aster Ramesh Hospital (Main Branch)",
    "latitude": 16.5069006,
    "longitude": 80.6560892,
    "experience": 13,
    "consultationFee": 1000,
    "rating": 4.7,
    "patientsServed": 1674,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 70940 69336",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0020",
    "name": "Dr. Tarun Bose",
    "specialization": "Orthopedics",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 16,
    "consultationFee": 1100,
    "rating": 4.4,
    "patientsServed": 1873,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 60023 24676",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0021",
    "name": "Dr. Saanvi Mukherjee",
    "specialization": "Pediatrics",
    "hospitalId": "H015",
    "hospitalName": "Shreyas Ortho & Skin Multispeciality Hospital",
    "latitude": 16.5384146,
    "longitude": 80.5996132,
    "experience": 4,
    "consultationFee": 1500,
    "rating": 4.2,
    "patientsServed": 140,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 75340 50647",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0022",
    "name": "Dr. Latha Yadav",
    "specialization": "ENT",
    "hospitalId": "H019",
    "hospitalName": "Bright Children's Hospital",
    "latitude": 16.479441,
    "longitude": 80.6992296,
    "experience": 7,
    "consultationFee": 800,
    "rating": 4.5,
    "patientsServed": 417,
    "availableToday": false,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 94041 93429",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0023",
    "name": "Dr. Charan Chowdary",
    "specialization": "Dental",
    "hospitalId": "H030",
    "hospitalName": "Sai Krishna ENT Hospital",
    "latitude": 16.511899,
    "longitude": 80.6338337,
    "experience": 29,
    "consultationFee": 900,
    "rating": 4.2,
    "patientsServed": 7829,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 69972 30740",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0024",
    "name": "Dr. Choudhary Singh",
    "specialization": "Dermatology",
    "hospitalId": "H024",
    "hospitalName": "Happy Dental and General Health Care",
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "experience": 5,
    "consultationFee": 900,
    "rating": 4.5,
    "patientsServed": 4879,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 93656 93103",
    "gender": "Male",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0025",
    "name": "Dr. Fatima Desai",
    "specialization": "Gynecology",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 18,
    "consultationFee": 400,
    "rating": 4.1,
    "patientsServed": 6941,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 96248 49417",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0026",
    "name": "Dr. Bhavani Singh",
    "specialization": "General Medicine",
    "hospitalId": "H020",
    "hospitalName": "Sri Srinivasa Children's Hospital",
    "latitude": 16.5134943,
    "longitude": 80.6339568,
    "experience": 18,
    "consultationFee": 400,
    "rating": 4.5,
    "patientsServed": 2241,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 98666 68445",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0027",
    "name": "Dr. Vijay Sharma",
    "specialization": "Pulmonology",
    "hospitalId": "H008",
    "hospitalName": "Vise Hospitals",
    "latitude": 16.4859047,
    "longitude": 80.6862126,
    "experience": 6,
    "consultationFee": 1000,
    "rating": 4.2,
    "patientsServed": 1876,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 61614 13231",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0028",
    "name": "Dr. Srinivas Chowdary",
    "specialization": "Gastroenterology",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "experience": 24,
    "consultationFee": 300,
    "rating": 4.9,
    "patientsServed": 6371,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 77564 82305",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0029",
    "name": "Dr. Aryan Trivedi",
    "specialization": "Urology",
    "hospitalId": "H005",
    "hospitalName": "Latha Super Speciality Hospital",
    "latitude": 16.5095838,
    "longitude": 80.635925,
    "experience": 28,
    "consultationFee": 600,
    "rating": 4.1,
    "patientsServed": 3907,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 65798 69987",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0030",
    "name": "Dr. Preethi Naidu",
    "specialization": "Nephrology",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "experience": 21,
    "consultationFee": 500,
    "rating": 4.5,
    "patientsServed": 4398,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 61038 36290",
    "gender": "Female",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0031",
    "name": "Dr. Anusha Verma",
    "specialization": "Oncology",
    "hospitalId": "H027",
    "hospitalName": "Yashwanth's Lotus Dental Care",
    "latitude": 16.5255674,
    "longitude": 80.6312231,
    "experience": 24,
    "consultationFee": 900,
    "rating": 4.1,
    "patientsServed": 7298,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 87535 75169",
    "gender": "Female",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0032",
    "name": "Dr. Seetha Dutta",
    "specialization": "Ophthalmology",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "experience": 20,
    "consultationFee": 1500,
    "rating": 4.6,
    "patientsServed": 653,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 97098 93214",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0033",
    "name": "Dr. Kalyan Yadav",
    "specialization": "Psychiatry",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "experience": 9,
    "consultationFee": 1200,
    "rating": 4.6,
    "patientsServed": 712,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 85352 88338",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0034",
    "name": "Dr. Kishore Das",
    "specialization": "Endocrinology",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "experience": 6,
    "consultationFee": 500,
    "rating": 4.5,
    "patientsServed": 3634,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 64116 32390",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0035",
    "name": "Dr. Shiva Naidu",
    "specialization": "Cardiology",
    "hospitalId": "H008",
    "hospitalName": "Vise Hospitals",
    "latitude": 16.4859047,
    "longitude": 80.6862126,
    "experience": 18,
    "consultationFee": 300,
    "rating": 4.5,
    "patientsServed": 1355,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 97811 57719",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0036",
    "name": "Dr. Chandrika Verma",
    "specialization": "Neurology",
    "hospitalId": "H022",
    "hospitalName": "Blossoms Mother & Child Hospital",
    "latitude": 16.5070262,
    "longitude": 80.6403374,
    "experience": 22,
    "consultationFee": 1500,
    "rating": 5,
    "patientsServed": 4745,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 87481 46263",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0037",
    "name": "Dr. Navya Joshi",
    "specialization": "Orthopedics",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 17,
    "consultationFee": 1400,
    "rating": 4.8,
    "patientsServed": 7880,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 96630 78055",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0038",
    "name": "Dr. Tarun Sen",
    "specialization": "Pediatrics",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 8,
    "consultationFee": 600,
    "rating": 5,
    "patientsServed": 6435,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 79482 61987",
    "gender": "Male",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0039",
    "name": "Dr. Sruthi Sen",
    "specialization": "ENT",
    "hospitalId": "H026",
    "hospitalName": "Sky Dental",
    "latitude": 16.5165514,
    "longitude": 80.6383039,
    "experience": 16,
    "consultationFee": 800,
    "rating": 4.9,
    "patientsServed": 1923,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 74433 86263",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0040",
    "name": "Dr. Verma Rao",
    "specialization": "Dental",
    "hospitalId": "H007",
    "hospitalName": "Crest Hospital",
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "experience": 22,
    "consultationFee": 1300,
    "rating": 4.9,
    "patientsServed": 5841,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 68660 46657",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0041",
    "name": "Dr. Aryan Sharma",
    "specialization": "Dermatology",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 8,
    "consultationFee": 1000,
    "rating": 4.5,
    "patientsServed": 5268,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 64413 55636",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0042",
    "name": "Dr. Ira Menon",
    "specialization": "Gynecology",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 8,
    "consultationFee": 800,
    "rating": 4.3,
    "patientsServed": 2285,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 89776 64877",
    "gender": "Female",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0043",
    "name": "Dr. Latha Goud",
    "specialization": "General Medicine",
    "hospitalId": "H022",
    "hospitalName": "Blossoms Mother & Child Hospital",
    "latitude": 16.5070262,
    "longitude": 80.6403374,
    "experience": 30,
    "consultationFee": 800,
    "rating": 4.9,
    "patientsServed": 2963,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 75282 65122",
    "gender": "Female",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0044",
    "name": "Dr. Laxmi Nair",
    "specialization": "Pulmonology",
    "hospitalId": "H017",
    "hospitalName": "Srikara Hospitals",
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "experience": 3,
    "consultationFee": 1400,
    "rating": 4.5,
    "patientsServed": 5765,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 60833 22743",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0045",
    "name": "Dr. Venkatesh Bhatt",
    "specialization": "Gastroenterology",
    "hospitalId": "H026",
    "hospitalName": "Sky Dental",
    "latitude": 16.5165514,
    "longitude": 80.6383039,
    "experience": 4,
    "consultationFee": 800,
    "rating": 4.7,
    "patientsServed": 7932,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 66191 51394",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0046",
    "name": "Dr. Chandrika Das",
    "specialization": "Urology",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 24,
    "consultationFee": 700,
    "rating": 4.5,
    "patientsServed": 5524,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 74474 51761",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0047",
    "name": "Dr. Ananya Nair",
    "specialization": "Nephrology",
    "hospitalId": "H024",
    "hospitalName": "Happy Dental and General Health Care",
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "experience": 27,
    "consultationFee": 300,
    "rating": 4.6,
    "patientsServed": 6206,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 91233 28654",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0048",
    "name": "Dr. Anil Chatterjee",
    "specialization": "Oncology",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 12,
    "consultationFee": 800,
    "rating": 4.8,
    "patientsServed": 6362,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 77086 94359",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0049",
    "name": "Dr. Kiara Verma",
    "specialization": "Ophthalmology",
    "hospitalId": "H015",
    "hospitalName": "Shreyas Ortho & Skin Multispeciality Hospital",
    "latitude": 16.5384146,
    "longitude": 80.5996132,
    "experience": 16,
    "consultationFee": 1300,
    "rating": 4.9,
    "patientsServed": 5513,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 72009 34563",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0050",
    "name": "Dr. Latha Das",
    "specialization": "Psychiatry",
    "hospitalId": "H001",
    "hospitalName": "Sentini City Hospital",
    "latitude": 16.5116021,
    "longitude": 80.6329639,
    "experience": 12,
    "consultationFee": 600,
    "rating": 4.9,
    "patientsServed": 5012,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 85397 64741",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0051",
    "name": "Dr. Raju Nair",
    "specialization": "Endocrinology",
    "hospitalId": "H019",
    "hospitalName": "Bright Children's Hospital",
    "latitude": 16.479441,
    "longitude": 80.6992296,
    "experience": 21,
    "consultationFee": 400,
    "rating": 4.3,
    "patientsServed": 6579,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 60643 78548",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0052",
    "name": "Dr. Kishore Reddy",
    "specialization": "Cardiology",
    "hospitalId": "H002",
    "hospitalName": "Cherish Multispeciality Hospital",
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "experience": 23,
    "consultationFee": 1300,
    "rating": 4.9,
    "patientsServed": 3919,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 81667 47288",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0053",
    "name": "Dr. Ramya Rao",
    "specialization": "Neurology",
    "hospitalId": "H006",
    "hospitalName": "Aster Ramesh Hospital (Main Branch)",
    "latitude": 16.5069006,
    "longitude": 80.6560892,
    "experience": 20,
    "consultationFee": 600,
    "rating": 4.3,
    "patientsServed": 3009,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 79783 54134",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0054",
    "name": "Dr. Sujatha Mukherjee",
    "specialization": "Orthopedics",
    "hospitalId": "H012",
    "hospitalName": "Andhra Hospital Heart And Brain Institute",
    "latitude": 16.510797,
    "longitude": 80.6319443,
    "experience": 25,
    "consultationFee": 1200,
    "rating": 4.1,
    "patientsServed": 3499,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 96404 65246",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0055",
    "name": "Dr. Ansh Menon",
    "specialization": "Pediatrics",
    "hospitalId": "H006",
    "hospitalName": "Aster Ramesh Hospital (Main Branch)",
    "latitude": 16.5069006,
    "longitude": 80.6560892,
    "experience": 5,
    "consultationFee": 500,
    "rating": 4.9,
    "patientsServed": 6254,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 84635 25679",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0056",
    "name": "Dr. Mounika Goud",
    "specialization": "ENT",
    "hospitalId": "H031",
    "hospitalName": "Pradeep's ENT Hospital",
    "latitude": 16.5161647,
    "longitude": 80.6739827,
    "experience": 28,
    "consultationFee": 1000,
    "rating": 4.5,
    "patientsServed": 889,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 61537 65146",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0057",
    "name": "Dr. Sruthi Patel",
    "specialization": "Dental",
    "hospitalId": "H019",
    "hospitalName": "Bright Children's Hospital",
    "latitude": 16.479441,
    "longitude": 80.6992296,
    "experience": 24,
    "consultationFee": 1100,
    "rating": 4.8,
    "patientsServed": 1194,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 73615 68219",
    "gender": "Female",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0058",
    "name": "Dr. Kiara Bhatt",
    "specialization": "Dermatology",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "experience": 22,
    "consultationFee": 1200,
    "rating": 4.8,
    "patientsServed": 194,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 64326 53707",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0059",
    "name": "Dr. Reyansh Trivedi",
    "specialization": "Gynecology",
    "hospitalId": "H030",
    "hospitalName": "Sai Krishna ENT Hospital",
    "latitude": 16.511899,
    "longitude": 80.6338337,
    "experience": 4,
    "consultationFee": 1000,
    "rating": 4.6,
    "patientsServed": 3846,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 82067 65810",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0060",
    "name": "Dr. Charan Yadav",
    "specialization": "General Medicine",
    "hospitalId": "H024",
    "hospitalName": "Happy Dental and General Health Care",
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "experience": 4,
    "consultationFee": 1300,
    "rating": 4.2,
    "patientsServed": 4660,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 64552 27195",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0061",
    "name": "Dr. Shiva Sen",
    "specialization": "Pulmonology",
    "hospitalId": "H027",
    "hospitalName": "Yashwanth's Lotus Dental Care",
    "latitude": 16.5255674,
    "longitude": 80.6312231,
    "experience": 11,
    "consultationFee": 400,
    "rating": 4.4,
    "patientsServed": 169,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 92728 29881",
    "gender": "Male",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0062",
    "name": "Dr. Reddy Das",
    "specialization": "Gastroenterology",
    "hospitalId": "H002",
    "hospitalName": "Cherish Multispeciality Hospital",
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "experience": 20,
    "consultationFee": 1500,
    "rating": 4.3,
    "patientsServed": 7246,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 94803 19962",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0063",
    "name": "Dr. Saraswathi Goud",
    "specialization": "Urology",
    "hospitalId": "H002",
    "hospitalName": "Cherish Multispeciality Hospital",
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "experience": 15,
    "consultationFee": 600,
    "rating": 4.7,
    "patientsServed": 3618,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 78404 75290",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0064",
    "name": "Dr. Sunil Chatterjee",
    "specialization": "Nephrology",
    "hospitalId": "H008",
    "hospitalName": "Vise Hospitals",
    "latitude": 16.4859047,
    "longitude": 80.6862126,
    "experience": 28,
    "consultationFee": 300,
    "rating": 4.3,
    "patientsServed": 6030,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 85976 21932",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0065",
    "name": "Dr. Reyansh Joshi",
    "specialization": "Oncology",
    "hospitalId": "H010",
    "hospitalName": "Dr. Sivaprasad Hrudayalaya",
    "latitude": 16.4920663,
    "longitude": 80.6671572,
    "experience": 26,
    "consultationFee": 700,
    "rating": 4.1,
    "patientsServed": 2927,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 62781 70004",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0066",
    "name": "Dr. Aadhya Rao",
    "specialization": "Ophthalmology",
    "hospitalId": "H016",
    "hospitalName": "Roopa Orthopaedic & Joint Replacement Hospital",
    "latitude": 16.4923374,
    "longitude": 80.6655711,
    "experience": 20,
    "consultationFee": 1400,
    "rating": 4.7,
    "patientsServed": 4937,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 95013 82059",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0067",
    "name": "Dr. Sunil Das",
    "specialization": "Psychiatry",
    "hospitalId": "H027",
    "hospitalName": "Yashwanth's Lotus Dental Care",
    "latitude": 16.5255674,
    "longitude": 80.6312231,
    "experience": 14,
    "consultationFee": 1400,
    "rating": 4.5,
    "patientsServed": 404,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 87542 60517",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0068",
    "name": "Dr. Sujatha Goud",
    "specialization": "Endocrinology",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 16,
    "consultationFee": 600,
    "rating": 4.7,
    "patientsServed": 5174,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 86628 55666",
    "gender": "Female",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0069",
    "name": "Dr. Saraswathi Iyer",
    "specialization": "Cardiology",
    "hospitalId": "H027",
    "hospitalName": "Yashwanth's Lotus Dental Care",
    "latitude": 16.5255674,
    "longitude": 80.6312231,
    "experience": 9,
    "consultationFee": 1200,
    "rating": 4.4,
    "patientsServed": 6618,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 67457 68421",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0070",
    "name": "Dr. Rao Naidu",
    "specialization": "Neurology",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "experience": 6,
    "consultationFee": 500,
    "rating": 4.6,
    "patientsServed": 5979,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 92745 75390",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0071",
    "name": "Dr. Sai Singh",
    "specialization": "Orthopedics",
    "hospitalId": "H001",
    "hospitalName": "Sentini City Hospital",
    "latitude": 16.5116021,
    "longitude": 80.6329639,
    "experience": 22,
    "consultationFee": 700,
    "rating": 4.7,
    "patientsServed": 7258,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 79473 41274",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0072",
    "name": "Dr. Latha Desai",
    "specialization": "Pediatrics",
    "hospitalId": "H022",
    "hospitalName": "Blossoms Mother & Child Hospital",
    "latitude": 16.5070262,
    "longitude": 80.6403374,
    "experience": 16,
    "consultationFee": 400,
    "rating": 4.7,
    "patientsServed": 4970,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 86280 92625",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0073",
    "name": "Dr. Karthika Mukherjee",
    "specialization": "ENT",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "experience": 30,
    "consultationFee": 400,
    "rating": 4.8,
    "patientsServed": 1106,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 94152 40392",
    "gender": "Female",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0074",
    "name": "Dr. Verma Goud",
    "specialization": "Dental",
    "hospitalId": "H012",
    "hospitalName": "Andhra Hospital Heart And Brain Institute",
    "latitude": 16.510797,
    "longitude": 80.6319443,
    "experience": 22,
    "consultationFee": 1200,
    "rating": 4.6,
    "patientsServed": 672,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 81733 13750",
    "gender": "Male",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0075",
    "name": "Dr. Krishna Trivedi",
    "specialization": "Dermatology",
    "hospitalId": "H001",
    "hospitalName": "Sentini City Hospital",
    "latitude": 16.5116021,
    "longitude": 80.6329639,
    "experience": 7,
    "consultationFee": 1300,
    "rating": 4.2,
    "patientsServed": 752,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 68601 31560",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0076",
    "name": "Dr. Manjula Pillai",
    "specialization": "Gynecology",
    "hospitalId": "H002",
    "hospitalName": "Cherish Multispeciality Hospital",
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "experience": 8,
    "consultationFee": 400,
    "rating": 4.4,
    "patientsServed": 1680,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 80599 82264",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0077",
    "name": "Dr. Rao Menon",
    "specialization": "General Medicine",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 14,
    "consultationFee": 300,
    "rating": 4.5,
    "patientsServed": 4254,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 67799 84347",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0078",
    "name": "Dr. Pari Das",
    "specialization": "Pulmonology",
    "hospitalId": "H002",
    "hospitalName": "Cherish Multispeciality Hospital",
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "experience": 2,
    "consultationFee": 1400,
    "rating": 4.8,
    "patientsServed": 3787,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 70448 73498",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0079",
    "name": "Dr. Srikanth Sen",
    "specialization": "Gastroenterology",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 27,
    "consultationFee": 700,
    "rating": 4.4,
    "patientsServed": 1834,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 99527 89860",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0080",
    "name": "Dr. Mahesh Bhatt",
    "specialization": "Urology",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "experience": 25,
    "consultationFee": 1400,
    "rating": 4.5,
    "patientsServed": 3808,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 95300 63544",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0081",
    "name": "Dr. Kiara Singh",
    "specialization": "Nephrology",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "experience": 17,
    "consultationFee": 300,
    "rating": 4.2,
    "patientsServed": 3698,
    "availableToday": false,
    "availability": "Tomorrow",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 80178 49529",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0082",
    "name": "Dr. Pawan Sen",
    "specialization": "Oncology",
    "hospitalId": "H025",
    "hospitalName": "Andhra Dental",
    "latitude": 16.5161392,
    "longitude": 80.6395497,
    "experience": 6,
    "consultationFee": 400,
    "rating": 4.4,
    "patientsServed": 2740,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 92245 74877",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0083",
    "name": "Dr. Aryan Chowdary",
    "specialization": "Ophthalmology",
    "hospitalId": "H019",
    "hospitalName": "Bright Children's Hospital",
    "latitude": 16.479441,
    "longitude": 80.6992296,
    "experience": 24,
    "consultationFee": 1100,
    "rating": 4.4,
    "patientsServed": 2374,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 94842 92943",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0084",
    "name": "Dr. Vijay Chatterjee",
    "specialization": "Psychiatry",
    "hospitalId": "H001",
    "hospitalName": "Sentini City Hospital",
    "latitude": 16.5116021,
    "longitude": 80.6329639,
    "experience": 18,
    "consultationFee": 1200,
    "rating": 4.9,
    "patientsServed": 775,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 73604 77991",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0085",
    "name": "Dr. Tarun Yadav",
    "specialization": "Endocrinology",
    "hospitalId": "H032",
    "hospitalName": "Dr. Sandeep VVK Clinic",
    "latitude": 16.4844704,
    "longitude": 80.6166102,
    "experience": 24,
    "consultationFee": 1000,
    "rating": 4.9,
    "patientsServed": 2358,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 69612 16122",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0086",
    "name": "Dr. Ashok Patel",
    "specialization": "Cardiology",
    "hospitalId": "H017",
    "hospitalName": "Srikara Hospitals",
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "experience": 4,
    "consultationFee": 1400,
    "rating": 4.3,
    "patientsServed": 3401,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 75055 44102",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0087",
    "name": "Dr. Ajay Iyer",
    "specialization": "Neurology",
    "hospitalId": "H001",
    "hospitalName": "Sentini City Hospital",
    "latitude": 16.5116021,
    "longitude": 80.6329639,
    "experience": 19,
    "consultationFee": 500,
    "rating": 4.7,
    "patientsServed": 4472,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 91028 24418",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0088",
    "name": "Dr. Swathi Bose",
    "specialization": "Orthopedics",
    "hospitalId": "H024",
    "hospitalName": "Happy Dental and General Health Care",
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "experience": 5,
    "consultationFee": 1100,
    "rating": 4.8,
    "patientsServed": 7947,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 93542 80482",
    "gender": "Female",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0089",
    "name": "Dr. Choudhary Bose",
    "specialization": "Pediatrics",
    "hospitalId": "H031",
    "hospitalName": "Pradeep's ENT Hospital",
    "latitude": 16.5161647,
    "longitude": 80.6739827,
    "experience": 26,
    "consultationFee": 700,
    "rating": 4.4,
    "patientsServed": 6511,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 70225 14783",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0090",
    "name": "Dr. Srinivas Patel",
    "specialization": "ENT",
    "hospitalId": "H032",
    "hospitalName": "Dr. Sandeep VVK Clinic",
    "latitude": 16.4844704,
    "longitude": 80.6166102,
    "experience": 30,
    "consultationFee": 1400,
    "rating": 4.3,
    "patientsServed": 2506,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 83870 53172",
    "gender": "Male",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0091",
    "name": "Dr. Swathi Iyer",
    "specialization": "Dental",
    "hospitalId": "H012",
    "hospitalName": "Andhra Hospital Heart And Brain Institute",
    "latitude": 16.510797,
    "longitude": 80.6319443,
    "experience": 15,
    "consultationFee": 600,
    "rating": 4.8,
    "patientsServed": 7207,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 96444 46144",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0092",
    "name": "Dr. Varun Mukherjee",
    "specialization": "Dermatology",
    "hospitalId": "H002",
    "hospitalName": "Cherish Multispeciality Hospital",
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "experience": 11,
    "consultationFee": 900,
    "rating": 4.1,
    "patientsServed": 4668,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 87213 74292",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0093",
    "name": "Dr. Sunil Yadav",
    "specialization": "Gynecology",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 26,
    "consultationFee": 800,
    "rating": 4.3,
    "patientsServed": 4252,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 86644 73814",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0094",
    "name": "Dr. Sai Chatterjee",
    "specialization": "General Medicine",
    "hospitalId": "H024",
    "hospitalName": "Happy Dental and General Health Care",
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "experience": 12,
    "consultationFee": 800,
    "rating": 4.4,
    "patientsServed": 2993,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 70237 89930",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0095",
    "name": "Dr. Saanvi Singh",
    "specialization": "Pulmonology",
    "hospitalId": "H015",
    "hospitalName": "Shreyas Ortho & Skin Multispeciality Hospital",
    "latitude": 16.5384146,
    "longitude": 80.5996132,
    "experience": 13,
    "consultationFee": 600,
    "rating": 4.9,
    "patientsServed": 1609,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 87571 92055",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0096",
    "name": "Dr. Myra Pillai",
    "specialization": "Gastroenterology",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "experience": 14,
    "consultationFee": 800,
    "rating": 4.1,
    "patientsServed": 2131,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 93413 28750",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0097",
    "name": "Dr. Choudhary Joshi",
    "specialization": "Urology",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 10,
    "consultationFee": 700,
    "rating": 4.7,
    "patientsServed": 7848,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 73874 62229",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0098",
    "name": "Dr. Prasad Desai",
    "specialization": "Nephrology",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 20,
    "consultationFee": 400,
    "rating": 4.9,
    "patientsServed": 4838,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 71383 33077",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0099",
    "name": "Dr. Shiva Yadav",
    "specialization": "Oncology",
    "hospitalId": "H010",
    "hospitalName": "Dr. Sivaprasad Hrudayalaya",
    "latitude": 16.4920663,
    "longitude": 80.6671572,
    "experience": 5,
    "consultationFee": 700,
    "rating": 4.9,
    "patientsServed": 2712,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 79038 61154",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0100",
    "name": "Dr. Rajesh Patel",
    "specialization": "Ophthalmology",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 10,
    "consultationFee": 1500,
    "rating": 4.6,
    "patientsServed": 6427,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 82190 62931",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0101",
    "name": "Dr. Ramya Pillai",
    "specialization": "Psychiatry",
    "hospitalId": "H029",
    "hospitalName": "Sagar ENT - Head & Neck Super Speciality Hospital",
    "latitude": 16.5124697,
    "longitude": 80.637907,
    "experience": 13,
    "consultationFee": 1400,
    "rating": 4.3,
    "patientsServed": 4328,
    "availableToday": false,
    "availability": "Tomorrow",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 75489 79136",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0102",
    "name": "Dr. Suresh Das",
    "specialization": "Endocrinology",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 18,
    "consultationFee": 800,
    "rating": 4.4,
    "patientsServed": 5103,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 63868 64952",
    "gender": "Male",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0103",
    "name": "Dr. Charan Bose",
    "specialization": "Cardiology",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 14,
    "consultationFee": 1000,
    "rating": 4.4,
    "patientsServed": 6706,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 85003 37426",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0104",
    "name": "Dr. Mahesh Verma",
    "specialization": "Neurology",
    "hospitalId": "H001",
    "hospitalName": "Sentini City Hospital",
    "latitude": 16.5116021,
    "longitude": 80.6329639,
    "experience": 11,
    "consultationFee": 900,
    "rating": 4.8,
    "patientsServed": 3471,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 63553 58037",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0105",
    "name": "Dr. Kumar Chowdary",
    "specialization": "Orthopedics",
    "hospitalId": "H028",
    "hospitalName": "Vijaywada ENT and Multispeciality Hospital",
    "latitude": 16.5138113,
    "longitude": 80.6332426,
    "experience": 15,
    "consultationFee": 1200,
    "rating": 4.4,
    "patientsServed": 1344,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 98560 75498",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0106",
    "name": "Dr. Swathi Banerjee",
    "specialization": "Pediatrics",
    "hospitalId": "H031",
    "hospitalName": "Pradeep's ENT Hospital",
    "latitude": 16.5161647,
    "longitude": 80.6739827,
    "experience": 14,
    "consultationFee": 1100,
    "rating": 4.9,
    "patientsServed": 5325,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 95447 30530",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0107",
    "name": "Dr. Advik Bose",
    "specialization": "ENT",
    "hospitalId": "H017",
    "hospitalName": "Srikara Hospitals",
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "experience": 30,
    "consultationFee": 600,
    "rating": 4.6,
    "patientsServed": 2698,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 64889 22078",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0108",
    "name": "Dr. Vivaan Rao",
    "specialization": "Dental",
    "hospitalId": "H012",
    "hospitalName": "Andhra Hospital Heart And Brain Institute",
    "latitude": 16.510797,
    "longitude": 80.6319443,
    "experience": 10,
    "consultationFee": 300,
    "rating": 4.2,
    "patientsServed": 7178,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 60500 50426",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0109",
    "name": "Dr. Riya Joshi",
    "specialization": "Dermatology",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 13,
    "consultationFee": 1000,
    "rating": 4.9,
    "patientsServed": 329,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 70789 26773",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0110",
    "name": "Dr. Anusha Chatterjee",
    "specialization": "Gynecology",
    "hospitalId": "H011",
    "hospitalName": "Vamsi Heart Care Centre",
    "latitude": 16.5112914,
    "longitude": 80.6385617,
    "experience": 26,
    "consultationFee": 300,
    "rating": 4.9,
    "patientsServed": 6308,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 63239 72420",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0111",
    "name": "Dr. Shaurya Sharma",
    "specialization": "General Medicine",
    "hospitalId": "H011",
    "hospitalName": "Vamsi Heart Care Centre",
    "latitude": 16.5112914,
    "longitude": 80.6385617,
    "experience": 29,
    "consultationFee": 900,
    "rating": 4.6,
    "patientsServed": 1219,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 64807 59985",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0112",
    "name": "Dr. Rao Mukherjee",
    "specialization": "Pulmonology",
    "hospitalId": "H002",
    "hospitalName": "Cherish Multispeciality Hospital",
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "experience": 25,
    "consultationFee": 1400,
    "rating": 4.1,
    "patientsServed": 355,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 67652 43483",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0113",
    "name": "Dr. Reddy Trivedi",
    "specialization": "Gastroenterology",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 12,
    "consultationFee": 700,
    "rating": 4.7,
    "patientsServed": 800,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 88833 47265",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0114",
    "name": "Dr. Vihaan Nair",
    "specialization": "Urology",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "experience": 23,
    "consultationFee": 1500,
    "rating": 4.8,
    "patientsServed": 6970,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 93663 47588",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0115",
    "name": "Dr. Diya Naidu",
    "specialization": "Nephrology",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "experience": 2,
    "consultationFee": 1100,
    "rating": 5,
    "patientsServed": 943,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 89611 87028",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0116",
    "name": "Dr. Raju Banerjee",
    "specialization": "Oncology",
    "hospitalId": "H007",
    "hospitalName": "Crest Hospital",
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "experience": 8,
    "consultationFee": 600,
    "rating": 4.5,
    "patientsServed": 5013,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 60556 97931",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0117",
    "name": "Dr. Durga Desai",
    "specialization": "Ophthalmology",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 17,
    "consultationFee": 1400,
    "rating": 4.4,
    "patientsServed": 2368,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 73806 30225",
    "gender": "Female",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0118",
    "name": "Dr. Ishaan Sen",
    "specialization": "Psychiatry",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 5,
    "consultationFee": 800,
    "rating": 4.5,
    "patientsServed": 1919,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 83160 70548",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0119",
    "name": "Dr. Mahesh Singh",
    "specialization": "Endocrinology",
    "hospitalId": "H030",
    "hospitalName": "Sai Krishna ENT Hospital",
    "latitude": 16.511899,
    "longitude": 80.6338337,
    "experience": 15,
    "consultationFee": 300,
    "rating": 4.4,
    "patientsServed": 3794,
    "availableToday": false,
    "availability": "Tomorrow",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 68454 11087",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0120",
    "name": "Dr. Anusha Yadav",
    "specialization": "Cardiology",
    "hospitalId": "H025",
    "hospitalName": "Andhra Dental",
    "latitude": 16.5161392,
    "longitude": 80.6395497,
    "experience": 12,
    "consultationFee": 1100,
    "rating": 4.5,
    "patientsServed": 4896,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 93255 29968",
    "gender": "Female",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0121",
    "name": "Dr. Radhika Dutta",
    "specialization": "Neurology",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 4,
    "consultationFee": 500,
    "rating": 4.7,
    "patientsServed": 1044,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 75421 61098",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0122",
    "name": "Dr. Ravi Singh",
    "specialization": "Orthopedics",
    "hospitalId": "H003",
    "hospitalName": "Unity Hospitals",
    "latitude": 16.51228,
    "longitude": 80.6315048,
    "experience": 23,
    "consultationFee": 500,
    "rating": 4.6,
    "patientsServed": 3666,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 60763 10612",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0123",
    "name": "Dr. Ravi Yadav",
    "specialization": "Pediatrics",
    "hospitalId": "H002",
    "hospitalName": "Cherish Multispeciality Hospital",
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "experience": 26,
    "consultationFee": 1200,
    "rating": 4.6,
    "patientsServed": 2335,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 65089 78237",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0124",
    "name": "Dr. Shaurya Das",
    "specialization": "ENT",
    "hospitalId": "H014",
    "hospitalName": "MJ Naidu Super Speciality Hospital",
    "latitude": 16.5112572,
    "longitude": 80.6381876,
    "experience": 6,
    "consultationFee": 1300,
    "rating": 4.5,
    "patientsServed": 3057,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 76618 76076",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0125",
    "name": "Dr. Radhika Nair",
    "specialization": "Dental",
    "hospitalId": "H014",
    "hospitalName": "MJ Naidu Super Speciality Hospital",
    "latitude": 16.5112572,
    "longitude": 80.6381876,
    "experience": 22,
    "consultationFee": 1100,
    "rating": 4.5,
    "patientsServed": 3322,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 87445 59988",
    "gender": "Female",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0126",
    "name": "Dr. Patel Joshi",
    "specialization": "Dermatology",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "experience": 11,
    "consultationFee": 900,
    "rating": 4.9,
    "patientsServed": 5703,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 80511 77942",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0127",
    "name": "Dr. Praveen Yadav",
    "specialization": "Gynecology",
    "hospitalId": "H020",
    "hospitalName": "Sri Srinivasa Children's Hospital",
    "latitude": 16.5134943,
    "longitude": 80.6339568,
    "experience": 15,
    "consultationFee": 1200,
    "rating": 4.9,
    "patientsServed": 4276,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 65059 76951",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0128",
    "name": "Dr. Kumar Dutta",
    "specialization": "General Medicine",
    "hospitalId": "H031",
    "hospitalName": "Pradeep's ENT Hospital",
    "latitude": 16.5161647,
    "longitude": 80.6739827,
    "experience": 12,
    "consultationFee": 1400,
    "rating": 4.2,
    "patientsServed": 6066,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 79888 40895",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0129",
    "name": "Dr. Kiran Sen",
    "specialization": "Pulmonology",
    "hospitalId": "H024",
    "hospitalName": "Happy Dental and General Health Care",
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "experience": 25,
    "consultationFee": 300,
    "rating": 5,
    "patientsServed": 215,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 76819 32807",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0130",
    "name": "Dr. Ananya Bhatt",
    "specialization": "Gastroenterology",
    "hospitalId": "H020",
    "hospitalName": "Sri Srinivasa Children's Hospital",
    "latitude": 16.5134943,
    "longitude": 80.6339568,
    "experience": 7,
    "consultationFee": 1500,
    "rating": 4.2,
    "patientsServed": 7503,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 76914 24796",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0131",
    "name": "Dr. Anusha Rao",
    "specialization": "Urology",
    "hospitalId": "H014",
    "hospitalName": "MJ Naidu Super Speciality Hospital",
    "latitude": 16.5112572,
    "longitude": 80.6381876,
    "experience": 12,
    "consultationFee": 1300,
    "rating": 4.7,
    "patientsServed": 2866,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 79164 24114",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0132",
    "name": "Dr. Mounika Pillai",
    "specialization": "Nephrology",
    "hospitalId": "H017",
    "hospitalName": "Srikara Hospitals",
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "experience": 5,
    "consultationFee": 900,
    "rating": 4.3,
    "patientsServed": 4714,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 88599 15249",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0133",
    "name": "Dr. Harsha Mukherjee",
    "specialization": "Oncology",
    "hospitalId": "H002",
    "hospitalName": "Cherish Multispeciality Hospital",
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "experience": 12,
    "consultationFee": 900,
    "rating": 4.5,
    "patientsServed": 3472,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 60071 54165",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0134",
    "name": "Dr. Kabir Chowdary",
    "specialization": "Ophthalmology",
    "hospitalId": "H005",
    "hospitalName": "Latha Super Speciality Hospital",
    "latitude": 16.5095838,
    "longitude": 80.635925,
    "experience": 21,
    "consultationFee": 500,
    "rating": 4.3,
    "patientsServed": 7462,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 85880 79062",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0135",
    "name": "Dr. Sharma Iyer",
    "specialization": "Psychiatry",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 24,
    "consultationFee": 1400,
    "rating": 4.8,
    "patientsServed": 1743,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 68266 88913",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0136",
    "name": "Dr. Keerthi Bose",
    "specialization": "Endocrinology",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "experience": 10,
    "consultationFee": 1200,
    "rating": 4.7,
    "patientsServed": 5704,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 79389 60827",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0137",
    "name": "Dr. Kishore Singh",
    "specialization": "Cardiology",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 3,
    "consultationFee": 1500,
    "rating": 4.9,
    "patientsServed": 2261,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 80632 24346",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0138",
    "name": "Dr. Charan Pillai",
    "specialization": "Neurology",
    "hospitalId": "H016",
    "hospitalName": "Roopa Orthopaedic & Joint Replacement Hospital",
    "latitude": 16.4923374,
    "longitude": 80.6655711,
    "experience": 27,
    "consultationFee": 1100,
    "rating": 4.8,
    "patientsServed": 3678,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 78558 83947",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0139",
    "name": "Dr. Laxmi Iyer",
    "specialization": "Orthopedics",
    "hospitalId": "H008",
    "hospitalName": "Vise Hospitals",
    "latitude": 16.4859047,
    "longitude": 80.6862126,
    "experience": 23,
    "consultationFee": 1200,
    "rating": 4.6,
    "patientsServed": 3346,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 70705 86514",
    "gender": "Female",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0140",
    "name": "Dr. Praveen Sharma",
    "specialization": "Pediatrics",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 9,
    "consultationFee": 1100,
    "rating": 4.2,
    "patientsServed": 1366,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 68765 64871",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0141",
    "name": "Dr. Ramesh Rao",
    "specialization": "ENT",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "experience": 3,
    "consultationFee": 600,
    "rating": 4.9,
    "patientsServed": 5958,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 92329 11725",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0142",
    "name": "Dr. Teja Goud",
    "specialization": "Dental",
    "hospitalId": "H005",
    "hospitalName": "Latha Super Speciality Hospital",
    "latitude": 16.5095838,
    "longitude": 80.635925,
    "experience": 16,
    "consultationFee": 1100,
    "rating": 4.6,
    "patientsServed": 138,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 78252 55986",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0143",
    "name": "Dr. Padma Chatterjee",
    "specialization": "Dermatology",
    "hospitalId": "H030",
    "hospitalName": "Sai Krishna ENT Hospital",
    "latitude": 16.511899,
    "longitude": 80.6338337,
    "experience": 6,
    "consultationFee": 500,
    "rating": 4.9,
    "patientsServed": 5949,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 69940 89904",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0144",
    "name": "Dr. Dhruv Yadav",
    "specialization": "Gynecology",
    "hospitalId": "H022",
    "hospitalName": "Blossoms Mother & Child Hospital",
    "latitude": 16.5070262,
    "longitude": 80.6403374,
    "experience": 14,
    "consultationFee": 1100,
    "rating": 4.3,
    "patientsServed": 1416,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 87893 15341",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0145",
    "name": "Dr. Aryan Bose",
    "specialization": "General Medicine",
    "hospitalId": "H032",
    "hospitalName": "Dr. Sandeep VVK Clinic",
    "latitude": 16.4844704,
    "longitude": 80.6166102,
    "experience": 6,
    "consultationFee": 1500,
    "rating": 4.2,
    "patientsServed": 2203,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 67120 10845",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0146",
    "name": "Dr. Saanvi Yadav",
    "specialization": "Pulmonology",
    "hospitalId": "H019",
    "hospitalName": "Bright Children's Hospital",
    "latitude": 16.479441,
    "longitude": 80.6992296,
    "experience": 12,
    "consultationFee": 1200,
    "rating": 4.8,
    "patientsServed": 4706,
    "availableToday": false,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 72869 55356",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0147",
    "name": "Dr. Ananya Sen",
    "specialization": "Gastroenterology",
    "hospitalId": "H024",
    "hospitalName": "Happy Dental and General Health Care",
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "experience": 28,
    "consultationFee": 1200,
    "rating": 4.5,
    "patientsServed": 4341,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 65131 15763",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0148",
    "name": "Dr. Divya Naidu",
    "specialization": "Urology",
    "hospitalId": "H028",
    "hospitalName": "Vijaywada ENT and Multispeciality Hospital",
    "latitude": 16.5138113,
    "longitude": 80.6332426,
    "experience": 30,
    "consultationFee": 700,
    "rating": 4.8,
    "patientsServed": 5806,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 66624 54913",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0149",
    "name": "Dr. Sanjay Goud",
    "specialization": "Nephrology",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 5,
    "consultationFee": 1300,
    "rating": 4.8,
    "patientsServed": 2691,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 61208 72061",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0150",
    "name": "Dr. Reddy Bhatt",
    "specialization": "Oncology",
    "hospitalId": "H014",
    "hospitalName": "MJ Naidu Super Speciality Hospital",
    "latitude": 16.5112572,
    "longitude": 80.6381876,
    "experience": 14,
    "consultationFee": 1200,
    "rating": 4.8,
    "patientsServed": 598,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 81152 65833",
    "gender": "Male",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0151",
    "name": "Dr. Mounika Menon",
    "specialization": "Ophthalmology",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "experience": 24,
    "consultationFee": 300,
    "rating": 4.1,
    "patientsServed": 3658,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 67458 10855",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0152",
    "name": "Dr. Sharma Chatterjee",
    "specialization": "Psychiatry",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 15,
    "consultationFee": 1300,
    "rating": 4.3,
    "patientsServed": 6126,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 65985 19874",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0153",
    "name": "Dr. Sujatha Bose",
    "specialization": "Endocrinology",
    "hospitalId": "H022",
    "hospitalName": "Blossoms Mother & Child Hospital",
    "latitude": 16.5070262,
    "longitude": 80.6403374,
    "experience": 27,
    "consultationFee": 1400,
    "rating": 4.4,
    "patientsServed": 3574,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 79392 90043",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0154",
    "name": "Dr. Ansh Sharma",
    "specialization": "Cardiology",
    "hospitalId": "H024",
    "hospitalName": "Happy Dental and General Health Care",
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "experience": 16,
    "consultationFee": 900,
    "rating": 4.2,
    "patientsServed": 7044,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 94759 54799",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0155",
    "name": "Dr. Krishna Chowdary",
    "specialization": "Neurology",
    "hospitalId": "H008",
    "hospitalName": "Vise Hospitals",
    "latitude": 16.4859047,
    "longitude": 80.6862126,
    "experience": 16,
    "consultationFee": 900,
    "rating": 4.8,
    "patientsServed": 4492,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 96001 19727",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0156",
    "name": "Dr. Kalyan Naidu",
    "specialization": "Orthopedics",
    "hospitalId": "H015",
    "hospitalName": "Shreyas Ortho & Skin Multispeciality Hospital",
    "latitude": 16.5384146,
    "longitude": 80.5996132,
    "experience": 17,
    "consultationFee": 1000,
    "rating": 4.6,
    "patientsServed": 1543,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 97741 82858",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0157",
    "name": "Dr. Advik Joshi",
    "specialization": "Pediatrics",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 30,
    "consultationFee": 1400,
    "rating": 4.6,
    "patientsServed": 4740,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 76507 42952",
    "gender": "Male",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0158",
    "name": "Dr. Krishna Naidu",
    "specialization": "ENT",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 17,
    "consultationFee": 1300,
    "rating": 4.6,
    "patientsServed": 7365,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 80745 43102",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0159",
    "name": "Dr. Kishore Desai",
    "specialization": "Dental",
    "hospitalId": "H006",
    "hospitalName": "Aster Ramesh Hospital (Main Branch)",
    "latitude": 16.5069006,
    "longitude": 80.6560892,
    "experience": 26,
    "consultationFee": 700,
    "rating": 4.2,
    "patientsServed": 3290,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 67144 44854",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0160",
    "name": "Dr. Sowmya Iyer",
    "specialization": "Dermatology",
    "hospitalId": "H008",
    "hospitalName": "Vise Hospitals",
    "latitude": 16.4859047,
    "longitude": 80.6862126,
    "experience": 4,
    "consultationFee": 1000,
    "rating": 4.2,
    "patientsServed": 3989,
    "availableToday": false,
    "availability": "Tomorrow",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 86210 91391",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0161",
    "name": "Dr. Kumar Nair",
    "specialization": "Gynecology",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "experience": 17,
    "consultationFee": 900,
    "rating": 4.7,
    "patientsServed": 4457,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 73116 18742",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0162",
    "name": "Dr. Teja Desai",
    "specialization": "General Medicine",
    "hospitalId": "H011",
    "hospitalName": "Vamsi Heart Care Centre",
    "latitude": 16.5112914,
    "longitude": 80.6385617,
    "experience": 27,
    "consultationFee": 600,
    "rating": 4.7,
    "patientsServed": 2537,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 90079 51277",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0163",
    "name": "Dr. Pawan Bhatt",
    "specialization": "Pulmonology",
    "hospitalId": "H027",
    "hospitalName": "Yashwanth's Lotus Dental Care",
    "latitude": 16.5255674,
    "longitude": 80.6312231,
    "experience": 2,
    "consultationFee": 500,
    "rating": 4.4,
    "patientsServed": 866,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 68100 47292",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0164",
    "name": "Dr. Preethi Dutta",
    "specialization": "Gastroenterology",
    "hospitalId": "H007",
    "hospitalName": "Crest Hospital",
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "experience": 30,
    "consultationFee": 1200,
    "rating": 4.3,
    "patientsServed": 7108,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 66546 88712",
    "gender": "Female",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0165",
    "name": "Dr. Ayaan Kulkarni",
    "specialization": "Urology",
    "hospitalId": "H003",
    "hospitalName": "Unity Hospitals",
    "latitude": 16.51228,
    "longitude": 80.6315048,
    "experience": 18,
    "consultationFee": 500,
    "rating": 4.8,
    "patientsServed": 7256,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 76512 60730",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0166",
    "name": "Dr. Ayaan Yadav",
    "specialization": "Nephrology",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "experience": 7,
    "consultationFee": 1100,
    "rating": 4.9,
    "patientsServed": 6717,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 69205 71604",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0167",
    "name": "Dr. Chandrika Singh",
    "specialization": "Oncology",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 24,
    "consultationFee": 900,
    "rating": 4.2,
    "patientsServed": 1407,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 63823 70841",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0168",
    "name": "Dr. Sai Reddy",
    "specialization": "Ophthalmology",
    "hospitalId": "H019",
    "hospitalName": "Bright Children's Hospital",
    "latitude": 16.479441,
    "longitude": 80.6992296,
    "experience": 3,
    "consultationFee": 1000,
    "rating": 4.5,
    "patientsServed": 7281,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 69044 10555",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0169",
    "name": "Dr. Geetha Menon",
    "specialization": "Psychiatry",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "experience": 13,
    "consultationFee": 500,
    "rating": 4.9,
    "patientsServed": 5514,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 88484 92889",
    "gender": "Female",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0170",
    "name": "Dr. Srinivas Sharma",
    "specialization": "Endocrinology",
    "hospitalId": "H025",
    "hospitalName": "Andhra Dental",
    "latitude": 16.5161392,
    "longitude": 80.6395497,
    "experience": 22,
    "consultationFee": 1300,
    "rating": 4.2,
    "patientsServed": 7403,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 61192 86136",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0171",
    "name": "Dr. Ayaan Pillai",
    "specialization": "Cardiology",
    "hospitalId": "H022",
    "hospitalName": "Blossoms Mother & Child Hospital",
    "latitude": 16.5070262,
    "longitude": 80.6403374,
    "experience": 28,
    "consultationFee": 800,
    "rating": 4.5,
    "patientsServed": 6526,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 82898 35630",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0172",
    "name": "Dr. Mahesh Bose",
    "specialization": "Neurology",
    "hospitalId": "H001",
    "hospitalName": "Sentini City Hospital",
    "latitude": 16.5116021,
    "longitude": 80.6329639,
    "experience": 18,
    "consultationFee": 700,
    "rating": 4.1,
    "patientsServed": 4106,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 62466 30413",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0173",
    "name": "Dr. Latha Singh",
    "specialization": "Orthopedics",
    "hospitalId": "H010",
    "hospitalName": "Dr. Sivaprasad Hrudayalaya",
    "latitude": 16.4920663,
    "longitude": 80.6671572,
    "experience": 27,
    "consultationFee": 500,
    "rating": 4.3,
    "patientsServed": 909,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 91432 66713",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0174",
    "name": "Dr. Saanvi Trivedi",
    "specialization": "Pediatrics",
    "hospitalId": "H028",
    "hospitalName": "Vijaywada ENT and Multispeciality Hospital",
    "latitude": 16.5138113,
    "longitude": 80.6332426,
    "experience": 9,
    "consultationFee": 1100,
    "rating": 4.5,
    "patientsServed": 1820,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 76357 43883",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0175",
    "name": "Dr. Venkatesh Desai",
    "specialization": "ENT",
    "hospitalId": "H012",
    "hospitalName": "Andhra Hospital Heart And Brain Institute",
    "latitude": 16.510797,
    "longitude": 80.6319443,
    "experience": 16,
    "consultationFee": 1200,
    "rating": 4.7,
    "patientsServed": 5286,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 72775 48983",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0176",
    "name": "Dr. Laxmi Bose",
    "specialization": "Dental",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 10,
    "consultationFee": 900,
    "rating": 4.5,
    "patientsServed": 7039,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 93532 64197",
    "gender": "Female",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0177",
    "name": "Dr. Naveen Chatterjee",
    "specialization": "Dermatology",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "experience": 15,
    "consultationFee": 300,
    "rating": 5,
    "patientsServed": 834,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 88327 30492",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0178",
    "name": "Dr. Reddy Reddy",
    "specialization": "Gynecology",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "experience": 10,
    "consultationFee": 400,
    "rating": 4.7,
    "patientsServed": 6093,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 80459 57369",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0179",
    "name": "Dr. Krishna Reddy",
    "specialization": "General Medicine",
    "hospitalId": "H007",
    "hospitalName": "Crest Hospital",
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "experience": 11,
    "consultationFee": 1100,
    "rating": 4.6,
    "patientsServed": 5080,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 88505 10091",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0180",
    "name": "Dr. Ayaan Patel",
    "specialization": "Pulmonology",
    "hospitalId": "H008",
    "hospitalName": "Vise Hospitals",
    "latitude": 16.4859047,
    "longitude": 80.6862126,
    "experience": 25,
    "consultationFee": 1000,
    "rating": 4.5,
    "patientsServed": 7316,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 82836 15058",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0181",
    "name": "Dr. Padma Rao",
    "specialization": "Gastroenterology",
    "hospitalId": "H012",
    "hospitalName": "Andhra Hospital Heart And Brain Institute",
    "latitude": 16.510797,
    "longitude": 80.6319443,
    "experience": 10,
    "consultationFee": 900,
    "rating": 4.6,
    "patientsServed": 1234,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 99478 32755",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0182",
    "name": "Dr. Shaurya Banerjee",
    "specialization": "Urology",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "experience": 4,
    "consultationFee": 300,
    "rating": 4.9,
    "patientsServed": 2348,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 77775 62982",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0183",
    "name": "Dr. Raju Chatterjee",
    "specialization": "Nephrology",
    "hospitalId": "H017",
    "hospitalName": "Srikara Hospitals",
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "experience": 4,
    "consultationFee": 400,
    "rating": 4.4,
    "patientsServed": 2178,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 64412 83311",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0184",
    "name": "Dr. Durga Singh",
    "specialization": "Oncology",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 19,
    "consultationFee": 700,
    "rating": 5,
    "patientsServed": 6039,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 87709 11823",
    "gender": "Female",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0185",
    "name": "Dr. Charan Chatterjee",
    "specialization": "Ophthalmology",
    "hospitalId": "H007",
    "hospitalName": "Crest Hospital",
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "experience": 15,
    "consultationFee": 1300,
    "rating": 4.3,
    "patientsServed": 414,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 72928 93927",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0186",
    "name": "Dr. Mounika Singh",
    "specialization": "Psychiatry",
    "hospitalId": "H007",
    "hospitalName": "Crest Hospital",
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "experience": 24,
    "consultationFee": 1300,
    "rating": 4.8,
    "patientsServed": 6405,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 94905 59845",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0187",
    "name": "Dr. Naveen Joshi",
    "specialization": "Endocrinology",
    "hospitalId": "H030",
    "hospitalName": "Sai Krishna ENT Hospital",
    "latitude": 16.511899,
    "longitude": 80.6338337,
    "experience": 9,
    "consultationFee": 1200,
    "rating": 4.6,
    "patientsServed": 1942,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 77214 58559",
    "gender": "Male",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0188",
    "name": "Dr. Sireesha Yadav",
    "specialization": "Cardiology",
    "hospitalId": "H017",
    "hospitalName": "Srikara Hospitals",
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "experience": 20,
    "consultationFee": 1400,
    "rating": 5,
    "patientsServed": 3091,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 64580 55198",
    "gender": "Female",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0189",
    "name": "Dr. Fatima Dutta",
    "specialization": "Neurology",
    "hospitalId": "H028",
    "hospitalName": "Vijaywada ENT and Multispeciality Hospital",
    "latitude": 16.5138113,
    "longitude": 80.6332426,
    "experience": 27,
    "consultationFee": 1500,
    "rating": 4.5,
    "patientsServed": 7736,
    "availableToday": false,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 96346 42048",
    "gender": "Female",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0190",
    "name": "Dr. Anusha Reddy",
    "specialization": "Orthopedics",
    "hospitalId": "H006",
    "hospitalName": "Aster Ramesh Hospital (Main Branch)",
    "latitude": 16.5069006,
    "longitude": 80.6560892,
    "experience": 16,
    "consultationFee": 1500,
    "rating": 4.5,
    "patientsServed": 2378,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 97943 96389",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0191",
    "name": "Dr. Sruthi Desai",
    "specialization": "Pediatrics",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "experience": 17,
    "consultationFee": 500,
    "rating": 4.8,
    "patientsServed": 1093,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 96575 26596",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0192",
    "name": "Dr. Divya Banerjee",
    "specialization": "ENT",
    "hospitalId": "H028",
    "hospitalName": "Vijaywada ENT and Multispeciality Hospital",
    "latitude": 16.5138113,
    "longitude": 80.6332426,
    "experience": 17,
    "consultationFee": 800,
    "rating": 4.9,
    "patientsServed": 2595,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 98608 14186",
    "gender": "Female",
    "availableSlots": [
      "10:00 AM",
      "02:00 PM"
    ]
  },
  {
    "id": "D0193",
    "name": "Dr. Suresh Pillai",
    "specialization": "Dental",
    "hospitalId": "H003",
    "hospitalName": "Unity Hospitals",
    "latitude": 16.51228,
    "longitude": 80.6315048,
    "experience": 17,
    "consultationFee": 1100,
    "rating": 4.4,
    "patientsServed": 7084,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 82284 36082",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0194",
    "name": "Dr. Vivaan Banerjee",
    "specialization": "Dermatology",
    "hospitalId": "H032",
    "hospitalName": "Dr. Sandeep VVK Clinic",
    "latitude": 16.4844704,
    "longitude": 80.6166102,
    "experience": 24,
    "consultationFee": 1300,
    "rating": 4.2,
    "patientsServed": 6825,
    "availableToday": false,
    "availability": "Tomorrow",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 72942 62170",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0195",
    "name": "Dr. Durga Das",
    "specialization": "Gynecology",
    "hospitalId": "H024",
    "hospitalName": "Happy Dental and General Health Care",
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "experience": 14,
    "consultationFee": 700,
    "rating": 4.8,
    "patientsServed": 2097,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 96343 41855",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0196",
    "name": "Dr. Pari Rao",
    "specialization": "General Medicine",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "experience": 15,
    "consultationFee": 800,
    "rating": 4.8,
    "patientsServed": 6898,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English"
    ],
    "phone": "+91 79224 34398",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0197",
    "name": "Dr. Harsha Sharma",
    "specialization": "Pulmonology",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "experience": 30,
    "consultationFee": 300,
    "rating": 4.8,
    "patientsServed": 2851,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu"
    ],
    "phone": "+91 68456 14236",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0198",
    "name": "Dr. Seetha Bhatt",
    "specialization": "Gastroenterology",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 2,
    "consultationFee": 1200,
    "rating": 4.9,
    "patientsServed": 414,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English"
    ],
    "phone": "+91 89091 85939",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0199",
    "name": "Dr. Ashok Banerjee",
    "specialization": "Urology",
    "hospitalId": "H025",
    "hospitalName": "Andhra Dental",
    "latitude": 16.5161392,
    "longitude": 80.6395497,
    "experience": 21,
    "consultationFee": 1300,
    "rating": 4.5,
    "patientsServed": 7755,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 87140 41745",
    "gender": "Male",
    "availableSlots": [
      "08:00 AM",
      "12:00 PM",
      "03:00 PM"
    ]
  },
  {
    "id": "D0200",
    "name": "Dr. Teja Naidu",
    "specialization": "Nephrology",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "experience": 23,
    "consultationFee": 500,
    "rating": 4.5,
    "patientsServed": 6462,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 61291 49327",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  },
  {
    "id": "D0201",
    "name": "Dr. Fatima Das",
    "specialization": "Oncology",
    "hospitalId": "H026",
    "hospitalName": "Sky Dental",
    "latitude": 16.5165514,
    "longitude": 80.6383039,
    "experience": 24,
    "consultationFee": 700,
    "rating": 4.2,
    "patientsServed": 5315,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 98238 80902",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0202",
    "name": "Dr. Krishna Iyer",
    "specialization": "Ophthalmology",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 23,
    "consultationFee": 400,
    "rating": 4.1,
    "patientsServed": 2470,
    "availableToday": false,
    "availability": "Today",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 97242 41664",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0203",
    "name": "Dr. Krishna Sen",
    "specialization": "Psychiatry",
    "hospitalId": "H019",
    "hospitalName": "Bright Children's Hospital",
    "latitude": 16.479441,
    "longitude": 80.6992296,
    "experience": 25,
    "consultationFee": 300,
    "rating": 4.4,
    "patientsServed": 3829,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MD",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 70576 26159",
    "gender": "Male",
    "availableSlots": [
      "10:30 AM",
      "02:30 PM",
      "05:30 PM"
    ]
  },
  {
    "id": "D0204",
    "name": "Dr. Harsha Iyer",
    "specialization": "Endocrinology",
    "hospitalId": "H032",
    "hospitalName": "Dr. Sandeep VVK Clinic",
    "latitude": 16.4844704,
    "longitude": 80.6166102,
    "experience": 17,
    "consultationFee": 300,
    "rating": 4.2,
    "patientsServed": 552,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 97585 89360",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0205",
    "name": "Dr. Sowmya Menon",
    "specialization": "Cardiology",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "experience": 16,
    "consultationFee": 800,
    "rating": 4.7,
    "patientsServed": 1365,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English"
    ],
    "phone": "+91 62317 53207",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0206",
    "name": "Dr. Varun Verma",
    "specialization": "Neurology",
    "hospitalId": "H031",
    "hospitalName": "Pradeep's ENT Hospital",
    "latitude": 16.5161647,
    "longitude": 80.6739827,
    "experience": 25,
    "consultationFee": 700,
    "rating": 4.4,
    "patientsServed": 3637,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 97380 97541",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0207",
    "name": "Dr. Geetha Chowdary",
    "specialization": "Orthopedics",
    "hospitalId": "H031",
    "hospitalName": "Pradeep's ENT Hospital",
    "latitude": 16.5161647,
    "longitude": 80.6739827,
    "experience": 19,
    "consultationFee": 1300,
    "rating": 4.4,
    "patientsServed": 4171,
    "availableToday": true,
    "availability": "Tomorrow",
    "qualification": "MBBS, FRCS",
    "languages": [
      "English"
    ],
    "phone": "+91 93130 79942",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0208",
    "name": "Dr. Anusha Naidu",
    "specialization": "Pediatrics",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "experience": 30,
    "consultationFee": 400,
    "rating": 4.2,
    "patientsServed": 2240,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, DNB",
    "languages": [
      "English",
      "Hindi"
    ],
    "phone": "+91 62174 58589",
    "gender": "Female",
    "availableSlots": [
      "09:00 AM",
      "01:00 PM",
      "05:00 PM"
    ]
  },
  {
    "id": "D0209",
    "name": "Dr. Vijay Kulkarni",
    "specialization": "ENT",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "experience": 10,
    "consultationFee": 600,
    "rating": 4.2,
    "patientsServed": 1781,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 83627 76382",
    "gender": "Male",
    "availableSlots": [
      "09:00 AM",
      "11:00 AM"
    ]
  },
  {
    "id": "D0210",
    "name": "Dr. Advik Iyer",
    "specialization": "Dental",
    "hospitalId": "H025",
    "hospitalName": "Andhra Dental",
    "latitude": 16.5161392,
    "longitude": 80.6395497,
    "experience": 25,
    "consultationFee": 900,
    "rating": 4.3,
    "patientsServed": 1472,
    "availableToday": true,
    "availability": "Today",
    "qualification": "MBBS, MS",
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "phone": "+91 88500 74737",
    "gender": "Male",
    "availableSlots": [
      "11:00 AM",
      "04:00 PM",
      "06:00 PM"
    ]
  }
]
