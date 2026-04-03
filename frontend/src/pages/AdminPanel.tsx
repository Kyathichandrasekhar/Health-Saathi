import { useState } from 'react'
import { motion } from 'framer-motion'
import { QrCode, CheckCircle, XCircle, Users, Clock, UserCheck, AlertTriangle, RefreshCw, Shield } from 'lucide-react'
import QRScanner from '../components/QRScanner'
import { bookingAPI, qrAPI, queueAPI } from '../services/api'

interface ScannedPatient {
  appointmentId: string
  name: string
  doctor: string
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

export default function AdminPanel() {
  const [scannedPatient, setScannedPatient] = useState<ScannedPatient | null>(null)
  const [activeView, setActiveView] = useState<'scanner' | 'queue'>('scanner')
  const [checkedInCount, setCheckedInCount] = useState(0)
  const [queueTotal, setQueueTotal] = useState(0)
  const [liveQueue, setLiveQueue] = useState<LiveQueueEntry[]>([])
  const [activeDoctorId, setActiveDoctorId] = useState('')
  const [activeQueueDate, setActiveQueueDate] = useState('')
  const statusColors: Record<string,string> = { Completed:'text-green-400', 'In Progress':'text-yellow-400', Waiting:'text-dark-400' }

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
    try {
      const result = await qrAPI.validate(data)
      if (!result.valid || !result.data) {
        setScannedPatient({ appointmentId:'invalid', name:'Unknown', doctor:'Unknown', token:0, date:'-', slot:'-', doctorId:'', status:'invalid' })
        return
      }

      const booking = await bookingAPI.getById(result.data.appointmentId)
      const doctorId = booking.doctor_id || ''
      const wasAlreadyCheckedIn = String(booking.status || '').toLowerCase() === 'checked-in'

      const checkInResult = await queueAPI.checkIn(result.data.appointmentId)
      setCheckedInCount((value) => value + (wasAlreadyCheckedIn ? 0 : 1))
      setActiveDoctorId(checkInResult.doctorId || doctorId)
      setActiveQueueDate(checkInResult.date || result.data.date || '')
      await refreshQueueForDoctor(checkInResult.doctorId || doctorId, checkInResult.date || result.data.date)

      setScannedPatient({
        appointmentId: result.data.appointmentId,
        name: result.data.patientName || 'Patient',
        doctor: result.data.doctorName,
        token: result.data.token,
        date: result.data.date,
        slot: result.data.slot,
        doctorId: checkInResult.doctorId || doctorId,
        status: wasAlreadyCheckedIn ? 'already-checked-in' : 'valid',
      })
    } catch {
      setScannedPatient({ appointmentId:'invalid', name:'Unknown', doctor:'Unknown', token:0, date:'-', slot:'-', doctorId:'', status:'invalid' })
    }
  }

