"use client"

import { useState, useRef, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import {
  Search, SlidersHorizontal, X, Star, MapPin,
  Clock, ChevronDown, Grid3X3, List, Zap,
  CheckCircle, ArrowRight, Filter
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

const SORT_OPTIONS = [
  { label: "Top Rated", value: "rating" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
]

const SERVICE_IMAGES: Record<string, string> = {
  plumber: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=220&fit=crop&crop=face",
  electrician: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=220&fit=crop&crop=face",
  cleaning: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=220&fit=crop&crop=face",
  carpenter: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=220&fit=crop&crop=face",
  "ac-repair": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=220&fit=crop&crop=face",
  painter: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&h=220&fit=crop&crop=face",
  tutor: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=220&fit=crop&crop=face",
  default: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=220&fit=crop",
}

function ServiceCard({ service, index, view }: { service: any; index: number; view: "grid" | "list" }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const slug = service.category?.slug || "default"
  const image = SERVICE_IMAGES[slug] || SERVICE_IMAGES.default

  if (view === "list") {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: index * 0.05 }}
        whileHover={{ x: 4 }}
        className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-4 p-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
            <img src={image} alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://placehold.co/80x80/10b981/white?text=${service.category?.icon || "🔧"}`
              }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium mb-1 inline-block"
                  style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}>
                  {service.category?.icon} {service.category?.name}
                </span>
                <h3 className="font-poppins font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {service.provider?.user?.name} · {service.provider?.city || "Pune"}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-poppins font-bold text-foreground text-lg">₹{service.price}</p>
                <div className="flex items-center gap-1 justify-end">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium">{service.provider?.rating?.toFixed(1) || "4.8"}</span>
                </div>
              </div>
            </div>
          </div>
          <Link href={`/providers/${service.provider?.id}?service=${service.id}`}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
            Book Now <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group bg-card border border-border rounded-3xl overflow-hidden hover:border-emerald-500/30 hover:shadow-2xl transition-all duration-300 cursor-pointer">

      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={image} alt={service.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none"
          }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl text-xs font-medium backdrop-blur-sm border"
          style={{
            background: "rgba(0,0,0,0.4)",
            borderColor: "rgba(255,255,255,0.15)",
            color: "white",
          }}>
          {service.category?.icon} {service.category?.name}
        </div>

        {/* Verified badge */}
        {service.provider?.isVerified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-xl text-xs backdrop-blur-sm"
            style={{ background: "rgba(16,185,129,0.8)", color: "white" }}>
            <CheckCircle className="w-3 h-3" /> Verified
          </div>
        )}

        {/* Price on image */}
        <div className="absolute bottom-3 right-3">
          <div className="px-3 py-1.5 rounded-xl backdrop-blur-sm border text-white font-poppins font-bold text-sm"
            style={{ background: "rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.2)" }}>
            ₹{service.price}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-poppins font-semibold text-foreground text-base mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
          {service.title}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-xs">
            👤
          </div>
          <span className="text-xs text-muted-foreground">{service.provider?.user?.name}</span>
          {service.provider?.city && (
            <>
              <span className="text-muted-foreground">·</span>
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{service.provider.city}</span>
            </>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-foreground">
                {service.provider?.rating?.toFixed(1) || "4.8"}
              </span>
              <span className="text-xs text-muted-foreground">
                ({service.provider?.totalReviews || 0})
              </span>
            </div>
            {service.provider?.experience > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{service.provider.experience}y exp</span>
              </div>
            )}
          </div>

          <Link href={`/providers/${service.provider?.id}?service=${service.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white text-xs font-medium hover:opacity-90 active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
            Book <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-0.5 w-0 group-hover:w-full transition-all duration-500"
        style={{ background: "linear-gradient(90deg, #10b981, #0f766e)" }} />
    </motion.div>
  )
}

function ServicesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [search, setSearch] = useState(searchParams.get("q") || "")
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "")
  const [sort, setSort] = useState("rating")
  const [page, setPage] = useState(1)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [minRating, setMinRating] = useState(0)

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["services", search, activeCategory, sort, page, priceRange, minRating],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: search,
        category: activeCategory,
        sort,
        page: String(page),
        minPrice: String(priceRange[0]),
        maxPrice: String(priceRange[1]),
        minRating: String(minRating),
      })
      const res = await fetch(`/api/services?${params}`)
      return res.json()
    },
  })

  const services = data?.data || []
  const pagination = data?.pagination

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Hero header */}
      <div className="relative overflow-hidden pt-24 pb-12 px-4 sm:px-6"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(15,118,110,0.04) 50%, transparent 100%)",
        }}>

        {/* Animated bg dots */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full mb-4"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.2)",
              }}>
              <Zap className="w-3.5 h-3.5" />
              {pagination?.total || "450"}+ services available
            </motion.span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-bold text-foreground mb-3">
              Find the perfect
              <span className="block"
                style={{
                  background: "linear-gradient(135deg, #10b981, #0f766e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                service provider.
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Browse verified local professionals. Filter by category, price, and rating.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto">
            <div className="flex gap-2 p-2 rounded-2xl border bg-card shadow-lg"
              style={{ borderColor: "rgba(16,185,129,0.2)" }}>
              <div className="flex items-center gap-3 flex-1 px-3">
                <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search plumber, electrician, cleaner..."
                  className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm py-1"
                />
                {search && (
                  <button type="button" onClick={() => setSearch("")}>
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>
              <button type="submit"
                className="px-5 py-2.5 rounded-xl text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
                <Search className="w-4 h-4" />
                <span className="hidden sm:block">Search</span>
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">

        {/* Category pills */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              onClick={() => { setActiveCategory(cat.slug); setPage(1) }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border whitespace-nowrap flex-shrink-0"
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
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {isFetching ? "Updating..." : `${pagination?.total || 0} services found`}
            </span>
            {(search || activeCategory || minRating > 0) && (
              <button
                onClick={() => { setSearch(""); setActiveCategory(""); setMinRating(0); setPage(1) }}
                className="text-xs px-2 py-1 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                Clear filters ×
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all",
                showFilters
                  ? "text-white border-emerald-500"
                  : "text-muted-foreground border-border hover:border-emerald-500/40"
              )}
              style={showFilters ? { background: "linear-gradient(135deg, #10b981, #0f766e)" } : {}}>
              <Filter className="w-4 h-4" />
              <span className="hidden sm:block">Filters</span>
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm border border-border bg-card text-foreground outline-none cursor-pointer hover:border-emerald-500/40 transition-colors">
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <button onClick={() => setView("grid")}
                className={cn("p-2 transition-colors", view === "grid" ? "text-white" : "text-muted-foreground hover:text-foreground")}
                style={view === "grid" ? { background: "linear-gradient(135deg, #10b981, #0f766e)" } : {}}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setView("list")}
                className={cn("p-2 transition-colors", view === "list" ? "text-white" : "text-muted-foreground hover:text-foreground")}
                style={view === "list" ? { background: "linear-gradient(135deg, #10b981, #0f766e)" } : {}}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden">
              <div className="p-5 rounded-2xl border bg-card"
                style={{ borderColor: "rgba(16,185,129,0.15)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Price range */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Price range: ₹{priceRange[0]} — ₹{priceRange[1]}
                    </label>
                    <input type="range" min={0} max={5000} step={100}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([0, Number(e.target.value)])}
                      className="w-full accent-emerald-500" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>₹0</span><span>₹5000</span>
                    </div>
                  </div>

                  {/* Min rating */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">
                      Minimum rating
                    </label>
                    <div className="flex gap-2">
                      {[0, 3, 4, 4.5].map(r => (
                        <button key={r}
                          onClick={() => setMinRating(r)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs border transition-all"
                          style={{
                            background: minRating === r ? "rgba(16,185,129,0.1)" : "var(--card)",
                            borderColor: minRating === r ? "#10b981" : "var(--border)",
                            color: minRating === r ? "#10b981" : "var(--text-secondary)",
                          }}>
                          {r === 0 ? "Any" : <><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{r}+</>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick filters */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-3 block">Quick filters</label>
                    <div className="flex gap-2 flex-wrap">
                      {["Verified only", "Top rated", "Affordable"].map(f => (
                        <span key={f}
                          className="text-xs px-3 py-1.5 rounded-xl border border-border bg-secondary text-muted-foreground cursor-pointer hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Services grid/list */}
        {isLoading ? (
          <div className={view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            : "space-y-4"}>
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className={view === "grid" ? "rounded-3xl overflow-hidden border border-border" : "rounded-2xl border border-border h-24"}>
                {view === "grid" && <Skeleton className="h-44 w-full" />}
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-8 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 rounded-3xl border bg-card"
            style={{ borderColor: "rgba(16,185,129,0.1)" }}>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-poppins font-semibold text-foreground text-xl mb-2">No services found</h3>
            <p className="text-muted-foreground mb-6">Try changing your filters or search for something else</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory(""); setMinRating(0) }}
              className="px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
              style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
              Clear all filters
            </button>
          </motion.div>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${view}-${activeCategory}-${sort}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  : "space-y-4"}>
                {services.map((service: any, i: number) => (
                  <ServiceCard key={service.id} service={service} index={i} view={view} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center gap-2 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 hover:border-emerald-500/40 transition-colors">
                  ← Previous
                </button>
                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button key={p}
                    onClick={() => setPage(p)}
                    className="w-10 h-10 rounded-xl text-sm font-medium transition-all border"
                    style={{
                      background: page === p ? "linear-gradient(135deg, #10b981, #0f766e)" : "var(--card)",
                      color: page === p ? "white" : "var(--text-secondary)",
                      borderColor: page === p ? "#10b981" : "var(--border)",
                    }}>
                    {p}
                  </button>
                ))}
                <button
                  disabled={!pagination.hasMore}
                  onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 rounded-xl border border-border text-sm font-medium disabled:opacity-40 hover:border-emerald-500/40 transition-colors">
                  Next →
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse"
            style={{ background: "rgba(16,185,129,0.2)" }}>
            🔍
          </div>
          <p className="text-muted-foreground animate-pulse">Loading services...</p>
        </div>
      </div>
    }>
      <ServicesContent />
    </Suspense>
  )
}