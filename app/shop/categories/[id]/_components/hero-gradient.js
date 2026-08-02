/**
 * Hero gradient palette for the category header.
 *
 * The top colour is a property of the category, not of the request. A category
 * page and every type page beneath it are separate requests whenever one is
 * opened by URL or refreshed, so picking per request made them disagree.
 *
 * It resolves from the category's position in the taxonomy, which cycles the
 * palette evenly — hashing the slug instead left one colour unused and put half
 * the categories on the same one. Slugs outside the taxonomy (the recipient
 * shortcuts, or anything unknown) fall back to a hash so they still get a
 * stable colour rather than none.
 *
 * The segment layout resolves it once and exposes it as `--category-hero-from`;
 * everything below reads that variable rather than recomputing.
 */
export const HERO_GRADIENT_COLORS = [
  "#EEE5F3", // lilac (original)
  "#E5FCED", // mint
  "#FCF6E5", // cream
  "#FCDCE9", // pink
];

export const HERO_GRADIENT_VAR = "--category-hero-from";

/** CSS value for the hero background — falls back to lilac if the var is unset. */
export const HERO_GRADIENT = `linear-gradient(180deg, var(${HERO_GRADIENT_VAR}, ${HERO_GRADIENT_COLORS[0]}) 0%, #FFFFFF 100%)`;

/** djb2 — stable across requests, which is the only property that matters. */
function hash(value) {
  let h = 5381;
  for (let i = 0; i < value.length; i += 1) {
    h = ((h << 5) + h + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * @param {string} categorySlug
 * @param {Array<{id: string}>} categories ordered taxonomy categories
 */
export function heroGradientColorFor(categorySlug, categories = []) {
  if (!categorySlug) return HERO_GRADIENT_COLORS[0];

  const index = categories.findIndex((c) => c.id === categorySlug);
  const seed = index >= 0 ? index : hash(String(categorySlug));

  return HERO_GRADIENT_COLORS[seed % HERO_GRADIENT_COLORS.length];
}
