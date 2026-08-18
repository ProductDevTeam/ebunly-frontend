"use client";

import Image from "next/image";
import { useState } from "react";
import { SquarePen } from "lucide-react";

/*
 * COMPLETE THE GIFT — specced in
 * `design screenshots/Components - Personalization Feature Key Info.png`.
 *
 *   idle       → "+ Flowers  + Card  + Teddy"
 *   picking    → type pill goes peach, panel opens: "Choose a design",
 *                category filter pills, design tiles (name + price),
 *                a message box for cards only, "Confirm <Type>", "Remove"
 *   confirmed  → peach chip per add-on: "Rose bouquet, ₦5,000  ✎"
 *
 * Add-on pills use the peach treatment (#FAECE7 / #993C1D / #712B13), not the
 * solid orange used by personalization type pills, and they carry no price —
 * prices only appear on the design tiles and the confirmed chips.
 *
 * The card itself is unfilled, sitting on whatever surface the page provides;
 * the picking panel is the one white plane, and it has no border.
 */
const BRAND = "#D85A30";
const PEACH = "#FAECE7";
const PEACH_BORDER = "#993C1D";
const PEACH_INK = "#712B13";
const HAIRLINE = "#EBE5E0";
const INK = "#24201C";
const MUTED = "#6E6659";
/* The uppercase micro-labels are a colder grey than body muted text. */
const LABEL = "#707070";
const TILE_BG = "#F5F1EC";
const REMOVE_RED = "#D90101";
const MESSAGE_LIMIT = 200;

/** Fallback catalogue until the API exposes add-on designs. */
const DEFAULT_ADDONS = [
  {
    key: "flowers",
    label: "Flowers",
    categories: ["All", "Bouqets", "Roses", "Tulips"],
    designs: [
      {
        id: "f1",
        name: "Red roses",
        price: 5000,
        category: "Roses",
        image: "/product.png",
      },
      {
        id: "f2",
        name: "White roses",
        price: 7000,
        category: "Roses",
        image: "/product.png",
      },
      {
        id: "f3",
        name: "Rose bouquet",
        price: 15000,
        category: "Bouqets",
        image: "/product.png",
      },
    ],
  },
  {
    key: "card",
    label: "Card",
    hasMessage: true,
    categories: ["All", "Birthday", "Valentine's", "Anniversary", "Christmas"],
    designs: [
      {
        id: "c1",
        name: "Birthday 1",
        price: 5000,
        category: "Birthday",
        image: "/product.png",
      },
      {
        id: "c2",
        name: "Birthday 2",
        price: 5000,
        category: "Birthday",
        image: "/product.png",
      },
      {
        id: "c3",
        name: "Valentines 1",
        price: 5000,
        category: "Valentine's",
        image: "/product.png",
      },
    ],
  },
  {
    key: "teddy",
    label: "Teddy",
    categories: ["All", "Small", "Medium", "Large"],
    designs: [
      {
        id: "t1",
        name: "Small teddy 1",
        price: 5000,
        category: "Small",
        image: "/product.png",
      },
      {
        id: "t2",
        name: "Small teddy 2",
        price: 5000,
        category: "Small",
        image: "/product.png",
      },
      {
        id: "t3",
        name: "Large teddy 1",
        price: 25000,
        category: "Large",
        image: "/product.png",
      },
    ],
  },
];

const naira = (n) => `₦${(n ?? 0).toLocaleString()}`;

