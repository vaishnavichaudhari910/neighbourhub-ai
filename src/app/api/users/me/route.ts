import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import bcrypt from "bcryptjs"

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8)
    .regex(/[A-Z]/, "Must have uppercase")
    .regex(/[0-9]/, "Must have number"),
})

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: {
      id: true, name: true, email: true,
      phone: true, avatar: true, role: true,
      createdAt: true, emailVerified: true,
    },
  })
  return NextResponse.json({ success: true, data: user })
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    // Password change request
    if (body.currentPassword) {
      const validated = passwordSchema.safeParse(body)
      if (!validated.success) {
        return NextResponse.json(
          { success: false, error: validated.error.errors[0].message },
          { status: 400 }
        )
      }
      const user = await prisma.user.findUnique({
        where: { email: session.user.email! },
      })
      if (!user?.passwordHash) {
        return NextResponse.json(
          { success: false, error: "Cannot change password for OAuth accounts" },
          { status: 400 }
        )
      }
      const isValid = await bcrypt.compare(body.currentPassword, user.passwordHash)
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 400 }
        )
      }
      const newHash = await bcrypt.hash(body.newPassword, 12)
      await prisma.user.update({
        where: { email: session.user.email! },
        data: { passwordHash: newHash },
      })
      return NextResponse.json({ success: true, message: "Password updated" })
    }

    // Profile update
    const validated = updateSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }

    const updated = await prisma.user.update({
      where: { email: session.user.email! },
      data: validated.data,
      select: {
        id: true, name: true, email: true,
        phone: true, avatar: true, role: true,
      },
    })

    return NextResponse.json({ success: true, message: "Profile updated", data: updated })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 }
    )
  }
}