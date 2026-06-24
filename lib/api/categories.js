import { unstable_cache } from "next/cache";
import { fetchTaxonomy } from "@/lib/api/products";

function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/[&]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-|-$/g, "");
}

// ── Recipient-based categories (local only, not in the API tree) ───────────
const RECIPIENT_CATEGORIES = {
  "for-her": {
    id: "for-her",
    label: "For Her",
    description: "Jewellery, beauty, fashion and more — curated gifts she will love",
    subcategories: [
      { id: 1, slug: "jewellery", name: "Jewellery", desc: "Necklaces, Bracelets & more", image: "/categories/jewelry.jpg" },
      { id: 2, slug: "beauty-skincare", name: "Beauty & Skincare", desc: "Skincare, Makeup & more", image: "/categories/women-fashion.png" },
      { id: 3, slug: "bags-accessories", name: "Bags & Accessories", desc: "Handbags, Clutches & more", image: "/categories/bags.png" },
      { id: 4, slug: "footwear", name: "Footwear", desc: "Heels, Sandals & more", image: "/categories/footwear.png" },
    ],
  },
  "for-him": {
    id: "for-him",
    label: "For Him",
    description: "Stylish and thoughtful gifts for the special man in your life",
    subcategories: [
      { id: 1, slug: "men-fashion", name: "Men Fashion", desc: "Shirts, Trousers & more", image: "/categories/men-fashion.png" },
      { id: 2, slug: "watches", name: "Watches", desc: "Smartwatches, Luxury & more", image: "/categories/watches.png" },
      { id: 3, slug: "wallets", name: "Wallets", desc: "Wallets, Card Holders & more", image: "/categories/wallets.png" },
      { id: 4, slug: "footwear", name: "Footwear", desc: "Sneakers, Loafers & more", image: "/categories/footwear.png" },
    ],
  },
  "for-couples": {
    id: "for-couples",
    label: "For Couples",
    description: "Gifts they will both love — perfect for anniversaries, weddings and celebrations",
    subcategories: [
      { id: 1, slug: "gift-boxes", name: "Gift Boxes", desc: "Curated sets for two", image: "/categories/bags.png" },
      { id: 2, slug: "jewellery", name: "Jewellery", desc: "Matching pieces & more", image: "/categories/jewelry.jpg" },
      { id: 3, slug: "food-treats", name: "Food & Treats", desc: "Hampers, Wine & more", image: "/product.png" },
      { id: 4, slug: "experiences", name: "Experiences", desc: "Date nights & more", image: "/product2.png" },
    ],
  },
  "for-babies": {
    id: "for-babies",
    label: "For Babies",
    description: "Sweet and memorable gifts for newborns, toddlers and little ones",
    subcategories: [
      { id: 1, slug: "newborn-gifts", name: "Newborn Gifts", desc: "Clothing, Blankets & more", image: "/categories/for-babies.jpg" },
      { id: 2, slug: "toys-play", name: "Toys & Play", desc: "Rattles, Soft toys & more", image: "/product.png" },
      { id: 3, slug: "gift-hampers", name: "Gift Hampers", desc: "Curated baby sets", image: "/product2.png" },
      { id: 4, slug: "personalised", name: "Personalised", desc: "Name tags, Keepsakes & more", image: "/categories/bags.png" },
    ],
  },
};

