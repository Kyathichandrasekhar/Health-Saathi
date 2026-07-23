import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Share2, Calendar, Clock, Stethoscope, MapPin, Hash } from 'lucide-react'
import QRGenerator from '../components/QRGenerator'
import { jsPDF } from 'jspdf'
import { bookingAPI, qrAPI, type TicketReceipt } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const TICKET_RECEIPT_CACHE_KEY = 'hs_ticket_receipts_v1'

function toReceiptFromFallback(state: Record<string, any> | null): TicketReceipt | null {
  if (!state) {
    return null
  }

  const appointmentId = String(state.appointmentId || state.bookingId || '').trim()
  if (!appointmentId) {
    return null
  }

  const doctorName = String(state.doctorName || state.selectedDoctor?.name || '').trim()
  const specialization = String(state.specialty || state.selectedDoctor?.specialization || '').trim()
  const hospitalName = String(state.hospitalName || state.selectedHospital?.name || '').trim()
  const date = String(state.date || state.selectedDate || '').trim()
  const slot = String(state.slot || state.selectedSlot || '').trim()
  const tokenNumber = Number(state.tokenNumber || 1) || 1
  const amount = Number(state.fee || state.selectedDoctor?.fee || 0) || 0
  const paymentStatus = String(state.paymentStatus || 'paid').trim() || 'paid'
  const userId = String(state.user?.uid || '').trim()
  const patientName = String(state.user?.name || '').trim() || 'Patient'
  const patientEmail = String(state.user?.email || '').trim() || 'N/A'
  const patientPhone = String(state.user?.phone || '').trim()

  if (!doctorName || !hospitalName || !date || !slot) {
    return null
  }

  return {
    appointment_id: appointmentId,
    patient_name: patientName,
    patient_email: patientEmail,
    patient_phone: patientPhone,
    user_id: userId || patientEmail,
    doctor_name: doctorName,
    specialization: specialization || 'General Medicine',
    hospital_name: hospitalName,
    date,
    slot,
    payment_status: paymentStatus,
    paid_amount: amount,
    booking_timestamp: new Date().toISOString(),
    token_number: tokenNumber,
    status: 'Confirmed',
  }
}

function readCachedReceipt(appointmentId: string): TicketReceipt | null {
  try {
    const raw = sessionStorage.getItem(TICKET_RECEIPT_CACHE_KEY)
    if (!raw) {
      return null
    }

    const parsed = JSON.parse(raw) as Record<string, TicketReceipt>
    const cached = parsed?.[appointmentId]
    return cached || null
  } catch {
    return null
  }
}

function cacheReceipt(receipt: TicketReceipt) {
  try {
    const raw = sessionStorage.getItem(TICKET_RECEIPT_CACHE_KEY)
    const current = raw ? (JSON.parse(raw) as Record<string, TicketReceipt>) : {}
    current[receipt.appointment_id] = receipt
    sessionStorage.setItem(TICKET_RECEIPT_CACHE_KEY, JSON.stringify(current))
  } catch {
    // Ignore sessionStorage failures.
  }
}

