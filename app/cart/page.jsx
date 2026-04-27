"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Plus,
  Minus,
  ChevronLeft,
  ShoppingBag,
  Truck,
  Tag,
  ChevronRight,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/hooks/use-cart-store";

function CartItem({ item }) {
  const { increment, decrement, removeItem } = useCartStore();
  const imageUrl = item.images?.[0]?.url ?? "/product.png";
  const discountPct =
    item.compareAtPrice > item.basePrice
      ? Math.round(
          ((item.compareAtPrice - item.basePrice) / item.compareAtPrice) * 100,
        )
      : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
    >
      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
        <Image src={imageUrl} alt={item.name} fill className="object-cover" />
        {discountPct > 0 && (
          <span className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            -{discountPct}%
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
            {item.name}
          </h3>
          <button
            onClick={() => removeItem(item.cartItemId)}
            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {item.variants &&
          Object.entries(item.variants)
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <span key={k} className="text-xs text-gray-500 capitalize mr-2">
                {k}: <span className="text-gray-700 font-medium">{v}</span>
              </span>
            ))}

        {item.personalization && (
          <span className="inline-block mt-1 text-[10px] bg-orange-50 text-orange-600 font-medium px-2 py-0.5 rounded-full border border-orange-100">
            Personalized
          </span>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-gray-900">
              ₦{(item.basePrice * item.quantity).toLocaleString()}
            </span>
            {discountPct > 0 && (
              <span className="text-xs text-gray-400 line-through">
                ₦{(item.compareAtPrice * item.quantity).toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => decrement(item.cartItemId)}
              className="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-sm font-semibold text-gray-900 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => increment(item.cartItemId)}
              disabled={item.quantity >= (item.maxQuantity ?? 1000)}
              className="px-2.5 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 disabled:opacity-40 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PromoCode({ onApply, applied, onRemove }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 600));
    if (code.toUpperCase() === "EBUNLY10") {
      onApply({ code: code.toUpperCase(), discount: 10, type: "percent" });
    } else {
      setError("Invalid or expired promo code.");
    }
    setLoading(false);
  };

  if (applied) {
    return (
      <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            {applied.code}
          </span>
          <span className="text-xs text-green-600">
            -{applied.discount}% off
          </span>
        </div>
        <button
          onClick={onRemove}
          className="text-green-500 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Promo code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 bg-gray-50"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 disabled:opacity-40 transition-colors"
        >
          {loading ? "..." : "Apply"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
    </div>
  );
}

function OrderSummary({ subtotal, promoCode, onCheckout }) {
  const discount = promoCode
    ? promoCode.type === "percent"
      ? Math.round(subtotal * (promoCode.discount / 100))
      : promoCode.discount
    : 0;
  const deliveryFee = subtotal >= 50000 ? 0 : 2500;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <h3 className="font-bold text-gray-900">Order Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">
            ₦{subtotal.toLocaleString()}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({promoCode.code})</span>
            <span className="font-medium">-₦{discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> Delivery
          </span>
          <span
            className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-gray-900"}`}
          >
            {deliveryFee === 0 ? "Free" : `₦${deliveryFee.toLocaleString()}`}
          </span>
        </div>
        {deliveryFee > 0 && (
          <p className="text-[11px] text-gray-400">
            Free delivery on orders above ₦50,000
          </p>
        )}
      </div>
      <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
        <span className="font-bold text-gray-900">Total</span>
        <span className="text-xl font-bold text-gray-900">
          ₦{total.toLocaleString()}
        </span>
      </div>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={onCheckout}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2"
      >
        Proceed to Checkout <ChevronRight className="w-4 h-4" />
      </motion.button>
    </div>
  );
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center px-6"
    >
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
        <ShoppingBag className="w-9 h-9 text-orange-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        Your cart is empty
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Add items to your cart to get started
      </p>
      <Link
        href="/"
        className="bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-700 transition-colors"
      >
        Start Shopping
      </Link>
    </motion.div>
  );
}

export default function CartPage() {
  const { items, clearCart, subtotal } = useCartStore();
  const [promoCode, setPromoCode] = useState(null);
  const total = subtotal();

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3 max-w-7xl mx-auto">
          <Link
            href="/"
            className="p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="font-bold text-gray-900 text-base">
            My Cart{" "}
            {items.length > 0 && (
              <span className="text-gray-400 font-normal">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </h1>
        </div>
      </header>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-5 lg:grid lg:grid-cols-[1fr_380px] lg:gap-8 lg:items-start pb-12">
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <CartItem key={item.cartItemId} item={item} />
              ))}
            </AnimatePresence>
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 transition-colors py-1"
            >
              <Trash2 className="w-4 h-4" /> Clear cart
            </button>
          </div>

          <div className="mt-6 lg:mt-0 space-y-3 lg:sticky lg:top-20">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">
                Promo Code
              </h3>
              <PromoCode
                applied={promoCode}
                onApply={setPromoCode}
                onRemove={() => setPromoCode(null)}
              />
            </div>
            <OrderSummary
              subtotal={total}
              promoCode={promoCode}
              onCheckout={() => console.log("checkout")}
            />
            <div className="flex items-start gap-2.5 bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <Truck className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-orange-700 leading-relaxed">
                Estimated delivery in <strong>4–5 business days</strong>. Free
                delivery on orders above <strong>₦50,000</strong>.
              </p>
            </div>
          </div>
        </main>
      )}

      {items.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 lg:hidden px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">
                ₦{total.toLocaleString()}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => console.log("checkout")}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-orange-600/20 transition-colors flex items-center gap-1.5"
            >
              Checkout <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
          <div style={{ height: "env(safe-area-inset-bottom)" }} />
        </div>
      )}
    </div>
  );
}
