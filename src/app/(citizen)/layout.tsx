import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <main className="flex-1 min-w-0 lg:ml-64">
        {children}
      </main>
    </div>
  )
}