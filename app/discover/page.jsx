import FilterBar from "@/components/shared/dashboard/filterbar";
import ProductGrid from "@/components/shared/dashboard/product-grid";
import SearchBar from "@/components/shared/dashboard/search-bar";

export default function HomePage() {
  return (
    <>
      <SearchBar />
      <FilterBar />
      <ProductGrid />
    </>
  );
}
