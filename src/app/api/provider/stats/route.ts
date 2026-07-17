import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || session.user.role !== "PROVIDER") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: { provider: true },
    })
    if (!dbUser?.provider) {
      return NextResponse.json({ success: false, error: "Provider not found" }, { status: 404 })
    }

    const providerId = dbUser.provider.id

    const [total, pending, confirmed, completed, earnings] = await Promise.all([
      prisma.booking.count({ where: { service: { providerId } } }),
      prisma.booking.count({ where: { service: { providerId }, status: "PENDING" } }),
      prisma.booking.count({ where: { service: { providerId }, status: "CONFIRMED" } }),
      prisma.booking.count({ where: { service: { providerId }, status: "COMPLETED" } }),
      prisma.booking.aggregate({
        where: { service: { providerId }, status: "COMPLETED" },
        _sum: { amount: true },
      }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        total, pending, confirmed, completed,
        earnings: earnings._sum.amount || 0,
        rating: dbUser.provider.rating,
        totalReviews: dbUser.provider.totalReviews,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch stats" }, { status: 500 })
  }
}