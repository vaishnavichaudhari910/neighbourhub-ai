import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const reviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validated = reviewSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }

    const { bookingId, rating, comment } = validated.data

    // Booking verify karo — COMPLETED ahe ka + same user ahe ka
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })
    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      )
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId: dbUser.id,
        status: "COMPLETED",
      },
      include: {
        service: { select: { providerId: true } },
        review: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found or not completed" },
        { status: 404 }
      )
    }

    if (booking.review) {
      return NextResponse.json(
        { success: false, error: "Review already submitted" },
        { status: 400 }
      )
    }

    // Review create karo
    const review = await prisma.review.create({
      data: {
        bookingId,
        userId: dbUser.id,
        providerId: booking.service.providerId,
        rating,
        comment,
      },
    })

    // Provider average rating update karo
    const allReviews = await prisma.review.findMany({
      where: { providerId: booking.service.providerId },
      select: { rating: true },
    })

    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length

    await prisma.provider.update({
      where: { id: booking.service.providerId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        totalReviews: allReviews.length,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Review submitted!",
      data: review,
    })
  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const providerId = searchParams.get("providerId")

  if (!providerId) {
    return NextResponse.json(
      { success: false, error: "providerId required" },
      { status: 400 }
    )
  }

  const reviews = await prisma.review.findMany({
    where: { providerId },
    include: {
      user: { select: { name: true, avatar: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ success: true, data: reviews })
}