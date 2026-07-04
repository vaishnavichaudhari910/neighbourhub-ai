"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Sparkles, ArrowRight, Users, Star, Shield, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCounter } from "@/hooks/use-counter"

const stats = [
  { icon: Users, label: "Active Users", value: 10000, suffix: "+", display: "10K+" },
  { icon: Shield, label: "Verified Providers", value: 500, suffix: "+", display: "500+" },
  { icon: Star, label: "Success Rate", value: 95, suffix: "%", display: "95%" },
  { icon: MapPin, label: "Cities", value: 20, suffix: "+", display: "20+" },
]

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const { count, ref } = useCounter(stat.value, 2000)
  return (
    <motion.div ref={ref}
      className="text-center p-4 rounded-2xl border border-white/10"
      style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)" }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 + index * 0.1 }}>
      <stat.icon className="w-5 h-5 mx-auto mb-2 text-blue-400" />
      <div className="text-2xl font-poppins font-bold text-white">
        {count >= 1000 ? `${Math.floor(count/1000)}K` : count}{stat.suffix}
      </div>
      <div className="text-slate-400 text-xs mt-0.5">{stat.label}</div>
    </motion.div>
  )
}

const words = ["Electrician", "Plumber", "AC Repair", "Cleaning", "Carpenter"]

export function HeroSection() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [wordIndex, setWordIndex] = useState(0)

  // Rotate placeholder word every 2s
  useState(() => {
    const t = setInterval(() => setWordIndex(i => (i + 1) % words.length), 2000)
    return () => clearInterval(t)
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/services?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)" }}>

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div className="absolute rounded-full opacity-30"
          style={{ width: 600, height: 600, background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)", top: "-150px", left: "-150px" }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.45, 0.3] }}
          transition={{ duration: 7, repeat: Infinity }} />
        <motion.div className="absolute rounded-full opacity-25"
          style={{ width: 500, height: 500, background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)", bottom: "-100px", right: "-100px" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 9, repeat: Infinity, delay: 2 }} />
        <motion.div className="absolute rounded-full opacity-20"
          style={{ width: 300, height: 300, background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", top: "40%", left: "60%" }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 11, repeat: Infinity, delay: 4 }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">

        {/* Badge */}
        <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-sm text-slate-300 mb-8"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(8px)" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Sparkles className="w-4 h-4 text-blue-400" />
          AI-Powered Community Platform
        </motion.div>

        {/* Headline */}
        <motion.h1 className="text-5xl sm:text-6xl md:text-7xl font-poppins font-bold text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          Your Community,<br />
          <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa, #34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Smarter with AI
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          Book trusted local services, report civic issues, and connect with your neighbourhood — all in one place.
        </motion.p>

        {/* Search bar */}
        <motion.form onSubmit={handleSearch}
          className="flex gap-2 max-w-xl mx-auto mb-8 p-2 rounded-2xl border border-white/20"
          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Search for ${words[wordIndex]}...`}
              className="flex-1 bg-transparent text-white placeholder:text-slate-500 outline-none text-sm py-2"
            />
          </div>
          <Button type="submit" className="rounded-xl px-5"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            Search
          </Button>
        </motion.form>

        {/* CTA buttons */}
        <motion.div className="flex flex-wrap items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Button size="lg" className="h-12 px-8 rounded-xl gap-2 text-base"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }} asChild>
            <Link href="/services">Book a Service <ArrowRight className="w-4 h-4" /></Link>
          </Button>
          <Button size="lg" variant="outline"
            className="h-12 px-8 rounded-xl text-base border-white/20 text-white hover:bg-white/10 hover:text-white" asChild>
            <Link href="/providers">Explore Providers</Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0f172a)" }} />
    </section>
  )
}
