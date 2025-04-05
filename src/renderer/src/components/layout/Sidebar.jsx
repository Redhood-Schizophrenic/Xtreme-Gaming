'use client';

import { ChartGantt, ChartLine, Monitor, PackageIcon, Settings, UsersRound, Wrench } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@renderer/components/ui/sidebar"
import { useLocation } from 'react-router';

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/home",
    icon: ChartLine,
  },
  {
    title: "Bookings",
    url: "/bookings",
    icon: Monitor,
  },
  {
    title: "Reports & Analytics",
    url: "/reports",
    icon: ChartGantt
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: 'Inventory',
    url: "/inventory",
    icon: PackageIcon,
  },
  {
    title: 'Customer List',
    url: "/settings/customer",
    icon: UsersRound,
  },
  {
    title: 'Admin Settings',
    url: "/settings/admin",
    icon: Settings,
  },
  {
    title: 'Xtreme Settings',
    url: "/settings/xtreme",
    icon: Wrench,
  },
]

export function AppSidebar() {
  const pathname = useLocation().pathname;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={isActive ? 'bg-primary text-background' : ''}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
