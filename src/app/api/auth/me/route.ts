import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Not authenticated" },
      { status: 401 }
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      avatar: session.user.avatar,
    },
  })
}