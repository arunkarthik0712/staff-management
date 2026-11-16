import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";
import { geistSans } from "./font";

export const metadata: Metadata = {
  title: "Dashboard Bootstrap",
  description: "Dashboard starter with TanStack and custom UI",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col min-h-screen overflow-x-hidden ${geistSans.variable} antialiased `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
