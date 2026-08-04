"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const SERVICES = [
  {
    id: 1,
    name: "Plumber",
    desc: "Repairs & Installation",
    icon: "🔧",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=280&fit=crop&crop=face",
    query: "Plumber",
  },
  {
    id: 2,
    name: "Electrician",
    desc: "Electrical Repairs",
    icon: "⚡",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=280&fit=crop&crop=face",
    query: "Electrician",
  },
  {
    id: 3,
    name: "Carpenter",
    desc: "Furniture & Woodwork",
    icon: "🪚",
    color: "#f97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.2)",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=280&fit=crop&crop=face",
    query: "Carpenter",
  },
  {
    id: 4,
    name: "Home Cleaner",
    desc: "Home & Office Cleaning",
    icon: "🧹",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=280&fit=crop&crop=face",
    query: "Cleaning",
  },
  {
    id: 5,
    name: "AC Technician",
    desc: "AC Service & Repair",
    icon: "❄️",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.2)",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=280&fit=crop&crop=face",
    query: "AC Repair",
  },
]

export function ServicesSection() {
  const router = useRouter()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 px-4 sm:px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.03) 50%, transparent 100%)",
      }}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full mb-3"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.2)",
              }}>
              ✦ Popular Services
            </motion.span>
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-foreground">
              Everything your home needs,
              <span className="block"
                style={{
                  background: "linear-gradient(135deg, #10b981, #0f766e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                at your doorstep.
              </span>
            </h2>
          </div>
          <Link href="/services"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl border border-border hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all text-foreground">
            Browse All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Services cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {SERVICES.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => router.push(`/services?q=${service.query}`)}
              className="group cursor-pointer rounded-3xl border overflow-hidden bg-card transition-all duration-300 hover:shadow-2xl"
              style={{
                borderColor: "var(--border)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}>

              {/* Image container */}
              <div className="relative h-44 overflow-hidden">
                {/* Gradient overlay */}
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(180deg, transparent 40%, ${service.color}40 100%)`,
                  }} />

                {/* Image */}
                <motion.img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    target.parentElement!.style.background = service.bg
                    target.parentElement!.innerHTML += `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:64px;">${service.icon}</div>`
                  }}
                />

                {/* Icon badge */}
                <div className="absolute top-3 left-3 z-20 w-9 h-9 rounded-xl flex items-center justify-center text-lg backdrop-blur-sm border"
                  style={{
                    background: `${service.color}20`,
                    borderColor: `${service.color}30`,
                  }}>
                  {service.icon}
                </div>

                {/* Available count badge */}
                <div className="absolute top-3 right-3 z-20 px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm border"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    borderColor: "rgba(255,255,255,0.15)",
                    color: "white",
                  }}>
                  ● Live
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-poppins font-semibold text-foreground text-base group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{service.desc}</p>
                  </div>
                  <motion.div
                    className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0"
                    style={{ background: `${service.color}15` }}>
                    <ArrowRight className="w-3.5 h-3.5" style={{ color: service.color }} />
                  </motion.div>
                </div>

                {/* Bottom bar */}
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">⭐</span>
                    <span className="text-xs font-medium text-foreground">4.8</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: service.bg,
                      color: service.color,
                      border: `1px solid ${service.border}`,
                    }}>
                    Book now
                  </span>
                </div>
              </div>

              {/* Bottom color accent bar */}
              <div className="h-1 w-0 group-hover:w-full transition-all duration-300 rounded-b-3xl"
                style={{ background: `linear-gradient(90deg, ${service.color}, ${service.color}80)` }} />
            </motion.div>
          ))}
        </div>

        {/* Mobile browse all */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center sm:hidden">
          <Link href="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium"
            style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
            Browse All Services <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "50+", label: "Service categories", icon: "🏷️" },
            { value: "450+", label: "Verified providers", icon: "✅" },
            { value: "15min", label: "Avg response time", icon: "⚡" },
            { value: "98%", label: "Satisfaction rate", icon: "⭐" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="flex items-center gap-3 p-4 rounded-2xl border bg-card"
              style={{ borderColor: "rgba(16,185,129,0.15)" }}>
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className="font-poppins font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}