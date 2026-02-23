"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

function ProductSkeleton() {
  return (
    <div className="animate-pulse font-sans">
      <div className="bg-gray-200 rounded-xl aspect-square mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function ProductGrid({
  products = [],
  isLoading,
  isError,
  error,
  pagination,
}) {
  if (isLoading) {
    return (
      <div className="p-4 lg:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 px-4">
        <p className="text-red-500 font-medium mb-2">Failed to load products</p>
        <p className="text-gray-600 text-sm">{error?.message}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 px-4">
        <p className="text-gray-500 font-medium text-lg">No products found</p>
        <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <span className="px-4 py-2 font-medium">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, index }) {
  const mainImage =
    product.images?.find((img) => img.isMain)?.url ||
    product.images?.[0]?.url ||
    "/product.png";

  return (
    <Link href={`/discover/${product._id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group cursor-pointer font-sans"
      >
        <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square mb-3">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={index < 4}
          />
        </div>

        <div className="space-y-1 font-sans">
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-base font-medium text-gray-900">
            ₦{product.basePrice.toLocaleString()}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
