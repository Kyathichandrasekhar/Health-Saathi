/**
 * Real-time Firestore queue service.
 *
 * Collection: `queue_status`
 * Document key: `{doctorId}_{date}`   (e.g. "doc-123_2026-07-24")
 *
 * Each document stores:
 *   currentToken  – the token currently being served
 *   queue         – ordered array of QueueEntry objects
 *   lastUpdated   – Firestore server timestamp
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface QueueEntry {
  appointmentId: string
  token: number
  name: string
  time: string
  status: 'Waiting' | 'In Progress' | 'Completed'
}

export interface QueueDocument {
  doctorId: string
  doctorName?: string
  hospitalName?: string
  date: string
  currentToken: number
  queue: QueueEntry[]
  lastUpdated: any // Firestore FieldValue / Timestamp
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function queueDocId(doctorId: string, date: string) {
  return `${doctorId}_${date}`
}

const COLLECTION = 'queue_status'

// ── Write Operations (Admin / Receptionist) ────────────────────────────────────

/**
 * Add or merge a patient entry into the queue document.
 * Called after a successful QR check-in.
 */
export async function addToQueue(
  doctorId: string,
  date: string,
  entry: QueueEntry,
  meta?: { doctorName?: string; hospitalName?: string },
) {
  const id = queueDocId(doctorId, date)
  const ref = doc(db, COLLECTION, id)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    const data = snap.data() as QueueDocument
    const exists = data.queue.some((e) => e.appointmentId === entry.appointmentId)
    if (!exists) {
      await updateDoc(ref, {
        queue: [...data.queue, entry],
        lastUpdated: serverTimestamp(),
      })
    }
  } else {
    const newDoc: QueueDocument = {
      doctorId,
      doctorName: meta?.doctorName || '',
      hospitalName: meta?.hospitalName || '',
      date,
      currentToken: 0,
      queue: [entry],
      lastUpdated: serverTimestamp(),
    }
    await setDoc(ref, newDoc)
  }
}

/**
 * Update a single queue entry's status (Waiting → In Progress → Completed).
 */
export async function updateQueueEntry(
  doctorId: string,
  date: string,
  appointmentId: string,
  newStatus: QueueEntry['status'],
) {
  const id = queueDocId(doctorId, date)
  const ref = doc(db, COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return

  const data = snap.data() as QueueDocument
  const updatedQueue = data.queue.map((e) =>
    e.appointmentId === appointmentId ? { ...e, status: newStatus } : e,
  )

  // When marking "In Progress", set currentToken to that entry's token
  let currentToken = data.currentToken
  if (newStatus === 'In Progress') {
    const entry = updatedQueue.find((e) => e.appointmentId === appointmentId)
    if (entry) currentToken = entry.token
  }

  await updateDoc(ref, {
    queue: updatedQueue,
    currentToken,
    lastUpdated: serverTimestamp(),
  })
}

/**
 * Advance the queue: mark current "In Progress" as "Completed",
 * then set the next "Waiting" entry to "In Progress".
 */
export async function advanceQueue(doctorId: string, date: string) {
  const id = queueDocId(doctorId, date)
  const ref = doc(db, COLLECTION, id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return

  const data = snap.data() as QueueDocument
  const updatedQueue = data.queue.map((e) =>
    e.status === 'In Progress' ? { ...e, status: 'Completed' as const } : e,
  )

  // Find next waiting
  const nextWaiting = updatedQueue.find((e) => e.status === 'Waiting')
  let currentToken = data.currentToken
  if (nextWaiting) {
    nextWaiting.status = 'In Progress'
    currentToken = nextWaiting.token
  }

  await updateDoc(ref, {
    queue: updatedQueue,
    currentToken,
    lastUpdated: serverTimestamp(),
  })
}

// ── Real-time Subscriptions ────────────────────────────────────────────────────

/**
 * Subscribe to real-time queue updates for a specific doctor+date.
 * Returns an unsubscribe function.
 */
export function subscribeToQueue(
  doctorId: string,
  date: string,
  callback: (data: QueueDocument | null) => void,
): Unsubscribe {
  const id = queueDocId(doctorId, date)
  const ref = doc(db, COLLECTION, id)

  return onSnapshot(
    ref,
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as QueueDocument)
      } else {
        callback(null)
      }
    },
    (error) => {
      console.error('Queue subscription error:', error)
      callback(null)
    },
  )
}

