"use client";

import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/utils/api-fetch";
import { getAllProducts } from "@/lib/products";

/*
 * GET /search?q= — the Algolia-backed product search. Public, no auth.
 *
 *   q            required; a missing or empty q is a 400
 *   page         ZERO-indexed (GET /products is one-indexed — see toApiPage)
 *   limit        default 15, max 50
 *   minPrice     minPrice / maxPrice bound basePrice
 *   maxPrice
 *   budgetTier   the naira strings ("₦10k & Under"), same as the taxonomy
 *   recipientTag SINGULAR, one value ("Women")
 *   occasionTag  SINGULAR, one value ("Birthday")
 *
 * Two things differ from the note the API author sent, both verified against
 * the live endpoint on 2026-07-30:
 *
 *   1. The response is wrapped in the usual { success, message, data } envelope,
 *      not returned bare.
 *   2. `budgetTier` does NOT accept budget|mid|premium|luxury — those match
 *      nothing. It takes the same naira strings every other endpoint uses.
 *
 * Hits are index records, not products: `objectID` instead of `_id`, a single
 * `image` string instead of an `images` gallery, and no `isPersonalizable`,
 * `discountPercentage` or delivery fields. `normalizeHit` shapes them like an
 * API product so the existing grid and panel render them unchanged, but the
 * missing fields stay missing rather than being invented — a search result
 * cannot show a discount badge or a "Personalizable" flag until the index
 * carries them.
 */

export const searchKeys = {
  query: (params) => ["search", params],
};

const MAX_LIMIT = 50;

/** UI pages are 1-indexed everywhere else in the app; /search is 0-indexed. */
const toApiPage = (page) => Math.max(0, (Number(page) || 1) - 1);
const fromApiPage = (page) => (Number(page) || 0) + 1;

export function normalizeHit(hit) {
  const image = typeof hit.image === "string" ? hit.image : hit.image?.url;
  return {
    _id: hit.objectID ?? hit._id ?? hit.id,
    name: hit.name ?? "",
    slug: hit.slug ?? "",
    basePrice: hit.basePrice ?? hit.price ?? 0,
    // The grid reads images[].url, so keep that shape with the one we have.
    images: image ? [{ url: image }] : [],
    subcategory: hit.subcategory,
    vendorName: hit.vendorName,
    recipientTags: hit.recipientTags ?? [],
    occasionTags: hit.occasionTags ?? [],
    styleTags: hit.styleTags ?? [],
    budgetTier: hit.budgetTier,
    // "Personalized Cotton T-<em>Shirt</em>" — the matched span, if a caller
    // wants to render it. Nothing does yet.
    highlightedName: hit._highlightResult?.name?.value,
  };
}

function buildSearchQuery({
  q,
  page = 1,
  limit = 15,
  minPrice,
  maxPrice,
  budgetTier,
  recipientTag,
  occasionTag,
}) {
  const params = new URLSearchParams({ q });
  params.set("page", String(toApiPage(page)));
  params.set("limit", String(Math.min(Number(limit) || 15, MAX_LIMIT)));

  const setNumber = (key, value) => {
    if (value !== undefined && value !== "" && !isNaN(Number(value)))
      params.set(key, String(Number(value)));
  };
  setNumber("minPrice", minPrice);
  setNumber("maxPrice", maxPrice);

  if (budgetTier) params.set("budgetTier", budgetTier);
  if (recipientTag) params.set("recipientTag", recipientTag);
  if (occasionTag) params.set("occasionTag", occasionTag);

  return params.toString();
}

/** Raw search. Disabled until there is something to search for. */
export function useSearch(params = {}, options = {}) {
  const q = (params.q ?? "").trim();

  return useQuery({
    queryKey: searchKeys.query({ ...params, q }),
    queryFn: async () => {
      const res = await apiGet(`search?${buildSearchQuery({ ...params, q })}`);
      const data = res?.data ?? res;
      return {
        products: (data.hits ?? []).map(normalizeHit),
        total: data.total ?? 0,
        page: fromApiPage(data.page),
        totalPages: data.totalPages ?? 0,
        perPage: data.hitsPerPage,
        query: data.query ?? q,
        categorySuggestions: data.categorySuggestions ?? [],
      };
    },
    enabled: q.length > 0,
    staleTime: 60 * 1000,
    ...options,
  });
}

/*
 * A term always goes to /search, because relevance ordering is the point of it
 * — /products can only sort by createdAt, basePrice or discountPercentage, so
 * routing a term there to keep one extra facet would quietly reorder the
 * results. The facets /search cannot express are therefore browse-only, and the
 * filter bar disables them while a term is active rather than accepting input
 * it would have to drop.
 */
export const SEARCH_FACETS = new Set([
  "minPrice",
  "maxPrice",
  "budgetTier",
  "occasionTags",
  "recipients",
]);

export const BROWSE_ONLY_FACETS = new Set([
  "styleTags",
  "madeInNigeria",
  "minDiscount",
  "maxDeliveryDays",
  "category",
  "coreCategory",
  "subcategory",
  "featured",
  "vendor",
  "sortBy",
  "sortOrder",
]);

export const isSearching = (filters = {}) =>
  Boolean((filters.search ?? "").trim());

/** Drops what /search cannot apply, so no filter is silently half-honoured. */
export function stripBrowseOnlyFacets(filters = {}) {
  const next = { ...filters };
  BROWSE_ONLY_FACETS.forEach((key) => {
    delete next[key];
  });
  return next;
}

/**
 * The results-page facade. Returns one shape whichever endpoint answered, so
 * callers never branch on it.
 *
 *   a term → /search    relevance-ordered, typo tolerant, category suggestions
 *   no term → /products  the full facet set, newest first
 *
 * `/search` takes one value per tag facet, so while searching those behave as
 * single-select; the filter bar enforces that rather than sending the first of
 * several and pretending the rest applied.
 */
export function useProductSearch(filters = {}) {
  const useSearchApi = isSearching(filters);

  const searchQuery = useSearch(
    {
      q: filters.search,
      page: filters.page,
      limit: filters.limit,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      budgetTier: filters.budgetTier,
      recipientTag: filters.recipients?.[0],
      occasionTag: filters.occasionTags?.[0],
    },
    { enabled: useSearchApi },
  );

  const productsQuery = useQuery({
    queryKey: ["products", filters],
    queryFn: () => getAllProducts(filters),
    enabled: !useSearchApi,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  if (useSearchApi) {
    return {
      products: searchQuery.data?.products ?? [],
      total: searchQuery.data?.total ?? 0,
      page: searchQuery.data?.page ?? 1,
      totalPages: searchQuery.data?.totalPages ?? 1,
      categorySuggestions: searchQuery.data?.categorySuggestions ?? [],
      isLoading: searchQuery.isLoading,
      isError: searchQuery.isError,
      error: searchQuery.error,
      source: "search",
    };
  }

  const meta = productsQuery.data?.meta ?? {};
  return {
    products: productsQuery.data?.data ?? [],
    total: meta.total ?? 0,
    page: meta.page ?? 1,
    totalPages: meta.totalPages ?? 1,
    categorySuggestions: [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    source: "products",
  };
}
