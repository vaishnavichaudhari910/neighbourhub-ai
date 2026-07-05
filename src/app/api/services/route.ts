import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const q         = searchParams.get("q") ?? ""
    const category  = searchParams.get("category") ?? ""
    const minPrice  = Number(searchParams.get("minPrice") ?? 0)
    const maxPrice  = Number(searchParams.get("maxPrice") ?? 99999)
    const minRating = Number(searchParams.get("minRating") ?? 0)
    const city      = searchParams.get("city") ?? ""
    const sort      = searchParams.get("sort") ?? "rating"
    const page      = Math.max(1, Number(searchParams.get("page") ?? 1))
    const limit     = Math.min(20, Number(searchParams.get("limit") ?? 12))
    const skip      = (page - 1) * limit

    const providerFilter: any = {
      isVerified: true,
    }
    if (minRating > 0) {
      providerFilter.rating = { gte: minRating }
    }
    if (city) {
      providerFilter.city = { contains: city, mode: "insensitive" }
    }

    const where: any = {
      isAvailable: true,
      price: { gte: minPrice, lte: maxPrice },
      provider: providerFilter,
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { category: { name: { contains: q, mode: "insensitive" } } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    let orderBy: any = { provider: { rating: "desc" } }
    if (sort === "price_asc")  orderBy = { price: "asc" }
    if (sort === "price_desc") orderBy = { price: "desc" }
    if (sort === "newest")     orderBy = { createdAt: "desc" }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { name: true, slug: true, icon: true },
          },
          provider: {
            select: {
              id: true,
              rating: true,
              totalReviews: true,
              experience: true,
              isVerified: true,
              city: true,
              user: { select: { name: true, avatar: true } },
            },
          },
        },
      }),
      prisma.service.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: services,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    })
  } catch (error) {
    console.error("Services API error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch services" },
      { status: 500 }
    )
  }
}