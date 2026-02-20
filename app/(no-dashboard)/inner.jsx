"use client";
import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/shared/dashboard/sidebar";
import MobileHeader from "@/components/shared/mobile-header";
import DesktopHeader from "@/components/shared/desktop-header";
import TopHeader from "@/top-header";

export default function PageShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tab, setTab] = useState("personal");
  const [visible, setVisible] = useState(true);

  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 0) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full bg-white relative font-sans">
      <TopHeader />

      {/* Mobile Header */}
      <div
        className={`fixed top-0 left-0 w-full z-20 md:hidden transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <MobileHeader value={tab} onChange={setTab} />
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <DesktopHeader value={tab} onChange={setTab} />
      </div>

      {/* Sidebar receives visible prop for bottom nav hide/show */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        visible={visible}
      />

      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
