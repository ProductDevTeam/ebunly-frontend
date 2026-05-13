import { unstable_cache } from "next/cache";

// ── Mock data ─────────────────────────────────────────────────────────────
// Mirrors the shape the real API will return.
// Swap the body of each cached function for a real fetch() when backend is ready.

const NAV_CATEGORIES = [
  { id: "fashion-accessories", label: "Fashion & Accessories" },
  { id: "beauty-self-care", label: "Beauty & Self Care" },
  { id: "food-treats", label: "Food & Treats" },
  { id: "gift-boxes", label: "Gift Boxes" },
  { id: "home-living", label: "Home & Living" },
  { id: "tech-gadgets", label: "Tech & Gadgets" },
  { id: "baby-child", label: "Baby & Child" },
  { id: "personalized-gifts", label: "Personalized Gifts" },
];

const CATEGORY_DATA = {
  "fashion-accessories": {
    id: "fashion-accessories",
    label: "Fashion & Accessories",
    description:
      "Show up in style with fashionable items and accessories for you and your loved ones",
    subcategories: [
      { id: 1, name: "Men Fashion", desc: "Shirts, Trousers, Shorts & more", image: "/categories/men-fashion.png" },
      { id: 2, name: "Women Fashion", desc: "Dresses, Tops, Skirts & more", image: "/categories/women-fashion.png" },
      { id: 3, name: "Footwear", desc: "Sneakers, Sandals & more", image: "/categories/footwear.png" },
      { id: 4, name: "Bags", desc: "Handbags, Backpacks & more", image: "/categories/bags.png" },
      { id: 5, name: "Wallets", desc: "Wallets, Card Holders & more", image: "/categories/wallets.png" },
      { id: 6, name: "Watches", desc: "Smartwatches, Luxury & more", image: "/categories/watches.png" },
      { id: 7, name: "Jewellery Accessories", desc: "Bracelets, Chains & more", image: "/categories/jewelry.jpg" },
    ],
  },
  "beauty-self-care": {
    id: "beauty-self-care",
    label: "Beauty & Self Care",
    description: "Treat yourself or someone special with luxurious beauty and self-care essentials",
    subcategories: [],
  },
  "food-treats": {
    id: "food-treats",
    label: "Food & Treats",
    description: "Delicious edible gifts and gourmet hampers for every occasion",
    subcategories: [],
  },
  "gift-boxes": {
    id: "gift-boxes",
    label: "Gift Boxes",
    description: "Beautifully curated gift boxes ready to delight",
    subcategories: [],
  },
  "home-living": {
    id: "home-living",
    label: "Home & Living",
    description: "Thoughtful gifts that make any space feel like home",
    subcategories: [],
  },
  "tech-gadgets": {
    id: "tech-gadgets",
    label: "Tech & Gadgets",
    description: "Cutting-edge tech gifts for the modern lifestyle",
    subcategories: [],
  },
  "baby-child": {
    id: "baby-child",
    label: "Baby & Child",
    description: "Sweet and memorable gifts for little ones",
    subcategories: [],
  },
  "personalized-gifts": {
    id: "personalized-gifts",
    label: "Personalized Gifts",
    description: "One-of-a-kind gifts made just for them",
    subcategories: [],
  },
};

// ── Cached fetching functions ─────────────────────────────────────────────
// Each function is wrapped in unstable_cache so the result is stored in
// Next.js's data cache. Subsequent requests within the revalidate window
// are served instantly without hitting the data source.
//
// TO SWITCH TO THE REAL API: replace the mock return inside each async fn
// with the commented-out fetch block. Everything else (cache, tags, Suspense)
// stays exactly the same.

export const getNavCategories = unstable_cache(
  async () => {
    // -- Real fetch (uncomment when backend is ready) --
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/nav`, {
    //   next: { revalidate: 3600, tags: ["nav-categories"] },
    // });
    // if (!res.ok) throw new Error("Failed to fetch nav categories");
    // return res.json();

    return NAV_CATEGORIES;
  },
  ["nav-categories"],
  { revalidate: 3600, tags: ["nav-categories"] }
);

export const getCategoryBySlug = unstable_cache(
  async (slug) => {
    // -- Real fetch (uncomment when backend is ready) --
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`, {
    //   next: { revalidate: 1800, tags: [`category-${slug}`, "categories"] },
    // });
    // if (!res.ok) return null;
    // return res.json();

    return CATEGORY_DATA[slug] ?? null;
  },
  ["category-by-slug"],
  { revalidate: 1800, tags: ["categories"] }
);

export const getSubcategoriesBySlug = unstable_cache(
  async (slug) => {
    // -- Real fetch (uncomment when backend is ready) --
    // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}/subcategories`, {
    //   next: { revalidate: 1800, tags: [`subcategories-${slug}`, "categories"] },
    // });
    // if (!res.ok) return [];
    // return res.json();

    return CATEGORY_DATA[slug]?.subcategories ?? [];
  },
  ["subcategories-by-slug"],
  { revalidate: 1800, tags: ["categories"] }
);
