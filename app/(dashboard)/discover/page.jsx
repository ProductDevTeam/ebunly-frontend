"use client";

import { useState, useCallback } from "react";
import FilterBar from "@/components/shared/dashboard/filterbar";
import ProductGrid from "@/components/shared/dashboard/product-grid";
import SearchBar from "@/components/shared/dashboard/search-bar";
import MobileFilterBar from "@/components/shared/dashboard/mobile-filter";
import { useProducts } from "@/hooks/use-products";
import { useSearchHistory } from "@/hooks/use-search-history";

const DEFAULT_FILTERS = {
  category: "",
  search: "",
  occasions: [],
  giftTypes: [],
  minPrice: undefined,
  maxPrice: undefined,
  minDiscount: undefined,
  madeInNigeria: undefined,
  maxDeliveryDays: undefined,
  page: 1,
  limit: 12,
};

export default function DiscoverPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [restoredFilters, setRestoredFilters] = useState(null);

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
