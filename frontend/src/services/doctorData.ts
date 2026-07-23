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
    "name": "Dr. Siva Prasad Reddy",
    "specialization": "Pulmonology",
    "hospitalId": "H001",
    "hospitalName": "Sentini City Hospital",
    "latitude": 16.5116021,
    "longitude": 80.6329639,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0001",
    "experience": 17,
    "consultationFee": 800,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.7,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 73521 04108",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0002",
    "name": "Dr. Thota Naveen",
    "specialization": "General Medicine",
    "hospitalId": "H001",
    "hospitalName": "Sentini City Hospital",
    "latitude": 16.5116021,
    "longitude": 80.6329639,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0002",
    "experience": 16,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.9,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 73521 04108",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0003",
    "name": "Dr. Indra Mohan",
    "specialization": "Neurosurgery",
    "hospitalId": "H002",
    "hospitalName": "Cherish Multispeciality Hospital",
    "latitude": 16.5135609,
    "longitude": 80.6345067,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0003",
    "experience": 10,
    "consultationFee": 1500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.3,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 82474 42686",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0004",
    "name": "Dr. Vijay Kumar",
    "specialization": "Surgery/Orthopedics",
    "hospitalId": "H003",
    "hospitalName": "Unity Hospitals",
    "latitude": 16.51228,
    "longitude": 80.6315048,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0004",
    "experience": 15,
    "consultationFee": 1200,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 663 3108",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0005",
    "name": "Dr. I. Sandeep",
    "specialization": "General Medicine",
    "hospitalId": "H003",
    "hospitalName": "Unity Hospitals",
    "latitude": 16.51228,
    "longitude": 80.6315048,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0005",
    "experience": 22,
    "consultationFee": 500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 663 3108",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0006",
    "name": "Dr. N. Maheedhar Reddy",
    "specialization": "Consultant",
    "hospitalId": "H003",
    "hospitalName": "Unity Hospitals",
    "latitude": 16.51228,
    "longitude": 80.6315048,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0006",
    "experience": 6,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.5,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 663 3108",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0007",
    "name": "Dr. V. Jagadeesh Reddy",
    "specialization": "Spine Surgery",
    "hospitalId": "H003",
    "hospitalName": "Unity Hospitals",
    "latitude": 16.51228,
    "longitude": 80.6315048,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0007",
    "experience": 8,
    "consultationFee": 1500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.8,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 663 3108",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0008",
    "name": "Dr. Venkateswara Rao",
    "specialization": "Pediatrics",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0008",
    "experience": 14,
    "consultationFee": 500,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.6,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 83097 81565",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0009",
    "name": "Dr. Chandu Vineela",
    "specialization": "Pediatrics",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0009",
    "experience": 10,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.3,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 83097 81565",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0010",
    "name": "Dr. Venkata Ramana",
    "specialization": "Pediatrics",
    "hospitalId": "H004",
    "hospitalName": "Sri Venkateswara Children & Multispeciality Hospital",
    "latitude": 16.5099848,
    "longitude": 80.6369907,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0010",
    "experience": 23,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.3,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 83097 81565",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0011",
    "name": "Dr. Meena Medikonda",
    "specialization": "Neuro Psychiatry",
    "hospitalId": "H005",
    "hospitalName": "Latha Super Speciality Hospital",
    "latitude": 16.5095838,
    "longitude": 80.635925,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0011",
    "experience": 6,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.7,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 98484 09889",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0012",
    "name": "Dr. Pramod",
    "specialization": "General Medicine",
    "hospitalId": "H005",
    "hospitalName": "Latha Super Speciality Hospital",
    "latitude": 16.5095838,
    "longitude": 80.635925,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0012",
    "experience": 6,
    "consultationFee": 1500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.9,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 98484 09889",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0013",
    "name": "Dr. P. E. Sonyial",
    "specialization": "Neurosurgery",
    "hospitalId": "H005",
    "hospitalName": "Latha Super Speciality Hospital",
    "latitude": 16.5095838,
    "longitude": 80.635925,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0013",
    "experience": 7,
    "consultationFee": 500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.5,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 98484 09889",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0014",
    "name": "Dr. Anne Mahesh Krishna",
    "specialization": "Cardiology/Vascular",
    "hospitalId": "H006",
    "hospitalName": "Aster Ramesh Hospital (Main Branch)",
    "latitude": 16.5069006,
    "longitude": 80.6560892,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0014",
    "experience": 23,
    "consultationFee": 500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.9,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 246 3463",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0015",
    "name": "Dr. Sai Kiranmayee",
    "specialization": "General Medicine",
    "hospitalId": "H006",
    "hospitalName": "Aster Ramesh Hospital (Main Branch)",
    "latitude": 16.5069006,
    "longitude": 80.6560892,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0015",
    "experience": 19,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.8,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 246 3463",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0016",
    "name": "Dr. Surendra Jasti",
    "specialization": "Gastroenterology",
    "hospitalId": "H007",
    "hospitalName": "Crest Hospital",
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0016",
    "experience": 25,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.4,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 92819 99934",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0017",
    "name": "Dr. Manu Jasti",
    "specialization": "Gynecology",
    "hospitalId": "H007",
    "hospitalName": "Crest Hospital",
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0017",
    "experience": 12,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.7,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 92819 99934",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0018",
    "name": "Dr. Varshini Tummala",
    "specialization": "Gynecology",
    "hospitalId": "H007",
    "hospitalName": "Crest Hospital",
    "latitude": 16.5102768,
    "longitude": 80.6728334,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0018",
    "experience": 14,
    "consultationFee": 1500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 5,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 92819 99934",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0019",
    "name": "Dr. Ramya",
    "specialization": "Gynecology",
    "hospitalId": "H008",
    "hospitalName": "Vise Hospitals",
    "latitude": 16.4859047,
    "longitude": 80.6862126,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0019",
    "experience": 14,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.1,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 62626 27799",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0020",
    "name": "Dr. Pavan",
    "specialization": "Surgical Gastroenterology",
    "hospitalId": "H008",
    "hospitalName": "Vise Hospitals",
    "latitude": 16.4859047,
    "longitude": 80.6862126,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0020",
    "experience": 11,
    "consultationFee": 1200,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.1,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 62626 27799",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0021",
    "name": "Dr. Pavan Kumar",
    "specialization": "ENT",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0021",
    "experience": 22,
    "consultationFee": 500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.2,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 243 8688",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0022",
    "name": "Dr. Pallem Peddeswara",
    "specialization": "Consultant",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0022",
    "experience": 19,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.2,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 243 8688",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0023",
    "name": "Dr. Pallem Aakash",
    "specialization": "Consultant",
    "hospitalId": "H009",
    "hospitalName": "Peddeswar Health Care Center (PHCC)",
    "latitude": 16.5112621,
    "longitude": 80.6358198,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0023",
    "experience": 12,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.9,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 243 8688",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0024",
    "name": "Dr. Siva Prasad",
    "specialization": "Cardiology",
    "hospitalId": "H010",
    "hospitalName": "Dr. Sivaprasad Hrudayalaya",
    "latitude": 16.4920663,
    "longitude": 80.6671572,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0024",
    "experience": 21,
    "consultationFee": 800,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.9,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 98492 73634",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0025",
    "name": "Dr. Nagarjuna",
    "specialization": "Cardiology",
    "hospitalId": "H010",
    "hospitalName": "Dr. Sivaprasad Hrudayalaya",
    "latitude": 16.4920663,
    "longitude": 80.6671572,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0025",
    "experience": 5,
    "consultationFee": 1200,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.9,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 98492 73634",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0026",
    "name": "Dr. Vamsi",
    "specialization": "Cardiology",
    "hospitalId": "H011",
    "hospitalName": "Vamsi Heart Care Centre",
    "latitude": 16.5112914,
    "longitude": 80.6385617,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0026",
    "experience": 9,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.2,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 95422 53858",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0027",
    "name": "Dr. Dilip",
    "specialization": "Cardiology",
    "hospitalId": "H012",
    "hospitalName": "Andhra Hospital Heart And Brain Institute",
    "latitude": 16.510797,
    "longitude": 80.6319443,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0027",
    "experience": 19,
    "consultationFee": 1200,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.3,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 244 2333",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0028",
    "name": "Dr. Chaitanya",
    "specialization": "Cardiology",
    "hospitalId": "H013",
    "hospitalName": "Medstar Hospitals (Chaitanya Cardio Centre)",
    "latitude": 16.5092856,
    "longitude": 80.6373321,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0028",
    "experience": 5,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.6,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 73966 26379",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0029",
    "name": "Dr. MJ Naidu",
    "specialization": "Orthopedics",
    "hospitalId": "H014",
    "hospitalName": "MJ Naidu Super Speciality Hospital",
    "latitude": 16.5112572,
    "longitude": 80.6381876,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0029",
    "experience": 8,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.3,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 90401 33302",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0030",
    "name": "Dr. M. Vinod Kumar",
    "specialization": "Orthopedics",
    "hospitalId": "H015",
    "hospitalName": "Shreyas Ortho & Skin Multispeciality Hospital",
    "latitude": 16.5384146,
    "longitude": 80.5996132,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0030",
    "experience": 14,
    "consultationFee": 800,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.4,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 91549 65555",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0031",
    "name": "Dr. M. V. Hari Prasad",
    "specialization": "Orthopedics",
    "hospitalId": "H016",
    "hospitalName": "Roopa Orthopaedic & Joint Replacement Hospital",
    "latitude": 16.4923374,
    "longitude": 80.6655711,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0031",
    "experience": 23,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.6,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 80069 00600",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0032",
    "name": "Dr. Krishna Vasisst",
    "specialization": "Orthopedics",
    "hospitalId": "H016",
    "hospitalName": "Roopa Orthopaedic & Joint Replacement Hospital",
    "latitude": 16.4923374,
    "longitude": 80.6655711,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0032",
    "experience": 17,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.3,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 80069 00600",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0033",
    "name": "Dr. Manoj",
    "specialization": "Orthopedics",
    "hospitalId": "H017",
    "hospitalName": "Srikara Hospitals",
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0033",
    "experience": 19,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.7,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 661 2345",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0034",
    "name": "Dr. Harish",
    "specialization": "Orthopedics",
    "hospitalId": "H017",
    "hospitalName": "Srikara Hospitals",
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0034",
    "experience": 7,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.6,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 661 2345",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0035",
    "name": "Dr. Akhil Dadi",
    "specialization": "Orthopedics",
    "hospitalId": "H017",
    "hospitalName": "Srikara Hospitals",
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0035",
    "experience": 15,
    "consultationFee": 800,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.9,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 661 2345",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0036",
    "name": "Dr. P. Vamsa Vardhan Reddy",
    "specialization": "General Surgery",
    "hospitalId": "H017",
    "hospitalName": "Srikara Hospitals",
    "latitude": 16.5021392,
    "longitude": 80.7008501,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0036",
    "experience": 14,
    "consultationFee": 500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.5,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 661 2345",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0037",
    "name": "Dr. Prashanth Chalasani",
    "specialization": "Sports Medicine",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0037",
    "experience": 23,
    "consultationFee": 800,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.6,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 96925 25969",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0038",
    "name": "Dr. K V R Kishore Kumar",
    "specialization": "Neuro/Spine Surgery",
    "hospitalId": "H018",
    "hospitalName": "Dr. Prashanth Chalasani Clinic (Bezwada Hospitals)",
    "latitude": 16.5111994,
    "longitude": 80.6306754,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0038",
    "experience": 9,
    "consultationFee": 800,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 5,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 96925 25969",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0039",
    "name": "Dr. Karthik Reddy",
    "specialization": "Pediatrics",
    "hospitalId": "H019",
    "hospitalName": "Bright Children's Hospital",
    "latitude": 16.479441,
    "longitude": 80.6992296,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0039",
    "experience": 23,
    "consultationFee": 1500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.1,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 80000 00000",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0040",
    "name": "Dr. Srinivas",
    "specialization": "Pediatrics",
    "hospitalId": "H019",
    "hospitalName": "Bright Children's Hospital",
    "latitude": 16.479441,
    "longitude": 80.6992296,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0040",
    "experience": 8,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.8,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 80000 00000",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0041",
    "name": "Dr. L. Bhubaneswara Rao",
    "specialization": "Pediatrics",
    "hospitalId": "H020",
    "hospitalName": "Sri Srinivasa Children's Hospital",
    "latitude": 16.5134943,
    "longitude": 80.6339568,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0041",
    "experience": 22,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.9,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 243 8090",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0042",
    "name": "Dr. D V S Sridhar",
    "specialization": "Pediatrics",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0042",
    "experience": 12,
    "consultationFee": 800,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.7,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 80 6966 2201",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0043",
    "name": "Dr. Raju",
    "specialization": "Pediatrics",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0043",
    "experience": 24,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.8,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 80 6966 2201",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0044",
    "name": "Dr. Nirupama Vaddi",
    "specialization": "Gynecology",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0044",
    "experience": 12,
    "consultationFee": 500,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.6,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 80 6966 2201",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0045",
    "name": "Dr. Pallavi Atluri",
    "specialization": "Pediatrics",
    "hospitalId": "H021",
    "hospitalName": "Rainbow Children's Hospital",
    "latitude": 16.5177728,
    "longitude": 80.6738606,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0045",
    "experience": 25,
    "consultationFee": 1500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.7,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 80 6966 2201",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0046",
    "name": "Dr. Sivaram",
    "specialization": "ENT",
    "hospitalId": "H022",
    "hospitalName": "Blossoms Mother & Child Hospital",
    "latitude": 16.5070262,
    "longitude": 80.6403374,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0046",
    "experience": 10,
    "consultationFee": 500,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.3,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 800 241 9999",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0047",
    "name": "Dr. J. Srinivasa Kishore",
    "specialization": "Pediatric Surgery",
    "hospitalId": "H022",
    "hospitalName": "Blossoms Mother & Child Hospital",
    "latitude": 16.5070262,
    "longitude": 80.6403374,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0047",
    "experience": 16,
    "consultationFee": 1200,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.8,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 800 241 9999",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0048",
    "name": "Dr. Bindu",
    "specialization": "Dental",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0048",
    "experience": 18,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.5,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 70756 75299",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0049",
    "name": "Dr. Divya",
    "specialization": "Dental",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0049",
    "experience": 13,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.1,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 70756 75299",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0050",
    "name": "Dr. Hima Bindhu",
    "specialization": "Dental",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0050",
    "experience": 10,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.6,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 70756 75299",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0051",
    "name": "Dr. Ramya",
    "specialization": "Dental",
    "hospitalId": "H023",
    "hospitalName": "Asian Dental",
    "latitude": 16.5014395,
    "longitude": 80.6462778,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0051",
    "experience": 7,
    "consultationFee": 500,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.9,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 70756 75299",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0052",
    "name": "Dr. Varun",
    "specialization": "Dental",
    "hospitalId": "H024",
    "hospitalName": "Happy Dental and General Health Care",
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0052",
    "experience": 23,
    "consultationFee": 800,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.1,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 90597 68696",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0053",
    "name": "Dr. Ramya",
    "specialization": "Dental",
    "hospitalId": "H024",
    "hospitalName": "Happy Dental and General Health Care",
    "latitude": 16.5110385,
    "longitude": 80.6311097,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0053",
    "experience": 6,
    "consultationFee": 800,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.7,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 90597 68696",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0054",
    "name": "Dr. Dara Swetha",
    "specialization": "Dental",
    "hospitalId": "H026",
    "hospitalName": "Sky Dental",
    "latitude": 16.5165514,
    "longitude": 80.6383039,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0054",
    "experience": 6,
    "consultationFee": 1500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.7,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 70138 09070",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0055",
    "name": "Dr. Chaitanya",
    "specialization": "Dental",
    "hospitalId": "H026",
    "hospitalName": "Sky Dental",
    "latitude": 16.5165514,
    "longitude": 80.6383039,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0055",
    "experience": 16,
    "consultationFee": 1200,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.2,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 70138 09070",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0056",
    "name": "Dr. Ramya",
    "specialization": "Dental",
    "hospitalId": "H027",
    "hospitalName": "Yashwanth's Lotus Dental Care",
    "latitude": 16.5255674,
    "longitude": 80.6312231,
    "gender": "Female",
    "profileImage": "https://avatar.iran.liara.run/public/girl?username=D0056",
    "experience": 7,
    "consultationFee": 500,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.7,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 90325 55844",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0057",
    "name": "Dr. N.V.B.B Prasad",
    "specialization": "ENT",
    "hospitalId": "H028",
    "hospitalName": "Vijaywada ENT and Multispeciality Hospital",
    "latitude": 16.5138113,
    "longitude": 80.6332426,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0057",
    "experience": 16,
    "consultationFee": 1500,
    "languages": [
      "English",
      "Telugu",
      "Hindi"
    ],
    "rating": 4.4,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 92921 04108",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0058",
    "name": "Dr. Vidya Sagar",
    "specialization": "ENT",
    "hospitalId": "H029",
    "hospitalName": "Sagar ENT - Head & Neck Super Speciality Hospital",
    "latitude": 16.5124697,
    "longitude": 80.637907,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0058",
    "experience": 10,
    "consultationFee": 1200,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.2,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 244 0806",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0059",
    "name": "Dr. Lavan Kumar",
    "specialization": "ENT",
    "hospitalId": "H029",
    "hospitalName": "Sagar ENT - Head & Neck Super Speciality Hospital",
    "latitude": 16.5124697,
    "longitude": 80.637907,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0059",
    "experience": 24,
    "consultationFee": 700,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.9,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 244 0806",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0060",
    "name": "Dr. Manne Venkata Ratnam",
    "specialization": "ENT",
    "hospitalId": "H030",
    "hospitalName": "Sai Krishna ENT Hospital",
    "latitude": 16.511899,
    "longitude": 80.6338337,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0060",
    "experience": 19,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.3,
    "qualification": "MBBS, MS",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 866 243 6799",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0061",
    "name": "Dr. Pradeep",
    "specialization": "ENT",
    "hospitalId": "H031",
    "hospitalName": "Pradeep's ENT Hospital",
    "latitude": 16.5161647,
    "longitude": 80.6739827,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0061",
    "experience": 20,
    "consultationFee": 1000,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.6,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 94942 44233",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  },
  {
    "id": "D0062",
    "name": "Dr. Sandeep VVK",
    "specialization": "ENT",
    "hospitalId": "H032",
    "hospitalName": "Dr. Sandeep VVK Clinic",
    "latitude": 16.4844704,
    "longitude": 80.6166102,
    "gender": "Male",
    "profileImage": "https://avatar.iran.liara.run/public/boy?username=D0062",
    "experience": 25,
    "consultationFee": 1500,
    "languages": [
      "English",
      "Telugu"
    ],
    "rating": 4.3,
    "qualification": "MBBS, MD",
    "availableToday": true,
    "availability": "Today",
    "phone": "+91 1800 102 4647",
    "availableSlots": [
      "09:00 AM",
      "10:30 AM",
      "02:00 PM",
      "04:30 PM"
    ]
  }
]
