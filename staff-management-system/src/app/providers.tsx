"use client";
import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import AuthWatcher from "@/components/Auth/AuthWatcher";
import { queryClient } from "@/lib/queryClient";
import { ThemeProvider } from "@/lib/theme-provider";

export function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <SessionProvider>
        <AuthWatcher />
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}