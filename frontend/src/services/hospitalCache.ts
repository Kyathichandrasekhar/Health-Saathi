import { hospitalAPI, type InternalHospital } from './api'

const INTERNAL_HOSPITAL_CACHE_KEY = 'hs_internal_hospitals_cache_v1'
const MAP_HOSPITAL_CACHE_KEY = 'hs_nearby_hospitals_cache_v1'
const INTERNAL_CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 8

let memoryHospitals: InternalHospital[] = []
let memoryTimestamp = 0
let inFlightHospitalsPromise: Promise<InternalHospital[]> | null = null

interface MapHospitalProfile {
  id: string
  name: string
  address: string
  lat?: number
  lng?: number
  location?: { lat: number; lng: number }
}

function toInternalHospitalFromMap(hospital: MapHospitalProfile): InternalHospital | null {
  const lat = hospital.location?.lat ?? hospital.lat
  const lng = hospital.location?.lng ?? hospital.lng

  if (!hospital.id || !hospital.name || typeof lat !== 'number' || typeof lng !== 'number') {
    return null
  }

  return {
    id: String(hospital.id),
    name: hospital.name,
    address: hospital.address || 'Address unavailable',
    lat,
    lng,
  }
}

function mergeUniqueHospitals(...lists: InternalHospital[][]): InternalHospital[] {
  const seen = new Set<string>()
  const merged: InternalHospital[] = []

  for (const list of lists) {
    for (const hospital of list) {
      const key = `${hospital.name.toLowerCase().trim()}|${hospital.lat.toFixed(4)}|${hospital.lng.toFixed(4)}`
      if (seen.has(key)) {
        continue
      }
      seen.add(key)
      merged.push(hospital)
    }
  }

  return merged
}

export function readInternalHospitalCache(maxAgeMs = INTERNAL_CACHE_MAX_AGE_MS): InternalHospital[] {
  try {
    const raw = localStorage.getItem(INTERNAL_HOSPITAL_CACHE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as {
      ts?: number
      hospitals?: InternalHospital[]
    }

    if (!parsed?.ts || Date.now() - parsed.ts > maxAgeMs) {
      return []
    }

    return Array.isArray(parsed.hospitals) ? parsed.hospitals : []
  } catch {
    return []
  }
}

export function writeInternalHospitalCache(hospitals: InternalHospital[]) {
  memoryHospitals = hospitals
  memoryTimestamp = Date.now()

  try {
    localStorage.setItem(
      INTERNAL_HOSPITAL_CACHE_KEY,
      JSON.stringify({
        ts: memoryTimestamp,
        hospitals,
      }),
    )
  } catch {
    // Ignore localStorage write failures.
  }
}

export function readMapHospitalCache(maxAgeMs = 1000 * 60 * 60 * 2): InternalHospital[] {
  try {
    const raw = localStorage.getItem(MAP_HOSPITAL_CACHE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as {
      ts?: number
      hospitals?: MapHospitalProfile[]
    }

    if (!parsed?.ts || Date.now() - parsed.ts > maxAgeMs) {
      return []
    }

    if (!Array.isArray(parsed.hospitals)) {
      return []
    }

    return parsed.hospitals
      .map(toInternalHospitalFromMap)
      .filter((hospital): hospital is InternalHospital => hospital !== null)
  } catch {
    return []
  }
}

export function getHydratedHospitals(): InternalHospital[] {
  const freshMemory = Date.now() - memoryTimestamp <= INTERNAL_CACHE_MAX_AGE_MS ? memoryHospitals : []
  const diskInternal = readInternalHospitalCache()
  const diskMap = readMapHospitalCache()
  return mergeUniqueHospitals(freshMemory, diskInternal, diskMap)
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error('Hospital cache warm-up timed out'))
    }, timeoutMs)

    promise
      .then((result) => {
        window.clearTimeout(timer)
        resolve(result)
      })
      .catch((error) => {
        window.clearTimeout(timer)
        reject(error)
      })
  })
}

export async function warmHospitalsCache() {
  if (Date.now() - memoryTimestamp <= INTERNAL_CACHE_MAX_AGE_MS && memoryHospitals.length > 0) {
    return memoryHospitals
  }

  const diskCached = readInternalHospitalCache()
  if (diskCached.length > 0) {
    memoryHospitals = diskCached
    memoryTimestamp = Date.now()
    return diskCached
  }

  if (inFlightHospitalsPromise) {
    return inFlightHospitalsPromise
  }

  inFlightHospitalsPromise = withTimeout(
    hospitalAPI.getAll({ compact: true }),
    4000,
  )
    .then((hospitals) => {
      if (Array.isArray(hospitals) && hospitals.length > 0) {
        writeInternalHospitalCache(hospitals)
      }
      return hospitals
    })
    .finally(() => {
      inFlightHospitalsPromise = null
    })

  return inFlightHospitalsPromise
}
