import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password"]
const CITIZEN_ROUTES = ["/dashboard", "/bookings", "/complaints", "/messages", "/profile"]
const PROVIDER_ROUTES = ["/provider"]
const ADMIN_ROUTES = ["/admin"]

export default auth(async function middleware(req) {
  const { nextUrl, auth: session } = req as any
  const pathname = nextUrl.pathname
  const isLoggedIn = !!session?.user
  const role = session?.user?.role

  // Allow public routes always
  const isPublic = PUBLIC_ROUTES.some(r => pathname === r) ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/health")

  if (isPublic) return NextResponse.next()

  // Not logged in → redirect to login
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${pathname}`, req.url))
  }

  // Provider trying to access admin
  if (ADMIN_ROUTES.some(r => pathname.startsWith(r)) && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Citizen trying to access provider routes
  if (PROVIDER_ROUTES.some(r => pathname.startsWith(r)) && role !== "PROVIDER" && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}