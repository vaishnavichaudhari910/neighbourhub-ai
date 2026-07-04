"use client"

import { motion } from "framer-motion"
import { Search, AlertTriangle, MessageSquare, Lightbulb } from "lucide-react"

const aiFeatures = [
  { icon: Search, title: "AI Smart Search", desc: "Natural language search — type 'fix my leaking pipe' and AI finds the right plumber.", gradient: "linear-gradient(135deg, #3b82f6, #06b6d4)" },
  { icon: AlertTriangle, title: "AI Complaint Detection", desc: "Auto-classify complaints by urgency, category, and location for faster resolution.", gradient: "linear-gradient(135deg, #f97316, #ef4444)" },
  { icon: MessageSquare, title: "AI Assistant", desc: "24x7 floating assistant to help book services, track issues, and answer questions.", gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
  { icon: Lightbulb, title: "AI Recommendations", desc: "Personalized provider recommendations based on your history, location, and budget.", gradient: "linear-gradient(135deg, #10b981, #3b82f6)" },
]

export function AISection() {
  return (
    <section className="py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>

      {/* Background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8b5cf6, transparent)", filter: "blur(60px)" }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="text-sm font-medium px-4 py-1.5 rounded-full border border-white/20 text-blue-300"
            style={{ background: "rgba(59,130,246,0.15)" }}>
            Powered by AI
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-white mt-4 mb-4">
            Intelligence at every step
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            AI doesn't just assist — it actively improves every interaction on the platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {aiFeatures.map((f, i) => (
            <motion.div key={f.title}
              className="p-6 rounded-2xl border border-white/10 group cursor-default"
              style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.2)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.gradient }}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-poppins font-semibold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}