  const avgWaitMin = Math.max(0, queueTotal * 5)
  const pendingCount = Math.max(0, queueTotal - 1)

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div><h1 className="text-3xl font-bold text-white">Admin Panel</h1><p className="text-dark-400">Receptionist Dashboard</p></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[{ icon:Users, label:'In Queue', value:String(queueTotal), color:'text-primary-400' },{ icon:UserCheck, label:'Checked In', value:String(checkedInCount), color:'text-green-400' },{ icon:Clock, label:'Avg Wait', value:`${avgWaitMin}m`, color:'text-yellow-400' },{ icon:AlertTriangle, label:'Pending', value:String(pendingCount), color:'text-red-400' }].map((s,i)=>{const I=s.icon;return(
            <motion.div key={s.label} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}} className="glass-card p-4 text-center">
              <I className={`w-6 h-6 ${s.color} mx-auto mb-2`}/><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-dark-400 mt-1">{s.label}</p>
            </motion.div>
          )})}
        </div>

        <div className="flex gap-1 p-1 glass rounded-xl mb-6 w-fit">
          <button onClick={()=>setActiveView('scanner')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView==='scanner'?'bg-primary-500/20 text-primary-300':'text-dark-400 hover:text-white'}`}><QrCode className="w-4 h-4"/>Scanner</button>
          <button onClick={()=>setActiveView('queue')} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeView==='queue'?'bg-primary-500/20 text-primary-300':'text-dark-400 hover:text-white'}`}><Users className="w-4 h-4"/>Queue</button>
        </div>

        {activeView==='scanner' ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><QrCode className="w-5 h-5 text-primary-400"/>Scan Patient QR</h2>
              <QRScanner onScan={handleQRScan} onError={(e)=>console.error(e)}/>
            </motion.div>
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="glass-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Scan Result</h2>
              {scannedPatient ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl text-center border ${scannedPatient.status==='valid'?'bg-green-500/10 border-green-500/20':scannedPatient.status==='already-checked-in'?'bg-blue-500/10 border-blue-500/20':'bg-red-500/10 border-red-500/20'}`}>
                    {scannedPatient.status==='valid'?<><CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2"/><p className="text-green-400 font-bold">Valid</p></>:scannedPatient.status==='already-checked-in'?<><UserCheck className="w-8 h-8 text-blue-400 mx-auto mb-2"/><p className="text-blue-400 font-bold">Checked In ✓</p></>:<><XCircle className="w-8 h-8 text-red-400 mx-auto mb-2"/><p className="text-red-400 font-bold">Invalid</p></>}
                  </div>
                  <div className="space-y-3">
                    {[{l:'Patient',v:scannedPatient.name},{l:'Doctor',v:scannedPatient.doctor},{l:'Token',v:`#${scannedPatient.token}`},{l:'Date',v:scannedPatient.date},{l:'Time',v:scannedPatient.slot}].map(x=>(
                      <div key={x.l} className="flex justify-between text-sm"><span className="text-dark-400">{x.l}</span><span className="text-white font-medium">{x.v}</span></div>
                    ))}
                  </div>
                  <button onClick={async ()=>{ if (scannedPatient.doctorId) { await refreshQueueForDoctor(scannedPatient.doctorId, scannedPatient.date) } setScannedPatient(null) }} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 transition-all text-sm"><RefreshCw className="w-4 h-4"/>Scan Another</button>
                </div>
              ) : (
                <div className="text-center py-12 text-dark-500"><QrCode className="w-16 h-16 mx-auto mb-4 opacity-20"/><p>Scan a QR code to see details</p></div>
              )}
            </motion.div>
          </div>
        ) : (
          <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Today's Queue {activeDoctorId ? `— ${activeDoctorId}` : ''}{activeQueueDate ? ` (${activeQueueDate})` : ''}</h2>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-white/5"><th className="text-left py-3 px-4 text-dark-400">Token</th><th className="text-left py-3 px-4 text-dark-400">Patient</th><th className="text-left py-3 px-4 text-dark-400">Time</th><th className="text-left py-3 px-4 text-dark-400">Status</th><th className="text-left py-3 px-4 text-dark-400">Action</th></tr></thead>
              <tbody>{liveQueue.map(q=>(
                <tr key={q.token} className="border-b border-white/3 hover:bg-white/3 transition-colors">
                  <td className="py-3 px-4"><span className="w-8 h-8 rounded-lg bg-primary-500/10 inline-flex items-center justify-center text-primary-300 font-bold">{q.token}</span></td>
                  <td className="py-3 px-4 text-white">{q.name}</td><td className="py-3 px-4 text-dark-400">{q.time}</td>
                  <td className={`py-3 px-4 font-medium ${statusColors[q.status]}`}>{q.status}</td>
                  <td className="py-3 px-4">{q.status==='Waiting'&&<button className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-medium hover:bg-green-500/20">Call</button>}{q.status==='In Progress'&&<button className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20">Done</button>}</td>
                </tr>
              ))}</tbody>
            </table>
            {liveQueue.length === 0 && (
              <div className="text-sm text-dark-400 mt-4">No queue entries yet. Scan a patient QR to populate live queue.</div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
