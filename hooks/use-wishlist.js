"use client";

import { useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";

import { useWishlistStore, toWishlistItem } from "@/hooks/use-wishlist-store";
import { useAuthStore } from "@/hooks/use-auth-store";
import { hasAuthToken } from "@/hooks/use-profile";
import { useNotification } from "@/components/common/notification-provider";

export { toWishlistItem };

// Hydration flag — the persisted store is client-only, so gate reads on it to
// avoid an SSR/first-paint mismatch (same pattern as the cart facade).
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Wishlist facade — a **logged-in only** feature.
 *
 * Storage is local (persisted Zustand) until the backend ships a wishlist
 * endpoint; swap the internals here (read/write server + merge on login) and
 * no consumer changes. Guests can't use it: `toggle` bounces them to /login and
 * reads report empty, so hearts/badges only reflect a real session.
 */
export function useWishlist() {
  const hydrated = useHydrated();
  const router = useRouter();
  const pathname = usePathname();
  const { error: notifyError } = useNotification();

  const items = useWishlistStore((s) => s.items);
  const toggleStore = useWishlistStore((s) => s.toggle);
  const removeStore = useWishlistStore((s) => s.remove);

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = hydrated && !!user && hasAuthToken();

  const toggle = (product) => {
    if (!isLoggedIn) {
      notifyError("Log in to save your favorites.", "Login required");
      const redirect = encodeURIComponent(pathname || "/favorites");
      router.push(`/login?redirect=${redirect}`);
      return;
    }
    toggleStore(product);
  };

  return {
    hydrated,
    isLoggedIn,
    items: isLoggedIn ? items : [],
    toggle,
    remove: removeStore,
    has: (id) => (isLoggedIn ? items.some((i) => i.id === id) : false),
    count: () => (isLoggedIn ? items.length : 0),
  };
}
