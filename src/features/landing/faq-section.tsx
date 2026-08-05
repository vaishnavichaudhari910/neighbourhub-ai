"use client"

import { useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Plus, Minus, MessageCircle } from "lucide-react"

const FAQS = [
  {
    category: "Booking",
    icon: "📅",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    questions: [
      {
        q: "How do I book a service on NeighbourHub AI?",
        a: "Booking is simple — just 4 steps! Search for your service, select a time slot, enter your address, and confirm. Our AI chatbot can also guide you through the entire process in English, Hindi, or Marathi.",
      },
      {
        q: "Can I cancel or reschedule a booking?",
        a: "Currently you can view your booking status from the citizen dashboard. For cancellations, the provider can reject a booking with a reason, and you'll see the updated status in 'My Bookings' page.",
      },
      {
        q: "What happens after I confirm a booking?",
        a: "After confirmation, your booking goes to PENDING status. The provider reviews it and either accepts (CONFIRMED) or rejects it with a reason. Once accepted, they'll mark it IN_PROGRESS when work begins and COMPLETED when done.",
      },
    ],
  },
  {
    category: "Providers",
    icon: "🔧",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
    questions: [
      {
        q: "How do I join as a service provider?",
        a: "Register with the 'Provider' role on NeighbourHub AI. Once registered, go to your Provider Dashboard and add your services — title, description, category, and price. Your services will be visible to citizens immediately.",
      },
      {
        q: "How do providers manage bookings?",
        a: "Providers get a dedicated dashboard showing all incoming booking requests. You can Accept or Reject bookings with a reason, mark jobs as In Progress when you start, and Complete them when done. Your earnings are tracked automatically.",
      },
      {
        q: "Are providers verified before joining?",
        a: "Yes! Every provider goes through a verification process. Once a provider adds their first service, they are marked as verified on the platform. Verified providers show a badge on their profile and services.",
      },
    ],
  },
  {
    category: "AI Chatbot",
    icon: "🤖",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
    questions: [
      {
        q: "What languages does the AI chatbot support?",
        a: "Our AI chatbot supports English, Hindi, and Marathi. You can switch languages anytime using the language selector inside the chat. Just select your preferred language and start chatting naturally!",
      },
      {
        q: "Can the AI chatbot book services for me?",
        a: "Yes! When you tell the AI what service you need, it searches our real database and suggests matching providers with prices and ratings. If you want to book, it redirects you directly to the booking page with the service pre-selected.",
      },
      {
        q: "Do I need to be logged in to use the chatbot?",
        a: "You can chat freely without logging in. However, to actually book a service, you'll need to sign in. The AI will prompt you with a 'Sign In to Continue' button when needed.",
      },
    ],
  },
  {
    category: "Reviews & Ratings",
    icon: "⭐",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    questions: [
      {
        q: "How do I leave a review for a provider?",
        a: "After your booking is marked as COMPLETED, go to 'My Bookings' and you'll see a 'Leave a Review' button on completed bookings. Select your star rating (1-5), add an optional comment, and submit. One review per booking only.",
      },
      {
        q: "How is the provider's rating calculated?",
        a: "Provider ratings are automatically calculated as the average of all reviews received. Every time a new review is submitted, the provider's rating and total review count update instantly on their profile and services listing.",
      },
    ],
  },
]

