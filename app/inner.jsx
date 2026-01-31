"use client";

import { useState } from "react";
import Sidebar from "@/components/shared/dashboard/sidebar";
import MobileHeader from "@/components/shared/mobile-header";
import DesktopHeader from "@/components/shared/desktop-header";
import TopHeader from "@/top-header";

export default function PageShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tab, setTab] = useState("personal");

  return (
    <div className="w-full min-h-screen bg-gray-50 relative font-sans">
      {/* ===== Headers ===== */}
      {/* Mobile Header: visible only on mobile */}
      <TopHeader />
      <div className="fixed top-0 left-0 w-full z-20 md:hidden">
        <MobileHeader value={tab} onChange={setTab} />
      </div>

      {/* Desktop Header: visible only on md+ */}
      <div className="hidden md:block">
        <DesktopHeader value={tab} onChange={setTab} />
      </div>

      {/* ===== Sidebar ===== */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* ===== Main Content ===== */}
      <main
        className={`
          flex-1 w-full
          ${/* Add top padding to prevent content from hiding under headers */ ""}
          
   
        `}
      >
        {children}
      </main>
    </div>
  );
}
