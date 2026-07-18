"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import Link from "next/link"
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Briefcase } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default function ProviderServicesPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["provider-services"],
    queryFn: async () => {
      const res = await fetch("/api/provider/services")
      return res.json()
    },
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isAvailable }: { id: string; isAvailable: boolean }) => {
      const res = await fetch(`/api/provider/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable }),
      })
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["provider-services"] })
      toast.success(data.data?.isAvailable ? "Service is now available" : "Service paused")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/provider/services/${id}`, { method: "DELETE" })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["provider-services"] })
        toast.success("Service deleted")
      } else {
        toast.error(data.error)
      }
    },
  })

  const services = data?.data || []

  return (
    <div className="p-6 pt-20 lg:pt-8 max-w-5xl">
      <motion.div className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="text-2xl font-poppins font-bold text-foreground">My Services</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {services.length} service{services.length !== 1 ? "s" : ""} listed
          </p>
        </div>
        <Button asChild
          style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>
          <Link href="/provider/services/new" className="gap-2">
            <Plus className="w-4 h-4" /> Add service
          </Link>
        </Button>
      </motion.div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-2xl">
          <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-poppins font-semibold text-foreground text-xl mb-2">
            No services yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Add your first service to start receiving bookings
          </p>
          <Button asChild
            style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>
            <Link href="/provider/services/new">
              <Plus className="w-4 h-4 mr-2" /> Add first service
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service: any, i: number) => (
            <motion.div key={service.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/30 transition-colors"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl flex-shrink-0">
                  {service.category?.icon || "🔧"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 className="font-poppins font-semibold text-foreground">{service.title}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{service.category?.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-xs px-2.5 py-1 rounded-full font-medium",
                        service.isAvailable
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                      )}>
                        {service.isAvailable ? "● Active" : "○ Paused"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-poppins font-bold text-foreground text-lg">₹{service.price}</span>
                    <div className="flex items-center gap-2">
                      {/* Toggle availability */}
                      <button
                        onClick={() => toggleMutation.mutate({ id: service.id, isAvailable: !service.isAvailable })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-accent transition-colors">
                        {service.isAvailable
                          ? <><ToggleRight className="w-4 h-4 text-green-500" /> Pause</>
                          : <><ToggleLeft className="w-4 h-4 text-gray-400" /> Activate</>}
                      </button>
                      {/* Edit */}
                      <Button size="sm" variant="outline" className="gap-1.5" asChild>
                        <Link href={`/provider/services/${service.id}/edit`}>
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </Link>
                      </Button>
                      {/* Delete */}
                      <Button size="sm" variant="outline"
                        className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                        onClick={() => {
                          if (confirm("Delete this service? This cannot be undone.")) {
                            deleteMutation.mutate(service.id)
                          }
                        }}
                        disabled={deleteMutation.isPending}>
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}