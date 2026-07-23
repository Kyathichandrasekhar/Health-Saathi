import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore'
import { db } from './firebase'
import { Doctor } from '../types/doctor'
import { SAMPLE_DOCTORS, SAMPLE_HOSPITALS, SampleHospital } from './doctorData'

const DOCTORS_COLLECTION = 'doctors'
const HOSPITALS_COLLECTION = 'hospitals'
const DOCTOR_LOCAL_STORAGE_KEY = 'hs_doctors_cache_v2'

// Standardize doctor object fields between Firestore schema and Doctor type
function normalizeDoctorFromDoc(id: string, data: any): Doctor {
  return {
    id: id || data.doctorId || data.id,
    name: data.doctorName || data.name || 'Dr. Specialist',
    specialization: data.specialization || 'General Physician',
    hospitalId: data.hospitalId || 'hosp-1',
    hospitalName: data.hospitalName || 'Hospital',
    latitude: Number(data.latitude) || 16.5062,
    longitude: Number(data.longitude) || 80.648,
    experience: Number(data.experience) || 5,
    rating: Number(data.rating) || 4.5,
    consultationFee: Number(data.consultationFee || data.fee) || 500,
    availableToday: data.availableToday ?? (data.availability === 'Today' || true),
    availability: (data.availability as any) || 'Today',
    qualification: data.qualification || 'MBBS',
    languages: Array.isArray(data.languages) ? data.languages : ['English', 'Telugu'],
    phone: data.phone || '+91 98480 00000',
    gender: data.gender || 'Male',
    patientsServed: Number(data.patientsServed) || 500,
    availableSlots: Array.isArray(data.availableSlots) ? data.availableSlots : ['10:00 AM', '02:00 PM'],
  }
}

// Convert Doctor type to Firestore document structure
function toFirestoreDoctorDoc(doctor: Doctor) {
  return {
    doctorId: doctor.id,
    hospitalId: doctor.hospitalId,
    doctorName: doctor.name,
    specialization: doctor.specialization,
    experience: doctor.experience,
    consultationFee: doctor.consultationFee,
    availability: doctor.availability,
    rating: doctor.rating,
    qualification: doctor.qualification,
    languages: doctor.languages,
    phone: doctor.phone,
    patientsServed: doctor.patientsServed,
    latitude: doctor.latitude,
    longitude: doctor.longitude,
    availableToday: doctor.availableToday,
    hospitalName: doctor.hospitalName,
    gender: doctor.gender,
    availableSlots: doctor.availableSlots || ['10:00 AM', '02:00 PM'],
  }
}

// Local cache helpers
export function getLocalDoctorsCache(): Doctor[] {
  try {
    const cached = localStorage.getItem(DOCTOR_LOCAL_STORAGE_KEY)
    if (cached) {
      const parsed = JSON.parse(cached)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {
    // Ignore error
  }
  return SAMPLE_DOCTORS
}

export function saveLocalDoctorsCache(doctors: Doctor[]) {
  try {
    localStorage.setItem(DOCTOR_LOCAL_STORAGE_KEY, JSON.stringify(doctors))
  } catch {
    // Ignore error
  }
}


// ─── In-Memory Singleton Cache (avoids Firestore re-fetch on every mount) ───
let _doctorsMemoryCache: Doctor[] | null = null
let _fetchPromise: Promise<Doctor[]> | null = null

/** Clear the in-memory cache (e.g. after Admin CRUD operations) */
export function clearDoctorsMemoryCache() {
  _doctorsMemoryCache = null
  _fetchPromise = null
}

// Fetch all doctors from Firestore with local fallback
export async function getDoctors(): Promise<Doctor[]> {
  if (_doctorsMemoryCache !== null) {
    return _doctorsMemoryCache
  }
  
  const local = getLocalDoctorsCache()
  if (local.length > 0) {
    _doctorsMemoryCache = local
    return local
  }

  // Fallback to purely local dataset for hackathon
  _doctorsMemoryCache = SAMPLE_DOCTORS
  saveLocalDoctorsCache(SAMPLE_DOCTORS)
  return SAMPLE_DOCTORS
}


// Fetch all hospitals from Firestore
export async function getFirestoreHospitals(): Promise<SampleHospital[]> {
  return SAMPLE_HOSPITALS
}

// Seed initial data into Firestore if empty
export async function seedInitialDataIfNeeded() {
  // Disabled for hackathon purely local demo mode
}

// Add new doctor (Firestore + Local)
export async function addDoctor(doctor: Doctor): Promise<Doctor> {
  const newDoctor: Doctor = {
    ...doctor,
    id: `doc-${Date.now()}`,
  }

  const currentCache = getLocalDoctorsCache()
  const updated = [newDoctor, ...currentCache]
  saveLocalDoctorsCache(updated)
  _doctorsMemoryCache = updated  // invalidate in-memory cache

  return newDoctor
}

// Update existing doctor
export async function updateDoctor(doctorId: string, updates: Partial<Doctor>): Promise<Doctor | null> {
  const currentCache = getLocalDoctorsCache()
  const index = currentCache.findIndex((d) => d.id === doctorId)
  if (index === -1) return null

  const updatedDoctor = { ...currentCache[index], ...updates }
  
  currentCache[index] = updatedDoctor
  saveLocalDoctorsCache(currentCache)
  _doctorsMemoryCache = [...currentCache]  // invalidate in-memory cache

  return updatedDoctor
}

// Delete doctor
export async function deleteDoctor(doctorId: string): Promise<boolean> {
  const currentCache = getLocalDoctorsCache()
  const filtered = currentCache.filter((d) => d.id !== doctorId)
  saveLocalDoctorsCache(filtered)
  _doctorsMemoryCache = filtered  // invalidate in-memory cache

  return true
}

// Query doctors by specialization
export async function getDoctorsBySpecialization(spec: string): Promise<Doctor[]> {
  const all = await getDoctors()
  const q = spec.trim().toLowerCase()
  return all.filter((d) => d.specialization.toLowerCase().includes(q))
}
