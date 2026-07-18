import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().optional(),
  images: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
})

async function getProviderService(serviceId: string, email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { provider: true },
  })
  if (!user?.provider) return null
  const service = await prisma.service.findFirst({
    where: { id: serviceId, providerId: user.provider.id },
  })
  return service
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "PROVIDER") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const service = await getProviderService(id, session.user.email!)
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 })
    }
    const body = await req.json()
    const validated = updateSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }
    const updated = await prisma.service.update({
      where: { id },
      data: validated.data,
      include: { category: { select: { name: true, icon: true } } },
    })
    return NextResponse.json({ success: true, message: "Service updated!", data: updated })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "PROVIDER") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const service = await getProviderService(id, session.user.email!)
    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 })
    }
    // Check no active bookings
    const activeBookings = await prisma.booking.count({
      where: { serviceId: id, status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] } },
    })
    if (activeBookings > 0) {
      return NextResponse.json(
        { success: false, error: "Cannot delete service with active bookings" },
        { status: 400 }
      )
    }
    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ success: true, message: "Service deleted" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 })
  }
}