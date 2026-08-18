"use client";

import ProductCard from "@/components/common/product-card";

/*
 * "More gifts like this" — real data, from product.relatedProducts.
 * Replaces the old "Loved right now" band, which the two-section export
 * (this one + related-to-search.jsx) superseded. Up to two rows (10 cards),
 * not one — the new export shows a partial second row.
 */
export default function RelatedProducts({ products = [], className = "" }) {
  if (products.length === 0) return null;

  return (
    <section
      data-section="more-gifts"
      className={` pb-10 md:pb-14 ${className}`}
    >
      <div className="max-w-308 mx-auto px-4 py-4 md:py-10">
        <h2 className="mb-6 md:mb-8 leading-[110%]">
          <span
            className="font-playfair italic text-[26px] md:text-[36px] text-[#1A1A1A]"
            style={{ fontWeight: 500, letterSpacing: "-2%" }}
          >
            More gifts{" "}
          </span>
          <span
            className="font-sans font-bold text-[26px] md:text-[36px] text-[#1A1A1A]"
            style={{ letterSpacing: "-2%" }}
          >
            like this
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
