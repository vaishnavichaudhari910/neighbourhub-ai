"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import {
  MapPin, Users, Shield, Zap, Star, Heart,
  Code, Database, Globe, ArrowRight,
  CheckCircle, Briefcase, Bot, CalendarCheck
} from "lucide-react"

const TEAM_VALUES = [
  {
    icon: Shield,
    title: "Trust & Safety",
    desc: "Every provider is verified before listing services. We prioritize your safety above everything.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
  },
  {
    icon: Bot,
    title: "AI-First Approach",
    desc: "Our AI chatbot helps citizens find services in English, Hindi, and Marathi — making it accessible to everyone.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
  },
  {
    icon: Users,
    title: "Community Driven",
    desc: "Built for Indian neighbourhoods — connecting citizens and local service providers in a transparent ecosystem.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
  {
    icon: Heart,
    title: "Made in India",
    desc: "Designed and developed with the real needs of Indian communities in mind — local first, always.",
    color: "#f97316",
    bg: "rgba(249,115,22,0.08)",
    border: "rgba(249,115,22,0.2)",
  },
]

const TECH_STACK = [
  { name: "Next.js 16", icon: "⚡", desc: "App Router", color: "#000" },
  { name: "TypeScript", icon: "🔷", desc: "Type Safety", color: "#3178c6" },
  { name: "Prisma ORM", icon: "🔺", desc: "Database", color: "#0c344b" },
  { name: "PostgreSQL", icon: "🐘", desc: "Neon Serverless", color: "#336791" },
  { name: "Tailwind CSS", icon: "🎨", desc: "v4 CSS-first", color: "#38bdf8" },
  { name: "Framer Motion", icon: "🌀", desc: "Animations", color: "#ff0080" },
  { name: "TanStack Query", icon: "🔄", desc: "Data Fetching", color: "#ef4444" },
  { name: "Groq AI", icon: "🤖", desc: "LLaMA 3.1", color: "#f59e0b" },
  { name: "Cloudinary", icon: "☁️", desc: "Image Upload", color: "#3448c5" },
  { name: "Vercel", icon: "▲", desc: "Deployment", color: "#000" },
]

const FEATURES_BUILT = [
  { icon: "🔐", title: "Role-based Auth", desc: "Custom JWT — Citizen, Provider, Admin roles" },
  { icon: "📅", title: "4-Step Booking", desc: "Time → Address → Payment → Confirmation" },
  { icon: "🔧", title: "Service Management", desc: "Providers add/edit/delete services with CRUD API" },
  { icon: "✅", title: "Booking Accept/Reject", desc: "Full status flow with reason on rejection" },
  { icon: "⭐", title: "Reviews & Ratings", desc: "Star rating with auto provider rating update" },
  { icon: "🤖", title: "AI Chatbot", desc: "Groq LLaMA 3.1 — multi-language service finder" },
  { icon: "🌙", title: "Dark/Light Theme", desc: "Full dark mode with system preference support" },
  { icon: "📱", title: "Fully Responsive", desc: "Mobile-first design across all screen sizes" },
]

const STATS = [
  { value: "12K+", label: "Happy Residents", icon: "👥" },
  { value: "450+", label: "Verified Providers", icon: "✅" },
  { value: "15K+", label: "Bookings Completed", icon: "📅" },
  { value: "4.8/5", label: "Average Rating", icon: "⭐" },
]

const JOURNEY = [
  {
    phase: "Phase 1",
    title: "Foundation",
    desc: "Authentication, landing page, services listing, booking wizard, citizen dashboard",
    status: "completed",
    color: "#10b981",
  },
  {
    phase: "Phase 2",
    title: "Provider Platform",
    desc: "Provider dashboard, service CRUD, booking accept/reject, role-based routing",
    status: "completed",
    color: "#10b981",
  },
  {
    phase: "Phase 3",
    title: "AI & Reviews",
    desc: "AI chatbot with Groq, reviews system, multi-language support",
    status: "completed",
    color: "#10b981",
  },
  {
    phase: "Phase 4",
    title: "Community",
    desc: "Real-time chat, community feed, complaints management, notifications",
    status: "upcoming",
    color: "#6b7280",
  },
  {
    phase: "Phase 5",
    title: "Scale",
    desc: "PWA support, admin dashboard, AI recommendations, multi-language",
    status: "upcoming",
    color: "#6b7280",
  },
]

export default function AboutPage() {
  const heroRef = useRef(null)
  const valuesRef = useRef(null)
  const techRef = useRef(null)
  const journeyRef = useRef(null)
  const featuresRef = useRef(null)

  const heroInView = useInView(heroRef, { once: true })
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" })
  const techInView = useInView(techRef, { once: true, margin: "-100px" })
  const journeyInView = useInView(journeyRef, { once: true, margin: "-100px" })
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" })

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section ref={heroRef}
        className="relative pt-28 pb-20 px-4 sm:px-6 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(15,118,110,0.04) 50%, transparent 100%)",
        }}>

        {/* Grid bg */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

        {/* Orbs */}
        <motion.div className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", top: "0%", left: "60%" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)", bottom: "10%", left: "5%" }}
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-6"
            style={{
              background: "rgba(16,185,129,0.1)",
              color: "#10b981",
              border: "1px solid rgba(16,185,129,0.2)",
            }}>
            <MapPin className="w-3.5 h-3.5" />
            About NeighbourHub AI
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold text-foreground mb-6 leading-tight">
            Connecting communities,
            <span className="block mt-2"
              style={{
                background: "linear-gradient(135deg, #10b981, #0f766e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              one service at a time.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            NeighbourHub AI is a full-stack community platform built to simplify local service booking,
            empower service providers, and make AI accessible to every Indian neighbourhood —
            in English, Hindi, and Marathi.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="p-4 rounded-2xl border bg-card text-center"
                style={{ borderColor: "rgba(16,185,129,0.15)" }}>
                <div className="text-2xl mb-1">{stat.icon}</div>
                <p className="font-poppins font-bold text-xl text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              <span className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full mb-5"
                style={{
                  background: "rgba(16,185,129,0.1)",
                  color: "#10b981",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}>
                ✦ Our Mission
              </span>
              <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-foreground mb-5">
                Making local services
                <span className="block"
                  style={{
                    background: "linear-gradient(135deg, #10b981, #0f766e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                  accessible to all.
                </span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                In India, finding a trusted local professional — plumber, electrician, carpenter —
                is still a word-of-mouth process. NeighbourHub AI digitizes this experience with
                a transparent, AI-powered platform that works for everyone.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Providers get a dashboard to manage bookings and grow their income.
                Citizens get verified professionals at their doorstep — with reviews,
                ratings, and an AI assistant that speaks their language.
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link href="/services"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                  Browse Services <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-border hover:border-emerald-500/40 hover:bg-accent transition-all text-foreground">
                  Join as Provider
                </Link>
              </div>
            </motion.div>

            {/* Right — Image collage */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { url: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=300&h=200&fit=crop&crop=face", label: "Plumber" },
                  { url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&h=200&fit=crop&crop=face", label: "Electrician" },
                  { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&h=200&fit=crop&crop=face", label: "Cleaner" },
                  { url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300&h=200&fit=crop&crop=face", label: "Carpenter" },
                ].map((img, i) => (
                  <motion.div
                    key={img.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ scale: 1.03 }}
                    className="relative rounded-2xl overflow-hidden border"
                    style={{ borderColor: "rgba(16,185,129,0.15)" }}>
                    <img src={img.url} alt={img.label}
                      className="w-full h-36 object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 px-3 py-2"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}>
                      <span className="text-white text-xs font-medium">{img.label}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 bg-card border rounded-2xl px-4 py-3 shadow-xl"
                style={{ borderColor: "rgba(16,185,129,0.3)" }}
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity }}>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" style={{ color: "#10b981" }} />
                  <div>
                    <p className="text-xs font-semibold text-foreground">All providers verified</p>
                    <p className="text-xs text-muted-foreground">Background checked ✓</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section ref={valuesRef} className="py-20 px-4 sm:px-6"
        style={{ background: "linear-gradient(180deg, transparent, rgba(16,185,129,0.03), transparent)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full mb-4"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.2)",
              }}>
              ✦ Our Values
            </span>
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-foreground">
              What we stand for
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM_VALUES.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="p-6 rounded-3xl border bg-card group transition-all hover:shadow-xl"
                style={{ borderColor: "var(--border)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border"
                  style={{ background: value.bg, borderColor: value.border }}>
                  <value.icon className="w-6 h-6" style={{ color: value.color }} />
                </div>
                <h3 className="font-poppins font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                <div className="h-0.5 w-0 group-hover:w-full mt-4 transition-all duration-500 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${value.color}, ${value.color}50)` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE BUILT ── */}
      <section ref={featuresRef} className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full mb-4"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.2)",
              }}>
              ✦ What We Built
            </span>
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-foreground">
              Features that
              <span className="ml-2"
                style={{
                  background: "linear-gradient(135deg, #10b981, #0f766e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                actually work.
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES_BUILT.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={featuresInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="p-5 rounded-2xl border bg-card hover:border-emerald-500/30 hover:shadow-lg transition-all">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-poppins font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ── */}
      <section ref={techRef} className="py-20 px-4 sm:px-6"
        style={{ background: "linear-gradient(180deg, transparent, rgba(139,92,246,0.03), transparent)" }}>
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={techInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full mb-4"
              style={{
                background: "rgba(139,92,246,0.1)",
                color: "#8b5cf6",
                border: "1px solid rgba(139,92,246,0.2)",
              }}>
              <Code className="w-3.5 h-3.5" />
              Tech Stack
            </span>
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-foreground mb-3">
              Built with modern technology
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Production-grade stack — the same tools used by top startups.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {TECH_STACK.map((tech, i) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={techInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.07 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="p-4 rounded-2xl border bg-card text-center hover:border-purple-500/30 hover:shadow-lg transition-all cursor-default">
                <div className="text-3xl mb-2">{tech.icon}</div>
                <p className="font-poppins font-semibold text-foreground text-sm">{tech.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{tech.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNEY / ROADMAP ── */}
      <section ref={journeyRef} className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={journeyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full mb-4"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.2)",
              }}>
              ✦ Project Roadmap
            </span>
            <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-foreground">
              Our journey so far
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{ background: "linear-gradient(180deg, #10b981, rgba(16,185,129,0.1))" }} />

            <div className="space-y-8">
              {JOURNEY.map((item, i) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  animate={journeyInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className={`relative flex items-center gap-6 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"} flex-row`}>

                  {/* Dot */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 z-10">
                    <div className="w-4 h-4 rounded-full border-2 border-background"
                      style={{
                        background: item.status === "completed" ? "#10b981" : "#6b7280",
                        boxShadow: item.status === "completed" ? "0 0 12px rgba(16,185,129,0.5)" : "none",
                      }} />
                  </div>

                  {/* Card */}
                  <div className={`ml-16 sm:ml-0 sm:w-5/12 p-5 rounded-2xl border bg-card transition-all hover:shadow-lg ${i % 2 === 0 ? "sm:mr-auto" : "sm:ml-auto"}`}
                    style={{
                      borderColor: item.status === "completed" ? "rgba(16,185,129,0.2)" : "var(--border)",
                    }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: item.status === "completed" ? "rgba(16,185,129,0.1)" : "rgba(107,114,128,0.1)",
                          color: item.status === "completed" ? "#10b981" : "#6b7280",
                        }}>
                        {item.phase}
                      </span>
                      {item.status === "completed" && (
                        <CheckCircle className="w-4 h-4" style={{ color: "#10b981" }} />
                      )}
                    </div>
                    <h3 className="font-poppins font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-10 sm:p-16 rounded-3xl border relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(15,118,110,0.06))",
              borderColor: "rgba(16,185,129,0.2)",
            }}>

            {/* Bg orbs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute w-64 h-64 rounded-full -top-20 -right-20"
                style={{ background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)" }} />
              <div className="absolute w-48 h-48 rounded-full -bottom-10 -left-10"
                style={{ background: "radial-gradient(circle, rgba(15,118,110,0.1) 0%, transparent 70%)" }} />
            </div>

            <div className="relative z-10">
              <div className="text-5xl mb-5">🏘️</div>
              <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-foreground mb-4">
                Ready to join the community?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Book your first service or start earning as a provider —
                it takes less than 2 minutes to get started.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg"
                  style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/services"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium border border-border hover:border-emerald-500/40 hover:bg-accent transition-all text-foreground">
                  Browse Services
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}