"use client"

import { useState, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, useInView } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import {
  Search, MapPin, Star, Shield, Clock,
  ChevronDown, Filter, Users, Zap,
  CheckCircle, ArrowRight, Briefcase, X
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

const CATEGORIES = [
  { name: "All", icon: "✨", slug: "" },
  { name: "Plumber", icon: "🔧", slug: "plumber" },
  { name: "Electrician", icon: "⚡", slug: "electrician" },
  { name: "Cleaning", icon: "🧹", slug: "cleaning" },
  { name: "Carpenter", icon: "🪚", slug: "carpenter" },
  { name: "AC Repair", icon: "❄️", slug: "ac-repair" },
  { name: "Painter", icon: "🎨", slug: "painter" },
  { name: "Pest Control", icon: "🐛", slug: "pest-control" },
  { name: "Tutor", icon: "📚", slug: "tutor" },
]

const PROVIDER_IMAGES = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
]

const STATS = [
  { value: "450+", label: "Verified Providers", icon: "✅" },
  { value: "4.8/5", label: "Average Rating", icon: "⭐" },
  { value: "15min", label: "Avg Response", icon: "⚡" },
  { value: "98%", label: "Satisfaction", icon: "💚" },
]

function ProviderCard({ provider, index }: { provider: any; index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const avatarUrl = PROVIDER_IMAGES[index % PROVIDER_IMAGES.length]
  const services = provider.services || []
  const topService = services[0]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group bg-card border border-border rounded-3xl overflow-hidden hover:border-emerald-500/30 hover:shadow-2xl transition-all duration-300">

      {/* Top banner */}
      <div className="h-20 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, 
            hsl(${(index * 47) % 360}, 60%, 25%) 0%, 
            hsl(${(index * 47 + 60) % 360}, 50%, 20%) 100%)`,
        }}>
        <div className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
        {provider.isVerified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-medium backdrop-blur-sm"
            style={{ background: "rgba(16,185,129,0.8)", color: "white" }}>
            <Shield className="w-3 h-3" /> Verified
          </div>
        )}
      </div>

      <div className="px-5 pb-5">
        {/* Avatar */}
        <div className="relative -mt-8 mb-3">
          <img
            src={avatarUrl}
            alt={provider.user?.name}
            className="w-16 h-16 rounded-2xl object-cover border-4 border-card shadow-lg"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card"
            style={{ background: "#10b981" }} />
        </div>

        {/* Info */}
        <h3 className="font-poppins font-semibold text-foreground text-lg mb-0.5 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {provider.user?.name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{provider.city || "Pune, Maharashtra"}</span>
          {provider.experience > 0 && (
            <>
              <span className="text-muted-foreground">·</span>
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{provider.experience}y exp</span>
            </>
          )}
        </div>

        {/* Services */}
        {services.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {services.slice(0, 3).map((s: any) => (
              <span key={s.id}
                className="text-xs px-2.5 py-1 rounded-xl border font-medium"
                style={{
                  background: "rgba(16,185,129,0.06)",
                  borderColor: "rgba(16,185,129,0.2)",
                  color: "#10b981",
                }}>
                {s.category?.icon} {s.category?.name}
              </span>
            ))}
            {services.length > 3 && (
              <span className="text-xs px-2.5 py-1 rounded-xl border border-border text-muted-foreground">
                +{services.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bio */}
        {provider.bio && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
            {provider.bio}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 py-3 border-y border-border mb-4">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-poppins font-bold text-foreground text-sm">
              {provider.rating?.toFixed(1) || "4.8"}
            </span>
            <span className="text-xs text-muted-foreground">
              ({provider.totalReviews || 0} reviews)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {services.length} service{services.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            {topService && (
              <>
                <p className="text-xs text-muted-foreground">Starting at</p>
                <p className="font-poppins font-bold text-foreground text-lg">
                  ₹{topService.price}
                </p>
              </>
            )}
          </div>
          <Link
            href={`/providers/${provider.id}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium hover:opacity-90 active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
            View Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ background: "linear-gradient(90deg, #10b981, #0f766e)" }} />
    </motion.div>
  )
}

function ProvidersContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.get("q") || "")
  const [activeCategory, setActiveCategory] = useState("")
  const [city, setCity] = useState("")
  const [minRating, setMinRating] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })

  const { data, isLoading } = useQuery({
    queryKey: ["providers-list", search, activeCategory, city, minRating],
    queryFn: async () => {
      const res = await fetch("/api/providers")
      return res.json()
    },
  })

  const allProviders = data?.data || []

  // Client-side filter
  const filtered = allProviders.filter((p: any) => {
    const nameMatch = !search || p.user?.name?.toLowerCase().includes(search.toLowerCase())
    const cityMatch = !city || p.city?.toLowerCase().includes(city.toLowerCase())
    const ratingMatch = !minRating || (p.rating || 0) >= minRating
    const catMatch = !activeCategory || p.services?.some((s: any) => s.category?.slug === activeCategory)
    return nameMatch && cityMatch && ratingMatch && catMatch
  })

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section ref={heroRef}
        className="relative pt-24 pb-14 px-4 sm:px-6 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(15,118,110,0.04) 50%, transparent 100%)",
        }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(16,185,129,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

        <motion.div className="absolute w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", top: 0, right: "10%" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }} />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}>

            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-5"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.2)",
              }}>
              <Users className="w-3.5 h-3.5" />
              {allProviders.length || "450"}+ Verified Providers
            </motion.span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-foreground mb-4">
              Meet your trusted
              <span className="block mt-1"
                style={{
                  background: "linear-gradient(135deg, #10b981, #0f766e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                local professionals.
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every provider is verified, rated by real customers,
              and ready to serve your neighbourhood.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center p-3 rounded-2xl border bg-card"
                style={{ borderColor: "rgba(16,185,129,0.15)" }}>
                <div className="text-xl mb-1">{stat.icon}</div>
                <p className="font-poppins font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex gap-2 p-1.5 rounded-2xl border bg-card shadow-lg flex-1"
              style={{ borderColor: "rgba(16,185,129,0.2)" }}>
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search providers by name..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none py-1"
                />
                {search && (
                  <button onClick={() => setSearch("")}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              <button
                className="px-4 py-2 rounded-xl text-white text-sm font-medium flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              onClick={() => setActiveCategory(cat.slug)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all border whitespace-nowrap flex-shrink-0"
              style={{
                background: activeCategory === cat.slug ? "#10b981" : "var(--card)",
                color: activeCategory === cat.slug ? "white" : "var(--text-secondary)",
                borderColor: activeCategory === cat.slug ? "#10b981" : "var(--border)",
                boxShadow: activeCategory === cat.slug ? "0 4px 12px rgba(16,185,129,0.3)" : "none",
              }}>
              <span>{cat.icon}</span>
              {cat.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <p className="text-sm text-muted-foreground">
            {filtered.length} providers found
            {activeCategory && ` in ${CATEGORIES.find(c => c.slug === activeCategory)?.name}`}
          </p>
          <div className="flex items-center gap-2">
            {/* City filter */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City..."
                className="pl-8 pr-3 py-2 rounded-xl text-sm border border-border bg-card text-foreground outline-none w-28 focus:border-emerald-500/40 transition-colors placeholder:text-muted-foreground"
              />
            </div>

            {/* Rating filter */}
            <div className="relative">
              <select
                value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm border border-border bg-card text-foreground outline-none cursor-pointer hover:border-emerald-500/40 transition-colors">
                <option value={0}>Any Rating</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Clear */}
            {(search || activeCategory || city || minRating > 0) && (
              <button
                onClick={() => { setSearch(""); setActiveCategory(""); setCity(""); setMinRating(0) }}
                className="text-xs px-3 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                Clear ×
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="rounded-3xl border border-border overflow-hidden">
                <Skeleton className="h-20 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 rounded-3xl border bg-card"
            style={{ borderColor: "rgba(16,185,129,0.1)" }}>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-poppins font-semibold text-foreground text-xl mb-2">
              No providers found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try changing your filters or search query
            </p>
            <button
              onClick={() => { setSearch(""); setActiveCategory(""); setCity(""); setMinRating(0) }}
              className="px-6 py-3 rounded-xl text-white font-medium"
              style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
              Clear filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((provider: any, i: number) => (
              <ProviderCard key={provider.id} provider={provider} index={i} />
            ))}
          </div>
        )}

        {/* Join as provider CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-10 rounded-3xl border relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(16,185,129,0.06), rgba(15,118,110,0.04))",
            borderColor: "rgba(16,185,129,0.2)",
          }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-64 h-64 rounded-full -top-20 -right-20"
              style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)" }} />
            <div className="absolute w-48 h-48 rounded-full -bottom-10 -left-10"
              style={{ background: "radial-gradient(circle, rgba(15,118,110,0.08) 0%, transparent 70%)" }} />
          </div>
          <div className="relative z-10">
            <div className="text-4xl mb-4">🔧</div>
            <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-foreground mb-3">
              Are you a service professional?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              Join 450+ verified providers on NeighbourHub AI.
              Manage bookings, track earnings, and grow your business.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                Join as Provider <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium border border-border hover:border-emerald-500/40 hover:bg-accent transition-all text-foreground">
                Learn more
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function ProvidersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse"
            style={{ background: "rgba(16,185,129,0.2)" }}>
            👥
          </div>
          <p className="text-muted-foreground animate-pulse">Loading providers...</p>
        </div>
      </div>
    }>
      <ProvidersContent />
    </Suspense>
  )
}