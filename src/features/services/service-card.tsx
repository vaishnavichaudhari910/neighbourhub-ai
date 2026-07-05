"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MapPin, Star, Clock, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ServiceCardProps {
  service: any
  index: number
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const { provider, category } = service

  return (
    <motion.div
      className="bg-card border border-border rounded-2xl overflow-hidden group hover:border-primary/30 hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4 }}>

      {/* Top color bar */}
      <div className="h-1.5 w-full"
        style={{ background: "linear-gradient(90deg, #3b82f6, #8b5cf6)" }} />

      <div className="p-5">
        {/* Category badge + verified */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="secondary" className="gap-1 text-xs">
            <span>{category.icon}</span> {category.name}
          </Badge>
          {provider.isVerified && (
            <div className="flex items-center gap-1 text-xs text-blue-500">
              <BadgeCheck className="w-3.5 h-3.5" /> Verified
            </div>
          )}
        </div>

        {/* Provider avatar + name */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}>
            {provider.user.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground text-sm">{provider.user.name}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" /> {provider.city || "Pune"}
            </div>
          </div>
        </div>

        {/* Service title */}
        <h3 className="font-poppins font-semibold text-foreground mb-1 line-clamp-1">
          {service.title}
        </h3>
        <p className="text-muted-foreground text-xs line-clamp-2 mb-4">
          {service.description}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-foreground font-medium">{provider.rating}</span>
            <span>({provider.totalReviews})`</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {provider.experience}y exp
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Starting at</span>
            <p className="font-poppins font-bold text-foreground text-lg">
              ₹{service.price}
            </p>
          </div>
          <Button size="sm" className="rounded-xl"
            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
            asChild>
            <Link href={`/providers/${provider.id}`}>Book Now</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}