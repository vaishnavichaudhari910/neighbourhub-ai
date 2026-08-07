"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight,
  MapPin, Loader2, CheckCircle, Briefcase, Users
} from "lucide-react"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter valid email"),
  password: z.string()
    .min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Must have uppercase")
    .regex(/[0-9]/, "Must have number"),
  role: z.enum(["CITIZEN", "PROVIDER"]),
})
type FormData = z.infer<typeof schema>

const FLOATING_ICONS = [
  { icon: "🔧", x: "8%", y: "20%", delay: 0 },
  { icon: "⚡", x: "88%", y: "12%", delay: 0.6 },
  { icon: "🧹", x: "80%", y: "70%", delay: 1.1 },
  { icon: "🪚", x: "12%", y: "75%", delay: 1.6 },
  { icon: "❄️", x: "92%", y: "40%", delay: 0.9 },
  { icon: "🎨", x: "4%", y: "55%", delay: 1.3 },
  { icon: "🏠", x: "55%", y: "88%", delay: 0.4 },
  { icon: "📚", x: "45%", y: "5%", delay: 1.9 },
]

const ROLE_BENEFITS = {
  CITIZEN: [
    "Book verified local services instantly",
    "Track booking status in real-time",
    "Leave reviews after service completion",
    "AI chatbot in English, Hindi & Marathi",
  ],
  PROVIDER: [
    "Create and manage your service listings",
    "Accept or reject booking requests",
    "Track your earnings and reviews",
    "Grow your business with AI recommendations",
  ],
}

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
]

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "CITIZEN" },
  })

  const selectedRole = watch("role")

  const onSubmit = async (data: FormData) => {
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
        toast.success("Account created! Please sign in. 🎉")
        router.push("/login")
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT — 3D Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)",
        }}>

        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.08) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }} />

        <motion.div className="absolute w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
            top: "5%", right: "5%",
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 7, repeat: Infinity }} />
        <motion.div className="absolute w-72 h-72 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(15,118,110,0.2) 0%, transparent 70%)",
            bottom: "10%", left: "5%",
          }}
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 9, repeat: Infinity }} />

        {FLOATING_ICONS.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl select-none pointer-events-none"
            style={{ left: item.x, top: item.y }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              y: [0, -12, 0],
            }}
            transition={{ duration: 4, delay: item.delay, repeat: Infinity }}>
            {item.icon}
          </motion.div>
        ))}

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="font-poppins font-bold text-white text-xl">
              NeighbourHub <span style={{ color: "#10b981" }}>AI</span>
            </span>
          </Link>
        </div>

        {/* Center */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            <h2 className="font-poppins font-bold text-4xl text-white mb-4 leading-tight">
              Join thousands of
              <span className="block" style={{ color: "#10b981" }}>
                happy residents.
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-sm">
              Whether you need a service or want to offer one —
              NeighbourHub AI has you covered.
            </p>
          </motion.div>

          {/* Role benefits */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRole}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(16,185,129,0.2)" }}>
                  {selectedRole === "CITIZEN"
                    ? <Users className="w-4 h-4" style={{ color: "#10b981" }} />
                    : <Briefcase className="w-4 h-4" style={{ color: "#10b981" }} />}
                </div>
                <p className="text-white font-medium text-sm">
                  {selectedRole === "CITIZEN" ? "As a Citizen" : "As a Provider"}
                </p>
              </div>
              <div className="space-y-3">
                {ROLE_BENEFITS[selectedRole].map((benefit, i) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#10b981" }} />
                    <span className="text-slate-300 text-sm">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 text-xs">
            © 2026 NeighbourHub AI · Built with ❤️ in India
          </p>
        </div>
      </div>

      {/* RIGHT — Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-12 bg-background relative overflow-y-auto">

        <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute w-72 h-72 rounded-full -top-20 -right-20"
            style={{ background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-poppins font-bold text-foreground">
              NeighbourHub <span style={{ color: "#10b981" }}>AI</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="font-poppins font-bold text-3xl text-foreground mb-2">
              Create account ✨
            </h1>
            <p className="text-muted-foreground">
              Join NeighbourHub AI and start booking or offering services today.
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { role: "CITIZEN" as const, label: "I need services", icon: Users, desc: "Book local professionals" },
              { role: "PROVIDER" as const, label: "I offer services", icon: Briefcase, desc: "Grow your business" },
            ].map(option => (
              <button
                key={option.role}
                type="button"
                onClick={() => setValue("role", option.role)}
                className="relative p-4 rounded-2xl border text-left transition-all"
                style={{
                  background: selectedRole === option.role ? "rgba(16,185,129,0.08)" : "var(--card)",
                  borderColor: selectedRole === option.role ? "#10b981" : "var(--border)",
                  boxShadow: selectedRole === option.role ? "0 0 0 1px rgba(16,185,129,0.3)" : "none",
                }}>
                {selectedRole === option.role && (
                  <motion.div
                    layoutId="roleIndicator"
                    className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "#10b981" }}>
                    <CheckCircle className="w-3 h-3 text-white" />
                  </motion.div>
                )}
                <option.icon className="w-5 h-5 mb-2" style={{ color: selectedRole === option.role ? "#10b981" : "var(--text-muted)" }} />
                <p className="font-medium text-foreground text-sm">{option.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{option.desc}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  placeholder="Priya Sharma"
                  {...register("name")}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none transition-all focus:ring-2"
                  style={{ borderColor: errors.name ? "#ef4444" : "var(--border)" }}
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none transition-all focus:ring-2"
                  style={{ borderColor: errors.email ? "#ef4444" : "var(--border)" }}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  onChange={e => {
                    setPassword(e.target.value)
                    register("password").onChange(e)
                  }}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none transition-all focus:ring-2"
                  style={{ borderColor: errors.password ? "#ef4444" : "var(--border)" }}
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-2 space-y-1.5">
                  {PASSWORD_RULES.map(rule => (
                    <div key={rule.label} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${rule.test(password) ? "bg-emerald-500" : "bg-border"}`}>
                        {rule.test(password) && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={`text-xs transition-colors ${rule.test(password) ? "text-emerald-500" : "text-muted-foreground"}`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-all mt-2"
              style={{ background: "linear-gradient(135deg, #10b981, #0f766e)" }}>
              {isLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          {/* Login link */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-background text-xs text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>

          <Link href="/login"
            className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-border hover:border-emerald-500/40 hover:bg-accent transition-all text-foreground">
            Sign In <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By creating an account, you agree to our{" "}
            <span className="underline cursor-pointer" style={{ color: "#10b981" }}>Terms</span>
            {" "}and{" "}
            <span className="underline cursor-pointer" style={{ color: "#10b981" }}>Privacy Policy</span>.
          </p>
        </motion.div>
      </div>
    </div>
  )
}