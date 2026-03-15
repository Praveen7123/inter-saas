"use client"

import { Badge } from "@/components/ui/badge";
import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/providers/protected-route";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IconUsers, IconVideo, IconChartLine, IconAlertCircle } from "@tabler/icons-react";
import { useAdminStats } from "@/hooks/use-admin-stats";
import { useUsers } from "@/hooks/use-users";

export default function AdminDashboardPage() {
  const { stats, loading: statsLoading } = useAdminStats();
  const { users, loading: usersLoading } = useUsers();

  const recentUsers = users.slice(0, 5);

  return (
    <ProtectedRoute adminOnly>
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
          <div className="@container/main flex flex-1 flex-col gap-2 p-4 lg:p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-primary">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Platform overview and representative performance metrics.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium italic">Total Candidates</CardTitle>
                  <IconUsers className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statsLoading ? "..." : stats.totalUsers}</div>
                  <p className="text-xs text-green-500 font-medium">Real-time update</p>
                </CardContent>
              </Card>
              <Card className="border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium italic">Total Sessions</CardTitle>
                  <IconVideo className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statsLoading ? "..." : stats.totalSessions}</div>
                  <Badge className="bg-primary/10 text-primary border-none text-[10px]">LIFETIME</Badge>
                </CardContent>
              </Card>
              <Card className="border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium italic">Avg. Score</CardTitle>
                  <IconChartLine className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statsLoading ? "..." : `${stats.avgScore}%`}</div>
                  <p className="text-xs text-muted-foreground italic">Target: 85%</p>
                </CardContent>
              </Card>
              <Card className="border-primary/10">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium italic">Needs Review</CardTitle>
                  <IconAlertCircle className="size-4 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{statsLoading ? "..." : stats.needsReview}</div>
                  <p className="text-xs text-amber-500 font-medium font-bold uppercase tracking-tighter">Pending Eval</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="col-span-1 border-primary/10">
                    <CardHeader>
                        <CardTitle className="text-lg italic font-bold">Recent Signups</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {usersLoading ? (
                                <div className="text-sm text-muted-foreground py-10 text-center">Loading users...</div>
                            ) : (
                                recentUsers.map((u) => (
                                    <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-transparent hover:border-primary/20 transition-all cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                {u.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{u.email.split('@')[0]}</p>
                                                <p className="text-xs text-muted-foreground italic">{u.email}</p>
                                            </div>
                                        </div>
                                        <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="capitalize">{u.role}</Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 border-primary/20 bg-primary/5 shadow-lg shadow-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg italic font-bold">System Health</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                         <div className="size-32 rounded-full border-8 border-primary border-t-transparent animate-spin mb-4" />
                         <p className="text-sm font-bold uppercase tracking-widest text-primary">All Services Operational</p>
                         <p className="text-xs text-muted-foreground mt-2">Firebase: Connective | AI: Stable</p>
                    </CardContent>
                </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
