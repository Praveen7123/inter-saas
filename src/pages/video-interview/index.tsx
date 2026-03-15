import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { VideoSimulator } from "@/components/video-simulator";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function VideoInterviewPage() {
  const instructions = [
    "Speak clearly and maintain eye contact with the camera.",
    "Keep your response between 1-2 minutes.",
    "Use the STAR method (Situation, Task, Action, Result) if applicable.",
    "Smile and show enthusiasm!"
  ];

  const questions = [
    { text: "Introduce yourself as a candidate for this SDR role.", status: "completed" },
    { text: "How do you handle rejection in sales?", status: "active" },
    { text: "Tell me about a time you handled a difficult objection.", status: "upcoming" },
    { text: "What motivates you to work in SaaS sales?", status: "upcoming" }
  ];

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Area */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Video Interview Session</h1>
                  <p className="text-muted-foreground mt-1 text-lg">Simulating: SDR Initial Screen — Module 1</p>
                </div>
                
                <VideoSimulator />
              </div>

              {/* Right Panel */}
              <div className="flex flex-col gap-6">
                <div className="bg-card border rounded-xl p-6 shadow-xs">
                  <h2 className="font-semibold text-lg mb-4">Session Instructions</h2>
                  <ul className="space-y-3">
                    {instructions.map((inst, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-3">
                        <span className="text-primary font-bold">{i + 1}.</span>
                        {inst}
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-6" />
                  <h2 className="font-semibold text-lg mb-4">Interview Flow</h2>
                  <div className="space-y-4">
                    {questions.map((q, i) => (
                      <div key={i} className={`text-sm p-3 rounded-lg border ${q.status === 'active' ? 'bg-primary/5 border-primary/20 ring-1 ring-primary/20' : 'bg-muted/30 border-transparent'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Question {i + 1}</span>
                          <Badge variant={q.status === 'completed' ? 'secondary' : (q.status === 'active' ? 'default' : 'outline')} className="scale-75 origin-right">
                            {q.status}
                          </Badge>
                        </div>
                        <p className={q.status === 'upcoming' ? 'text-muted-foreground' : 'font-medium'}>{q.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/10 rounded-xl p-6">
                  <h3 className="font-semibold mb-2">Recording Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground italic">Audio Level</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5, 6, 7].map(j => <div key={j} className={`w-3 h-1.5 rounded-full ${j < 5 ? 'bg-green-500' : 'bg-muted'}`} />)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground italic">Connection</span>
                      <span className="text-green-500 font-bold">STABLE</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
