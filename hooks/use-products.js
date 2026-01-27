"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "@/lib/products";

/**
 * Custom hook to fetch products with React Query
 * @param {Object} filters - Filter parameters
 * @param {string} [filters.category] - Category ID
 * @param {string} [filters.search] - Search term
 * @param {number} [filters.minPrice] - Minimum price
 * @param {number} [filters.maxPrice] - Maximum price
 * @param {number} [filters.page] - Page number
 * @param {number} [filters.limit] - Items per page
 * @param {Object} options - Additional React Query options
 */
export function useProducts(filters = {}, options = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getAllProducts(filters),
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Cache persists for 10 minutes
    retry: 2,
    ...options,
  });
}

/**
 * Custom hook to fetch a single product with React Query
 * @param {string} productId - The product ID
 * @param {Object} options - Additional React Query options
 */
export function useProduct(productId, options = {}) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!productId,
    ...options,
  });
}
