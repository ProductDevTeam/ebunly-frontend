import { Suspense } from "react";
import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import GroupGiftingSection from "@/components/shared/home/group-gifting";
import ScrollReveal from "@/components/common/scroll-reveal";
import CategoryGrid from "./_components/category-grid";
import CategoryGridSkeleton from "./_components/category-grid-skeleton";
import ProductsSkeleton from "@/app/shop/categories/[id]/[type]/_components/products-skeleton";
import { getCategoryBySlug, getSubcategoriesBySlug } from "@/lib/api/categories";
import CategoryProductsFetcher from "./_components/category-products-fetcher";
import { HERO_GRADIENT } from "./_components/hero-gradient";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const category = await getCategoryBySlug(id);

  const label =
    category?.label ??
    decodeURIComponent(id).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const description =
    category?.pageDescription ??
    category?.description ??
    "Browse curated gifts and accessories on Ebunly.";

  return {
    title: `${label} | Ebunly`,
    description,
    openGraph: {
      title: `${label} | Ebunly`,
      description,
      url: `https://ebunly.com/shop/categories/${id}`,
      siteName: "Ebunly",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} | Ebunly`,
      description,
    },
    alternates: {
      canonical: `https://ebunly.com/shop/categories/${id}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { id } = await params;

  // Fetch category metadata (cached — instant after first load)
  const category = await getCategoryBySlug(id);

  const label =
    category?.label ??
    (id
      ? decodeURIComponent(id)
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "Fashion & Accessories");

  const description =
    category?.pageDescription ??
    category?.description ??
    "Show up in style with fashionable items and accessories for you and your loved ones";

  const subcategories = await getSubcategoriesBySlug(id);
  const hasSubcategories = subcategories.length > 0;

  return (
    <div className="min-h-screen font-sans bg-white">
      <ScrollReveal />

      {/* ── Gradient hero area ───────────────────────────── */}
      <div style={{ background: HERO_GRADIENT }}>
        <NavbarServer />

        <div className="relative max-w-7xl mx-auto mt-5">
          <div className="hidden md:block absolute left-[8%] top-[32%] z-10 pointer-events-none">
            <Image src="/star.svg" width={30} height={30} alt="" />
          </div>

          <div className="text-center pt-8 pb-6 md:pt-14 md:pb-10 px-4 md:px-6">
            <h1
              className="font-semibold text-[#0C0000] text-[24px] md:text-[36px]"
              style={{ lineHeight: "96%", letterSpacing: "-5%" }}
            >
              {label}
            </h1>
            <p
              className="text-black -tracking-[1%] text-[13px] md:text-[16px] mt-2 max-w-[440px] mx-auto"
              style={{ lineHeight: "140%" }}
            >
              {description}
            </p>
          </div>

          <div className="hidden md:block absolute right-[15%] top-[50%] z-10 pointer-events-none">
            <Image
              src="/star.svg"
              width={50}
              height={50}
              alt=""
              className="blur-xs"
            />
          </div>
        </div>
      </div>

      {/* ── Type grid ───────────────────────────────────── */}
      <main>
        {hasSubcategories ? (
          <Suspense fallback={<CategoryGridSkeleton />}>
            <CategoryGrid categorySlug={id} />
          </Suspense>
        ) : (
          <Suspense fallback={<ProductsSkeleton />}>
            <CategoryProductsFetcher
              categoryName={label}
              occasionTags={category?.linkedOccasionTags ?? []}
            />
          </Suspense>
        )}
      </main>

      <GroupGiftingSection />
      <Footer />
    </div>
  );
}