export default function ProductAddOns({
  addons = DEFAULT_ADDONS,
  value = {},
  onChange,
  defaultOpenKey = null,
}) {
  // `value` is keyed by add-on: { card: { designId, name, price, message } }
  const [openKey, setOpenKey] = useState(defaultOpenKey);
  const [category, setCategory] = useState("All");
  const [draftDesign, setDraftDesign] = useState(
    () =>
      addons.find((a) => a.key === defaultOpenKey)?.designs?.[0]?.id ?? null,
  );
  const [message, setMessage] = useState("");

  const open = addons.find((a) => a.key === openKey) ?? null;
  const confirmedKeys = Object.keys(value).filter((k) => value[k]);

  const openPanel = (addon) => {
    const existing = value[addon.key];
    setOpenKey(addon.key);
    setCategory("All");
    setDraftDesign(existing?.designId ?? addon.designs?.[0]?.id ?? null);
    setMessage(existing?.message ?? "");
  };

  const closePanel = () => {
    setOpenKey(null);
    setDraftDesign(null);
    setMessage("");
  };

  const confirm = () => {
    const design = open.designs.find((d) => d.id === draftDesign);
    if (!design) return;
    onChange?.({
      ...value,
      [open.key]: {
        designId: design.id,
        name: design.name,
        price: design.price,
        ...(open.hasMessage ? { message: message.trim() } : {}),
      },
    });
    closePanel();
  };

  const remove = (key) => {
    const next = { ...value };
    delete next[key];
    onChange?.(next);
    closePanel();
  };

  const visibleDesigns =
    open?.designs.filter(
      (d) => category === "All" || d.category === category,
    ) ?? [];

  return (
    <section
      className="rounded-xl border-[0.5px] p-4"
      style={{ borderColor: HAIRLINE }}
    >
      <p
        className="text-[12px] font-bold text-text-gray tracking-[0.04em]"
        style={{ color: LABEL }}
      >
        COMPLETE THE GIFT
      </p>

      {/* ── Confirmed chips ──────────────────────────────────────────────── */}
      {confirmedKeys.length > 0 && !open && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {confirmedKeys.map((key) => {
            const addon = addons.find((a) => a.key === key);
            const picked = value[key];
            return (
              <button
                key={key}
                type="button"
                onClick={() => addon && openPanel(addon)}
                className="inline-flex h-8 items-center gap-2 rounded-full border px-4 text-[13px]"
                style={{
                  backgroundColor: PEACH,
                  borderColor: PEACH_BORDER,
                  color: PEACH_INK,
                }}
              >
                {picked.name}, {naira(picked.price)}
                <SquarePen size={14} strokeWidth={1.5} />
              </button>
            );
          })}
        </div>
      )}

      {/* ── Type pills ───────────────────────────────────────────────────── */}
      {!open && (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {addons
            .filter((a) => !value[a.key])
            .map((addon) => (
              <button
                key={addon.key}
                type="button"
                onClick={() => openPanel(addon)}
                className="h-8 rounded-full border px-3 text-[12px] transition-colors"
                style={{ borderColor: HAIRLINE, color: INK }}
              >
                + {addon.label}
              </button>
            ))}
        </div>
      )}

      {/* ── Picking panel ────────────────────────────────────────────────── */}
      {open && (
        <>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {addons.map((addon) => {
              const active = addon.key === open.key;
              return (
                <button
                  key={addon.key}
                  type="button"
                  onClick={() => (active ? closePanel() : openPanel(addon))}
                  className="h-8 rounded-full border px-3 text-[12px] transition-colors"
                  style={
                    active
                      ? {
                          backgroundColor: PEACH,
                          borderColor: PEACH_BORDER,
                          color: PEACH_INK,
                        }
                      : { borderColor: HAIRLINE, color: INK }
                  }
                >
                  {active ? "" : "+ "}
                  {addon.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-xl bg-white p-3.5">
            <p className="text-[13px]" style={{ color: MUTED }}>
              Choose a design
            </p>

            {/* Category filters */}
            <div className="mt-3 -mx-3.5 flex gap-2 overflow-x-auto px-3.5 scrollbar-hide">
              {open.categories.map((c) => {
                const active = c === category;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className="h-8 shrink-0 rounded-full border px-3.5 text-[12px] whitespace-nowrap"
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
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Design tiles */}
            <div className="mt-2.5 grid grid-cols-3 gap-[18px]">
              {visibleDesigns.map((d) => {
                const active = d.id === draftDesign;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDraftDesign(d.id)}
                    className="text-left"
                  >
                    <span
                      className="relative block aspect-[3/4] w-full overflow-hidden rounded-lg border-2"
                      style={{
                        borderColor: active ? PEACH_BORDER : "transparent",
                        backgroundColor: TILE_BG,
                      }}
                    >
                      {d.image && (
                        <Image
                          src={d.image}
                          alt={d.name}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      )}
                    </span>
                    <span
                      className="mt-2 block truncate text-[12px]"
                      style={{ color: INK }}
                    >
                      {d.name}
                    </span>
                    <span
                      className="block text-[12px]"
                      style={{ color: MUTED }}
                    >
                      {naira(d.price)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Cards carry a message */}
            {open.hasMessage && (
              <>
                <p className="mt-6 text-[13px]" style={{ color: INK }}>
                  Your Message
                </p>
                <textarea
                  value={message}
                  maxLength={MESSAGE_LIMIT}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write something they'll love"
                  className="mt-2 block h-14 w-full resize-none rounded-lg border p-3 text-[13px] placeholder:text-[#6E6659] focus:border-[#D85A30] focus:outline-none"
                  style={{ borderColor: HAIRLINE, color: INK }}
                />
                <p
                  className="mt-2 text-right text-[12px]"
                  style={{ color: MUTED }}
                >
                  {message.length}/{MESSAGE_LIMIT}
                </p>
              </>
            )}

            <button
              type="button"
              onClick={confirm}
              disabled={!draftDesign}
              className="mt-5 h-11 w-full rounded-lg text-[13px] text-white disabled:opacity-50"
              style={{ backgroundColor: BRAND }}
            >
              Confirm {open.label}
            </button>

            <button
              type="button"
              onClick={() =>
                value[open.key] ? remove(open.key) : closePanel()
              }
              className="mt-2 w-full text-center text-[13px]"
              style={{ color: REMOVE_RED }}
            >
              Remove
            </button>
          </div>
        </>
      )}
    </section>
  );
}
