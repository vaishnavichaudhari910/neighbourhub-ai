import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Category is required"),
  images: z.array(z.string()).optional().default([]),
  isAvailable: z.boolean().optional().default(true),
})

async function getProvider(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { provider: true },
  })
  return user?.provider
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "PROVIDER") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    const provider = await getProvider(session.user.email!)
    if (!provider) {
      return NextResponse.json({ success: false, error: "Provider not found" }, { status: 404 })
    }
    const services = await prisma.service.findMany({
      where: { providerId: provider.id },
      include: { category: { select: { name: true, icon: true, slug: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ success: true, data: services })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch services" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "PROVIDER") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    const provider = await getProvider(session.user.email!)
    if (!provider) {
      return NextResponse.json({ success: false, error: "Provider profile not found" }, { status: 404 })
    }
    const body = await req.json()
    const validated = serviceSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }
    const service = await prisma.service.create({
      data: { ...validated.data, providerId: provider.id },
      include: { category: { select: { name: true, icon: true } } },
    })
    // Auto-verify provider when they add first service
await prisma.provider.update({
  where: { id: provider.id },
  data: { isVerified: true },
})
    return NextResponse.json(
      { success: true, message: "Service created!", data: service },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create service" }, { status: 500 })
  }
}