// API service for FastAPI backend communication

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function isLikelyProxyUpstreamFailure(message: string) {
  const m = message.toLowerCase()
  return (
    m.includes('econnrefused') ||
    m.includes('cannot proxy') ||
    m.includes('proxy error') ||
    m.includes('upstream') ||
    m.includes('socket hang up') ||
    m.includes('internal server error') ||
    m.includes('bad gateway') ||
    m.includes('service unavailable')
  )
}

function toFriendlyApiError(status: number, message: string) {
  if (status >= 500 && isLikelyProxyUpstreamFailure(message)) {
    return 'Backend service is temporarily unavailable. Please retry in a moment.'
  }

  if (status === 500 && (!message || message === 'HTTP 500')) {
    return 'Backend service is temporarily unavailable. Please retry in a moment.'
  }

  return message || `HTTP ${status}`
}

function getApiBaseCandidates() {
  const candidates: string[] = []

  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    const runningOnLocalHost = host === 'localhost' || host === '127.0.0.1'
    const baseLooksLocalhost = /https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(API_BASE)

    // Skip hardcoded localhost API base when app is opened from another device via LAN IP.
    if (!(baseLooksLocalhost && !runningOnLocalHost)) {
      candidates.push(API_BASE)
    }

    const originApi = `${window.location.origin.replace(/\/$/, '')}/api`
    if (API_BASE !== originApi) {
      candidates.push(originApi)
    }

    if (!runningOnLocalHost) {
      candidates.push(`http://${host}:8000/api`)
    }
  } else {
    candidates.push(API_BASE)
  }

  if (API_BASE !== '/api') {
    candidates.push('/api')
  }

  return [...new Set(candidates)]
}

export interface InternalHospital {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  rating?: number
  specialties?: string[]
  available_doctors?: number
}

export interface DoctorProfile {
  id: string
  name: string
  specialty: string
  specialization?: string
  rating?: number
  experience?: string
  fee: number
  contact_number?: string
  slot_timings?: string
}

export interface SlotAvailabilityResponse {
  slots: string[]
  doctor_id: string
  date: string
  slot_timings?: string
}

export interface TicketReceipt {
  appointment_id: string
  patient_name: string
  patient_email: string
  patient_phone?: string
  user_id: string
  doctor_name: string
  specialization: string
  hospital_name: string
  date: string
  slot: string
  payment_status: string
  paid_amount: number
  booking_timestamp: string
  token_number: number
  status: string
  patient_details?: any
}

// Helper: get auth token from Firebase
async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { auth } = await import('./firebase')
    const user = auth.currentUser
    if (user) {
      const token = await user.getIdToken()
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }
    }
  } catch {
    // Fallback to unauthenticated requests in demo/local mode.
  }

  return { 'Content-Type': 'application/json' }
}

