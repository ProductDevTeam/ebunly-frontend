import { getSubcategoriesBySlug } from "@/lib/api/categories";
import SubCatCard from "./sub-cat-card";

export default async function CategoryGrid({ categorySlug }) {
  const subcategories = await getSubcategoriesBySlug(categorySlug);

  const row1 = subcategories.slice(0, 4);
  const row2 = subcategories.slice(4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {row1.map((cat) => (
          <SubCatCard key={cat.id} cat={cat} categorySlug={categorySlug} />
        ))}
      </div>
      {row2.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {row2.map((cat) => (
            <div key={cat.id} className="w-[calc(50%-4px)] md:w-[calc(25%-6px)] shrink-0">
              <SubCatCard cat={cat} categorySlug={categorySlug} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
