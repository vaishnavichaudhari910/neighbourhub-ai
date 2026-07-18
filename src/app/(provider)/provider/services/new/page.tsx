"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowLeft, Loader2, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const schema = z.object({
  title: z.string().min(3, "Min 3 characters"),
  description: z.string().min(10, "Min 10 characters"),
  price: z.coerce.number().positive("Must be positive"),
  categoryId: z.string().min(1, "Select a category"),
})
type FormData = z.infer<typeof schema>

export default function NewServicePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
  })
  const categories = catData?.data || []

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/provider/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        toast.success("Service created successfully!")
        router.push("/provider/services")
      } else {
        toast.error(json.error)
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 pt-20 lg:pt-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/provider/services"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to services
        </Link>
        <h1 className="text-2xl font-poppins font-bold text-foreground mb-1">Add new service</h1>
        <p className="text-muted-foreground text-sm mb-8">Fill in the details to list your service</p>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-6 space-y-5">

          {/* Category */}
          <div>
            <Label>Category *</Label>
            <select {...register("categoryId")}
              className="mt-1 w-full h-11 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Select a category...</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="text-destructive text-xs mt-1">{errors.categoryId.message}</p>}
          </div>

          {/* Title */}
          <div>
            <Label>Service title *</Label>
            <Input className="mt-1 h-11"
              placeholder="e.g. Home Electrical Wiring Repair"
              {...register("title")} />
            {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label>Description *</Label>
            <textarea {...register("description")} rows={4}
              placeholder="Describe what's included in this service, tools used, time required..."
              className="mt-1 w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
          </div>

          {/* Price */}
          <div>
            <Label>Starting price (₹) *</Label>
            <div className="relative mt-1">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="number" className="pl-10 h-11"
                placeholder="299" min="1" {...register("price")} />
            </div>
            {errors.price && <p className="text-destructive text-xs mt-1">{errors.price.message}</p>}
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" className="flex-1"
              onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" className="flex-1"
              disabled={isSubmitting}
              style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create service"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}