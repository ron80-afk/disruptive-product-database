"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarBottom } from "@/components/sidebar-bottom";

import { Menu } from "lucide-react";

/* ---------------- Types ---------------- */
type UserData = {
  Firstname: string;
  Lastname: string;
  Role: string;
};

/* ===================================================== */
/* INNER CONTENT — SAFE PLACE TO USE useSidebar() */
/* ===================================================== */
function DashboardContent() {
  const router = useRouter();
  const { userId, setUserId } = useUser();
  const { toggleSidebar } = useSidebar();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch User ---------------- */
  useEffect(() => {
    if (userId === null) return;

    if (!userId) {
      router.push("/login");
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`/api/users?id=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId, router]);

  /* ---------------- Logout ---------------- */
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setUserId(null);
    router.push("/login");
  }

  return (
    <div className="flex min-h-screen w-full">

{/* DESKTOP SIDEBAR ONLY */}
<div className="hidden md:block">
  <SidebarLeft />
</div>

      {/* MOBILE BOTTOM SIDEBAR */}
      <SidebarBottom />

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 space-y-4">

        {/* DESKTOP TOGGLE */}
        <SidebarTrigger className="hidden md:flex" />

        {/* HEADER */}
        <h1 className="text-2xl font-bold">
          {loading ? (
            "Loading..."
          ) : user ? (
            <>
              Welcome, {user.Firstname} {user.Lastname}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({user.Role})
              </span>
            </>
          ) : (
            "Welcome"
          )}
        </h1>

        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </main>


    </div>
  );
}

/* ===================================================== */
/* OUTER WRAPPER — PROVIDER ONLY */
/* ===================================================== */
export default function Dashboard() {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
}
