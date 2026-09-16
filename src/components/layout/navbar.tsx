"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { useQuery } from "@tanstack/react-query"
import {
  MapPin, Sun, Moon, Menu, X,
  LayoutDashboard, LogOut, User,
  ChevronDown, Briefcase
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/providers", label: "Providers" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me")
      return res.json()
    },
    retry: false,
  })

  const user = meData?.data

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    toast.success("Logged out!")
    router.push("/")
    router.refresh()
  }

  const getDashboardLink = () => {
    if (!user) return "/login"
    if (user.role === "PROVIDER") return "/provider/dashboard"
    if (user.role === "ADMIN") return "/admin/dashboard"
    return "/dashboard"
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(var(--background-rgb, 255,255,255), 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.06)" : "none",
        }}>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/"
              className="flex items-center gap-2.5 flex-shrink-0 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md"
                style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                <MapPin className="w-4 h-4 text-white" />
              </motion.div>
              <span className="font-poppins font-bold text-foreground text-lg hidden sm:block">
                Neighbour<span
                  style={{
                    background: "linear-gradient(135deg, #10b981, #0f766e)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}>
                  Hub
                </span>
                <span className="text-xs font-medium ml-1 px-1.5 py-0.5 rounded-md align-middle"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.2)",
                    fontSize: "10px",
                  }}>
                  AI
                </span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => {
                const isActive = pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href))
                return (
                  <Link key={link.href} href={link.href}
                    className={cn(
                      "relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}>
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl -z-10"
                        style={{ background: "rgba(16,185,129,0.1)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavDot"
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                        style={{ background: "#10b981" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">

              {/* Theme toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                {mounted ? (
                  theme === "dark"
                    ? <Sun className="w-4 h-4" />
                    : <Moon className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4" />
                )}
              </motion.button>

              {/* Auth section */}
              {user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-border hover:border-emerald-500/40 hover:bg-accent transition-all">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-foreground max-w-[80px] truncate">
                      {user.name?.split(" ")[0]}
                    </span>
                    <ChevronDown className={cn(
                      "w-3.5 h-3.5 text-muted-foreground transition-transform",
                      userMenuOpen && "rotate-180"
                    )} />
                  </motion.button>

                  {/* User dropdown */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40"
                          onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl overflow-hidden z-50">

                          {/* User info */}
                          <div className="px-4 py-3 border-b border-border"
                            style={{ background: "rgba(16,185,129,0.04)" }}>
                            <p className="font-medium text-foreground text-sm truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-1.5 font-medium"
                              style={{
                                background: user.role === "PROVIDER"
                                  ? "rgba(16,185,129,0.1)"
                                  : "rgba(59,130,246,0.1)",
                                color: user.role === "PROVIDER" ? "#10b981" : "#3b82f6",
                              }}>
                              {user.role === "PROVIDER"
                                ? <><Briefcase className="w-3 h-3" /> Provider</>
                                : <><User className="w-3 h-3" /> Citizen</>}
                            </span>
                          </div>

                          <div className="p-2">
                            <Link href={getDashboardLink()}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-accent transition-colors">
                              <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                              Dashboard
                            </Link>
                            <Link href={user.role === "PROVIDER" ? "/provider/profile" : "/profile"}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-foreground hover:bg-accent transition-colors">
                              <User className="w-4 h-4 text-muted-foreground" />
                              Profile
                            </Link>
                            <div className="h-px bg-border my-1" />
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                              <LogOut className="w-4 h-4" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                    Sign in
                  </Link>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/register"
                      className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                      Get started
                    </Link>
                  </motion.div>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mobileOpen ? "close" : "open"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}>
                    {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm"
              onClick={() => setMobileOpen(false)} />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-card border-l border-border z-50 lg:hidden overflow-y-auto">

              {/* Mobile header */}
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-poppins font-bold text-foreground">NeighbourHub AI</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-xl border border-border flex items-center justify-center">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* User info mobile */}
              {user && (
                <div className="mx-4 mt-4 p-4 rounded-2xl border"
                  style={{
                    background: "rgba(16,185,129,0.06)",
                    borderColor: "rgba(16,185,129,0.2)",
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                      style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile nav links */}
              <nav className="p-4 space-y-1">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(link.href))
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}>
                      <Link href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: isActive ? "rgba(16,185,129,0.1)" : "transparent",
                          color: isActive ? "#10b981" : "var(--text-secondary)",
                          border: isActive ? "1px solid rgba(16,185,129,0.2)" : "1px solid transparent",
                        }}>
                        {link.label}
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10b981" }} />
                        )}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              {/* Mobile auth */}
              <div className="p-4 border-t border-border space-y-2 mt-2">
                {user ? (
                  <>
                    <Link href={getDashboardLink()}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-accent transition-colors border border-border">
                      <LayoutDashboard className="w-4 h-4" style={{ color: "#10b981" }} />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border border-red-100 dark:border-red-900/30">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-foreground border border-border hover:bg-accent transition-colors">
                      Sign in
                    </Link>
                    <Link href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-white transition-all"
                      style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                      Get started
                    </Link>
                  </>
                )}

                {/* Theme toggle mobile */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:bg-accent transition-all">
                  {mounted ? (
                    theme === "dark"
                      ? <><Sun className="w-4 h-4" /> Light mode</>
                      : <><Moon className="w-4 h-4" /> Dark mode</>
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}