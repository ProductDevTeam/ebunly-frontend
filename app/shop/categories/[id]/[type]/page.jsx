import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import ScrollReveal from "@/components/common/scroll-reveal";
import { getCategoryBySlug, getTypeInfo } from "@/lib/api/categories";
import ProductsFetcher from "./_components/products-fetcher";
import ProductsSkeleton from "./_components/products-skeleton";

function formatSlug(slug) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }) {
  const { id, type } = await params;
  const [category, typeInfo] = await Promise.all([
    getCategoryBySlug(id),
    getTypeInfo(id, type),
  ]);
  const label = typeInfo?.name ?? formatSlug(type);
  const catLabel = category?.label ?? formatSlug(id);
  const description =
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

  const [category, typeInfo] = await Promise.all([
    getCategoryBySlug(id),
    getTypeInfo(id, type),
  ]);

  const categoryLabel = category?.label ?? formatSlug(id);
  const typeLabel = typeInfo?.name ?? formatSlug(type);
  const description =
    typeInfo?.pageDescription ??
    typeInfo?.desc ??
    "Discover carefully curated products for every style and budget.";

  return (
    <div className="min-h-screen font-sans bg-white">
      <ScrollReveal />

      {/* ── Gradient hero area ───────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(180deg, #EEE5F3 0%, #FFFFFF 100%)",
        }}
      >
        <NavbarServer />

        <div className="relative max-w-7xl mx-auto">
          {/* Decorative star left */}
          <div className="hidden md:block absolute left-[8%] top-[30%] z-10 pointer-events-none">
            <Image src="/star.svg" width={28} height={28} alt="" />
          </div>

          {/* Breadcrumb */}
          <nav
            className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 pt-6 px-4 md:px-6 font-sans font-normal text-[12px] md:text-[12px] text-[#0C0000]"
            style={{ lineHeight: "140%", letterSpacing: "-0.01em" }}
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
          <div className="text-center pt-4 pb-8 md:pb-12 px-4 md:px-6">
            <h1
              className="font-semibold font-sans text-[#0C0000] text-[22px] md:text-[32px]"
              style={{ lineHeight: "96%", letterSpacing: "-0.05em" }}
            >
              {typeLabel}
            </h1>
            <p
              className="font-sans font-normal text-[#0C0000] text-[14px] md:text-[16px] mt-4 max-w-110 mx-auto"
              style={{ lineHeight: "140%", letterSpacing: "-0.01em" }}
            >
              {description}
            </p>
          </div>

          {/* Decorative star right */}
          <div className="hidden md:block absolute right-[15%] top-[55%] z-10 pointer-events-none">
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
