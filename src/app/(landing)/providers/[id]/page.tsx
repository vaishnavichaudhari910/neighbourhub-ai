"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import dynamic from "next/dynamic"
import Link from "next/link"
import {
  Star, MapPin, Clock, BadgeCheck, Phone,
  Calendar, ArrowLeft, Briefcase, Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AvailabilityCalendar } from "@/features/providers/availability-calendar"

// Dynamic import for Leaflet (SSR incompatible)
const ProviderMap = dynamic(
  () => import("@/components/shared/provider-map").then(m => m.ProviderMap),
  { ssr: false, loading: () => <div className="h-64 rounded-2xl bg-muted animate-pulse" /> }
)

const mockReviews = [
  { id: "1", name: "Priya S.", avatar: "PS", rating: 5, date: "Dec 2025", text: "Excellent service! Very professional and completed the work on time.", color: "#3b82f6" },
  { id: "2", name: "Rahul D.", avatar: "RD", rating: 5, date: "Nov 2025", text: "Great work quality. Will definitely book again!", color: "#8b5cf6" },
  { id: "3", name: "Sneha P.", avatar: "SP", rating: 4, date: "Nov 2025", text: "Good service, arrived on time and was very courteous.", color: "#10b981" },
]

export default function ProviderPage() {
  const { id } = useParams()
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["provider", id],
    queryFn: async () => {
      const res = await fetch(`/api/providers/${id}`)
      if (!res.ok) throw new Error("Not found")
      return res.json()
    },
  })

  const provider = data?.data

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-80 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-poppins font-bold mb-2">Provider not found</h2>
          <Button asChild><Link href="/services">Browse services</Link></Button>
        </div>
      </div>
    )
  }

  // Pune coordinates as default
  const lat = provider.latitude || 18.5204
  const lng = provider.longitude || 73.8567

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Back button */}
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 mt-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to services
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT — main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile card */}
            <motion.div className="bg-card border border-border rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Cover gradient */}
              <div className="h-24"
                style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)" }} />
              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="flex items-end justify-between -mt-10 mb-4">
                  <div className="w-20 h-20 rounded-2xl border-4 border-card flex items-center justify-center text-white text-2xl font-bold"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                    {provider.user.name.charAt(0)}
                  </div>
                  {provider.isVerified && (
                    <Badge className="gap-1 bg-blue-500/10 text-blue-500 border-blue-500/20">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified Pro
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl font-poppins font-bold text-foreground mb-1">
                  {provider.user.name}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {provider.city || "Pune"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {provider.experience} yrs experience
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {provider.totalBookings} completed
                  </span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-secondary/50 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-poppins font-bold text-foreground">
                      {provider.rating}
                    </div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                  </div>
                  <div className="text-center border-x border-border">
                    <div className="text-2xl font-poppins font-bold text-foreground">
                      {provider.totalReviews}
                    </div>
                    <div className="text-xs text-muted-foreground">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-poppins font-bold text-foreground">
                      {provider.services.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Services</div>
                  </div>
                </div>

                {/* Rating stars breakdown */}
                <div className="flex items-center gap-2">
                  {[5,4,3,2,1].map(star => (
                    <div key={star} className="flex items-center gap-1.5 flex-1">
                      <span className="text-xs text-muted-foreground w-3">{star}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full"
                          style={{
                            width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1}%`,
                            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)"
                          }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bio */}
                {provider.bio && (
                  <p className="text-muted-foreground text-sm leading-relaxed mt-4">
                    {provider.bio}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Services offered */}
            <motion.div className="bg-card border border-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-poppins font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" /> Services Offered
              </h2>
              <div className="space-y-3">
                {provider.services.map((svc: any) => (
                  <div key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedService === svc.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-secondary/50"
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{svc.category.icon}</span>
                      <div>
                        <p className="font-medium text-foreground text-sm">{svc.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{svc.description}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-poppins font-bold text-foreground">₹{svc.price}</p>
                      <p className="text-xs text-muted-foreground">onwards</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div className="bg-card border border-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-poppins font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" /> Customer Reviews
              </h2>
              <div className="space-y-4">
                {mockReviews.map(review => (
                  <div key={review.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: review.color }}>
                      {review.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground text-sm">{review.name}</span>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-1">
                        {Array(review.rating).fill(0).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground text-sm">{review.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map */}
            <motion.div className="bg-card border border-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-poppins font-semibold text-foreground text-lg mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Service Location
              </h2>
              <ProviderMap
                lat={lat} lng={lng}
                name={provider.user.name}
                city={provider.city || "Pune"}
              />
            </motion.div>
          </div>

          {/* RIGHT — booking sidebar */}
          <div className="space-y-6">

            {/* Book Now card */}
            <motion.div className="bg-card border border-border rounded-2xl p-5 sticky top-24"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-poppins font-semibold text-foreground mb-1">Book this provider</h2>
              <p className="text-muted-foreground text-xs mb-4">
                Select a service and date to continue
              </p>

              {!selectedService ? (
                <div className="p-3 rounded-xl bg-secondary/50 text-center text-sm text-muted-foreground mb-4">
                  ← Select a service from the list
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-primary bg-primary/5 text-sm text-primary mb-4">
                  ✓ Service selected
                </div>
              )}

              {/* Calendar */}
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Pick a date
                </p>
                <AvailabilityCalendar
                  selectedDate={selectedDate}
                  onSelect={setSelectedDate}
                />
              </div>

              {selectedDate && (
                <p className="text-sm text-primary font-medium mb-4">
                  ✓ {selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                </p>
              )}

              <Button className="w-full h-11"
                disabled={!selectedService || !selectedDate}
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                onClick={() => {
                  if (selectedService && selectedDate) {
                    router.push(`/booking?serviceId=${selectedService}&date=${selectedDate.toISOString()}`)
                  }
                }}>
                {!selectedService || !selectedDate
                  ? "Select service & date"
                  : "Continue to Book →"}
              </Button>

              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  {provider.user.phone || "Contact via platform"}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                  Verified & background checked
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}