"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./product-card";

const PER_PAGE = 8;

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3)
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export default function ProductsClient({ products, subFilters }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [priceSort, setPriceSort] = useState(false);
  const [discounts, setDiscounts] = useState(false);
  const [madeInNaija, setMadeInNaija] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (f) => {
    setActiveFilter(f);
    setCurrentPage(1);
  };

  // Placeholder — swap with real filter logic when API is ready
  const filtered = products;
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const displayed = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  const goTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const chipBase =
    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors";
  const chipOff = "bg-white text-text-dark-gray border-[#E5E7EB]";
  const chipOn = "bg-[#0C0000] text-white border-[#0C0000]";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
      <div className="flex gap-5 lg:gap-8">
        {/* ── Desktop Sidebar ──────────────────────────────── */}
        <aside className="hidden md:block shrink-0" style={{ width: "195px" }}>
          <div className="bg-white rounded-2xl px-3 py-4 overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.07)]">
            <p className="text-[14px] font-normal text-[#0C0000] mb-3">
              Categories
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`w-[60%] text-center px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                    activeFilter === "all"
                      ? "bg-[#0C0000] text-white"
                      : "bg-[#F5F5F5] text-[#0C0000]"
                  }`}
                >
                  All Products
                </button>
              </li>
              {subFilters.map((f) => (
                <li key={f}>
                  <button
                    onClick={() => handleFilterChange(f)}
                    className={`w-[60%] text-center px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                      activeFilter === f
                        ? "bg-[#0C0000] text-white"
                        : "bg-[#F5F5F5] text-[#0C0000]"
                    }`}
                  >
                    {f}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Mobile sub-filters horizontal scroll */}
          {subFilters.length > 0 && (
            <div className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              <button
                onClick={() => handleFilterChange("all")}
                className={`flex-none px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                  activeFilter === "all" ? chipOn : chipOff
                }`}
              >
                All Products
              </button>
              {subFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange(f)}
                  className={`flex-none px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                    activeFilter === f ? chipOn : chipOff
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {/* Filter chips row */}
          <div className="flex flex-wrap items-center gap-2 mb-6 md:justify-end">
            <button
              onClick={() => setPriceSort(!priceSort)}
              className={`${chipBase} ${priceSort ? chipOn : chipOff}`}
            >
              Sort By Price
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDiscounts(!discounts)}
              className={`${chipBase} ${discounts ? chipOn : chipOff}`}
            >
              🏷️ Discounts
            </button>
            <button
              onClick={() => setMadeInNaija(!madeInNaija)}
              className={`${chipBase} ${madeInNaija ? chipOn : chipOff}`}
            >
              🇳🇬 Made In Naija
            </button>
          </div>

          {/* Product grid */}
          {displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="font-medium text-[#333] text-[16px]">
                No products found
              </p>
              <p className="text-text-gray text-[14px] mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {displayed.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* ── Pagination ────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10">
              {/* Prev */}
              <button
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-text-dark-gray disabled:opacity-30 transition-colors hover:border-[#0C0000] hover:text-[#0C0000]"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {getPageNumbers(currentPage, totalPages).map((p, i) =>
                p === "…" ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="w-9 h-9 flex items-center justify-center text-text-gray text-[13px] select-none"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goTo(p)}
                    className={`w-9 h-9 rounded-full text-[13px] font-medium transition-colors ${
                      currentPage === p
                        ? "bg-[#0C0000] text-white"
                        : "border border-[#E5E7EB] text-text-dark-gray hover:border-[#0C0000] hover:text-[#0C0000]"
                    }`}
                    aria-label={`Page ${p}`}
                    aria-current={currentPage === p ? "page" : undefined}
                  >
                    {p}
                  </button>
                ),
              )}

              {/* Next */}
              <button
                onClick={() => goTo(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-text-dark-gray disabled:opacity-30 transition-colors hover:border-[#0C0000] hover:text-[#0C0000]"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
