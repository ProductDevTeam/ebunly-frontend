import { Suspense } from "react";

import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import ScrollReveal from "@/components/common/scroll-reveal";
import HeroSection from "@/components/shared/home/hero";
import GiftBasketsSection from "@/components/shared/home/gift-basket";
import LovedRightNowSection from "@/components/shared/home/loved-right-now";
import LovedRightNowFetcher from "@/components/shared/home/loved-right-now-fetcher";
import WhoGiftingSection from "@/components/shared/home/who-gifting";
import GroupGiftingSection from "@/components/shared/home/group-gifting";
import BudgetSection from "@/components/shared/home/budget";
import NewsletterSection from "@/components/shared/home/newsletter";

export default async function HomePage() {
  return (
    <div className="min-h-screen font-sans">
      <ScrollReveal />
      <NavbarServer />
      <main className="bg-white">
        <HeroSection />
        <GiftBasketsSection />
        {/* Top 5 by purchase count, from GET /products/loved. The fallback is
            the same band with no products, which is its skeleton state. */}
        <Suspense fallback={<LovedRightNowSection products={[]} />}>
          <LovedRightNowFetcher />
        </Suspense>
        <WhoGiftingSection />
        <GroupGiftingSection />
        <BudgetSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}
