"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { format } from "date-fns"
import {
  Clock, MapPin, CreditCard, CheckCircle,
  ChevronRight, ChevronLeft, Loader2, Tag
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const TIME_SLOTS = [
  "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM",
  "05:00 PM", "06:00 PM",
]

const COUPONS: Record<string, number> = {
  SAVE10: 10,
  FIRST20: 20,
  NH50: 50,
}

const addressSchema = z.object({
  line1: z.string().min(5, "Enter full address"),
  city: z.string().min(2, "Enter city"),
  pincode: z.string().length(6, "Enter valid 6-digit pincode"),
  landmark: z.string().optional(),
})
type AddressForm = z.infer<typeof addressSchema>

const STEPS = [
  { id: 1, label: "Time", icon: Clock },
  { id: 2, label: "Address", icon: MapPin },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Confirmed", icon: CheckCircle },
]

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const serviceId = searchParams.get("serviceId") || ""
  const dateParam = searchParams.get("date") || ""

  const [step, setStep] = useState(1)
  const [selectedTime, setSelectedTime] = useState("")
  const [address, setAddress] = useState<AddressForm | null>(null)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null)

  const { data: serviceData } = useQuery({
    queryKey: ["service-booking", serviceId],
    queryFn: async () => {
      const res = await fetch(`/api/services/${serviceId}`)
      if (!res.ok) throw new Error("Not found")
      return res.json()
    },
    enabled: !!serviceId,
  })

  const service = serviceData?.data
  const basePrice = service?.price || 0
  const discountAmt = Math.floor(basePrice * discount / 100)
  const tax = Math.floor((basePrice - discountAmt) * 0.18)
  const total = basePrice - discountAmt + tax

  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  })

  const applyCoupon = () => {
    const disc = COUPONS[couponCode.toUpperCase()]
    if (disc) {
      setDiscount(disc)
      toast.success(`Coupon applied! ${disc}% off`)
    } else {
      toast.error("Invalid coupon code")
    }
  }

  const handleAddressSubmit = (data: AddressForm) => {
    setAddress(data)
    setStep(3)
  }

  const handleConfirmBooking = async () => {
    if (!address) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          date: dateParam,
          time: selectedTime,
          address: `${address.line1}, ${address.city} - ${address.pincode}${address.landmark ? `, Near ${address.landmark}` : ""}`,
          amount: total,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        toast.error(json.error)
      } else {
        setConfirmedBooking(json.data)
        setStep(4)
        toast.success("Booking confirmed! 🎉")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedDate = dateParam ? new Date(dateParam) : null

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {step < 4 && (
          <div className="flex items-center justify-between mb-8 mt-6">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  step === s.id && "text-white",
                  step > s.id && "text-primary",
                  step < s.id && "text-muted-foreground",
                )}
                  style={step === s.id ? { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" } : {}}>
                  <s.icon className="w-4 h-4" />
                  <span className="hidden sm:block">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={cn("h-px w-8 mx-1",
                    step > s.id ? "bg-primary" : "bg-border")} />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="bg-card border border-border rounded-2xl p-6 mb-4">
                <h2 className="font-poppins font-bold text-xl text-foreground mb-1">
                  Choose a time slot
                </h2>
                {selectedDate && (
                  <p className="text-muted-foreground text-sm mb-6">
                    📅 {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TIME_SLOTS.map(slot => (
                    <button key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={cn(
                        "p-3 rounded-xl border text-sm font-medium transition-all",
                        selectedTime === slot
                          ? "border-primary text-white"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      )}
                      style={selectedTime === slot ? {
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                      } : {}}>
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
              {service && (
                <div className="bg-card border border-border rounded-2xl p-4 mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Service</p>
                    <p className="font-medium text-foreground">{service.title}</p>
                    <p className="text-xs text-muted-foreground">by {service.provider?.user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-poppins font-bold text-foreground text-lg">₹{service.price}</p>
                  </div>
                </div>
              )}
              <Button className="w-full h-11 gap-2"
                disabled={!selectedTime}
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                onClick={() => setStep(2)}>
                Continue <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="font-poppins font-bold text-xl text-foreground mb-6">
                  Service address
                </h2>
                <form onSubmit={handleSubmit(handleAddressSubmit)} className="space-y-4">
                  <div>
                    <Label>Address Line 1</Label>
                    <Input className="mt-1 h-11" placeholder="House no., Street, Area" {...register("line1")} />
                    {errors.line1 && <p className="text-destructive text-xs mt-1">{errors.line1.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>City</Label>
                      <Input className="mt-1 h-11" placeholder="Pune" {...register("city")} />
                      {errors.city && <p className="text-destructive text-xs mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <Label>Pincode</Label>
                      <Input className="mt-1 h-11" placeholder="411001" maxLength={6} {...register("pincode")} />
                      {errors.pincode && <p className="text-destructive text-xs mt-1">{errors.pincode.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Label>Landmark <span className="text-muted-foreground text-xs">(optional)</span></Label>
                    <Input className="mt-1 h-11" placeholder="Near hospital, school..." {...register("landmark")} />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="flex-1 gap-2" onClick={() => setStep(1)}>
                      <ChevronLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button type="submit" className="flex-1 gap-2"
                      style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                      Continue <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h2 className="font-poppins font-bold text-xl text-foreground mb-4">Order summary</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{service?.title}</span>
                      <span className="font-medium">₹{basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        📅 {selectedDate ? format(selectedDate, "dd MMM") : ""} at {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">📍 {address?.city}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({discount}%)</span>
                        <span>-₹{discountAmt}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (18%)</span>
                      <span>₹{tax}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-poppins font-bold text-foreground text-base">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                  <Label className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-primary" /> Apply coupon
                  </Label>
                  <div className="flex gap-2">
                    <Input placeholder="Try SAVE10, FIRST20, NH50"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="h-10 flex-1" />
                    <Button variant="outline" onClick={applyCoupon} className="h-10">Apply</Button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-5">
                  <Label className="mb-3 block">Payment method</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "upi", label: "UPI", icon: "📱" },
                      { id: "card", label: "Card", icon: "💳" },
                      { id: "cash", label: "Cash", icon: "💵" },
                    ].map(pm => (
                      <button key={pm.id}
                        onClick={() => setPaymentMethod(pm.id)}
                        className={cn(
                          "p-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1",
                          paymentMethod === pm.id
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        )}>
                        <span className="text-xl">{pm.icon}</span>
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => setStep(2)}>
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>
                  <Button className="flex-1 gap-2 h-11"
                    style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                    onClick={handleConfirmBooking}
                    disabled={isSubmitting}>
                    {isSubmitting
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <>Confirm & Pay ₹{total} <ChevronRight className="w-4 h-4" /></>}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-8">
              <motion.div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}>
                <CheckCircle className="w-12 h-12 text-white" />
              </motion.div>
              <motion.h2
                className="text-2xl font-poppins font-bold text-foreground mb-2"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                Booking Confirmed! 🎉
              </motion.h2>
              <motion.p className="text-muted-foreground mb-8"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                Your booking ID: <span className="font-mono font-bold text-primary">
                  #{confirmedBooking?.id?.slice(-8).toUpperCase()}
                </span>
              </motion.p>
              <motion.div className="bg-card border border-border rounded-2xl p-6 text-left mb-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}>
                <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
                <div className="space-y-4">
                  {[
                    { emoji: "✅", title: "Booking received", desc: "Your booking has been placed successfully", done: true },
                    { emoji: "📞", title: "Provider confirmation", desc: "Provider will confirm within 30 minutes", done: false },
                    { emoji: "🚗", title: "Provider on the way", desc: "Track live location on booking day", done: false },
                    { emoji: "⭐", title: "Rate your experience", desc: "Help others by leaving a review", done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0",
                        item.done ? "bg-green-100 dark:bg-green-900/30" : "bg-secondary"
                      )}>{item.emoji}</div>
                      <div>
                        <p className={cn("font-medium text-sm", item.done ? "text-green-600" : "text-foreground")}>
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => router.push("/services")}>
                  Book another
                </Button>
                <Button className="flex-1"
                  style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                  onClick={() => router.push("/dashboard")}>
                  View bookings
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading booking...</div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}