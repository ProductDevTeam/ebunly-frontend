"use client";

import { ChevronDown } from "lucide-react";

export default function ProductOptions({
  product,
  selectedOptions,
  onOptionChange,
}) {
  // Generate quantity options based on min/max
  const quantityOptions = Array.from(
    { length: Math.min(product.maxQuantity, 10) },
    (_, i) => i + product.minQuantity,
  );

  return (
    <div className="py-3 space-y-3">
      {/* Quantity */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Quantity</span>
        <div className="relative">
          <select
            value={selectedOptions.quantity}
            onChange={(e) => onOptionChange("quantity", Number(e.target.value))}
            className="appearance-none bg-white rounded-lg pl-3 pr-8 py-2 text-sm font-normal text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
          >
            {quantityOptions.map((qty) => (
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

      {/* Dynamic Variants */}
      {product.variants?.map((variant) => (
        <div key={variant.name} className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{variant.name}</span>
          <div className="relative">
            <select
              value={
                selectedOptions[variant.name.toLowerCase()] ||
                variant.options[0]
              }
              onChange={(e) =>
                onOptionChange(variant.name.toLowerCase(), e.target.value)
              }
              className="appearance-none bg-white rounded-lg pl-3 pr-8 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer"
            >
              {variant.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 pointer-events-none"
              strokeWidth={4}
            />
          </div>
        </div>
      ))}

      {/* Color (if available) */}
      {product.color && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Color</span>
          <span className="text-sm font-bold text-gray-900">
            {product.color}
          </span>
        </div>
      )}

      {/* Weight (if available) */}
      {product.weight && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Weight</span>
          <span className="text-sm font-bold text-gray-900">
            {product.weight}
          </span>
        </div>
      )}
    </div>
  );
}
