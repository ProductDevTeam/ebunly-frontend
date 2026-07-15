"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import FavoriteButton from "@/components/common/favorite-button";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart, toCartProduct } from "@/hooks/use-cart";
import { useNotification } from "@/components/common/notification-provider";

export default function ProductCard({ product }) {
  const [isActive, setIsActive] = useState(false);
  const { toggle: toggleFavorite } = useWishlist();
  const { addItem } = useCart();
  const { success: notifySuccess } = useNotification();

  const handleAddToCart = () => {
    addItem(toCartProduct(product), 1, {}, null);
    notifySuccess(`${product.name} added to your cart.`, "Added to cart");
    setIsActive(false);
  };

  return (
    <div>
      {/* Image area */}
      <div className="relative rounded-2xl overflow-hidden bg-[#F5F5F5] aspect-square mb-2.5">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
          />
        </Link>

        {/* Plus / close button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsActive(!isActive);
          }}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-[#0C0000] z-20"
          aria-label={isActive ? "Close" : "Quick add"}
        >
          <motion.span
            animate={{ rotate: isActive ? 45 : 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
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
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(product);
                  setIsActive(false);
                }}
                className="w-full bg-white text-[#444] text-[12px] font-medium py-2.5 text-center"
              >
                Add to favorites
              </motion.button>
              <motion.button
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                className="w-full bg-[#F85826] text-white text-[13px] font-semibold py-2.5"
              >
                Add to cart
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info row */}
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p
            className="font-semibold text-[13px] md:text-[14px] text-[#000000] truncate leading-tight"
            style={{ letterSpacing: "-0.01em" }}
          >
            {product.name}
          </p>
          <p className="text-[13px] md:text-[14px] text-[#0C0000] mt-0.5 font-normal">
            ₦{product.price.toLocaleString()}
          </p>
        </div>
        <FavoriteButton product={product} size={20} />
      </div>
    </div>
  );
}
