"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import {
  Clock, CheckCircle, XCircle, CalendarCheck, TrendingUp
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  PENDING:     { label: "Pending",     color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: Clock },
  CONFIRMED:   { label: "Confirmed",   color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",         icon: CalendarCheck },
  IN_PROGRESS: { label: "In Progress", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400", icon: TrendingUp },
  COMPLETED:   { label: "Completed",   color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",     icon: CheckCircle },
  CANCELLED:   { label: "Cancelled",   color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",             icon: XCircle },
}

const TABS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"]

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("All")

  const { data, isLoading } = useQuery({
    queryKey: ["my-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/bookings")
      return res.json()
    },
  })

  const allBookings = data?.data || []
  const filtered = activeTab === "All"
    ? allBookings
    : allBookings.filter((b: any) =>
        b.status === activeTab.toUpperCase().replace(" ", "_")
      )

  return (
    <div className="p-6 pt-20 lg:pt-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-poppins font-bold text-foreground">My Bookings</h1>
        <p className="text-muted-foreground text-sm mt-1">{allBookings.length} total bookings</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              activeTab === tab ? "text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
            style={activeTab === tab ? { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" } : {}}>
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-medium text-foreground mb-4">No {activeTab.toLowerCase()} bookings</p>
          <Button size="sm" asChild
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            <Link href="/services">Book a service</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking: any, i: number) => {
            const s = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING
            const SIcon = s.icon
            return (
              <div key={booking.id}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl flex-shrink-0">
                    {booking.service?.category?.icon || "🔧"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-foreground">{booking.service?.title}</p>
                        <p className="text-sm text-muted-foreground">by {booking.service?.provider?.user?.name}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${s.color}`}>
                        <SIcon className="w-3 h-3" /> {s.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                      <span>📅 {format(new Date(booking.date), "dd MMM yyyy")} at {booking.time}</span>
                      <span>📍 {booking.address}</span>
                      <span className="font-semibold text-foreground">₹{booking.amount}</span>
                    </div>
                    {booking.notes && (
                      <p className="text-xs text-muted-foreground mt-2 bg-secondary px-3 py-1.5 rounded-lg">
                        {booking.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}