import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret-32-chars-minimum!!"
)

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"]

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const isPublic =
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/favicon")

  if (isPublic) return NextResponse.next()

  const token = req.cookies.get("nh-session")?.value

  if (!token) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
    )
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)

    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    if (pathname.startsWith("/provider") && payload.role === "CITIZEN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }

    return NextResponse.next()
  } catch {
    // Token invalid/expired — clear cookie and redirect
    const response = NextResponse.redirect(new URL("/login", req.url))
    response.cookies.delete("nh-session")
    return response
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}