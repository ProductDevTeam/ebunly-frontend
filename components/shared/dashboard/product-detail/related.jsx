"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import FavoriteButton from "@/components/common/favorite-button";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart, toCartProduct } from "@/hooks/use-cart";
import { useNotification } from "@/components/common/notification-provider";

export default function RelatedProducts({ products, className = "" }) {
  const [activeCard, setActiveCard] = useState(null);
  const scrollRef = useRef(null);
  const { toggle: toggleFavorite } = useWishlist();
  const { addItem } = useCart();
  const { success: notifySuccess } = useNotification();

  const handleAddToCart = (product) => {
    addItem(toCartProduct(product), 1, {}, null);
    notifySuccess(`${product.name} added to your cart.`, "Added to cart");
    setActiveCard(null);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = dir === "right" ? el.clientWidth : -el.clientWidth;
    const duration = 400;
    const start = el.scrollLeft;
    const startTime = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      el.scrollLeft = start + distance * ease(progress);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <div className={clsx("max-w-7xl mx-auto px-4 md:px-6 py-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">Goes great with</h2>

        {/* Arrow buttons – desktop only */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Scroll left"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            aria-label="Scroll right"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
      >
        {products.map((product) => {
          const isActive = activeCard === product.id;
          return (
            <div
              key={product.id}
              className="shrink-0 min-w-40 sm:min-w-45 md:min-w-62.5"
            >
              {/* Card */}
              <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-gray-100 group">
                <Link href={`/products/${product.slug ?? product.id}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, 250px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>

                {/* Plus / Close button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveCard(isActive ? null : product.id);
                  }}
                  className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 z-20"
                  aria-label={
                    isActive ? "Close product actions" : "Open product actions"
                  }
                >
                  <motion.span
                    animate={{ rotate: isActive ? 45 : 0 }}
                    transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                    className="relative block h-4 w-4"
                  >
                    <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 rounded-full bg-current" />
                    <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-current" />
                  </motion.span>
                </button>

                {/* CTA overlay */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="absolute inset-x-0 bottom-0 z-10 flex flex-col overflow-hidden"
                    >
                      <motion.button
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleFavorite(product);
                          setActiveCard(null);
                        }}
                        className="w-full bg-white text-[#444] text-[13px] font-medium py-3 text-center"
                      >
                        Add to favorites
                      </motion.button>
                      <motion.button
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="w-full bg-[#F85826] text-white text-[14px] font-semibold py-3"
                      >
                        Add to cart
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Info */}
              <div className="flex items-start justify-between gap-1">
                <div className="min-w-0">
                  <p className="font-semibold text-[13px] md:text-[14px] text-black truncate leading-tight">
                    {product.name}
                  </p>
                  <p className="text-[13px] md:text-[14px] text-black mt-0.5 font-normal">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>
                <FavoriteButton product={product} size={22} />
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
