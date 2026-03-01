"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, Trash2, Tag } from "lucide-react";
import {
  useSearchHistory,
  buildFilterSummary,
} from "@/hooks/use-search-history";

export default function SearchBar({
  onSearch,
  onRestoreFilters,
  className = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const { history, saveToHistory, clearHistory, removeEntry } =
    useSearchHistory();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    setIsFocused(false);
  }, []);

  const handleRestoreSearch = useCallback(
    (entry) => {
      const searchValue = entry.filters.search || "";
      setSearchTerm(searchValue);
      setIsFocused(false);
      // Restore full filter state to parent
      onRestoreFilters?.(entry.filters);
    },
    [onRestoreFilters],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && searchTerm.trim()) {
        setIsFocused(false);
        onSearch?.(searchTerm);
      }
      if (e.key === "Escape") {
        setIsFocused(false);
        inputRef.current?.blur();
      }
    },
    [searchTerm, onSearch],
  );

  const showDropdown = isFocused && history.length > 0;

  return (
    <div
      ref={containerRef}
      className={`bg-white px-4 lg:px-8 py-2 flex-1 relative ${className}`}
    >
      <div className="max-w-2xl">
        <div className="relative">
          {/* Search Icon */}
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <Image
              src="/icons/search.svg"
              alt="Search"
              width={20}
              height={20}
              priority={false}
            />
          </span>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for anything..."
            className="
              w-full pl-10 pr-10 py-2.5
              border border-gray-200 rounded-xl
              font-sans placeholder:font-medium placeholder:text-[#CACACA]
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent
              transition-all duration-200
            "
          />

          {/* Clear button */}
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                onSearch?.("");
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Recent Searches Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-50">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Recent Searches
                </span>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear all
                </button>
              </div>

              {/* History entries */}
              <ul className="py-1">
                {history.map((entry, i) => (
                  <motion.li
                    key={entry.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="group flex items-start gap-3 px-4 py-2.5 hover:bg-orange-50 cursor-pointer transition-colors"
                    onClick={() => handleRestoreSearch(entry)}
                  >
                    {/* Clock icon */}
                    <Clock className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0 group-hover:text-orange-400 transition-colors" />

                    {/* Filter tags */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1.5">
                        {entry.summary.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-700 transition-colors"
                          >
                            {idx === 0 &&
                            entry.filters.search === tag ? null : (
                              <Tag className="w-2.5 h-2.5 opacity-60" />
                            )}
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeEntry(entry.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex-shrink-0 mt-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
