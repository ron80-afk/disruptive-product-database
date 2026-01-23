"use client";

import { useUser } from "@/contexts/UserContext";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarBottom } from "@/components/sidebar-bottom";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = useUser();

  return (
    <div className="relative flex min-h-[100svh] w-full">
      {/* ✅ SIDEBARS ONLY WHEN LOGGED IN */}
      {userId && (
        <>
          <div className="hidden md:block">
            <SidebarLeft />
          </div>

          <div className="md:hidden">
            <SidebarBottom />
          </div>
        </>
      )}

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
  );
}
