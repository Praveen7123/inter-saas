"use client";

import * as React from "react";
import {
  IconBook,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileText,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconPhone,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconVideo,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, role } = useAuth();

  const isAdmin = role === 'admin';

  const navigation = {
    user: {
      name: user?.displayName || user?.email?.split('@')[0] || "User",
      email: user?.email || "",
      avatar: user?.photoURL || "/avatars/default.jpg",
    },
    navMain: [
      {
        title: isAdmin ? "Admin Dashboard" : "Dashboard",
        url: isAdmin ? "/admin/dashboard" : "/dashboard",
        icon: IconDashboard,
      },
      ...(isAdmin ? [
        {
          title: "User Management",
          url: "/admin/users",
          icon: IconUsers,
        },
        {
          title: "Session Review",
          url: "/admin/review",
          icon: IconDatabase,
        },
        {
          title: "Assignment Management",
          url: "/admin/assignments",
          icon: IconListDetails,
        }
      ] : [
        {
          title: "Practice Center",
          url: "/practice-center",
          icon: IconVideo,
        },
        {
          title: "AI Sales Call Simulator",
          url: "/ai-call-simulator",
          icon: IconPhone,
        },
        {
          title: "Assignments",
          url: "/assignments",
          icon: IconFileText,
        },
        {
          title: "Resume Coach",
          url: "/resume-coach",
          icon: IconFileAi,
        },
        {
          title: "My Reports",
          url: "/my-reports",
          icon: IconReport,
        }
      ]),
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
      },
      {
        title: "Get Help",
        url: "#",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "#",
        icon: IconSearch,
      },
    ],
    documents: [
      {
        name: "Training Resources",
        url: "#",
        icon: IconBook,
      },
      {
        name: "Question Bank",
        url: "#",
        icon: IconHelp,
      },
      {
        name: "Scenario Library",
        url: "#",
        icon: IconListDetails,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <IconInnerShadowTop className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-lg tracking-tight">
                    saas<span className="text-amber-500">pire.co</span>
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.navMain} />
        <NavDocuments items={navigation.documents} />
        <NavSecondary items={navigation.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navigation.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