// ── Patient Queries ────────────────────────────────────────────────────────────

/**
 * Find the queue document that contains a specific appointment and return
 * the patient's position info.
 */
export async function getPatientQueuePosition(appointmentId: string): Promise<{
  found: boolean
  doctorId?: string
  doctorName?: string
  hospitalName?: string
  date?: string
  currentToken?: number
  yourToken?: number
  patientsAhead?: number
  totalInQueue?: number
  status?: string
  queue?: QueueEntry[]
} | null> {
  try {
    const colRef = collection(db, COLLECTION)
    const allSnap = await getDocs(colRef)

    for (const docSnap of allSnap.docs) {
      const data = docSnap.data() as QueueDocument
      const entry = data.queue.find((e) => e.appointmentId === appointmentId)
      if (entry) {
        const activeQueue = data.queue.filter((e) => e.status !== 'Completed')
        const ahead = data.queue
          .filter((e) => e.status === 'Waiting' && e.token < entry.token)
          .length

        return {
          found: true,
          doctorId: data.doctorId,
          doctorName: data.doctorName,
          hospitalName: data.hospitalName,
          date: data.date,
          currentToken: data.currentToken,
          yourToken: entry.token,
          patientsAhead: entry.status === 'Waiting' ? ahead : 0,
          totalInQueue: activeQueue.length,
          status: entry.status,
          queue: data.queue,
        }
      }
    }

    return { found: false }
  } catch (error) {
    console.error('getPatientQueuePosition error:', error)
    return null
  }
}

/**
 * Subscribe to queue updates for a specific appointment.
 * Searches all queue docs once to find the right one, then subscribes.
 */
export async function subscribeToPatientQueue(
  appointmentId: string,
  callback: (info: {
    found: boolean
    doctorId: string
    doctorName: string
    hospitalName: string
    date: string
    currentToken: number
    yourToken: number
    patientsAhead: number
    totalInQueue: number
    status: string
    queue: QueueEntry[]
  } | null) => void,
): Promise<Unsubscribe | null> {
  try {
    const colRef = collection(db, COLLECTION)
    const allSnap = await getDocs(colRef)

    for (const docSnap of allSnap.docs) {
      const data = docSnap.data() as QueueDocument
      const entry = data.queue.find((e) => e.appointmentId === appointmentId)
      if (entry) {
        // Found! Now subscribe to this specific doc
        return onSnapshot(docSnap.ref, (snap) => {
          if (!snap.exists()) {
            callback(null)
            return
          }
          const d = snap.data() as QueueDocument
          const e = d.queue.find((q) => q.appointmentId === appointmentId)
          if (!e) {
            callback(null)
            return
          }
          const ahead = d.queue.filter(
            (q) => q.status === 'Waiting' && q.token < e.token,
          ).length
          const activeQueue = d.queue.filter((q) => q.status !== 'Completed')
          callback({
            found: true,
            doctorId: d.doctorId,
            doctorName: d.doctorName || '',
            hospitalName: d.hospitalName || '',
            date: d.date,
            currentToken: d.currentToken,
            yourToken: e.token,
            patientsAhead: e.status === 'Waiting' ? ahead : 0,
            totalInQueue: activeQueue.length,
            status: e.status,
            queue: d.queue,
          })
        })
      }
    }

    callback(null)
    return null
  } catch {
    callback(null)
    return null
  }
}
