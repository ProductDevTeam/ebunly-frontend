"use client";

import ProductCard from "@/components/common/product-card";

/*
 * "Related to your search" — mock data. No backend field or endpoint returns
 * search-context-aware recommendations today (confirmed against the live
 * product payload and the /search paths in the OpenAPI spec); this renders
 * the same placeholder set the export itself used until one exists.
 */
const MOCK_PRODUCTS = Array.from({ length: 9 }, (_, i) => ({
  id: `related-to-search-${i}`,
  name: "Engraved jewellery box",
  price: 30000,
  image: i % 2 === 0 ? "/product.png" : "/product2.png",
  images: ["/product.png", "/product2.png"],
  slug: "engraved-jewellery-box",
  personalizable: i === 0,
}));

export default function RelatedToYourSearch({
  products = MOCK_PRODUCTS,
  className = "",
}) {
  if (products.length === 0) return null;

  return (
    <section
      data-section="related-to-search"
      className={` pb-10 md:pb-14 ${className}`}
    >
      <div className="max-w-308 mx-auto px-4 py-4 md:py-10">
        <h2 className="mb-6 md:mb-8 leading-[110%]">
          <span
            className="font-sans font-bold text-[26px] md:text-[36px] text-[#1A1A1A]"
            style={{ letterSpacing: "-2%" }}
          >
            Related to{" "}
          </span>
          <span
            className="font-playfair italic text-[26px] md:text-[36px] text-[#1A1A1A]"
            style={{ fontWeight: 500, letterSpacing: "-2%" }}
          >
            your search
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.slice(0, 10).map((product) => (
            <ProductCard
              key={product.id ?? product._id ?? product.slug}
              product={product}
              sizes="(max-width: 768px) 45vw, 220px"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
