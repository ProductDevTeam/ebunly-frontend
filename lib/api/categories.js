import { unstable_cache } from "next/cache";

// ── Recipient-based categories (local only, not in the API tree) ───────────
const RECIPIENT_CATEGORIES = {
  "for-her": {
    id: "for-her",
    label: "For Her",
    description: "Jewellery, beauty, fashion and more — curated gifts she will love",
    subcategories: [
      { id: 1, name: "Jewellery", desc: "Necklaces, Bracelets & more", image: "/categories/jewelry.jpg" },
      { id: 2, name: "Beauty & Skincare", desc: "Skincare, Makeup & more", image: "/categories/women-fashion.png" },
      { id: 3, name: "Bags & Accessories", desc: "Handbags, Clutches & more", image: "/categories/bags.png" },
      { id: 4, name: "Footwear", desc: "Heels, Sandals & more", image: "/categories/footwear.png" },
    ],
  },
  "for-him": {
    id: "for-him",
    label: "For Him",
    description: "Stylish and thoughtful gifts for the special man in your life",
    subcategories: [
      { id: 1, name: "Men Fashion", desc: "Shirts, Trousers & more", image: "/categories/men-fashion.png" },
      { id: 2, name: "Watches", desc: "Smartwatches, Luxury & more", image: "/categories/watches.png" },
      { id: 3, name: "Wallets", desc: "Wallets, Card Holders & more", image: "/categories/wallets.png" },
      { id: 4, name: "Footwear", desc: "Sneakers, Loafers & more", image: "/categories/footwear.png" },
    ],
  },
  "for-couples": {
    id: "for-couples",
    label: "For Couples",
    description: "Gifts they will both love — perfect for anniversaries, weddings and celebrations",
    subcategories: [
      { id: 1, name: "Gift Boxes", desc: "Curated sets for two", image: "/categories/bags.png" },
      { id: 2, name: "Jewellery", desc: "Matching pieces & more", image: "/categories/jewelry.jpg" },
      { id: 3, name: "Food & Treats", desc: "Hampers, Wine & more", image: "/product.png" },
      { id: 4, name: "Experiences", desc: "Date nights & more", image: "/product2.png" },
    ],
  },
  "for-babies": {
    id: "for-babies",
    label: "For Babies",
    description: "Sweet and memorable gifts for newborns, toddlers and little ones",
    subcategories: [
      { id: 1, name: "Newborn Gifts", desc: "Clothing, Blankets & more", image: "/categories/for-babies.jpg" },
      { id: 2, name: "Toys & Play", desc: "Rattles, Soft toys & more", image: "/product.png" },
      { id: 3, name: "Gift Hampers", desc: "Curated baby sets", image: "/product2.png" },
      { id: 4, name: "Personalised", desc: "Name tags, Keepsakes & more", image: "/categories/bags.png" },
    ],
  },
};

// ── Base fetch — one request, one cache entry for the full tree ────────────
const getCategories = unstable_cache(
  async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/tree`,
      { next: { revalidate: 3600, tags: ["categories"] } }
    );
    if (!res.ok) throw new Error("Failed to fetch categories");
    const json = await res.json();
    return json.data ?? [];
  },
  ["categories-tree"],
  { revalidate: 3600, tags: ["categories"] }
);

// ── Public API ─────────────────────────────────────────────────────────────

// Returns the flat list used by the navbar secondary nav.
// Sorted by sortOrder, only active categories.
export async function getNavCategories() {
  const tree = await getCategories();
  return tree
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({ id: c.slug, label: c.name }));
}

// Returns metadata (label + description) for the hero section of the category page.
// Falls back to recipient-based local data for for-her / for-him / etc.
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
  };
}

// Returns the subcategories (children) for the category grid.
// Falls back to recipient-based local data for for-her / for-him / etc.
export async function getSubcategoriesBySlug(slug) {
  if (RECIPIENT_CATEGORIES[slug]) {
    return RECIPIENT_CATEGORIES[slug].subcategories;
  }

  const tree = await getCategories();
  const cat = tree.find((c) => c.slug === slug);
  if (!cat) return [];

  return (cat.children ?? [])
    .filter((c) => c.isActive)
    .map((c) => ({
      id: c._id,
      name: c.name,
      desc: c.description,
      image: c.image?.url ?? "/product.png",
    }));
}
