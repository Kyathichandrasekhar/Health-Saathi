import { SpeechLanguage } from './speechRecognition'

export interface VoiceActionResponse {
  intent: string
  action: 'search_doctors' | 'book_appointment' | 'navigate' | 'cancel_appointment' | 'show_qr_code' | 'symptom_analysis' | 'missing_info' | 'unknown'
  message: string
  payload?: any
}

const FASTAPI_URL = 'http://localhost:8001/api/voice-agent'

export const VoiceAgentService = {
  async processTranscript(transcript: string, language: SpeechLanguage, sessionId: string): Promise<VoiceActionResponse> {
    console.log('[VoiceAgent Frontend] Transcript:', transcript)
    const payload = { message: transcript, language, session_id: sessionId }
    console.log('[VoiceAgent Frontend] Outgoing request:', payload)
    
    try {
      const res = await fetch(FASTAPI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      if (!res.ok) {
        let errorMsg = `HTTP ${res.status}`
        try {
          const errData = await res.json()
          errorMsg = errData.detail || errorMsg
        } catch (e) {
          errorMsg = await res.text() || errorMsg
        }
        throw new Error(errorMsg)
      }
      
      const data = await res.json()
      console.log('[VoiceAgent Frontend] Backend response:', data)
      return data as VoiceActionResponse
    } catch (error: any) {
      console.error('[VoiceAgent Frontend] backend error:', error)
      throw new Error(error.message || 'Network error')
    }
  }
}
