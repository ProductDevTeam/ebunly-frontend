import { getProductsBySubcategory, getSubFilters } from "@/lib/api/products";
import ProductsClient from "./products-client";

export default async function ProductsFetcher({ categorySlug, subcategorySlug }) {
  const [products, subFilters] = await Promise.all([
    getProductsBySubcategory(categorySlug, subcategorySlug),
    getSubFilters(subcategorySlug),
  ]);

  return (
    <ProductsClient
      products={products}
      subFilters={subFilters}
    />
  );
}
