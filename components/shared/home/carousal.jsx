"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const ProductCarouselSection = ({
  title,
  emoji,
  products,
  seeMoreLink = "/products",
}) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      const newPosition =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="pt-8 md:pt-14 md:py-16 lg:py-6 px-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-2">
            <h2 className="heading-1 font-bold">{title}</h2>
            {emoji && <span className="text-2xl md:text-3xl">{emoji}</span>}
          </div>

          <Link
            href={seeMoreLink}
            className="text-[#FF5722] font-semibold text-sm md:text-base hover:underline"
          >
            See More
          </Link>
        </div>

        {/* Products Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none w-65 md:w-70 lg:w-75 snap-start"
            >
              <Link href={`/products/${product.slug}`} className="group block">
                {/* Product Image */}
                <div className="relative w-full rounded-2xl overflow-hidden mb-3 h-62.5 md:h-70 lg:h-75 bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 260px, (max-width: 1024px) 280px, 300px"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <h3 className="font-semibold text-base md:text-[20px] text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-lg md:text-xl font-normal text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ProductCarouselSection;
