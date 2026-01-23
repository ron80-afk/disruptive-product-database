"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DrawerTitle } from "@/components/ui/drawer";

import { LayoutDashboard, Package, Truck } from "lucide-react";

import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@/contexts/UserContext";
import { NavUser } from "@/components/nav-user";

type UserDetails = {
  Firstname: string;
  Lastname: string;
  Role: string;
  Email: string;
  profilePicture: string;
};

export function SidebarBottom() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const { userId } = useUser();
  const pathname = usePathname();

  const [user, setUser] = React.useState<UserDetails | null>(null);

  /* ---------------- Fetch User ---------------- */
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
        console.error("SidebarBottom user fetch error:", err);
      });
  }, [userId]);

  /* ---------------- MOBILE ONLY ---------------- */
  if (!isMobile) return null;

  return (
    <>
      {/* ================= COLLAPSED BOTTOM BAR (ICON ONLY, NAVIGATES) ================= */}
      {!openMobile && (
        <div
          className="
            fixed
            bottom-0
            left-0
            right-0
            z-40
            flex
            justify-around
            border-t
            border-border/50
            bg-white/95
            backdrop-blur-md
            py-2
            md:hidden
          "
        >
          <Link
            href="/dashboard"
            onClick={() => setOpenMobile(false)}
            className={`flex items-center justify-center ${
              pathname === "/dashboard" ? "text-red-600" : "text-gray-600"
            }`}
            aria-label="Go to Dashboard"
          >
            <LayoutDashboard className="h-6 w-6" />
          </Link>

          <Link
            href="/products"
            onClick={() => setOpenMobile(false)}
            className={`flex items-center justify-center ${
              pathname === "/products" ? "text-red-600" : "text-gray-600"
            }`}
            aria-label="Go to Products"
          >
            <Package className="h-6 w-6" />
          </Link>

          <Link
            href="/suppliers"
            onClick={() => setOpenMobile(false)}
            className={`flex items-center justify-center ${
              pathname === "/suppliers" ? "text-red-600" : "text-gray-600"
            }`}
            aria-label="Go to Suppliers"
          >
            <Truck className="h-6 w-6" />
          </Link>
        </div>
      )}

      {/* ================= EXPANDED DRAWER ================= */}
      <Drawer open={openMobile} onOpenChange={setOpenMobile}>
        <DrawerContent
          className="
            bg-white/95
            backdrop-blur-md
            shadow-2xl
            border-t
            border-border/50
            rounded-t-2xl
            max-h-[85svh]
            p-0
          "
        >
          <VisuallyHidden>
            <DrawerTitle>Bottom navigation</DrawerTitle>
          </VisuallyHidden>

          {/* HEADER */}
          <div className="h-14 px-4 flex items-center justify-center border-b">
            <span className="text-base font-semibold tracking-tight text-gray-900">
              Inventory
            </span>
          </div>

          {/* CONTENT */}
          <div className="px-2 py-2 space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setOpenMobile(false)}
              className={`
                flex items-center gap-3 rounded-md p-3 transition
                ${
                  pathname === "/dashboard"
                    ? "bg-red-600 text-white"
                    : "hover:bg-red-50 hover:text-red-700"
                }
              `}
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/products"
              onClick={() => setOpenMobile(false)}
              className={`
                flex items-center gap-3 rounded-md p-3 transition
                ${
                  pathname === "/products"
                    ? "bg-red-600 text-white"
                    : "hover:bg-red-50 hover:text-red-700"
                }
              `}
            >
              <Package />
              <span>Products</span>
            </Link>

            <Link
              href="/suppliers"
              onClick={() => setOpenMobile(false)}
              className={`
                flex items-center gap-3 rounded-md p-3 transition
                ${
                  pathname === "/suppliers"
                    ? "bg-red-600 text-white"
                    : "hover:bg-red-50 hover:text-red-700"
                }
              `}
            >
              <Truck />
              <span>Suppliers</span>
            </Link>
          </div>


        </DrawerContent>
      </Drawer>
    </>
  );
}
