import React from "react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { getMenuItems } from "./menuItems";

const DashboardLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const menuItems = getMenuItems();
  return (
    <Sidebar menuItems={menuItems} drawerBreakpoint="md">
      {children}
    </Sidebar>
  );
};

export { DashboardLayout };
