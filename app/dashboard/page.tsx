"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IconVideo, IconChartLine, IconTarget, IconActivity } from "@tabler/icons-react"
import { SDRStatsCards } from "@/components/sdr-stats-cards";
import { RecommendedPractice } from "@/components/recommended-practice";
import { ProtectedRoute } from "@/components/providers/protected-route";
import { useSessions } from "@/hooks/use-sessions";

export default function Page() {
  const { sessions, loading } = useSessions();

  const StatCard = ({ icon, title, value, trend }: any) => (
    <div className="bg-card border rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-wider">
        {icon}
        {title}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-xs text-green-500 font-medium">{trend}</span>
      </div>
    </div>
  )
  
  return (
    <ProtectedRoute>
      <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col h-full bg-muted/20">
              <div className="px-4 lg:px-8 py-6">
                <header className="mb-8">
                  <h1 className="text-3xl font-bold tracking-tight">Welcome back, SDR</h1>
                  <p className="text-muted-foreground">Here's your interview training progress overview.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard icon={<IconVideo className="size-4" />} title="Total Sessions" value={sessions.length.toString()} trend="+2" />
                  <StatCard icon={<IconChartLine className="size-4" />} title="Average Score" value="78%" trend="+5%" />
                  <StatCard icon={<IconTarget className="size-4" />} title="Assignments" value="4/5" trend="80%" />
                  <StatCard icon={<IconActivity className="size-4" />} title="Confidence" value="82" trend="+3" />
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                {loading ? (
                   <div className="h-40 flex items-center justify-center">Loading sessions...</div>
                ) : (
                   <DataTable data={sessions} />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
