/**
 * Hero gradient palette for the category header.
 *
 * The top colour is picked at random per request in the segment layout, which
 * sets it as `--category-hero-from` on a wrapper. Both `page.jsx` and
 * `loading.jsx` render inside that layout, so the skeleton and the real header
 * always resolve to the same colour (no flash on hand-off).
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

export function pickHeroGradientColor() {
  return HERO_GRADIENT_COLORS[
    Math.floor(Math.random() * HERO_GRADIENT_COLORS.length)
  ];
}
