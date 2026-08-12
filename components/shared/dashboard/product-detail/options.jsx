"use client";

/*
 * Variant dropdowns — one per variant group (Size, Colour, etc.).
 * Label sits above the select; customer must pick a value before adding to cart.
 */
const HAIRLINE = "#EBE5E0";
const INK = "#24201C";
const LABEL = "#707070";
const BRAND = "#D85A30";

export default function ProductOptions({
  product,
  selectedOptions,
  onOptionChange,
}) {
  const variants = product.variants?.filter((v) => v.options?.length > 0) ?? [];

  if (variants.length === 0) return null;

  return (
    <div className="space-y-4 pb-4">
      {variants.map((variant) => {
        const key = variant.name;
        const current = selectedOptions[key] ?? "";

        return (
          <div key={variant.name}>
            <p
              className="text-[11px] font-medium tracking-[0.04em] mb-2"
              style={{ color: LABEL }}
            >
              {variant.name.toUpperCase()}
            </p>
            <select
              value={current}
              onChange={(e) => onOptionChange(key, e.target.value)}
              className="w-full h-11 rounded-lg border px-3 text-[13px] appearance-none bg-white focus:outline-none"
              style={{
                borderColor: current ? HAIRLINE : HAIRLINE,
                color: current ? INK : LABEL,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236E6659' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
                paddingRight: "36px",
              }}
            >
              <option value="" disabled>
                Select {variant.name}
              </option>
              {variant.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
