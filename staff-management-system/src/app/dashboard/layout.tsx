import React from "react";
import StaffSidebar from "@/components/sidebar/StaffSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <StaffSidebar />
      <main className="flex-1 min-w-0 pt-16 md:pt-6 p-3 sm:p-6 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}
