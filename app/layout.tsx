import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";

import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from "sonner";

import { SidebarProvider } from "@/components/ui/sidebar";
import LayoutShell from "@/components/layout-shell";

/* 🔑 VIEWPORT PROTECTION */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-oxanium",
});

export const metadata: Metadata = {
  title: "Inventory Management System",
  description: "Aaron Espiritu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${oxanium.variable}
          antialiased
          min-h-[100svh]
          overscroll-none
        `}
      >
        <UserProvider>
          <SidebarProvider>
            <LayoutShell>{children}</LayoutShell>
          </SidebarProvider>

          <Toaster
            position="top-right"
            closeButton
            toastOptions={{
              className:
                "bg-background border border-border text-foreground shadow-lg rounded-lg",
            }}
          />
        </UserProvider>
      </body>
    </html>
  );
}
