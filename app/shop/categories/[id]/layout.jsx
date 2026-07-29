import {
  HERO_GRADIENT_VAR,
  pickHeroGradientColor,
} from "./_components/hero-gradient";

/**
 * Picks the hero gradient once per request and exposes it to the page and its
 * loading skeleton (both render as children of this layout).
 */
export default function CategoryLayout({ children }) {
  return (
    <div style={{ [HERO_GRADIENT_VAR]: pickHeroGradientColor() }}>
      {children}
    </div>
  );
}
