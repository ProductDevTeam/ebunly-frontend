"use client";

import ProductCard from "@/components/common/product-card";

const SKELETON_COUNT = 5;

const SkeletonCard = () => (
  <div className="flex-none w-60 md:w-auto">
    <div className="mb-3.5 w-full rounded-2xl aspect-square skeleton" />
    <div className="skeleton h-3.5 w-3/4 rounded-full mb-2" />
    <div className="skeleton h-3.5 w-1/2 rounded-full" />
  </div>
);

const LovedRightNowSection = ({ products = [] }) => {
  const isEmpty = products.length === 0;

  return (
    <section className="bg-[#FCFAF7] py-10 md:py-14 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 data-reveal className="reveal mb-6 md:mb-8 leading-[110%]">
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

        {/* Products */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
          {isEmpty
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex-none w-60 md:w-auto">
                  <ProductCard
                    product={product}
                    sizes="(max-width: 768px) 240px, 250px"
                  />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default LovedRightNowSection;
