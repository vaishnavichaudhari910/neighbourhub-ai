"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  MapPin, Loader2, Star, Shield, Zap
} from "lucide-react"

const schema = z.object({
  email: z.string().email("Enter valid email"),
  password: z.string().min(1, "Password required"),
})
type FormData = z.infer<typeof schema>

const FLOATING_ICONS = [
  { icon: "🔧", x: "10%", y: "15%", delay: 0, size: "text-2xl" },
  { icon: "⚡", x: "85%", y: "10%", delay: 0.5, size: "text-3xl" },
  { icon: "🧹", x: "75%", y: "75%", delay: 1, size: "text-2xl" },
  { icon: "🪚", x: "15%", y: "80%", delay: 1.5, size: "text-xl" },
  { icon: "❄️", x: "90%", y: "45%", delay: 0.8, size: "text-2xl" },
  { icon: "🎨", x: "5%", y: "50%", delay: 1.2, size: "text-xl" },
  { icon: "📚", x: "50%", y: "5%", delay: 0.3, size: "text-2xl" },
  { icon: "🏠", x: "60%", y: "90%", delay: 1.8, size: "text-3xl" },
]

const REVIEWS = [
  { name: "Priya S.", text: "Booked plumber in 2 min!", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face" },
  { name: "Rahul D.", text: "Income grew 40% as provider", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face" },
  { name: "Sneha K.", text: "Super easy to use!", rating: 5, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face" },
]

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeReview, setActiveReview] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview(prev => (prev + 1) % REVIEWS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!json.success) {
        toast.error(json.error)
      } else {
        toast.success(`Welcome back! 👋`)
        router.push(json.redirectTo || "/dashboard")
        router.refresh()
      }
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* LEFT — 3D Background with floating icons */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #0f172a 100%)",
        }}>

        {/* Animated grid */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.08) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }} />

        {/* Glowing orbs */}
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)",
            top: "10%", left: "20%",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }} />
        <motion.div
          className="absolute w-72 h-72 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(15,118,110,0.2) 0%, transparent 70%)",
            bottom: "15%", right: "10%",
          }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.8, 0.5, 0.8] }}
          transition={{ duration: 8, repeat: Infinity }} />

        {/* Floating service icons */}
        {FLOATING_ICONS.map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.size} select-none pointer-events-none`}
            style={{ left: item.x, top: item.y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1, 0.8],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4,
              delay: item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}>
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

        {/* Center content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}>
            <h2 className="font-poppins font-bold text-4xl text-white mb-4 leading-tight">
              Your community,
              <span className="block" style={{ color: "#10b981" }}>
                smarter with AI.
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-sm">
              Book trusted local services, connect with verified providers,
              and manage everything from one place.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: <Shield className="w-5 h-5" />, value: "450+", label: "Verified providers" },
                { icon: <Star className="w-5 h-5" />, value: "4.8/5", label: "Avg rating" },
                { icon: <Zap className="w-5 h-5" />, value: "15min", label: "Response time" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center p-3 rounded-2xl border"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    borderColor: "rgba(16,185,129,0.2)",
                  }}>
                  <div className="flex justify-center mb-1" style={{ color: "#10b981" }}>{stat.icon}</div>
                  <p className="font-poppins font-bold text-white text-lg">{stat.value}</p>
                  <p className="text-slate-400 text-xs">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rotating reviews */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeReview}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="p-4 rounded-2xl border"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(16,185,129,0.2)",
              }}>
              <div className="flex gap-3 items-center">
                <img src={REVIEWS[activeReview].avatar}
                  alt={REVIEWS[activeReview].name}
                  className="w-10 h-10 rounded-xl object-cover border-2"
                  style={{ borderColor: "rgba(16,185,129,0.4)" }} />
                <div>
                  <div className="flex gap-0.5 mb-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-white text-sm font-medium">"{REVIEWS[activeReview].text}"</p>
                  <p className="text-slate-400 text-xs mt-0.5">— {REVIEWS[activeReview].name}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom */}
        <div className="relative z-10">
          <p className="text-slate-500 text-xs">
            © 2026 NeighbourHub AI · Built with ❤️ in India
          </p>
        </div>
      </div>

      {/* RIGHT — Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-12 bg-background relative">

        {/* Mobile bg */}
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

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-poppins font-bold text-3xl text-foreground mb-2">
              Welcome back 👋
            </h1>
            <p className="text-muted-foreground">
              Sign in to book services or manage your provider account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none transition-all focus:ring-2"
                  style={{
                    borderColor: errors.email ? "#ef4444" : "var(--border)",
                    ["--tw-ring-color" as string]: "#10b981",
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link href="/forgot-password"
                  className="text-xs font-medium hover:underline transition-colors"
                  style={{ color: "#10b981" }}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border bg-card text-foreground placeholder:text-muted-foreground text-sm outline-none transition-all focus:ring-2"
                  style={{
                    borderColor: errors.password ? "#ef4444" : "var(--border)",
                    ["--tw-ring-color" as string]: "#10b981",
                  }}
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
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
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-background text-xs text-muted-foreground">
                Don't have an account?
              </span>
            </div>
          </div>

          {/* Register link */}
          <Link href="/register"
            className="w-full py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border border-border hover:border-emerald-500/40 hover:bg-accent transition-all text-foreground">
            Create account <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Demo accounts */}
          <div className="mt-6 p-4 rounded-2xl border"
            style={{
              background: "rgba(16,185,129,0.04)",
              borderColor: "rgba(16,185,129,0.15)",
            }}>
            <p className="text-xs font-medium text-foreground mb-3">🧪 Demo accounts</p>
            <div className="space-y-2">
              {[
                { role: "Citizen", email: "citizen@test.com", pass: "Citizen@123", color: "#3b82f6" },
                { role: "Provider", email: "provider@test.com", pass: "Provider@123", color: "#10b981" },
              ].map(demo => (
                <div key={demo.role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${demo.color}15`, color: demo.color }}>
                      {demo.role}
                    </span>
                    <span className="text-xs text-muted-foreground">{demo.email}</span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{demo.pass}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}