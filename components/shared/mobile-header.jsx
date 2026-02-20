"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

const TABS = [
  { key: "personal", label: "Personal" },
  { key: "group", label: "Group" },
];

export default function MobileHeader({ value = "personal", onChange }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white font-sans md:hidden">
      <div className="relative flex rounded-full  p-1">
        {TABS.map((tab) => {
          const isActive = value === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onChange?.(tab.key)}
              className={clsx(
                "relative z-10 px-4 py-1 text-sm font-semibold rounded-full transition-colors",
                isActive ? "text-primary" : "text-gray-500 hover:text-gray-700",
              )}
            >
              {tab.label}

              {isActive && (
                <motion.div
                  layoutId="mobile-tab-indicator"
                  className="absolute inset-0 -z-10 rounded-full bg-orange-100"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.35,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Live Basket */}
      <div className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 py-2 px-3 rounded-full">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="text-sm font-semibold text-black">LiveBasket</span>
      </div>
    </div>
  );
}
