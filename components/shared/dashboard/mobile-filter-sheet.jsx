"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const FILTER_CONFIG = {
  occasion: {
    label: "Occasion",
    options: ["Birthday", "Wedding", "Anniversary", "Valentine", "Christmas"],
  },
  giftType: {
    label: "Gift Type",
    options: [
      "For Him",
      "For Her",
      "For Kids",
      "Boxes & Hampers",
      "Beauty & Grooming",
      "Accessories",
      "Home & Decor",
      "Personalised Gifts",
      "Flowers & Cards",
    ],
  },
  price: {
    label: "Price",
    options: [
      "Under ₦10,000",
      "₦10,000 – ₦25,000",
      "₦25,000 – ₦50,000",
      "Above ₦50,000",
    ],
  },
  discounts: {
    label: "Discounts",
    options: ["10% off", "20% off", "30% off"],
  },
};

export default function MobileFilterSheet({ activeFilter, onClose }) {
  const sheetRef = useRef(null);
  const [selected, setSelected] = useState([]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        onClose();
      }
    }

    if (activeFilter) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [activeFilter, onClose]);

  if (!activeFilter) return null;

  const filter = FILTER_CONFIG[activeFilter];

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-black/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Slide-down panel */}
      <motion.div
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
        <div className="flex flex-wrap gap-2">
          {filter.options.map((option, label) => {
            const isActive = selected.includes(option);

            return (
              <button
                key={label}
                onClick={() =>
                  setSelected((prev) =>
                    isActive
                      ? prev.filter((v) => v !== option)
                      : [...prev, option]
                  )
                }
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-orange-100 text-primary"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white"
          >
            Apply
          </button>

          <button
            onClick={() => setSelected([])}
            className="w-full text-center text-sm font-medium text-gray-500"
          >
            Reset
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
