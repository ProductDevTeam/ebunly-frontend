import { fetchLovedProducts } from "@/lib/api/products";
import LovedRightNowSection from "./loved-right-now";

/*
 * Server half of the "Loved right now" rail, so the section itself stays a
 * presentational client component.
 *
 * Rendered inside a Suspense boundary whose fallback is the same section with
 * no products — that is its skeleton state. Once the data lands, an empty list
 * means the call failed, and the whole band is dropped rather than left as five
 * permanent grey placeholders.
 */
export default async function LovedRightNowFetcher() {
  const products = await fetchLovedProducts();

  if (products.length === 0) return null;

  return <LovedRightNowSection products={products} />;
}
