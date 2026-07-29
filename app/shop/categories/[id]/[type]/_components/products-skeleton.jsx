export default function ProductsSkeleton() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 xl:px-0 pb-10 md:pb-16">
      {/* Mobile rails */}
      <div className="md:hidden flex gap-2.5 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-28 rounded-full shrink-0" />
        ))}
      </div>
      <div className="md:hidden flex gap-2.5 mt-4 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-32 rounded-full shrink-0" />
        ))}
      </div>

      <div className="flex md:gap-20">
        {/* Sidebar */}
        <div className="hidden md:block w-[200px] shrink-0 pt-1">
          <div className="skeleton h-3 w-24 rounded-full" />
          <div className="mt-7 flex flex-col gap-[13px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-10 w-28 rounded-full" />
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Filter bar */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="skeleton h-10 w-[157px] rounded-full" />
            <div className="skeleton h-10 w-24 rounded-full" />
            <div className="skeleton h-10 w-32 rounded-full" />
            <div className="skeleton h-4 w-40 rounded-full ml-auto" />
          </div>
          <div className="hidden md:block h-px bg-[#EBE5E0] mt-5 mb-4" />

          {/* Grid */}
          <div className="mt-5 md:mt-0 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton rounded-2xl aspect-square" />
                <div className="skeleton h-3.5 w-3/4 rounded-full mt-3.5" />
                <div className="skeleton h-3.5 w-1/2 rounded-full mt-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
