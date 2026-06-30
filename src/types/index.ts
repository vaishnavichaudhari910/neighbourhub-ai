export type UserRole = "CITIZEN" | "PROVIDER" | "ADMIN"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  phone?: string
  createdAt: Date
}

export interface Provider {
  id: string
  userId: string
  user: User
  bio: string
  experience: number
  isVerified: boolean
  rating: number
  totalReviews: number
  categoryId: string
}

export interface Service {
  id: string
  providerId: string
  provider: Provider
  categoryId: string
  title: string
  description: string
  price: number
  images: string[]
  isAvailable: boolean
}

export interface Booking {
  id: string
  userId: string
  serviceId: string
  service: Service
  status: "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  date: string
  time: string
  address: string
  amount: number
  createdAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}