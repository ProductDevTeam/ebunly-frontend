// Visual test harness for the product detail page.
// Renders the REAL <ProductDetailClient /> (same as /products/[slug]) against a
// fully-populated mock so every conditional section is exercised at once.
// Route: /test/product

import ProductDetailClient from "@/app/products/[slug]/client";
import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";

export const metadata = {
  title: "Product Detail — Render Test",
  robots: { index: false, follow: false },
};

const mockProduct = {
  _id: "test-product-001",
  slug: "test-product",
  name: "Personalized ESPRESSO CUP with Wooden Handle Demitasse Glass Tea",

  // Pricing
  basePrice: 30000,
  compareAtPrice: 60000,
  discountPercentage: 50,

  // Badges
  isBestSeller: true,
  isMadeInNigeria: true,

  // Quantity bounds
  minQuantity: 1,
  maxQuantity: 10,

  // Variants → render as the "Length" / "Color" selects
  variants: [
    { name: "Length", options: ["Select One", "Small", "Medium", "Large"] },
    { name: "Color", options: ["Black", "White", "Pink"] },
  ],

  // Simple scalar options
  color: "Black",
  weight: "300g",
  materials: ["Silver", "Plastic"],

  // Personalization → "+ Add Personalization"
  isPersonalizable: true,
  personalizationOptions: ["Name", "Message", "Font Style"],

  // Key Info table
  keyInfo: [
    { label: "Weight", value: "300g" },
    { label: "Color", value: "Black" },
    { label: "Materials", value: "Silver, Plastic" },
  ],

  // Delivery estimate → "Est. Delivery Date"
  estimatedDeliveryDays: "5-7",

  // Description (>150 chars so "Read More" appears)
  description:
    "Future-proof your skin. This LED mask uses 504 red, red plus infrared and blue LED lights to visibly improve overall skin health in just 12 minutes a day. Clinically tested, dermatologist approved, and rechargeable for effortless daily use anywhere you go.",

  // Gallery
  images: [
    { url: "/product.png", isMain: true },
    { url: "/product2.png" },
    { url: "/product.png" },
    { url: "/product2.png" },
    { url: "/product.png" },
    { url: "/product2.png" },
  ],

  // Related → "Goes great with"
  relatedProducts: [
    { id: "r1", image: "/product.png", name: "Chumby's Jollof Rice", price: 2500 },
    { id: "r2", image: "/product2.png", name: "Mini Scented Candle Set", price: 75000 },
    { id: "r3", image: "/product.png", name: "Floral Dream Trio", price: 53000 },
    { id: "r4", image: "/product2.png", name: "Dala Ife", price: 30000 },
    { id: "r5", image: "/product.png", name: "Sugar Wax Kit", price: 17000 },
  ],
};

const mockBreadcrumb = [
  { label: "Home", href: "/" },
  { label: "Fashion & Accessories", href: "/shop/categories/fashion-accessories" },
  {
    label: "Men Fashion",
    href: "/shop/categories/fashion-accessories/men-fashion",
  },
  { label: mockProduct.name },
];

export default function ProductRenderTestPage() {
  return (
    <div className="min-h-screen font-sans bg-white md:bg-[linear-gradient(180deg,#EEE5F3_0%,#FFFFFF_100%)] md:bg-no-repeat md:bg-[length:100%_420px]">
      <NavbarServer showMobileSearch={false} />
      <ProductDetailClient product={mockProduct} breadcrumb={mockBreadcrumb} />
      <Footer />
    </div>
  );
}
