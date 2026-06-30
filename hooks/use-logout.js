"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useCartStore } from "@/hooks/use-cart-store";

// Clears a client-readable cookie by name across the common paths.
function clearCookie(name) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Logs the user out entirely on the client.
 *
 * There is no logout endpoint, so this clears the `token`/`accessToken`
 * cookies (the proxy's auth signal), the persisted auth + cart stores, and the
 * React Query cache, then redirects to /login. Clearing the cookie and the
 * store together prevents the navbar/proxy desync that caused the redirect bug.
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const clearUser = useAuthStore((s) => s.clearUser);
  const clearCart = useCartStore((s) => s.clearCart);

  return useCallback(() => {
    clearCookie("token");
    clearCookie("accessToken");
    clearUser();
    clearCart();
    queryClient.clear();
    router.replace("/login");
  }, [clearUser, clearCart, queryClient, router]);
}
