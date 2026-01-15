"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductGrid() {
  // Sample product data - replace with actual data
  const products = Array(12)
    .fill(null)
    .map((_, index) => ({
      id: `${index + 1}`, // Unique ID for each product
      name: index === 1 ? "Personalized Towels" : "Black Embroidered Shirt",
      price: 2500,
      image: "/product.png",
      badge: index % 3 === 0 ? "Best Seller" : null,
      discount: index % 4 === 0 ? "50% off" : null,
    }));

  // Use different image for the second product (towels)
  const updatedProducts = products.map((product, index) => {
    if (index === 1) {
      return {
        ...product,
        image: "/product.png",
      };
    }
    return product;
  });

  return (
    <div className="p-4 lg:p-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {updatedProducts.map((product, index) => (
          <ProductCard key={index} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, index }) {
  return (
    <Link href={`/discover/${product.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="group cursor-pointer font-sans"
      >
        {/* Product Image Container */}
        <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-square mb-3">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={index < 4}
          />

          {/* Hover Overlay */}
          {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 z-[1]" /> */}

          {/* Favorite Button */}
          {/* <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50 z-[2]">
          <Heart className="w-4 h-4 text-gray-600" />
        </button> */}

          {/* Quick Add Button */}
          {/* <button className="absolute bottom-3 left-3 right-3 bg-white text-gray-900 py-2 px-4 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-50 shadow-md z-[2]">
          Quick Add
        </button> */}
        </div>

        {/* Product Info */}
        <div className="space-y-1 font-sans">
          <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-lg font-medium text-gray-900">{product.price}</p>
        </div>
      </motion.div>
    </Link>
  );
}
