"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, ArrowRight, Star, Users, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

const POPULAR = ["Plumber", "Electrician", "Cleaning", "Carpenter", "Tutor"]

export function Hero() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [currentWord, setCurrentWord] = useState(0)

  const words = ["Connected.", "Smarter.", "Safer.", "Together."]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % words.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/services?q=${encodeURIComponent(query)}`)
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">

      {/* Background blobs — light + dark responsive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 dark:opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
        <div className="absolute top-1/2 -right-40 w-80 h-80 rounded-full opacity-15 dark:opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full opacity-10 dark:opacity-5 blur-3xl"
          style={{ background: "radial-gradient(circle, #10b981, transparent)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT — Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}>

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border"
              style={{
                background: "linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))",
                borderColor: "rgba(59,130,246,0.3)",
                color: "#3b82f6"
              }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AI-Powered Community Platform
            </motion.div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold text-foreground leading-tight mb-4">
              Your Neighbourhood,{" "}
              <span className="block overflow-hidden h-[1.2em]">
                <motion.span
                  key={currentWord}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="block"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                  {words[currentWord]}
                </motion.span>
              </span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Book trusted local services, report civic issues,
              and connect with people around you — all in one place.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-2 p-1.5 rounded-2xl border border-border bg-card shadow-lg max-w-lg">
                <div className="flex items-center gap-2 flex-1 px-3">
                  <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search for services..."
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none py-2"
                  />
                </div>
                <button type="submit"
                  className="px-5 py-2.5 rounded-xl text-white text-sm font-medium flex-shrink-0 flex items-center gap-2"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                  <Search className="w-4 h-4" /> Search
                </button>
              </div>
            </form>

            {/* Popular searches */}
            <div className="flex items-center gap-2 flex-wrap mb-8">
              <span className="text-xs text-muted-foreground">Popular:</span>
              {POPULAR.map(term => (
                <button key={term}
                  onClick={() => router.push(`/services?q=${term}`)}
                  className="text-xs px-3 py-1 rounded-full border border-border bg-secondary hover:bg-accent hover:border-primary/40 transition-all text-foreground">
                  {term}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3 flex-wrap mb-10">
              <Link href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                Book a Service <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/providers"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border border-border bg-card hover:bg-accent transition-all hover:-translate-y-0.5 text-foreground">
                Explore Providers
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-6 flex-wrap">
              {[
                { icon: Users, value: "12K+", label: "Happy Residents" },
                { icon: CheckCircle, value: "450+", label: "Verified Providers" },
                { icon: Star, value: "4.8/5", label: "Average Rating" },
              ].map((stat, i) => (
                <motion.div key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))" }}>
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-poppins font-bold text-foreground text-sm">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block">

            {/* Floating cards */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-4 -left-4 z-10 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Booking Confirmed!</p>
                  <p className="text-xs text-muted-foreground">Plumber • Today 10AM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -bottom-4 -right-4 z-10 bg-card border border-border rounded-2xl px-4 py-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {["🧑", "👩", "👨"].map((e, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-secondary border border-card flex items-center justify-center text-xs">
                      {e}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">10,000+</p>
                  <p className="text-xs text-muted-foreground">Happy Residents</p>
                </div>
              </div>
            </motion.div>

            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl">
              <Image
                src="/home.png"
                alt="NeighbourHub Community"
                width={600}
                height={500}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}