"use client";

import { Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import FilterBar from "@/components/shared/dashboard/filterbar";
import ProductGrid from "@/components/shared/dashboard/product-grid";
import SearchBar from "@/components/shared/dashboard/search-bar";
import MobileFilterBar from "@/components/shared/dashboard/mobile-filter";
import { useProducts } from "@/hooks/use-products";
import { useSearchHistory } from "@/hooks/use-search-history";

// Keys match GET /products exactly — see lib/products.js.
const DEFAULT_FILTERS = {
  category: "",
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
    search: searchParams.get("search") ?? "",
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
  const { data, isLoading, isError, error } = useProducts(filters);

  const handleSearch = useCallback(
    (searchTerm) => {
      const next = { ...filters, search: searchTerm, page: 1 };
      setFilters(next);
      saveToHistory(next);
    },
    [filters, saveToHistory],
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      const merged = { ...filters, ...newFilters, page: 1 };
      setFilters(merged);
      saveToHistory(merged);
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
      />
      <FilterBar
        onFilterChange={handleFilterChange}
        externalFilters={restoredFilters}
      />
      <ProductGrid
        products={data?.data || []}
        isLoading={isLoading}
        isError={isError}
        error={error}
        pagination={{
          currentPage: data?.meta?.page || 1,
          totalPages: data?.meta?.totalPages || 1,
          totalItems: data?.meta?.total || 0,
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
