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

    const bookings = await prisma.booking.findMany({
      where: { service: { providerId: dbUser.provider.id } },
      include: {
        service: {
          include: { category: { select: { name: true, icon: true } } },
        },
        user: { select: { name: true, email: true, phone: true, avatar: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ success: true, data: bookings })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 })
  }
}