export function FAQSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-80px" })
  const [activeCategory, setActiveCategory] = useState(0)
  const [openQuestion, setOpenQuestion] = useState<number | null>(0)

  const currentFAQs = FAQS[activeCategory]

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 overflow-hidden"
      style={{
        background: "linear-gradient(180deg, transparent 0%, rgba(16,185,129,0.03) 50%, transparent 100%)",
      }}>
      <div className="max-w-5xl mx-auto">

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
            ✦ Frequently Asked Questions
          </motion.span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-foreground mb-4">
            Got questions?
            <span className="block mt-1"
              style={{
                background: "linear-gradient(135deg, #10b981, #0f766e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              We have answers.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to know about booking services, joining as a provider,
            and using NeighbourHub AI.
          </p>
        </motion.div>

        {/* Category tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex gap-2 flex-wrap justify-center mb-10">
          {FAQS.map((faq, i) => (
            <button
              key={faq.category}
              onClick={() => { setActiveCategory(i); setOpenQuestion(0) }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border"
              style={{
                background: activeCategory === i ? faq.color : "var(--card)",
                color: activeCategory === i ? "white" : "var(--text-secondary)",
                borderColor: activeCategory === i ? faq.color : "var(--border)",
                boxShadow: activeCategory === i ? `0 4px 12px ${faq.color}30` : "none",
              }}>
              <span>{faq.icon}</span>
              {faq.category}
            </button>
          ))}
        </motion.div>

        {/* FAQ content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left — category info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border p-6 sticky top-24"
                style={{
                  background: currentFAQs.bg,
                  borderColor: currentFAQs.border,
                }}>
                <div className="text-5xl mb-4">{currentFAQs.icon}</div>
                <h3 className="font-poppins font-bold text-2xl text-foreground mb-2">
                  {currentFAQs.category}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {activeCategory === 0 && "Learn how our 4-step booking process works and what to expect after booking."}
                  {activeCategory === 1 && "Understand how to join, manage services, and grow your business on the platform."}
                  {activeCategory === 2 && "Discover how our AI assistant helps you find and book services in your language."}
                  {activeCategory === 3 && "Find out how reviews work and how they help build trust in the community."}
                </p>

                {/* Quick stats per category */}
                <div className="space-y-3">
                  {activeCategory === 0 && [
                    { label: "Steps to book", value: "4 steps" },
                    { label: "Booking statuses", value: "5 stages" },
                    { label: "Avg booking time", value: "< 2 min" },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                      <span className="text-xs font-semibold" style={{ color: currentFAQs.color }}>{stat.value}</span>
                    </div>
                  ))}
                  {activeCategory === 1 && [
                    { label: "Verified providers", value: "450+" },
                    { label: "Service categories", value: "50+" },
                    { label: "Provider dashboard", value: "Free" },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                      <span className="text-xs font-semibold" style={{ color: currentFAQs.color }}>{stat.value}</span>
                    </div>
                  ))}
                  {activeCategory === 2 && [
                    { label: "Languages supported", value: "3" },
                    { label: "AI model", value: "LLaMA 3.1" },
                    { label: "Response time", value: "< 3 sec" },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                      <span className="text-xs font-semibold" style={{ color: currentFAQs.color }}>{stat.value}</span>
                    </div>
                  ))}
                  {activeCategory === 3 && [
                    { label: "Total reviews", value: "2,100+" },
                    { label: "Avg platform rating", value: "4.8/5" },
                    { label: "Reviews per booking", value: "1 max" },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between py-2 border-b border-border/50">
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                      <span className="text-xs font-semibold" style={{ color: currentFAQs.color }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right — Questions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="lg:col-span-3 space-y-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>
                {currentFAQs.questions.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-2xl border bg-card overflow-hidden mb-3"
                    style={{
                      borderColor: openQuestion === i ? currentFAQs.color + "40" : "var(--border)",
                      boxShadow: openQuestion === i ? `0 0 0 1px ${currentFAQs.color}20` : "none",
                    }}>

                    <button
                      onClick={() => setOpenQuestion(openQuestion === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-accent/50">
                      <span className="font-medium text-foreground pr-4 text-sm sm:text-base">
                        {faq.q}
                      </span>
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center border transition-all"
                        style={{
                          background: openQuestion === i ? currentFAQs.bg : "transparent",
                          borderColor: openQuestion === i ? currentFAQs.border : "var(--border)",
                        }}>
                        {openQuestion === i
                          ? <Minus className="w-4 h-4" style={{ color: currentFAQs.color }} />
                          : <Plus className="w-4 h-4 text-muted-foreground" />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {openQuestion === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}>
                          <div className="px-5 pb-5">
                            <div className="h-px bg-border mb-4" />
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center p-8 rounded-3xl border relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(15,118,110,0.06))",
            borderColor: "rgba(16,185,129,0.2)",
          }}>
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 border"
              style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.2)" }}>
              <MessageCircle className="w-7 h-7" style={{ color: "#10b981" }} />
            </div>
            <h3 className="font-poppins font-bold text-xl text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Try our AI chatbot — it can answer questions, find services,
              and guide you through booking in English, Hindi, or Marathi.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                Browse Services →
              </a>
              <a href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm border border-border bg-card hover:bg-accent hover:border-emerald-500/30 transition-all text-foreground">
                Get Started Free
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}