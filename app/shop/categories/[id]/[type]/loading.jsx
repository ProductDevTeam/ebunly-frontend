import Navbar from "@/components/common/navbar";
import ProductsSkeleton from "./_components/products-skeleton";

export default function TypeLoading() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <div
        style={{
          background: "linear-gradient(180deg, #EEE5F3 0%, #FFFFFF 100%)",
        }}
      >
        <Navbar />

        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center justify-center gap-1.5 pt-6 px-4 md:px-6">
            <div className="skeleton h-3 w-8 rounded-full" />
            <div className="skeleton h-3 w-2 rounded-full" />
            <div className="skeleton h-3 w-24 rounded-full" />
            <div className="skeleton h-3 w-2 rounded-full" />
            <div className="skeleton h-3 w-20 rounded-full" />
          </div>

          {/* Title + description skeleton */}
          <div className="text-center pt-4 pb-8 md:pb-12 px-4 md:px-6">
            <div className="skeleton h-7 md:h-[38px] w-44 md:w-64 mx-auto rounded-full mb-4" />
            <div className="skeleton h-3.5 w-72 mx-auto rounded-full mb-2" />
            <div className="skeleton h-3.5 w-56 mx-auto rounded-full" />
          </div>
        </div>
      </div>

      <main>
        <ProductsSkeleton />
      </main>
    </div>
  );
}
