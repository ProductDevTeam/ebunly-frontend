import Navbar from "@/components/common/navbar";
import Footer from "@/components/common/footer";
import ScrollReveal from "@/components/common/scroll-reveal";
import HeroSection from "@/components/shared/home/hero";
import GiftBasketsSection from "@/components/shared/home/gift-basket";
import PerfectForYouSection from "@/components/shared/home/carousal";
import WhoGiftingSection from "@/components/shared/home/who-gifting";
import GroupGiftingSection from "@/components/shared/home/group-gifting";
import BudgetSection from "@/components/shared/home/budget";
import NewsletterSection from "@/components/shared/home/newsletter";

const perfectForYouProducts = [
  {
    id: 1,
    name: "Chumby's Jollof Rice",
    price: 2500,
    image: "/product.png",
    slug: "chumbys-jollof-rice",
  },
  {
    id: 2,
    name: "Mini Scented Candle Set",
    price: 75000,
    image: "/product2.png",
    slug: "mini-scented-candle",
  },
  {
    id: 3,
    name: "Floral Dream Trio",
    price: 53000,
    image: "/product.png",
    slug: "floral-dream-trio",
  },
  {
    id: 4,
    name: "Dala Ife",
    price: 30000,
    image: "/product2.png",
    slug: "dala-ife",
  },
  {
    id: 5,
    name: "Sugar Wax Kit",
    price: 17000,
    image: "/product.png",
    slug: "sugar-wax-kit",
  },
  {
    id: 6,
    name: "Luxury Bath Set",
    price: 22000,
    image: "/product2.png",
    slug: "luxury-bath-set",
  },
  {
    id: 7,
    name: "Artisan Gift Box",
    price: 45000,
    image: "/product.png",
    slug: "artisan-gift-box",
  },
  {
    id: 8,
    name: "Silk Scarf Bundle",
    price: 38000,
    image: "/product2.png",
    slug: "silk-scarf-bundle",
  },
  {
    id: 9,
    name: "Gourmet Hamper",
    price: 60000,
    image: "/product.png",
    slug: "gourmet-hamper",
  },
  {
    id: 10,
    name: "Wellness Gift Kit",
    price: 28000,
    image: "/product2.png",
    slug: "wellness-gift-kit",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen font-sans">
      <ScrollReveal />
      <Navbar />
      <main className="bg-white">
        <HeroSection />
        <GiftBasketsSection />
        <PerfectForYouSection products={perfectForYouProducts} />
        <WhoGiftingSection />
        <GroupGiftingSection />
        <BudgetSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
