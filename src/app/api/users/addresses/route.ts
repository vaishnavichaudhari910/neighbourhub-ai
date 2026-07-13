import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const addressSchema = z.object({
  label: z.string().min(1),
  line1: z.string().min(5),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().length(6),
  isDefault: z.boolean().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }
  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } })
  if (!dbUser) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })

  const addresses = await prisma.address.findMany({
    where: { userId: dbUser.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  })
  return NextResponse.json({ success: true, data: addresses })
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }
    const body = await req.json()
    const validated = addressSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }
    const dbUser = await prisma.user.findUnique({ where: { email: session.user.email! } })
    if (!dbUser) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })

    // If setting as default, unset others
    if (validated.data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: dbUser.id },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: { ...validated.data, userId: dbUser.id },
    })
    return NextResponse.json({ success: true, data: address }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save address" }, { status: 500 })
  }
}