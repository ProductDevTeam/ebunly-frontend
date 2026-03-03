"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { useNotification } from "@/components/common/notification-provider";

export default function AddToCartSection({
  product,
  selectedOptions,
  personalization,
  deliveryDate,
  onOptionChange,
}) {
  const { addItem, increment, decrement, getCartItem } = useCartStore();
  const { notify } = useNotification();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!product) return null;

  const variants = Object.fromEntries(
    Object.entries(selectedOptions ?? {}).filter(([k]) => k !== "quantity"),
  );

  // Before mount, always null to match server render (no localStorage on server)
  const cartItem =
    mounted && product?._id ? getCartItem(product._id, variants) : null;
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    const qty = selectedOptions?.quantity ?? product.minQuantity ?? 1;
    addItem(product, qty, variants, personalization);
    notify({ type: "cart", product, quantity: qty, duration: 4000 });
  };

  const handleIncrement = () => {
    if (!cartItem) return;
    increment(cartItem.cartItemId);
    const newQty = quantity + 1;
    onOptionChange?.("quantity", newQty);
    notify({ type: "cart", product, quantity: newQty, duration: 2500 });
  };

  const handleDecrement = () => {
    if (!cartItem) return;
    decrement(cartItem.cartItemId);
    const newQty = Math.max(product.minQuantity ?? 1, quantity - 1);
    onOptionChange?.("quantity", newQty);
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 lg:hidden">
      <div className="flex justify-between px-4 py-2.5 items-center">
        {/* Price */}
        <div className="flex flex-col justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-medium text-gray-900">
              ₦
              {(
                product.basePrice *
                Math.max(
                  cartItem ? quantity : (selectedOptions?.quantity ?? 1),
                  1,
                )
              ).toLocaleString()}
            </span>
            {product.compareAtPrice > product.basePrice && !cartItem && (
              <span className="text-sm text-gray-400 line-through">
                ₦{product.compareAtPrice.toLocaleString()}
              </span>
            )}
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

        {/* Button / Stepper */}
        <AnimatePresence mode="wait">
          {!cartItem ? (
            <motion.button
              key="add"
              onClick={handleAdd}
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-lg shadow-orange-600/20"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.button>
          ) : (
            <motion.div
              key="stepper"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="flex items-center bg-orange-600 rounded-xl overflow-hidden shadow-lg shadow-orange-600/20"
            >
              <button
                onClick={handleDecrement}
                className="px-3 py-2.5 text-white hover:bg-orange-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2.5 text-white font-bold text-sm min-w-[40px] text-center">
                {quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={quantity >= (product.maxQuantity ?? 1000)}
                className="px-3 py-2.5 text-white hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div style={{ height: "env(safe-area-inset-bottom)" }} />
    </div>
  );
}
