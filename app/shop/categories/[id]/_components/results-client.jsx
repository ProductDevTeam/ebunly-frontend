"use client";

import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import FilterBar from "@/components/shared/dashboard/filterbar";
import MobileFilterBar from "@/components/shared/dashboard/mobile-filter";
import ProductGrid from "@/components/shared/dashboard/product-grid";
import {
  useProductSearch,
  isSearching,
  stripBrowseOnlyFacets,
} from "@/hooks/use-search";
import { useSearchHistory } from "@/hooks/use-search-history";

/*
 * Search results and cross-category filtering, which used to be /discover.
 * It renders inside /shop/categories/[id] whenever the URL carries a term or a
 * filter, so there is one browse surface instead of two.
 *
 * There is no search field here on purpose: the navbar's is the designed one
 * and is present on every page, so a second identical input on this screen was
 * a duplicate. The active term shows in the page heading instead.
 *
 * Scoping: a filter-only browse stays inside the category it was opened from
 * (`coreCategory`), but a term search does not — GET /search has no category
 * facet, so pretending to scope it would be a lie. `/shop/categories/all` is
 * the unscoped shelf and passes no coreCategory at all.
 *
 * Keys match GET /products exactly — see lib/products.js.
 */
const DEFAULT_FILTERS = {
  category: "",
  subcategory: "",
  search: "",
  occasionTags: [],
  recipients: [],
  styleTags: [],
  minPrice: undefined,
  maxPrice: undefined,
  minDiscount: undefined,
  madeInNigeria: undefined,
  maxDeliveryDays: undefined,
  page: 1,
  limit: 12,
};

/**
 * The term arrives as either `q` (what the search panel and overlay link to,
 * matching GET /search) or `search` (older links). `occasions`/`giftTypes` are
 * the pre-taxonomy names some links still carry; map them onto the parameters
 * the API understands.
 */
function filtersFromSearchParams(searchParams, coreCategory) {
  const num = (key) => {
    const raw = searchParams.get(key);
    return raw !== null && raw !== "" && !isNaN(Number(raw))
      ? Number(raw)
      : undefined;
  };

  return {
    ...DEFAULT_FILTERS,
    coreCategory: coreCategory || undefined,
    subcategory: searchParams.get("subcategory") ?? "",
    search: searchParams.get("q") ?? searchParams.get("search") ?? "",
    occasionTags: [
      ...searchParams.getAll("occasionTags"),
      ...searchParams.getAll("occasions"),
    ],
    recipients: searchParams.getAll("recipients"),
    styleTags: [
      ...searchParams.getAll("styleTags"),
      ...searchParams.getAll("giftTypes"),
    ],
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    minDiscount: num("minDiscount"),
    madeInNigeria: searchParams.get("madeInNigeria") === "true" || undefined,
  };
}

/** Any facet the user actually picked, ignoring paging and scope. */
function hasActiveFilters(filters) {
  return (
    filters.occasionTags?.length > 0 ||
    filters.recipients?.length > 0 ||
    filters.styleTags?.length > 0 ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minDiscount !== undefined ||
    filters.madeInNigeria !== undefined ||
    Boolean(filters.subcategory)
  );
}

export default function ResultsClient({ coreCategory = null }) {
  const searchParams = useSearchParams();
  // Stable key so we re-sync only when the query string really changes.
  const urlKey = searchParams.toString();

  const [filters, setFilters] = useState(() =>
    filtersFromSearchParams(searchParams, coreCategory),
  );
  const [restoredFilters, setRestoredFilters] = useState(null);

  // Re-sync when the URL changes (set during render, not in an effect, to
  // avoid cascading renders).
  const [seenUrlKey, setSeenUrlKey] = useState(urlKey);
  if (urlKey !== seenUrlKey) {
    setSeenUrlKey(urlKey);
    setFilters(
      filtersFromSearchParams(new URLSearchParams(urlKey), coreCategory),
    );
  }

  const { history, saveToHistory } = useSearchHistory();
  const {
    products,
    total,
    totalPages,
    page,
    categorySuggestions,
    isLoading,
    isError,
    error,
  } = useProductSearch(filters);

  const searching = isSearching(filters);

  const apply = useCallback(
    (next) => {
      // Results come from /search once a term is present, and it cannot apply
      // the browse-only facets — clear them rather than leave chips that no
      // longer bite.
      const cleaned = isSearching(next)
        ? { ...DEFAULT_FILTERS, ...stripBrowseOnlyFacets(next) }
        : { ...next, coreCategory: coreCategory || undefined };
      setFilters(cleaned);
      saveToHistory(cleaned);
    },
    [coreCategory, saveToHistory],
  );

  const handleFilterChange = useCallback(
    (newFilters) => apply({ ...filters, ...newFilters, page: 1 }),
    [apply, filters],
  );

  const handleRestoreFilters = useCallback((restored) => {
    const next = { ...DEFAULT_FILTERS, ...restored, page: 1 };
    setFilters(next);
    setRestoredFilters(next);
  }, []);

  /*
   * Recent filter sets, which used to live in the removed search field's
   * dropdown. Shown only when nothing is selected, so it fills the empty
   * toolbar rather than adding to a busy one.
   */
  const recentFilterSets =
    filters.search || hasActiveFilters(filters) ? [] : history.slice(0, 3);

  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  return (
    <div className="max-w-308 mx-auto px-4">
      <MobileFilterBar
        onFilterChange={handleFilterChange}
        externalFilters={restoredFilters}
        searching={searching}
      />
      <FilterBar
        onFilterChange={handleFilterChange}
        externalFilters={restoredFilters}
        searching={searching}
      />

      {recentFilterSets.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-3">
          <span className="text-xs font-medium tracking-[0.04em] text-[#707070] uppercase">
            Recent
          </span>
          {recentFilterSets.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => handleRestoreFilters(entry.filters)}
              className="inline-flex h-7 items-center rounded-full border border-[#EBE5E0] px-3 text-[13px] text-[#24201C] transition-colors hover:border-[#993C1D] hover:text-[#712B13]"
            >
              {/* `summary` is an array of parts, e.g. ["Birthday", "Under ₦10,000"]. */}
              {entry.summary.join(" · ")}
            </button>
          ))}
        </div>
      )}

      {/* Only /search returns these, so they appear on a term and not on a
          filter-only browse. The API sends them when matches span named
          categories, which is what makes them show up on a broad term and stay
          hidden on a narrow one. */}
      {categorySuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs font-medium tracking-[0.04em] text-[#707070] uppercase">
            In categories
          </span>
          {categorySuggestions.map((suggestion) => (
            <span
              key={suggestion.name}
              className="inline-flex h-7 items-center rounded-full border border-[#EBE5E0] px-3 text-[13px] text-[#24201C]"
            >
              {suggestion.name}
              <span className="ml-1.5 text-[#6E6659]">{suggestion.count}</span>
            </span>
          ))}
        </div>
      )}

      <ProductGrid
        products={products}
        isLoading={isLoading}
        isError={isError}
        error={error}
        pagination={{
          currentPage: page,
          totalPages,
          totalItems: total,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}