export default function Ticket() {
  const { appointmentId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [receipt, setReceipt] = useState<TicketReceipt | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [publicBaseUrl, setPublicBaseUrl] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const ticketQrRef = useRef<HTMLDivElement | null>(null)

  const fallbackAppointment = (location.state || null) as Record<string, any> | null
  const resolvedAppointmentId = appointmentId || fallbackAppointment?.appointmentId || ''
  const fallbackReceipt = useMemo(() => toReceiptFromFallback(fallbackAppointment), [fallbackAppointment])

  useEffect(() => {
    let mounted = true

    const loadReceipt = async () => {
      if (!resolvedAppointmentId) {
        setError('Invalid appointment reference')
        setLoading(false)
        return
      }

      const localReceipt = fallbackReceipt || readCachedReceipt(resolvedAppointmentId)
      if (localReceipt && mounted) {
        setReceipt(localReceipt)
        setError('')
        setLoading(false)
      }

      try {
        if (!localReceipt) {
          setLoading(true)
        }
        const data = await bookingAPI.getReceipt(resolvedAppointmentId)
        if (mounted) {
          setReceipt(data)
          cacheReceipt(data)
          setError('')
        }
      } catch {
        if (mounted) {
          if (!localReceipt) {
            setError('Ticket receipt not found')
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadReceipt()

    return () => {
      mounted = false
    }
  }, [fallbackReceipt, resolvedAppointmentId])

  useEffect(() => {
    let mounted = true

    const configured = (import.meta.env.VITE_PUBLIC_APP_URL as string | undefined)?.trim()
    if (configured) {
      setPublicBaseUrl(configured.replace(/\/$/, ''))
      return () => {
        mounted = false
      }
    }

    const resolveLocalLanUrl = async () => {
      try {
        const res = await fetch('/api/public-base-url')
        const data = await res.json()
        if (mounted && data?.url) {
          setPublicBaseUrl(String(data.url).replace(/\/$/, ''))
          return
        }
      } catch {
        // Fallback below.
      }

      if (mounted) {
        setPublicBaseUrl(window.location.origin)
      }
    }

    resolveLocalLanUrl()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!resolvedAppointmentId) {
      navigate('/booking', { replace: true })
    }
  }, [navigate, resolvedAppointmentId])

  const ticketUrl = useMemo(() => {
    if (!resolvedAppointmentId) {
      return ''
    }
    const base = (publicBaseUrl || window.location.origin).replace(/\/$/, '')
    return `${base}/ticket/${resolvedAppointmentId}`
  }, [resolvedAppointmentId, publicBaseUrl])

  const qrPayload = useMemo(() => {
    if (!receipt) {
      return ticketUrl
    }

    return JSON.stringify({
      a: receipt.appointment_id,
      n: receipt.patient_name,
      d: receipt.doctor_name,
      h: receipt.hospital_name,
      dt: receipt.date,
      s: receipt.slot,
      t: receipt.token_number,
    })
  }, [receipt, ticketUrl])

  const getRenderedQrPngDataUrl = async () => {
    const svgElement = ticketQrRef.current?.querySelector('svg') as SVGSVGElement | null
    if (!svgElement) {
      return null
    }

    const serializer = new XMLSerializer()
    const svgString = serializer.serializeToString(svgElement)
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)

    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image()
        image.onload = () => resolve(image)
        image.onerror = () => reject(new Error('Unable to render QR image'))
        image.src = svgUrl
      })

      const canvas = document.createElement('canvas')
      const svgWidth = Number(svgElement.getAttribute('width')) || img.width || 220
      const svgHeight = Number(svgElement.getAttribute('height')) || img.height || 220
      canvas.width = svgWidth
      canvas.height = svgHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return null
      }

      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      return canvas.toDataURL('image/png')
    } finally {
      URL.revokeObjectURL(svgUrl)
    }
  }

  const handleDownload = async () => {
    if (!receipt) {
      return
    }

    try {
      setIsDownloading(true)

      let qrDataUrl = (await getRenderedQrPngDataUrl()) || ''

      if (!qrDataUrl) {
        try {
          const qr = await qrAPI.generate({
            appointmentId: receipt.appointment_id,
            ticketUrl,
            token: receipt.token_number,
            doctorName: receipt.doctor_name,
            date: receipt.date,
            slot: receipt.slot,
          })
          qrDataUrl = `data:image/png;base64,${qr.qr_image}`
        } catch (error) {
          console.error('QR API unavailable and no on-screen QR found:', error)
        }
      }

      const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
      const pageWidth = 595.28;
      
      // Header Background
      pdf.setFillColor(21, 31, 65)
      pdf.rect(0, 0, pageWidth, 100, 'F')
      
      // Header Text
      pdf.setTextColor(255, 255, 255)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(24)
      pdf.text('Health Saathi', 40, 50)
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(14)
      pdf.text('Appointment Receipt & Digital Ticket', 40, 75)
      
      // Sub Header
      pdf.setTextColor(100, 100, 100)
      pdf.setFontSize(10)
      pdf.text(`Booking Date: ${new Date(receipt.booking_timestamp).toLocaleString('en-IN')}`, 40, 130)
      pdf.text(`Appointment ID: ${receipt.appointment_id}`, 40, 145)
      
      // Draw Line
      pdf.setDrawColor(200, 200, 200)
      pdf.setLineWidth(1)
      pdf.line(40, 160, pageWidth - 40, 160)
      
      // Appointment Details Box
      pdf.setFillColor(245, 247, 250)
      pdf.rect(40, 180, 300, 120, 'F')
      
      pdf.setTextColor(21, 31, 65)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(12)
      pdf.text('Appointment Details', 55, 200)
      
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(10)
      pdf.setTextColor(50, 50, 50)
      pdf.text(`Doctor: ${receipt.doctor_name}`, 55, 225)
      pdf.text(`Specialization: ${receipt.specialization}`, 55, 240)
      pdf.text(`Hospital: ${receipt.hospital_name}`, 55, 255)
      pdf.text(`Date: ${receipt.date}`, 55, 270)
      pdf.text(`Time: ${receipt.slot}`, 55, 285)
      
      // QR Code
      if (qrDataUrl) {
        pdf.addImage(qrDataUrl, 'PNG', 380, 175, 140, 140)
        pdf.setFontSize(9)
        pdf.setTextColor(100, 100, 100)
        pdf.text('Scan to View Status', 405, 325)
      }
      
      // Draw Line
      pdf.setDrawColor(200, 200, 200)
      pdf.line(40, 345, pageWidth - 40, 345)
      
      let startY = 370;
      
      // Patient Details
      pdf.setTextColor(21, 31, 65)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(14)
      pdf.text('Patient Information', 40, startY)
      
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(11)
      pdf.setTextColor(50, 50, 50)
      
      const pDetails = receipt.patient_details || {};
      const personal = pDetails.personal || {};
      const medical = pDetails.medical || {};
      const emergency = pDetails.emergency || {};
      
      const pName = personal.fullName || receipt.patient_name;
      const pEmail = personal.email || receipt.patient_email;
      const pPhone = personal.phone || receipt.patient_phone || 'N/A';
      
      const leftColX = 40;
      const rightColX = 300;
      let lineY = startY + 25;
      
      pdf.text(`Name: ${pName}`, leftColX, lineY);
      pdf.text(`Phone: ${pPhone}`, rightColX, lineY);
      lineY += 20;
      
      pdf.text(`Email: ${pEmail}`, leftColX, lineY);
      if (personal.dob) {
         pdf.text(`Age / DOB: ${personal.dob}`, rightColX, lineY);
      }
      lineY += 20;
      
      if (personal.gender) {
         pdf.text(`Gender: ${personal.gender}`, leftColX, lineY);
      }
      if (personal.bloodGroup) {
         pdf.text(`Blood Group: ${personal.bloodGroup}`, rightColX, lineY);
      }
      lineY += 30;
      
      if (medical.symptoms || medical.allergies) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('Medical Context', 40, lineY)
        pdf.setFont('helvetica', 'normal')
        lineY += 20;
        
        if (medical.symptoms) {
            pdf.text(`Symptoms: ${medical.symptoms.substring(0, 70)}${medical.symptoms.length > 70 ? '...' : ''}`, leftColX, lineY);
            lineY += 20;
        }
        if (medical.allergies) {
            pdf.text(`Allergies: ${medical.allergies}`, leftColX, lineY);
            lineY += 20;
        }
        if (medical.existingDiseases) {
            pdf.text(`Existing Diseases: ${medical.existingDiseases}`, leftColX, lineY);
            lineY += 20;
        }
        if (medical.currentMedications) {
            pdf.text(`Medications: ${medical.currentMedications}`, leftColX, lineY);
            lineY += 20;
        }
        lineY += 10;
      }
      
      if (emergency.name) {
        pdf.setFont('helvetica', 'bold')
        pdf.text('Emergency Contact', 40, lineY)
        pdf.setFont('helvetica', 'normal')
        lineY += 20;
        
        pdf.text(`Name: ${emergency.name} (${emergency.relationship || 'N/A'})`, leftColX, lineY);
        pdf.text(`Phone: ${emergency.phone || 'N/A'}`, rightColX, lineY);
        lineY += 40;
      }
      
      // Payment & Token Box
      pdf.setDrawColor(200, 200, 200)
      pdf.line(40, lineY - 15, pageWidth - 40, lineY - 15)
      
      pdf.setFillColor(230, 245, 235)
      pdf.rect(40, lineY, 200, 60, 'F')
      pdf.setTextColor(30, 100, 50)
      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(16)
      pdf.text(`Token: ${receipt.token_number}`, 60, lineY + 25)
      pdf.setFontSize(12)
      pdf.text(`Status: ${receipt.payment_status.toUpperCase()}`, 60, lineY + 45)
      
      pdf.setFillColor(245, 247, 250)
      pdf.rect(260, lineY, 295, 60, 'F')
      pdf.setTextColor(21, 31, 65)
      pdf.setFontSize(14)
      pdf.text(`Paid Amount: INR ${receipt.paid_amount}`, 280, lineY + 35)
      
      // Footer
      pdf.setFontSize(10)
      pdf.setTextColor(150, 150, 150)
      pdf.text('Thank you for choosing Health Saathi.', pageWidth / 2, 800, { align: 'center' })
      
      pdf.save(`HealthSaathi-Receipt-${receipt.appointment_id}.pdf`)
    } catch (error) {
      console.error('Receipt download failed:', error)
      window.alert('Unable to download receipt right now. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    if (!receipt) {
      return
    }

    const text = [
      `Hospital: ${receipt.hospital_name}`,
      `Doctor: ${receipt.doctor_name} (${receipt.specialization})`,
      `Date & Time: ${receipt.date} ${receipt.slot}`,
      `Token: ${receipt.token_number}`,
      `Appointment Link: ${ticketUrl}`,
    ].join('\n')

    if (navigator.share) {
      await navigator.share({
        title: 'Health Saathi Appointment Ticket',
        text,
        url: ticketUrl,
      })
      return
    }

    await navigator.clipboard.writeText(text)
    window.alert('Ticket details copied. You can paste and share.')
  }

  if (loading) {
    return <div className="min-h-screen px-4 py-10 text-center text-dark-300">Loading ticket receipt...</div>
  }

  if (error || !receipt) {
    return <div className="min-h-screen px-4 py-10 text-center text-red-300">{error || 'Ticket not available'}</div>
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Ticket Card */}
          <div className="glass-card overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-center">
              <h1 className="text-2xl font-bold text-white">Appointment Confirmed</h1>
              <p className="text-white/70 text-sm mt-1">Your digital ticket</p>
            </div>

            {/* Token Number */}
            <div className="flex justify-center -mt-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-lg">
                <span className="text-2xl font-black text-white">{receipt.token_number}</span>
              </div>
            </div>

            <div className="p-6 pt-4">
              <p className="text-center text-sm text-dark-400 mb-6">Token Number</p>

              {/* QR Code */}
              <div ref={ticketQrRef} className="flex justify-center mb-6">
                <QRGenerator data={qrPayload} size={220} />
              </div>
              {!import.meta.env.VITE_PUBLIC_APP_URL && (
                <p className="text-xs text-amber-300 text-center mb-4">
                  Set VITE_PUBLIC_APP_URL to your deployment URL for globally shareable ticket links.
                </p>
              )}

              {/* Appointment Details */}
              <div className="space-y-3 p-4 rounded-xl bg-white/3 border border-white/5">
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-dark-400">Appointment ID</span>
                  <span className="text-white font-medium ml-auto">{receipt.appointment_id}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-dark-400">Patient</span>
                  <span className="text-white font-medium ml-auto">{receipt.patient_name || user?.displayName || 'Patient'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-dark-400">Email / User ID</span>
                  <span className="text-white font-medium ml-auto text-right">{receipt.patient_email || receipt.user_id}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Stethoscope className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-dark-400">Doctor</span>
                  <span className="text-white font-medium ml-auto">{receipt.doctor_name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Hash className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                  <span className="text-dark-400">Specialty</span>
                  <span className="text-white font-medium ml-auto">{receipt.specialization}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-dark-400">Date</span>
                  <span className="text-white font-medium ml-auto">{receipt.date}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                  <span className="text-dark-400">Time</span>
                  <span className="text-white font-medium ml-auto">{receipt.slot}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-dark-400">Hospital</span>
                  <span className="text-white font-medium ml-auto text-right">{receipt.hospital_name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-dark-400">Booked At</span>
                  <span className="text-white font-medium ml-auto text-right">
                    {new Date(receipt.booking_timestamp).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {receipt.patient_details && receipt.patient_details.medical && (
                <div className="space-y-3 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 mt-4">
                  <h4 className="text-sm font-semibold text-primary-300 mb-2">Patient Profile</h4>
                  {receipt.patient_details.personal?.dob && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-dark-400 w-24">Age / DOB</span>
                      <span className="text-white font-medium">{receipt.patient_details.personal.dob}</span>
                    </div>
                  )}
                  {receipt.patient_details.medical?.symptoms && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-dark-400 w-24">Symptoms</span>
                      <span className="text-white font-medium">{receipt.patient_details.medical.symptoms}</span>
                    </div>
                  )}
                  {receipt.patient_details.medical?.allergies && (
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-dark-400 w-24">Allergies</span>
                      <span className="text-red-300 font-medium">{receipt.patient_details.medical.allergies}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Status */}
              <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                <span className="text-green-400 text-sm font-semibold">
                  Payment {receipt.payment_status.toUpperCase()} • ₹{receipt.paid_amount}
                </span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 transition-all text-sm font-medium disabled:opacity-60"
                >
                  <Download className="w-4 h-4" />
                  {isDownloading ? 'Downloading...' : 'Download'}
                </button>
                <button onClick={handleShare} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 transition-all text-sm font-medium">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Dashed cut line decoration */}
          <div className="absolute left-0 right-0 top-[180px] flex items-center pointer-events-none">
            <div className="w-4 h-8 bg-dark-950 rounded-r-full" />
            <div className="flex-1 border-t-2 border-dashed border-dark-700" />
            <div className="w-4 h-8 bg-dark-950 rounded-l-full" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
