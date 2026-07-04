import Link from "next/link"
import { MapPin, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const links = {
  Platform: [
    { label: "Services", href: "/services" },
    { label: "Providers", href: "/providers" },
    { label: "Community", href: "/community" },
    { label: "Complaints", href: "/complaints" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
}

export function Footer() {
  return (
    <footer style={{ background: "linear-gradient(180deg, #0f172a, #020617)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="font-poppins font-bold text-white text-lg">NeighbourHub AI</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Connecting citizens, services, and communities with the power of AI. Available across Maharashtra.
            </p>
            <div className="space-y-2">
              <a href="mailto:hello@neighbourhub.ai" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                <Mail className="w-4 h-4" /> hello@neighbourhub.ai
              </a>
              <a href="tel:+919999999999" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                <Phone className="w-4 h-4" /> +91 99999 99999
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {items.map(item => (
                  <li key={item.label}>
                    <Link href={item.href}
                      className="text-slate-400 hover:text-white text-sm transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border border-white/10 rounded-2xl p-6 mb-10"
          style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay updated</h4>
              <p className="text-slate-400 text-sm">Get the latest news and service updates.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Input placeholder="Enter your email"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 sm:w-64" />
              <Button style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 NeighbourHub AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Twitter", "LinkedIn", "Instagram", "GitHub"].map(s => (
              <a key={s} href="#"
                className="text-slate-500 hover:text-white text-sm transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}