import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-poppins font-bold gradient-text mb-2">
          Welcome, {session.user.name}! 👋
        </h1>
        <p className="text-muted-foreground">Role: {session.user.role}</p>
        <p className="text-muted-foreground text-sm mt-1">Dashboard coming in Step 10 ✅</p>
      </div>
    </div>
  )
}