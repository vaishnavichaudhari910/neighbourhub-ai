"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

const faqs = [
  { q: "How are service providers verified?", a: "Every provider goes through identity verification, skill assessment, and background checks before being listed on NeighbourHub AI." },
  { q: "Is my payment secure?", a: "Yes. Payments are held securely and only released to the provider after you confirm the job is complete. We use industry-standard encryption." },
  { q: "How does the AI recommendation work?", a: "Our AI analyzes your location, service history, budget, and provider ratings to suggest the most suitable professionals for your needs." },
  { q: "Can I become a service provider?", a: "Absolutely! Register as a Provider, complete your profile, submit verification documents, and start receiving bookings within 24 hours." },
  { q: "What happens if I'm unhappy with the service?", a: "Raise a complaint through the platform. Our team reviews it within 24 hours and ensures a resolution including refunds if applicable." },
  { q: "Is NeighbourHub AI available in my city?", a: "We currently cover 20+ cities across Maharashtra and are expanding rapidly. Search your city on our platform to see available providers." },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-24 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}>
          <span className="text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-poppins font-bold text-foreground mt-4">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i}
              className="border border-border rounded-2xl overflow-hidden bg-card"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <button className="w-full flex items-center justify-between p-5 text-left gap-4"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-medium text-foreground">{faq.q}</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: open === i ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "transparent", border: open === i ? "none" : "1px solid var(--border)" }}>
                  {open === i
                    ? <Minus className="w-3 h-3 text-white" />
                    : <Plus className="w-3 h-3 text-muted-foreground" />}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
