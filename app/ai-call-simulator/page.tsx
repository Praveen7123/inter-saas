"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CallSimulator } from "@/components/call-simulator";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/providers/protected-route";

export default function AICallSimulatorPage() {
  const scenarios = [
    { title: "Competitor Swap", desc: "Prospect already using Close.io", difficulty: "Intermediate" },
    { title: "Pricing Stall", desc: "Prospect asks for pricing too early", difficulty: "Advanced" },
    { title: "Brush Off", desc: "Prospect says 'send me an email'", difficulty: "Beginner" },
    { title: "Budget Objection", desc: "Prospect says 'no budget this year'", difficulty: "Intermediate" }
  ];

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
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Call Area */}
              <div className="xl:col-span-3 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">AI Sales Call Simulator</h1>
                  <p className="text-muted-foreground mt-1">Practice high-stakes cold calls with AI-driven prospects.</p>
                </div>
                
                <CallSimulator />
              </div>

              {/* Sidebar/Controls Area */}
              <div className="space-y-6">
                <h2 className="font-semibold text-lg flex items-center justify-between">
                  Scenarios
                  <Badge variant="outline" className="font-normal">AI Powered</Badge>
                </h2>
                <div className="flex flex-col gap-4">
                  {scenarios.map((s, i) => (
                    <Card key={i} className={`cursor-pointer hover:border-primary/40 transition-colors ${i === 0 ? 'border-primary bg-primary/5' : ''}`}>
                      <CardHeader className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <CardTitle className="text-sm">{s.title}</CardTitle>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            s.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-600' : 
                            s.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-600' : 
                            'bg-amber-500/10 text-amber-600'
                          }`}>
                            {s.difficulty}
                          </span>
                        </div>
                        <CardDescription className="text-xs">{s.desc}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                <div className="p-6 rounded-xl border border-dashed text-center space-y-3">
                  <h3 className="font-medium text-sm">Session Goal</h3>
                  <p className="text-xs text-muted-foreground italic">
                    "Identify the prospect's current pain points and book a 15-minute discovery call."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
