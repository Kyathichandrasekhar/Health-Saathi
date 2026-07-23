import { motion } from 'framer-motion'

export default function ListeningAnimation() {
  return (
    <div className="flex gap-1 items-center">
      <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-red-400 rounded-full" />
      <motion.span animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-red-400 rounded-full" />
      <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-red-400 rounded-full" />
    </div>
  )
}
