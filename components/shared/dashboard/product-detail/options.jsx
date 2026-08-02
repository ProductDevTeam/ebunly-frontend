"use client";

/*
 * Variation groups (LENGTH, COLOR, …) — uppercase label over a pill row.
 * Selected pills use the peach treatment; quantity now sits beside Add to Cart.
 */
const PEACH = "#FAECE7";
const PEACH_BORDER = "#993C1D";
const PEACH_INK = "#712B13";
const HAIRLINE = "#EBE5E0";
const INK = "#24201C";
/* The uppercase micro-labels are a colder grey than body muted text. */
const LABEL = "#707070";

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
        // The exact name, not a lowercased one: POST /cart matches
        // `variantName` case-sensitively and silently drops what it cannot
        // match — losing theselection and its price modifier.
        const key = variant.name;
        const current = selectedOptions[key] ?? variant.options[0];

        return (
          <div key={variant.name}>
            <p
              className="text-[11px] font-medium tracking-[0.04em]"
              style={{ color: LABEL }}
            >
              {variant.name.toUpperCase()}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {variant.options.map((option) => {
                const active = option === current;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onOptionChange(key, option)}
                    aria-pressed={active}
                    className="h-8 rounded-full border px-3 text-[12px] transition-colors"
                    style={
                      active
                        ? {
                            backgroundColor: PEACH,
                            borderColor: PEACH_BORDER,
                            color: PEACH_INK,
                          }
                        : {
                            backgroundColor: "#FFFFFF",
                            borderColor: HAIRLINE,
                            color: INK,
                          }
                    }
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
