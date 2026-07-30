// lib/products.js
// These run on both sides, so the base is chosen per call: the server needs an
// absolute URL, and the browser must go through /proxy or the request is a
// cross-origin one the API does not allow — it fails CORS preflight and the
// grid renders empty with no error the user can see.

const API_URL = process.env.NEXT_PUBLIC_API_URL; // e.g. "https://api.ebunly.com/"

const isServer = typeof window === "undefined";
const base = () => (isServer ? API_URL : "/proxy");

/** `next: { revalidate }` is a server-only fetch option; the browser ignores it. */
const cacheOptions = (seconds) =>
  isServer ? { next: { revalidate: seconds } } : {};

/**
 * Fetch all products with optional filters (server-side safe).
 *
 * Parameter names follow GET /products in the live spec (/api-docs.json), not
 * the older `apiFilteringDocs.md`. The tag facets are `occasionTags`,
 * `styleTags` and `recipients`; the vocabulary for each comes from
 * GET /products/taxonomy. Unknown parameters are ignored by the API rather
 * than rejected, so a wrong name here fails silently — it does not error, it
 * just stops filtering.
 */
export async function getAllProducts(filters = {}) {
  const {
    search,
    category,
    coreCategory,
    subcategory,
    recipients,
    occasionTags,
    styleTags,
    budgetTier,
    minPrice,
    maxPrice,
    minDiscount,
    madeInNigeria,
    maxDeliveryDays,
    featured,
    vendor,
    sortBy,
    sortOrder,
    page = 1,
    limit = 12,
  } = filters;

  const params = new URLSearchParams();

  const setText = (key, value) => {
    if (value) params.append(key, String(value));
  };
  const setNumber = (key, value) => {
    if (value !== undefined && value !== "" && !isNaN(Number(value)))
      params.append(key, Number(value).toString());
  };
  const setBool = (key, value) => {
    if (value !== undefined) params.append(key, Boolean(value).toString());
  };
  const setList = (key, values) => {
    values?.forEach((v) => v && params.append(key, v));
  };

  setText("search", search);
  setText("category", category);
  setText("coreCategory", coreCategory);
  setText("subcategory", subcategory);
  setText("budgetTier", budgetTier);
  setText("vendor", vendor);
  setText("sortBy", sortBy);
  setText("sortOrder", sortOrder);

  setList("recipients", recipients);
  setList("occasionTags", occasionTags);
  setList("styleTags", styleTags);

  setNumber("minPrice", minPrice);
  setNumber("maxPrice", maxPrice);
  setNumber("minDiscount", minDiscount);
  setNumber("maxDeliveryDays", maxDeliveryDays);

  setBool("madeInNigeria", madeInNigeria);
  setBool("featured", featured);

  params.append("page", Math.floor(Number(page) || 1).toString());
  params.append("limit", Math.floor(Number(limit) || 12).toString());

  const response = await fetch(`${base()}/products?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    ...cacheOptions(60),
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
  const response = await fetch(`${base()}/products/${productId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    ...cacheOptions(60),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const result = await response.json();
  // API returns { success, data } or { success, data: [...] }
  return Array.isArray(result.data) ? result.data[0] : result.data;
}

/**
 * Fetch a single product by slug (server-side safe)
 * Uses the dedicated slug endpoint: GET /products/slug/:slug
 */
export async function getProductBySlug(slug) {
  const response = await fetch(`${base()}/products/slug/${slug}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    ...cacheOptions(60),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const result = await response.json();
  // API returns { success, data } or { success, data: [...] }
  return Array.isArray(result.data) ? result.data[0] : result.data;
}
