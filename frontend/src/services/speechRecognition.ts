export type SpeechLanguage = 'en-IN' | 'hi-IN' | 'te-IN'

export interface SpeechRecognitionCallbacks {
  onResult: (transcript: string) => void
  onError: (error: string) => void
  onEnd: () => void
}

let recognition: any = null

export const SpeechRecognitionService = {
  init(language: SpeechLanguage, callbacks: SpeechRecognitionCallbacks) {
    if (typeof window === 'undefined') return false

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      callbacks.onError('not-supported')
      return false
    }

    recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = language

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      callbacks.onResult(transcript)
    }

    recognition.onerror = (event: any) => {
      callbacks.onError(event.error)
    }

    recognition.onend = () => {
      callbacks.onEnd()
    }

    return true
  },

  start() {
    if (recognition) {
      try {
        recognition.start()
      } catch (e) {
        console.error("Failed to start recognition", e)
      }
    }
  },

  stop() {
    if (recognition) {
      try {
        recognition.stop()
      } catch (e) {
        console.error("Failed to stop recognition", e)
      }
    }
  }
}
