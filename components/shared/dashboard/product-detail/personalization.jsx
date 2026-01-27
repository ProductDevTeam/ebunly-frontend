"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";

export default function ProductPersonalization({
  personalization,
  options,
  onToggle,
  onChange,
}) {
  if (!options || options.length === 0) return null;

  return (
    <div className="">
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-center space-x-2 text-orange-600 hover:bg-orange-50 transition-colors"
      >
        {personalization.enabled ? (
          <>
            <X className="w-4 h-4" />
            <span className="text-sm font-medium">Remove Personalization</span>
          </>
        ) : (
          <>
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Personalization</span>
          </>
        )}
      </button>

      {/* Expanded Form */}
      <AnimatePresence>
        {personalization.enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {options.map((option) => (
                <div key={option} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {option}
                  </label>
                  <input
                    type="text"
                    value={personalization.data[option] || ""}
                    onChange={(e) => onChange(option, e.target.value)}
                    placeholder={`Enter ${option.toLowerCase()}`}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
