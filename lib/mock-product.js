// Temporary mock fallbacks for product fields the backend doesn't return yet.
// Real values ALWAYS take precedence — these only fill in fields that are
// missing or returned empty, so the product detail page renders completely.
// Remove (or trim) entries here as the API starts returning the real data.

const MOCK_VARIANTS = [
  { name: "Length", options: ["Select One", "Small", "Medium", "Large"] },
  { name: "Color", options: ["Black", "White", "Pink"] },
];

const MOCK_PERSONALIZATION_OPTIONS = ["Name", "Message", "Font Style"];

const MOCK_RELATED_PRODUCTS = [
  { id: "mock-1", image: "/product.png", name: "Chumby's Jollof Rice", price: 2500 },
  {
    id: "mock-2",
    image: "/product2.png",
    name: "Mini Scented Candle Set",
    price: 75000,
  },
  { id: "mock-3", image: "/product.png", name: "Floral Dream Trio", price: 53000 },
  { id: "mock-4", image: "/product2.png", name: "Dala Ife", price: 30000 },
  { id: "mock-5", image: "/product.png", name: "Sugar Wax Kit", price: 17000 },
];

export function applyMockProductFallbacks(product) {
  if (!product) return product;

  const hasVariants = product.variants?.length > 0;
  const hasPersonalization = product.personalizationOptions?.length > 0;
  const hasRelated = product.relatedProducts?.length > 0;

  return {
    ...product,

    // Badge — backend doesn't return a discount yet
    discountPercentage: product.discountPercentage ?? 50,

    // Strikethrough "was" price (mobile bar) — derive from base price if absent
    compareAtPrice:
      product.compareAtPrice ??
      (product.basePrice ? product.basePrice * 2 : undefined),

    // Delivery estimate — not returned yet
    estimatedDeliveryDays: product.estimatedDeliveryDays ?? "5-7",

    // Editable variants (Length / Color dropdowns) — usually returned empty
    variants: hasVariants ? product.variants : MOCK_VARIANTS,

    // Personalization — usually disabled / empty
    isPersonalizable: hasPersonalization ? product.isPersonalizable : true,
    personalizationOptions: hasPersonalization
      ? product.personalizationOptions
      : MOCK_PERSONALIZATION_OPTIONS,

    // "Goes great with" — usually returned empty
    relatedProducts: hasRelated
      ? product.relatedProducts
      : MOCK_RELATED_PRODUCTS,
  };
}
