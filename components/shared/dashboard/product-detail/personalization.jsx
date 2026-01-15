"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, X } from "lucide-react";

export default function ProductPersonalization({
  personalization,
  fields,
  onToggle,
  onChange,
}) {
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
              {fields.map((field) => (
                <div key={field.id} className="space-y-1">
                  <label
                    htmlFor={field.id}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>

                  {field.type === "text" && (
                    <div className="relative">
                      <input
                        type="text"
                        id={field.id}
                        value={personalization[field.id]}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        maxLength={field.maxLength}
                        placeholder="Enter text"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                      />
                      {field.maxLength && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                          {personalization[field.id].length}/{field.maxLength}
                        </span>
                      )}
                    </div>
                  )}

                  {field.type === "select" && (
                    <div className="relative">
                      <select
                        id={field.id}
                        value={personalization[field.id]}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        className="appearance-none w-full border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
                      >
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                    </div>
                  )}
                </div>
              ))}

              {/* Show Personalization Options Link */}
              <button className="text-orange-600 text-sm font-medium hover:underline">
                See Personalization Options
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
