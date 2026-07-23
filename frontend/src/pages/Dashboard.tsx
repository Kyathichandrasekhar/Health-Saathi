import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calendar, Clock, Stethoscope, MapPin, Hash, Eye,
  AlertTriangle, CheckCircle, XCircle, CalendarPlus, Bell
} from 'lucide-react'
import QueueStatus from '../components/QueueStatus'

// Demo appointments
const demoAppointments = [
  {
    id: 'apt1',
    doctorName: 'Dr. Priya Sharma',
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
  Completed: { bg: 'bg-green-500/10 border-green-500/20', text: 'text-green-400', icon: CheckCircle },
  Cancelled: { bg: 'bg-red-500/10 border-red-500/20', text: 'text-red-400', icon: XCircle },
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'queue'>('upcoming')
  
  // Simulate live queue progression for demonstration
  const [demoCurrentToken, setDemoCurrentToken] = useState(5)
  
  useEffect(() => {
    if (activeTab === 'queue' && demoCurrentToken < 7) {
      const timer = setInterval(() => {
        setDemoCurrentToken(prev => prev + 1)
      }, 5000) // Advances every 5 seconds for demo
      return () => clearInterval(timer)
    }
  }, [activeTab, demoCurrentToken])

  const upcomingAppointments = demoAppointments.filter(a => a.status === 'Booked' || a.status === 'Checked-In')
  const pastAppointments = demoAppointments.filter(a => a.status === 'Completed' || a.status === 'Cancelled')

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
            { label: 'Total Bookings', value: demoAppointments.length, color: 'from-primary-500/20 to-primary-600/20' },
            { label: 'Upcoming', value: upcomingAppointments.length, color: 'from-blue-500/20 to-blue-600/20' },
            { label: 'Completed', value: pastAppointments.length, color: 'from-green-500/20 to-green-600/20' },
            { label: 'In Queue', value: 1, color: 'from-yellow-500/20 to-yellow-600/20' },
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
            { key: 'queue', label: 'Queue Status' },
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
            className="max-w-md"
          >
            <QueueStatus
              currentToken={demoCurrentToken}
              yourToken={7}
              totalInQueue={15}
              avgConsultationTime={12}
              doctorName="Priya Sharma"
            />

            {/* Travel Alert */}
            <div className="glass-card p-4 mt-4 flex items-start gap-3">
              <Bell className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-yellow-400">Travel Alert</p>
                <p className="text-xs text-dark-400 mt-1">
                  Your appointment is at 10:00 AM. Estimated travel time is 12 min.
                  <br />
                  <span className="text-yellow-400 font-medium">Leave by 9:45 AM to arrive on time!</span>
                </p>
              </div>
            </div>
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
                  {apt.status === 'Booked' && (
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
