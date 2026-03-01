"use client";

import { useState, useEffect } from "react";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FILTER_CONFIG = [
  {
    label: "Occasion",
    key: "occasions",
    multi: true,
    options: [
      { label: "Birthday", value: "Birthday" },
      { label: "Wedding", value: "Wedding" },
      { label: "Anniversary", value: "Anniversary" },
      { label: "Valentine", value: "Valentine" },
      { label: "Christmas", value: "Christmas" },
      { label: "Corporate", value: "Cooperate" },
    ],
  },
  {
    label: "Gift Type",
    key: "giftTypes",
    multi: true,
    options: [
      { label: "For Him", value: "For_Him" },
      { label: "For Her", value: "For_Her" },
      { label: "For Kids", value: "For_Kids" },
      { label: "Boxes & Hampers", value: "Boxes_Hampers" },
      { label: "Beauty & Grooming", value: "Beauty_Grooming" },
      { label: "Accessories", value: "Accessories" },
      { label: "Home & Decor", value: "Home_Decor" },
      { label: "Personalised Gifts", value: "Personalised" },
      { label: "Flowers & Cards", value: "Flowers_Cards" },
      { label: "Corporate", value: "Cooperate" },
    ],
  },
  {
    label: "Price",
    key: "price",
    multi: false,
    options: [
      { label: "Under ₦10,000", minPrice: 0, maxPrice: 10000 },
      { label: "₦10,000 – ₦25,000", minPrice: 10000, maxPrice: 25000 },
      { label: "₦25,000 – ₦50,000", minPrice: 25000, maxPrice: 50000 },
      { label: "Above ₦50,000", minPrice: 50000, maxPrice: undefined },
    ],
  },
];

const QUICK_FILTERS = [
  { label: "Discounts", key: "discounts", emoji: "🏷️" },
  { label: "Made In Naija", key: "madeInNigeria", emoji: "🇳🇬" },
];

const EMPTY_FILTERS = {
  occasions: [],
  giftTypes: [],
  minPrice: undefined,
  maxPrice: undefined,
  minDiscount: undefined,
  madeInNigeria: undefined,
};

// Resolves a human-readable label for a chip from filter key + value
function getChipLabel(key, value, allOptions) {
  if (key === "madeInNigeria") return "🇳🇬 Made In Naija";
  if (key === "minDiscount") return `🏷️ ${value}%+ off`;
  if (key === "price") {
    const { minPrice, maxPrice } = value;
    if (maxPrice === undefined) return `Above ₦${minPrice.toLocaleString()}`;
    if (minPrice === 0) return `Under ₦${maxPrice.toLocaleString()}`;
    return `₦${minPrice.toLocaleString()} – ₦${maxPrice.toLocaleString()}`;
  }
  // For multi-select (occasions, giftTypes) — find label from config
  for (const group of allOptions) {
    const found = group.options?.find((o) => o.value === value);
    if (found) return found.label;
  }
  return value;
}

