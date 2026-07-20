import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        provider: {
          include: {
            user: { select: { name: true, avatar: true, phone: true } },
          },
        },
        category: { select: { name: true, icon: true, slug: true } },
      },
    })
    if (!service) {
      return NextResponse.json(
        { success: false, error: "Service not found" },
        { status: 404 }
      )
    }
    return NextResponse.json({ success: true, data: service })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch service" },
      { status: 500 }
    )
  }
}