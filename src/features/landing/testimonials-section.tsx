"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const testimonials = [
  { name: "Priya Sharma", role: "Homeowner, Pune", avatar: "PS", rating: 5, text: "Found an electrician within 10 minutes! The AI recommendation was spot on. The provider was professional and fixed everything perfectly.", color: "#3b82f6" },
  { name: "Rahul Desai", role: "Apartment Owner, Mumbai", avatar: "RD", rating: 5, text: "Booked a deep cleaning service and the team was amazing. The real-time tracking feature let me know exactly when they'd arrive.", color: "#8b5cf6" },
  { name: "Sneha Patil", role: "Working Professional, Nashik", avatar: "SP", rating: 5, text: "The complaint module helped me report a civic issue in my area. It was resolved within 3 days. Incredible platform!", color: "#10b981" },
  { name: "Amit Joshi", role: "Shop Owner, Nagpur", avatar: "AJ", rating: 5, text: "As a service provider, NeighbourHub has completely changed my business. I get 5x more bookings than before!", color: "#f97316" },
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1)
      setCurrent(c => (c + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const go = (dir: number) => {
    setDirection(dir)
    setCurrent(c => (c + dir + testimonials.length) % testimonials.length)
  }

  const t = testimonials[current]

  return (
    <section className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">Testimonials</span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-foreground mt-4">
            Loved by the community
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.4 }}
              className="p-8 sm:p-10 rounded-3xl border border-border bg-card text-center">

              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {Array(t.rating).fill(0).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>

              <p className="text-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                "{t.text}"
              </p>

              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: t.color }}>
                  {t.avatar}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-muted-foreground text-sm">{t.role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <button onClick={() => go(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-accent transition-colors shadow-md">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => go(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center hover:bg-accent transition-colors shadow-md">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: i === current ? 24 : 8, background: i === current ? "#3b82f6" : "#e2e8f0" }} />
          ))}
        </div>
      </div>
    </section>
  )
}