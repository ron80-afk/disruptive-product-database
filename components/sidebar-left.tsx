"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";

import { useUser } from "@/contexts/UserContext";
import { NavUser } from "@/components/nav-user";

type UserDetails = {
  Firstname: string;
  Lastname: string;
  Role: string;
  Email: string;
  profilePicture: string;
};

export function SidebarLeft() {
const { state, isMobile } = useSidebar();
  const { userId } = useUser();

  const [user, setUser] = React.useState<UserDetails | null>(null);

  /* ================= USER INFO ================= */
  React.useEffect(() => {
    if (!userId) return;

    fetch(`/api/users?id=${encodeURIComponent(userId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => {
        setUser({
          Firstname: data.Firstname ?? "",
          Lastname: data.Lastname ?? "",
          Role: data.Role ?? "",
          Email: data.Email ?? "",
          profilePicture: data.profilePicture ?? "",
        });
      })
      .catch((err) => {
        console.error("Sidebar user fetch error:", err);
      });
  }, [userId]);

  return (
    <Sidebar collapsible="icon">
      {/* HEADER */}
      <SidebarHeader className="h-16 px-4 flex items-center">
        {state === "expanded" && (
          <span className="text-lg font-semibold">Inventory</span>
        )}
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
<Link href="/dashboard">
  <LayoutDashboard />
  {(isMobile || state === "expanded") && <span>Dashboard</span>}
</Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      {/* FOOTER — USER MENU */}
      <SidebarFooter className="p-2">
        {user && userId && (
          <NavUser
            user={{
              name: `${user.Firstname} ${user.Lastname}`.trim() || "Unknown User",
              position: user.Role,
              email: user.Email,
              avatar: user.profilePicture || "/avatars/shadcn.jpg",
            }}
            userId={userId}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
