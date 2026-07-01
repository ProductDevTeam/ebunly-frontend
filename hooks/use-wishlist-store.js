import { create } from "zustand";
import { persist } from "zustand/middleware";

// Normalise any product-ish object (home card, shop card, product detail) into
// the compact summary the wishlist stores.
export function toWishlistItem(p) {
  if (!p) return null;
  const id = p.id ?? p._id;
  const image =
    p.image ?? p.images?.[0]?.url ?? p.images?.[0] ?? "/product.png";
  return {
    id,
    slug: p.slug ?? id,
    name: p.name,
    price: p.price ?? p.basePrice ?? 0,
    image,
  };
}

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      add: (product) => {
        const item = toWishlistItem(product);
        if (!item?.id) return;
        set((state) =>
          state.items.some((i) => i.id === item.id)
            ? state
            : { items: [item, ...state.items] },
        );
      },

      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      toggle: (product) => {
        const item = toWishlistItem(product);
        if (!item?.id) return;
        const exists = get().items.some((i) => i.id === item.id);
        set((state) =>
          exists
            ? { items: state.items.filter((i) => i.id !== item.id) }
            : { items: [item, ...state.items] },
        );
      },

      has: (id) => get().items.some((i) => i.id === id),

      clear: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    {
      name: "ebunly-wishlist", // localStorage key
    },
  ),
);
