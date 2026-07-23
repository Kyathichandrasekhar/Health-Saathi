import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import MicButton from './MicButton'
import VoiceStatus from './VoiceStatus'
import { SpeechRecognitionService, SpeechLanguage } from '../../services/speechRecognition'
import { SpeechSynthesisService } from '../../services/speechSynthesis'
import { VoiceAgentService, VoiceActionResponse } from '../../services/voiceAgent'

// Persist session across pages
const SESSION_ID = uuidv4()

export default function VoiceAgent() {
  const navigate = useNavigate()
  
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [language, setLanguage] = useState<SpeechLanguage>('en-IN')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const showTemporaryError = (msg: string) => {
    setErrorMsg(msg)
    setTimeout(() => setErrorMsg(null), 4000)
  }

  // Initialize Speech Recognition
  useEffect(() => {
    const isSupported = SpeechRecognitionService.init(language, {
      onResult: (transcript) => handleVoiceInput(transcript),
      onError: (err) => {
        setIsListening(false)
        if (err === 'not-allowed') {
          showTemporaryError('Microphone permission denied.')
        } else {
          showTemporaryError(`Recognition error: ${err}`)
        }
      },
      onEnd: () => setIsListening(false)
    })
    
    if (!isSupported) {
      showTemporaryError('Speech recognition is not supported in this browser.')
    }
    
    return () => SpeechRecognitionService.stop()
  }, [language])

  const handleVoiceInput = async (transcript: string) => {
    setIsListening(false)
    setIsProcessing(true)
    
    try {
      const response = await VoiceAgentService.processTranscript(transcript, language, SESSION_ID)
      executeAction(response)
    } catch (error) {
      console.error('Agent processing error:', error)
      showTemporaryError('Failed to process voice command.')
    } finally {
      setIsProcessing(false)
    }
  }

  const executeAction = (response: VoiceActionResponse) => {
    if (!response) return
    
    // Speak the response if there's a message
    if (response.message) {
      SpeechSynthesisService.speak(response.message, language)
    }

    // Dispatch the UI Action
    switch (response.action) {
      case 'search_doctors':
        navigate('/', {
          state: {
            searchMode: 'specialists',
            query: response.payload?.query || '',
            specialization: response.payload?.specialization || '',
          },
        })
        break
        
      case 'book_appointment':
        navigate('/booking', {
          state: {
            preSelectedDoctor: response.payload?.doctor,
            preSelectedTime: response.payload?.time,
          },
        })
        break
        
      case 'navigate':
        if (response.payload?.target === 'hospitals') {
          navigate('/', { state: { searchMode: 'hospitals', query: response.payload.query } })
        } else {
          navigate('/')
        }
        break
        
      case 'cancel_appointment':
      case 'show_qr_code':
        navigate('/dashboard')
        break
        
      case 'symptom_analysis':
        navigate('/assistant')
        break
        
      case 'missing_info':
      case 'unknown':
      default:
        // No explicit UI navigation needed, just the spoken question/message
        break
    }
  }

  const toggleListening = useCallback(() => {
    if (isListening) {
      SpeechRecognitionService.stop()
      setIsListening(false)
    } else {
      SpeechSynthesisService.stop()
      SpeechRecognitionService.start()
      setIsListening(true)
    }
  }, [isListening])

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
      <VoiceStatus 
        isListening={isListening} 
        isProcessing={isProcessing} 
        errorMsg={errorMsg}
        language={language}
        onLanguageChange={setLanguage}
      />
      <MicButton 
        isListening={isListening} 
        isProcessing={isProcessing} 
        onClick={toggleListening} 
      />
    </div>
  )
}