// ── Base fetch — one request, one cache entry for the full tree ────────────
const getCategories = unstable_cache(
  async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/categories/tree`;
    console.log("[categories] GET", url);
    const res = await fetch(url, { next: { revalidate: 3600, tags: ["categories"] } });
    if (!res.ok) {
      let body = "";
      try { body = await res.text(); } catch {}
      console.error("[categories] Error", res.status, url, body);
      throw new Error("Failed to fetch categories");
    }
    const json = await res.json();
    const data = json.data ?? [];
    console.log("[categories] OK —", data.length, "categories:", data.map((c) => c.name));
    return data;
  },
  ["categories-tree"],
  { revalidate: 3600, tags: ["categories"] }
);

// ── Public API ─────────────────────────────────────────────────────────────

export async function getNavCategories() {
  const taxonomy = await fetchTaxonomy();
  return (taxonomy.categories ?? []).map((c) => ({
    id: nameToSlug(c.name),
    label: c.name,
  }));
}

export async function getCategoryBySlug(slug) {
  if (RECIPIENT_CATEGORIES[slug]) {
    const { subcategories: _, ...meta } = RECIPIENT_CATEGORIES[slug];
    return meta;
  }

  const tree = await getCategories();
  const cat = tree.find((c) => c.slug === slug);
  if (!cat) return null;

  return {
    id: cat.slug,
    label: cat.name,
    description: cat.description,
    pageDescription: cat.pageDescription,
  };
}

export async function getSubcategoriesBySlug(slug) {
  if (RECIPIENT_CATEGORIES[slug]) {
    const subs = RECIPIENT_CATEGORIES[slug].subcategories;
    console.log(`[subcategories] "${slug}" — using hardcoded data (${subs.length} items):`, subs.map((s) => s.name));
    return subs;
  }

  const tree = await getCategories();
  const cat = tree.find((c) => c.slug === slug);
  if (!cat) {
    console.warn(`[subcategories] "${slug}" — no matching category in API tree`);
    return [];
  }

  const subs = (cat.children ?? [])
    .filter((c) => c.isActive)
    .map((c) => ({
      id: c._id,
      slug: c.slug ?? nameToSlug(c.name),
      name: c.name,
      desc: c.description,
      image: c.image?.url ?? "/product.png",
    }));
  console.log(`[subcategories] "${slug}" — from API (${subs.length} items):`, subs.map((s) => s.name));
  return subs;
}

// ── Breadcrumb for a product detail page ───────────────────────────────────
// A product carries only a `subcategory` string (which is actually a taxonomy
// *type*, e.g. "Men Trousers"). We walk the cached taxonomy to find the parent
// category + subcategory, then derive shop URLs via the shared nameToSlug.
// Returns an array of { label, href? } — last item (the product) has no href.
// Falls back gracefully to `Home > {product name}` when nothing resolves.
export async function getProductBreadcrumb(product) {
  const crumbs = [{ label: "Home", href: "/" }];
  const typeName = product?.subcategory;

  if (typeName) {
    const taxonomy = await fetchTaxonomy();
    for (const cat of taxonomy.categories ?? []) {
      for (const sub of cat.subcategories ?? []) {
        const hasType = (sub.types ?? []).some(
          (t) => t.name?.toLowerCase() === typeName.toLowerCase()
        );
        if (hasType) {
          const catSlug = nameToSlug(cat.name);
          const subSlug = nameToSlug(sub.name);
          crumbs.push({
            label: cat.name,
            href: `/shop/categories/${catSlug}`,
          });
          crumbs.push({
            label: sub.name,
            href: `/shop/categories/${catSlug}/${subSlug}`,
          });
          return [...crumbs, { label: product.name }];
        }
      }
    }
    // Unresolved subcategory — keep it as a plain (non-link) crumb for context.
    crumbs.push({ label: typeName });
  }

  return [...crumbs, { label: product?.name ?? "Product" }];
}

export async function getTypeInfo(categorySlug, subcategorySlug) {
  if (RECIPIENT_CATEGORIES[categorySlug]) {
    const sub = RECIPIENT_CATEGORIES[categorySlug].subcategories?.find(
      (s) => s.slug === subcategorySlug
    );
    if (sub) return sub;
  }

  const tree = await getCategories();
  const cat = tree.find((c) => c.slug === categorySlug);
  if (!cat) return null;

  const sub = (cat.children ?? []).find(
    (c) => (c.slug ?? nameToSlug(c.name)) === subcategorySlug
  );
  if (!sub) return null;

  return {
    id: sub._id,
    slug: sub.slug ?? nameToSlug(sub.name),
    name: sub.name,
    desc: sub.description,
    pageDescription: sub.pageDescription,
    image: sub.image?.url ?? "/product.png",
  };
}
