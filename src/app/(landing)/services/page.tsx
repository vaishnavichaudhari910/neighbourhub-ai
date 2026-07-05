"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useServices, ServiceFilters } from "@/hooks/use-services"
import { ServiceCard } from "@/features/services/service-card"
import { FiltersSidebar } from "@/features/services/filters-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const DEFAULT_FILTERS: ServiceFilters = {
  q: "", category: "", minPrice: 0,
  maxPrice: 99999, minRating: 0, city: "",
  sort: "rating", page: 1,
}

export default function ServicesPage() {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<ServiceFilters>({
    ...DEFAULT_FILTERS,
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "",
  })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(filters.q || "")

  const { data, isLoading, isFetching } = useServices(filters)
  const services = data?.data || []
  const pagination = data?.pagination

  const updateFilter = (update: Partial<ServiceFilters>) =>
    setFilters(f => ({ ...f, ...update, page: 1 }))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter({ q: searchInput })
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Page header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">
            Find Services
          </h1>
          <p className="text-muted-foreground mb-6">
            {pagination?.total || 0} verified services near you
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search electrician, plumber..."
                className="pl-10 h-11"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)} />
              {searchInput && (
                <button type="button"
                  onClick={() => { setSearchInput(""); updateFilter({ q: "" }) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Button type="submit" className="h-11 px-6"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
              Search
            </Button>
            <Button type="button" variant="outline" className="h-11 md:hidden"
              onClick={() => setMobileFiltersOpen(true)}>
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">

          {/* Desktop sidebar */}
          <div className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <FiltersSidebar
                filters={filters}
                onChange={updateFilter}
                onReset={() => setFilters(DEFAULT_FILTERS)} />
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border overflow-hidden">
                    <Skeleton className="h-1.5 w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-4 w-24" />
                      <div className="flex gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1.5 flex-1">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <div className="flex justify-between items-center pt-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-8 w-24 rounded-xl" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-poppins font-semibold text-foreground text-xl mb-2">No services found</h3>
                <p className="text-muted-foreground mb-4">Try changing your filters or search query</p>
                <Button variant="outline" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</Button>
              </div>
            ) : (
              <>
                {isFetching && (
                  <div className="text-center text-sm text-muted-foreground mb-4 animate-pulse">
                    Updating results...
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {services.map((service: any, i: number) => (
                    <ServiceCard key={service.id} service={service} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <Button variant="outline" size="sm"
                      disabled={filters.page === 1}
                      onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) - 1 }))}>
                      Previous
                    </Button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                      <Button key={i+1} size="sm"
                        variant={filters.page === i+1 ? "default" : "outline"}
                        onClick={() => setFilters(f => ({ ...f, page: i+1 }))}>
                        {i+1}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm"
                      disabled={!pagination.hasMore}
                      onClick={() => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }))}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}