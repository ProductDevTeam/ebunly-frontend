"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Search, X } from "lucide-react";
import Link from "next/link";

const TABS = [
  { key: "personal", label: "Personal" },
  { key: "group", label: "Group" },
];

const NAV_LINKS = [
  { label: "Discover", href: "/discover" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
];

export default function DesktopHeader({ value = "personal", onChange }) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSubmit = () => {
    if (!searchTerm.trim()) return;
    router.push(`/discover?search=${encodeURIComponent(searchTerm.trim())}`);
    setSearchOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      setSearchOpen(false);
      setSearchTerm("");
    }
  };

  return (
    <header className="hidden md:flex w-full bg-white font-sans border-b border-gray-100">
      <div className="flex items-center w-full max-w-7xl mx-auto px-6 py-1 gap-6">
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
                  isActive
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="desktop-tab-indicator"
                    className="absolute inset-0 -z-10 rounded-full bg-orange-100"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Center: Nav links — flex-1 to fill space */}
        <nav className="flex items-center gap-8 flex-1 justify-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Search — fixed width so it doesn't squish nav */}
        <div
          ref={containerRef}
          className="shrink-0 flex items-center justify-end w-[240px]"
        >
          <AnimatePresence mode="wait">
            {searchOpen ? (
              <motion.div
                key="search-input"
                initial={{ width: 36, opacity: 0 }}
                animate={{ width: 240, opacity: 1 }}
                exit={{ width: 36, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden"
              >
                <Search className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search products..."
                  className="flex-1 px-2 py-2 text-sm bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400 min-w-0"
                />
                <button
                  onClick={() => {
                    if (searchTerm) setSearchTerm("");
                    else setSearchOpen(false);
                  }}
                  className="mr-1 p-1 text-gray-400 hover:text-gray-600 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!searchTerm.trim()}
                  className="px-3 py-2 bg-primary text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-40 transition-colors shrink-0"
                >
                  Go
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
