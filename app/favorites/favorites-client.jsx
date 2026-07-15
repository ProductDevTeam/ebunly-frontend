"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { useWishlist } from "@/hooks/use-wishlist";
import { useCart, toCartProduct } from "@/hooks/use-cart";
import { useNotification } from "@/components/common/notification-provider";

function FavoriteCard({ item, onAddToCart, onRemove }) {
  return (
    <motion.div layout exit={{ opacity: 0, scale: 0.96 }} className="min-w-0">
      {/* Image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F5F5F5]">
        <Link href={`/products/${item.slug ?? item.id}`}>
          <Image
            src={item.image}
            alt={item.name}
            fill
            unoptimized
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover"
          />
        </Link>

        {/* Quick add to cart — top-right on mobile, bottom-right on desktop (Figma) */}
        <button
          onClick={() => onAddToCart(item)}
          className="absolute right-2.5 top-2.5 md:top-auto md:bottom-2.5 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
          aria-label={`Add ${item.name} to cart`}
        >
          <Plus className="w-4 h-4" strokeWidth={2.2} />
        </button>
      </div>

      {/* Info */}
      <div className="flex items-start justify-between gap-2 mt-3">
        <div className="min-w-0">
          <p className="font-semibold text-sm md:text-[15px] text-gray-900 truncate leading-tight">
            {item.name}
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            ₦{Number(item.price).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="p-1.5 shrink-0"
          aria-label={`Remove ${item.name} from favorites`}
        >
          <Heart className="w-5.5 h-5.5 text-[#F85826] fill-[#F85826]" />
        </button>
      </div>
    </motion.div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6 md:gap-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-2xl bg-gray-100" />
          <div className="h-3.5 w-3/4 bg-gray-100 rounded-full mt-3" />
          <div className="h-3.5 w-1/2 bg-gray-100 rounded-full mt-2" />
        </div>
      ))}
    </div>
  );
}

export default function FavoritesClient() {
  const { hydrated, items, remove } = useWishlist();
  const { addItem } = useCart();
  const { success: notifySuccess } = useNotification();

  const handleAddToCart = (item) => {
    addItem(toCartProduct(item), 1, {}, null);
    notifySuccess(`${item.name} added to your cart.`, "Added to cart");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Header — centered on mobile, left-aligned on desktop */}
      <div className="text-center md:text-left mb-8 md:mb-12">
        <h1 className="text-2xl md:text-[32px] font-bold text-gray-900">
          Favorites
        </h1>
        <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-500">
          Your saved products, all in one place
        </p>
      </div>

      {!hydrated ? (
        <SkeletonGrid />
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-[#FFF1EC] rounded-full flex items-center justify-center mb-4">
            <Heart className="w-9 h-9 text-[#F85826]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            No favorites yet
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Tap the heart on any product to save it here.
          </p>
          <Link
            href="/"
            className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-105 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-6 md:gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <FavoriteCard
                key={item.id}
                item={item}
                onAddToCart={handleAddToCart}
                onRemove={remove}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}
