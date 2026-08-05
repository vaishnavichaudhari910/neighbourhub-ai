"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ShieldCheck, Bot, CalendarCheck, LayoutDashboard, Star, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Providers",
    desc: "Every provider completes profile verification before offering services, helping you book with greater confidence.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
    badge: "✅ Verified",
    badgeColor: "rgba(16,185,129,0.1)",
    badgeText: "#10b981",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    span: "lg:col-span-1",
  },
  {
    icon: Bot,
    title: "AI Service Assistant",
    desc: "Describe your problem in English, Hindi, or Marathi, and our AI helps you find the right service and guides you to booking.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    border: "rgba(139,92,246,0.2)",
    badge: null,
    langs: ["English", "हिंदी", "मराठी"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face",
    span: "lg:col-span-1",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    desc: "Book a service in four simple steps — choose a time, enter your address, review the details, and confirm your request.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.2)",
    badge: null,
    steps: ["Select Service", "Choose Time", "Enter Address", "Confirm Booking"],
    image: null,
    span: "lg:col-span-1",
  },
  {
    icon: LayoutDashboard,
    title: "Provider Dashboard",
    desc: "Service providers can manage services, update bookings, respond to requests, and monitor their earnings from one dashboard.",
    color: "#f97316",
    bg: "rgba(249,115,22,0.1)",
    border: "rgba(249,115,22,0.2)",
    badge: null,
    stat: { value: "₹24,560", label: "+18.8% this month" },
    image: "https://images.unsplash.com/photo-1556157382-97eda2f9e2bf?w=120&h=120&fit=crop&crop=face",
    span: "lg:col-span-1",
  },
  {
    icon: Star,
    title: "Honest Reviews",
    desc: "Read genuine ratings and reviews from previous customers to make informed decisions before booking.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    badge: null,
    reviews: [
      { name: "Rohit P.", text: "Great service!" },
      { name: "Sneha K.", text: "Very professional" },
    ],
    image: null,
    span: "lg:col-span-1",
  },
  {
    icon: Zap,
    title: "Fast & Responsive",
    desc: "Built with Next.js and optimized for quick page loads, responsive design, and a smooth experience across all devices.",
    color: "#06b6d4",
    bg: "rgba(6,182,212,0.1)",
    border: "rgba(6,182,212,0.2)",
    badge: null,
    image: null,
    span: "lg:col-span-1",
  },
]

