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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Pencil, Trash2 } from "lucide-react";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ---------------- Types ---------------- */
type UserData = {
  Firstname: string;
  Lastname: string;
  Role: string;
};

type Supplier = {
  id: string;
  company: string;
  internalCode?: string;
  address: string;
  email?: string;
  website?: string;
  contacts?: { name: string; phone: string }[];
  forteProducts?: string[];
  products?: string[];
  certificates?: string[];
};

/* ---------------- Component ---------------- */
function Suppliers() {
  const router = useRouter();
  const { userId } = useUser();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  /* ---------------- Auth / User ---------------- */
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
        setUser(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [userId, router]);

  /* ---------------- Fetch Suppliers (REALTIME) ---------------- */
  useEffect(() => {
    const q = query(
      collection(db, "suppliers"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSuppliers(list as Supplier[]);
    });

    return () => unsub();
  }, []);

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

          {/* TABLE */}
          <div className="rounded-md border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Actions</TableHead>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Internal Code</TableHead>
                  <TableHead>Full Address</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Website</TableHead>
                  <TableHead>Contact Name(s)</TableHead>
                  <TableHead>Phone Number(s)</TableHead>
                  <TableHead>Forte Product(s)</TableHead>
                  <TableHead>Product(s)</TableHead>
                  <TableHead>Certificate(s)</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {suppliers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-center text-muted-foreground py-8"
                    >
                      No suppliers yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  suppliers.map((s) => (
                    <TableRow key={s.id}>
                      {/* ACTIONS */}
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="icon" variant="outline">
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button size="icon" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        {s.company}
                      </TableCell>

                      <TableCell>{s.internalCode || "-"}</TableCell>

                      <TableCell className="max-w-xs truncate">
                        {s.address}
                      </TableCell>

                      <TableCell>{s.email || "-"}</TableCell>

                      <TableCell>{s.website || "-"}</TableCell>

                      <TableCell>
                        {s.contacts?.length
                          ? s.contacts.map((c) => c.name).join(", ")
                          : "-"}
                      </TableCell>

                      <TableCell>
                        {s.contacts?.length
                          ? s.contacts.map((c) => c.phone).join(", ")
                          : "-"}
                      </TableCell>

                      <TableCell>
                        {s.forteProducts?.join(", ") || "-"}
                      </TableCell>

                      <TableCell>
                        {s.products?.join(", ") || "-"}
                      </TableCell>

                      <TableCell>
                        {s.certificates?.join(", ") || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
