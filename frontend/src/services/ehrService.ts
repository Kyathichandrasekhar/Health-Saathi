import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { db, storage } from './firebase'

export interface MedicalRecord {
  id: string
  patientId: string
  title: string
  recordType: 'prescription' | 'report' | 'scan' | 'other'
  fileUrl: string
  storagePath: string
  notes?: string
  uploadedAt: string
}

// ─── IndexedDB Persistent Object Storage ───
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('health_saathi_ehr_db', 1)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files')
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function storeFileInDB(id: string, file: File): Promise<void> {
  try {
    const dbInstance = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction('files', 'readwrite')
      const store = transaction.objectStore('files')
      const request = store.put(file, id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.error("IndexedDB store failed:", err)
  }
}

async function getFileFromDB(id: string): Promise<File | null> {
  try {
    const dbInstance = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction('files', 'readonly')
      const store = transaction.objectStore('files')
      const request = store.get(id)
      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.error("IndexedDB fetch failed:", err)
    return null
  }
}

async function deleteFileFromDB(id: string): Promise<void> {
  try {
    const dbInstance = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = dbInstance.transaction('files', 'readwrite')
      const store = transaction.objectStore('files')
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  } catch (err) {
    console.error("IndexedDB delete failed:", err)
  }
}

// In-memory runtime cache to keep active ObjectURLs alive (prevents garbage collection)
const sessionFileCache = new Map<string, string>();

// Local storage fallback metadata helpers
function getLocalRecords(userId: string): MedicalRecord[] {
  try {
    const cached = localStorage.getItem(`ehr_records_local_${userId}`)
    return cached ? JSON.parse(cached) : []
  } catch {
    return []
  }
}

function saveLocalRecord(userId: string, record: MedicalRecord) {
  const current = getLocalRecords(userId)
  const updated = [record, ...current]
  localStorage.setItem(`ehr_records_local_${userId}`, JSON.stringify(updated))
}

function deleteLocalRecord(userId: string, recordId: string) {
  try {
    const current = getLocalRecords(userId)
    const filtered = current.filter((r) => r.id !== recordId)
    localStorage.setItem(`ehr_records_local_${userId}`, JSON.stringify(filtered))
  } catch (err) {
    console.error("Local storage access failed:", err)
  }
}

/**
 * Uploads a medical record document (PDF/Image) to storage and saves metadata in Firestore.
 * Falls back to LocalStorage & IndexedDB (offline mode) if Firebase fails or hangs.
 */
export async function uploadMedicalRecord(
  userId: string,
  file: File,
  title: string,
  recordType: 'prescription' | 'report' | 'scan' | 'other',
  notes: string
): Promise<MedicalRecord> {
  const firebaseUploadAttempt = async () => {
    const fileExtension = file.name.split('.').pop() || 'dat'
    const storagePath = `ehr/${userId}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExtension}`
    const storageRef = ref(storage, storagePath)

    // Attempt Firebase Storage Upload
    await uploadBytes(storageRef, file)
    const fileUrl = await getDownloadURL(storageRef)

    // Save metadata in Firestore
    const recordData = {
      patientId: userId,
      title,
      recordType,
      fileUrl,
      storagePath,
      notes,
      uploadedAt: new Date().toISOString(),
    }

    const docRef = await addDoc(collection(db, 'medical_records'), recordData)

    return {
      id: docRef.id,
      ...recordData,
    }
  }

  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Firebase upload timed out')), 4000)
  )

  try {
    // Attempt cloud upload first
    return await Promise.race([firebaseUploadAttempt(), timeoutPromise])
  } catch (firebaseErr) {
    console.warn("Firebase upload failed/timed out. Storing locally inside IndexedDB & LocalStorage:", firebaseErr)

    const localId = `local-rec-${Date.now()}`
    
    // 1. Store the actual File object persistently in IndexedDB
    await storeFileInDB(localId, file)

    // 2. Generate a Blob URL for instant viewing
    const blobUrl = URL.createObjectURL(file)
    sessionFileCache.set(localId, blobUrl)

    // 3. Save metadata doc in LocalStorage (without bloated base64, avoiding size limits entirely!)
    const record: MedicalRecord = {
      id: localId,
      patientId: userId,
      title,
      recordType,
      fileUrl: blobUrl, // Holds blob URL in metadata, refreshed dynamically on fetch
      storagePath: `local_ehr/${userId}/${file.name}`,
      notes,
      uploadedAt: new Date().toISOString(),
    }

    saveLocalRecord(userId, record)
    return record
  }
}

/**
 * Fetches all medical records for a specific patient.
 * Merges Firestore records and LocalStorage fallback records,
 * and dynamically recreates Blob URLs from IndexedDB for local records.
 */
export async function getMedicalRecords(userId: string): Promise<MedicalRecord[]> {
  const localRecords = getLocalRecords(userId)
  
  // Refresh Blob URLs for local files from IndexedDB to survive page refresh
  const resolvedLocalRecords = await Promise.all(
    localRecords.map(async (record) => {
      // If we already have a session URL cached in memory, use it
      if (sessionFileCache.has(record.id)) {
        return {
          ...record,
          fileUrl: sessionFileCache.get(record.id)!
        }
      }

      // Otherwise, retrieve the File object from IndexedDB and rebuild the Blob URL
      const file = await getFileFromDB(record.id)
      if (file) {
        const freshBlobUrl = URL.createObjectURL(file)
        sessionFileCache.set(record.id, freshBlobUrl)
        return {
          ...record,
          fileUrl: freshBlobUrl
        }
      }

      return record
    })
  )

  try {
    const q = query(
      collection(db, 'medical_records'),
      where('patientId', '==', userId)
    )

    const querySnapshot = await getDocs(q)
    const firestoreRecords: MedicalRecord[] = []
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data()
      firestoreRecords.push({
        id: docSnap.id,
        patientId: data.patientId,
        title: data.title,
        recordType: data.recordType,
        fileUrl: data.fileUrl,
        storagePath: data.storagePath || '',
        notes: data.notes || '',
        uploadedAt: data.uploadedAt || new Date().toISOString(),
      })
    })

    const merged = [...firestoreRecords, ...resolvedLocalRecords]
    return merged.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  } catch (err) {
    console.warn("Could not query Firestore, using local records only:", err)
    return resolvedLocalRecords.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  }
}

/**
 * Deletes a medical record from database/storage/IndexedDB.
 */
export async function deleteMedicalRecord(
  userId: string,
  recordId: string,
  storagePath: string
): Promise<boolean> {
  // If it's a local record, delete from LocalStorage and IndexedDB
  if (recordId.startsWith('local-rec-')) {
    deleteLocalRecord(userId, recordId)
    await deleteFileFromDB(recordId)
    sessionFileCache.delete(recordId)
    return true
  }

  // Otherwise delete from Firebase
  let firestoreDeleted = false
  try {
    await deleteDoc(doc(db, 'medical_records', recordId))
    firestoreDeleted = true
  } catch (err) {
    console.error("Firestore record delete failed:", err)
  }

  if (storagePath && !storagePath.startsWith('local_ehr/')) {
    try {
      const storageRef = ref(storage, storagePath)
      await deleteObject(storageRef)
    } catch (err) {
      console.error("Firebase Storage file delete failed:", err)
    }
  }

  // Fallback cleanup of local cache
  deleteLocalRecord(userId, recordId)
  await deleteFileFromDB(recordId)
  sessionFileCache.delete(recordId)

  return firestoreDeleted
}
