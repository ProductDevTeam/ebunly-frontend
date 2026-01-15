"use client";

import { useState } from "react";
import MobileFilterSheet from "./mobile-filter-sheet";
import { ChevronDown } from "lucide-react";

export default function MobileFilterBar() {
  const [activeFilter, setActiveFilter] = useState(null);

  return (
    <>
      <div className="flex items-center justify-between gap-2 px-4 py-3 overflow-x-auto bg-white border-b border-gray-200 lg:hidden font-sans overflow-hidden">
        {["occasion", "giftType", "price", "discounts"].map((key) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className="whitespace-nowrap rounded-full border border-gray-200 px-3.5 py-2 flex text-sm font-semibold cursor-pointer items-center justify-center"
          >
            {key === "giftType"
              ? "Gift Type"
              : key.charAt(0).toUpperCase() + key.slice(1)}
            <ChevronDown className="text-black " />
          </button>
        ))}
      </div>

      <MobileFilterSheet
        activeFilter={activeFilter}
        onClose={() => setActiveFilter(null)}
      />
    </>
  );
}
