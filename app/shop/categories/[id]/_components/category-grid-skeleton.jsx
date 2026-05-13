export default function CategoryGridSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
      {/* Row 1 — 4 cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton rounded-[20px] h-50 md:h-86.5" />
        ))}
      </div>

      {/* Row 2 — 3 cards, same width as row 1, centered */}
      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-[calc(50%-4px)] md:w-[calc(25%-6px)] shrink-0">
            <div className="skeleton rounded-[20px] h-50 md:h-86.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
