"use client";
import React from "react";
import AuthWatcher from "@/components/Auth/AuthWatcher";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <AuthWatcher />
      {children}
    </SessionProvider>
  );
}
