import { useQuery } from "@tanstack/react-query"

export interface ServiceFilters {
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  city?: string
  sort?: string
  page?: number
}

async function fetchServices(filters: ServiceFilters) {
  const params = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== "" && v !== 0) params.set(k, String(v))
  })
  const res = await fetch(`/api/services?${params}`)
  if (!res.ok) throw new Error("Failed to fetch services")
  return res.json()
}

async function fetchCategories() {
  const res = await fetch("/api/categories")
  if (!res.ok) throw new Error("Failed to fetch categories")
  return res.json()
}

export function useServices(filters: ServiceFilters) {
  return useQuery({
    queryKey: ["services", filters],
    queryFn: () => fetchServices(filters),
    staleTime: 30_000,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60_000,
  })
}