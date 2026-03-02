"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Truck, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/hooks/use-cart-store";
import { useNotification } from "@/components/common/notification-provider";

export default function AddToCartDesktop({
  product,
  selectedOptions,
  personalization,
  deliveryDate,
}) {
  const { addItem, increment, decrement, getCartItem } = useCartStore();
  const { notify } = useNotification();

  if (!product) return null;

  const variants = Object.fromEntries(
    Object.entries(selectedOptions ?? {}).filter(([k]) => k !== "quantity"),
  );

  const cartItem = product?._id ? getCartItem(product._id, variants) : null;
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = () => {
    addItem(product, product.minQuantity ?? 1, variants, personalization);
    notify({
      type: "cart",
      product,
      quantity: product.minQuantity ?? 1,
      duration: 4000,
    });
  };

  const handleIncrement = () => {
    increment(cartItem.cartItemId);
    notify({
      type: "cart",
      product,
      quantity: quantity + 1,
      duration: 2500,
    });
  };

  return (
    <div className="hidden lg:block w-full">
      <AnimatePresence mode="wait">
        {!cartItem ? (
          <motion.button
            key="add"
            onClick={handleAdd}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="w-full flex items-center justify-center gap-2 bg-primary  text-white  py-3 px-5 rounded-lg transition-colors  shadow-orange-600/20 text-base cursor-pointer hover:bg-orange-600"
          >
            Add To Basket
          </motion.button>
        ) : (
          <motion.div
            key="stepper"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="flex items-center bg-orange-600 rounded-2xl overflow-hidden shadow-lg shadow-orange-600/20 w-full"
          >
            <button
              onClick={() => decrement(cartItem.cartItemId)}
              className="px-5 py-4 text-white hover:bg-orange-700 transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="flex-1 text-center text-white font-bold text-base">
              {quantity} in basket
            </span>
            <button
              onClick={handleIncrement}
              disabled={quantity >= (product.maxQuantity ?? 1000)}
              className="px-5 py-4 text-white hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delivery date */}
      {deliveryDate && (
        <div className="flex items-center justify-center gap-1.5 mt-3 text-sm text-gray-500">
          <Truck className="w-4 h-4" />
          <span>
            Est. Delivery Date:{" "}
            <span className="font-semibold text-gray-700">{deliveryDate}</span>
          </span>
        </div>
      )}
    </div>
  );
}
