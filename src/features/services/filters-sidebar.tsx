"use client"

import { useCategories } from "@/hooks/use-services"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface FilterProps {
  filters: any
  onChange: (f: any) => void
  onReset: () => void
}

const ratings = [
  { label: "4.5+ ★", value: 4.5 },
  { label: "4.0+ ★", value: 4.0 },
  { label: "3.5+ ★", value: 3.5 },
]

const sortOptions = [
  { label: "Top Rated", value: "rating" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
]

export function FiltersSidebar({ filters, onChange, onReset }: FilterProps) {
  const { data: catData } = useCategories()
  const categories = catData?.data || []

  return (
    <aside className="w-full space-y-6">
      {/* Sort */}
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Sort by</Label>
        <div className="space-y-1">
          {sortOptions.map(opt => (
            <button key={opt.value}
              onClick={() => onChange({ sort: opt.value })}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                filters.sort === opt.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Categories */}
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Category</Label>
        <div className="space-y-1">
          <button
            onClick={() => onChange({ category: "" })}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
              !filters.category ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent"
            )}>
            All Categories
          </button>
          {categories.map((cat: any) => (
            <button key={cat.id}
              onClick={() => onChange({ category: cat.slug })}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between",
                filters.category === cat.slug
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent"
              )}>
              <span>{cat.icon} {cat.name}</span>
              <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">{cat._count.services}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Price range */}
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Price Range (₹)</Label>
        <div className="flex gap-2">
          <Input type="number" placeholder="Min" className="h-9 text-sm"
            value={filters.minPrice || ""}
            onChange={e => onChange({ minPrice: Number(e.target.value) || 0 })} />
          <Input type="number" placeholder="Max" className="h-9 text-sm"
            value={filters.maxPrice === 99999 ? "" : filters.maxPrice || ""}
            onChange={e => onChange({ maxPrice: Number(e.target.value) || 99999 })} />
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Rating */}
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">Min Rating</Label>
        <div className="space-y-1">
          <button
            onClick={() => onChange({ minRating: 0 })}
            className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
              !filters.minRating ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent")}>
            Any Rating
          </button>
          {ratings.map(r => (
            <button key={r.value}
              onClick={() => onChange({ minRating: r.value })}
              className={cn("w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                filters.minRating === r.value ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-accent")}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-border" />

      {/* City */}
      <div>
        <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-3 block">City</Label>
        <Input placeholder="e.g. Pune" className="h-9 text-sm"
          value={filters.city || ""}
          onChange={e => onChange({ city: e.target.value })} />
      </div>

      <Button variant="outline" className="w-full" onClick={onReset}>Reset filters</Button>
    </aside>
  )
}