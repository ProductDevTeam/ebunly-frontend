"use client";

import ProductCard from "@/components/common/product-card";

/*
 * Related products under the product detail.
 *
 * The exports disagreed on the heading — desktop drew "Loved right now", mobile
 * drew "More gifts like this". Resolved in favour of "Loved right now" on both,
 * sized to match the homepage rail (26px mobile → 36px desktop).
 */
export default function RelatedProducts({ products = [], className = "" }) {
  if (products.length === 0) return null;

  return (
    <section className={` pb-10 md:pb-14 ${className}`}>
      <div className="max-w-308 mx-auto px-4 py-4 md:py-10">
        <h2 className="mb-6 md:mb-8 leading-[110%]">
          <span
            className="font-playfair italic text-[26px] md:text-[36px] text-[#1A1A1A]"
            style={{ fontWeight: 500, letterSpacing: "-2%" }}
          >
            Loved{" "}
          </span>
          <span
            className="font-sans font-bold text-[26px] md:text-[36px] text-[#1A1A1A]"
            style={{ letterSpacing: "-2%" }}
          >
            right now
          </span>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {products.slice(0, 5).map((product) => (
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
