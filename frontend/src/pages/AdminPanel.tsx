import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, CheckCircle, XCircle, Users, Clock, UserCheck, RefreshCw, Shield, Printer, Stethoscope, Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import QRScanner from '../components/QRScanner'
import { adminAPI, bookingAPI, queueAPI } from '../services/api'
import { Doctor, SPECIALIZATIONS } from '../types/doctor'
import { getDoctors, addDoctor, updateDoctor, deleteDoctor, getFirestoreHospitals, seedInitialDataIfNeeded } from '../services/doctorFirestore'
import { SAMPLE_HOSPITALS, SampleHospital } from '../services/doctorData'

interface ScannedPatient {
  appointmentId: string
  name: string
  doctor: string
  hospital?: string
  paymentStatus?: string
  token: number
  date: string
  slot: string
  doctorId: string
  status: 'valid' | 'invalid' | 'already-checked-in'
}

interface LiveQueueEntry {
  appointmentId: string
  token: number
  name: string
  time: string
  status: string
}

function decodeQrClientSide(raw: string) {
  if (!raw || typeof raw !== 'string') {
    return null
  }

  try {
    const parsed = JSON.parse(raw)
    if (parsed?.appointmentId) {
      return {
        appointmentId: String(parsed.appointmentId),
        patientName: String(parsed.patientName || parsed.n || 'Patient'),
        doctorName: String(parsed.doctorName || parsed.d || 'Doctor'),
        hospitalName: String(parsed.hospitalName || parsed.h || 'Hospital'),
        date: String(parsed.date || parsed.dt || '-'),
        slot: String(parsed.slot || parsed.s || '-'),
        token: Number(parsed.token || parsed.t || 0),
      }
    }

    if (parsed?.a) {
      return {
        appointmentId: String(parsed.a),
        patientName: String(parsed.n || 'Patient'),
        doctorName: String(parsed.d || 'Doctor'),
        hospitalName: String(parsed.h || 'Hospital'),
        date: String(parsed.dt || '-'),
        slot: String(parsed.s || '-'),
        token: Number(parsed.t || 0),
      }
    }
  } catch {
    // Not JSON, continue to URL fallback.
  }

  if (raw.includes('/ticket/')) {
    const parts = raw.split('/').filter(Boolean)
    const i = parts.findIndex((part) => part === 'ticket')
    const appointmentId = i >= 0 ? parts[i + 1] : ''
    if (appointmentId) {
      return {
        appointmentId,
        patientName: 'Patient',
        doctorName: 'Doctor',
        hospitalName: 'Hospital',
        date: '-',
        slot: '-',
        token: 0,
      }
    }
  }

  return null
}

