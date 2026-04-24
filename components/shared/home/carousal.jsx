"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

const SKELETON_COUNT = 5;

const SkeletonCard = () => (
  <div className="flex-none w-50 md:w-55 lg:w-60">
    <div className="mb-3 w-full rounded-2xl aspect-square skeleton" />
    <div className="skeleton h-3.5 w-3/4 rounded-full mb-2" />
    <div className="skeleton h-3.5 w-1/2 rounded-full" />
  </div>
);

const PerfectForYouSection = ({ products = [] }) => {
  const scrollRef = useRef(null);
  const [activeCard, setActiveCard] = useState(null);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? 280 : -280,
      behavior: "smooth",
    });
  };

  const isEmpty = products.length === 0;

  return (
    <section className="py-8 md:py-14 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div data-reveal className="reveal flex items-center justify-between mb-6 md:mb-8">
          <h2
            className="font-sans font-semibold leading-[120%] text-[20px] md:text-[28px] text-[#1E1E1E]"
            style={{ letterSpacing: "-2%" }}
          >
            Perfect for You
          </h2>

          {/* Arrow buttons – desktop only */}
          {!isEmpty && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Scroll left"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                aria-label="Scroll right"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-5 overflow-x-auto pb-2 scrollbar-hide"
        >
          {isEmpty
            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : products.map((product) => {
                const isActive = activeCard === product.id;
                return (
                  <div key={product.id} className="flex-none w-50 md:w-55 lg:w-60">
                    {/* Card */}
                    <div className="mb-3 relative w-full rounded-2xl overflow-hidden bg-gray-100 aspect-square group">
                      <Link href={`/discover/${product.slug}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 200px, 240px"
                        />
                      </Link>

                      {/* Plus / Close button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveCard(isActive ? null : product.id);
                        }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 z-10"
                      >
                        {isActive ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        )}
                      </button>

                      {/* CTA overlay */}
                      {isActive && (
                        <div className="md:hidden absolute bottom-0 left-0 right-0 flex flex-col">
                          <button
                            className="w-full text-[#444] text-[13px] font-medium py-3 text-center"
                            style={{ background: "#FFFFFF" }}
                          >
                            Add to favorites
                          </button>
                          <button className="w-full bg-[#F85826] text-white text-[14px] font-semibold py-3">
                            Add to cart
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <p className="font-semibold text-[13px] md:text-[14px] tracking-[-1%] text-black truncate leading-tight">
                          {product.name}
                        </p>
                        <p className="text-[13px] md:text-[14px] text-black mt-0.5 font-normal">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>
                      <button className="p-1.5">
                        <Image src="/icons/heart.svg" width={22} height={20} alt="Wishlist" />
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default PerfectForYouSection;
