"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Sun, Moon, Menu, X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/providers", label: "Providers" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "py-3 border-b border-white/10 shadow-lg shadow-black/5"
            : "py-5"
        )}
        style={{
          background: scrolled
            ? "rgba(var(--background-rgb, 255 255 255) / 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
              <MapPin className="w-5 h-5" />
            </div>
            <span className="font-poppins font-bold text-lg text-foreground hidden sm:block">
              NeighbourHub <span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
           {/* Theme toggle */}
<button
  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  className="w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-accent transition-colors">
  {/* mounted check — hydration fix */}
  {mounted ? (
    theme === "dark"
      ? <Sun className="w-4 h-4" />
      : <Moon className="w-4 h-4" />
  ) : (
    <div className="w-4 h-4" /> // placeholder — server render sathi
  )}
</button>

            {/* Auth buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                <Link href="/register">Get started</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent"
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-x-0 top-0 z-40 pt-20 pb-6 px-4 border-b border-border"
            style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)" }}
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-accent">
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
              </Button>
              <Button className="flex-1" asChild
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                <Link href="/register" onClick={() => setMobileOpen(false)}>Get started</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}