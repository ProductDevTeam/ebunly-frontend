const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch all products with optional filters
 * @param {Object} filters - Filter parameters
 * @param {string} [filters.category] - Category ID to filter by
 * @param {string} [filters.search] - Search term for name and description
 * @param {number} [filters.minPrice] - Minimum price filter
 * @param {number} [filters.maxPrice] - Maximum price filter
 * @param {number} [filters.page=1] - Page number for pagination
 * @param {number} [filters.limit=12] - Number of items per page
 * @returns {Promise<Object>} Products data with pagination info
 */
export async function getAllProducts(filters = {}) {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
  } = filters;

  // Build query parameters
  const params = new URLSearchParams();

  if (category) params.append("category", category);
  if (search) params.append("search", search);
  if (minPrice !== undefined) params.append("minPrice", minPrice.toString());
  if (maxPrice !== undefined) params.append("maxPrice", maxPrice.toString());
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const url = `${process.env.NEXT_PUBLIC_API_URL}products?${params.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store", // Disable caching for fresh data
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}
/**
 * Fetch a single product by ID
 * @param {string} productId - The product ID
 * @returns {Promise<Object>} Product data
 */
export async function getProductById(productId) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
}
