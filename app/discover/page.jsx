"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import FilterBar from "@/components/shared/dashboard/filterbar";
import ProductGrid from "@/components/shared/dashboard/product-grid";
import SearchBar from "@/components/shared/dashboard/search-bar";
import MobileFilterBar from "@/components/shared/dashboard/mobile-filter";
import {
  useProductSearch,
  isSearching,
  stripBrowseOnlyFacets,
} from "@/hooks/use-search";
import { useSearchHistory } from "@/hooks/use-search-history";

// Keys match GET /products exactly — see lib/products.js.
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

// Build the initial filter set from the URL, so links like
// /discover?recipients=Women or /discover?maxPrice=3000 land pre-filtered.
// `occasions`/`giftTypes` are the pre-taxonomy names some older links still
// carry; map them onto the parameters the API understands.
//
// The term arrives as either `q` (what the search panel and overlay link to,
// matching GET /search) or `search` (what the older header links use).
function filtersFromSearchParams(searchParams) {
  const num = (key) => {
    const raw = searchParams.get(key);
    return raw !== null && raw !== "" && !isNaN(Number(raw))
      ? Number(raw)
      : undefined;
  };

  return {
    ...DEFAULT_FILTERS,
    category: searchParams.get("category") ?? "",
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
  };
}

function DiscoverInner() {
  const searchParams = useSearchParams();
  // Stable key so we re-sync only when the query string really changes.
  const urlKey = searchParams.toString();

  const [filters, setFilters] = useState(() =>
    filtersFromSearchParams(searchParams),
  );
  const [restoredFilters, setRestoredFilters] = useState(null);

  // Re-sync filters when the URL changes (set during render, not in an effect,
  // to avoid cascading renders).
  const [seenUrlKey, setSeenUrlKey] = useState(urlKey);
  if (urlKey !== seenUrlKey) {
    setSeenUrlKey(urlKey);
    setFilters(filtersFromSearchParams(new URLSearchParams(urlKey)));
  }

  const { saveToHistory } = useSearchHistory();
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

  const handleSearch = useCallback(
    (searchTerm) => {
      const next = { ...filters, search: searchTerm, page: 1 };
      // Results now come from /search, which cannot apply the browse-only
      // facets — clear them rather than leave chips that no longer bite.
      const cleaned = isSearching(next)
        ? { ...DEFAULT_FILTERS, ...stripBrowseOnlyFacets(next) }
        : next;
      setFilters(cleaned);
      saveToHistory(cleaned);
    },
    [filters, saveToHistory],
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      const merged = { ...filters, ...newFilters, page: 1 };
      const cleaned = isSearching(merged)
        ? { ...DEFAULT_FILTERS, ...stripBrowseOnlyFacets(merged) }
        : merged;
      setFilters(cleaned);
      saveToHistory(cleaned);
    },
    [filters, saveToHistory],
  );

  const handleRestoreFilters = useCallback((restored) => {
    const next = { ...DEFAULT_FILTERS, ...restored, page: 1 };
    setFilters(next);
    setRestoredFilters(next);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  }, []);

  return (
    <>
      <SearchBar
        initialValue={filters.search}
        onSearch={handleSearch}
        onRestoreFilters={handleRestoreFilters}
      />
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
      {/* Only /search returns these, so they appear on a term and not on a
          filter-only browse. The API sends them when matches span named
          categories, which is what makes them show up on a broad term and
          stay hidden on a narrow one. */}
      {categorySuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-4 pt-4 md:px-8">
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
    </>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense>
      <DiscoverInner />
    </Suspense>
  );
}
