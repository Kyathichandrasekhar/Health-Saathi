// FastAPI AI service — calls the Python AI backend directly
// Used for AI-specific features (assistant, predictions, analytics)

const FASTAPI_BASE = import.meta.env.VITE_FASTAPI_URL || 'http://localhost:8001/api/v1'

async function fastapiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${FASTAPI_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'AI service request failed' }))
    throw new Error(error.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

// ========== AI Assistant ==========
export const aiAssistantAPI = {
  chat: (message: string) =>
    fastapiFetch<{ reply: string; suggestions?: string[] }>('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
}

// ========== Prediction APIs ==========
export const predictionAPI = {
  waitTime: (doctorId: string, queueLength: number) =>
    fastapiFetch<any>('/prediction/wait-time', {
      method: 'POST',
      body: JSON.stringify({ doctor_id: doctorId, queue_length: queueLength }),
    }),

  demand: (hospitalId: string, dayOfWeek: number, hour: number) =>
    fastapiFetch<any>('/prediction/demand', {
      method: 'POST',
      body: JSON.stringify({ hospital_id: hospitalId, day_of_week: dayOfWeek, hour }),
    }),
}

// ========== Analytics APIs ==========
export const analyticsAPI = {
  hospitalStats: (hospitalId: string) =>
    fastapiFetch<any>(`/analytics/hospital/${hospitalId}/stats`),

  trends: () =>
    fastapiFetch<any>('/analytics/trends'),
}
