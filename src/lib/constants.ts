export const APP_NAME = "NeighbourHub AI"
export const APP_DESCRIPTION = "Smart Community Service & Local Assistance Platform"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export const SERVICE_CATEGORIES = [
  { id: "electrician", name: "Electrician", icon: "⚡", slug: "electrician" },
  { id: "plumber", name: "Plumber", icon: "🔧", slug: "plumber" },
  { id: "ac-repair", name: "AC Repair", icon: "❄️", slug: "ac-repair" },
  { id: "cleaning", name: "Cleaning", icon: "🧹", slug: "cleaning" },
  { id: "carpenter", name: "Carpenter", icon: "🪚", slug: "carpenter" },
  { id: "computer-repair", name: "Computer Repair", icon: "💻", slug: "computer-repair" },
]

export const USER_ROLES = {
  CITIZEN: "CITIZEN",
  PROVIDER: "PROVIDER",
  ADMIN: "ADMIN",
} as const

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const