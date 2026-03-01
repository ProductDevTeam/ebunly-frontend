"use client";

import { useState, useEffect } from "react";
import MobileFilterSheet from "./mobile-filter-sheet";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FILTER_LABELS = {
  occasion: "Occasion",
  giftType: "Gift Type",
  price: "Price",
  discounts: "🏷️ Discounts",
};

function getActiveButtonKeys(applied) {
  const active = new Set();
  if (applied.occasions?.length) active.add("occasion");
  if (applied.giftTypes?.length) active.add("giftType");
  if (applied.minPrice !== undefined || applied.maxPrice !== undefined)
    active.add("price");
  if (applied.minDiscount !== undefined || applied.madeInNigeria)
    active.add("discounts");
  return active;
}

function buildChips(applied) {
  const chips = [];
  (applied.occasions || []).forEach((v) =>
    chips.push({ key: "occasions", value: v, label: v }),
  );
  (applied.giftTypes || []).forEach((v) =>
    chips.push({ key: "giftTypes", value: v, label: v.replace(/_/g, " ") }),
  );
  if (applied.minPrice !== undefined || applied.maxPrice !== undefined) {
    const { minPrice, maxPrice } = applied;
    const label =
      maxPrice === undefined
        ? `Above ₦${Number(minPrice).toLocaleString()}`
        : minPrice === 0
          ? `Under ₦${Number(maxPrice).toLocaleString()}`
          : `₦${Number(minPrice).toLocaleString()} – ₦${Number(maxPrice).toLocaleString()}`;
    chips.push({ key: "price", value: { minPrice, maxPrice }, label });
  }
  if (applied.madeInNigeria)
    chips.push({
      key: "madeInNigeria",
      value: true,
      label: "🇳🇬 Made In Naija",
    });
  if (applied.minDiscount !== undefined)
    chips.push({
      key: "minDiscount",
      value: applied.minDiscount,
      label: `${applied.minDiscount}%+ off`,
    });
  return chips;
}

const EMPTY = {
  occasions: [],
  giftTypes: [],
  minPrice: undefined,
  maxPrice: undefined,
  minDiscount: undefined,
  madeInNigeria: undefined,
};

export default function MobileFilterBar({ onFilterChange, externalFilters }) {
  const [activeFilter, setActiveFilter] = useState(null);
  const [applied, setApplied] = useState(EMPTY);

  useEffect(() => {
    if (!externalFilters) return;
    setApplied({
      occasions: externalFilters.occasions || [],
      giftTypes: externalFilters.giftTypes || [],
      minPrice: externalFilters.minPrice,
      maxPrice: externalFilters.maxPrice,
      minDiscount: externalFilters.minDiscount,
      madeInNigeria: externalFilters.madeInNigeria,
    });
  }, [externalFilters]);

  const handleSheetApply = (newFilters) => {
    const next = { ...applied, ...newFilters };
    setApplied(next);
    onFilterChange?.(next);
  };

  const removeChip = (chip) => {
    const next = { ...applied };
    if (chip.key === "occasions" || chip.key === "giftTypes") {
      next[chip.key] = next[chip.key].filter((v) => v !== chip.value);
    } else if (chip.key === "price") {
      next.minPrice = undefined;
      next.maxPrice = undefined;
    } else if (chip.key === "madeInNigeria") {
      next.madeInNigeria = undefined;
    } else if (chip.key === "minDiscount") {
      next.minDiscount = undefined;
    }
    setApplied(next);
    onFilterChange?.(next);
  };

  const clearAll = () => {
    setApplied(EMPTY);
    onFilterChange?.(EMPTY);
  };

  const activeButtons = getActiveButtonKeys(applied);
  const chips = buildChips(applied);

  return (
    <>
      <div className="lg:hidden bg-white border-b border-gray-100 font-sans">
        {/* Filter buttons row */}
        <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto scrollbar-none">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />

          {Object.entries(FILTER_LABELS).map(([key, label]) => {
            const isActive = activeButtons.has(key);
            const count =
              key === "occasion"
                ? applied.occasions?.length
                : key === "giftType"
                  ? applied.giftTypes?.length
                  : 0;

            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`whitespace-nowrap flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                {label}
                {isActive && count > 1 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold bg-white text-orange-500 rounded-full leading-none">
                    {count}
                  </span>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-400"}`}
                />
              </button>
            );
          })}

          {chips.length > 0 && (
            <button
              onClick={clearAll}
              className="whitespace-nowrap flex-shrink-0 text-xs font-semibold text-red-400 px-2"
            >
              Clear
            </button>
          )}
        </div>

        {/* Active chips strip */}
        <AnimatePresence>
          {chips.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {chips.map((chip, i) => (
                  <motion.span
                    key={`${chip.key}-${String(chip.value)}`}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ delay: i * 0.03 }}
                    className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200"
                  >
                    {chip.label}
                    <button
                      onClick={() => removeChip(chip)}
                      className="w-4 h-4 rounded-full bg-orange-200 hover:bg-orange-400 hover:text-white text-orange-600 flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileFilterSheet
        activeFilter={activeFilter}
        onClose={() => setActiveFilter(null)}
        onFilterChange={handleSheetApply}
        currentFilters={applied}
      />
    </>
  );
}
