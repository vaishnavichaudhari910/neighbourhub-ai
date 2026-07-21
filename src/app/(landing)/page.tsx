import { Hero } from "@/features/landing/hero"
import { ServicesSection } from "@/features/landing/services-section"
import { FeaturesSection } from "@/features/landing/features-section"
import { AISection } from "@/features/landing/ai-section"
import { TestimonialsSection } from "@/features/landing/testimonials-section"
import { FAQSection } from "@/features/landing/faq-section"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ServicesSection />
      <FeaturesSection />
      <AISection />
      <TestimonialsSection />
      <FAQSection />
    </main>
  )
}