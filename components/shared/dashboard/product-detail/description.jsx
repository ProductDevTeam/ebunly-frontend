"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDescription({ description }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;
  const shouldTruncate = description.length > maxLength;

  return (
    <div className="px-4 py-1">
      <div className="text-sm text-gray-700 leading-relaxed">
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
            className="text-orange-600 bg-orange-50 font-medium mt-2 py-2 px-3 hover:underline inline-flex items-center"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>
    </div>
  );
}
