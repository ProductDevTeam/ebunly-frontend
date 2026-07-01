"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";

// Temporary mock personalization types + colors until the backend provides them.
const DEFAULT_TYPES = [
  { name: "Engraving", extraPrice: 2500 },
  { name: "Embroidery", extraPrice: 3500 },
];
const DEFAULT_COLORS = ["Black", "White", "Gold", "Silver", "Rose Gold"];

const EMPTY = {
  enabled: false,
  type: null,
  extraPrice: 0,
  text: "",
  textColor: "Black",
};

/**
 * Personalization — three states driven purely by the `value` object:
 *   A. closed        (!enabled)                → "Add Personalization"
 *   B. choosing type (enabled && !type)        → list of types + "Select"
 *   C. summary/edit  (enabled && type)         → inline-editable Text / Text Color / Type
 */
export default function ProductPersonalization({
  value = EMPTY,
  onChange,
  types = DEFAULT_TYPES,
  colors = DEFAULT_COLORS,
}) {
  const set = (patch) => onChange?.({ ...value, ...patch });

  // ── A. Closed ──────────────────────────────────────────────────────────────
  if (!value.enabled) {
    return (
      <button
        type="button"
        onClick={() => onChange?.({ ...EMPTY, enabled: true })}
        className="mt-3 w-full px-5 py-4 flex items-center justify-center gap-2 rounded-2xl bg-[#F5F5F5] text-gray-900 hover:bg-gray-100 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-base font-semibold">Add Personalization</span>
      </button>
    );
  }

  const remove = () => onChange?.({ ...EMPTY });

  // ── B. Choosing a type ──────────────────────────────────────────────────────
  if (!value.type) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-3 rounded-2xl border border-gray-200 overflow-hidden"
      >
        <button
          type="button"
          onClick={remove}
          className="w-full text-center py-3.5 text-base font-semibold text-gray-900"
        >
          – Remove Personalization
        </button>

        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {types.map((t) => (
            <div
              key={t.name}
              className="flex items-center justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <p className="text-base text-gray-900">{t.name}</p>
                <p className="text-[13px] text-gray-400 mt-0.5">
                  Incurs an extra ₦{t.extraPrice.toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => set({ type: t.name, extraPrice: t.extraPrice })}
                className="shrink-0 rounded-full bg-[#FFF1EC] text-[#F85826] text-sm font-semibold px-5 py-2 hover:bg-[#FFE7DF] transition-colors"
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  // ── C. Summary / inline edit ────────────────────────────────────────────────
  const rowClass =
    "flex items-center justify-between gap-3 py-4 border-b border-gray-100";
  const valueInputClass =
    "min-w-0 flex-1 text-right bg-transparent text-base text-gray-900 placeholder:text-gray-300 focus:outline-none";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-1">Personalization</h3>

      {/* Text — free input */}
      <div className={rowClass}>
        <span className="text-base text-gray-500 shrink-0">Text</span>
        <input
          type="text"
          value={value.text}
          onChange={(e) => set({ text: e.target.value })}
          placeholder="Enter text"
          className={valueInputClass}
        />
      </div>

      {/* Text Color — inline select */}
      <div className={rowClass}>
        <span className="text-base text-gray-500 shrink-0">Text Color</span>
        <select
          value={value.textColor}
          onChange={(e) => set({ textColor: e.target.value })}
          className="appearance-none bg-transparent text-right text-base text-gray-900 pr-1 cursor-pointer focus:outline-none"
        >
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Type — the selected personalization */}
      <div className={rowClass}>
        <span className="text-base text-gray-500 shrink-0">Type</span>
        <span className="text-base text-gray-900">{value.type}</span>
      </div>

      {/* Update — back to the chooser to change type or remove */}
      <div className="flex justify-center pt-5">
        <button
          type="button"
          onClick={() => set({ type: null })}
          className="rounded-full bg-[#FFF1EC] text-[#F85826] text-base font-semibold px-8 py-3 hover:bg-[#FFE7DF] transition-colors"
        >
          Update Personalization
        </button>
      </div>
    </motion.div>
  );
}
