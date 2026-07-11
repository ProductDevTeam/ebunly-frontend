import { fetchProducts, getSubFiltersForCategory } from "@/lib/api/products";
import ProductsClient from "@/app/shop/categories/[id]/[type]/_components/products-client";

export default async function CategoryProductsFetcher({ categoryName, occasionTags = [] }) {
  const useTagFilter = occasionTags.length > 0;

  const [{ products, totalPages }, subFilters] = await Promise.all([
    useTagFilter
      ? fetchProducts({ occasionTags })
      : fetchProducts({ coreCategory: categoryName }),
    getSubFiltersForCategory(categoryName),
  ]);

  return (
    <ProductsClient
      initialProducts={products}
      initialTotalPages={totalPages}
      coreCategory={useTagFilter ? undefined : categoryName}
      occasionTags={useTagFilter ? occasionTags : undefined}
      subFilters={subFilters}
    />
  );
}
