/*
 * Shared by the server page and the client results component, so it lives in a
 * plain module: a `"use client"` file becomes a client reference on the server,
 * and only its components survive that boundary — importing a constant out of
 * one gives you a proxy, not the array (`RESULT_PARAMS.some is not a function`).
 */

/** The params that mean "show results" rather than the category's own shelf. */
export const RESULT_PARAMS = [
  "q",
  "search",
  "subcategory",
  "occasionTags",
  "occasions",
  "recipients",
  "styleTags",
  "giftTypes",
  "minPrice",
  "maxPrice",
  "minDiscount",
  "madeInNigeria",
  "maxDeliveryDays",
  "budgetTier",
];

export function hasResultParams(searchParams = {}) {
  return RESULT_PARAMS.some((key) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });
}
