import { unstable_cache } from "next/cache";

export const PRODUCTS_PER_PAGE = 8;

const PRODUCTS_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;
const TAXONOMY_URL = `${process.env.NEXT_PUBLIC_API_URL}/products/taxonomy`;

export const fetchTaxonomy = unstable_cache(
  async () => {
    console.log("[taxonomy] GET", TAXONOMY_URL);
    const res = await fetch(TAXONOMY_URL, { next: { revalidate: 3600, tags: ["taxonomy"] } });
    if (!res.ok) {
      let body = ""; try { body = await res.text(); } catch {}
      console.error("[taxonomy] Error", res.status, TAXONOMY_URL, body);
      return { categories: [] };
    }
    const json = await res.json();
    const data = json.data ?? {};
    console.log("[taxonomy] OK —", data.categories?.length ?? 0, "categories:", data.categories?.map((c) => c.name));
    return data;
  },
  ["products-taxonomy"],
  { revalidate: 3600, tags: ["taxonomy"] }
);

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
  type,
  subcategory,
  sortBy,
  sortOrder,
  madeInNigeria,
  page = 1,
  limit = PRODUCTS_PER_PAGE,
} = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (coreCategory) params.set("coreCategory", coreCategory);
  if (type) params.set("subcategory", type);
  if (subcategory) params.set("subcategory", subcategory);
  if (sortBy) params.set("sortBy", sortBy);
  if (sortOrder) params.set("sortOrder", sortOrder);
  if (madeInNigeria) params.set("madeInNigeria", "true");

  const fullUrl = `${PRODUCTS_URL}?${params.toString().replace(/\+/g, "%20")}`;
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

  const json = await res.json();
  const result = parseProductsResponse(json, limit);
  console.log(
    `[products] OK — ${fullUrl}`,
    `| ${result.products.length} products, ${result.totalPages} pages, ${result.total} total`,
  );
  return result;
}

// Initial load for a type page (e.g. "Men Fashion")
export async function getProductsByType(typeName) {
  return fetchProducts({ type: typeName });
}

// Initial load for a top-level category page
export async function getProductsByCategory(categoryName) {
  return fetchProducts({ coreCategory: categoryName });
}

// ── Sub-filter types (sidebar + mobile chips) ─────────────────────────────────
// Sourced live from /products/taxonomy — types[] within each subcategory.
// Passed as ?subcategory=<type> to the products API.

export async function getSubFilters(typeName) {
  const taxonomy = await fetchTaxonomy();
  for (const cat of taxonomy.categories ?? []) {
    const sub = cat.subcategories?.find(
      (s) => s.name.toLowerCase() === typeName.toLowerCase()
    );
    if (sub) {
      console.log(`[taxonomy] sub-filters for "${typeName}":`, sub.types);
      return sub.types ?? [];
    }
  }
  console.warn(`[taxonomy] no types found for subcategory "${typeName}"`);
  return [];
}