// Generic fetch wrapper
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders()

  let lastError: Error | null = null

  for (const base of getApiBaseCandidates()) {
    try {
      const res = await fetch(`${base}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
      })

      if (!res.ok) {
        const contentType = res.headers.get('content-type') || ''
        const isJson = contentType.toLowerCase().includes('application/json')
        const errorPayload = isJson
          ? await res
              .json()
              .catch(() => ({ detail: '', error: '', message: '' })) as {
              detail?: string
              error?: string
              message?: string
            }
          : null
        const textBody = isJson ? '' : await res.text().catch(() => '')

        const message =
          errorPayload?.detail ||
          errorPayload?.error ||
          errorPayload?.message ||
          textBody ||
          `HTTP ${res.status}`

        const friendlyMessage = toFriendlyApiError(res.status, message)

        // Try alternate bases when route is missing on the current target.
        if (
          res.status === 404 ||
          res.status === 405 ||
          res.status === 500 ||
          res.status === 502 ||
          res.status === 503 ||
          res.status === 504 ||
          (res.status === 500 && isLikelyProxyUpstreamFailure(message))
        ) {
          lastError = new Error(friendlyMessage)
          continue
        }

        throw new Error(friendlyMessage)
      }

      return res.json()
    } catch (error) {
      lastError = error as Error
      const message = String((error as Error)?.message || '')
      const isNetworkError = message.toLowerCase().includes('failed to fetch') || message.toLowerCase().includes('network')

      if (!isNetworkError) {
        throw error as Error
      }
    }
  }

  throw lastError || new Error('Request failed')
}

// ========== Hospital APIs ==========
export const hospitalAPI = {
  getNearby: (lat: number, lng: number) =>
    apiFetch<InternalHospital[]>(`/hospitals/nearby?lat=${lat}&lng=${lng}`),

  getById: (id: string) =>
    apiFetch<InternalHospital>(`/hospitals/${id}`),

  getAll: (options?: { limit?: number; compact?: boolean }) => {
    const params = new URLSearchParams()

    if (typeof options?.limit === 'number' && options.limit > 0) {
      params.set('limit', String(Math.floor(options.limit)))
    }

    if (options?.compact) {
      params.set('compact', '1')
    }

    const query = params.toString()
    return apiFetch<InternalHospital[]>(`/hospitals${query ? `?${query}` : ''}`)
  },
}

// ========== Doctor APIs ==========
export const doctorAPI = {
  getByHospital: (hospitalId: string) =>
    apiFetch<DoctorProfile[]>(`/hospitals/${hospitalId}/doctors`),

  getByHospitalName: (hospitalName: string) =>
    apiFetch<DoctorProfile[]>(`/hospitals/doctors/by-name?hospitalName=${encodeURIComponent(hospitalName)}`),

  getSlots: (doctorId: string, date: string) =>
    apiFetch<SlotAvailabilityResponse>(`/booking/slots?doctorId=${doctorId}&date=${date}`),
}

// ========== Booking APIs ==========
export const bookingAPI = {
  create: (data: {
    hospitalId: string
    doctorId: string
    slot: string
    date: string
    hospitalName?: string
    doctorName?: string
    specialization?: string
    fee?: number
    slotTimings?: string
    patientName?: string
    patientEmail?: string
    patientPhone?: string
    patientDetails?: any
  }) =>
    apiFetch<any>('/booking/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getUserBookings: () =>
    apiFetch<any[]>('/booking/my-bookings'),

  getById: (id: string) =>
    apiFetch<any>(`/booking/${id}`),

  getReceipt: (id: string) =>
    apiFetch<TicketReceipt>(`/booking/receipt/${id}`),
}

// ========== Payment APIs ==========
export const paymentAPI = {
  createOrder: (
    appointmentId: string,
    amount: number,
    meta?: {
      doctorId?: string
      hospitalId?: string
      appointmentDate?: string
      slot?: string
      userId?: string
    },
  ) =>
    apiFetch<any>('/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ appointmentId, amount, ...meta }),
    }),

  verifyPayment: (data: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
    appointmentId: string
    amount?: number
  }) =>
    apiFetch<any>('/payment/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}

// ========== Queue APIs ==========
export const queueAPI = {
  checkIn: (appointmentId: string) =>
    apiFetch<any>('/queue/check-in', {
      method: 'POST',
      body: JSON.stringify({ appointmentId }),
    }),

  getStatus: (doctorId: string, date?: string) =>
    apiFetch<any>(`/queue/status/${doctorId}${date ? `?date=${encodeURIComponent(date)}` : ''}`),

  getPosition: (appointmentId: string) =>
    apiFetch<any>(`/queue/position/${appointmentId}`),
}

// ========== QR APIs ==========
export const qrAPI = {
  generate: (data: {
    appointmentId: string
    doctorName?: string
    date?: string
    slot?: string
    token?: number
    ticketUrl?: string
  }) =>
    apiFetch<{ qr_image: string; data: unknown }>('/qr/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  validate: (qrData: string) =>
    apiFetch<{
      valid: boolean
      error?: string
      data?: {
        appointmentId: string
        patientName: string
        doctorName: string
        hospitalName: string
        date: string
        slot: string
        token: number
        paymentStatus: string
        status: string
        doctorId?: string
        source?: string
      }
    }>('/qr/validate', {
      method: 'POST',
      body: JSON.stringify({ qrData }),
    }),
}

// ========== Assistant APIs ==========
export const assistantAPI = {
  chat: (message: string) =>
    apiFetch<{ reply: string; suggestions?: string[] }>('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
}

// ========== Admin APIs ==========
export const adminAPI = {
  validateTicket: (ticketId: string) =>
    apiFetch<{
      status: 'valid' | 'invalid' | 'already_checked_in'
      message?: string
      appointmentId?: string
      patientName?: string
      doctorName?: string
      hospitalName?: string
      slot?: string
      date?: string
      token?: number
      paymentStatus?: string
      checkedIn?: boolean
      doctorId?: string
    }>('/admin/validate-ticket', {
      method: 'POST',
      body: JSON.stringify({ ticketId, qrData: ticketId }),
    }),

  checkIn: (ticketId: string) =>
    apiFetch<{
      status: 'checked_in' | 'already_checked_in' | 'invalid'
      message?: string
      appointmentId?: string
      patientName?: string
      doctorName?: string
      hospitalName?: string
      slot?: string
      date?: string
      token?: number
      paymentStatus?: string
      checkedIn?: boolean
      doctorId?: string
      queuePosition?: number
      queueTotal?: number
    }>('/admin/checkin', {
      method: 'POST',
      body: JSON.stringify({ ticketId, qrData: ticketId }),
    }),
}

// ========== Voice Agent APIs ==========
export interface VoiceAgentIntent {
  intent: string
  action: 'search_doctors' | 'book_appointment' | 'navigate' | 'cancel_appointment' | 'show_qr_code' | 'symptom_analysis' | 'missing_info' | 'unknown'
  message: string
  payload?: any
}

export const voiceAgentAPI = {
  processSpeech: (data: { message: string; language: string; session_id: string }) =>
    apiFetch<VoiceAgentIntent>('/voice-agent', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
