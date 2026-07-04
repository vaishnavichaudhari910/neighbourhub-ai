"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const schema = z.object({ email: z.string().email("Enter a valid email") })
type ForgotForm = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true)
    // TODO: implement email sending in Phase 3
    await new Promise(r => setTimeout(r, 1500))
    setSent(true)
    setIsLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <AnimatePresence mode="wait">
        {!sent ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-8">
              <h2 className="text-2xl font-poppins font-bold text-foreground mb-1">Reset password</h2>
              <p className="text-muted-foreground text-sm">Enter your email and we'll send a reset link</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com"
                    className="pl-10 h-11" {...register("email")} />
                </div>
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full h-11"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
                disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send reset link"}
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-poppins font-bold mb-2">Check your email</h3>
            <p className="text-muted-foreground text-sm mb-6">
              We've sent a password reset link to your email address.
            </p>
            <Button variant="outline" onClick={() => setSent(false)}>Try another email</Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 text-center">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </Link>
      </div>
    </motion.div>
  )
}