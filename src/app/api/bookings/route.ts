import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const bookingSchema = z.object({
  serviceId: z.string().min(1, "Service ID required"),
  date: z.string().min(1, "Date required"),
  time: z.string().min(1, "Time required"),
  address: z.string().min(5, "Address required"),
  amount: z.number().positive("Amount must be positive"),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Please login to book a service" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validated = bookingSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }

    const { serviceId, date, time, address, amount } = validated.data

    // Get user from DB
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })
    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    // Verify service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    })
    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: dbUser.id,
        serviceId,
        date: new Date(date),
        time,
        address,
        amount,
        status: "PENDING",
      },
      include: {
        service: {
          include: {
            category: { select: { name: true, icon: true } },
            provider: {
              include: {
                user: { select: { name: true, avatar: true } },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(
      { success: true, message: "Booking created!", data: booking },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Booking error:", error?.message || error)
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })
    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: dbUser.id },
      include: {
        service: {
          include: {
            category: { select: { name: true, icon: true } },
            provider: {
              include: {
                user: { select: { name: true, avatar: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: bookings })
  } catch (error: any) {
    console.error("Get bookings error:", error?.message || error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    )
  }
}