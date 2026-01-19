"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { SidebarLeft } from "@/components/sidebar-left";

function Dashboard() {
  const router = useRouter();
  const { setUserId } = useUser();

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    setUserId(null);
    router.push("/login");
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">

        {/* SIDEBAR */}
        <SidebarLeft />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 space-y-4">

          {/* TOGGLE BUTTON */}
          <SidebarTrigger />

          <h1 className="text-2xl font-bold">Dashboard</h1>

          <Button
            onClick={handleLogout}
            className="border border-border cursor-pointer"
          >
            Logout
          </Button>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default Dashboard;
