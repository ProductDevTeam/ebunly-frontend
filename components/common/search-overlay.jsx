"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { useRecentSearches } from "@/hooks/use-recent-searches";
import { useScrollLock } from "@/hooks/use-scroll-lock";
import SearchSuggestions from "./search-suggestions";

/*
 * Mobile search, from "Mobile - search, empty.png" / "…typing.png": a
 * full-screen sheet over the page, a 42px pill field with a close button
 * beside it, and the panel dropped straight onto the background — no card,
 * no navbar.
 */
const FIELD_BORDER = "#C8ADA3";
const INK = "#24201C";
const MUTED = "#6E6659";

/* Mounted only while open (see navbar), so the query starts empty each time. */
export default function SearchOverlay({ onClose, categories = [] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { addRecent } = useRecentSearches();
  const inputRef = useRef(null);

  useScrollLock(true);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (value) => {
    const q = String(value ?? "").trim();
    if (!q) return;
    addRecent(q);
    onClose?.();
    router.push(`/shop/categories/all?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#FDFBF9] md:hidden">
      <div className="px-4 pt-18">
        <div className="flex items-center gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(query);
            }}
            className="flex h-10.5 flex-1 items-center gap-3 rounded-full border bg-transparent px-4"
            style={{ borderColor: FIELD_BORDER }}
          >
            <Search size={18} strokeWidth={1.75} style={{ color: MUTED }} />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for anything..."
              aria-label="Search"
              className="min-w-0 flex-1 bg-transparent text-[14px] focus:outline-none"
              style={{ color: INK }}
            />
          </form>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0"
          >
            <X size={20} strokeWidth={1.75} style={{ color: INK }} />
          </button>
        </div>

        <div className="pt-6 pb-16">
          <SearchSuggestions
            query={query}
            categories={categories}
            onPick={submit}
            onNavigate={onClose}
          />
        </div>
      </div>
    </div>
  );
}
