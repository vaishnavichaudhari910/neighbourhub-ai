"use client"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  CalendarCheck, AlertCircle, Wallet,
  Bell, TrendingUp, Clock, CheckCircle, XCircle
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"

const chartData = [
  { month: "Aug", bookings: 1 }, { month: "Sep", bookings: 2 },
  { month: "Oct", bookings: 1 }, { month: "Nov", bookings: 3 },
  { month: "Dec", bookings: 2 }, { month: "Jan", bookings: 4 },
  { month: "Feb", bookings: 3 }, { month: "Mar", bookings: 5 },
  { month: "Apr", bookings: 4 }, { month: "May", bookings: 6 },
  { month: "Jun", bookings: 5 }, { month: "Jul", bookings: 8 },
]

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  PENDING:     { label: "Pending",     color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  CONFIRMED:   { label: "Confirmed",   color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",   icon: CalendarCheck },
  IN_PROGRESS: { label: "In Progress", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: TrendingUp },
  COMPLETED:   { label: "Completed",   color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",  icon: CheckCircle },
  CANCELLED:   { label: "Cancelled",   color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",     icon: XCircle },
}

export default function DashboardPage() {
  const { data: meData } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me")
      return res.json()
    },
  })

  const { data: bookingsData, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings")
      return res.json()
    },
  })

  const user = meData?.data
  const bookings = bookingsData?.data || []
  const upcoming = bookings.filter((b: any) =>
    ["PENDING", "CONFIRMED"].includes(b.status))
  const completed = bookings.filter((b: any) => b.status === "COMPLETED")
  const totalSpent = completed.reduce((sum: number, b: any) => sum + b.amount, 0)

  const statCards = [
    {
      label: "Upcoming Bookings",
      value: upcoming.length,
      icon: CalendarCheck,
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.1)",
      sub: "Active bookings",
    },
    {
      label: "Completed",
      value: completed.length,
      icon: CheckCircle,
      color: "#10b981",
      bg: "rgba(16,185,129,0.1)",
      sub: "Services done",
    },
    {
      label: "Total Spent",
      value: `₹${totalSpent}`,
      icon: Wallet,
      color: "#8b5cf6",
      bg: "rgba(139,92,246,0.1)",
      sub: "Lifetime spend",
    },
    {
      label: "Notifications",
      value: 3,
      icon: Bell,
      color: "#f97316",
      bg: "rgba(249,115,22,0.1)",
      sub: "Unread alerts",
    },
  ]

  return (
    <div className="p-6 pt-20 lg:pt-8 max-w-6xl">
      {/* Welcome header */}
      <motion.div className="mb-8"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-poppins font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your account today.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, i) => (
          <motion.div key={card.label}
            className="bg-card border border-border rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: card.bg }}>
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <div className="text-2xl font-poppins font-bold text-foreground mb-0.5">
              {isLoading ? <Skeleton className="h-8 w-16" /> : card.value}
            </div>
            <div className="text-sm font-medium text-foreground">{card.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{card.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <motion.div className="xl:col-span-2 bg-card border border-border rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-poppins font-semibold text-foreground">Monthly Activity</h2>
              <p className="text-xs text-muted-foreground">Bookings over the last 12 months</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" /> +33% this month
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="bookingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", fontSize: "12px" }}
                cursor={{ stroke: "#3b82f6", strokeWidth: 1.5, strokeDasharray: "4 4" }} />
              <Area type="monotone" dataKey="bookings" stroke="#3b82f6"
                strokeWidth={2.5} fill="url(#bookingGradient)"
                dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#8b5cf6" }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick actions */}
        <motion.div className="bg-card border border-border rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="font-poppins font-semibold text-foreground mb-4">Quick actions</h2>
          <div className="space-y-3">
            {[
              { label: "Book a service", href: "/services", emoji: "🔧" },
              { label: "View my bookings", href: "/bookings", emoji: "📅" },
              { label: "Raise a complaint", href: "/complaints", emoji: "📢" },
              { label: "Community feed", href: "/community", emoji: "👥" },
              { label: "Update profile", href: "/profile", emoji: "⚙️" },
            ].map(action => (
              <Link key={action.href} href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors group">
                <span className="text-xl">{action.emoji}</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {action.label}
                </span>
                <span className="ml-auto text-muted-foreground group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent bookings table */}
      <motion.div className="bg-card border border-border rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-poppins font-semibold text-foreground">Recent Bookings</h2>
            <p className="text-xs text-muted-foreground">Your latest service bookings</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/bookings">View all</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-medium text-foreground mb-1">No bookings yet</p>
            <p className="text-sm text-muted-foreground mb-4">Book your first service to get started</p>
            <Button size="sm" asChild
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
              <Link href="/services">Browse services</Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {bookings.slice(0, 5).map((booking: any) => {
              const statusConfig = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING
              const StatusIcon = statusConfig.icon
              return (
                <div key={booking.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-accent/50 transition-colors">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-secondary">
                    {booking.service?.category?.icon || "🔧"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {booking.service?.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.service?.provider?.user?.name} •{" "}
                      {format(new Date(booking.date), "dd MMM yyyy")} at {booking.time}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-foreground text-sm">₹{booking.amount}</p>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium mt-0.5 ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}