"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCart } from "@/hooks/use-cart";
import { countVendors } from "@/hooks/use-deliveries";
import CheckoutModal from "@/components/cart/checkout-modal";
import { useState } from "react";

/*
 * Cart, from "Desktop - Cart.png" and "Mobile - Cart.png".
 *
 * The 1200 container splits 660 / 200 / 340: items column, gutter, summary
 * card. Below 768px the summary drops under the items at full width and loses
 * the estimated-delivery line, which only the desktop frame draws.
 */
const INK = "#24201C";
const MUTED = "#6E6659";
const HAIRLINE = "#F2EDE8";
const BRAND = "#D85A30";
const REMOVE_RED = "#D90101";
const BULLET = "#D9D9D9";

/** The grey-dot lines under an item: personalization, then add-ons, then variants. */
function itemDetails(item) {
  const out = [];

  const p = item.personalization;
  if (p?.text) {
    out.push(`${p.type ?? "Personalization"}: "${p.text}"`);
  }

  for (const addOn of item.addOns ?? []) {
    const name = addOn?.name ?? addOn;
    if (!name) continue;
    out.push(addOn?.message ? `${name}: "${addOn.message}"` : String(name));
  }

  for (const [key, value] of Object.entries(item.variants ?? {})) {
    if (value) out.push(`${key}: ${value}`);
  }

  return out;
}

function QuantitySelect({ value, max, onChange }) {
  const cap = Math.min(max ?? 10, 10);
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label="Quantity"
      className="h-11.5 w-20 rounded-lg border bg-transparent px-3 text-[14px] md:h-10.5 md:w-22.5"
      style={{ borderColor: HAIRLINE, color: INK }}
    >
      {Array.from({ length: cap }, (_, i) => i + 1).map((n) => (
        <option key={n} value={n}>
          {n}
        </option>
      ))}
    </select>
  );
}

function CartRow({ item, onSetQuantity, onRemove }) {
  const image = item.images?.[0]?.url ?? item.images?.[0] ?? "/product.png";
  const details = itemDetails(item);

  return (
    <div
      className="flex gap-3 pt-8 pb-4 md:gap-4 md:pt-10 md:pb-5"
      style={{ borderBottom: `1px solid ${HAIRLINE}` }}
    >
      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#FAECE7] md:h-20 md:w-20">
        <Image
          src={image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </span>

      <div className="min-w-0 flex-1">
        {/* Mobile pushes the price to the right edge; desktop sets it beside the name. */}
        <div className="flex items-start justify-between gap-4 md:justify-start md:gap-3">
          <p className="text-[15px] leading-5" style={{ color: INK }}>
            {item.name}
          </p>
          <p
            className="shrink-0 text-[15px] leading-5 whitespace-nowrap"
            style={{ color: INK }}
          >
            ₦{(item.basePrice * item.quantity).toLocaleString()}
          </p>
        </div>

        {details.length > 0 && (
          <ul className="mt-2 space-y-1">
            {details.map((detail) => (
              <li key={detail} className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: BULLET }}
                />
                <span className="text-[13px] leading-4.5" style={{ color: MUTED }}>
                  {detail}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-2.5 flex items-center justify-between gap-4 md:mt-4 md:justify-start md:gap-28">
          <QuantitySelect
            value={item.quantity}
            max={item.maxQuantity}
            onChange={(q) => onSetQuantity(item.cartItemId, q)}
          />
          <button
            type="button"
            onClick={() => onRemove(item.cartItemId)}
            className="text-[13px] font-medium"
            style={{ color: REMOVE_RED }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, muted }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[14px] leading-5" style={{ color: INK }}>
        {label}
      </span>
      <span
        className="text-[14px] leading-5"
        style={{ color: muted ? MUTED : INK }}
      >
        {value}
      </span>
    </div>
  );
}

function OrderSummary({ subtotal, estimatedDelivery, onCheckout }) {
  return (
    <div className="rounded-xl bg-white p-5">
      <p className="text-[16px] leading-6 font-medium" style={{ color: INK }}>
        Order summary
      </p>

      <div className="mt-2 space-y-2">
        <SummaryRow label="Subtotal" value={`₦${subtotal.toLocaleString()}`} />
        <SummaryRow label="Delivery" value="Calculated at checkout" muted />
      </div>

      <div
        className="mt-3 flex items-baseline justify-between gap-4 pt-3"
        style={{ borderTop: `1px solid ${HAIRLINE}` }}
      >
        <span className="text-[14px] leading-5 font-medium" style={{ color: INK }}>
          Total
        </span>
        <span className="text-[14px] leading-5 font-medium" style={{ color: INK }}>
          ₦{subtotal.toLocaleString()}
        </span>
      </div>

      {/* Only the desktop frame carries the lead-time line. */}
      {estimatedDelivery && (
        <p
          className="mt-3 hidden text-[11px] leading-4 md:block"
          style={{ color: MUTED }}
        >
          Est. delivery {estimatedDelivery}, based on the longest item lead time
        </p>
      )}

      <button
        type="button"
        onClick={onCheckout}
        className="mt-5 h-12 w-full rounded-lg text-[15px] text-white md:mt-4 md:h-11.5"
        style={{ backgroundColor: BRAND }}
      >
        Go to checkout
      </button>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FAECE7]">
        <ShoppingBag className="h-7 w-7" style={{ color: BRAND }} />
      </span>
      <p className="text-[15px] font-medium" style={{ color: INK }}>
        Your cart is empty
      </p>
      <p className="mt-1 text-[13px]" style={{ color: MUTED }}>
        Add items to your cart to get started
      </p>
      <Link
        href="/"
        className="mt-6 h-11.5 rounded-lg px-6 text-[14px] leading-11.5 text-white"
        style={{ backgroundColor: BRAND }}
      >
        Start Shopping
      </Link>
    </div>
  );
}

/** Longest lead time across the cart, formatted the way the summary reads. */
function estimatedDeliveryLabel(items) {
  const days = items.reduce(
    (max, item) => Math.max(max, item.estimatedDeliveryDays ?? 0),
    0,
  );
  if (!days) return null;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

/** `mockItems` is for the UI harness at /test/ui/cart — unused in the app. */
export default function CartClient({ mockItems = null }) {
  const router = useRouter();
  const cart = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { setQuantity, removeItem, isLoggedIn } = cart;
  const items = mockItems ?? cart.items;
  const total = mockItems
    ? mockItems.reduce((sum, i) => sum + i.basePrice * i.quantity, 0)
    : cart.subtotal();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/cart");
      return;
    }
    setCheckoutOpen(true);
  };

  return (
    <main className="max-w-308 mx-auto px-4 pt-6 pb-16">
      <h1
        className="text-[19px] leading-7 font-medium md:text-[22px]"
        style={{ color: INK }}
      >
        Your cart
      </h1>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="md:flex md:items-start md:gap-50">
          <div className="md:w-165 md:shrink-0">
            {items.map((item) => (
              <CartRow
                key={item.cartItemId}
                item={item}
                onSetQuantity={setQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div className="mt-10 md:mt-0 md:w-85 md:shrink-0">
            <OrderSummary
              subtotal={total}
              estimatedDelivery={estimatedDeliveryLabel(items)}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      )}

      <CheckoutModal
        open={checkoutOpen}
        subtotal={total}
        vendorCount={countVendors(items)}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => {
          setCheckoutOpen(false);
          // Paystack may take over the tab from here; if it does not, the
          // customer lands on their orders with the new one at the top.
          router.push("/profile/orders");
        }}
      />
    </main>
  );
}
