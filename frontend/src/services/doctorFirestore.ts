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
const DOCTOR_LOCAL_STORAGE_KEY = 'hs_doctors_cache_v1'

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
    profileImage: data.image || data.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    qualification: data.qualification || 'MBBS',
    languages: Array.isArray(data.languages) ? data.languages : ['English', 'Telugu'],
    phone: data.phone || '+91 98480 00000',
    gender: data.gender || 'Male',
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
    image: doctor.profileImage,
    phone: doctor.phone,
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
  // 1. Hot path: in-memory cache (same tab, no Firestore round-trip)
  if (_doctorsMemoryCache !== null) {
    return _doctorsMemoryCache
  }

  // 2. Deduplicate concurrent callers — return the same in-flight promise
  if (_fetchPromise) {
    return _fetchPromise
  }

  _fetchPromise = (async () => {
    try {
      const querySnapshot = await getDocs(collection(db, DOCTORS_COLLECTION))
      if (!querySnapshot.empty) {
        const docs = querySnapshot.docs.map((docSnap) =>
          normalizeDoctorFromDoc(docSnap.id, docSnap.data()),
        )
        saveLocalDoctorsCache(docs)
        _doctorsMemoryCache = docs
        return docs
      }
      // If Firestore collection is empty, trigger seed in background and return sample
      void seedInitialDataIfNeeded()
    } catch {
      // Fallback if Firestore read fails
    }

    const local = getLocalDoctorsCache()
    _doctorsMemoryCache = local
    return local
  })()

  try {
    return await _fetchPromise
  } finally {
    // Clear promise slot so errors can retry but successes stay cached
    _fetchPromise = null
  }
}


// Fetch all hospitals from Firestore
export async function getFirestoreHospitals(): Promise<SampleHospital[]> {
  try {
    const querySnapshot = await getDocs(collection(db, HOSPITALS_COLLECTION))
    if (!querySnapshot.empty) {
      return querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<SampleHospital, 'id'>),
      }))
    }
  } catch {
    // Fallback
  }
  return SAMPLE_HOSPITALS
}

// Seed initial data into Firestore if empty
export async function seedInitialDataIfNeeded() {
  try {
    const docsSnap = await getDocs(collection(db, DOCTORS_COLLECTION))
    if (docsSnap.empty) {
      // Seed hospitals
      for (const hosp of SAMPLE_HOSPITALS) {
        await setDoc(doc(db, HOSPITALS_COLLECTION, hosp.id), {
          hospitalId: hosp.id,
          name: hosp.name,
          address: hosp.address,
          latitude: hosp.latitude,
          longitude: hosp.longitude,
          departments: hosp.departments,
          phone: hosp.phone,
          rating: hosp.rating,
        })
      }

      // Seed doctors
      for (const docItem of SAMPLE_DOCTORS) {
        await setDoc(doc(db, DOCTORS_COLLECTION, docItem.id), toFirestoreDoctorDoc(docItem))
      }
    }
  } catch {
    // Ignore seed failures in offline environment
  }
}

// Add new doctor (Firestore + Local)
export async function addDoctor(doctor: Doctor): Promise<Doctor> {
  const docRef = doc(collection(db, DOCTORS_COLLECTION))
  const newDoctor: Doctor = {
    ...doctor,
    id: docRef.id || `doc-${Date.now()}`,
  }

  try {
    await setDoc(docRef, toFirestoreDoctorDoc(newDoctor))
  } catch {
    // Firestore write error handled gracefully
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

  try {
    const docRef = doc(db, DOCTORS_COLLECTION, doctorId)
    await updateDoc(docRef, toFirestoreDoctorDoc(updatedDoctor))
  } catch {
    // Ignore Firestore write error
  }

  currentCache[index] = updatedDoctor
  saveLocalDoctorsCache(currentCache)
  _doctorsMemoryCache = [...currentCache]  // invalidate in-memory cache

  return updatedDoctor
}

// Delete doctor
export async function deleteDoctor(doctorId: string): Promise<boolean> {
  try {
    const docRef = doc(db, DOCTORS_COLLECTION, doctorId)
    await deleteDoc(docRef)
  } catch {
    // Ignore Firestore delete error
  }

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
