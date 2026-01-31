"use client";

import { useState, useCallback } from "react";
import FilterBar from "@/components/shared/dashboard/filterbar";
import ProductGrid from "@/components/shared/dashboard/product-grid";
import SearchBar from "@/components/shared/dashboard/search-bar";
import { useProducts } from "@/hooks/use-products";

export default function DiscoverPage() {
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    minPrice: undefined,
    maxPrice: undefined,
    page: 1,
    limit: 12,
  });

  // Fetch products with React Query
  const { data, isLoading, isError, error } = useProducts(filters);

  // Use useCallback to memoize the function and prevent infinite loops
  const handleSearch = useCallback((searchTerm) => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm,
      page: 1,
    }));
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  }, []);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <FilterBar onFilterChange={handleFilterChange} />
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
