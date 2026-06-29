"use client";

import { ChevronDown } from "lucide-react";

export default function ProductOptions({
  product,
  selectedOptions,
  onOptionChange,
}) {
  // Generate quantity options based on min/max (with safe fallbacks)
  const minQuantity = product.minQuantity ?? 1;
  const maxQuantity = product.maxQuantity ?? minQuantity;
  const quantityCount = Math.max(
    1,
    Math.min(maxQuantity - minQuantity + 1, 10),
  );
  const quantityOptions = Array.from(
    { length: quantityCount },
    (_, i) => i + minQuantity,
  );

  const cardClass =
    "flex items-center justify-between rounded-2xl bg-white px-5 py-4";
  const selectClass =
    "appearance-none bg-transparent pr-6 text-base font-semibold text-gray-900 text-right cursor-pointer focus:outline-none";

  return (
    <div className="space-y-3">
      {/* Quantity */}
      <div className={cardClass}>
        <span className="text-base text-gray-500">Quantity</span>
        <div className="relative flex items-center">
          <select
            value={selectedOptions.quantity}
            onChange={(e) => onOptionChange("quantity", Number(e.target.value))}
            className={selectClass}
          >
            {quantityOptions.map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-0 h-4 w-4 text-gray-900"
            strokeWidth={3}
          />
        </div>
      </div>

      {/* Dynamic Variants (editable options only) */}
      {product.variants
        ?.filter((variant) => variant.options?.length > 0)
        .map((variant) => (
          <div key={variant.name} className={cardClass}>
            <span className="text-base text-gray-500">{variant.name}</span>
            <div className="relative flex items-center">
              <select
                value={
                  selectedOptions[variant.name.toLowerCase()] ||
                  variant.options[0]
                }
                onChange={(e) =>
                  onOptionChange(variant.name.toLowerCase(), e.target.value)
                }
                className={selectClass}
              >
                {variant.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-0 h-4 w-4 text-gray-900"
                strokeWidth={3}
              />
            </div>
          </div>
        ))}
    </div>
  );
}
