import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import ListeningAnimation from './ListeningAnimation'
import { SpeechLanguage } from '../../services/speechRecognition'

interface VoiceStatusProps {
  isListening: boolean
  isProcessing: boolean
  errorMsg: string | null
  language: SpeechLanguage
  onLanguageChange: (lang: SpeechLanguage) => void
}

export default function VoiceStatus({ isListening, isProcessing, errorMsg, language, onLanguageChange }: VoiceStatusProps) {
  return (
    <div className="flex flex-col items-end gap-2 mb-4">
      {/* Language Selector */}
      <AnimatePresence>
        {(!isListening && !isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-2 bg-dark-800/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs shadow-lg"
          >
            <span className="text-slate-400">Language:</span>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as SpeechLanguage)}
              className="bg-transparent text-white border-none outline-none cursor-pointer font-medium"
            >
              <option className="bg-dark-800" value="en-IN">English</option>
              <option className="bg-dark-800" value="hi-IN">Hindi</option>
              <option className="bg-dark-800" value="te-IN">Telugu</option>
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Error Message */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="bg-red-500/90 text-white text-sm px-4 py-2 rounded-xl shadow-lg backdrop-blur-md max-w-xs"
          >
            {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-dark-800/90 border border-red-500/30 text-red-300 text-sm font-medium px-5 py-2.5 rounded-2xl shadow-[0_4px_20px_rgba(239,68,68,0.2)] backdrop-blur-md flex items-center gap-3"
          >
            <ListeningAnimation />
            Listening...
          </motion.div>
        )}
        
        {isProcessing && !isListening && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-dark-800/90 border border-primary-500/30 text-primary-300 text-sm font-medium px-5 py-2.5 rounded-2xl shadow-[0_4px_20px_rgba(59,130,246,0.3)] backdrop-blur-md flex items-center gap-3"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Executing Action...
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
