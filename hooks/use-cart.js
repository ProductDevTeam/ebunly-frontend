"use client";

import { useSyncExternalStore, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useCartStore } from "@/hooks/use-cart-store";
import { useAuthStore } from "@/hooks/use-auth-store";
import { hasAuthToken } from "@/hooks/use-profile";
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
} from "@/lib/cart";

export const cartKeys = { all: ["cart"] };

// ── Mapping between the local store shape and the Swagger shape ─────────────
function toServerVariants(variants) {
  return Object.entries(variants ?? {})
    .filter(([, value]) => value)
    .map(([variantName, selectedOption]) => ({ variantName, selectedOption }));
}

function toServerPersonalization(p) {
  if (!p || typeof p !== "object") return undefined;
  const { text, textColor, fontStyle, ...rest } = p;
  const joined = Object.values(rest).filter(Boolean).join(", ");
  const payload = {
    text: text ?? (joined || undefined),
    textColor,
    fontStyle,
  };
  return Object.values(payload).some(Boolean) ? payload : undefined;
}

// Normalise a server cart line into the shape the UI already consumes.
function normalizeServerItem(item) {
  const product = item.product ?? item;
  const rawVariants = item.selectedVariants ?? product.selectedVariants ?? [];
  const variants = Array.isArray(rawVariants)
    ? Object.fromEntries(
        rawVariants.map((v) => [
          (v.variantName ?? "").toLowerCase(),
          v.selectedOption,
        ]),
      )
    : rawVariants || {};

  return {
    cartItemId: item._id ?? item.id ?? item.itemId,
    _id: product._id ?? product.id ?? item.productId,
    name: product.name,
    basePrice: product.basePrice ?? item.price ?? 0,
    compareAtPrice: product.compareAtPrice,
    images: product.images,
    slug: product.slug,
    quantity: item.quantity ?? 1,
    minQuantity: product.minQuantity ?? 1,
    maxQuantity: product.maxQuantity ?? 1000,
    variants,
    personalization: item.personalization ?? null,
  };
}

function sameVariants(a, b) {
  return JSON.stringify(a ?? {}) === JSON.stringify(b ?? {});
}

// ── Hydration flag (persisted store + cookie are client-only) ───────────────
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Unified cart facade.
 *
 * - Guest (no auth): delegates to the persisted Zustand store.
 * - Logged in: reads/writes the server cart via the proxy, normalised to the
 *   same item shape so every consumer (navbar badge, cart page, add-to-cart)
 *   works unchanged.
 */
export function useCart() {
  const hydrated = useHydrated();
  const queryClient = useQueryClient();

  const user = useAuthStore((s) => s.user);
  const loggedIn = hydrated && !!user && hasAuthToken();

  // ── Local (guest) store ───────────────────────────────────────────────────
  const store = useCartStore();

  // ── Server cart query ─────────────────────────────────────────────────────
  const { data: serverCart, isLoading: serverLoading } = useQuery({
    queryKey: cartKeys.all,
    queryFn: getCart,
    enabled: loggedIn,
    staleTime: 30 * 1000,
  });

  const invalidate = useCallback(
    () => queryClient.invalidateQueries({ queryKey: cartKeys.all }),
    [queryClient],
  );

  const addMutation = useMutation({
    mutationFn: apiAddToCart,
    onSuccess: invalidate,
  });
  const updateMutation = useMutation({
    mutationFn: ({ itemId, patch }) => apiUpdateCartItem(itemId, patch),
    onSuccess: invalidate,
  });
  const removeMutation = useMutation({
    mutationFn: (itemId) => apiRemoveCartItem(itemId),
    onSuccess: invalidate,
  });

  const serverItems = (serverCart?.items ?? []).map(normalizeServerItem);

  // ── Guest facade ──────────────────────────────────────────────────────────
  if (!loggedIn) {
    return {
      isLoggedIn: false,
      hydrated,
      isLoading: false,
      items: hydrated ? store.items : [],
      addItem: store.addItem,
      setQuantity: store.setQuantity,
      increment: store.increment,
      decrement: store.decrement,
      removeItem: store.removeItem,
      clearCart: store.clearCart,
      getCartItem: store.getCartItem,
      subtotal: store.subtotal,
      totalCount: store.totalCount,
    };
  }

  // ── Server facade ─────────────────────────────────────────────────────────
  const findById = (cartItemId) =>
    serverItems.find((i) => i.cartItemId === cartItemId);

  const addItem = (product, quantity = 1, variants = {}, personalization) => {
    addMutation.mutate({
      productId: product._id,
      quantity,
      selectedOptions: [],
      selectedVariants: toServerVariants(variants),
      personalization: toServerPersonalization(personalization),
    });
  };

  const setQuantity = (cartItemId, quantity) => {
    const item = findById(cartItemId);
    if (!item) return;
    const clamped = Math.max(
      item.minQuantity ?? 1,
      Math.min(item.maxQuantity ?? 1000, quantity),
    );
    updateMutation.mutate({ itemId: cartItemId, patch: { quantity: clamped } });
  };

  const increment = (cartItemId) => {
    const item = findById(cartItemId);
    if (!item || item.quantity >= (item.maxQuantity ?? 1000)) return;
    updateMutation.mutate({
      itemId: cartItemId,
      patch: { quantity: item.quantity + 1 },
    });
  };

  const decrement = (cartItemId) => {
    const item = findById(cartItemId);
    if (!item) return;
    if (item.quantity - 1 < (item.minQuantity ?? 1)) {
      removeMutation.mutate(cartItemId);
    } else {
      updateMutation.mutate({
        itemId: cartItemId,
        patch: { quantity: item.quantity - 1 },
      });
    }
  };

  const removeItem = (cartItemId) => removeMutation.mutate(cartItemId);

  const clearCart = () =>
    serverItems.forEach((i) => removeMutation.mutate(i.cartItemId));

  const getCartItem = (productId, variants = {}) =>
    serverItems.find(
      (i) => i._id === productId && sameVariants(i.variants, variants),
    ) ?? null;

  const subtotal = () =>
    serverCart?.subtotal ??
    serverItems.reduce((sum, i) => sum + (i.basePrice ?? 0) * i.quantity, 0);

  const totalCount = () =>
    serverItems.reduce((sum, i) => sum + i.quantity, 0);

  return {
    isLoggedIn: true,
    hydrated,
    isLoading: serverLoading,
    items: serverItems,
    addItem,
    setQuantity,
    increment,
    decrement,
    removeItem,
    clearCart,
    getCartItem,
    subtotal,
    totalCount,
  };
}

/**
 * Merge the guest (local) cart into the server cart after login, then clear
 * the local store. Returns a function to invoke once login succeeds.
 */
export function useMergeGuestCart() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    const localItems = useCartStore.getState().items;
    if (!localItems.length) return;

    try {
      for (const item of localItems) {
        await apiAddToCart({
          productId: item._id,
          quantity: item.quantity,
          selectedOptions: [],
          selectedVariants: toServerVariants(item.variants),
          personalization: toServerPersonalization(item.personalization),
        });
      }
      useCartStore.getState().clearCart();
    } catch {
      // Best-effort merge — leave the local cart intact if the server rejects.
    } finally {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    }
  }, [queryClient]);
}
