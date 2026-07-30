"use client";

import { useMemo } from "react";

import { useSearch } from "@/hooks/use-search";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import SearchPanel from "./search-panel";

/*
 * Data for the search panel. Both hosts (the desktop navbar dropdown and the
 * mobile full-screen overlay) render this, so the query wiring lives once.
 *
 * Products and the related-category row both come from GET /search. The API
 * returns `categorySuggestions` with counts, which replaces the word-matching
 * against nav labels this used to do — that guessed at a relationship, these
 * are the categories the matching products are actually in.
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

  // The panel draws two product rows and two category pills.
  const { data } = useSearch(
    { q: trimmed, limit: 2 },
    { enabled: trimmed.length >= 2 },
  );

  const products = useMemo(
    () =>
      (data?.products ?? []).map((p) => ({
        id: p._id,
        slug: p.slug || p._id,
        name: p.name,
        price: p.basePrice,
        image: p.images?.[0]?.url ?? "/product.png",
      })),
    [data],
  );

  const related = useMemo(
    () =>
      (data?.categorySuggestions ?? []).slice(0, 2).map((suggestion) => ({
        id: suggestion.name,
        label: suggestion.name,
        count: suggestion.count,
        // A name, not an id — /discover filters by subcategory, /shop needs ids.
        href: `/discover?subcategory=${encodeURIComponent(suggestion.name)}`,
      })),
    [data],
  );

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
