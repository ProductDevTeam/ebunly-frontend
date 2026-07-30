"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
} from "@/utils/api-fetch";
import { hasAuthToken } from "@/hooks/use-profile";

/*
 * Named wishlists — the gift-registry feature, not the favourites heart.
 *
 *   GET    /wishlists                            own lists
 *   POST   /wishlists                            { name, description, isPublic }
 *   GET    /wishlists/{id}
 *   PUT    /wishlists/{id}                       rename / change visibility
 *   DELETE /wishlists/{id}
 *   POST   /wishlists/{id}/items                 { productId }
 *   DELETE /wishlists/{id}/items/{itemId}
 *   GET    /wishlists/public/{slug}              no auth — the shared link
 *   PATCH  /wishlists/{id}/items/{itemId}/fund   no auth — a gifter claims an item
 *
 * The spec documents no response schema for these, so `normalizeWishlist`
 * accepts the field spellings the rest of this codebase already sees from the
 * API (`_id` or `id`, items either embedded or counted) and derives the rest.
 * Anything genuinely absent comes back undefined rather than guessed, so a
 * caller can tell "none" from "not sent".
 */

export const wishlistKeys = {
  all: ["wishlists"],
  detail: (id) => ["wishlists", "detail", id],
  public: (slug) => ["wishlists", "public", slug],
};

const SHARE_HOST =
  process.env.NEXT_PUBLIC_WISHLIST_SHARE_HOST ?? "wishlist.ebunly.com";

function normalizeItem(item) {
  const product = item?.product ?? item ?? {};
  return {
    id: item?._id ?? item?.id ?? product._id ?? product.id,
    productId: product._id ?? product.id ?? item?.productId,
    name: product.name,
    price: product.basePrice ?? product.price ?? 0,
    image:
      (typeof product.images?.[0] === "string"
        ? product.images[0]
        : product.images?.[0]?.url) ?? "/product.png",
    slug: product.slug,
    funded: Boolean(item?.isFunded ?? item?.funded),
  };
}

export function normalizeWishlist(list) {
  if (!list) return null;
  const id = list._id ?? list.id;
  const items = Array.isArray(list.items) ? list.items.map(normalizeItem) : [];
  const total = list.itemCount ?? list.totalItems ?? items.length;
  const funded = list.fundedCount ?? items.filter((i) => i.funded).length;

  return {
    id,
    name: list.name ?? "",
    description: list.description ?? "",
    isPublic: Boolean(list.isPublic),
    slug: list.slug,
    items,
    itemCount: total,
    fundedCount: funded,
    createdAt: list.createdAt,
    // The API returns a slug, not a URL; the share host is ours to compose.
    shareUrl: list.slug ? `${SHARE_HOST}/${list.slug}` : undefined,
    // Not returned today — the Wishlists screen renders avatars only if it is.
    contributors: list.contributors,
  };
}

const unwrap = (res) => res?.data ?? res;

/* A 401 will not become a 200 by asking again — fail straight to the empty state. */
function retryUnlessUnauthorized(failureCount, error) {
  if (/401|unauthor/i.test(error?.message ?? "")) return false;
  return failureCount < 2;
}

// ── Reads ───────────────────────────────────────────────────────────────────

export function useWishlists(options = {}) {
  return useQuery({
    queryKey: wishlistKeys.all,
    queryFn: async () => {
      const data = unwrap(await apiGet("wishlists"));
      return (Array.isArray(data) ? data : (data?.wishlists ?? [])).map(
        normalizeWishlist,
      );
    },
    enabled: hasAuthToken(),
    staleTime: 60 * 1000,
    retry: retryUnlessUnauthorized,
    ...options,
  });
}

export function useWishlist(id, options = {}) {
  return useQuery({
    queryKey: wishlistKeys.detail(id),
    queryFn: async () =>
      normalizeWishlist(unwrap(await apiGet(`wishlists/${id}`))),
    enabled: Boolean(id) && hasAuthToken(),
    staleTime: 60 * 1000,
    retry: retryUnlessUnauthorized,
    ...options,
  });
}

/** The shared link — public, so this one does not gate on a token. */
export function usePublicWishlist(slug, options = {}) {
  return useQuery({
    queryKey: wishlistKeys.public(slug),
    queryFn: async () =>
      normalizeWishlist(unwrap(await apiGet(`wishlists/public/${slug}`))),
    enabled: Boolean(slug),
    staleTime: 60 * 1000,
    ...options,
  });
}

// ── Writes ──────────────────────────────────────────────────────────────────

function useWishlistMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all }),
  });
}

/** Resolves to the created list, so a caller can add an item to it straight away. */
export function useCreateWishlist() {
  return useWishlistMutation(async ({ name, description, isPublic = true }) =>
    normalizeWishlist(
      unwrap(await apiPost("wishlists", { name, description, isPublic })),
    ),
  );
}

export function useUpdateWishlist() {
  return useWishlistMutation(({ id, ...patch }) =>
    apiPut(`wishlists/${id}`, patch),
  );
}

export function useDeleteWishlist() {
  return useWishlistMutation((id) => apiDelete(`wishlists/${id}`));
}

export function useAddWishlistItem() {
  return useWishlistMutation(({ wishlistId, productId }) =>
    apiPost(`wishlists/${wishlistId}/items`, { productId }),
  );
}

export function useRemoveWishlistItem() {
  return useWishlistMutation(({ wishlistId, itemId }) =>
    apiDelete(`wishlists/${wishlistId}/items/${itemId}`),
  );
}

/** Gifters use this from a shared link, so it invalidates the public copy. */
export function useFundWishlistItem(slug) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ wishlistId, itemId }) =>
      apiPatch(`wishlists/${wishlistId}/items/${itemId}/fund`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wishlistKeys.all });
      if (slug)
        queryClient.invalidateQueries({ queryKey: wishlistKeys.public(slug) });
    },
  });
}
