"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"

const TESTIMONIALS = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Homeowner, Pune",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    text: "I typed 'mera pipe leak ho raha hai' in Hindi and the AI instantly found me 3 plumbers nearby. Booked in under 2 minutes! The provider arrived on time and fixed everything professionally.",
    service: "Plumber",
    serviceIcon: "🔧",
    highlight: "Booked in 2 minutes",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
  },
  {
    id: 2,
    name: "Rahul Desai",
    role: "Business Owner, Mumbai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    text: "As a provider, the dashboard is incredibly useful. I can see all my bookings, accept or reject requests, and track my monthly earnings — all from one place. My income grew 40% since joining.",
    service: "Electrician Provider",
    serviceIcon: "⚡",
    highlight: "Income grew 40%",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
  },
  {
    id: 3,
    name: "Sneha Kulkarni",
    role: "Working Professional, Nashik",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    text: "I was skeptical at first, but after reading genuine reviews from real customers, I felt confident booking a home cleaner. The 4-step booking was so simple, even my mother could use it!",
    service: "Home Cleaner",
    serviceIcon: "🧹",
    highlight: "Super easy to use",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
  },
  {
    id: 4,
    name: "Amit Joshi",
    role: "Apartment Resident, Pune",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    text: "The AI chatbot suggested the right carpenter when I described my broken furniture in Marathi. The provider was verified and the review system helped me pick the best one. Fantastic experience!",
    service: "Carpenter",
    serviceIcon: "🪚",
    highlight: "Works in Marathi",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
  },
  {
    id: 5,
    name: "Kavya Nair",
    role: "New Homeowner, Pune",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    rating: 5,
    text: "I used NeighbourHub for AC repair during summer and the provider was at my door within hours. Checking reviews beforehand gave me confidence. The whole process felt trustworthy and transparent.",
    service: "AC Technician",
    serviceIcon: "❄️",
    highlight: "Fast & trustworthy",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
  },
]

const STATS = [
  { value: "4.9", label: "Average rating", icon: "⭐", sub: "from 2,100+ reviews" },
  { value: "98%", label: "Satisfaction rate", icon: "💚", sub: "repeat bookings" },
  { value: "15min", label: "Avg response", icon: "⚡", sub: "provider response time" },
  { value: "12K+", label: "Happy residents", icon: "👥", sub: "across Maharashtra" },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(1)

  const paginate = (dir: number) => {
    setDirection(dir)
    setActive(prev => (prev + dir + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  const current = TESTIMONIALS[active]

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(139,92,246,0.04) 50%, transparent 100%)",
      }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}>
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-5"
            style={{
              background: "rgba(16,185,129,0.1)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.2)",
            }}>
            ✦ Real Stories, Real People
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-foreground mb-4">
            Trusted by thousands
            <span className="block mt-1"
              style={{
                background: "linear-gradient(135deg, #10b981, #0f766e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              across Maharashtra.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From citizens finding verified professionals to providers growing their business —
            here's what our community says.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="text-center p-5 rounded-2xl border bg-card"
              style={{ borderColor: "rgba(16,185,129,0.15)" }}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="font-poppins font-bold text-2xl text-foreground">{stat.value}</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main testimonial carousel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">

          {/* Left — Featured testimonial */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="rounded-3xl border p-8 relative overflow-hidden bg-card"
                style={{ borderColor: current.color + "30" }}>

                {/* Background glow */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 80% 20%, ${current.color}08 0%, transparent 60%)`,
                  }} />

                {/* Quote icon */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6"
                  style={{ background: current.bg, border: `1px solid ${current.color}30` }}>
                  <Quote className="w-6 h-6" style={{ color: current.color }} />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-foreground text-lg leading-relaxed mb-6 relative z-10">
                  "{current.text}"
                </p>

                {/* Highlight badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                  style={{
                    background: current.bg,
                    color: current.color,
                    border: `1px solid ${current.color}30`,
                  }}>
                  ✨ {current.highlight}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <img
                    src={current.avatar}
                    alt={current.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2"
                    style={{ borderColor: current.color + "40" }}
                  />
                  <div className="flex-1">
                    <p className="font-poppins font-semibold text-foreground">{current.name}</p>
                    <p className="text-sm text-muted-foreground">{current.role}</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium"
                    style={{ background: current.bg, color: current.color }}>
                    <span>{current.serviceIcon}</span>
                    <span className="text-xs">{current.service}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-6">
              <button onClick={() => paginate(-1)}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-accent hover:border-emerald-500/40 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                {TESTIMONIALS.map((_, i) => (
                  <button key={i}
                    onClick={() => { setDirection(i > active ? 1 : -1); setActive(i) }}
                    className="transition-all rounded-full"
                    style={{
                      width: active === i ? "24px" : "8px",
                      height: "8px",
                      background: active === i ? "#10b981" : "var(--border-strong)",
                    }} />
                ))}
              </div>
              <button onClick={() => paginate(1)}
                className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-accent hover:border-emerald-500/40 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Right — Stacked mini testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="space-y-4">
            {TESTIMONIALS.filter((_, i) => i !== active).slice(0, 3).map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                onClick={() => { setDirection(1); setActive(TESTIMONIALS.indexOf(t)) }}
                className="flex items-start gap-4 p-4 rounded-2xl border bg-card cursor-pointer transition-all hover:shadow-md"
                style={{ borderColor: "var(--border)" }}>
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border-2"
                  style={{ borderColor: t.color + "40" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground text-sm">{t.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: t.bg, color: t.color }}>
                      {t.serviceIcon} {t.service}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{t.text}</p>
                  <div className="flex gap-0.5 mt-1.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Provider CTA card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="p-5 rounded-2xl border relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(15,118,110,0.08))",
                borderColor: "rgba(16,185,129,0.2)",
              }}>
              <p className="font-poppins font-semibold text-foreground mb-1">Are you a service provider?</p>
              <p className="text-sm text-muted-foreground mb-3">
                Join 450+ verified providers and grow your business with NeighbourHub AI.
              </p>
              <a href="/register"
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl text-white"
                style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                Join as Provider →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}