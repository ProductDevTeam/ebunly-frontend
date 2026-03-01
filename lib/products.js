// lib/products.js
// Server-side functions use NEXT_PUBLIC_API_URL directly (absolute URL required).
// Client-side functions (in hooks/components) use /api/proxy/* instead.

const API_URL = process.env.NEXT_PUBLIC_API_URL; // e.g. "https://api.ebunly.com/"

/**
 * Fetch all products with optional filters (server-side safe)
 */
export async function getAllProducts(filters = {}) {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    occasions,
    giftTypes,
    madeInNigeria,
    maxDeliveryDays,
    minDiscount,
    page = 1,
    limit = 12,
  } = filters;

  const params = new URLSearchParams();

  if (category) params.append("category", String(category));
  if (search) params.append("search", String(search));
  if (minPrice !== undefined && !isNaN(Number(minPrice)))
    params.append("minPrice", Number(minPrice).toString());
  if (maxPrice !== undefined && !isNaN(Number(maxPrice)))
    params.append("maxPrice", Number(maxPrice).toString());
  if (minDiscount !== undefined && !isNaN(Number(minDiscount)))
    params.append("minDiscount", Number(minDiscount).toString());
  if (maxDeliveryDays !== undefined && !isNaN(Number(maxDeliveryDays)))
    params.append("maxDeliveryDays", Number(maxDeliveryDays).toString());
  if (madeInNigeria !== undefined)
    params.append("madeInNigeria", Boolean(madeInNigeria).toString());
  if (occasions?.length)
    occasions.forEach((o) => params.append("occasions", o));
  if (giftTypes?.length)
    giftTypes.forEach((g) => params.append("giftTypes", g));

  params.append("page", Math.floor(Number(page) || 1).toString());
  params.append("limit", Math.floor(Number(limit) || 12).toString());

  const response = await fetch(`${API_URL}/products?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 }, // cache for 60s
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single product by ID or slug (server-side safe)
 */
export async function getProductById(productId) {
  const url = `${API_URL}products/${productId}`;
  console.log("Fetching product from:", url); // check this in terminal

  const response = await fetch(`${API_URL}/products/${productId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const result = await response.json();
  // API returns { success, data } or { success, data: [...] }
  return Array.isArray(result.data) ? result.data[0] : result.data;
}