export default function AdminPanel() {
  const [scannedPatient, setScannedPatient] = useState<ScannedPatient | null>(null)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [validationStatus, setValidationStatus] = useState<'valid' | 'invalid' | 'already_checked_in' | null>(null)
  const [validationMessage, setValidationMessage] = useState('')
  const [activeView, setActiveView] = useState<'scanner' | 'queue' | 'doctors'>('scanner')

  // Doctor Management State
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([])
  const [sampleHospitals, setSampleHospitals] = useState<SampleHospital[]>(SAMPLE_HOSPITALS)
  const [isDoctorsLoading, setIsDoctorsLoading] = useState(false)
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('')
  const [doctorFilterSpec, setDoctorFilterSpec] = useState('All')
  const [showDoctorForm, setShowDoctorForm] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [doctorFormData, setDoctorFormData] = useState<Partial<Doctor>>({})
  const [isSavingDoctor, setIsSavingDoctor] = useState(false)
  const [deletingDoctorId, setDeletingDoctorId] = useState<string | null>(null)
  const [doctorActionMessage, setDoctorActionMessage] = useState('')
  const [checkedInCount, setCheckedInCount] = useState(2)
  const [queueTotal, setQueueTotal] = useState(5)
  const [liveQueue, setLiveQueue] = useState<LiveQueueEntry[]>([
    { appointmentId: 'A-1001', token: 1, name: 'Raj Kumar', time: '09:00 AM', status: 'Completed' },
    { appointmentId: 'A-1002', token: 2, name: 'Priya Sharma', time: '09:15 AM', status: 'In Progress' },
    { appointmentId: 'A-1003', token: 3, name: 'Amit Singh', time: '09:30 AM', status: 'Waiting' },
    { appointmentId: 'A-1004', token: 4, name: 'Neha Gupta', time: '09:45 AM', status: 'Waiting' },
    { appointmentId: 'A-1005', token: 5, name: 'Vikram Patel', time: '10:00 AM', status: 'Waiting' }
  ])
  const [activeDoctorId, setActiveDoctorId] = useState('Dr. Anjali Desai')
  const [activeQueueDate, setActiveQueueDate] = useState('')
  const [scannerError, setScannerError] = useState('')
  const statusColors: Record<string,string> = { Completed:'text-green-400', 'In Progress':'text-yellow-400', Waiting:'text-dark-400' }

  const handlePrintReceipt = () => {
    window.print()
  }

  const refreshQueueForDoctor = async (doctorId: string, date?: string) => {
    if (!doctorId) {
      return
    }

    try {
      const status = await queueAPI.getStatus(doctorId, date)
      setQueueTotal(Number(status.total_in_queue) || 0)

      const queueIds: string[] = Array.isArray(status.queue) ? status.queue : []
      const entries = await Promise.all(
        queueIds.map(async (appointmentId: string) => {
          try {
            const booking = await bookingAPI.getById(appointmentId)
            return {
              appointmentId,
              token: Number(booking.token_number) || 0,
              name: booking.patient_name || booking.patient_email || 'Patient',
              time: booking.slot || '-',
              status: booking.status || 'Waiting',
            } as LiveQueueEntry
          } catch {
            return {
              appointmentId,
              token: 0,
              name: 'Patient',
              time: '-',
              status: 'Waiting',
            } as LiveQueueEntry
          }
        }),
      )

      entries.sort((a, b) => a.token - b.token)
      setLiveQueue(entries)
    } catch {
      setQueueTotal(0)
      setLiveQueue([])
    }
  }

  const handleQRScan = async (data: string) => {
    setScannerError('')
    setScanResult(data)
    setIsValidating(true)
    setValidationStatus(null)
    setValidationMessage('')
    console.log('Decoded QR:', data)

    const localDecoded = decodeQrClientSide(data)
    if (localDecoded) {
      setScannedPatient({
        appointmentId: localDecoded.appointmentId,
        name: localDecoded.patientName,
        doctor: localDecoded.doctorName,
        hospital: localDecoded.hospitalName,
        paymentStatus: 'unknown',
        token: localDecoded.token,
        date: localDecoded.date,
        slot: localDecoded.slot,
        doctorId: '',
        status: 'valid',
      })
    }

    try {
      const validated = await adminAPI.validateTicket(data)
      console.log('Backend response:', validated)
      setValidationStatus(validated.status)
      setValidationMessage(validated.message || '')

      if (validated.status === 'invalid') {
        setScannedPatient({ appointmentId:'invalid', name:'Unknown', doctor:'Unknown', hospital: '-', paymentStatus: '-', token:0, date:'-', slot:'-', doctorId:'', status:'invalid' })
        setScannerError(validated.message || 'Ticket not found')
        return
      }

      if (validated.status === 'already_checked_in') {
        setScannedPatient({
          appointmentId: validated.appointmentId || 'unknown',
          name: validated.patientName || 'Patient',
          doctor: validated.doctorName || 'Doctor',
          hospital: validated.hospitalName || '-',
          paymentStatus: validated.paymentStatus || '-',
          token: Number(validated.token) || 0,
          date: validated.date || '-',
          slot: validated.slot || '-',
          doctorId: validated.doctorId || '',
          status: 'already-checked-in',
        })
        if (validated.doctorId) {
          setActiveDoctorId(validated.doctorId)
          setActiveQueueDate(validated.date || '')
          await refreshQueueForDoctor(validated.doctorId, validated.date || '')
        }
        return
      }

      const checkIn = await adminAPI.checkIn(data)
      console.log('Backend response:', checkIn)
      const doctorId = checkIn.doctorId || validated.doctorId || ''
      setCheckedInCount((value) => value + (checkIn.status === 'checked_in' ? 1 : 0))
      setQueueTotal(Number(checkIn.queueTotal) || queueTotal)
      setActiveDoctorId(doctorId)
      setActiveQueueDate(checkIn.date || validated.date || '')
      if (doctorId) {
        await refreshQueueForDoctor(doctorId, checkIn.date || validated.date || '')
      }

      setScannedPatient({
        appointmentId: checkIn.appointmentId || validated.appointmentId || 'unknown',
        name: checkIn.patientName || validated.patientName || 'Patient',
        doctor: checkIn.doctorName || validated.doctorName || 'Doctor',
        hospital: checkIn.hospitalName || validated.hospitalName || '-',
        paymentStatus: checkIn.paymentStatus || validated.paymentStatus || '-',
        token: Number(checkIn.token || validated.token) || 0,
        date: checkIn.date || validated.date || '-',
        slot: checkIn.slot || validated.slot || '-',
        doctorId,
        status: checkIn.status === 'already_checked_in' ? 'already-checked-in' : 'valid',
      })
    } catch {
      if (localDecoded) {
        setScannerError('Offline fallback: showing QR details, but backend validation failed.')
      } else {
        setScannedPatient({ appointmentId:'invalid', name:'Unknown', doctor:'Unknown', hospital: '-', paymentStatus: '-', token:0, date:'-', slot:'-', doctorId:'', status:'invalid' })
        setScannerError('Invalid QR. Please try scanning again.')
      }
      setValidationStatus(localDecoded ? 'valid' : 'invalid')
      setValidationMessage(localDecoded ? 'Validated from QR payload fallback' : 'Invalid QR code')
    } finally {
      setIsValidating(false)
    }
  }

  const avgWaitMin = Math.max(0, queueTotal * 5)
  const pendingCount = Math.max(0, queueTotal - 1)

  // Load doctors on mount
  useEffect(() => {
    void loadAllDoctors()
  }, [])

  const loadAllDoctors = async () => {
    setIsDoctorsLoading(true)
    try {
      await seedInitialDataIfNeeded()
      const docs = await getDoctors()
      const hosps = await getFirestoreHospitals()
      setAllDoctors(docs)
      setSampleHospitals(hosps.length > 0 ? hosps : SAMPLE_HOSPITALS)
    } catch {
      setAllDoctors([])
    } finally {
      setIsDoctorsLoading(false)
    }
  }

  const openAddDoctorForm = () => {
    setEditingDoctor(null)
    setDoctorFormData({
      name: '',
      specialization: 'Cardiologist',
      hospitalId: sampleHospitals[0]?.id || 'hosp-1',
      hospitalName: sampleHospitals[0]?.name || 'Hospital',
      qualification: '',
      experience: 5,
      consultationFee: 500,
      rating: 4.5,
      availability: 'Today',
      availableToday: true,
      gender: 'Male',
      phone: '',
      languages: ['English', 'Telugu'],
      latitude: sampleHospitals[0]?.latitude || 16.5062,
      longitude: sampleHospitals[0]?.longitude || 80.648,
      profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
      availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    })
    setShowDoctorForm(true)
  }

  const openEditDoctorForm = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setDoctorFormData({ ...doctor })
    setShowDoctorForm(true)
  }

  const handleSaveDoctor = async () => {
    if (!doctorFormData.name || !doctorFormData.specialization || !doctorFormData.hospitalId) {
      setDoctorActionMessage('Please fill in all required fields.')
      return
    }
    setIsSavingDoctor(true)
    try {
      const selectedHosp = sampleHospitals.find((h) => h.id === doctorFormData.hospitalId) || sampleHospitals[0]
      const doctorPayload: Doctor = {
        id: editingDoctor?.id || `doc-${Date.now()}`,
        name: doctorFormData.name || '',
        specialization: doctorFormData.specialization || 'General Physician',
        hospitalId: doctorFormData.hospitalId || selectedHosp.id,
        hospitalName: selectedHosp?.name || doctorFormData.hospitalName || 'Hospital',
        latitude: selectedHosp?.latitude || doctorFormData.latitude || 16.5062,
        longitude: selectedHosp?.longitude || doctorFormData.longitude || 80.648,
        experience: Number(doctorFormData.experience) || 5,
        rating: Number(doctorFormData.rating) || 4.5,
        consultationFee: Number(doctorFormData.consultationFee) || 500,
        availableToday: doctorFormData.availability === 'Today',
        availability: (doctorFormData.availability as any) || 'Today',
        profileImage: doctorFormData.profileImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
        qualification: doctorFormData.qualification || 'MBBS',
        languages: doctorFormData.languages || ['English', 'Telugu'],
        phone: doctorFormData.phone || '+91 98480 00000',
        gender: (doctorFormData.gender as 'Male' | 'Female') || 'Male',
        availableSlots: doctorFormData.availableSlots || ['10:00 AM', '02:00 PM'],
      }

      if (editingDoctor) {
        await updateDoctor(editingDoctor.id, doctorPayload)
        setAllDoctors((prev) => prev.map((d) => (d.id === editingDoctor.id ? doctorPayload : d)))
        setDoctorActionMessage('Doctor updated successfully!')
      } else {
        const newDoc = await addDoctor(doctorPayload)
        setAllDoctors((prev) => [newDoc, ...prev])
        setDoctorActionMessage('Doctor added successfully!')
      }
      setShowDoctorForm(false)
      setEditingDoctor(null)
    } catch {
      setDoctorActionMessage('Failed to save doctor. Please try again.')
    } finally {
      setIsSavingDoctor(false)
      setTimeout(() => setDoctorActionMessage(''), 3000)
    }
  }

  const handleDeleteDoctor = async (doctorId: string) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return
    setDeletingDoctorId(doctorId)
    try {
      await deleteDoctor(doctorId)
      setAllDoctors((prev) => prev.filter((d) => d.id !== doctorId))
      setDoctorActionMessage('Doctor deleted successfully.')
    } catch {
      setDoctorActionMessage('Failed to delete doctor.')
    } finally {
      setDeletingDoctorId(null)
      setTimeout(() => setDoctorActionMessage(''), 3000)
    }
  }

  const filteredDoctorsAdmin = allDoctors.filter((d) => {
    const matchSearch = !doctorSearchQuery ||
      d.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
      d.specialization.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
      d.hospitalName.toLowerCase().includes(doctorSearchQuery.toLowerCase())
    const matchSpec = doctorFilterSpec === 'All' || d.specialization === doctorFilterSpec
    return matchSearch && matchSpec
  })

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div><h1 className="text-3xl font-bold text-white">Admin Panel</h1><p className="text-dark-400">Receptionist & Doctor Management Dashboard</p></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[{ icon:Users, label:'In Queue', value:String(queueTotal), color:'text-primary-400' },{ icon:UserCheck, label:'Checked In', value:String(checkedInCount), color:'text-green-400' },{ icon:Clock, label:'Avg Wait', value:`${avgWaitMin}m`, color:'text-yellow-400' },{ icon:Stethoscope, label:'Total Doctors', value:String(allDoctors.length), color:'text-emerald-400' }].map((s,i)=>{const I=s.icon;return(
            <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="glass-card p-4 text-center">
              <I className={`w-6 h-6 ${s.color} mx-auto mb-2`}/><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-dark-400 mt-1">{s.label}</p>
            </motion.div>
          )})}
        </div>

        <div className="flex gap-1 p-1 glass rounded-xl mb-6 w-fit">
          <button onClick={()=>setActiveView('scanner')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView==='scanner'?'bg-primary-500/20 text-primary-300':'text-dark-400 hover:text-white'}`}><QrCode className="w-4 h-4"/>Scanner</button>
          <button onClick={()=>setActiveView('queue')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView==='queue'?'bg-primary-500/20 text-primary-300':'text-dark-400 hover:text-white'}`}><Users className="w-4 h-4"/>Queue</button>
          <button onClick={()=>setActiveView('doctors')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView==='doctors'?'bg-emerald-500/20 text-emerald-300':'text-dark-400 hover:text-white'}`}><Stethoscope className="w-4 h-4"/>Doctors</button>
        </div>

        {activeView==='scanner' ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><QrCode className="w-5 h-5 text-primary-400"/>Scan Patient QR</h2>
              <QRScanner onScan={handleQRScan} onError={(e)=>setScannerError(e)}/>
              {scannerError && (
                <div className="mt-3 text-xs text-amber-300">{scannerError}</div>
              )}
            </motion.div>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Scan Result</h2>
              {isValidating ? (
                <div className="text-center py-12 text-dark-400">
                  <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
                  <p>Validating scanned ticket...</p>
                  {scanResult && <p className="mt-2 text-xs text-dark-500 break-all">{scanResult}</p>}
                </div>
              ) : scannedPatient ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl text-center border ${scannedPatient.status==='valid'?'bg-green-500/10 border-green-500/20':scannedPatient.status==='already-checked-in'?'bg-blue-500/10 border-blue-500/20':'bg-red-500/10 border-red-500/20'}`}>
                    {scannedPatient.status==='valid'?<><CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2"/><p className="text-green-400 font-bold">VALID TICKET ✅</p></>:scannedPatient.status==='already-checked-in'?<><UserCheck className="w-8 h-8 text-blue-400 mx-auto mb-2"/><p className="text-blue-400 font-bold">ALREADY CHECKED IN ⚠️</p></>:<><XCircle className="w-8 h-8 text-red-400 mx-auto mb-2"/><p className="text-red-400 font-bold">INVALID QR ❌</p></>}
                  </div>
                  <div className="space-y-3">
                    {[{l:'Patient',v:scannedPatient.name},{l:'Doctor',v:scannedPatient.doctor},{l:'Hospital',v:scannedPatient.hospital || '-'},{l:'Booking ID',v:scannedPatient.appointmentId},{l:'Token',v:`#${scannedPatient.token}`},{l:'Date',v:scannedPatient.date},{l:'Time',v:scannedPatient.slot},{l:'Payment',v:String(scannedPatient.paymentStatus || '-').toUpperCase()}].map(x=>(
                      <div key={x.l} className="flex justify-between text-sm"><span className="text-dark-400">{x.l}</span><span className="text-white font-medium">{x.v}</span></div>
                    ))}
                  </div>
                  {(validationStatus || validationMessage) && (
                    <div className="text-xs text-dark-400 rounded-lg bg-white/5 px-3 py-2">
                      Status: {validationStatus || '-'} {validationMessage ? `• ${validationMessage}` : ''}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handlePrintReceipt} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 transition-all text-sm"><Printer className="w-4 h-4"/>Print</button>
                    <button onClick={async ()=>{ if (scannedPatient.doctorId) { await refreshQueueForDoctor(scannedPatient.doctorId, scannedPatient.date) } setScannedPatient(null); setScanResult(null); setValidationStatus(null); setValidationMessage(''); setScannerError('') }} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 transition-all text-sm"><RefreshCw className="w-4 h-4"/>Scan Another</button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-dark-500"><QrCode className="w-16 h-16 mx-auto mb-4 opacity-20"/><p>Scan a QR code to see details</p></div>
              )}
            </motion.div>
          </div>
        ) : activeView === 'queue' ? (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Today's Queue {activeDoctorId ? `— ${activeDoctorId}` : ''}{activeQueueDate ? ` (${activeQueueDate})` : ''}</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5"><th className="text-left py-3 px-4 text-dark-400">Token</th><th className="text-left py-3 px-4 text-dark-400">Patient</th><th className="text-left py-3 px-4 text-dark-400">Time</th><th className="text-left py-3 px-4 text-dark-400">People Ahead</th><th className="text-left py-3 px-4 text-dark-400">Est. Wait</th><th className="text-left py-3 px-4 text-dark-400">Status</th><th className="text-left py-3 px-4 text-dark-400">Action</th></tr></thead>
              <tbody>{liveQueue.map((q, index)=>{
                const peopleAhead = liveQueue.slice(0, index).filter(prev => prev.status !== 'Completed').length;
                const estWait = peopleAhead * 5;
                return (
                <tr key={q.token} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                  <td className="py-3 px-4"><span className="w-8 h-8 rounded-lg bg-primary-500/10 inline-flex items-center justify-center text-primary-300 font-bold">{q.token}</span></td>
                  <td className="py-3 px-4 text-white">{q.name}</td><td className="py-3 px-4 text-dark-400">{q.time}</td>
                  <td className="py-3 px-4 text-dark-400">{peopleAhead}</td><td className="py-3 px-4 text-dark-400">{estWait} mins</td>
                  <td className={`py-3 px-4 font-medium ${statusColors[q.status]}`}>{q.status}</td>
                  <td className="py-3 px-4">{q.status==='Waiting'&&<button className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20">Call</button>}{q.status==='In Progress'&&<button className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20">Done</button>}</td>
                </tr>
              )})}</tbody>
            </table>
            {liveQueue.length === 0 && (
              <div className="text-sm text-dark-400 mt-4">No queue entries yet. Scan a patient QR to populate live queue.</div>
            )}
          </motion.div>
        ) : (
          /* Step 17: Doctor Management Tab */
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Stethoscope className="w-5 h-5 text-emerald-400"/>Doctor Management</h2>
                <p className="text-dark-400 text-sm mt-0.5">{filteredDoctorsAdmin.length} doctors across {sampleHospitals.length} hospitals</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={openAddDoctorForm} className="flex items-center gap-2 px-4 py-2.5 rounded-xl btn-gradient text-sm font-semibold shadow-glass">
                  <Plus className="w-4 h-4"/>Add Doctor
                </button>
                <button onClick={loadAllDoctors} disabled={isDoctorsLoading} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 transition-colors">
                  <RefreshCw className={`w-4 h-4 ${isDoctorsLoading ? 'animate-spin' : ''}`}/>
                </button>
              </div>
            </div>

            {doctorActionMessage && (
              <div className="p-3 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium">{doctorActionMessage}</div>
            )}

            {/* Filters */}
            <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
              <input type="text" placeholder="Search by name, specialization or hospital..." value={doctorSearchQuery} onChange={e=>setDoctorSearchQuery(e.target.value)}
                className="flex-1 glass-input text-sm py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-dark-400" />
              <select value={doctorFilterSpec} onChange={e=>setDoctorFilterSpec(e.target.value)}
                className="bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:ring-1 focus:ring-primary-500 min-w-[180px]">
                <option value="All">All Specializations</option>
                {SPECIALIZATIONS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Doctor Table */}
            {isDoctorsLoading ? (
              <div className="text-center py-12"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"/></div>
            ) : filteredDoctorsAdmin.length === 0 ? (
              <div className="text-center py-12 text-dark-400">No doctors found. Add your first doctor using the button above.</div>
            ) : (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-dark-400 font-semibold">Doctor</th>
                      <th className="text-left py-3 px-4 text-dark-400 font-semibold hidden sm:table-cell">Specialization</th>
                      <th className="text-left py-3 px-4 text-dark-400 font-semibold hidden md:table-cell">Hospital</th>
                      <th className="text-left py-3 px-4 text-dark-400 font-semibold hidden lg:table-cell">Fee</th>
                      <th className="text-left py-3 px-4 text-dark-400 font-semibold">Available</th>
                      <th className="text-right py-3 px-4 text-dark-400 font-semibold">Actions</th>
                    </tr></thead>
                    <tbody>
                      {filteredDoctorsAdmin.map(docItem=>(
                        <tr key={docItem.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={docItem.profileImage} alt={docItem.name} className="w-9 h-9 rounded-xl object-cover border border-white/10" onError={e=>(e.target as HTMLImageElement).src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80'}/>
                              <div>
                                <p className="text-white font-semibold text-sm">{docItem.name}</p>
                                <p className="text-dark-400 text-[11px]">{docItem.qualification}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 hidden sm:table-cell"><span className="px-2 py-1 rounded-lg bg-primary-500/10 text-primary-300 text-xs font-medium">{docItem.specialization}</span></td>
                          <td className="py-3 px-4 text-dark-300 hidden md:table-cell text-xs">{docItem.hospitalName}</td>
                          <td className="py-3 px-4 text-emerald-400 font-semibold hidden lg:table-cell">₹{docItem.consultationFee}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${docItem.availableToday ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                              {docItem.availability}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={()=>openEditDoctorForm(docItem)} className="p-1.5 rounded-lg bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 transition-colors" title="Edit Doctor">
                                <Pencil className="w-3.5 h-3.5"/>
                              </button>
                              <button onClick={()=>handleDeleteDoctor(docItem.id)} disabled={deletingDoctorId===docItem.id} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Delete Doctor">
                                {deletingDoctorId===docItem.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin"/> : <Trash2 className="w-3.5 h-3.5"/>}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Doctor Add/Edit Form Modal */}
      <AnimatePresence>
        {showDoctorForm && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-dark-900/80 backdrop-blur-md overflow-y-auto">
            <motion.div onClick={e=>e.stopPropagation()}
              initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              className="relative w-full max-w-2xl glass-card border border-white/10 rounded-3xl overflow-hidden shadow-glass-lg my-8 z-10">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-emerald-400"/>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
                </h3>
                <button type="button" onClick={()=>{setShowDoctorForm(false);setEditingDoctor(null)}} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><X className="w-5 h-5"/></button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh] space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1">Doctor Name *</label>
                    <input type="text" value={doctorFormData.name||''} onChange={e=>setDoctorFormData(p=>({...p,name:e.target.value}))}
                      placeholder="Dr. Full Name" className="w-full glass-input bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-dark-500"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1">Specialization *</label>
                    <select value={doctorFormData.specialization||'Cardiologist'} onChange={e=>setDoctorFormData(p=>({...p,specialization:e.target.value}))}
                      className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                      {SPECIALIZATIONS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1">Assign to Hospital *</label>
                    <select value={doctorFormData.hospitalId||''} onChange={e=>{const h=sampleHospitals.find(h=>h.id===e.target.value);setDoctorFormData(p=>({...p,hospitalId:e.target.value,hospitalName:h?.name||'',latitude:h?.latitude,longitude:h?.longitude}))}}
                      className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                      {sampleHospitals.map(h=><option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1">Qualification</label>
                    <input type="text" value={doctorFormData.qualification||''} onChange={e=>setDoctorFormData(p=>({...p,qualification:e.target.value}))}
                      placeholder="MBBS, MD" className="w-full glass-input bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-dark-500"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1">Experience (Years)</label>
                    <input type="number" min="0" max="50" value={doctorFormData.experience||5} onChange={e=>setDoctorFormData(p=>({...p,experience:Number(e.target.value)}))}
                      className="w-full glass-input bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1">Consultation Fee (₹)</label>
                    <input type="number" min="0" value={doctorFormData.consultationFee||500} onChange={e=>setDoctorFormData(p=>({...p,consultationFee:Number(e.target.value)}))}
                      className="w-full glass-input bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1">Rating</label>
                    <input type="number" min="1" max="5" step="0.1" value={doctorFormData.rating||4.5} onChange={e=>setDoctorFormData(p=>({...p,rating:Number(e.target.value)}))}
                      className="w-full glass-input bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1">Availability</label>
                    <select value={doctorFormData.availability||'Today'} onChange={e=>setDoctorFormData(p=>({...p,availability:e.target.value as any,availableToday:e.target.value==='Today'}))}
                      className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                      <option value="Today">Today</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="Weekend">Weekend</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1">Gender</label>
                    <select value={doctorFormData.gender||'Male'} onChange={e=>setDoctorFormData(p=>({...p,gender:e.target.value as any}))}
                      className="w-full bg-dark-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-dark-400 mb-1">Phone</label>
                    <input type="text" value={doctorFormData.phone||''} onChange={e=>setDoctorFormData(p=>({...p,phone:e.target.value}))}
                      placeholder="+91 98480 XXXXX" className="w-full glass-input bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-dark-500"/>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark-400 mb-1">Profile Image URL</label>
                  <input type="url" value={doctorFormData.profileImage||''} onChange={e=>setDoctorFormData(p=>({...p,profileImage:e.target.value}))}
                    placeholder="https://..." className="w-full glass-input bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm placeholder:text-dark-500"/>
                </div>
              </div>
              <div className="p-6 border-t border-white/10 flex gap-3 justify-end">
                <button type="button" onClick={()=>{setShowDoctorForm(false);setEditingDoctor(null)}} className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 text-sm font-semibold">Cancel</button>
                <button type="button" onClick={handleSaveDoctor} disabled={isSavingDoctor}
                  className="px-5 py-2.5 rounded-xl btn-gradient text-sm font-semibold flex items-center gap-2 disabled:opacity-60">
                  {isSavingDoctor ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                  {isSavingDoctor ? 'Saving...' : editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
