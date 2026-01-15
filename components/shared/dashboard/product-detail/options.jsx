"use client";

import { ChevronDown } from "lucide-react";

export default function ProductOptions({
  options,
  selectedOptions,
  onOptionChange,
}) {
  return (
    <div className="px-4 py-3 space-y-3">
      {/* Quantity */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Quantity</span>
        <div className="relative">
          <select
            value={selectedOptions.quantity}
            onChange={(e) => onOptionChange("quantity", Number(e.target.value))}
            className="appearance-none bg-white rounded-lg pl-3 pr-6 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
          >
            {options.quantity.map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 pointer-events-none"
            strokeWidth={4}
          />
        </div>
      </div>

      {/* Length */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Length</span>
        <div className="relative">
          <select
            value={selectedOptions.length}
            onChange={(e) => onOptionChange("length", e.target.value)}
            className="appearance-none  rounded-lg pl-3 pr-6 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
          >
            {options.length.map((length) => (
              <option key={length} value={length}>
                {length}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 pointer-events-none"
            strokeWidth={4}
          />
        </div>
      </div>

      {/* Color */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Color</span>
        <div className="relative">
          <select
            value={selectedOptions.color}
            onChange={(e) => onOptionChange("color", e.target.value)}
            className="appearance-none bg-white rounded-lg pl-3 pr-6 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
          >
            {options.color.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 pointer-events-none"
            strokeWidth={4}
          />
        </div>
      </div>
    </div>
  );
}
