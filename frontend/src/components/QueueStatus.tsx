import { useEffect, useRef } from 'react'
import { Users, Clock, Hash } from 'lucide-react'

interface QueueStatusProps {
  currentToken: number
  yourToken: number
  totalInQueue: number
  avgConsultationTime?: number // in minutes, defaults to 10
  doctorName: string
}

export default function QueueStatus({
  currentToken,
  yourToken,
  totalInQueue,
  avgConsultationTime = 10,
  doctorName,
}: QueueStatusProps) {
  const position = yourToken - currentToken
  const isYourTurn = position <= 0
  const notifiedTurn = useRef(false)
  const notifiedNext = useRef(false)

  const estimatedWaitMins = Math.max(0, position) * avgConsultationTime
  const estimatedWait = estimatedWaitMins > 0 ? `~${estimatedWaitMins} min` : 'Now'

  // Request Notification Permissions
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission()
      }
    }
  }, [])

  // Trigger Notifications based on queue position
  useEffect(() => {
    if (isYourTurn && !notifiedTurn.current) {
      notifiedTurn.current = true
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("🎉 It's your turn!", {
          body: `Please proceed to Dr. ${doctorName}'s cabin.`,
        })
      }
    } else if (position === 1 && !notifiedNext.current) {
      notifiedNext.current = true
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification("👀 You are next!", {
          body: `Please get ready. You are next for Dr. ${doctorName}.`,
        })
      }
    }
  }, [isYourTurn, position, doctorName])

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold text-white mb-4">Live Queue Status</h3>
      <p className="text-sm text-dark-400 mb-4">Dr. {doctorName}</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Current Token */}
        <div className="text-center p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
          <Hash className="w-5 h-5 text-primary-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-primary-300">{currentToken}</p>
          <p className="text-xs text-dark-400 mt-1">Current</p>
        </div>

        {/* Your Token */}
        <div className={`text-center p-4 rounded-xl border ${
          isYourTurn
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-secondary-500/10 border-secondary-500/20'
        }`}>
          <Hash className="w-5 h-5 text-secondary-400 mx-auto mb-2" />
          <p className={`text-2xl font-bold ${isYourTurn ? 'text-green-400' : 'text-secondary-300'}`}>
            {yourToken}
          </p>
          <p className="text-xs text-dark-400 mt-1">Your Token</p>
        </div>

        {/* People Ahead */}
        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
          <Users className="w-5 h-5 text-dark-300 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{Math.max(0, position)}</p>
          <p className="text-xs text-dark-400 mt-1">Ahead</p>
        </div>
      </div>

      {/* Status Message */}
      {isYourTurn ? (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
          <p className="text-green-400 font-bold text-lg animate-pulse">🎉 It's your turn!</p>
          <p className="text-sm text-green-400/70 mt-1">Please proceed to the doctor's cabin</p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-secondary-400" />
            <span className="text-sm text-dark-300">Estimated Wait</span>
          </div>
          <span className="text-sm font-semibold text-secondary-400">{estimatedWait}</span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-1000"
            style={{
              width: `${Math.min(100, (Math.max(0, totalInQueue - Math.max(0, position)) / totalInQueue) * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
