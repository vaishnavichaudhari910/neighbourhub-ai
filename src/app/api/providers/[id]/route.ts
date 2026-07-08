import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const provider = await prisma.provider.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true, name: true, email: true,
            avatar: true, phone: true, createdAt: true,
          },
        },
        services: {
          where: { isAvailable: true },
          include: {
            category: { select: { name: true, slug: true, icon: true } },
          },
          orderBy: { price: "asc" },
        },
      },
    })

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "Provider not found" },
        { status: 404 }
      )
    }

    const totalBookings = await prisma.booking.count({
      where: { service: { providerId: id }, status: "COMPLETED" },
    })

    return NextResponse.json({
      success: true,
      data: { ...provider, totalBookings },
    })
  } catch (error) {
    console.error("Provider API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch provider" },
      { status: 500 }
    )
  }
}