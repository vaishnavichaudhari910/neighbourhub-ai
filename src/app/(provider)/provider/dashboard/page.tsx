"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { CalendarCheck, Briefcase, Star, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING:     { label: "Pending",     color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  CONFIRMED:   { label: "Confirmed",   color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  IN_PROGRESS: { label: "In Progress", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  COMPLETED:   { label: "Completed",   color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  CANCELLED:   { label: "Cancelled",   color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

export default function ProviderDashboardPage() {
  const { data: meData } = useQuery({
    queryKey: ["provider-me"],
    queryFn: async () => (await fetch("/api/auth/me")).json(),
  })

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: async () => (await fetch("/api/provider/bookings")).json(),
  })

  const { data: statsData } = useQuery({
    queryKey: ["provider-stats"],
    queryFn: async () => (await fetch("/api/provider/stats")).json(),
  })

  const user = meData?.data
  const bookings = bookingsData?.data || []
  const stats = statsData?.data
  const pending = bookings.filter((b: any) => b.status === "PENDING")

  const statCards = [
    { label: "Pending Requests", value: stats?.pending || 0, icon: Clock, color: "#f97316", bg: "rgba(249,115,22,0.1)" },
    { label: "Total Bookings", value: stats?.total || 0, icon: CalendarCheck, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    { label: "Completed", value: stats?.completed || 0, icon: CheckCircle, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    { label: "Total Earnings", value: `₹${stats?.earnings || 0}`, icon: TrendingUp, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
  ]

  return (
    <div className="p-6 pt-20 lg:pt-8 max-w-6xl">
      <motion.div className="mb-8"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-poppins font-bold text-foreground">
          Welcome, {user?.name?.split(" ")[0] || "Provider"}! 🔧
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your services and bookings from here.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <motion.div key={card.label}
            className="bg-card border border-border rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: card.bg }}>
              <card.icon className="w-5 h-5" style={{ color: card.color }} />
            </div>
            <div className="text-2xl font-poppins font-bold text-foreground mb-0.5">
              {isLoading ? <Skeleton className="h-8 w-16" /> : card.value}
            </div>
            <div className="text-sm text-muted-foreground">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Pending bookings — action needed */}
      {pending.length > 0 && (
        <motion.div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 rounded-2xl p-5 mb-6"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="font-poppins font-semibold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {pending.length} booking{pending.length > 1 ? "s" : ""} waiting for your response
          </h2>
          <div className="space-y-3">
            {pending.slice(0, 3).map((b: any) => (
              <div key={b.id} className="flex items-center justify-between bg-white dark:bg-orange-950/30 rounded-xl p-4 border border-orange-100 dark:border-orange-800/30">
                <div>
                  <p className="font-medium text-foreground text-sm">{b.service?.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {b.user?.name} • {format(new Date(b.date), "dd MMM")} at {b.time}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline"
                    className="text-red-500 border-red-200 hover:bg-red-50"
                    asChild>
                    <Link href={`/provider/bookings?id=${b.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Link href="/provider/bookings"
            className="text-sm text-orange-600 hover:underline mt-3 block">
            View all pending →
          </Link>
        </motion.div>
      )}

      {/* Quick actions */}
      <motion.div className="bg-card border border-border rounded-2xl p-6"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="font-poppins font-semibold text-foreground mb-4">Quick actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Add service", href: "/provider/services/new", emoji: "➕" },
            { label: "View bookings", href: "/provider/bookings", emoji: "📅" },
            { label: "My earnings", href: "/provider/earnings", emoji: "💰" },
            { label: "Update profile", href: "/provider/profile", emoji: "⚙️" },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-accent transition-all group">
              <span className="text-2xl">{a.emoji}</span>
              <span className="text-xs font-medium text-foreground text-center">{a.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  )
}