import { motion } from 'framer-motion'
import { Mic, MicOff } from 'lucide-react'

interface MicButtonProps {
  isListening: boolean
  isProcessing: boolean
  onClick: () => void
}

export default function MicButton({ isListening, isProcessing, onClick }: MicButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors duration-300 ${
        isListening
          ? 'bg-red-500 text-white border-2 border-red-400'
          : isProcessing
          ? 'bg-dark-700 text-primary-400 border border-primary-500/50'
          : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 border border-white/10'
      }`}
    >
      {isListening && (
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute inset-0 bg-red-500 rounded-full"
        />
      )}
      
      {isListening ? (
        <Mic className="w-6 h-6 relative z-10" />
      ) : (
        <Mic className="w-6 h-6 relative z-10" />
      )}
    </motion.button>
  )
}
