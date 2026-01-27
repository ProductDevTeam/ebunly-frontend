"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function SearchBar({ onSearch, className = "" }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]); // Only depend on searchTerm, not onSearch

  return (
    <div className={`bg-white px-4 lg:px-8 py-2 flex-1 ${className}`}>
      <div className="max-w-2xl">
        <div className="relative">
          {/* Search Icon */}
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
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
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for anything..."
            className="
              w-full
              pl-10
              pr-4
              py-2.5
              border border-gray-200
              rounded-xl
              font-sans
              placeholder:font-medium
              placeholder:text-[#CACACA]
              focus:outline-none
              focus:ring-2
              focus:ring-orange-400
              focus:border-transparent
            "
          />
        </div>
      </div>
    </div>
  );
}
