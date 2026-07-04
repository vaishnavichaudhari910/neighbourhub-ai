import { HeroSection } from "@/features/landing/hero-section"
import { ServicesSection } from "@/features/landing/services-section"
import { FeaturesSection } from "@/features/landing/features-section"
import { AISection } from "@/features/landing/ai-section"
import { TestimonialsSection } from "@/features/landing/testimonials-section"
import { FAQSection } from "@/features/landing/faq-section"

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <FeaturesSection />
      <AISection />
      <TestimonialsSection />
      <FAQSection />
    </main>
  )
}