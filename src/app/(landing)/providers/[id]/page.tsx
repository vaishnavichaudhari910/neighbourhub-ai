"use client"

import { useState, useRef } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { motion, useInView } from "framer-motion"
import {
  MapPin, Clock, Star, Shield, ArrowLeft,
  CheckCircle, Briefcase, Calendar, ChevronLeft,
  ChevronRight, Phone, MessageCircle, Share2,
  Award, TrendingUp, Users, Zap
} from "lucide-react"
import Link from "next/link"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isPast, isBefore, startOfToday } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

const PROVIDER_IMAGES = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
]

const CATEGORY_IMAGES: Record<string, string> = {
  plumber: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&h=200&fit=crop",
  electrician: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=200&fit=crop",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=200&fit=crop",
  carpenter: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&h=200&fit=crop",
  default: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&h=200&fit=crop",
}

export default function ProviderDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const preSelectedService = searchParams.get("service")

  const [selectedService, setSelectedService] = useState<string | null>(preSelectedService)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState<"services" | "reviews" | "about">("services")

  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })
  const servicesRef = useRef(null)
  const servicesInView = useInView(servicesRef, { once: true })

  const { data, isLoading } = useQuery({
    queryKey: ["provider", id],
    queryFn: async () => {
      const res = await fetch(`/api/providers/${id}`)
      return res.json()
    },
  })

  const { data: reviewsData } = useQuery({
    queryKey: ["provider-reviews", id],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?providerId=${id}`)
      return res.json()
    },
  })

  const provider = data?.data
  const reviews = reviewsData?.data || []
  const services = provider?.services || []
  const avatarUrl = PROVIDER_IMAGES[parseInt(String(id).slice(-1), 16) % PROVIDER_IMAGES.length]
  const bannerSlug = services[0]?.category?.slug || "default"
  const bannerImage = CATEGORY_IMAGES[bannerSlug] || CATEGORY_IMAGES.default

  // Calendar
  const today = startOfToday()
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDayOfWeek = monthStart.getDay()

  const handleBookNow = () => {
    if (!selectedService) { toast.error("Please select a service first"); return }
    if (!selectedDate) { toast.error("Please select a date"); return }
    router.push(`/booking?serviceId=${selectedService}&date=${selectedDate.toISOString()}`)
  }

  const selectedServiceData = services.find((s: any) => s.id === selectedService)

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter((r: any) => r.rating === stars).length,
    pct: reviews.length ? Math.round(reviews.filter((r: any) => r.rating === stars).length / reviews.length * 100) : 0,
  }))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <Skeleton className="h-64 rounded-3xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-48 rounded-2xl" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="font-poppins font-bold text-2xl text-foreground mb-2">Provider not found</h2>
          <Link href="/providers" className="text-sm" style={{ color: "#10b981" }}>← Back to providers</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Back button */}
      <div className="pt-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to providers
        </motion.button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT — Provider info */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero card */}
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              className="rounded-3xl overflow-hidden border border-border"
              style={{ borderColor: "rgba(16,185,129,0.15)" }}>

              {/* Banner */}
              <div className="relative h-36 overflow-hidden">
                <img src={bannerImage} alt="banner"
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))" }} />
                <div className="absolute inset-0"
                  style={{
                    backgroundImage: "linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }} />
                {provider.isVerified && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium backdrop-blur-sm"
                    style={{ background: "rgba(16,185,129,0.85)", color: "white" }}>
                    <Shield className="w-3.5 h-3.5" />
                    Verified Pro
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-end justify-between gap-4 -mt-16 mb-4">
                  {/* Avatar */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}>
                    <div className="relative">
                      {provider.user?.avatar ? (
                        <img src={provider.user.avatar} alt={provider.user.name}
                          className="w-24 h-24 rounded-2xl object-cover border-4 border-card shadow-xl" />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl border-4 border-card shadow-xl flex items-center justify-center text-3xl font-bold text-white"
                          style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                          {provider.user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-xl flex items-center justify-center border-2 border-card"
                        style={{ background: "#10b981" }}>
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Share button */}
                  <button
                    onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!") }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-emerald-500/40 transition-all">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* Name + details */}
                <h1 className="font-poppins font-bold text-2xl text-foreground mb-2">
                  {provider.user?.name}
                </h1>

                <div className="flex items-center gap-4 flex-wrap mb-4">
                  {provider.city && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" style={{ color: "#10b981" }} />
                      {provider.city}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" style={{ color: "#10b981" }} />
                    {provider.experience || 0} yrs experience
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" style={{ color: "#10b981" }} />
                    {provider.totalReviews || 0} completed
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { icon: Star, value: provider.rating?.toFixed(1) || "4.8", label: "Rating", color: "#f59e0b" },
                    { icon: Briefcase, value: services.length, label: "Services", color: "#3b82f6" },
                    { icon: TrendingUp, value: `${provider.totalReviews || 0}`, label: "Reviews", color: "#10b981" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={heroInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="text-center p-3 rounded-2xl border bg-secondary"
                      style={{ borderColor: `${stat.color}20` }}>
                      <stat.icon className="w-4 h-4 mx-auto mb-1" style={{ color: stat.color }} />
                      <p className="font-poppins font-bold text-foreground text-lg leading-none">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Rating distribution */}
                <div className="space-y-1.5">
                  {ratingDistribution.map(({ stars, count, pct }) => (
                    <div key={stars} className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 w-12 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">{stars}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      </div>
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: "linear-gradient(90deg, #f59e0b, #f97316)" }}
                          initial={{ width: 0 }}
                          animate={heroInView ? { width: `${pct}%` } : {}}
                          transition={{ duration: 0.8, delay: 0.5 }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2">
              {(["services", "reviews", "about"] as const).map(tab => (
                <button key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all border"
                  style={{
                    background: activeTab === tab ? "#10b981" : "var(--card)",
                    color: activeTab === tab ? "white" : "var(--text-secondary)",
                    borderColor: activeTab === tab ? "#10b981" : "var(--border)",
                  }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Services tab */}
            {activeTab === "services" && (
              <motion.div
                ref={servicesRef}
                initial={{ opacity: 0, y: 20 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                className="bg-card border border-border rounded-3xl p-6"
                style={{ borderColor: "rgba(16,185,129,0.1)" }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(16,185,129,0.1)" }}>
                    <Briefcase className="w-5 h-5" style={{ color: "#10b981" }} />
                  </div>
                  <h2 className="font-poppins font-semibold text-foreground text-lg">Services Offered</h2>
                </div>
                <div className="space-y-3">
                  {services.map((service: any, i: number) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setSelectedService(service.id)}
                      className="flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all"
                      style={{
                        borderColor: selectedService === service.id ? "#10b981" : "var(--border)",
                        background: selectedService === service.id ? "rgba(16,185,129,0.06)" : "var(--secondary)",
                        boxShadow: selectedService === service.id ? "0 0 0 1px rgba(16,185,129,0.3)" : "none",
                      }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{
                          background: selectedService === service.id ? "rgba(16,185,129,0.15)" : "var(--card)",
                          border: `1px solid ${selectedService === service.id ? "rgba(16,185,129,0.3)" : "var(--border)"}`,
                        }}>
                        {service.category?.icon || "🔧"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground text-sm">{service.title}</p>
                          {selectedService === service.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: "#10b981" }}>
                              <CheckCircle className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{service.description}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                          style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                          {service.category?.name}
                        </span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-poppins font-bold text-foreground text-lg">₹{service.price}</p>
                        <p className="text-xs text-muted-foreground">onwards</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews tab */}
            {activeTab === "reviews" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-3xl p-6"
                style={{ borderColor: "rgba(16,185,129,0.1)" }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(245,158,11,0.1)" }}>
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <h2 className="font-poppins font-semibold text-foreground text-lg">
                    Customer Reviews ({reviews.length})
                  </h2>
                </div>
                {reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-3">⭐</div>
                    <p className="font-medium text-foreground mb-1">No reviews yet</p>
                    <p className="text-sm text-muted-foreground">Be the first to book and review!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review: any, i: number) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-2xl border bg-secondary"
                        style={{ borderColor: "rgba(245,158,11,0.15)" }}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                              style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                              {review.user?.name?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{review.user?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(review.createdAt), "dd MMM yyyy")}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s}
                                className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            "{review.comment}"
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* About tab */}
            {activeTab === "about" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-3xl p-6"
                style={{ borderColor: "rgba(16,185,129,0.1)" }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(59,130,246,0.1)" }}>
                    <Award className="w-5 h-5" style={{ color: "#3b82f6" }} />
                  </div>
                  <h2 className="font-poppins font-semibold text-foreground text-lg">About Provider</h2>
                </div>
                <div className="space-y-4">
                  {provider.bio && (
                    <div className="p-4 rounded-2xl bg-secondary border border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed">{provider.bio}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: MapPin, label: "Location", value: provider.city || "Pune", color: "#10b981" },
                      { icon: Clock, label: "Experience", value: `${provider.experience || 0} years`, color: "#3b82f6" },
                      { icon: Star, label: "Rating", value: `${provider.rating?.toFixed(1) || "4.8"}/5`, color: "#f59e0b" },
                      { icon: Shield, label: "Status", value: provider.isVerified ? "Verified" : "Unverified", color: "#10b981" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-2xl border bg-secondary"
                        style={{ borderColor: `${item.color}20` }}>
                        <item.icon className="w-5 h-5 mb-2" style={{ color: item.color }} />
                        <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                        <p className="font-semibold text-foreground text-sm">{item.value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT — Booking widget */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24 bg-card border border-border rounded-3xl overflow-hidden"
              style={{ borderColor: "rgba(16,185,129,0.2)" }}>

              {/* Header */}
              <div className="p-5 border-b border-border"
                style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(15,118,110,0.06))" }}>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5" style={{ color: "#10b981" }} />
                  <h3 className="font-poppins font-semibold text-foreground">Book this provider</h3>
                </div>
                <p className="text-xs text-muted-foreground">Select a service and date to continue</p>
                {selectedServiceData && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 flex items-center justify-between px-3 py-2 rounded-xl"
                    style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{selectedServiceData.category?.icon}</span>
                      <span className="text-xs font-medium text-foreground truncate max-w-[120px]">
                        {selectedServiceData.title}
                      </span>
                    </div>
                    <span className="font-poppins font-bold text-sm" style={{ color: "#10b981" }}>
                      ₹{selectedServiceData.price}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Service selection */}
              {!selectedService && (
                <div className="p-4 border-b border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
                    Select a service
                  </p>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {services.map((s: any) => (
                      <button key={s.id}
                        onClick={() => setSelectedService(s.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs hover:border-emerald-500/40 transition-all bg-secondary">
                        <span className="flex items-center gap-2 font-medium text-foreground">
                          <span>{s.category?.icon}</span>
                          <span className="truncate max-w-[100px]">{s.title}</span>
                        </span>
                        <span className="font-bold" style={{ color: "#10b981" }}>₹{s.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Calendar */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="w-8 h-8 rounded-xl border border-border flex items-center justify-center hover:bg-accent transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <h4 className="font-poppins font-semibold text-foreground text-sm">
                    {format(currentMonth, "MMMM yyyy")}
                  </h4>
                  <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="w-8 h-8 rounded-xl border border-border flex items-center justify-center hover:bg-accent transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                    <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Days */}
                <div className="grid grid-cols-7 gap-0.5">
                  {Array(startDayOfWeek).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                  {days.map(day => {
                    const isPastDay = isBefore(day, today)
                    const isSelected = selectedDate && isSameDay(day, selectedDate)
                    const isTodayDay = isToday(day)

                    return (
                      <motion.button
                        key={day.toISOString()}
                        whileHover={!isPastDay ? { scale: 1.1 } : {}}
                        whileTap={!isPastDay ? { scale: 0.95 } : {}}
                        disabled={isPastDay}
                        onClick={() => !isPastDay && setSelectedDate(day)}
                        className="aspect-square flex items-center justify-center text-xs rounded-xl transition-all"
                        style={{
                          background: isSelected
                            ? "linear-gradient(135deg, #10b981, #0f766e)"
                            : isTodayDay
                            ? "rgba(16,185,129,0.12)"
                            : "transparent",
                          color: isSelected
                            ? "white"
                            : isPastDay
                            ? "var(--text-muted)"
                            : isTodayDay
                            ? "#10b981"
                            : "var(--text-primary)",
                          opacity: isPastDay ? 0.35 : 1,
                          cursor: isPastDay ? "not-allowed" : "pointer",
                          border: isTodayDay && !isSelected ? "1px solid rgba(16,185,129,0.4)" : "1px solid transparent",
                          fontWeight: isTodayDay || isSelected ? "600" : "normal",
                        }}>
                        {format(day, "d")}
                      </motion.button>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex gap-3 mt-3 justify-center">
                  {[
                    { color: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.4)", label: "Today" },
                    { color: "#10b981", border: "#10b981", label: "Selected" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-sm border"
                        style={{ background: item.color, borderColor: item.border }} />
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book button */}
              <div className="p-4 pt-0">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleBookNow}
                  className="w-full py-3.5 rounded-2xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-all"
                  style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                  <Calendar className="w-4 h-4" />
                  {selectedService && selectedDate
                    ? `Book for ${format(selectedDate, "dd MMM")}`
                    : "Select service & date"}
                </motion.button>

                {(!selectedService || !selectedDate) && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    {!selectedService ? "← Select a service first" : "← Pick a date to continue"}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Contact card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-3xl p-5">
              <h3 className="font-poppins font-semibold text-foreground mb-4 text-sm">
                Need help choosing?
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/#chatbot")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-emerald-500/40 hover:bg-accent transition-all text-left">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(16,185,129,0.1)" }}>
                    <MessageCircle className="w-4 h-4" style={{ color: "#10b981" }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Ask AI Assistant</p>
                    <p className="text-xs text-muted-foreground">Get recommendations</p>
                  </div>
                </button>
                <Link href="/services"
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border hover:border-emerald-500/40 hover:bg-accent transition-all text-left">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(59,130,246,0.1)" }}>
                    <Briefcase className="w-4 h-4" style={{ color: "#3b82f6" }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Browse Services</p>
                    <p className="text-xs text-muted-foreground">See all available services</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}