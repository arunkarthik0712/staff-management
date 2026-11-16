import React from "react";
import { LayoutDashboard } from "lucide-react";

export interface SubMenuItem {
  title: string;
  path: string;
  badge?: string;
  hotkey?: string;
}

export interface MenuItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  section?: string;
  badge?: string;
  hotkey?: string;
  subItems?: SubMenuItem[];
}

export const getMenuItems = (role: string = "admin"): MenuItem[] => {
  const adminPath = "/dashboard";
  const menuConfig: Record<string, MenuItem[]> = {
    admin: [
      {
        title: "Dashboard",
        path: adminPath,
        icon: <LayoutDashboard size={18} />,
      },
    ],
  };
  return menuConfig[role] || [];
};
