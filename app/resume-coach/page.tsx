"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { IconUpload, IconFileText, IconCheck, IconTarget, IconUsers, IconSettings, IconMessageCode } from "@tabler/icons-react"
import { Progress } from "@/components/ui/progress";
import { ProtectedRoute } from "@/components/providers/protected-route";
import { useAuth } from "@/components/providers/auth-provider"
import { resumeService } from "@/services/resumeService"

export default function ResumeCoachPage() {
  const { user } = useAuth()
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<any>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setAnalyzing(true)
    try {
      const result = await resumeService.uploadAndAnalyze(user.uid, file)
      setAnalysis(result.analysis)
    } catch (err) {
      console.error("Resume analysis error:", err)
    } finally {
      setAnalyzing(false)
    }
  }
  const suggestions = [
    { category: "Sales Metrics", text: "Add more quantifiable achievements (e.g., 'Exceeded quota by 20%').", impact: "High" },
    { category: "Prospecting", text: "Mention specific outreach tools like SalesLoft or Outreach.io.", impact: "Medium" },
    { category: "CRM Usage", text: "Highlight proficiency in Salesforce/HubSpot CRM management.", impact: "High" },
    { category: "Cold Outreach", text: "Detail your experience with high-volume cold calling and emailing.", impact: "Medium" }
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
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Resume Coach</h1>
              <p className="text-muted-foreground mt-1">AI-powered resume analysis tailored for SDR and AE roles.</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column: Upload & Score */}
              <div className="xl:col-span-1 space-y-6">
                <Card className="border-dashed border-2 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="size-16 rounded-full bg-background shadow-xs flex items-center justify-center mb-4">
                      <IconUpload className="size-8 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Upload Resume</CardTitle>
                    <CardDescription className="max-w-[200px] mt-2 text-xs">
                      Drag and drop your resume (PDF) here to get AI feedback.
                    </CardDescription>
                    <Button variant="outline" className="mt-6 rounded-full px-6">Select File</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center justify-between">
                      Resume Strength Score
                      <Badge className="bg-amber-500 hover:bg-amber-600">Needs Work</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <span className="text-5xl font-bold">68</span>
                      <span className="text-muted-foreground text-xl">/100</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Your resume is stronger than 42% of other SDR candidates.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Feedback Panel */}
              <div className="xl:col-span-2 space-y-6">
                <Card className="h-full">
                  <CardHeader className="border-b bg-muted/20">
                    <CardTitle className="text-lg flex items-center gap-2">
                       {analysis ? <IconTarget className="size-5 text-primary" /> : <IconMessageCode className="size-5 text-primary" />}
                       {analysis ? "AI Strategic Analysis" : "AI Improvement Suggestions"}
                    </CardTitle>
                    <CardDescription>
                      {analysis ? "In-depth insights based on your sales metrics." : "Targeting: Software Development Representative (SDR)"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {analysis ? (
                      <div className="p-6 space-y-8">
                        <div>
                          <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Extracted Sales Metrics</h4>
                          <div className="p-4 bg-primary/5 rounded-lg border italic text-sm">
                            "{analysis.salesMetrics}"
                          </div>
                        </div>
                        <div className="space-y-4">
                           <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Competency Scores</h4>
                           {[
                             { label: "Prospecting Experience", value: 90 },
                             { label: "CRM Proficiency", value: 85 }
                           ].map((item, i) => (
                             <div key={i}>
                               <div className="flex justify-between text-xs mb-1">
                                 <span>{item.label}</span>
                                 <span className="font-bold">{item.value}%</span>
                               </div>
                               <Progress value={item.value} className="h-1" />
                             </div>
                           ))}
                        </div>
                        <div>
                           <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Strategic Suggestions</h4>
                           <ul className="space-y-3">
                            {analysis.suggestions.map((s: string, i: number) => (
                              <li key={i} className="flex gap-3 text-sm">
                                <IconCheck className="size-4 text-green-500 mt-0.5 shrink-0" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {suggestions.map((s, i) => (
                          <div key={i} className="p-6 flex gap-4 hover:bg-muted/10 transition-colors">
                            <div className={`shrink-0 size-8 rounded-full flex items-center justify-center ${s.impact === 'High' ? 'bg-red-500/10 text-red-600' : 'bg-amber-500/10 text-amber-600'}`}>
                               <IconTarget className="size-5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                  <h4 className="font-semibold text-sm">{s.category}</h4>
                                  <Badge variant="outline" className="scale-75 origin-left">{s.impact} Impact</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{s.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="bg-primary/5 p-6 border-t flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <IconCheck className="size-4 text-green-500" />
                        {analysis ? "Ready for SDR Role Match" : "Ready to analyze your next version"}
                    </div>
                    <Button variant="default" size="sm" onClick={() => setAnalysis(null)}>
                      {analysis ? "Reset Analysis" : "Download Sample Report"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
