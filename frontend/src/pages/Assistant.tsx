import { motion } from 'framer-motion'
import { MessageCircle, Sparkles } from 'lucide-react'
import ChatBot from '../components/ChatBot'

// Rule-based local assistant fallback
function localAssistant(message: string): { reply: string; suggestions?: string[] } {
  const msg = message.toLowerCase()
  if (msg.includes('fever') || msg.includes('temperature')) {
    return {
      reply: "🌡️ **Fever Management Tips:**\n\n• Rest well and stay hydrated\n• Take paracetamol (Crocin/Dolo 650) as directed\n• Apply a cool compress on your forehead\n• Wear light clothing\n\n🍎 **Foods:** Light khichdi, soups, coconut water, ORS\n\n⚠️ If fever persists above 102°F for over 2 days, please visit a doctor.",
      suggestions: ['Headache', 'Body pain', 'Cold & cough', 'Book appointment'],
    }
  }
  if (msg.includes('cold') || msg.includes('cough') || msg.includes('sore throat')) {
    return {
      reply: "🤧 **Cold & Cough Remedies:**\n\n• Drink warm water with honey and lemon\n• Steam inhalation 2-3 times a day\n• Gargle with warm salt water\n• Take Cetirizine for runny nose\n\n🍎 **Foods:** Ginger tea, tulsi kadha, warm soups, turmeric milk\n\n⚠️ See a doctor if cough lasts more than a week or you have difficulty breathing.",
      suggestions: ['Fever', 'Headache', 'Allergy', 'Book appointment'],
    }
  }
  if (msg.includes('headache') || msg.includes('migraine')) {
    return {
      reply: "🤕 **Headache Relief:**\n\n• Rest in a dark, quiet room\n• Stay hydrated — dehydration causes headaches\n• Take Paracetamol or Ibuprofen\n• Apply peppermint oil on temples\n\n🍎 **Foods:** Bananas, almonds, dark chocolate, green tea\n\n⚠️ Frequent or severe headaches need medical evaluation.",
      suggestions: ['Fever', 'Stress & anxiety', 'Eye strain', 'Book appointment'],
    }
  }
  if (msg.includes('stomach') || msg.includes('digestion') || msg.includes('acidity') || msg.includes('gas')) {
    return {
      reply: "🤢 **Stomach & Digestion Tips:**\n\n• Eat slowly and chew properly\n• Avoid spicy, oily, and fried foods\n• Take antacid (Gelusil/Digene) if acidity\n• Drink buttermilk or jeera water\n\n🍎 **Foods:** Bananas, rice, yogurt, papaya, fennel seeds\n\n⚠️ Persistent pain or vomiting needs medical attention.",
      suggestions: ['Nausea', 'Food poisoning', 'Bloating', 'Book appointment'],
    }
  }
  if (msg.includes('stress') || msg.includes('anxiety') || msg.includes('sleep') || msg.includes('insomnia')) {
    return {
      reply: "😌 **Stress & Sleep Management:**\n\n• Practice deep breathing (4-7-8 technique)\n• Limit screen time before bed\n• Exercise regularly — even a 20 min walk helps\n• Try meditation or yoga\n\n🍎 **Foods:** Warm milk, chamomile tea, nuts, bananas\n\n⚠️ If anxiety is severe or persistent, consider talking to a professional.",
      suggestions: ['Headache', 'Fatigue', 'Depression signs', 'Book appointment'],
    }
  }
  if (msg.includes('back pain') || msg.includes('body pain') || msg.includes('muscle')) {
    return {
      reply: "💪 **Body/Back Pain Tips:**\n\n• Apply hot/cold compress\n• Maintain good posture\n• Gentle stretching exercises\n• Take Ibuprofen for pain relief\n\n🍎 **Foods:** Anti-inflammatory foods — turmeric, ginger, omega-3 fish\n\n⚠️ If pain is severe or doesn't improve, see an orthopedic.",
      suggestions: ['Joint pain', 'Exercise tips', 'Fever', 'Book appointment'],
    }
  }
  if (msg.includes('allergy') || msg.includes('rash') || msg.includes('itching') || msg.includes('skin')) {
    return {
      reply: "🤒 **Allergy & Skin Care:**\n\n• Identify and avoid allergens\n• Take antihistamine (Cetirizine/Allegra)\n• Apply calamine lotion for rashes\n• Keep skin moisturized\n\n🍎 **Foods:** Vitamin C rich fruits, probiotics, green vegetables\n\n⚠️ Severe reactions (swelling, difficulty breathing) need immediate ER visit.",
      suggestions: ['Cold', 'Skin infection', 'Eye allergy', 'Book appointment'],
    }
  }
  if (msg.includes('book') || msg.includes('appointment') || msg.includes('doctor')) {
    return {
      reply: "📅 You can book an appointment right away! Go to the **Book** page to find nearby hospitals, select a doctor, and choose a convenient time slot.\n\nI can also help you identify which specialist to see based on your symptoms.",
      suggestions: ['Fever', 'Headache', 'Stomach issues', 'Skin problems'],
    }
  }
  return {
    reply: "I can help you with common health concerns! Tell me about your symptoms and I'll provide suggestions, food recommendations, and general advice.\n\n💡 Try describing symptoms like:\n• Fever, cold, cough\n• Headache, body pain\n• Stomach issues, allergy\n• Stress, sleep problems",
    suggestions: ['Fever', 'Cold & cough', 'Headache', 'Stomach pain', 'Stress & anxiety'],
  }
}

export default function Assistant() {
  const handleSendMessage = async (message: string) => {
    // Try backend first, fallback to local
    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      if (res.ok) return await res.json()
    } catch { /* fallback */ }
    // Simulate typing delay
    await new Promise(r => setTimeout(r, 800))
    return localAssistant(message)
  }

  return (
    <div className="min-h-[calc(100dvh-5rem)] flex flex-col page-enter pb-3 sm:pb-5 bg-gradient-to-br from-slate-900/40 via-sky-900/20 to-cyan-900/20 rounded-2xl">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col px-3 sm:px-5 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="py-3 sm:py-5 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center mx-auto mb-2 sm:mb-3 shadow-[0_0_25px_rgba(34,211,238,0.35)]">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
            Health Assistant
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">Describe your symptoms for instant health advice</p>
        </motion.div>

        {/* Chat */}
        <div className="flex-1 overflow-hidden flex flex-col mb-2 sm:mb-4 min-h-[min(72dvh,720px)] sm:min-h-[620px] rounded-2xl sm:rounded-3xl bg-slate-800/75 border border-cyan-200/20 shadow-[0_18px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <ChatBot onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  )
}
