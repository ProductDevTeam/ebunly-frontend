import { getProductsByCategory, getSubFiltersForCategory } from "@/lib/api/products";
import ProductsClient from "@/app/shop/categories/[id]/[type]/_components/products-client";

export default async function CategoryProductsFetcher({ categoryName }) {
  const [{ products, totalPages }, subFilters] = await Promise.all([
    getProductsByCategory(categoryName),
    getSubFiltersForCategory(categoryName),
  ]);
  return (
    <ProductsClient
      initialProducts={products}
      initialTotalPages={totalPages}
      coreCategory={categoryName}
      subFilters={subFilters}
    />
  );
}
