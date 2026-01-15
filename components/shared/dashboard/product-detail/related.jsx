"use client";

import Image from "next/image";
import Link from "next/link";

export default function RelatedProducts({ products }) {
  return (
    <div className="px-4 py-1">
      <h2 className="text-lg font-bold text-gray-900 mb-3">Goes great with</h2>
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="shrink-0 group"
          >
            <div className="w-32">
              <div className="relative aspect-square rounded-lg overflow-hidden mb-2 bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="128px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
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
