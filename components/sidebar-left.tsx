"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

import { LayoutDashboard, Package, Truck } from "lucide-react";

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
  const pathname = usePathname();

  const [user, setUser] = React.useState<UserDetails | null>(null);

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
    <Sidebar
      collapsible="icon"
      className="bg-white/90 backdrop-blur-md shadow-2xl border-r border-border/50"
    >
      {/* HEADER */}
      <SidebarHeader className="h-16 px-4 flex items-center">
        {state === "expanded" && (
          <span className="text-lg font-bold tracking-tight">
            Inventory
          </span>
        )}
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent className="px-2">
        <SidebarMenu>

          {/* DASHBOARD */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Dashboard"
              isActive={pathname === "/dashboard"}
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span className={state === "collapsed" ? "sr-only" : ""}>
                  Dashboard
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* PRODUCTS */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Products"
              isActive={pathname === "/products"}
            >
              <Link href="/products">
                <Package />
                <span className={state === "collapsed" ? "sr-only" : ""}>
                  Products
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* SUPPLIERS */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Suppliers"
              isActive={pathname === "/suppliers"}
            >
              <Link href="/suppliers">
                <Truck />
                <span className={state === "collapsed" ? "sr-only" : ""}>
                  Suppliers
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />

      {/* FOOTER */}
      <SidebarFooter className="p-2">
        {user && userId && (
          <div className="rounded-xl bg-white/80 backdrop-blur-md shadow-lg">
            <NavUser
              user={{
                name: `${user.Firstname} ${user.Lastname}`.trim() || "Unknown User",
                position: user.Role,
                email: user.Email,
                avatar: user.profilePicture || "/avatars/shadcn.jpg",
              }}
              userId={userId}
            />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
