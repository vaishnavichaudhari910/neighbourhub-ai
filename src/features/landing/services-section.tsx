"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  { emoji: "⚡", title: "Electrician", slug: "electrician", rating: 4.9, reviews: 240, price: "₹299", color: "#fbbf24", bg: "#fef3c7", darkBg: "rgba(251,191,36,0.15)" },
  { emoji: "🔧", title: "Plumber", slug: "plumber", rating: 4.8, reviews: 189, price: "₹249", color: "#3b82f6", bg: "#dbeafe", darkBg: "rgba(59,130,246,0.15)" },
  { emoji: "❄️", title: "AC Repair", slug: "ac-repair", rating: 4.7, reviews: 312, price: "₹499", color: "#06b6d4", bg: "#cffafe", darkBg: "rgba(6,182,212,0.15)" },
  { emoji: "🧹", title: "Cleaning", slug: "cleaning", rating: 4.9, reviews: 427, price: "₹399", color: "#10b981", bg: "#d1fae5", darkBg: "rgba(16,185,129,0.15)" },
  { emoji: "🪚", title: "Carpenter", slug: "carpenter", rating: 4.8, reviews: 156, price: "₹349", color: "#f97316", bg: "#ffedd5", darkBg: "rgba(249,115,22,0.15)" },
  { emoji: "💻", title: "Computer Repair", slug: "computer-repair", rating: 4.7, reviews: 98, price: "₹449", color: "#8b5cf6", bg: "#ede9fe", darkBg: "rgba(139,92,246,0.15)" },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
}

export function ServicesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
            Popular Services
          </span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-foreground mt-4 mb-4">
            What do you need help with?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Choose from hundreds of verified local professionals ready to help you today.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {services.map(service => (
            <motion.div key={service.slug} variants={item}>
              <Link href={`/services?category=${service.slug}`}>
                <motion.div
                  className="group relative p-6 rounded-2xl border border-border bg-card cursor-pointer overflow-hidden"
                  whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.12)" }}
                  transition={{ type: "spring", stiffness: 300 }}>

                  {/* Hover background glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                    style={{ background: `radial-gradient(circle at top left, ${service.darkBg}, transparent 70%)` }} />

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4 relative z-10"
                    style={{ background: service.darkBg }}>
                    {service.emoji}
                  </div>

                  {/* Info */}
                  <div className="relative z-10">
                    <h3 className="font-poppins font-semibold text-foreground text-lg mb-1">{service.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium text-foreground">{service.rating}</span>
                      <span className="text-muted-foreground text-sm">({service.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Starting from <span className="font-semibold text-foreground">{service.price}</span></span>
                      <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm transition-transform group-hover:translate-x-1"
                        style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>→</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <Link href="/services">View all services <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  )
}