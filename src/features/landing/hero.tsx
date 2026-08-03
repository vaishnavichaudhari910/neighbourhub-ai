"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, ArrowRight, Star, Users, CheckCircle, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

const POPULAR = ["Plumber", "Electrician", "Cleaning", "Carpenter", "Tutor", "Pest Control"]

const WORDS = ["Connected.", "Smarter.", "Safer.", "Together."]

const FLOATING_CARDS = [
  {
    id: 1,
    emoji: "✅",
    title: "Booking Confirmed!",
    sub: "Plumber • Today 10 AM",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
    position: "top-8 -left-6",
    delay: 0,
  },
  {
    id: 2,
    emoji: "⭐",
    title: "Rated 4.9/5",
    sub: "120+ happy customers",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
    position: "bottom-8 -right-6",
    delay: 0.5,
  },
  {
    id: 3,
    emoji: "🔒",
    title: "Verified Provider",
    sub: "Background checked",
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/30",
    position: "top-1/2 -right-10",
    delay: 1,
  },
]

export function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [currentWord, setCurrentWord] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % WORDS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/services?q=${encodeURIComponent(query)}`)
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 20% 50%, rgba(16,185,129,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(15,118,110,0.08) 0%, transparent 60%)",
      }}>

      {/* Animated grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

        {/* Glowing orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
            top: "10%",
            left: "5%",
            x: mousePosition.x * -1,
            y: mousePosition.y * -1,
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity }} />

        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(15,118,110,0.10) 0%, transparent 70%)",
            bottom: "10%",
            right: "5%",
            x: mousePosition.x,
            y: mousePosition.y,
          }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border"
              style={{
                background: "rgba(16,185,129,0.08)",
                borderColor: "rgba(16,185,129,0.25)",
                color: "#10b981",
              }}>
              <motion.span
                className="w-2 h-2 rounded-full bg-emerald-400"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }} />
              AI-Powered Community Platform
              <Zap className="w-3.5 h-3.5" />
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold text-foreground leading-[1.1] mb-4">
              Your Neighbourhood,
              <div className="h-[1.2em] overflow-hidden mt-1">
                <motion.span
                  key={currentWord}
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -80, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 150, damping: 20 }}
                  className="block"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #0f766e, #065f46)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                  {WORDS[currentWord]}
                </motion.span>
              </div>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Book trusted local services, report civic issues, and connect with
              people around you — all in one intelligent platform.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-5">
              <div className="flex gap-2 p-1.5 rounded-2xl border bg-card shadow-lg max-w-lg"
                style={{ borderColor: "rgba(16,185,129,0.2)" }}>
                <div className="flex items-center gap-2 flex-1 px-3">
                  <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search services near you..."
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none py-2"
                  />
                </div>
                <button type="submit"
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 flex-shrink-0 transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:block">Search</span>
                </button>
              </div>
            </form>

            {/* Popular */}
            <div className="flex items-center gap-2 flex-wrap mb-8">
              <span className="text-xs text-muted-foreground font-medium">Popular:</span>
              {POPULAR.map(term => (
                <button key={term}
                  onClick={() => router.push(`/services?q=${term}`)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all text-foreground">
                  {term}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap mb-10">
              <Link href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90 hover:-translate-y-0.5 active:scale-95 shadow-lg"
                style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                Book a Service <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border border-border bg-card hover:bg-accent hover:border-emerald-500/30 transition-all hover:-translate-y-0.5 text-foreground">
                Join as Provider
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-6 flex-wrap">
              {[
                { icon: Users, value: "12K+", label: "Happy Residents", color: "#10b981" },
                { icon: CheckCircle, value: "450+", label: "Verified Providers", color: "#0f766e" },
                { icon: Star, value: "4.8/5", label: "Average Rating", color: "#f59e0b" },
              ].map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center border"
                    style={{
                      background: `${stat.color}15`,
                      borderColor: `${stat.color}30`,
                    }}>
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-foreground text-sm leading-none">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — 3D Image with floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
            style={{
              perspective: "1000px",
            }}>

            {/* 3D rotating container */}
            <motion.div
              style={{
                rotateX: mousePosition.y * -0.3,
                rotateY: mousePosition.x * 0.3,
                transformStyle: "preserve-3d",
              }}
              transition={{ type: "spring", stiffness: 100, damping: 30 }}
              className="relative">

              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden border shadow-2xl"
                style={{ borderColor: "rgba(16,185,129,0.2)" }}>
                <div className="absolute inset-0 z-10"
                  style={{
                    background: "linear-gradient(135deg, rgba(16,185,129,0.05) 0%, transparent 50%)",
                  }} />
                <Image
                  src="/home.png"
                  alt="NeighbourHub Community"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* Floating card 1 — top left */}
              <motion.div
                className="absolute -top-4 -left-8 z-20 bg-card border rounded-2xl px-4 py-3 shadow-xl"
                style={{ borderColor: "rgba(16,185,129,0.3)" }}
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                    style={{ background: "rgba(16,185,129,0.15)" }}>
                    ✅
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Booking Confirmed!</p>
                    <p className="text-xs text-muted-foreground">Plumber • Today 10AM</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating card 2 — bottom right */}
              <motion.div
                className="absolute -bottom-4 -right-8 z-20 bg-card border rounded-2xl px-4 py-3 shadow-xl"
                style={{ borderColor: "rgba(245,158,11,0.3)" }}
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}>
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-1.5">
                    {["🧑", "👩", "👨"].map((e, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-sm">
                        {e}
                      </div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">12,000+ Residents</p>
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">4.9</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating card 3 — middle right */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 -right-12 z-20 bg-card border rounded-2xl px-3 py-2.5 shadow-xl"
                style={{ borderColor: "rgba(99,102,241,0.3)" }}
                animate={{ x: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: "rgba(99,102,241,0.15)" }}>
                    🔒
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Verified</p>
                    <p className="text-xs text-muted-foreground">Background checked</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}