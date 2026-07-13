"use client"

import { useState, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import {
  Camera, User, Phone, Mail, MapPin,
  Lock, Sun, Moon, Plus, Trash2, Star, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import Image from "next/image"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
})
type ProfileForm = z.infer<typeof profileSchema>

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(8, "Min 8 characters")
    .regex(/[A-Z]/, "Must have uppercase")
    .regex(/[0-9]/, "Must have number"),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match", path: ["confirmPassword"],
})
type PasswordForm = z.infer<typeof passwordSchema>

const addressSchema = z.object({
  label: z.string().min(1, "Label required"),
  line1: z.string().min(5, "Enter full address"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().length(6, "6-digit pincode"),
  isDefault: z.boolean().optional(),
})
type AddressForm = z.infer<typeof addressSchema>

const TABS = ["Profile", "Addresses", "Security", "Appearance"]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Profile")
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const { theme, setTheme } = useTheme()

  // Fetch user
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await fetch("/api/users/me")
      return res.json()
    },
  })

  // Fetch addresses
  const { data: addrData } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await fetch("/api/users/addresses")
      return res.json()
    },
  })

  const user = userData?.data
  const addresses = addrData?.data || []

  // Profile form
  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: { name: user?.name || "", phone: user?.phone || "" },
  })

  // Password form
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  // Address form
  const addressForm = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { isDefault: false },
  })

  // Avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData })
      const uploadJson = await uploadRes.json()
      if (!uploadJson.success) { toast.error(uploadJson.error); return }

      const updateRes = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: uploadJson.url }),
      })
      const updateJson = await updateRes.json()
      if (updateJson.success) {
        queryClient.invalidateQueries({ queryKey: ["user-profile"] })
        toast.success("Avatar updated!")
      }
    } catch { toast.error("Upload failed") }
    finally { setAvatarUploading(false) }
  }

  // Update profile
  const onProfileSubmit = async (data: ProfileForm) => {
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (json.success) {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
      toast.success("Profile updated!")
    } else toast.error(json.error)
  }

  // Change password
  const onPasswordSubmit = async (data: PasswordForm) => {
    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: data.currentPassword, newPassword: data.newPassword }),
    })
    const json = await res.json()
    if (json.success) {
      toast.success("Password changed!")
      passwordForm.reset()
    } else toast.error(json.error)
  }

  // Add address
  const onAddressSubmit = async (data: AddressForm) => {
    const res = await fetch("/api/users/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    const json = await res.json()
    if (json.success) {
      queryClient.invalidateQueries({ queryKey: ["addresses"] })
      toast.success("Address saved!")
      setShowAddressForm(false)
      addressForm.reset()
    } else toast.error(json.error)
  }

  return (
    <div className="p-6 pt-20 lg:pt-8 max-w-3xl">
      <motion.div className="mb-6"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-poppins font-bold text-foreground">Profile & Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account information</p>
      </motion.div>

      {/* Avatar card */}
      <motion.div className="bg-card border border-border rounded-2xl p-6 mb-6 flex items-center gap-6"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          {isLoading ? (
            <Skeleton className="w-20 h-20 rounded-full" />
          ) : user?.avatar ? (
            <Image src={user.avatar} alt={user.name}
              width={80} height={80}
              className="w-20 h-20 rounded-full object-cover border-4 border-card shadow-lg" />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-card shadow-lg"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-white shadow-md"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            {avatarUploading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Camera className="w-3.5 h-3.5" />}
          </button>
          <input ref={fileInputRef} type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden" onChange={handleAvatarUpload} />
        </div>
        <div>
          <h2 className="font-poppins font-bold text-foreground text-lg">{user?.name}</h2>
          <p className="text-muted-foreground text-sm">{user?.email}</p>
          <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            {user?.role}
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              activeTab === tab ? "text-white" : "bg-secondary text-muted-foreground hover:text-foreground"
            )}
            style={activeTab === tab ? { background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" } : {}}>
            {tab}
          </button>
        ))}
      </div>

      {/* PROFILE TAB */}
      {activeTab === "Profile" && (
        <motion.div className="bg-card border border-border rounded-2xl p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="font-poppins font-semibold text-foreground mb-5">Personal information</h3>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div>
              <Label>Full name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-10 h-11" {...profileForm.register("name")} />
              </div>
              {profileForm.formState.errors.name && (
                <p className="text-destructive text-xs mt-1">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label>Email <span className="text-muted-foreground text-xs">(cannot change)</span></Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-10 h-11 bg-secondary" value={user?.email || ""} disabled />
              </div>
            </div>
            <div>
              <Label>Phone number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-10 h-11" placeholder="9876543210" {...profileForm.register("phone")} />
              </div>
            </div>
            <Button type="submit" className="w-full h-11"
              disabled={profileForm.formState.isSubmitting}
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
              {profileForm.formState.isSubmitting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : "Save changes"}
            </Button>
          </form>
        </motion.div>
      )}

      {/* ADDRESSES TAB */}
      {activeTab === "Addresses" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="space-y-3 mb-4">
            {addresses.length === 0 && !showAddressForm ? (
              <div className="text-center py-12 bg-card border border-border rounded-2xl">
                <MapPin className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground mb-1">No saved addresses</p>
                <p className="text-sm text-muted-foreground">Add your home or work address</p>
              </div>
            ) : addresses.map((addr: any) => (
              <div key={addr.id}
                className="bg-card border border-border rounded-2xl p-4 flex items-start justify-between">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-foreground text-sm">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                          <Star className="w-3 h-3" /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{addr.line1}</p>
                    <p className="text-xs text-muted-foreground">
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showAddressForm ? (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="font-poppins font-semibold text-foreground mb-4">Add new address</h3>
              <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Label</Label>
                    <Input className="mt-1 h-11" placeholder="Home / Work" {...addressForm.register("label")} />
                    {addressForm.formState.errors.label && (
                      <p className="text-destructive text-xs mt-1">{addressForm.formState.errors.label.message}</p>
                    )}
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input className="mt-1 h-11" placeholder="411001" maxLength={6} {...addressForm.register("pincode")} />
                    {addressForm.formState.errors.pincode && (
                      <p className="text-destructive text-xs mt-1">{addressForm.formState.errors.pincode.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Address line 1</Label>
                  <Input className="mt-1 h-11" placeholder="House no., Street, Area" {...addressForm.register("line1")} />
                  {addressForm.formState.errors.line1 && (
                    <p className="text-destructive text-xs mt-1">{addressForm.formState.errors.line1.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>City</Label>
                    <Input className="mt-1 h-11" placeholder="Pune" {...addressForm.register("city")} />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input className="mt-1 h-11" placeholder="Maharashtra" {...addressForm.register("state")} />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...addressForm.register("isDefault")}
                    className="rounded" />
                  <span className="text-sm text-foreground">Set as default address</span>
                </label>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1"
                    onClick={() => { setShowAddressForm(false); addressForm.reset() }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1"
                    disabled={addressForm.formState.isSubmitting}
                    style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
                    {addressForm.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save address"}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <Button className="w-full gap-2" variant="outline"
              onClick={() => setShowAddressForm(true)}>
              <Plus className="w-4 h-4" /> Add new address
            </Button>
          )}
        </motion.div>
      )}

      {/* SECURITY TAB */}
      {activeTab === "Security" && (
        <motion.div className="bg-card border border-border rounded-2xl p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="font-poppins font-semibold text-foreground mb-1">Change password</h3>
          <p className="text-muted-foreground text-sm mb-5">
            Keep your account secure with a strong password.
          </p>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            {[
              { name: "currentPassword" as const, label: "Current password" },
              { name: "newPassword" as const, label: "New password" },
              { name: "confirmPassword" as const, label: "Confirm new password" },
            ].map(field => (
              <div key={field.name}>
                <Label>{field.label}</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" className="pl-10 h-11"
                    placeholder="••••••••" {...passwordForm.register(field.name)} />
                </div>
                {passwordForm.formState.errors[field.name] && (
                  <p className="text-destructive text-xs mt-1">
                    {passwordForm.formState.errors[field.name]?.message}
                  </p>
                )}
              </div>
            ))}
            <Button type="submit" className="w-full h-11"
              disabled={passwordForm.formState.isSubmitting}
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
              {passwordForm.formState.isSubmitting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : "Update password"}
            </Button>
          </form>
        </motion.div>
      )}

      {/* APPEARANCE TAB */}
      {activeTab === "Appearance" && (
        <motion.div className="bg-card border border-border rounded-2xl p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="font-poppins font-semibold text-foreground mb-5">Theme preference</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: "light", label: "Light", icon: Sun, preview: "bg-white border" },
              { id: "dark", label: "Dark", icon: Moon, preview: "bg-slate-900" },
              { id: "system", label: "System", icon: () => <span className="text-lg">💻</span>, preview: "bg-gradient-to-r from-white to-slate-900" },
            ].map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={cn(
                  "rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all",
                  theme === t.id ? "border-primary" : "border-border hover:border-primary/40"
                )}>
                <div className={`w-full h-16 rounded-xl ${t.preview}`} />
                <div className="flex items-center gap-2">
                  <t.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.label}</span>
                </div>
                {theme === t.id && (
                  <span className="text-xs text-primary font-medium">Active</span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}