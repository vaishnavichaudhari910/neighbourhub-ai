"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

// Interactive star rating — for input
export function StarRatingInput({
  value,
  onChange,
  size = "md",
}: {
  value: number
  onChange: (rating: number) => void
  size?: "sm" | "md" | "lg"
}) {
  const [hovered, setHovered] = useState(0)
  const sizeMap = { sm: "w-4 h-4", md: "w-7 h-7", lg: "w-9 h-9" }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110">
          <Star
            className={cn(sizeMap[size], "transition-colors",
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )} />
        </button>
      ))}
    </div>
  )
}

// Display only stars — for provider profile
export function StarRatingDisplay({
  rating,
  count,
  size = "sm",
}: {
  rating: number
  count?: number
  size?: "sm" | "md"
}) {
  const sizeMap = { sm: "w-3.5 h-3.5", md: "w-5 h-5" }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star}
          className={cn(sizeMap[size],
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground"
          )} />
      ))}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">
          {rating.toFixed(1)} ({count})
        </span>
      )}
    </div>
  )
}