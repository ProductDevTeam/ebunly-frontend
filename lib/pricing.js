/*
 * Single source of truth for turning a product's raw price fields into what
 * should actually be charged and displayed. Every render site — cards, the
 * product page, cart, the add-to-cart toast — goes through this instead of
 * reading basePrice/price/discountPercentage directly.
 *
 * Accepts either of the two shapes already in use across the codebase:
 * lib/api/products.js's normalizeProduct() (`price`) and the raw API
 * passthrough on the product detail page (`basePrice`).
 */
export function getProductPricing(product) {
  const basePrice = Number(product?.basePrice ?? product?.price ?? 0);
  const discountPercentage = Number(product?.discountPercentage ?? 0);
  const hasDiscount = discountPercentage > 0 && discountPercentage < 100;
  const finalPrice = hasDiscount
    ? Math.round(basePrice * (1 - discountPercentage / 100))
    : basePrice;

  return { basePrice, discountPercentage, hasDiscount, finalPrice };
}

export function formatNaira(amount) {
  return `₦${Math.round(Number(amount) || 0).toLocaleString()}`;
}
