import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "fallback-secret-32-chars-minimum!!"
)

export interface SessionUser {
  id: string
  name: string
  email: string
  role: string
  avatar?: string | null
}

// Create JWT token
export async function createToken(user: SessionUser) {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

// Get session from cookie
export async function auth(): Promise<{ user: SessionUser } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("nh-session")?.value
  if (!token) return null
  const user = await verifyToken(token)
  if (!user) return null
  return { user }
}

// Set session cookie
export async function setSession(user: SessionUser) {
  const token = await createToken(user)
  const cookieStore = await cookies()
  cookieStore.set("nh-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

// Clear session cookie
export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete("nh-session")
}