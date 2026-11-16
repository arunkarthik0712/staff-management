"use client";

import React, { useRef } from "react";
import Link from "next/link";

interface FluentNavLinkProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}

export default function FluentNavLink({
  href,
  active = false,
  children,
}: FluentNavLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    linkRef.current.style.border = "1px solid transparent";
    linkRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.05))`;
    linkRef.current.style.borderImage = `radial-gradient(80px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.2)) 9 / 1.5px / 0px stretch`;
    linkRef.current.style.borderRadius = "10px";
  };

  const handleMouseLeave = () => {
    if (!linkRef.current) return;
    linkRef.current.style.background = active
      ? "rgba(255, 255, 255, 0.15)"
      : "transparent";
    linkRef.current.style.border = active
      ? "1px solid rgba(255, 255, 255, 0.3)"
      : "1px solid transparent";
    linkRef.current.style.borderImage = "none";
    linkRef.current.style.borderRadius = "10px";
  };

  return (
    <Link
      ref={linkRef}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`block px-5 py-2.5 rounded-[10px] text-sm font-medium text-white transition-all duration-300 ${
        active ? "bg-white/15 border border-white/30" : "hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
