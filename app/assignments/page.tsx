"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { IconMail, IconMessageDots, IconFileInvoice, IconMicrophone } from "@tabler/icons-react";
import { ProtectedRoute } from "@/components/providers/protected-route";
import { useAssignments } from "@/hooks/use-assignments";

export default function AssignmentsPage() {
  const { assignments, loading } = useAssignments();

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
          <div className="@container/main flex flex-1 flex-col gap-2 p-4 lg:p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-primary">Assignments</h1>
              <p className="text-muted-foreground mt-1">Complete sales training tasks and exercises to sharpen your skills.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                  <div className="col-span-full py-20 text-center text-muted-foreground italic">Fetching your tasks...</div>
              ) : assignments.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                      No active assignments found. Check back later!
                  </div>
              ) : (
                assignments.map((a, i) => (
                  <Card key={a.id} className="flex flex-col @container/card border-2 hover:border-primary/20 transition-all shadow-xs">
                    <CardHeader>
                      <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                        <IconMail className="size-5" />
                      </div>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{a.title}</CardTitle>
                        <Badge variant={a.status === 'completed' ? 'secondary' : 'outline'} className="text-[10px] uppercase">
                          {a.status}
                        </Badge>
                      </div>
                      <CardDescription className="text-sm pt-2 min-h-[60px]">
                        {a.description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto border-t p-4 flex justify-between items-center bg-muted/20">
                      <span className="text-[10px] text-muted-foreground font-mono italic">ASSIGNED TASK</span>
                      <Button size="sm" variant={a.status === 'completed' ? 'ghost' : 'default'} className="rounded-full">
                        {a.status === 'completed' ? 'View Submission' : 'Start Task'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
