import { DatabaseBackup, LayoutPanelTop, MonitorSmartphone } from "lucide-react";

export const SettingsList = [
  {
    title: 'Groups',
    description: 'Manage and customize groups configurations',
    icon: LayoutPanelTop,
    href: '/settings/groups'
  },
  {
    title: 'Station',
    description: 'Manage and customize station configurations',
    icon: MonitorSmartphone,
    href: '/settings/station'
  },
  {
    title: 'Backup',
    description: 'Backup your data',
    icon: DatabaseBackup,
    href: '/settings/backup'
  },
];
