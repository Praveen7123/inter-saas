"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PracticeOptions } from "@/components/practice-options";
import { ProtectedRoute } from "@/components/providers/protected-route";
import { useSessions } from "@/hooks/use-sessions";

export default function PracticeCenterPage() {
  const { sessions, loading } = useSessions();

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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">Practice Center</h1>
                <p className="text-muted-foreground mt-1">Practice SDR interview questions and improve your responses.</p>
              </div>
              
              <PracticeOptions />

              <div className="px-4 lg:px-6 mt-6">
                <section>
                  <h2 className="text-xl font-semibold mb-4">Previous Practice Sessions</h2>
                  <CardContent className="p-0">
                    {loading ? (
                      <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">Loading practice sessions...</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                          <thead>
                            <tr className="bg-muted/30 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                              <th className="px-6 py-4">Type</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {sessions.map((session) => (
                              <tr key={session.id} className="hover:bg-muted/10 transition-colors">
                                <td className="px-6 py-4 font-medium capitalize">{session.type.replace('_', ' ')}</td>
                                <td className="px-6 py-4">
                                  <Badge variant={session.status === 'completed' ? 'default' : 'outline'}>
                                    {session.status}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                  {session.startedAt?.toDate().toLocaleDateString() || "Recently"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <Button variant="ghost" size="sm">Resume</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </section>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
