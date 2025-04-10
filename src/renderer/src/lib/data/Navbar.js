import { ChartNoAxesColumnDecreasing, ChartPie, LayoutDashboard, MonitorPlay, Package, Settings, Users } from "lucide-react";

export const navLinks = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'static-dashboard',
    name: 'Static',
    href: '/static-dashboard',
    icon: MonitorPlay,
  },
  {
    id: 'inventory',
    name: 'Inventory',
    href: '/inventory',
    icon: Package,
  },
  {
    id: 'logs',
    name: 'Logs',
    href: '/logs',
    icon: ChartNoAxesColumnDecreasing,
  },
  {
    id: 'reports',
    name: 'Reports',
    href: '/reports',
    icon: ChartPie,
  },
  {
    id: 'users',
    name: 'Users',
    href: '/users',
    icon: Users,
  },
  {
    id: 'settings',
    name: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];
