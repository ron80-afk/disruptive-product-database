"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { SidebarLeft } from "@/components/sidebar-left";
import { Button } from "@/components/ui/button";
import AddSupplier from "@/components/add-supplier";

/* ---------------- Types ---------------- */
type UserData = {
  Firstname: string;
  Lastname: string;
  Role: string;
};

function Suppliers() {
  const router = useRouter();
  const { userId } = useUser();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const [addSupplierOpen, setAddSupplierOpen] = useState(false);

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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* SIDEBAR */}
        <SidebarLeft />

        {/* MAIN */}
        <main className="flex-1 p-6 space-y-6">
          <SidebarTrigger className="hidden md:flex" />

          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Suppliers</h1>

            <Button
              type="button"
              className="gap-1 cursor-pointer"
              onClick={() => setAddSupplierOpen(true)}
            >
              + Add Supplier
            </Button>
          </div>

          {/* EMPTY CONTENT */}
          <div className="text-muted-foreground">
            No suppliers yet.
          </div>
        </main>
      </div>

      {/* ADD SUPPLIER SHEET */}
      <AddSupplier
        open={addSupplierOpen}
        onOpenChange={setAddSupplierOpen}
      />
    </SidebarProvider>
  );
}

export default Suppliers;
