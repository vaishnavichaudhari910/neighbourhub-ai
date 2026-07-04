"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MapPin, Users, Star, Shield } from "lucide-react"

const stats = [
  { icon: Users, label: "Active Users", value: "10K+" },
  { icon: Shield, label: "Verified Providers", value: "500+" },
  { icon: Star, label: "Success Rate", value: "95%" },
  { icon: MapPin, label: "Cities Covered", value: "20+" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* LEFT PANEL — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" }}>

        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute w-96 h-96 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #3b82f6, transparent)", top: "-5rem", left: "-5rem" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #8b5cf6, transparent)", bottom: "5rem", right: "-3rem" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          />
        </div>

        {/* Logo */}
        <Link href="/" className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>N</div>
            <span className="text-white font-poppins font-semibold text-xl">NeighbourHub AI</span>
          </div>
        </Link>

        {/* Center content */}
        <div className="relative z-10">
          <motion.h1
            className="text-4xl font-poppins font-bold text-white mb-4 leading-tight"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            Your Community,<br />
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Smarter
            </span>
          </motion.h1>
          <motion.p
            className="text-slate-400 text-lg leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            Book trusted local services, report issues, and connect with your neighbourhood — all powered by AI.
          </motion.p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={stat.label}
                className="rounded-2xl p-4 border border-white/10"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}>
                <stat.icon className="w-5 h-5 text-blue-400 mb-2" />
                <div className="text-2xl font-poppins font-bold text-white">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <motion.p className="relative z-10 text-slate-500 text-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          "Connecting Citizens, Services, and Communities with AI."
        </motion.p>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}