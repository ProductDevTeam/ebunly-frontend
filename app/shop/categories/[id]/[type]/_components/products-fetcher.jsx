import { getProductsByType, getSubFilters } from "@/lib/api/products";
import ProductsClient from "./products-client";

export default async function ProductsFetcher({ typeName }) {
  const [{ products, totalPages }, subFilters] = await Promise.all([
    getProductsByType(typeName),
    getSubFilters(typeName),
  ]);

  return (
    <ProductsClient
      initialProducts={products}
      initialTotalPages={totalPages}
      typeName={typeName}
      subFilters={subFilters}
    />
  );
}
