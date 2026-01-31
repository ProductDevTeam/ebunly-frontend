"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { Search } from "lucide-react";

const TABS = [
  { key: "personal", label: "Personal" },
  { key: "group", label: "Group" },
];

const NAV_LINKS = [
  { label: "Categories", href: "/categories" },
  { label: "Discover", href: "/discover" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
];

export default function DesktopHeader({ value = "personal", onChange }) {
  return (
    <header className="hidden md:flex items-center justify-between py-4 bg-white font-sans max-w-7xl mx-auto">
      {/* Left: Personal/Group Toggle */}
      <div className="relative flex rounded-full p-1 shrink-0">
        {TABS.map((tab) => {
          const isActive = value === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onChange?.(tab.key)}
              className={clsx(
                "relative z-10 px-6 py-2 text-sm font-medium rounded-full transition-colors",
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}

              {isActive && (
                <motion.div
                  layoutId="desktop-tab-indicator"
                  className="absolute inset-0 -z-10 rounded-full bg-orange-100"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.35,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Center: Navigation Links */}
      <nav className=" flex  items-center gap-8 pr-60">
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Right: Search Icon */}
      <div className="shrink-0">
        <button
          className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          aria-label="Search"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
