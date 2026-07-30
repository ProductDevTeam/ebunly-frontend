import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import ScrollReveal from "@/components/common/scroll-reveal";
import HeroSection from "@/components/shared/home/hero";
import GiftBasketsSection from "@/components/shared/home/gift-basket";
import LovedRightNowSection from "@/components/shared/home/loved-right-now";
import WhoGiftingSection from "@/components/shared/home/who-gifting";
import GroupGiftingSection from "@/components/shared/home/group-gifting";
import BudgetSection from "@/components/shared/home/budget";
import NewsletterSection from "@/components/shared/home/newsletter";

const lovedRightNowProducts = [
  {
    id: 1,
    name: "Engraved jewellery box",
    price: 30000,
    image: "/product.png",
    images: ["/product.png", "/product2.png", "/product.png"],
    slug: "engraved-jewellery-box",
    personalizable: true,
  },
  {
    id: 2,
    name: "Mini Scented Candle Set",
    price: 75000,
    image: "/product2.png",
    images: ["/product2.png", "/product.png", "/product2.png"],
    slug: "mini-scented-candle",
  },
  {
    id: 3,
    name: "Floral Dream Trio",
    price: 53000,
    image: "/product.png",
    images: ["/product.png", "/product2.png", "/product.png"],
    slug: "floral-dream-trio",
  },
  {
    id: 4,
    name: "Dala Ife",
    price: 30000,
    image: "/product2.png",
    images: ["/product2.png", "/product.png"],
    slug: "dala-ife",
  },
  {
    id: 5,
    name: "Sugar Wax Kit",
    price: 17000,
    image: "/product.png",
    images: ["/product.png", "/product2.png", "/product.png"],
    slug: "sugar-wax-kit",
  },
];

export default async function HomePage() {
  return (
    <div className="min-h-screen font-sans">
      <ScrollReveal />
      <NavbarServer />
      <main className="bg-white">
        <HeroSection />
        <GiftBasketsSection />
        <LovedRightNowSection products={lovedRightNowProducts} />
        <WhoGiftingSection />
        <GroupGiftingSection />
        <BudgetSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
