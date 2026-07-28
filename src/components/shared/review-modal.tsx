"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StarRatingInput } from "@/components/shared/star-rating"

const RATING_LABELS: Record<number, string> = {
  1: "Poor 😞",
  2: "Fair 😐",
  3: "Good 🙂",
  4: "Very Good 😊",
  5: "Excellent 🌟",
}

export function ReviewModal({
  booking,
  onClose,
}: {
  booking: any
  onClose: () => void
}) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          rating,
          comment,
        }),
      })
      return res.json()
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Review submitted! Thank you 🌟")
        queryClient.invalidateQueries({ queryKey: ["my-bookings"] })
        onClose()
      } else {
        toast.error(data.error)
      }
    },
  })

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-poppins font-semibold text-foreground">
              Rate your experience
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {booking.service?.title} · by {booking.service?.provider?.user?.name}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Star rating */}
        <div className="text-center mb-5">
          <div className="flex justify-center mb-2">
            <StarRatingInput value={rating} onChange={setRating} size="lg" />
          </div>
          {rating > 0 && (
            <p className="text-sm font-medium text-foreground">
              {RATING_LABELS[rating]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-5">
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Share your experience (optional)..."
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Skip
          </Button>
          <Button
            className="flex-1"
            disabled={rating === 0 || mutation.isPending}
            style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
            onClick={() => mutation.mutate()}>
            {mutation.isPending
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : "Submit Review ⭐"}
          </Button>
        </div>
      </div>
    </div>
  )
}