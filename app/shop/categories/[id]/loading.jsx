import Navbar from "@/components/common/navbar";
import CategoryGridSkeleton from "./_components/category-grid-skeleton";

export default function CategoryLoading() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <div
        style={{
          background: "linear-gradient(180deg, #EEE5F3 0%, #FFFFFF 100%)",
        }}
      >
        <Navbar />

        <div className="max-w-7xl mx-auto mt-5">
          <div className="text-center pt-8 pb-6 md:pt-14 md:pb-10 px-4 md:px-6">
            <div className="skeleton h-8 md:h-[43px] w-52 md:w-80 mx-auto rounded-full mb-3" />
            <div className="skeleton h-3.5 w-64 mx-auto rounded-full mb-2 mt-2" />
            <div className="skeleton h-3.5 w-48 mx-auto rounded-full" />
          </div>
        </div>
      </div>

      <main>
        <CategoryGridSkeleton />
      </main>
    </div>
  );
}
