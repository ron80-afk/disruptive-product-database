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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";

type UserDetails = {
  Firstname: string;
  Lastname: string;
  Role: string;
  profilePicture: string;
};

export function SidebarLeft() {
  const { state } = useSidebar();
  const { userId } = useUser();

  const [user, setUser] = React.useState<UserDetails>({
    Firstname: "",
    Lastname: "",
    Role: "",
    profilePicture: "",
  });

  /* ================= USER INFO ================= */
  React.useEffect(() => {
    if (!userId) return;

    fetch(`/api/users?id=${encodeURIComponent(userId)}`)
      .then((res) => res.json())
      .then((data) => {
        setUser({
          Firstname: data.Firstname || "",
          Lastname: data.Lastname || "",
          Role: data.Role || "",
          profilePicture: data.profilePicture || "",
        });
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
                {state === "expanded" && <span>Dashboard</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      {/* FOOTER — MIMICS NavUser FEEL */}
      <SidebarFooter className="px-3 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.profilePicture || "/avatars/shadcn.jpg"}
              alt="User"
            />
            <AvatarFallback>
              {user.Firstname?.[0]}
              {user.Lastname?.[0]}
            </AvatarFallback>
          </Avatar>

          {state === "expanded" && (
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-medium">
                {`${user.Firstname} ${user.Lastname}`.trim() || "Unknown User"}
              </div>
              <div className="truncate text-xs text-muted-foreground">
                {user.Role}
              </div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
