"use client";

import SearchPanel from "@/components/common/search-panel";
import { Search, X } from "lucide-react";

/*
 * Both search states side by side with fixed data — the live panel reads
 * localStorage and the products API, neither of which a screenshot run has.
 */
const RECENT = ["engraved jewellery box", "silk scarf"];

const POPULAR = [
  { id: "personalized-gifts", label: "Personalized Gifts" },
  { id: "gift-boxes", label: "Gift Boxes" },
  { id: "beauty-self-care", label: "Beauty & Self-care" },
];

/* Shaped like GET /search's categorySuggestions, which is what feeds these. */
const RELATED = [
  { id: "Jewellery Accessories", label: "Jewellery Accessories", count: 6 },
  { id: "Beauty & Self-care", label: "Beauty & Self-care", count: 2 },
];

const PRODUCTS = [
  {
    id: "p1",
    slug: "layered-gold-necklace",
    name: "Layered Gold Necklace",
    price: 30000,
    image: "/product.png",
  },
  {
    id: "p2",
    slug: "gold-hoop-earrings",
    name: "Gold Hoop Earrings",
    price: 30000,
    image: "/product2.png",
  },
];

/** The overlay's field + close row, copied so the harness needs no state. */
function Field({ value }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-10.5 flex-1 items-center gap-3 rounded-full border px-4"
        style={{ borderColor: "#C8ADA3" }}
      >
        <Search size={18} strokeWidth={1.75} style={{ color: "#6E6659" }} />
        <span
          className="text-[14px]"
          style={{ color: value ? "#24201C" : "#9CA3AF" }}
        >
          {value || "Search for anything..."}
        </span>
      </div>
      <X size={20} strokeWidth={1.75} style={{ color: "#24201C" }} />
    </div>
  );
}

export default function SearchUiTestPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans">
      <section data-state="empty" className="px-4 pt-18">
        <Field value="" />
        <div className="pt-6">
          <SearchPanel query="" recent={RECENT} popular={POPULAR} />
        </div>
      </section>

      <section data-state="typing" className="px-4 pt-24 pb-20">
        <Field value="gold earrings" />
        <div className="pt-6">
          <SearchPanel
            query="gold earrings"
            categories={RELATED}
            products={PRODUCTS}
          />
        </div>
      </section>
    </div>
  );
}
