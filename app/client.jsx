"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import MobileHeader from "@/components/shared/mobile-header";
import DesktopHeader from "@/components/shared/dashboard/desktop-header";
import Sidebar from "@/components/shared/dashboard/sidebar";
import SearchBar from "@/components/shared/dashboard/search-bar";
import MobileFilterBar from "@/components/shared/dashboard/mobile-filter";

const VALID_TABS = ["personal", "group"];

export default function DashboardShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("mode");
  const tab = VALID_TABS.includes(rawTab) ? rawTab : "personal";

  const setTab = (nextTab) => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", nextTab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden font-sans">
      {/* ===== HEADERS ===== */}
      <MobileHeader
        onMenuClick={() => setIsSidebarOpen(true)}
        value={tab}
        onChange={setTab}
        className="lg:hidden"
      />

      <DesktopHeader value={tab} onChange={setTab} />

      {/* ===== BODY ===== */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile-only search + filter */}
          {/* <div className="flex items-center lg:hidden">
            <SearchBar className="flex-1" />
            <button
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="pr-4"
            >
              <Image src="/filter.svg" alt="Filter" width={40} height={40} />
            </button>
          </div> */}

          {isFilterOpen && (
            <MobileFilterBar onClose={() => setIsFilterOpen(false)} />
          )}

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
