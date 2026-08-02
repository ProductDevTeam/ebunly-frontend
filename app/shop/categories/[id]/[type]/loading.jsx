import Navbar from "@/components/common/navbar";
import ProductsSkeleton from "./_components/products-skeleton";

export default function TypeLoading() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <div className="bg-[#FDFBF9] md:bg-[linear-gradient(180deg,var(--category-hero-from,#EEE5F3)_0%,#FDFBF9_100%)]">
        <Navbar showMobileSearch={false} />

        <div className="w-full max-w-[1200px] mx-auto px-4 xl:px-0">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-1.5 pt-6 md:justify-center">
            <div className="skeleton h-3 w-8 rounded-full" />
            <div className="skeleton h-3 w-2 rounded-full" />
            <div className="skeleton h-3 w-24 rounded-full" />
            <div className="skeleton h-3 w-2 rounded-full" />
            <div className="skeleton h-3 w-20 rounded-full" />
          </div>

          {/* Title + description skeleton */}
          <div className="pt-3 pb-7 md:pt-4 md:pb-10">
            <div className="skeleton h-7 md:h-[38px] w-44 md:w-64 rounded-full md:mx-auto" />
            <div className="skeleton h-3.5 w-72 rounded-full mt-3 md:mx-auto" />
            <div className="skeleton h-3.5 w-56 rounded-full mt-2 md:mx-auto" />
          </div>
        </div>
      </div>

      <main>
        <ProductsSkeleton />
      </main>
    </div>
  );
}