export default function FilterBar({ onFilterChange, externalFilters }) {
  const [selected, setSelected] = useState(EMPTY_FILTERS);

  // Sync when filters are restored from search history
  useEffect(() => {
    if (!externalFilters) return;
    setSelected({
      occasions: externalFilters.occasions || [],
      giftTypes: externalFilters.giftTypes || [],
      minPrice: externalFilters.minPrice,
      maxPrice: externalFilters.maxPrice,
      minDiscount: externalFilters.minDiscount,
      madeInNigeria: externalFilters.madeInNigeria,
    });
  }, [externalFilters]);

  const emit = (next) => {
    setSelected(next);
    onFilterChange?.(next);
  };

  const handleDropdownSelect = (filter, value) => {
    const next = { ...selected };
    if (filter.key === "price") {
      // toggle off if already selected
      if (
        next.minPrice === value.minPrice &&
        next.maxPrice === value.maxPrice
      ) {
        next.minPrice = undefined;
        next.maxPrice = undefined;
      } else {
        next.minPrice = value.minPrice;
        next.maxPrice = value.maxPrice;
      }
    } else if (filter.multi) {
      const cur = next[filter.key] || [];
      next[filter.key] = cur.includes(value)
        ? cur.filter((v) => v !== value)
        : [...cur, value];
    }
    emit(next);
  };

  const handleQuickFilter = (key) => {
    const next = { ...selected };
    if (key === "madeInNigeria") {
      next.madeInNigeria = next.madeInNigeria === true ? undefined : true;
    }
    if (key === "discounts") {
      next.minDiscount = next.minDiscount !== undefined ? undefined : 20;
    }
    emit(next);
  };

  // Build flat chip list from current selections
  const chips = [];
  (selected.occasions || []).forEach((v) =>
    chips.push({
      key: "occasions",
      value: v,
      label: getChipLabel("occasions", v, FILTER_CONFIG),
    }),
  );
  (selected.giftTypes || []).forEach((v) =>
    chips.push({
      key: "giftTypes",
      value: v,
      label: getChipLabel("giftTypes", v, FILTER_CONFIG),
    }),
  );
  if (selected.minPrice !== undefined || selected.maxPrice !== undefined) {
    chips.push({
      key: "price",
      value: { minPrice: selected.minPrice, maxPrice: selected.maxPrice },
      label: getChipLabel("price", {
        minPrice: selected.minPrice,
        maxPrice: selected.maxPrice,
      }),
    });
  }
  if (selected.madeInNigeria) {
    chips.push({
      key: "madeInNigeria",
      value: true,
      label: getChipLabel("madeInNigeria", true),
    });
  }
  if (selected.minDiscount !== undefined) {
    chips.push({
      key: "minDiscount",
      value: selected.minDiscount,
      label: getChipLabel("minDiscount", selected.minDiscount),
    });
  }

  const removeChip = (chip) => {
    const next = { ...selected };
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
    emit(next);
  };

  const clearAll = () => emit({ ...EMPTY_FILTERS });

  return (
    <div className="bg-white hidden md:block border-b border-gray-100">
      {/* ── Filter row ── */}
      <div className="px-8 py-3 flex flex-wrap items-center gap-1">
        {/* Icon */}
        <SlidersHorizontal className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />

        {/* Dropdown filters */}
        {FILTER_CONFIG.map((filter) => {
          const activeCount =
            filter.key === "price"
              ? selected.minPrice !== undefined
                ? 1
                : 0
              : (selected[filter.key] || []).length;
          const isActive = activeCount > 0;

          return (
            <div key={filter.label} className="relative group">
              <button
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200"
                    : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:text-orange-600"
                }`}
              >
                {filter.label}
                {isActive && activeCount > 1 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold bg-white text-orange-500 rounded-full">
                    {activeCount}
                  </span>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform group-hover:rotate-180 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
              </button>

              {/* Dropdown */}
              <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30 py-1.5 overflow-hidden">
                {filter.options.map((option) => {
                  const isOptionActive =
                    filter.key === "price"
                      ? selected.minPrice === option.minPrice &&
                        selected.maxPrice === option.maxPrice
                      : (selected[filter.key] || []).includes(option.value);

                  return (
                    <button
                      key={option.label}
                      onClick={() =>
                        handleDropdownSelect(
                          filter,
                          filter.key === "price" ? option : option.value,
                        )
                      }
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                        isOptionActive
                          ? "bg-orange-50 text-orange-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                      {isOptionActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* Quick filters */}
        {QUICK_FILTERS.map((filter) => {
          const isActive =
            filter.key === "madeInNigeria"
              ? selected.madeInNigeria === true
              : selected.minDiscount !== undefined;

          return (
            <button
              key={filter.key}
              onClick={() => handleQuickFilter(filter.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                isActive
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm shadow-orange-200"
                  : "bg-white text-gray-700 border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              <span>{filter.emoji}</span>
              {filter.label}
            </button>
          );
        })}

        {/* Clear all */}
        {chips.length > 0 && (
          <button
            onClick={clearAll}
            className="ml-auto text-xs text-gray-400 hover:text-red-400 transition-colors font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* ── Active filter chips strip ── */}
      <AnimatePresence>
        {chips.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-3 flex flex-wrap gap-2">
              {chips.map((chip, i) => (
                <motion.span
                  key={`${chip.key}-${chip.value}`}
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
  );
}
