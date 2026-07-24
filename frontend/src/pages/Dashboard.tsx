import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calendar, Clock, Stethoscope, MapPin, Hash, Eye,
  AlertTriangle, CheckCircle, XCircle, CalendarPlus, Bell,
  Users, Navigation, Loader2, Building2, ExternalLink,
} from 'lucide-react'
import QueueStatus from '../components/QueueStatus'
import QRGenerator from '../components/QRGenerator'
import { useAuth } from '../contexts/AuthContext'
import { collection, query, where, getDocs, type Unsubscribe } from 'firebase/firestore'
import { db } from '../services/firebase'
import {
  subscribeToQueue,
  type QueueDocument,
  type QueueEntry,
} from '../services/queueFirestore'

// ── Types ──────────────────────────────────────────────────────────────────────

interface DashboardBooking {
  id: string
  doctorName: string
  doctorId: string
  specialty: string
  hospitalName: string
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
}

const AVG_CONSULTATION_MINS = 10

// Demo appointments (fallback when no Firestore bookings)
const demoAppointments: DashboardBooking[] = [
  {
    id: 'apt1',
    doctorName: 'Dr. Priya Sharma',
    doctorId: 'demo-doc-1',
    specialty: 'Cardiology',
    hospitalName: 'City General Hospital',
    date: '2026-03-22',
    slot: '10:00 AM',
    token: 7,
    status: 'Checked-In',
    fee: 500,
  },
  {
    id: 'apt2',
    doctorName: 'Dr. Arjun Patel',
    doctorId: 'demo-doc-2',
    specialty: 'General',
    hospitalName: 'Apollo Medical Center',
    date: '2026-03-25',
    slot: '02:30 PM',
    token: 12,
    status: 'Booked',
    fee: 300,
  },
  {
    id: 'apt3',
    doctorName: 'Dr. Neha Singh',
    doctorId: 'demo-doc-3',
    specialty: 'Pediatrics',
    hospitalName: 'Apollo Medical Center',
    date: '2026-03-10',
    slot: '11:00 AM',
    token: 3,
    status: 'Completed',
    fee: 450,
  },
]

