import { unstable_cache } from "next/cache";

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

export async function getNavCategories() {
  const tree = await getCategories();
  return tree
    .filter((c) => c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => ({ id: c.slug, label: c.name }));
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
  };
}

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
      slug: c.slug ?? nameToSlug(c.name),
      name: c.name,
      desc: c.description,
      image: c.image?.url ?? "/product.png",
    }));
}

export async function getSubcategoryInfo(categorySlug, subcategorySlug) {
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
    image: sub.image?.url ?? "/product.png",
  };
}
