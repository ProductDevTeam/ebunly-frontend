"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

export default function AddToCartSection({
  price,
  originalPrice,
  deliveryDate,
  onAddToCart,
}) {
  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 lg:hidden">
      <div className="flex justify-between px-4 py-3">
        {/* Price Section */}
        <div className="flex flex-col items-center justify-between mb-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-medium text-gray-900">
              ₦{price.toLocaleString()}
            </span>
            {/* {originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                ₦{originalPrice.toLocaleString()}
              </span>
            )} */}
          </div>

          {deliveryDate && (
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Truck className="w-4 h-4" />
              <span>
                Est. Delivery:{" "}
                <span className="font-semibold">{deliveryDate}</span>
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          onClick={onAddToCart}
          whileTap={{ scale: 0.98 }}
          className=" bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-orange-600/20"
        >
          Add to Cart
        </motion.button>
      </div>

      {/* Safe area padding for mobile devices */}
      <div className="h-safe" />

      <style jsx>{`
        .h-safe {
          height: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
