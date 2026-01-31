import Footer from "@/components/common/footer";
import ProductCarouselSection from "@/components/shared/home/carousal";
import EventShoppingCTA from "@/components/shared/home/cta";
import GiftBasketsSection from "@/components/shared/home/gift-basket";
import HeroSection from "@/components/shared/home/hero";

// Example products data - replace with your actual data/API calls
const weddingProducts = [
  {
    id: 1,
    name: "Black Embroidered Shirt",
    price: 2500,
    image: "/product.png",
    slug: "black-embroidered-shirt",
  },
  {
    id: 2,
    name: "Personalized Towel Set",
    price: 2500,
    image: "/product.png",
    slug: "personalized-towel-set",
  },
  {
    id: 3,
    name: "Wedding Gift Box",
    price: 3500,
    image: "/product.png",
    slug: "wedding-gift-box",
  },
  {
    id: 4,
    name: "Luxury Wedding Set",
    price: 4500,
    image: "/product.png",
    slug: "luxury-wedding-set",
  },
];

const babyProducts = [
  {
    id: 1,
    name: "Baby Care Bundle",
    price: 3500,
    image: "/product.png",
    slug: "baby-care-bundle",
  },
  {
    id: 2,
    name: "Newborn Gift Set",
    price: 4000,
    image: "/product.png",
    slug: "newborn-gift-set",
  },
  {
    id: 3,
    name: "Baby Essentials Box",
    price: 5000,
    image: "/product.png",
    slug: "baby-essentials-box",
  },
  {
    id: 4,
    name: "Premium Baby Package",
    price: 6500,
    image: "/product.png",
    slug: "premium-baby-package",
  },
];

const forHerProducts = [
  {
    id: 1,
    name: "Elegant Jewelry Set",
    price: 5500,
    image: "/product.png",
    slug: "elegant-jewelry-set",
  },
  {
    id: 2,
    name: "Luxury Spa Package",
    price: 4500,
    image: "/product.png",
    slug: "luxury-spa-package",
  },
  {
    id: 3,
    name: "Designer Handbag",
    price: 8500,
    image: "/product.png",
    slug: "designer-handbag",
  },
  {
    id: 4,
    name: "Pearl Necklace Set",
    price: 6000,
    image: "/product.png",
    slug: "pearl-necklace-set",
  },
];

export default function HomePage() {
  return (
    <div className="">
      <HeroSection />
      <GiftBasketsSection />

      {/* Perfect for Weddings */}
      <ProductCarouselSection
        title="Perfect for Weddings"
        emoji="💍"
        products={weddingProducts}
        seeMoreLink="/categories/weddings"
      />

      {/* Baby Fever */}
      <ProductCarouselSection
        title="Baby Fever"
        emoji="🍼"
        products={babyProducts}
        seeMoreLink="/categories/baby"
      />
      <EventShoppingCTA />

      {/* For Her */}
      <ProductCarouselSection
        title="For Her"
        emoji="💍"
        products={forHerProducts}
        seeMoreLink="/categories/for-her"
      />
      <Footer />
    </div>
  );
}
