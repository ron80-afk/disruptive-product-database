"use client";

import React, { Suspense } from "react";
import ProfileClient from "@/components/profile-update";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function ProfilePage() {
  return (
    <div className="p-6 space-y-4">
      
      {/* DESKTOP SIDEBAR TOGGLE */}
      <SidebarTrigger className="hidden md:flex" />

      <Suspense fallback={<div>Loading profile...</div>}>
        <ProfileClient />
      </Suspense>

    </div>
  );
}
