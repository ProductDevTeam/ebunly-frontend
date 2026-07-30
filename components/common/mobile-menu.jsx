"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useRecentSearches } from "@/hooks/use-recent-searches";

/*
 * Measured from `design screenshots/Slideout menu mobile.png` (300 × 852, 1x):
 * 20px side padding, 37px search pill, 31px event pill, 51px category rows.
 */
const SURFACE = "#FDFBF9";
const HAIRLINE = "#F2EDE8";
const ROW_LINE = "#F7F4F1";
const INK = "#24201C";

export default function MobileMenu({ open, categories = [], onClose }) {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { addRecent } = useRecentSearches();

  useScrollLock(open);

  // The field had no submit at all, so typing here did nothing. Same target as
  // the search overlay: remember the term and hand it to the results page.
  const submit = (event) => {
    event.preventDefault();
    const q = search.trim();
    if (!q) return;
    addRecent(q);
    setSearch("");
    onClose();
    router.push(`/discover?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 z-40 bg-black/25"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="md:hidden fixed inset-y-0 left-0 z-50 w-[300px] max-w-[85vw] border-r overflow-y-auto scrollbar-hide"
            style={{ backgroundColor: SURFACE, borderColor: HAIRLINE }}
          >
            {/* Logo + close */}
            <div className="flex items-center justify-between px-5 pt-5">
              <Link
                href="/"
                onClick={onClose}
                className="font-panchang font-bold text-[18px] leading-[21px] tracking-tight text-black"
              >
                EBUNLY
              </Link>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="-mr-0.5"
              >
                <X size={20} strokeWidth={1.5} color="#292D32" />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 mt-5">
              <form
                onSubmit={submit}
                className="flex items-center gap-[15px] h-[37px] rounded-full border px-[13px] cursor-text"
                style={{ borderColor: HAIRLINE }}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6E6659"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="search"
                  placeholder="Search for anything..."
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 min-w-0 bg-transparent text-[13px] focus:outline-none placeholder:text-[#24201C]"
                  style={{ color: INK }}
                />
              </form>
            </div>

            {/* Shopping for an event */}
            <div className="px-5 mt-4">
              <button
                type="button"
                className="inline-flex items-center h-[31px] rounded-full border px-5 text-[13px] whitespace-nowrap"
                style={{ borderColor: "#993C1D", color: "#712B13" }}
              >
                Shopping for an event?
              </button>
            </div>

            {/* Categories */}
            <p
              className="px-5 mt-10 text-[11px] font-medium leading-[13px] tracking-[0.02em]"
              style={{ color: INK }}
            >
              CATEGORIES
            </p>

            <nav className="px-5 pb-6">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/shop/categories/${cat.id}`}
                  onClick={onClose}
                  className="flex items-center h-[51px] text-[15px]"
                  style={{
                    color: INK,
                    borderBottom:
                      i === categories.length - 1
                        ? "none"
                        : `1px solid ${ROW_LINE}`,
                  }}
                >
                  {cat.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
