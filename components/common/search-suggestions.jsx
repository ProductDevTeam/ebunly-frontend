"use client";

import { useMemo } from "react";

import { useProducts } from "@/hooks/use-products";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import SearchPanel from "./search-panel";

/*
 * Data for the search panel. Both hosts (the desktop navbar dropdown and the
 * mobile full-screen overlay) render this, so the query wiring lives once.
 */

/** The three the export draws, by id — falls back to whatever the nav has. */
const POPULAR_IDS = ["personalized-gifts", "gift-boxes", "beauty-self-care"];

function pickPopular(categories) {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const picked = POPULAR_IDS.map((id) => byId.get(id)).filter(Boolean);
  return picked.length > 0 ? picked : categories.slice(0, 3);
}

export default function SearchSuggestions({
  query,
  categories = [],
  onPick,
  onNavigate,
}) {
  const trimmed = query.trim();
  const { recent, removeRecent } = useRecentSearches();

  const { data } = useProducts(
    { search: trimmed, limit: 2 },
    { enabled: trimmed.length >= 2 },
  );

  const products = useMemo(
    () =>
      (data?.data ?? []).slice(0, 2).map((p) => ({
        id: p._id ?? p.id,
        slug: p.slug ?? p._id ?? p.id,
        name: p.name,
        price: p.basePrice ?? p.price ?? 0,
        image: p.images?.[0]?.url ?? p.images?.[0] ?? "/product.png",
      })),
    [data],
  );

  // Related categories: whichever nav categories the query words appear in.
  const related = useMemo(() => {
    if (!trimmed) return [];
    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    return categories
      .filter((c) => words.some((w) => c.label.toLowerCase().includes(w)))
      .slice(0, 2);
  }, [trimmed, categories]);

  return (
    <SearchPanel
      query={query}
      recent={recent}
      popular={pickPopular(categories)}
      categories={related}
      products={products}
      onPick={onPick}
      onRemoveRecent={removeRecent}
      onNavigate={onNavigate}
    />
  );
}
