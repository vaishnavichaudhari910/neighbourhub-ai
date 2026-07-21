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
        {/* Main Content */}
<div className="relative z-10 flex-1 flex items-center">
  <div className="grid lg:grid-cols-2 gap-12 items-center w-full">

    {/* LEFT */}
    <div>
      <motion.h1
        className="text-5xl font-bold text-white leading-tight mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Your Neighbourhood,
        <br />
        <span className="text-blue-400">
          Connected.
        </span>
      </motion.h1>

      <motion.p
        className="text-slate-300 text-lg leading-8 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: .2 }}
      >
        Book trusted local services, report civic issues,
        and connect with people around you.
      </motion.p>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 backdrop-blur-md rounded-xl p-5 border border-white/10"
          >
            <stat.icon className="text-blue-400 w-6 h-6 mb-3" />
            <h2 className="text-2xl font-bold text-white">
              {stat.value}
            </h2>
            <p className="text-slate-400 text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* RIGHT IMAGE */}
    <motion.div
      className="relative flex justify-center"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <img
        src="/images/home.png"
        alt="Neighbourhood"
        className="w-full max-w-xl object-contain"
      />

      {/* Floating Card */}
      <div className="absolute top-10 right-0 bg-white rounded-2xl px-5 py-4 shadow-xl flex items-center gap-3">

        <div className="flex -space-x-2">
          <img
            src="https://i.pravatar.cc/40?img=1"
            className="w-9 h-9 rounded-full border-2 border-white"
          />
          <img
            src="https://i.pravatar.cc/40?img=2"
            className="w-9 h-9 rounded-full border-2 border-white"
          />
          <img
            src="https://i.pravatar.cc/40?img=3"
            className="w-9 h-9 rounded-full border-2 border-white"
          />
        </div>

        <div>
          <h3 className="font-bold text-black text-lg">
            10,000+
          </h3>
          <p className="text-gray-500 text-sm">
            Happy Residents
          </p>
        </div>
      </div>

    </motion.div>

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