"use client";

import { useState } from "react";

/*
 * ADD PERSONALIZATION — the four states specced in
 * `design screenshots/Components - Personalization Feature Key Info.png`:
 *
 *   1. idle       no type picked        → label + type pills only
 *   2. empty      type picked, no text  → pills + input + helper + Confirm (disabled)
 *   3. filled     type picked, text     → input border goes brand, Confirm enabled
 *   4. confirmed  confirmed             → `Engraving: "…"` summary + Edit
 *
 * Active type pills are solid #D85A30 with white text — unlike variation and
 * add-on pills, which use the peach treatment. They are also the one pill in
 * the system that is a rounded rect (36px tall, 8px radius) rather than a
 * capsule; both the sheet and the product page draw them that way.
 *
 * Fields here are borderless white on the card's own surface, and take a brand
 * border once they carry a value or focus — the sheet draws the same rule for
 * the wishlist name field.
 */
const BRAND = "#D85A30";
const HAIRLINE = "#EBE5E0";
const INK = "#24201C";
const MUTED = "#6E6659";
/* The uppercase micro-labels are a colder grey than body muted text. */
const LABEL = "#707070";

const DEFAULT_TYPES = [
  { name: "Engraving", extraDays: 2 },
  { name: "Print-on", extraDays: 0 },
  { name: "Sticker", extraDays: 0 },
];

export default function ProductPersonalization({
  types = DEFAULT_TYPES,
  value,
  onChange,
}) {
  const { type = null, text = "", confirmed = false } = value ?? {};
  const [draft, setDraft] = useState(text);

  const set = (patch) => onChange?.({ type, text, confirmed, ...patch });

  const selected = types.find((t) => t.name === type) ?? null;
  const canConfirm = draft.trim().length > 0;

  // ── 4. Confirmed summary ─────────────────────────────────────────────────
  if (confirmed && type) {
    return (
      <section className="rounded-xl border p-4" style={{ borderColor: HAIRLINE }}>
        <p
          className="text-[11px] font-medium tracking-[0.04em]"
          style={{ color: LABEL }}
        >
          ADD PERSONALIZATION
        </p>

        <div className="mt-3 flex items-center gap-2.5">
          <span
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: "#D9D9D9" }}
          />
          <p className="min-w-0 flex-1 truncate text-[13px]" style={{ color: INK }}>
            {type}: &ldquo;{text}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => {
              setDraft(text);
              set({ confirmed: false });
            }}
            className="shrink-0 text-[13px]"
            style={{ color: BRAND }}
          >
            Edit
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border p-4" style={{ borderColor: HAIRLINE }}>
      <p
        className="text-[11px] font-medium tracking-[0.04em]"
        style={{ color: LABEL }}
      >
        ADD PERSONALIZATION
      </p>

      {/* Type pills */}
      <div className="mt-2.5 flex flex-wrap gap-2">
        {types.map((t) => {
          const active = t.name === type;
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => {
                // Tapping the active type clears it, back to state 1.
                setDraft("");
                set({ type: active ? null : t.name, text: "", confirmed: false });
              }}
              className="h-9 rounded-lg border px-3 text-[12px] transition-colors"
              style={
                active
                  ? { backgroundColor: BRAND, borderColor: BRAND, color: "#FFFFFF" }
                  : { borderColor: HAIRLINE, color: INK }
              }
            >
              {t.name}
            </button>
          );
        })}
      </div>

      {/* ── 2 & 3. Input + confirm, only once a type is picked ─────────────── */}
      {type && (
        <>
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Type something here"
            aria-label={`${type} text`}
            className={`mt-3 h-11 w-full rounded-lg border bg-white px-3 text-[13px] placeholder:text-[#6E6659] focus:border-[#D85A30] focus:outline-none ${
              canConfirm ? "border-[#D85A30]" : "border-transparent"
            }`}
            style={{ color: INK }}
          />

          {selected?.extraDays > 0 && (
            <p className="mt-3 text-[11px]" style={{ color: MUTED }}>
              {type} adds {selected.extraDays} day
              {selected.extraDays === 1 ? "" : "s"} to delivery
            </p>
          )}

          <button
            type="button"
            disabled={!canConfirm}
            onClick={() => set({ text: draft.trim(), confirmed: true })}
            className="mt-3 h-11 w-full rounded-lg text-[13px] transition-colors"
            style={
              canConfirm
                ? { backgroundColor: BRAND, color: "#FFFFFF" }
                : { backgroundColor: "#FFFFFF", color: MUTED }
            }
          >
            Confirm
          </button>
        </>
      )}
    </section>
  );
}
