"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import FluentNavLink from "./FluentNavLink";

export default function HomeNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 px-4 md:px-8 bg-white/10 backdrop-blur-md border-b border-white/20 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-xs"
        >
          Department of BCA
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg bg-white/15 text-white hover:bg-white/25 transition-colors cursor-pointer"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Desktop Quick Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/login"
            className={`text-xs font-semibold px-4 py-2 rounded-md transition-colors ${
              pathname === "/login"
                ? "bg-white/30 text-white shadow-xs border border-white/30"
                : "bg-white/20 hover:bg-white/30 text-white border border-white/15"
            }`}
          >
            Staff Login
          </Link>
        </div>
      </header>

      {/* Glass Sidebar (Desktop fixed, Mobile slide-in drawer) */}
      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white/15 backdrop-blur-xl border-r border-white/20 p-6 flex flex-col z-40 transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-100/70 mb-4">
            Navigation
          </h2>
          <nav className="flex flex-col gap-2.5">
            <div onClick={() => setMobileOpen(false)}>
              <FluentNavLink href="/" active={pathname === "/"}>
                Staff Details
              </FluentNavLink>
            </div>
            <div onClick={() => setMobileOpen(false)}>
              <FluentNavLink href="/login" active={pathname === "/login"}>
                Login
              </FluentNavLink>
            </div>
          </nav>
        </div>
      </aside>

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 top-16 bg-black/40 backdrop-blur-xs z-30"
        />
      )}
    </>
  );
}
