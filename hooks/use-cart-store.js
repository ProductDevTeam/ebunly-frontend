import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add item or increment if already exists with same productId + variants
      addItem: (
        product,
        quantity = 1,
        variants = {},
        personalization = null,
      ) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i._id === product._id &&
              JSON.stringify(i.variants) === JSON.stringify(variants),
          );

          if (existingIndex !== -1) {
            const updated = [...state.items];
            const existing = updated[existingIndex];
            const newQty = Math.min(
              existing.quantity + quantity,
              product.maxQuantity ?? 1000,
            );
            updated[existingIndex] = { ...existing, quantity: newQty };
            return { items: updated };
          }

          return {
            items: [
              ...state.items,
              {
                cartItemId: `${product._id}_${Date.now()}`,
                _id: product._id,
                name: product.name,
                basePrice: product.basePrice,
                compareAtPrice: product.compareAtPrice,
                images: product.images,
                slug: product.slug,
                minQuantity: product.minQuantity ?? 1,
                maxQuantity: product.maxQuantity ?? 1000,
                estimatedDeliveryDays: product.estimatedDeliveryDays,
                quantity,
                variants,
                personalization,
              },
            ],
          };
        });
      },

      // Set exact quantity
      setQuantity: (cartItemId, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId
              ? {
                  ...i,
                  quantity: Math.max(
                    i.minQuantity ?? 1,
                    Math.min(i.maxQuantity ?? 1000, quantity),
                  ),
                }
              : i,
          ),
        }));
      },

      // Increment by 1
      increment: (cartItemId) => {
        const item = get().items.find((i) => i.cartItemId === cartItemId);
        if (!item) return;
        if (item.quantity >= (item.maxQuantity ?? 1000)) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.cartItemId === cartItemId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        }));
      },

      // Decrement by 1 — removes item if hitting minQuantity
      decrement: (cartItemId) => {
        const item = get().items.find((i) => i.cartItemId === cartItemId);
        if (!item) return;
        if (item.quantity - 1 < (item.minQuantity ?? 1)) {
          set((state) => ({
            items: state.items.filter((i) => i.cartItemId !== cartItemId),
          }));
        } else {
          set((state) => ({
            items: state.items.map((i) =>
              i.cartItemId === cartItemId
                ? { ...i, quantity: i.quantity - 1 }
                : i,
            ),
          }));
        }
      },

      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.cartItemId !== cartItemId),
        }));
      },

      clearCart: () => set({ items: [] }),

      // Derived: get cart entry for a specific productId + variants combo
      getCartItem: (productId, variants = {}) => {
        return (
          get().items.find(
            (i) =>
              i._id === productId &&
              JSON.stringify(i.variants) === JSON.stringify(variants),
          ) ?? null
        );
      },

      // Derived: total item count for badge
      totalCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      // Derived: subtotal
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.basePrice * i.quantity, 0),
    }),
    {
      name: "ebunly-cart", // localStorage key
    },
  ),
);
