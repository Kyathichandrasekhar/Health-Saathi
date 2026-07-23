import { SpeechLanguage } from './speechRecognition'

export const SpeechSynthesisService = {
  speak(message: string, language: SpeechLanguage = 'en-IN') {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    // Stop any currently playing speech
    window.speechSynthesis.cancel()

    // Clean up markdown, emojis, asterisks
    const cleanText = message
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F700}-\u{1F7FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[*#]/g, '')

    if (!cleanText.trim()) return

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = language
    utterance.rate = 1.0
    utterance.pitch = 1.0

    window.speechSynthesis.speak(utterance)
  },

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }
}
