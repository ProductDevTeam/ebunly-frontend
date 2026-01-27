"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

export default function RelatedProducts({ products, className = "" }) {
  return (
    <div className={clsx("px-4 md:px-8 py-4", className)}>
      <h2 className="text-lg font-bold text-gray-900 mb-3 ">Goes great with</h2>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="group shrink-0"
          >
            {/* Card */}
            <div className="min-w-40 sm:min-w-45 md:min-w-62.5">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, 200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                {product.name}
              </h3>

              <p className="text-sm font-bold text-gray-900">
                ₦{product.price.toLocaleString()}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
