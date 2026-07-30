"use client";

import { useRouter, usePathname } from "next/navigation";

import { useWishlistStore, toWishlistItem } from "@/hooks/use-wishlist-store";
import { useHydrated } from "@/hooks/use-hydrated";
import { useAuthStore } from "@/hooks/use-auth-store";
import { hasAuthToken } from "@/hooks/use-profile";
import { useNotification } from "@/components/common/notification-provider";

export { toWishlistItem };

/**
 * Favourites facade — the heart on a product card — and **logged-in only**.
 *
 * Not the same thing as a wishlist: named lists live on the server under
 * /wishlists (see use-wishlists.js), while favourites have no endpoint at all,
 * so storage here stays local (persisted Zustand). If one lands, swap the
 * internals here and no consumer changes. Guests can't use it: `toggle` bounces
 * them to /login and reads report empty, so hearts and badges only ever reflect
 * a real session.
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
