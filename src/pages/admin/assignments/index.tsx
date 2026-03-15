import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconListDetails, IconPlus, IconTrash, IconMail } from "@tabler/icons-react";
import React, { useState } from "react";
import { useAssignments } from "@/hooks/use-assignments";

export default function AssignmentManagementPage() {
  const { assignments, loading, createAssignment, deleteAssignment } = useAssignments();
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleCreate = async () => {
    if (!newTitle || !newDesc) return;
    await createAssignment({
      title: newTitle,
      description: newDesc,
      status: 'not started',
      type: 'Assignment',
      assignedTo: 'all'
    });
    setNewTitle("");
    setNewDesc("");
  };

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
              <h1 className="text-3xl font-bold tracking-tight text-primary">Assignment Management</h1>
              <p className="text-muted-foreground mt-1 text-sm">Create and broadcast training tasks to all candidates.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-1 border-primary/20 bg-muted/5">
                    <CardHeader>
                        <CardTitle className="text-lg italic font-bold">New Assignment</CardTitle>
                        <CardDescription>Draft a new task for the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Task Title</label>
                            <Input placeholder="e.g., Cold Outreach Script" className="rounded-lg" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Description</label>
                            <textarea 
                                className="w-full min-h-[100px] p-3 rounded-lg border bg-background text-sm" 
                                placeholder="Describe the task instructions..."
                                value={newDesc}
                                onChange={e => setNewDesc(e.target.value)}
                            />
                        </div>
                        <Button className="w-full rounded-full gap-2 shadow-lg shadow-primary/20" onClick={handleCreate}>
                            <IconPlus className="size-4" />
                            Broadcast Task
                        </Button>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-tighter flex items-center gap-2 px-2">
                        <IconListDetails className="size-4 text-primary" />
                        Active Assignments ({assignments.length})
                    </h3>
                    
                    {loading ? (
                        <div className="py-20 text-center text-muted-foreground italic">Syncing assignments...</div>
                    ) : (
                        <div className="space-y-3">
                            {assignments.length === 0 ? (
                                <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl italic">
                                    No assignments created yet.
                                </div>
                            ) : (
                                assignments.map((a) => (
                                    <Card key={a.id} className="border-primary/10 hover:border-primary/30 transition-all">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <IconMail className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{a.title}</p>
                                                    <p className="text-xs text-muted-foreground italic line-clamp-1">{a.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="text-[10px] uppercase font-mono">{a.status}</Badge>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="size-8 text-red-500 hover:bg-red-50"
                                                    onClick={() => deleteAssignment(a.id)}
                                                >
                                                    <IconTrash className="size-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
