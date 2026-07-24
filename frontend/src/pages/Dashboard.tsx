import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Calendar, Clock, Stethoscope, MapPin, Hash, Eye,
  AlertTriangle, CheckCircle, XCircle, CalendarPlus, Bell,
  Upload, FileText, Plus, Trash2, Loader, Download, ExternalLink, X
} from 'lucide-react'
import QueueStatus from '../components/QueueStatus'
import { useAuth } from '../contexts/AuthContext'
import { getMedicalRecords, uploadMedicalRecord, deleteMedicalRecord, MedicalRecord } from '../services/ehrService'


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
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'queue' | 'ehr'>('upcoming')
  
  // Simulate live queue progression for demonstration
  const [demoCurrentToken, setDemoCurrentToken] = useState(5)
  
  // EHR hooks
  const { user } = useAuth()
  const patientId = user?.uid || 'demo-patient-123'
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [isLoadingRecords, setIsLoadingRecords] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadType, setUploadType] = useState<'prescription' | 'report' | 'scan' | 'other'>('report')
  const [uploadNotes, setUploadNotes] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [selectedRecordForView, setSelectedRecordForView] = useState<MedicalRecord | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (activeTab === 'queue' && demoCurrentToken < 7) {
      const timer = setInterval(() => {
        setDemoCurrentToken(prev => prev + 1)
      }, 5000) // Advances every 5 seconds for demo
      return () => clearInterval(timer)
    }
  }, [activeTab, demoCurrentToken])

  useEffect(() => {
    if (activeTab === 'ehr') {
      void loadRecords()
    }
  }, [activeTab, patientId])

  const loadRecords = async () => {
    setIsLoadingRecords(true)
    try {
      const data = await getMedicalRecords(patientId)
      setRecords(data)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingRecords(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile || !uploadTitle) {
      setErrorMessage('Please select a file and enter a title.')
      return
    }
    setUploading(true)
    setErrorMessage('')
    try {
      await uploadMedicalRecord(patientId, uploadFile, uploadTitle, uploadType, uploadNotes)
      setUploadTitle('')
      setUploadNotes('')
      setUploadFile(null)
      setShowUploadModal(false)
      await loadRecords()
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload medical record.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (record: MedicalRecord) => {
    if (!window.confirm(`Are you sure you want to delete "${record.title}"?`)) return
    try {
      await deleteMedicalRecord(patientId, record.id, record.storagePath)
      await loadRecords()
    } catch (err) {
      console.error(err)
      alert('Failed to delete the record.')
    }
  }

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
            { key: 'ehr', label: 'Medical History' },
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
        ) : activeTab === 'ehr' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* EHR Controls */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">My Medical Records</h2>
                <p className="text-xs text-dark-400 mt-0.5">Upload and manage prescriptions, scans, or reports</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-gradient flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Upload Document
              </button>
            </div>

            {/* List */}
            {isLoadingRecords ? (
              <div className="flex justify-center py-16">
                <Loader className="w-8 h-8 text-primary-400 animate-spin animate-duration-1000" />
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-16 text-dark-400 glass-card">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30 text-primary-400" />
                <p className="text-white font-medium mb-1">No medical history files</p>
                <p className="text-xs max-w-sm mx-auto">Upload past prescriptions, lab reports, and scans to securely share them with your doctors during your visit.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {records.map((record, i) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card p-5 flex flex-col justify-between hover:border-primary-500/30 transition-all duration-300 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-white font-bold group-hover:text-primary-300 transition-colors">{record.title}</h4>
                            <span className="text-[10px] text-dark-400">
                              {new Date(record.uploadedAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary-500/20 text-primary-300 border border-primary-500/10">
                          {record.recordType}
                        </span>
                      </div>
                      {record.notes && (
                        <p className="text-xs text-dark-400 mt-3 bg-dark-900/40 p-2.5 rounded-lg border border-dark-800">
                          {record.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center mt-5 pt-3 border-t border-dark-800">
                      <button
                        onClick={() => setSelectedRecordForView(record)}
                        className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Document
                      </button>
                      <button
                        onClick={() => handleDelete(record)}
                        className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
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

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-md p-6 relative overflow-hidden"
            >
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadFile(null)
                  setUploadTitle('')
                  setUploadNotes('')
                  setErrorMessage('')
                }}
                className="absolute top-4 right-4 text-dark-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-4">Upload Medical Record</h3>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-dark-300 mb-1.5">Document Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prescriptions June 2025"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full bg-dark-900/60 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-300 mb-1.5">Record Type</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    className="w-full bg-dark-900/60 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="report">Lab Report</option>
                    <option value="prescription">Prescription</option>
                    <option value="scan">Medical Scan (X-Ray, MRI, etc.)</option>
                    <option value="other">Other Documents</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-300 mb-1.5">Notes (Optional)</label>
                  <textarea
                    placeholder="Add diagnosis details or notes..."
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-dark-900/60 border border-dark-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-300 mb-1.5">Select File (PDF or Image)</label>
                  <div className="border-2 border-dashed border-dark-700 rounded-xl p-4 text-center hover:border-primary-500/50 transition-colors relative cursor-pointer">
                    <input
                      type="file"
                      required
                      accept="image/*,application/pdf"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <Upload className="w-8 h-8 text-primary-400 mx-auto mb-2" />
                    <p className="text-xs text-white font-medium">
                      {uploadFile ? uploadFile.name : "Click to select a file"}
                    </p>
                    <p className="text-[10px] text-dark-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                  </div>
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
                    {errorMessage}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadModal(false)
                      setUploadFile(null)
                      setUploadTitle('')
                      setUploadNotes('')
                      setErrorMessage('')
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-dark-700 text-sm font-semibold text-dark-300 hover:bg-dark-850 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 btn-gradient flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Upload"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Document Modal */}
      <AnimatePresence>
        {selectedRecordForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card w-full max-w-4xl h-[85vh] p-6 relative flex flex-col"
            >
              <div className="flex justify-between items-center mb-4 border-b border-dark-850 pb-3">
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedRecordForView.title}</h3>
                  <p className="text-xs text-dark-400 mt-0.5">
                    Type: <span className="uppercase text-primary-300 font-semibold">{selectedRecordForView.recordType}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={selectedRecordForView.fileUrl}
                    download={selectedRecordForView.title}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                  <button
                    onClick={() => setSelectedRecordForView(null)}
                    className="text-dark-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-dark-950/50 rounded-xl overflow-hidden flex items-center justify-center p-2 relative min-h-[300px]">
                {selectedRecordForView.fileUrl.startsWith('data:application/pdf') || 
                 selectedRecordForView.fileUrl.includes('.pdf') || 
                 selectedRecordForView.storagePath.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={selectedRecordForView.fileUrl}
                    className="w-full h-full border-none rounded-lg"
                    title={selectedRecordForView.title}
                  />
                ) : (
                  <img
                    src={selectedRecordForView.fileUrl}
                    alt={selectedRecordForView.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
