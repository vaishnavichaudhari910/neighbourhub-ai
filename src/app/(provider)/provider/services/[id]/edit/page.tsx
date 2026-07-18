"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { ArrowLeft, Loader2, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().positive(),
  categoryId: z.string().min(1),
})
type FormData = z.infer<typeof schema>

export default function EditServicePage() {
  const { id } = useParams()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: catData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await fetch("/api/categories")).json(),
  })

  const { data: svcData, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => (await fetch(`/api/services/${id}`)).json(),
  })

  const service = svcData?.data
  const categories = catData?.data || []

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: service ? {
      title: service.title,
      description: service.description,
      price: service.price,
      categoryId: service.categoryId,
    } : undefined,
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/provider/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (json.success) {
        toast.success("Service updated!")
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

  if (isLoading) {
    return (
      <div className="p-6 pt-20 lg:pt-8 max-w-2xl space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="p-6 pt-20 lg:pt-8 max-w-2xl">
      <Link href="/provider/services"
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to services
      </Link>
      <h1 className="text-2xl font-poppins font-bold text-foreground mb-1">Edit service</h1>
      <p className="text-muted-foreground text-sm mb-8">Update your service details</p>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <div>
          <Label>Category *</Label>
          <select {...register("categoryId")}
            className="mt-1 w-full h-11 px-3 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Service title *</Label>
          <Input className="mt-1 h-11" {...register("title")} />
          {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <Label>Description *</Label>
          <textarea {...register("description")} rows={4}
            className="mt-1 w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <Label>Price (₹) *</Label>
          <div className="relative mt-1">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="number" className="pl-10 h-11" min="1" {...register("price")} />
          </div>
          {errors.price && <p className="text-destructive text-xs mt-1">{errors.price.message}</p>}
        </div>
        <div className="pt-2 flex gap-3">
          <Button type="button" variant="outline" className="flex-1"
            onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}
            style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}>
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}