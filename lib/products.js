/**
 * Fetch all products with optional filters
 * Routes through /proxy to avoid CORS and inject auth headers
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

  // string params
  if (category) params.append("category", String(category));
  if (search) params.append("search", String(search));

  // number params — coerce to Number first to strip accidental strings like "5000"
  if (minPrice !== undefined && !isNaN(Number(minPrice)))
    params.append("minPrice", Number(minPrice).toString());
  if (maxPrice !== undefined && !isNaN(Number(maxPrice)))
    params.append("maxPrice", Number(maxPrice).toString());
  if (minDiscount !== undefined && !isNaN(Number(minDiscount)))
    params.append("minDiscount", Number(minDiscount).toString());
  if (maxDeliveryDays !== undefined && !isNaN(Number(maxDeliveryDays)))
    params.append("maxDeliveryDays", Number(maxDeliveryDays).toString());

  // boolean param — must be "true" or "false" string
  if (madeInNigeria !== undefined)
    params.append("madeInNigeria", Boolean(madeInNigeria).toString());

  // array params
  if (occasions?.length)
    occasions.forEach((o) => params.append("occasions", o));
  if (giftTypes?.length)
    giftTypes.forEach((g) => params.append("giftTypes", g));

  // integer pagination — Math.floor guards against floats
  params.append("page", Math.floor(Number(page) || 1).toString());
  params.append("limit", Math.floor(Number(limit) || 12).toString());

  const response = await fetch(`/proxy/products?${params.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch a single product by ID
 * @param {string} productId - The product ID
 */
export async function getProductById(productId) {
  const response = await fetch(`/proxy/products/${productId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  const result = await response.json();
  return result.data;
}