const statusColors: Record<string, { bg: string; text: string; icon: any }> = {
  Booked: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', icon: Calendar },
  'Checked-In': { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle },
  Waiting: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', icon: Clock },
  'In Progress': { bg: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', icon: AlertTriangle },
  Completed: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', icon: CheckCircle },
  Cancelled: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', icon: XCircle },
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'queue'>('upcoming')
  const [appointments, setAppointments] = useState<DashboardBooking[]>(demoAppointments)
  const [firestoreLoaded, setFirestoreLoaded] = useState(false)
  const [liveQueues, setLiveQueues] = useState<Record<string, LiveQueueInfo>>({})
  const unsubscribesRef = useRef<Unsubscribe[]>([])

  // ── Load bookings from Firestore ─────────────────────────────────────────

  useEffect(() => {
    if (!user) return

    let mounted = true

    const loadBookings = async () => {
      try {
        const bookingsRef = collection(db, 'bookings')
        const q = query(bookingsRef, where('userId', '==', user.uid))
        const snap = await getDocs(q)

        if (!mounted) return

        const fetched: DashboardBooking[] = []
        snap.forEach((doc) => {
          const d = doc.data()
          fetched.push({
            id: doc.id || d.appointmentId || d.bookingId || '',
            doctorName: d.doctorName || d.doctor_name || 'Doctor',
            doctorId: d.doctorId || d.doctor_id || '',
            specialty: d.specialization || d.specialty || 'General Medicine',
            hospitalName: d.hospitalName || d.hospital_name || 'Hospital',
            hospitalLat: d.hospitalLat || d.hospital_lat,
            hospitalLng: d.hospitalLng || d.hospital_lng,
            date: d.date || '',
            slot: d.slot || '',
            token: Number(d.tokenNumber || d.token_number || d.token || 0),
            status: d.status || 'Booked',
            fee: Number(d.fee || d.paid_amount || 0),
          })
        })

        if (fetched.length > 0) {
          setAppointments(fetched)
        }
        setFirestoreLoaded(true)
      } catch {
        setFirestoreLoaded(true)
      }
    }

    loadBookings()

    return () => {
      mounted = false
    }
  }, [user])

  // ── Subscribe to real-time queue for each active booking ──────────────────

  useEffect(() => {
    unsubscribesRef.current.forEach((unsub) => unsub())
    unsubscribesRef.current = []

    const activeBookings = appointments.filter(
      (a) => !['Completed', 'Cancelled'].includes(a.status),
    )

    for (const booking of activeBookings) {
      if (!booking.doctorId || !booking.date) continue

      const unsub = subscribeToQueue(booking.doctorId, booking.date, (queueDoc: QueueDocument | null) => {
        if (!queueDoc) return

        const myEntry = queueDoc.queue.find(
          (e: QueueEntry) => e.appointmentId === booking.id,
        )
        if (!myEntry) return

        const ahead = queueDoc.queue.filter(
          (e: QueueEntry) => e.status === 'Waiting' && e.token < myEntry.token,
        ).length
        const activeQueue = queueDoc.queue.filter((e: QueueEntry) => e.status !== 'Completed')

        setLiveQueues((prev) => ({
          ...prev,
          [booking.id]: {
            currentToken: queueDoc.currentToken,
            yourToken: myEntry.token || booking.token,
            patientsAhead: myEntry.status === 'Waiting' ? ahead : 0,
            totalInQueue: activeQueue.length,
            status: myEntry.status,
          },
        }))
      })

      unsubscribesRef.current.push(unsub)
    }

    return () => {
      unsubscribesRef.current.forEach((unsub) => unsub())
      unsubscribesRef.current = []
    }
  }, [appointments])

  // ── Derived data ─────────────────────────────────────────────────────────

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Booked' || a.status === 'Checked-In' || a.status === 'Waiting' || a.status === 'In Progress',
  )
  const pastAppointments = appointments.filter(
    (a) => a.status === 'Completed' || a.status === 'Cancelled',
  )
  const queueAppointments = appointments.filter(
    (a) => a.status === 'Checked-In' || a.status === 'Waiting' || a.status === 'In Progress' || liveQueues[a.id],
  )

  const inQueueCount = Object.values(liveQueues).filter(
    (q) => q.status === 'Waiting' || q.status === 'In Progress',
  ).length || queueAppointments.length

  // ── QR helper ────────────────────────────────────────────────────────────

  const buildQrPayload = (booking: DashboardBooking) =>
    JSON.stringify({
      a: booking.id,
      n: user?.displayName || 'Patient',
      d: booking.doctorName,
      h: booking.hospitalName,
      dt: booking.date,
      s: booking.slot,
      t: booking.token,
    })

  const getNavigationUrl = (booking: DashboardBooking) => {
    if (booking.hospitalLat && booking.hospitalLng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${booking.hospitalLat},${booking.hospitalLng}`
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.hospitalName)}`
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-dark-400 mt-1">Manage your appointments & queue status</p>
          </div>
          <Link
            to="/booking"
            className="btn-gradient flex items-center gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            New Appointment
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: appointments.length, color: 'from-primary-500/20 to-primary-600/20' },
            { label: 'Upcoming', value: upcomingAppointments.length, color: 'from-blue-500/20 to-blue-600/20' },
            { label: 'Completed', value: pastAppointments.length, color: 'from-green-500/20 to-green-600/20' },
            { label: 'In Queue', value: inQueueCount, color: 'from-yellow-500/20 to-yellow-600/20' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-4 bg-gradient-to-br ${stat.color}`}
            >
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-dark-400 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass rounded-xl mb-6 w-fit">
          {[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'past', label: 'History' },
            { key: 'queue', label: 'My Queue' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary-500/20 text-primary-300 shadow-glow'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'queue' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {queueAppointments.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-dark-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">No Active Queue</h2>
                <p className="text-dark-400 text-sm mb-6">
                  You'll see your live queue status here after checking in at the hospital.
                </p>
                <Link
                  to="/booking"
                  className="btn-gradient inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold"
                >
                  <CalendarPlus className="w-4 h-4" />
                  Book an Appointment
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {queueAppointments.map((apt, index) => {
                  const live = liveQueues[apt.id]
                  const effectiveStatus = live?.status || apt.status
                  const style = statusColors[effectiveStatus] || statusColors.Booked
                  const StatusIcon = style.icon

                  return (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card overflow-hidden"
                    >
                      {/* Header */}
                      <div className="bg-gradient-to-r from-primary-600/20 to-secondary-600/20 p-5 border-b border-white/5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center border border-white/10">
                              <Stethoscope className="w-5 h-5 text-primary-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">{apt.doctorName}</h3>
                              <p className="text-sm text-primary-400">{apt.specialty}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${style.bg}`}>
                            <StatusIcon className={`w-3.5 h-3.5 ${style.text}`} />
                            <span className={`text-xs font-medium ${style.text}`}>{effectiveStatus}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 space-y-5">
                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Building2 className="w-4 h-4 text-dark-400 flex-shrink-0" />
                            <span className="text-dark-300 truncate">{apt.hospitalName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-dark-400 flex-shrink-0" />
                            <span className="text-dark-300">{apt.date}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-dark-400 flex-shrink-0" />
                            <span className="text-dark-300">{apt.slot}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Hash className="w-4 h-4 text-dark-400 flex-shrink-0" />
                            <span className="text-dark-300">Token: {live?.yourToken || apt.token || '—'}</span>
                          </div>
                        </div>

                        {/* Live Queue Widget */}
                        {live ? (
                          <QueueStatus
                            currentToken={live.currentToken}
                            yourToken={live.yourToken}
                            totalInQueue={live.totalInQueue}
                            avgConsultationTime={AVG_CONSULTATION_MINS}
                            doctorName={apt.doctorName.replace(/^Dr\.\s*/i, '')}
                          />
                        ) : (
                          <div className="p-4 rounded-xl bg-white/3 border border-white/5 text-center">
                            <p className="text-sm text-dark-400">
                              Live queue updates will appear here once the receptionist checks you in.
                            </p>
                          </div>
                        )}

                        {/* Wait banner */}
                        {live && live.status === 'Waiting' && live.patientsAhead > 0 && (
                          <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                            <Bell className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-yellow-400">
                                {live.patientsAhead} patient{live.patientsAhead > 1 ? 's' : ''} ahead of you
                              </p>
                              <p className="text-xs text-dark-400 mt-0.5">
                                Estimated wait: ~{live.patientsAhead * AVG_CONSULTATION_MINS} minutes
                              </p>
                            </div>
                          </div>
                        )}

                        {/* QR Code */}
                        <div className="flex justify-center">
                          <QRGenerator data={buildQrPayload(apt)} size={160} />
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                          <Link
                            to={`/ticket/${apt.id}`}
                            state={apt}
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-500/10 text-primary-300 text-sm font-medium hover:bg-primary-500/20 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            View Ticket
                          </Link>
                          <a
                            href={getNavigationUrl(apt)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
                          >
                            <Navigation className="w-4 h-4" />
                            Navigate
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}

                {/* Link to full page */}
                <Link
                  to="/my-queue"
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Full Queue Page
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).map((apt, i) => {
              const statusStyle = statusColors[apt.status] || statusColors.Booked
              const StatusIcon = statusStyle.icon
              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-5 flex flex-col sm:flex-row gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-bold">{apt.doctorName}</h3>
                        <p className="text-sm text-primary-400">{apt.specialty}</p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border ${statusStyle.bg}`}>
                        <StatusIcon className={`w-3.5 h-3.5 ${statusStyle.text}`} />
                        <span className={`text-xs font-medium ${statusStyle.text}`}>{apt.status}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-dark-400">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{apt.hospitalName}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{apt.date}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{apt.slot}</span>
                      <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" />Token: {apt.token}</span>
                    </div>
                  </div>
                  {(apt.status === 'Booked' || apt.status === 'Checked-In') && (
                    <Link
                      to={`/ticket/${apt.id}`}
                      state={apt}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 text-primary-300 text-sm font-medium hover:bg-primary-500/20 transition-all self-start"
                    >
                      <Eye className="w-4 h-4" />
                      View Ticket
                    </Link>
                  )}
                </motion.div>
              )
            })}
            {(activeTab === 'upcoming' ? upcomingAppointments : pastAppointments).length === 0 && (
              <div className="text-center py-16 text-dark-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p>No {activeTab} appointments</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