const STATS = [
  { value: "10K+", label: "Happy Customers", icon: "👥" },
  { value: "2.5K+", label: "Verified Providers", icon: "✅" },
  { value: "15K+", label: "Bookings Completed", icon: "📅" },
  { value: "4.8/5", label: "Average Rating", icon: "⭐" },
]

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.03) 40%, rgba(139,92,246,0.03) 80%, transparent 100%)",
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
            ✦ Why Choose NeighbourHub AI
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-foreground mb-4">
            Everything you need to
            <span className="block mt-1"
              style={{
                background: "linear-gradient(135deg, #10b981, #0f766e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              book local services.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From finding the right professional to managing bookings,
            NeighbourHub AI keeps the entire experience simple and reliable.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`relative rounded-3xl border bg-card overflow-hidden group transition-all duration-300 hover:shadow-xl ${feature.span}`}
              style={{ borderColor: "var(--border)" }}>

              {/* Top color accent */}
              <div className="h-1 w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${feature.color}, ${feature.color}60)` }} />

              <div className="p-6">
                {/* Icon + Title row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                    style={{ background: feature.bg, borderColor: feature.border }}>
                    <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  {/* Person image */}
                  {feature.image && (
                    <motion.img
                      src={feature.image}
                      alt={feature.title}
                      className="w-14 h-14 rounded-2xl object-cover border-2"
                      style={{ borderColor: feature.border }}
                      whileHover={{ scale: 1.05 }}
                    />
                  )}
                </div>

                <h3 className="font-poppins font-semibold text-foreground text-lg mb-2 group-hover:transition-colors"
                  style={{ ["--hover-color" as string]: feature.color }}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {feature.desc}
                </p>

                {/* Verified badge */}
                {feature.badge && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{ background: feature.badgeColor, color: feature.badgeText, border: `1px solid ${feature.border}` }}>
                    {feature.badge}
                  </span>
                )}

                {/* Language chips */}
                {feature.langs && (
                  <div className="flex gap-2 flex-wrap">
                    {feature.langs.map(lang => (
                      <span key={lang}
                        className="text-xs px-3 py-1.5 rounded-full border font-medium"
                        style={{ background: feature.bg, color: feature.color, borderColor: feature.border }}>
                        {lang}
                      </span>
                    ))}
                  </div>
                )}

                {/* Booking steps */}
                {feature.steps && (
                  <div className="space-y-2">
                    {feature.steps.map((step, idx) => (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + i * 0.1 + idx * 0.08 }}
                        className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: feature.color }}>
                          {idx + 1}
                        </div>
                        <span className="text-xs text-foreground font-medium">{step}</span>
                        <div className="ml-auto">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center text-xs"
                            style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}>
                            ✓
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Earnings stat */}
                {feature.stat && (
                  <div className="mt-3 p-3 rounded-xl border"
                    style={{ background: feature.bg, borderColor: feature.border }}>
                    <p className="text-xs text-muted-foreground mb-0.5">Earnings Overview</p>
                    <p className="font-poppins font-bold text-foreground text-xl">{feature.stat.value}</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: "#10b981" }}>
                      {feature.stat.label}
                    </p>
                    {/* Mini chart */}
                    <svg viewBox="0 0 100 30" className="w-full mt-2" style={{ height: "30px" }}>
                      <polyline
                        points="0,25 15,20 30,22 45,15 60,18 75,10 90,12 100,6"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}

                {/* Reviews */}
                {feature.reviews && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 mb-2">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-foreground ml-1">4.8/5</span>
                      <span className="text-xs text-muted-foreground">Based on 320 reviews</span>
                    </div>
                    {feature.reviews.map(review => (
                      <div key={review.name}
                        className="flex items-center gap-2 p-2.5 rounded-xl border"
                        style={{ background: feature.bg, borderColor: feature.border }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: feature.color }}>
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-foreground">{review.text}</p>
                          <p className="text-xs text-muted-foreground">by {review.name}</p>
                        </div>
                      </div>
                    ))}
                    <Link href="/services"
                      className="text-xs font-medium flex items-center gap-1 mt-1"
                      style={{ color: feature.color }}>
                      View all reviews <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {/* Fast & Responsive — device mockup */}
                {feature.title === "Fast & Responsive" && (
                  <div className="mt-3 flex gap-2 items-end">
                    <div className="flex-1 rounded-xl border p-2.5 text-xs"
                      style={{ background: feature.bg, borderColor: feature.border }}>
                      <div className="w-full h-1.5 rounded-full mb-1.5"
                        style={{ background: feature.color, opacity: 0.6 }} />
                      <div className="w-3/4 h-1.5 rounded-full mb-1.5 bg-border" />
                      <div className="w-1/2 h-1.5 rounded-full bg-border" />
                      <p className="text-muted-foreground mt-2 text-xs">Desktop</p>
                    </div>
                    <div className="w-1/3 rounded-xl border p-2 text-xs"
                      style={{ background: feature.bg, borderColor: feature.border }}>
                      <div className="w-full h-1.5 rounded-full mb-1.5"
                        style={{ background: feature.color, opacity: 0.6 }} />
                      <div className="w-3/4 h-1.5 rounded-full bg-border mb-1.5" />
                      <div className="w-1/2 h-1.5 rounded-full bg-border" />
                      <p className="text-muted-foreground mt-2 text-xs">Mobile</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${feature.color}08 0%, transparent 70%)`,
                }} />
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl border"
          style={{
            background: "rgba(16,185,129,0.04)",
            borderColor: "rgba(16,185,129,0.15)",
          }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="text-center py-2">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="font-poppins font-bold text-2xl text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}