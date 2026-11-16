"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDown,
  User,
  GraduationCap,
  Briefcase,
  Award,
  MoreHorizontal,
  FileText,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/lib/theme-provider";

interface NavGroup {
  label: string;
  icon: any;
  items: { label: string; href: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Details",
    icon: User,
    items: [
      { label: "Personal Details", href: "/dashboard/personal" },
      { label: "Academic Details", href: "/dashboard/academic" },
    ],
  },
  {
    label: "Experience / Certificate",
    icon: Briefcase,
    items: [
      { label: "Work Experience", href: "/dashboard/work" },
      { label: "Teaching / Research / Field", href: "/dashboard/exp" },
      { label: "Course / Certificates", href: "/dashboard/course" },
      { label: "Conference / Workshop", href: "/dashboard/conference" },
    ],
  },
  {
    label: "Research / Journal / Book",
    icon: GraduationCap,
    items: [
      { label: "Research Details (Ph.D.)", href: "/dashboard/research" },
      { label: "Research Guided", href: "/dashboard/research_guide" },
      { label: "Paper Presented", href: "/dashboard/paper" },
      { label: "Publication in Journal", href: "/dashboard/journal" },
      { label: "Publication in Book", href: "/dashboard/published" },
    ],
  },
  {
    label: "Award / Projects",
    icon: Award,
    items: [
      { label: "Awards Received", href: "/dashboard/awards" },
      { label: "Research Projects", href: "/dashboard/reproject" },
    ],
  },
  {
    label: "Others",
    icon: MoreHorizontal,
    items: [
      { label: "Extension Activities", href: "/dashboard/extension" },
      { label: "Resource Person", href: "/dashboard/resource" },
      { label: "Books Published / Edited", href: "/dashboard/book" },
      { label: "Conf/Workshop Organized", href: "/dashboard/conf_wrk_sem_detail" },
    ],
  },
];

export default function StaffSidebar() {
  const pathname = usePathname();
  const { data: session }: any = useSession();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Keep all dropdowns open by default for rapid navigation
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Details: true,
    "Experience / Certificate": true,
    "Research / Journal / Book": true,
    "Award / Projects": true,
    Others: true,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const userId = session?.user?.id;

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-sidebar text-sidebar-foreground border-b border-sidebar-border px-4 flex items-center justify-between shadow-xs">
        <Link href="/" className="font-bold text-sm text-sidebar-foreground truncate">
          Department of BCA
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors cursor-pointer"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-1.5 rounded-lg bg-primary text-primary-foreground transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar (Desktop Sticky, Mobile Sliding Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-40 h-screen w-72 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border overflow-y-auto transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header & Desktop Theme Toggle */}
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          <Link href="/" className="block">
            <h1 className="text-lg font-bold tracking-tight text-sidebar-foreground">
              Department of BCA
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Staff Management Portal</p>
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden md:flex p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors cursor-pointer"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>

        {/* Navigation Groups matching PHP dropdowns */}
        <nav className="flex-1 p-4 space-y-3 text-sm">
          {navGroups.map((group) => {
            const isOpen = openGroups[group.label];
            const Icon = group.icon;
            return (
              <div key={group.label} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-sidebar-foreground rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Icon size={14} className="text-primary" />
                    {group.label}
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="pl-4 space-y-0.5 border-l border-sidebar-border ml-3">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={`block px-3 py-1.5 rounded-md text-xs transition-colors ${
                            isActive
                              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-2 border-t border-sidebar-border space-y-1">
            <Link
              href="/dashboard/additional"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                pathname === "/dashboard/additional"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <FileText size={14} />
              + Additional Information
            </Link>

            {userId && (
              <a
                href={`/api/report?user_id=${userId}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/10 transition-colors"
              >
                <FileText size={14} />
                Generate Report (PDF)
              </a>
            )}
          </div>
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
