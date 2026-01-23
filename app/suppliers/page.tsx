"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarBottom } from "@/components/sidebar-bottom";
import { Button } from "@/components/ui/button";
import AddSupplier from "@/components/add-supplier";
import EditSupplier from "@/components/edit-supplier";
import DeleteSupplier from "@/components/delete-supplier";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Pencil, Trash2, MoreHorizontal, Delete } from "lucide-react";

import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  contacts?: {
    name: string;
    phone: string;
  }[];

  forteProducts?: string[];
  products?: string[];
  certificates?: string[];

  createdBy?: string | null;
  referenceID?: string | null;

  isActive?: boolean;
  createdAt?: any;
  updatedAt?: any;
};

/* ---------------- Component ---------------- */
function Suppliers() {
  const router = useRouter();
  const { userId } = useUser();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const [addSupplierOpen, setAddSupplierOpen] = useState(false);

  const [editSupplierOpen, setEditSupplierOpen] = useState(false);
  const [deleteSupplierOpen, setDeleteSupplierOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    // SEARCH
  const [search, setSearch] = useState("");

  // PAGINATION
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

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
    const list = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      // ✅ CLIENT-SIDE FILTER (Option 3)
      .filter((s: any) => s.isActive !== false);

    setSuppliers(list as Supplier[]);
  });

  return () => unsub();
}, []);

/* ---------------- Search + Pagination Logic ---------------- */

// SEARCH FILTER
const filteredSuppliers = suppliers.filter((s) => {
  const keyword = search.toLowerCase();

  return (
    s.company?.toLowerCase().includes(keyword) ||
    s.internalCode?.toLowerCase().includes(keyword) ||
    s.address?.toLowerCase().includes(keyword) ||
    s.email?.toLowerCase().includes(keyword) ||
    s.website?.toLowerCase().includes(keyword) ||
    s.contacts?.some(
      (c) =>
        c.name.toLowerCase().includes(keyword) ||
        c.phone.toLowerCase().includes(keyword)
    )
  );
});

// PAGINATION
const totalPages = Math.ceil(filteredSuppliers.length / ITEMS_PER_PAGE);

const paginatedSuppliers = filteredSuppliers.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
      {/* DESKTOP SIDEBAR */}
      <SidebarLeft />

      {/* MOBILE BOTTOM SIDEBAR */}
      <SidebarBottom />


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
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 cursor-pointer"
                            onClick={() => {
                              setSelectedSupplier(s);
                              setEditSupplierOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1 cursor-pointer"
                            onClick={() => {
                              setSelectedSupplier(s);
                              setDeleteSupplierOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">{s.company}</TableCell>

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

                      <TableCell>{s.products?.join(", ") || "-"}</TableCell>

                      <TableCell>{s.certificates?.join(", ") || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>

      {/* ADD SUPPLIER SHEET */}
      <AddSupplier open={addSupplierOpen} onOpenChange={setAddSupplierOpen} />
      {selectedSupplier && (
        <EditSupplier
          open={editSupplierOpen}
          onOpenChange={setEditSupplierOpen}
          supplier={selectedSupplier}
        />
      )}
      {selectedSupplier && (
        <DeleteSupplier
          open={deleteSupplierOpen}
          onOpenChange={setDeleteSupplierOpen}
          supplier={selectedSupplier}
        />
      )}
    </SidebarProvider>
  );
}

export default Suppliers;
