import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { IconReportAnalytics, IconMessageChatbot, IconUserCheck, IconEye, IconMoodSmile, IconBolt, IconActivity } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSessions } from "@/hooks/use-sessions";

export default function MyReportsPage() {
  const { sessions, loading } = useSessions();
  const behavioralScores = [
    { label: "Eye Contact", score: 85, icon: IconEye },
    { label: "Engagement", score: 92, icon: IconMoodSmile },
    { label: "Confidence", score: 78, icon: IconBolt },
    { label: "Movement", score: 90, icon: IconActivity }
  ];

  const skillScores = [
    { label: "Communication Clarity", score: "8/10" },
    { label: "Discovery Questions", score: "7/10" },
    { label: "Product Value Explanation", score: "9/10" },
    { label: "Objection Handling", score: "6/10" }
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
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">My Reports</h1>
              <p className="text-muted-foreground mt-1">Detailed AI evaluation results and behavioral analysis from your practice sessions.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column: Reports Table */}
              <div className="xl:col-span-2 space-y-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Session History</CardTitle>
                      <CardDescription>All your practice sessions and their scores.</CardDescription>
                    </div>
                    <IconReportAnalytics className="size-6 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="p-0">
                    {loading ? (
                       <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">Loading reports...</div>
                    ) : (
                       <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                          <thead>
                            <tr className="bg-muted/30 text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                              <th className="px-6 py-4">Session Type</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">Score</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {sessions.map((session) => (
                              <tr key={session.id} className="hover:bg-muted/10 transition-colors">
                                <td className="px-6 py-4 font-medium capitalize">{session.type.replace('_', ' ')}</td>
                                <td className="px-6 py-4">
                                  <Badge variant={session.status === 'completed' ? 'default' : 'secondary'} className="rounded-md">
                                    {session.status}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 font-bold">{session.score || "—"}%</td>
                                <td className="px-6 py-4 text-muted-foreground italic">
                                  {session.startedAt?.toDate().toLocaleDateString() || "Recently"}
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <Button variant="ghost" size="sm" className="rounded-full shadow-xs">View Report</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                       </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <IconMessageChatbot className="size-5 text-primary" />
                      Transcript Viewer
                    </CardTitle>
                    <CardDescription>Session ID: PS-98234 — Handling Objections (SaaS)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] border rounded-lg p-4 bg-muted/20">
                      <div className="space-y-4 text-sm leading-relaxed">
                        <p><span className="font-bold text-primary">AI:</span> "We're currently using a competitor's product and we're happy with it."</p>
                        <p><span className="font-bold">You:</span> "That's great to hear! Many of our current clients were in the same position before they saw how our integration capabilities could save them 10 hours a week. What specific features are you finding most valuable right now?"</p>
                        <p><span className="font-bold text-primary">AI:</span> "Well, the reporting suite is quite comprehensive."</p>
                        <p><span className="font-bold">You:</span> "Understandable. Reporting is crucial. Have you ever felt that it takes too long to get the data insights you need for your weekly meetings?"</p>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Detail View */}
              <div className="space-y-6">
                <Card>
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <IconUserCheck className="size-4" />
                        Skills Evaluation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 divide-y">
                    {skillScores.map((s, i) => (
                      <div key={i} className="flex justify-between items-center p-4">
                        <span className="text-sm text-muted-foreground">{s.label}</span>
                        <span className="font-bold text-primary">{s.score}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Behavioral Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4 pt-0">
                    {behavioralScores.map((b, i) => (
                      <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border bg-muted/20 hover:bg-muted/30 transition-colors">
                        <b.icon className="size-5 text-muted-foreground mb-2" />
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">{b.label}</span>
                        <span className="text-xl font-bold">{b.score}%</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <h4 className="font-semibold text-green-700 dark:text-green-400 text-sm mb-2">Overall Recommendation</h4>
                  <p className="text-xs text-green-600 dark:text-green-500 leading-relaxed italic">
                    "Your discovery technique is improving, but focus on more direct objection handling techniques in your next session to increase your confidence score."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
