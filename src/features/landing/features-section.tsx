"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Brain, CreditCard, MapPin, Clock, Star } from "lucide-react"

const features = [
  { icon: ShieldCheck, title: "Verified Providers", desc: "Every provider is background-checked and skill-verified before joining our platform.", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
  { icon: Brain, title: "AI Recommendations", desc: "Our AI matches you with the best provider based on your location, budget, and needs.", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  { icon: CreditCard, title: "Secure Payments", desc: "Pay safely through our platform. Money released only after job completion.", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  { icon: MapPin, title: "Real-time Tracking", desc: "Track your provider's location live on the map. Know exactly when they'll arrive.", color: "#f97316", bg: "rgba(249,115,22,0.1)" },
  { icon: Clock, title: "24x7 Support", desc: "Our AI assistant and support team are available round the clock for any issues.", color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
  { icon: Star, title: "Trusted Reviews", desc: "Real reviews from real customers. AI-summarized to help you choose the best.", color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
]

export function FeaturesSection() {
  return (
    <section className="py-24"
      style={{ background: "linear-gradient(180deg, var(--background) 0%, rgba(59,130,246,0.03) 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            Why Choose Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-foreground mt-4 mb-4">
            Built for your community
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to find, book, and trust local services.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title}
              className="p-6 rounded-2xl border border-border bg-card group hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ background: f.bg }}>
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </div>
              <h3 className="font-poppins font-semibold text-foreground text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}