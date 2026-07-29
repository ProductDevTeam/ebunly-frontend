"use client";

import { ChevronDown, Gift, Heart, Truck } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useNotification } from "@/components/common/notification-provider";

/*
 * Buy row from the product exports: quantity select + Add to Cart, then the
 * Save to favorites / Add to Wishlist pair, then the delivery estimate.
 * The estimate gains a second date once personalization is confirmed:
 *   "Est. delivery Jul 16, or Jul 18 with personalization"
 */
const BRAND = "#D85A30";
const HAIRLINE = "#EBE5E0";
const INK = "#24201C";
const MUTED = "#6E6659";

export default function AddToCartDesktop({
  product,
  selectedOptions,
  personalization,
  onOptionChange,
  deliveryDate,
  personalizedDeliveryDate,
  onOpenWishlist,
}) {
  const { addItem } = useCart();
  const { toggle: toggleFavorite, has, hydrated } = useWishlist();
  const { notify } = useNotification();

  if (!product) return null;

  const variants = Object.fromEntries(
    Object.entries(selectedOptions ?? {}).filter(([k]) => k !== "quantity"),
  );

  const minQuantity = product.minQuantity ?? 1;
  const maxQuantity = Math.max(product.maxQuantity ?? minQuantity, minQuantity);
  const quantityOptions = Array.from(
    { length: Math.max(1, Math.min(maxQuantity - minQuantity + 1, 10)) },
    (_, i) => i + minQuantity,
  );

  const saved = hydrated && has(product._id ?? product.id);

  const handleAdd = () => {
    const qty = selectedOptions?.quantity ?? minQuantity;
    addItem(product, qty, variants, personalization);
    notify({ type: "cart", product, quantity: qty, duration: 4000 });
  };

  return (
    <div className="w-full">
      {/* Quantity + Add to Cart */}
      <div className="flex items-stretch gap-3">
        <div className="relative shrink-0">
          <select
            value={selectedOptions?.quantity ?? minQuantity}
            onChange={(e) => onOptionChange?.("quantity", Number(e.target.value))}
            aria-label="Quantity"
            className="h-11 w-[74px] appearance-none rounded-lg border bg-transparent pl-4 pr-8 text-[14px] focus:outline-none"
            style={{ borderColor: HAIRLINE, color: INK }}
          >
            {quantityOptions.map((qty) => (
              <option key={qty} value={qty}>
                {qty}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            strokeWidth={1.5}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: INK }}
          />
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="h-11 flex-1 rounded-lg text-[14px] text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: BRAND }}
        >
          Add to Cart
        </button>
      </div>

      {/* Favorites / wishlist */}
      <div className="mt-4 flex items-center gap-6">
        <button
          type="button"
          onClick={() => toggleFavorite(product)}
          className="inline-flex items-center gap-2 text-[13px]"
          style={{ color: INK }}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={saved ? "fill-current" : ""}
            style={{ color: saved ? BRAND : INK }}
          />
          {saved ? "Saved to favorites" : "Save to favorites"}
        </button>

        <button
          type="button"
          onClick={onOpenWishlist}
          className="inline-flex items-center gap-2 text-[13px]"
          style={{ color: INK }}
        >
          <Gift size={16} strokeWidth={1.5} />
          Add to Wishlist
        </button>
      </div>

      {/* Delivery estimate */}
      {deliveryDate && (
        <p
          className="mt-4 inline-flex items-center gap-2 text-[13px]"
          style={{ color: MUTED }}
        >
          <Truck size={16} strokeWidth={1.5} className="shrink-0" />
          <span>
            Est. delivery {deliveryDate}
            {personalizedDeliveryDate
              ? `, or ${personalizedDeliveryDate} with personalization`
              : ""}
          </span>
        </p>
      )}
    </div>
  );
}
