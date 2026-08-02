import { getNavCategories } from "@/lib/api/categories";
import {
  HERO_GRADIENT_VAR,
  heroGradientColorFor,
} from "./_components/hero-gradient";

/**
 * Resolves the hero colour from the category and exposes it to everything in
 * this segment — the category page, its type pages, and both loading skeletons
 * all render as children of this layout.
 *
 * Deriving it from `id` rather than picking per request is what keeps
 * `/shop/categories/x` and `/shop/categories/x/y` in agreement when each is
 * opened on its own: a shared URL, a refresh, or a cold load. Client-side
 * navigation preserves this layout anyway, so that path was already consistent.
 *
 * `getNavCategories` is served from the hour-long taxonomy cache, so this adds
 * no per-request fetch.
 */
export default async function CategoryLayout({ children, params }) {
  const [{ id }, categories] = await Promise.all([params, getNavCategories()]);

  return (
    <div style={{ [HERO_GRADIENT_VAR]: heroGradientColorFor(id, categories) }}>
      {children}
    </div>
  );
}
