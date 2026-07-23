import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Stethoscope } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  suggestions?: string[]
  // Step 15: AI doctor recommendation button
  specialistRecommendation?: string
}

interface ChatBotProps {
  onSendMessage: (message: string) => Promise<{ reply: string; suggestions?: string[] }>
}

// Detect if a reply contains a specialist recommendation (Step 15)
const SPECIALIST_PATTERNS: Record<string, string> = {
  cardiolog: 'Cardiologist',
  'heart specialist': 'Cardiologist',
  neurolog: 'Neurologist',
  'brain specialist': 'Neurologist',
  orthoped: 'Orthopedic',
  'bone specialist': 'Orthopedic',
  dentist: 'Dentist',
  'dental care': 'Dentist',
  dermatolog: 'Dermatologist',
  'skin specialist': 'Dermatologist',
  'ent specialist': 'ENT',
  'ear, nose': 'ENT',
  pediatrician: 'Pediatrician',
  'child specialist': 'Pediatrician',
  gynecolog: 'Gynecologist',
  "women's health": 'Gynecologist',
  psychiatrist: 'Psychiatrist',
  'mental health': 'Psychiatrist',
  'general physician': 'General Physician',
  ophthalmolog: 'Ophthalmologist',
  'eye specialist': 'Ophthalmologist',
  pulmonolog: 'Pulmonologist',
  'lung specialist': 'Pulmonologist',
  nephrolog: 'Nephrologist',
  'kidney specialist': 'Nephrologist',
  urolog: 'Urologist',
  'bladder specialist': 'Urologist',
}

function detectSpecialistFromReply(reply: string): string | null {
  const lower = reply.toLowerCase()
  for (const [pattern, specialist] of Object.entries(SPECIALIST_PATTERNS)) {
    if (lower.includes(pattern)) {
      return specialist
    }
  }
  return null
}

function renderFormattedText(text: string) {
  const lines = text.split('\n')

  return lines.map((line, lineIndex) => {
    const chunks = line.split(/(\*\*.*?\*\*)/g)

    return (
      <p key={`line-${lineIndex}`} className="min-h-[1.2em]">
        {chunks.map((chunk, chunkIndex) => {
          if (chunk.startsWith('**') && chunk.endsWith('**')) {
            return (
              <strong key={`chunk-${lineIndex}-${chunkIndex}`} className="font-semibold text-cyan-100">
                {chunk.slice(2, -2)}
              </strong>
            )
          }

          return <span key={`chunk-${lineIndex}-${chunkIndex}`}>{chunk}</span>
        })}
      </p>
    )
  })
}

export default function ChatBot({ onSendMessage }: ChatBotProps) {
  const navigate = useNavigate()
  const defaultQuickSuggestions = ['Fever', 'Headache', 'Cold & cough', 'Stomach pain', 'Book appointment']
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! 👋 I'm your Health Assistant. Tell me your symptoms, and I'll suggest possible remedies, food recommendations, and general advice. I can also help you find the right specialist doctor! How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [quickSuggestions, setQuickSuggestions] = useState<string[]>(defaultQuickSuggestions)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await onSendMessage(input.trim())

      // Step 15: Detect specialist recommendation in reply
      const detectedSpecialist = detectSpecialistFromReply(response.reply)

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        sender: 'bot',
        timestamp: new Date(),
        suggestions: response.suggestions,
        specialistRecommendation: detectedSpecialist || undefined,
      }
      setMessages((prev) => [...prev, botMessage])
      setQuickSuggestions(response.suggestions?.length ? response.suggestions : defaultQuickSuggestions)
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      setQuickSuggestions(defaultQuickSuggestions)
    } finally {
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  // Step 15: Navigate to Specialist Mode on Home page with pre-filled search
  const handleFindSpecialist = (specialization: string) => {
    navigate('/', {
      state: {
        searchMode: 'specialists',
        query: specialization,
        specialization,
      },
    })
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 space-y-3 sm:space-y-4 bg-gradient-to-b from-slate-700/15 to-slate-900/20">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2 sm:gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              )}
              <div className="flex flex-col items-start max-w-[90%] sm:max-w-[84%] lg:max-w-[80%]">
                <div
                  className={`${
                    msg.sender === 'user'
                      ? 'bg-cyan-500/20 border border-cyan-300/45 rounded-2xl rounded-br-md'
                      : 'rounded-2xl rounded-bl-md bg-slate-700/70 border border-cyan-100/25'
                  } px-3 py-2.5 sm:px-4 sm:py-3`}
                >
                  <div className="text-xs sm:text-sm text-slate-50 leading-relaxed whitespace-pre-wrap break-words space-y-1">
                    {renderFormattedText(msg.text)}
                  </div>
                  <p className="text-[10px] text-slate-200/70 mt-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Step 15: Specialist Recommendation Button */}
                {msg.sender === 'bot' && msg.specialistRecommendation && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    type="button"
                    onClick={() => handleFindSpecialist(msg.specialistRecommendation!)}
                    className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-all shadow-sm hover:scale-[1.02]"
                    aria-label={`Find nearby ${msg.specialistRecommendation}`}
                  >
                    <Stethoscope className="w-3.5 h-3.5" />
                    Find Nearby {msg.specialistRecommendation}s
                  </motion.button>
                )}
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-secondary-500/20 border border-secondary-500/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 sm:gap-3"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse" />
            </div>
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl rounded-bl-md bg-slate-700/70 border border-cyan-100/20">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 sm:px-4 lg:px-6 py-2 border-t border-cyan-100/20 bg-slate-800/70 backdrop-blur-sm sticky bottom-[72px] sm:bottom-[80px] z-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
          {quickSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="shrink-0 px-3 py-1.5 rounded-full border border-cyan-300/50 bg-cyan-500/20 text-cyan-50 text-[11px] sm:text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input Bar */}
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-cyan-100/20 bg-slate-800/85 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your symptoms..."
            className="glass-input flex-1 text-sm sm:text-base h-11 sm:h-12 !bg-white/16 border-cyan-200/25 placeholder:text-slate-200/75 text-slate-50"
            aria-label="Type your health question"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl btn-gradient flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
