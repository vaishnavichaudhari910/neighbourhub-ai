import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret-32-chars-minimum!!"
)

// Completely public — no auth needed
const PUBLIC_ROUTES = [
  "/", "/login", "/register", "/forgot-password",
]

// Public API routes
const PUBLIC_API = [
  "/api/auth/login", "/api/auth/register", "/api/auth/logout",
  "/api/health", "/api/services", "/api/categories", "/api/providers",
]

// Citizen-only routes
const CITIZEN_ROUTES = [
  "/dashboard", "/bookings", "/complaints",
  "/messages", "/profile", "/notifications",
]

// Provider-only routes
const PROVIDER_ROUTES = ["/provider"]

// Admin-only routes
const ADMIN_ROUTES = ["/admin"]

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Allow static files + public pages
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public") ||
    pathname.match(/\.(png|jpg|svg|ico|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // Allow public pages
  if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next()

  // Allow public APIs
  if (PUBLIC_API.some(r => pathname.startsWith(r))) return NextResponse.next()

  // Allow public pages (services, providers, booking)
  if (
    pathname.startsWith("/services") ||
    pathname.startsWith("/providers") ||
    pathname.startsWith("/booking")
  ) {
    return NextResponse.next()
  }

  // Get session token
  const token = req.cookies.get("nh-session")?.value

  // Not logged in → redirect to login
  if (!token) {
    const url = new URL("/login", req.url)
    url.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(url)
  }

  try {
    const { payload } = await jwtVerify(token, SECRET)
    const role = payload.role as string

    // ADMIN routes — admin only
    if (ADMIN_ROUTES.some(r => pathname.startsWith(r))) {
      if (role !== "ADMIN") {
        return NextResponse.redirect(new URL(
          role === "PROVIDER" ? "/provider/dashboard" : "/dashboard",
          req.url
        ))
      }
    }

    // PROVIDER routes — provider + admin only
    if (PROVIDER_ROUTES.some(r => pathname.startsWith(r))) {
      if (role !== "PROVIDER" && role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // CITIZEN routes — citizen + admin only
    if (CITIZEN_ROUTES.some(r => pathname.startsWith(r))) {
      if (role === "PROVIDER") {
        return NextResponse.redirect(new URL("/provider/dashboard", req.url))
      }
    }

    return NextResponse.next()
  } catch {
    // Invalid/expired token
    const response = NextResponse.redirect(new URL("/login", req.url))
    response.cookies.delete("nh-session")
    return response
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)'"],
}