"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useTaxonomy } from "@/hooks/use-taxonomy";
import { TAG_FACETS } from "./filterbar";

/*
 * Keyed by the GET /products parameter name, so there is no second mapping
 * between what the sheet shows and what the query sends. The tag facets get
 * their options from the taxonomy; the rest are fixed buckets.
 */
const TAG_KEYS = TAG_FACETS.map((f) => f.key);

const STATIC_CONFIG = {
  price: {
    label: "Price",
    filterKey: "price",
    multi: false,
    options: [
      { label: "Under ₦10,000", minPrice: 0, maxPrice: 10000 },
      { label: "₦10,000 – ₦25,000", minPrice: 10000, maxPrice: 25000 },
      { label: "₦25,000 – ₦50,000", minPrice: 25000, maxPrice: 50000 },
      { label: "Above ₦50,000", minPrice: 50000, maxPrice: undefined },
    ],
  },
  minDiscount: {
    label: "Discounts & More",
    filterKey: "minDiscount",
    multi: false,
    options: [
      { label: "10% off", value: 10 },
      { label: "20% off", value: 20 },
      { label: "30% off", value: 30 },
      { label: "🇳🇬 Made In Naija", value: "madeInNigeria" },
    ],
  },
};

export default function MobileFilterSheet({
  activeFilter,
  onClose,
  onFilterChange,
  currentFilters = {},
}) {
  const sheetRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const taxonomy = useTaxonomy();

  const config = { ...STATIC_CONFIG };
  TAG_FACETS.forEach((facet) => {
    config[facet.key] = {
      label: facet.label,
      filterKey: facet.key,
      multi: true,
      options: (taxonomy[facet.source] ?? []).map((value) => ({
        label: value,
        value,
      })),
    };
  });

  const isTagFacet = (key) => TAG_KEYS.includes(key);

  // Pre-populate from currentFilters when the sheet opens. Every config key is
  // also its filter key, so this reads `activeFilter` rather than the built
  // config — the effect must not depend on something rebuilt every render.
  useEffect(() => {
    if (!activeFilter) return;

    if (TAG_KEYS.includes(activeFilter)) {
      setSelected(currentFilters[activeFilter] || []);
    } else if (activeFilter === "price") {
      const match = STATIC_CONFIG.price.options.find(
        (o) =>
          o.minPrice === currentFilters.minPrice &&
          o.maxPrice === currentFilters.maxPrice,
      );
      setSelected(match ? [match] : []);
    } else if (activeFilter === "minDiscount") {
      const pre = [];
      if (currentFilters.minDiscount !== undefined)
        pre.push(currentFilters.minDiscount);
      if (currentFilters.madeInNigeria) pre.push("madeInNigeria");
      setSelected(pre);
    }
  }, [activeFilter]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) onClose();
    }
    if (activeFilter) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [activeFilter, onClose]);

  if (!activeFilter) return null;
  const filter = config[activeFilter];
  if (!filter) return null;

  const toggleOption = (option) => {
    const val =
      typeof option === "object" && option.value !== undefined
        ? option.value
        : option;

    if (filter.multi) {
      setSelected((prev) =>
        prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val],
      );
    } else {
      // Single select — toggle off if same
      setSelected((prev) => (prev[0] === val ? [] : [val]));
    }
  };

  const isActive = (option) => {
    const val =
      typeof option === "object" && option.value !== undefined
        ? option.value
        : option;
    if (filter.filterKey === "price") {
      return (
        selected[0]?.minPrice === option.minPrice &&
        selected[0]?.maxPrice === option.maxPrice
      );
    }
    return selected.includes(val);
  };

  const handleApply = () => {
    const { filterKey } = filter;
    let payload = {};

    if (isTagFacet(filterKey)) {
      payload[filterKey] = selected;
    } else if (filterKey === "price") {
      payload.minPrice = selected[0]?.minPrice;
      payload.maxPrice = selected[0]?.maxPrice;
    } else if (filterKey === "minDiscount") {
      const discountVal = selected.find((v) => v !== "madeInNigeria");
      payload.minDiscount =
        typeof discountVal === "number" ? discountVal : undefined;
      payload.madeInNigeria = selected.includes("madeInNigeria")
        ? true
        : undefined;
    }

    onFilterChange?.(payload);
    onClose();
  };

  const handleReset = () => {
    setSelected([]);
    const { filterKey } = filter;
    let payload = {};
    if (isTagFacet(filterKey)) payload[filterKey] = [];
    else if (filterKey === "price") {
      payload.minPrice = undefined;
      payload.maxPrice = undefined;
    } else if (filterKey === "minDiscount") {
      payload.minDiscount = undefined;
      payload.madeInNigeria = undefined;
    }
    onFilterChange?.(payload);
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-40 bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Slide-down panel */}
      <motion.div
        key="sheet"
        ref={sheetRef}
        className="fixed top-0 left-0 right-0 z-50 rounded-b-2xl bg-white p-4"
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <h3 className="mb-4 text-center text-sm font-semibold">
          {filter.label}
        </h3>

        {/* Options */}
        <div className="flex max-h-[50vh] flex-wrap gap-2 overflow-y-auto">
          {filter.options.map((option, idx) => {
            const label =
              typeof option === "object" && option.label
                ? option.label
                : option;
            const active = isActive(option);

            return (
              <button
                key={idx}
                onClick={() => toggleOption(option)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-orange-100 text-primary"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleApply}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white"
          >
            Apply
          </button>

          <button
            onClick={handleReset}
            className="w-full text-center text-sm font-medium text-gray-500"
          >
            Reset
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
