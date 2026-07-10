"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import {
  LayoutDashboard, CalendarCheck, AlertCircle, MessageCircle,
  Bell, Users, Settings, LogOut, MapPin, Sun, Moon, Menu, X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bookings", label: "My Bookings", icon: CalendarCheck },
  { href: "/complaints", label: "Complaints", icon: AlertCircle },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/community", label: "Community", icon: Users },
  { href: "/profile", label: "Profile", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    toast.success("Logged out successfully")
    router.push("/login")
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="font-poppins font-bold text-foreground">
            Neighbour<span style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Hub</span>
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "text-white shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              style={isActive ? { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" } : {}}>
              <item.icon className={cn(
                "w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110",
                isActive ? "text-white" : ""
              )} />
              {item.label}
              {isActive && (
                <motion.div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                  layoutId="activeIndicator" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-border space-y-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          {theme === "dark"
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-screen border-r border-border bg-card z-40">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <Link href="/" className="font-poppins font-bold text-foreground">NeighbourHub</Link>
        <button onClick={() => setMobileOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div className="lg:hidden fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)} />
            <motion.aside className="lg:hidden fixed top-0 left-0 h-screen w-72 bg-card border-r border-border z-50 flex flex-col"
              initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
              transition={{ type: "spring", damping: 25 }}>
              <div className="flex justify-end p-4">
                <button onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}