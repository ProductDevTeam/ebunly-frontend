export const PRODUCTS_PER_PAGE = 8;

const PRODUCTS_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

function normalizeProduct(p) {
  let image = "/product.png";
  if (Array.isArray(p.images) && p.images[0]) {
    image = typeof p.images[0] === "string" ? p.images[0] : (p.images[0].url ?? "/product.png");
  } else if (p.image) {
    image = typeof p.image === "string" ? p.image : (p.image.url ?? "/product.png");
  }
  return {
    id: p._id ?? p.id ?? "",
    name: p.name ?? "",
    slug: p.slug ?? "",
    price: p.basePrice ?? p.price ?? 0,
    image,
    discountPercentage: p.discountPercentage ?? 0,
    madeInNigeria: p.madeInNigeria ?? false,
  };
}

export function parseProductsResponse(json, limit = PRODUCTS_PER_PAGE) {
  const raw = json.data ?? json;
  const items = Array.isArray(raw)
    ? raw
    : Array.isArray(raw.products)
    ? raw.products
    : Array.isArray(raw.items)
    ? raw.items
    : [];
  const meta = raw.pagination ?? raw.meta ?? {};
  const total = meta.total ?? meta.totalItems ?? items.length;
  const totalPages = meta.totalPages ?? meta.pages ?? (Math.ceil(total / limit) || 1);
  return { products: items.map(normalizeProduct), totalPages, total };
}

// ── Server-side fetchers (used by server components / route handlers) ─────────

export async function fetchProducts({
  coreCategory,
  subcategory,
  sortBy,
  sortOrder,
  madeInNigeria,
  page = 1,
  limit = PRODUCTS_PER_PAGE,
} = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (coreCategory) params.set("coreCategory", coreCategory);
  if (subcategory) params.set("subcategory", subcategory);
  if (sortBy) params.set("sortBy", sortBy);
  if (sortOrder) params.set("sortOrder", sortOrder);
  if (madeInNigeria) params.set("madeInNigeria", "true");

  const fullUrl = `${PRODUCTS_URL}?${params}`;
  console.log("[products] GET", fullUrl);

  const res = await fetch(fullUrl, {
    next: { revalidate: 60, tags: ["products"] },
  });

  if (!res.ok) {
    let body = "";
    try { body = await res.text(); } catch {}
    console.error("[products] Error", res.status, fullUrl, body);
    throw new Error(`Products API error: ${res.status}`);
  }
  return parseProductsResponse(await res.json(), limit);
}

// Initial load for a subcategory page
export async function getProductsBySubcategory(subcategoryName) {
  return fetchProducts({ subcategory: subcategoryName });
}

// Initial load for a top-level category page
export async function getProductsByCategory(categoryName) {
  return fetchProducts({ coreCategory: categoryName });
}

// ── Sub-filter labels (sidebar + mobile chips) ────────────────────────────────
// These are the exact strings passed as ?subcategory= to the API.

const SUB_FILTERS = {
  "men-fashion":         ["Shirts", "Trousers", "Shorts", "Native Wear", "Jackets", "Hoodies", "Tracksuits"],
  "women-fashion":       ["Dresses", "Tops", "Skirts", "Jumpsuits", "Co-ord Sets", "Blouses"],
  bags:                  ["Handbags", "Backpacks", "Clutches", "Wallets", "Tote Bags"],
  footwear:              ["Heels", "Sandals", "Sneakers", "Loafers", "Boots", "Flats"],
  "jewelry-accessories": ["Bracelets", "Chains", "Earrings", "Necklaces", "Rings"],
  watches:               ["Luxury", "Smartwatch", "Casual", "Sports"],
  "beauty-self-care":    ["Skincare", "Makeup", "Perfumes", "Haircare", "Body Care"],
  "food-treats":         ["Hampers", "Chocolates", "Beverages", "Snacks", "Fresh Produce"],
  "gift-boxes":          ["Birthday", "Anniversary", "Corporate", "Baby", "Wedding"],
  "baby-child":          ["Newborn Gifts", "Toys & Play", "Clothing", "Gift Hampers"],
  "home-living":         ["Decor", "Candles & Scents", "Kitchen", "Bedding", "Frames"],
  "tech-gadgets":        ["Phones & Tablets", "Accessories", "Smart Home", "Audio", "Wearables"],
  "personalized-gifts":  ["Name Gifts", "Photo Gifts", "Engraved", "Custom Prints"],
};

export function getSubFilters(subcategorySlug) {
  return SUB_FILTERS[subcategorySlug] ?? [];
}
