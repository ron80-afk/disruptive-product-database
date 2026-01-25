"use client";

import * as React from "react";
import { useState } from "react";

import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

/* ---------------- Types ---------------- */
export type SupplierFilterValues = {
  company: string;
  internalCode: string;
  email: string;
  hasContacts: boolean | null;
  sortAlpha: "asc" | "desc" | "";
  phoneCountry: string;
};

type FilterSupplierProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: SupplierFilterValues) => void;
};

export default function FilterSupplier({
  open,
  onOpenChange,
  onApply,
}: FilterSupplierProps) {
  const [company, setCompany] = useState("");
  const [internalCode, setInternalCode] = useState("");
  const [email, setEmail] = useState("");
  const [hasContacts, setHasContacts] = useState<boolean | null>(null);
  const [sortAlpha, setSortAlpha] = useState<"asc" | "desc" | "">("");
  const [phoneCountry, setPhoneCountry] = useState("");

  const handleApply = () => {
    onApply({
      company,
      internalCode,
      email,
      hasContacts,
      sortAlpha,
      phoneCountry,
    });
    onOpenChange(false);
  };

  const handleClear = () => {
    setCompany("");
    setInternalCode("");
    setEmail("");
    setHasContacts(null);
    setSortAlpha("");
    setPhoneCountry("");

    onApply({
      company: "",
      internalCode: "",
      email: "",
      hasContacts: null,
      sortAlpha: "",
      phoneCountry: "",
    });

    onOpenChange(false);
  };

  const countryOptions = Object.entries(
    countries.getNames("en", { select: "official" })
  ).map(([code, name]) => ({
    code,
    name,
  }));


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Suppliers</DialogTitle>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 text-sm">
          {/* Company */}
          <div>
            <label className="font-medium">Company Name</label>
            <input
              className="w-full h-9 border rounded-md px-3"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          {/* Internal Code */}
          <div>
            <label className="font-medium">Internal Code</label>
            <input
              className="w-full h-9 border rounded-md px-3"
              value={internalCode}
              onChange={(e) => setInternalCode(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="font-medium">Email Contains</label>
            <input
              className="w-full h-9 border rounded-md px-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Has Contacts */}
          <div>
            <label className="font-medium">Has Contacts</label>
            <select
              className="w-full h-9 border rounded-md px-3"
              value={
                hasContacts === null
                  ? ""
                  : hasContacts
                    ? "yes"
                    : "no"
              }
              onChange={(e) => {
                if (!e.target.value) setHasContacts(null);
                else setHasContacts(e.target.value === "yes");
              }}
            >
              <option value="">Any</option>
              <option value="yes">With Contacts</option>
              <option value="no">Without Contacts</option>
            </select>
          </div>

          {/* Phone Country */}
          <div>
            <label className="font-medium">Contact Phone Country</label>
            <select
              className="w-full h-9 border rounded-md px-3"
              value={phoneCountry}
              onChange={(e) => setPhoneCountry(e.target.value)}
            >
              <option value="">Any</option>
              {countryOptions.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>


          {/* Alphabetical Sort */}
          <div>
            <label className="font-medium">Alphabetical Order</label>
            <select
              className="w-full h-9 border rounded-md px-3"
              value={sortAlpha}
              onChange={(e) =>
                setSortAlpha(e.target.value as "asc" | "desc" | "")
              }
            >
              <option value="">None</option>
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
          <Button onClick={handleApply}>Apply Filter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
