import { getProductsBySubcategory, getSubFilters } from "@/lib/api/products";
import ProductsClient from "./products-client";

export default async function ProductsFetcher({ subcategorySlug, subcategoryName }) {
  const { products, totalPages } = await getProductsBySubcategory(subcategoryName);
  const subFilters = getSubFilters(subcategorySlug);

  return (
    <ProductsClient
      initialProducts={products}
      initialTotalPages={totalPages}
      subcategoryName={subcategoryName}
      subFilters={subFilters}
    />
  );
}
