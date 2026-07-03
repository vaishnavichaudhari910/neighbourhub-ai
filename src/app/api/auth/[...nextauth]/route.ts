export { handlers as GET, handlers as POST } from "@/lib/auth"

// Note: handlers comes from the auth.ts we created
// This single file handles all auth routes:
// POST /api/auth/signin
// POST /api/auth/signout
// GET  /api/auth/session
// GET  /api/auth/csrf