import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import ScrollReveal from "@/components/common/scroll-reveal";
import { getCategoryBySlug, getTypeInfo } from "@/lib/api/categories";
import { getTypePageDescription } from "@/lib/api/products";
import ProductsFetcher from "./_components/products-fetcher";
import ProductsSkeleton from "./_components/products-skeleton";

function formatSlug(slug) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }) {
  const { id, type } = await params;
  const typeNameGuess = formatSlug(type);
  const [category, typeInfo, pageDesc] = await Promise.all([
    getCategoryBySlug(id),
    getTypeInfo(id, type),
    getTypePageDescription(typeNameGuess),
  ]);
  const label = typeInfo?.name ?? typeNameGuess;
  const catLabel = category?.label ?? formatSlug(id);
  const description =
    pageDesc ??
    typeInfo?.desc ??
    `Shop ${label} on Ebunly — curated products for every occasion.`;
  return {
    title: `${label} | ${catLabel} | Ebunly`,
    description,
    openGraph: {
      title: `${label} | ${catLabel} | Ebunly`,
      description,
      url: `https://ebunly.com/shop/categories/${id}/${type}`,
      siteName: "Ebunly",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} | ${catLabel} | Ebunly`,
      description,
    },
    alternates: {
      canonical: `https://ebunly.com/shop/categories/${id}/${type}`,
    },
  };
}

export default async function TypePage({ params }) {
  const { id, type } = await params;

  const typeNameGuess = formatSlug(type);
  const [category, typeInfo, pageDesc] = await Promise.all([
    getCategoryBySlug(id),
    getTypeInfo(id, type),
    getTypePageDescription(typeNameGuess),
  ]);

  const categoryLabel = category?.label ?? formatSlug(id);
  const typeLabel = typeInfo?.name ?? typeNameGuess;
  const description =
    pageDesc ??
    typeInfo?.desc ??
    "Discover carefully curated products for every style and budget.";

  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <ScrollReveal />

      {/* Hero: the desktop export carries the gradient, the mobile one is flat
          #FDFBF9 — so it is applied from md up only. The top colour comes from
          --category-hero-from, which the [id] layout picks once per request and
          this route inherits, so a category and its type pages agree. It fades
          to this page's own surface, not the [id] page's white. */}
      <div className="bg-[#FDFBF9] md:bg-[linear-gradient(180deg,var(--category-hero-from,#EEE5F3)_0%,#FDFBF9_100%)]">
        <NavbarServer showMobileSearch={false} />

        <div className="relative w-full max-w-[1200px] mx-auto px-4 xl:px-0">
          {/* Decorative star left */}
          <div className="hidden md:block absolute left-[6%] top-[30%] z-10 pointer-events-none">
            <Image src="/star.svg" width={28} height={28} alt="" />
          </div>

          {/* Breadcrumb */}
          <nav
            className="flex flex-wrap items-center gap-x-1.5 gap-y-1 pt-6 text-[12px] md:justify-center"
            style={{
              lineHeight: "140%",
              letterSpacing: "-0.01em",
              color: "#6E6659",
            }}
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <span>&gt;</span>
            <Link
              href={`/shop/categories/${id}`}
              className="transition-colors hover:text-primary"
            >
              {categoryLabel}
            </Link>
            <span>&gt;</span>
            <span>{typeLabel}</span>
          </nav>

          {/* Title + description */}
          <div className="pt-3 pb-7 md:pt-4 md:pb-10 md:text-center">
            <h1
              className="font-semibold font-sans text-[#24201C] text-[24px] md:text-[32px]"
              style={{ lineHeight: "110%", letterSpacing: "-0.03em" }}
            >
              {typeLabel}
            </h1>
            <p
              className="mt-2 md:mt-3 text-[15px] md:text-[16px] md:max-w-[440px] md:mx-auto"
              style={{
                lineHeight: "140%",
                letterSpacing: "-0.01em",
                color: "#6E6659",
              }}
            >
              {description}
            </p>
          </div>

          {/* Decorative star right */}
          <div className="hidden md:block absolute right-[12%] top-[55%] z-10 pointer-events-none">
            <Image
              src="/star.svg"
              width={48}
              height={48}
              alt=""
              className="blur-xs"
            />
          </div>
        </div>
      </div>

      {/* ── Products section ────────────────────────────── */}
      <main>
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsFetcher typeName={typeLabel} />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
