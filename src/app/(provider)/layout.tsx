import { ProviderSidebar } from "@/components/layout/provider-sidebar"

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex">
      <ProviderSidebar />
      <main className="flex-1 min-w-0 lg:ml-64">
        {children}
      </main>
    </div>
  )
}