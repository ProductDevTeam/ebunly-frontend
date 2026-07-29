"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDescription({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!description?.trim()) return null;

  const maxLength = 150;
  const shouldTruncate = description.length > maxLength;

  return (
    <div>
      <div className="text-[13px] leading-[150%] text-[#24201C]">
        <AnimatePresence mode="wait">
          {isExpanded || !shouldTruncate ? (
            <motion.p
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {description}
            </motion.p>
          ) : (
            <motion.p
              key="truncated"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {description.slice(0, maxLength)}...
            </motion.p>
          )}
        </AnimatePresence>

        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 inline-flex h-9 items-center rounded-full bg-[#FAECE7] px-4 text-[13px] font-medium text-[#D85A30]"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
}
