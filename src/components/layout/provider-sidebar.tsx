"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  LayoutDashboard, Briefcase, CalendarCheck,
  MessageCircle, Star, Settings,
  LogOut, MapPin, Sun, Moon, Menu, X, TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const navItems = [
  { href: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/provider/services", label: "My Services", icon: Briefcase },
  { href: "/provider/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/provider/earnings", label: "Earnings", icon: TrendingUp },
  { href: "/provider/reviews", label: "Reviews", icon: Star },
  { href: "/provider/messages", label: "Messages", icon: MessageCircle },
  { href: "/provider/profile", label: "Profile", icon: Settings },
]

export function ProviderSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    toast.success("Logged out")
    router.push("/login")
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-poppins font-bold text-foreground text-sm">NeighbourHub</span>
            <div className="text-xs text-muted-foreground">Provider Portal</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link key={item.href} href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive ? "text-white shadow-md" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              style={isActive ? { background: "linear-gradient(135deg, #10b981, #3b82f6)" } : {}}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          {mounted
            ? theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />
            : <div className="w-4 h-4" />}
          {mounted ? (theme === "dark" ? "Light mode" : "Dark mode") : "Theme"}
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
      <aside className="hidden lg:flex flex-col w-64 fixed top-0 left-0 h-screen border-r border-border bg-card z-40">
        <SidebarContent />
      </aside>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <span className="font-poppins font-bold text-foreground text-sm">Provider Portal</span>
        <button onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
      </div>
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileOpen(false)} />
          <aside className="lg:hidden fixed top-0 left-0 h-screen w-72 bg-card border-r border-border z-50 flex flex-col">
            <div className="flex justify-end p-4">
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  )
}