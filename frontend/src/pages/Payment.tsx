import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import {
  CreditCard, Shield, CheckCircle, AlertCircle, Stethoscope,
  Calendar, Clock, Receipt
} from 'lucide-react'
import { paymentAPI } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { auth, db } from '../services/firebase'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [status, setStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending')

  const appointment = useMemo(() => {
    const state = (location.state || {}) as Record<string, any>
    const appointmentId = String(state.appointmentId || state.bookingId || '').trim()
    const doctorName = String(state.doctorName || state?.selectedDoctor?.name || '').trim()
    const hospitalName = String(state.hospitalName || state?.selectedHospital?.name || '').trim()
    const specialty = String(state.specialty || state?.selectedDoctor?.specialization || '').trim()
    const date = String(state.date || state.selectedDate || '').trim()
    const slot = String(state.slot || state.selectedSlot || '').trim()
    const fee = Number(state.fee || state?.selectedDoctor?.fee || 0)
    const tokenNumber = Number(state.tokenNumber || 0) || 1

    return {
      appointmentId,
      doctorName,
      hospitalName,
      specialty,
      date,
      slot,
      fee,
      tokenNumber,
      hospitalId: String(state.hospitalId || state?.selectedHospital?.id || '').trim(),
      doctorId: String(state.doctorId || state?.selectedDoctor?.id || '').trim(),
      user: {
        uid: String(state?.user?.uid || user?.uid || '').trim(),
        name: String(state?.user?.name || user?.displayName || '').trim(),
        email: String(state?.user?.email || user?.email || '').trim(),
        phone: String(state?.user?.phone || user?.phoneNumber || '').trim(),
      },
    }
  }, [location.state, user])

  const hasValidAppointment =
    Boolean(appointment.appointmentId) &&
    Boolean(appointment.doctorName) &&
    Boolean(appointment.hospitalName) &&
    Boolean(appointment.date) &&
    Boolean(appointment.slot) &&
    appointment.fee > 0

  useEffect(() => {
    if (!hasValidAppointment) {
      navigate('/booking', { replace: true })
    }
  }, [hasValidAppointment, navigate])

  const finalizePayment = async (payload: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => {
    await paymentAPI.verifyPayment({
      ...payload,
      appointmentId: appointment.appointmentId,
      amount: appointment.fee,
    })

    const selectedDoctor = {
      id: appointment.doctorId,
      name: appointment.doctorName,
      specialization: appointment.specialty,
      fee: appointment.fee,
    }
    const selectedHospital = {
      id: appointment.hospitalId,
      name: appointment.hospitalName,
      address: '',
    }
    const selectedSlot = appointment.slot
    const selectedDate = appointment.date
    const generatedToken = appointment.tokenNumber

    console.log({
      selectedDoctor,
      selectedHospital,
      selectedSlot,
      selectedDate,
      user: auth.currentUser,
    })

    await addDoc(collection(db, 'appointments'), {
      bookingId: Date.now(),
      doctorName: selectedDoctor?.name || 'Not selected',
      hospitalName: selectedHospital?.name || 'Not selected',
      paymentStatus: 'paid',
      userId: auth.currentUser?.uid || '',
      patientEmail: auth.currentUser?.email || '',
      slot: selectedSlot || '',
      date: selectedDate || '',
      tokenNumber: generatedToken || 1,
      createdAt: serverTimestamp(),
    })

    setStatus('success')
    setTimeout(() => {
      navigate(`/ticket/${appointment.appointmentId}`, {
        state: {
          appointmentId: appointment.appointmentId,
          bookingId: appointment.appointmentId,
          selectedHospital: {
            id: appointment.hospitalId,
            name: appointment.hospitalName,
          },
          selectedDoctor: {
            id: appointment.doctorId,
            name: appointment.doctorName,
            specialization: appointment.specialty,
            fee: appointment.fee,
          },
          selectedSlot: appointment.slot,
          selectedDate: appointment.date,
          tokenNumber: appointment.tokenNumber,
          paymentStatus: 'paid',
          user: appointment.user,
          hospitalName: appointment.hospitalName,
          doctorName: appointment.doctorName,
          specialty: appointment.specialty,
          slot: appointment.slot,
          date: appointment.date,
          fee: appointment.fee,
        },
      })
    }, 1200)
  }

  const handlePayment = async () => {
    if (!hasValidAppointment) {
      navigate('/booking', { replace: true })
      return
    }

    setStatus('processing')

    // Razorpay integration (test mode)
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_demo'

    const options = {
      key: razorpayKey,
      amount: appointment.fee * 100, // in paise
      currency: 'INR',
      name: 'Health Saathi',
      description: `Consultation - ${appointment.doctorName}`,
      handler: async function (response: {
        razorpay_order_id: string
        razorpay_payment_id: string
        razorpay_signature: string
      }) {
        try {
          await finalizePayment(response)
        } catch {
          setStatus('failed')
        }
      },
      prefill: {
        name: 'Patient',
        email: 'patient@example.com',
      },
      theme: {
        color: '#7c3aed',
      },
      modal: {
        ondismiss: function () {
          setStatus('pending')
        },
      },
    }

    try {
      await paymentAPI.createOrder(appointment.appointmentId, appointment.fee)

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        // Demo mode: still call backend verification to persist receipt fields.
        setTimeout(async () => {
          try {
            await finalizePayment({
              razorpay_order_id: `demo_order_${appointment.appointmentId}`,
              razorpay_payment_id: `demo_payment_${Date.now()}`,
              razorpay_signature: 'demo_signature',
            })
          } catch {
            setStatus('failed')
          }
        }, 1000)
      }
    } catch {
      setStatus('failed')
    }
  }

  if (!hasValidAppointment) {
    return null
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 page-enter">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Payment</h1>
        <p className="text-dark-400 mb-8">Complete your booking payment</p>

        {/* Appointment Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6"
        >
          <h2 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-4">Appointment Summary</h2>

          <div className="flex items-center gap-4 pb-4 border-b border-white/5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-secondary-500/20 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-white font-bold">{appointment.doctorName}</p>
              <p className="text-sm text-primary-400">{appointment.specialty}</p>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-dark-500" />
              <span className="text-dark-300">{appointment.date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-dark-500" />
              <span className="text-dark-300">{appointment.slot}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Receipt className="w-4 h-4 text-dark-500" />
              <span className="text-dark-300">{appointment.hospitalName}</span>
            </div>
          </div>
        </motion.div>

        {/* Billing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-6"
        >
          <h2 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-4">Bill Details</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-dark-300">Consultation Fee</span>
              <span className="text-white">₹{appointment.fee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-300">Platform Fee</span>
              <span className="text-white">₹0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-dark-300">GST (0%)</span>
              <span className="text-white">₹0</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-white/5">
              <span className="text-white font-bold text-lg">Total</span>
              <span className="text-2xl font-bold gradient-text">₹{appointment.fee}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Status / Button */}
        {status === 'success' ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
            <p className="text-dark-400 mt-2">Redirecting to your ticket...</p>
            <div className="mt-4 w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto" />
          </motion.div>
        ) : status === 'failed' ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white">Payment Failed</h2>
            <p className="text-dark-400 mt-2">Something went wrong. Please try again.</p>
            <button onClick={() => setStatus('pending')} className="btn-gradient mt-6 px-8">
              Try Again
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Security Badge */}
            <div className="flex items-center gap-2 mb-4 text-sm text-dark-400">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Secured by Razorpay • 256-bit encrypted</span>
            </div>

            <button
              onClick={handlePayment}
              disabled={status === 'processing'}
              className="btn-gradient w-full flex items-center justify-center gap-3 py-4 text-lg disabled:opacity-50"
            >
              {status === 'processing' ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-6 h-6" />
                  Pay ₹{appointment.fee}
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
