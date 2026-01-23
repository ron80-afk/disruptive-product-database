import type { Metadata } from "next";
import { Oxanium } from "next/font/google";
import "./globals.css";

import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from "sonner";

import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarBottom } from "@/components/sidebar-bottom";

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
            <div className="relative flex min-h-[100svh] w-full">

              <div className="hidden md:block">
                <SidebarLeft />
              </div>

              <div className="md:hidden">
                <SidebarBottom />
              </div>

              <main
                className="
                  flex-1
                  overflow-y-auto
                  overscroll-contain
                  pb-[calc(144px+env(safe-area-inset-bottom))]
                  md:pb-0
                "
              >
                {children}
              </main>

            </div>
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
