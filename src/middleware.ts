import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"]

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const isPublic =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/health")

  if (isPublic) return NextResponse.next()

  const token = req.cookies.get("nh-session")?.value

  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${pathname}`, req.url)
    )
  }

  const user = await verifyToken(token)

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  if (pathname.startsWith("/provider") && user.role === "CITIZEN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}