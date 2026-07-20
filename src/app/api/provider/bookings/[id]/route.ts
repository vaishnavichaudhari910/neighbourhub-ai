import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updateSchema = z.object({
  status: z.enum(["CONFIRMED", "CANCELLED", "IN_PROGRESS", "COMPLETED"]),
  cancelReason: z.string().optional(),
})

// Valid status transitions
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING:     ["CONFIRMED", "CANCELLED"],
  CONFIRMED:   ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED:   [],
  CANCELLED:   [],
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "PROVIDER") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await req.json()
    const validated = updateSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }

    // Verify this booking belongs to this provider
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { provider: true },
    })
    if (!dbUser?.provider) {
      return NextResponse.json(
        { success: false, error: "Provider not found" },
        { status: 404 }
      )
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id,
        service: { providerId: dbUser.provider.id },
      },
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      )
    }

    // Check valid transition
    const allowed = ALLOWED_TRANSITIONS[booking.status] || []
    if (!allowed.includes(validated.data.status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot change status from ${booking.status} to ${validated.data.status}`,
        },
        { status: 400 }
      )
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        status: validated.data.status,
        notes: validated.data.cancelReason
          ? `Cancelled: ${validated.data.cancelReason}`
          : booking.notes,
      },
      include: {
        service: {
          include: {
            category: { select: { name: true, icon: true } },
          },
        },
        user: { select: { name: true, email: true } },
      },
    })

    const messages: Record<string, string> = {
      CONFIRMED:   "Booking accepted!",
      CANCELLED:   "Booking rejected",
      IN_PROGRESS: "Job started!",
      COMPLETED:   "Job marked as complete!",
    }

    return NextResponse.json({
      success: true,
      message: messages[validated.data.status],
      data: updated,
    })
  } catch (error) {
    console.error("Booking update error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    )
  }
}