export default function ProductsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="flex gap-6">
        {/* Sidebar skeleton */}
        <div className="hidden md:block w-[195px] shrink-0">
          <div className="bg-white rounded-2xl p-4 space-y-2.5">
            <div className="skeleton h-3 w-20 rounded-full" />
            <div className="skeleton h-8 rounded-full" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-7 rounded-full" />
            ))}
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 min-w-0">
          {/* Filter chips skeleton */}
          <div className="flex justify-end gap-2 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-8 w-28 rounded-full" />
            ))}
          </div>

          {/* Grid skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="skeleton rounded-2xl aspect-square mb-2.5" />
                <div className="skeleton h-3.5 w-3/4 rounded-full mb-1.5" />
                <div className="skeleton h-3.5 w-1/2 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
