import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconVideo, IconEye, IconCalendar } from "@tabler/icons-react";
import React from "react";
import { useSessions } from "@/hooks/use-sessions";

export default function SessionReviewPage() {
  const { sessions, loading } = useSessions();

  return (
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
              <h1 className="text-3xl font-bold tracking-tight text-primary">Session Review</h1>
              <p className="text-muted-foreground mt-1 text-sm">Audit and evaluate practice recordings and AI transcripts.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {loading ? (
                    <div className="col-span-full py-10 text-center text-muted-foreground">Loading sessions...</div>
                ) : (
                    sessions.map((s) => (
                        <Card key={s.id} className="group hover:ring-2 ring-primary/20 transition-all cursor-pointer">
                            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                                <div className="space-y-1">
                                    <Badge variant="outline" className="text-[9px] uppercase tracking-tighter shadow-none">S-{s.id.slice(-4).toUpperCase()}</Badge>
                                    <CardTitle className="text-sm font-bold truncate max-w-[120px]">{s.userId.slice(0, 8)}</CardTitle>
                                </div>
                                <div className={`size-8 rounded-full flex items-center justify-center ${s.type === 'video' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'}`}>
                                    <IconVideo className="size-4" />
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="aspect-video bg-muted rounded-lg overflow-hidden relative flex items-center justify-center border group-hover:border-primary/40 transition-colors">
                                    {s.videoUrl ? (
                                        <video src={s.videoUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <IconVideo className="size-8 text-muted-foreground/40 group-hover:scale-110 transition-transform" />
                                    )}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <Button size="sm" variant="secondary" className="rounded-full shadow-lg">Review Clip</Button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-center">
                                    <div className="bg-muted/30 p-2 rounded-md">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Type</p>
                                        <p className="font-bold text-[10px] capitalize">{s.type}</p>
                                    </div>
                                    <div className="bg-muted/30 p-2 rounded-md">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Status</p>
                                        <p className="font-bold text-[10px] capitalize">{s.status}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
                   <div className="flex items-center gap-4">
                      <div className="size-12 rounded-full bg-background border flex items-center justify-center font-bold italic shadow-xs text-primary">AI</div>
                      <div>
                         <CardTitle className="text-lg italic font-bold">Evaluation Workbench</CardTitle>
                         <CardDescription className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5"><IconCalendar className="size-3" /> Select a session to review</span>
                         </CardDescription>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <Button variant="outline" className="rounded-full" disabled>Share Feedback</Button>
                      <Button className="rounded-full px-6" disabled>Approve Session</Button>
                   </div>
                </CardHeader>
                <CardContent className="p-10 flex flex-col items-center justify-center text-muted-foreground">
                    <IconEye className="size-12 mb-4 opacity-20" />
                    <p className="text-sm font-medium italic">Click on a session card above to load detailed analysis</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
