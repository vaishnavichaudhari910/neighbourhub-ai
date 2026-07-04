"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Mail, Lock, User, Phone } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  role: z.enum(["CITIZEN", "PROVIDER"]),
})
type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "CITIZEN" },
  })

  const selectedRole = watch("role")

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!json.success) {
        toast.error(json.error)
      } else {
        toast.success("Account created! Please sign in.")
        router.push("/login")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-6">
        <h2 className="text-2xl font-poppins font-bold text-foreground mb-1">Create account</h2>
        <p className="text-muted-foreground text-sm">Join NeighbourHub AI today</p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {(["CITIZEN", "PROVIDER"] as const).map(role => (
          <button key={role} type="button" onClick={() => setValue("role", role)}
            className={cn(
              "p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200",
              selectedRole === role
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            )}>
            {role === "CITIZEN" ? "👤 I need services" : "🔧 I provide services"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Full name</Label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="name" placeholder="Your full name"
              className="pl-10 h-11" {...register("name")} />
          </div>
          {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@example.com"
              className="pl-10 h-11" {...register("email")} />
          </div>
          {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone <span className="text-muted-foreground text-xs">(optional)</span></Label>
          <div className="relative mt-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="phone" type="tel" placeholder="9876543210"
              className="pl-10 h-11" {...register("phone")} />
          </div>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="password" type={showPassword ? "text" : "password"}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              className="pl-10 pr-10 h-11" {...register("password")} />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="w-full h-11 mt-2"
          style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
          disabled={isLoading}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </motion.div>
  )
}