import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { setSession } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// Role → redirect path mapping
const ROLE_REDIRECT: Record<string, string> = {
  CITIZEN: "/dashboard",
  PROVIDER: "/provider/dashboard",
  ADMIN: "/admin/dashboard",
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = loginSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 400 }
      )
    }
    const { email, password } = validated.data
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true, name: true, email: true,
        role: true, avatar: true,
        passwordHash: true, isActive: true,
      },
    })
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }
    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: "Account is deactivated" },
        { status: 403 }
      )
    }
    await setSession({
      id: user.id, name: user.name,
      email: user.email, role: user.role,
      avatar: user.avatar,
    })
    return NextResponse.json({
      success: true,
      message: "Login successful",
      redirectTo: ROLE_REDIRECT[user.role] || "/dashboard",
      data: {
        id: user.id, name: user.name,
        email: user.email, role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
