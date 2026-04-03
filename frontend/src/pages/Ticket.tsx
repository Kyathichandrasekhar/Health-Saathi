import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Share2, Calendar, Clock, Stethoscope, MapPin, Hash } from 'lucide-react'
import QRGenerator from '../components/QRGenerator'
import { jsPDF } from 'jspdf'
import { bookingAPI, qrAPI, type TicketReceipt } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

export default function Ticket() {
  const { appointmentId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [receipt, setReceipt] = useState<TicketReceipt | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [publicBaseUrl, setPublicBaseUrl] = useState('')

  const fallbackAppointment = (location.state || null) as Record<string, any> | null
  const resolvedAppointmentId = appointmentId || fallbackAppointment?.appointmentId || ''

  useEffect(() => {
    let mounted = true

    const loadReceipt = async () => {
      if (!resolvedAppointmentId) {
        setError('Invalid appointment reference')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await bookingAPI.getReceipt(resolvedAppointmentId)
        if (mounted) {
          setReceipt(data)
          setError('')
        }
      } catch {
        if (mounted) {
          setError('Ticket receipt not found')
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
  }, [resolvedAppointmentId])

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

  const handleDownload = async () => {
    if (!receipt) {
      return
    }

    const qr = await qrAPI.generate({
      appointmentId: receipt.appointment_id,
      ticketUrl,
      token: receipt.token_number,
      doctorName: receipt.doctor_name,
      date: receipt.date,
      slot: receipt.slot,
    })

    const qrDataUrl = `data:image/png;base64,${qr.qr_image}`
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' })

    pdf.setFillColor(21, 31, 65)
    pdf.rect(0, 0, 595, 90, 'F')
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(22)
    pdf.text('Health Saathi - Appointment Receipt', 40, 55)

    pdf.setTextColor(20, 20, 20)
    pdf.setFontSize(11)

    const lines = [
      `Appointment ID: ${receipt.appointment_id}`,
      `Patient Name: ${receipt.patient_name}`,
      `Patient Email: ${receipt.patient_email}`,
      `Patient User ID: ${receipt.user_id}`,
      `Patient Phone: ${receipt.patient_phone || 'N/A'}`,
      `Hospital: ${receipt.hospital_name}`,
      `Doctor: ${receipt.doctor_name}`,
      `Specialization: ${receipt.specialization}`,
      `Appointment Date: ${receipt.date}`,
      `Appointment Time: ${receipt.slot}`,
      `Token Number: ${receipt.token_number}`,
      `Payment Status: ${receipt.payment_status}`,
      `Paid Amount: INR ${receipt.paid_amount}`,
      `Booking Timestamp: ${new Date(receipt.booking_timestamp).toLocaleString('en-IN')}`,
    ]

    let y = 130
    lines.forEach((line) => {
      pdf.text(line, 40, y)
      y += 22
    })

    pdf.addImage(qrDataUrl, 'PNG', 390, 125, 160, 160)
    pdf.setFontSize(9)
    pdf.text('Scan this QR to open appointment receipt', 390, 300)
    pdf.text(ticketUrl, 40, 500)

    pdf.save(`HealthSaathi-Receipt-${receipt.appointment_id}.pdf`)
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
              <div className="flex justify-center mb-6">
                <QRGenerator data={ticketUrl} size={180} />
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

              {/* Status */}
              <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                <span className="text-green-400 text-sm font-semibold">
                  Payment {receipt.payment_status.toUpperCase()} • ₹{receipt.paid_amount}
                </span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button onClick={handleDownload} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-dark-300 hover:bg-white/10 transition-all text-sm font-medium">
                  <Download className="w-4 h-4" />
                  Download
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
