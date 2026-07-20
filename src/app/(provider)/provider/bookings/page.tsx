"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { toast } from "sonner"
import {
  CheckCircle, XCircle, PlayCircle, Flag,
  Clock, MapPin, Phone, Calendar, IndianRupee
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING:     { label: "Pending",     color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  CONFIRMED:   { label: "Confirmed",   color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  IN_PROGRESS: { label: "In Progress", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  COMPLETED:   { label: "Completed",   color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  CANCELLED:   { label: "Cancelled",   color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
}

const TABS = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"]

export default function ProviderBookingsPage() {
  const [activeTab, setActiveTab] = useState("All")
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["provider-bookings"],
    queryFn: async () => (await fetch("/api/provider/bookings")).json(),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, cancelReason }: {
      id: string; status: string; cancelReason?: string
    }) => {
      const res = await fetch(`/api/provider/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, cancelReason }),
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["provider-bookings"] })
        queryClient.invalidateQueries({ queryKey: ["provider-stats"] })
        toast.success(data.message)
        setRejectId(null)
        setRejectReason("")
      } else {
        toast.error(data.error)
      }
    },
  })

  const allBookings = data?.data || []
  const filtered = activeTab === "All"
    ? allBookings
    : allBookings.filter((b: any) =>
        b.status === activeTab.toUpperCase().replace(" ", "_")
      )

  return (
    <div className="p-6 pt-20 lg:pt-8 max-w-5xl">
      <motion.div className="mb-6"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-poppins font-bold text-foreground">Booking Requests</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {allBookings.length} total · {allBookings.filter((b: any) => b.status === "PENDING").length} pending
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              activeTab === tab ? "text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
            style={activeTab === tab ? { background: "linear-gradient(135deg, #10b981, #3b82f6)" } : {}}>
            {tab}
            {tab === "Pending" && allBookings.filter((b: any) => b.status === "PENDING").length > 0 && (
              <span className="ml-1.5 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {allBookings.filter((b: any) => b.status === "PENDING").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reject reason modal */}
      <AnimatePresence>
        {rejectId && (
          <motion.div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}>
              <h3 className="font-poppins font-semibold text-foreground mb-2">Reject booking</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Please provide a reason for rejection (shown to citizen):
              </p>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Not available on this date, Outside service area..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-4"
              />
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1"
                  onClick={() => { setRejectId(null); setRejectReason("") }}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  disabled={updateMutation.isPending}
                  onClick={() => updateMutation.mutate({
                    id: rejectId,
                    status: "CANCELLED",
                    cancelReason: rejectReason || "Rejected by provider",
                  })}>
                  Confirm rejection
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookings list */}
      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-medium text-foreground">No {activeTab.toLowerCase()} bookings</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((booking: any, i: number) => {
            const sc = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING
            return (
              <motion.div key={booking.id}
                className={cn(
                  "bg-card border rounded-2xl p-5 transition-colors",
                  booking.status === "PENDING"
                    ? "border-orange-300 dark:border-orange-700 shadow-sm"
                    : "border-border"
                )}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>

                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xl">
                      {booking.service?.category?.icon || "🔧"}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{booking.service?.title}</p>
                      <p className="text-xs text-muted-foreground">
                        #{booking.id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.color}`}>
                    {sc.label}
                  </span>
                </div>

                {/* Customer info */}
                <div className="bg-secondary/50 rounded-xl p-3 mb-4">
                  <p className="font-medium text-foreground text-sm mb-1">
                    👤 {booking.user?.name}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(booking.date), "dd MMM yyyy")} at {booking.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {booking.address}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <IndianRupee className="w-3 h-3" />
                      {booking.amount}
                    </span>
                  </div>
                </div>

                {/* Notes if cancelled */}
                {booking.status === "CANCELLED" && booking.notes && (
                  <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-lg mb-3">
                    {booking.notes}
                  </p>
                )}

                {/* Action buttons based on status */}
                <div className="flex gap-2 flex-wrap">
                  {booking.status === "PENDING" && (
                    <>
                      <Button size="sm" className="gap-2 bg-green-500 hover:bg-green-600 text-white"
                        disabled={updateMutation.isPending}
                        onClick={() => updateMutation.mutate({ id: booking.id, status: "CONFIRMED" })}>
                        <CheckCircle className="w-4 h-4" /> Accept booking
                      </Button>
                      <Button size="sm" variant="outline"
                        className="gap-2 text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => setRejectId(booking.id)}>
                        <XCircle className="w-4 h-4" /> Reject
                      </Button>
                    </>
                  )}
                  {booking.status === "CONFIRMED" && (
                    <Button size="sm" className="gap-2"
                      style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}
                      disabled={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ id: booking.id, status: "IN_PROGRESS" })}>
                      <PlayCircle className="w-4 h-4" /> Start job
                    </Button>
                  )}
                  {booking.status === "IN_PROGRESS" && (
                    <Button size="sm" className="gap-2 bg-green-500 hover:bg-green-600 text-white"
                      disabled={updateMutation.isPending}
                      onClick={() => updateMutation.mutate({ id: booking.id, status: "COMPLETED" })}>
                      <Flag className="w-4 h-4" /> Mark complete
                    </Button>
                  )}
                  {(booking.status === "COMPLETED" || booking.status === "CANCELLED") && (
                    <span className="text-xs text-muted-foreground py-1">
                      {booking.status === "COMPLETED" ? "✅ Job completed" : "❌ Booking rejected"}
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}