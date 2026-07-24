import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Clock, Calendar, Hash, Users, Stethoscope,
  Navigation, ArrowLeft, Bell, Building2, Loader2,
} from 'lucide-react'
import QRGenerator from '../components/QRGenerator'
import QueueStatus from '../components/QueueStatus'
import { useAuth } from '../contexts/AuthContext'
import { collection, query, where, getDocs, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { db } from '../services/firebase'
import {
  subscribeToQueue,
  type QueueDocument,
  type QueueEntry,
} from '../services/queueFirestore'

// ── Types ──────────────────────────────────────────────────────────────────────

interface PatientBooking {
  appointmentId: string
  doctorName: string
  doctorId: string
  specialization: string
  hospitalName: string
  hospitalAddress?: string
  hospitalLat?: number
  hospitalLng?: number
  date: string
  slot: string
  token: number
  status: string
  fee: number
}

interface LiveQueueInfo {
  currentToken: number
  yourToken: number
  patientsAhead: number
  totalInQueue: number
  status: string
  estimatedWaitMins: number
}

const AVG_CONSULTATION_MINS = 10

// ── Component ──────────────────────────────────────────────────────────────────

export default function MyQueue() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<PatientBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [liveQueues, setLiveQueues] = useState<Record<string, LiveQueueInfo>>({})
  const unsubscribesRef = useRef<Unsubscribe[]>([])

  // ── Load patient bookings that are checked-in or waiting ──────────────────

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    let mounted = true

    const loadBookings = async () => {
      try {
        setLoading(true)

        // Try fetching from Firestore bookings collection
        const bookingsRef = collection(db, 'bookings')
        const q = query(bookingsRef, where('userId', '==', user.uid))
        const snap = await getDocs(q)

        if (!mounted) return

        const fetched: PatientBooking[] = []
        snap.forEach((doc) => {
          const d = doc.data()
          // Only show bookings that are active (Checked-In, Waiting, Booked, Confirmed)
          const status = String(d.status || 'Booked')
          if (['Completed', 'Cancelled'].includes(status)) return

          fetched.push({
            appointmentId: doc.id || d.appointmentId || d.bookingId || '',
            doctorName: d.doctorName || d.doctor_name || 'Doctor',
            doctorId: d.doctorId || d.doctor_id || '',
            specialization: d.specialization || d.specialty || 'General Medicine',
            hospitalName: d.hospitalName || d.hospital_name || 'Hospital',
            hospitalAddress: d.hospitalAddress || d.hospital_address || '',
            hospitalLat: d.hospitalLat || d.hospital_lat,
            hospitalLng: d.hospitalLng || d.hospital_lng,
            date: d.date || '',
            slot: d.slot || '',
            token: Number(d.tokenNumber || d.token_number || d.token || 0),
            status,
            fee: Number(d.fee || d.paid_amount || 0),
          })
        })

        setBookings(fetched)
      } catch {
        // If Firestore bookings aren't available, fallback to empty
        setBookings([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadBookings()

    return () => {
      mounted = false
    }
  }, [user])

  // ── Subscribe to real-time queue for each booking's doctor ────────────────

  useEffect(() => {
    // Clean up old subscriptions
    unsubscribesRef.current.forEach((unsub) => unsub())
    unsubscribesRef.current = []

    if (bookings.length === 0) return

    for (const booking of bookings) {
      if (!booking.doctorId || !booking.date) continue

      const unsub = subscribeToQueue(booking.doctorId, booking.date, (queueDoc: QueueDocument | null) => {
        if (!queueDoc) return

        const myEntry = queueDoc.queue.find(
          (e: QueueEntry) => e.appointmentId === booking.appointmentId,
        )
        if (!myEntry) return

        const ahead = queueDoc.queue.filter(
          (e: QueueEntry) => e.status === 'Waiting' && e.token < myEntry.token,
        ).length
        const activeQueue = queueDoc.queue.filter((e: QueueEntry) => e.status !== 'Completed')

        const effectiveAhead = myEntry.status === 'Waiting' ? ahead : 0

        setLiveQueues((prev) => ({
          ...prev,
          [booking.appointmentId]: {
            currentToken: queueDoc.currentToken,
            yourToken: myEntry.token || booking.token,
            patientsAhead: effectiveAhead,
            totalInQueue: activeQueue.length,
            status: myEntry.status,
            estimatedWaitMins: effectiveAhead * AVG_CONSULTATION_MINS,
          },
        }))
      })

      unsubscribesRef.current.push(unsub)
    }

    return () => {
      unsubscribesRef.current.forEach((unsub) => unsub())
      unsubscribesRef.current = []
    }
  }, [bookings])

  // ── QR payload builder ───────────────────────────────────────────────────

  const buildQrPayload = (booking: PatientBooking) =>
    JSON.stringify({
      a: booking.appointmentId,
      n: user?.displayName || 'Patient',
      d: booking.doctorName,
      h: booking.hospitalName,
      dt: booking.date,
      s: booking.slot,
      t: booking.token,
    })

  // ── Navigation URL ───────────────────────────────────────────────────────

  const getNavigationUrl = (booking: PatientBooking) => {
    if (booking.hospitalLat && booking.hospitalLng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${booking.hospitalLat},${booking.hospitalLng}`
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.hospitalName)}`
  }

  // ── Status color helper ──────────────────────────────────────────────────

  const statusStyle = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
      case 'Completed':
        return 'bg-green-500/10 border-green-500/20 text-green-400'
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">My Queue</h1>
          <p className="text-dark-400 mt-1">Live queue status for your appointments</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-4" />
            <p className="text-dark-400 text-sm">Loading your queue status…</p>
          </div>
        )}

        {/* No active bookings */}
        {!loading && bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Users className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No Active Queue</h2>
            <p className="text-dark-400 text-sm mb-6">
              You don't have any checked-in or upcoming appointments in the queue.
            </p>
            <Link
              to="/booking"
              className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
            >
              <Calendar className="w-4 h-4" />
              Book an Appointment
            </Link>
          </motion.div>
        )}

        {/* Active bookings with queue */}
        <div className="space-y-6">
          {bookings.map((booking, index) => {
            const live = liveQueues[booking.appointmentId]

            return (
              <motion.div
                key={booking.appointmentId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden"
              >
                {/* Appointment Info Header */}
                <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 p-5 border-b border-white/5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border border-white/10">
                        <Stethoscope className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{booking.doctorName}</h3>
                        <p className="text-sm text-primary-400">{booking.specialization}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg border text-xs font-semibold ${statusStyle(live?.status || booking.status)}`}>
                      {live?.status || booking.status}
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-dark-400 flex-shrink-0" />
                      <span className="text-dark-300 truncate">{booking.hospitalName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-dark-400 flex-shrink-0" />
                      <span className="text-dark-300">{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-dark-400 flex-shrink-0" />
                      <span className="text-dark-300">{booking.slot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Hash className="w-4 h-4 text-dark-400 flex-shrink-0" />
                      <span className="text-dark-300">Token: {live?.yourToken || booking.token || '—'}</span>
                    </div>
                  </div>

                  {/* Live Queue Status Widget */}
                  {live ? (
                    <QueueStatus
                      currentToken={live.currentToken}
                      yourToken={live.yourToken}
                      totalInQueue={live.totalInQueue}
                      avgConsultationTime={AVG_CONSULTATION_MINS}
                      doctorName={booking.doctorName.replace(/^Dr\.\s*/i, '')}
                    />
                  ) : (
                    <div className="glass-card p-4 text-center">
                      <p className="text-sm text-dark-400">
                        Queue status will appear here once you're checked in at the hospital.
                      </p>
                    </div>
                  )}

                  {/* Estimated Wait Banner */}
                  {live && live.status === 'Waiting' && live.patientsAhead > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                      <Bell className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-yellow-400">
                          {live.patientsAhead} patient{live.patientsAhead > 1 ? 's' : ''} ahead
                        </p>
                        <p className="text-xs text-dark-400 mt-0.5">
                          Estimated wait: ~{live.estimatedWaitMins} minutes
                        </p>
                      </div>
                    </div>
                  )}

                  {/* It's your turn banner */}
                  {live && live.status === 'In Progress' && (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                      <p className="text-green-400 font-bold text-lg animate-pulse">
                        🎉 It's your turn!
                      </p>
                      <p className="text-sm text-green-400/70 mt-1">
                        Please proceed to the doctor's cabin
                      </p>
                    </div>
                  )}

                  {/* QR Code */}
                  <div className="flex justify-center">
                    <QRGenerator data={buildQrPayload(booking)} size={180} />
                  </div>

                  {/* Navigate to Hospital */}
                  <a
                    href={getNavigationUrl(booking)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
                  >
                    <Navigation className="w-4 h-4" />
                    Navigate to Hospital
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
