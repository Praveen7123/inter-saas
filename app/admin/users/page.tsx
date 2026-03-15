"use client"

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/providers/protected-route";
import { DataTable } from "@/components/data-table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IconUsers, IconSearch, IconFilter } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React, { useState } from "react";
import { useUsers } from "@/hooks/use-users";

export default function UserManagementPage() {
  const { users, loading, updateUserRole } = useUsers();
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.displayName?.toLowerCase().includes(search.toLowerCase()))
  );

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
            <div className="flex items-center justify-between mb-6">
                <div>
                   <h1 className="text-3xl font-bold tracking-tight text-primary">User Management</h1>
                   <p className="text-muted-foreground mt-1 text-sm">Review, monitor, and manage all registered candidates.</p>
                </div>
                <Button className="rounded-full shadow-lg shadow-primary/20">Add New User</Button>
            </div>

            <Card className="border-primary/10">
              <CardHeader className="border-b bg-muted/10 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative w-full md:w-96">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search users..." 
                      className="pl-9 rounded-full bg-background" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="rounded-full gap-2">
                        <IconFilter className="size-4" />
                        Filters
                    </Button>
                    <Badge variant="secondary" className="rounded-full px-3">{users.length} Total Users</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="py-20 text-center text-muted-foreground">Loading users...</div>
                    ) : (
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-muted/30 text-muted-foreground uppercase text-[10px] tracking-widest font-bold">
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-muted/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs italic">
                                                    {u.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{u.email.split('@')[0]}</p>
                                                    <p className="text-xs text-muted-foreground">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="rounded-md capitalize">
                                                {u.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground italic">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="rounded-full"
                                                onClick={() => updateUserRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                                            >
                                                Toggle Role
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
    </ProtectedRoute>
  );
}
