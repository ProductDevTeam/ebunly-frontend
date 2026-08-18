"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/common/product-card";
import { apiGet } from "@/utils/api-fetch";

export default function RelatedProducts({ productId, className = "" }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!productId) return;
    apiGet(`products/${productId}/similar`)
      .then((res) => {
        const hits = res?.data?.hits ?? [];
        setProducts(hits);
      })
      .catch(() => {});
  }, [productId]);

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
              key={product.objectID ?? product._id ?? product.slug}
              product={product}
              sizes="(max-width: 768px) 45vw, 220px"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
