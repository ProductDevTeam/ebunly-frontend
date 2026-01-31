"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
      const scrollAmount = 320; // Card width + gap
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
    <section className="pt-12 md:py-16 lg:py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              {title}
            </h2>
            {emoji && <span className="text-2xl md:text-3xl">{emoji}</span>}
          </motion.div>

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
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-none w-[260px] md:w-[280px] lg:w-[300px] snap-start"
            >
              <Link href={`/products/${product.slug}`} className="group block">
                {/* Product Image */}
                <div className="relative w-full rounded-2xl overflow-hidden mb-3 h-[250px] md:h-[280px] lg:h-[300px] bg-gray-100">
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
                  <h3 className="font-semibold text-base md:text-lg text-gray-900 truncate">
                    {product.name}
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            </motion.div>
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
