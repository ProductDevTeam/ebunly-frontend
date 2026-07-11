"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./product-card";

const LIMIT = 8;
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3)
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

function normalizeProduct(p) {
  let image = "/product.png";
  if (Array.isArray(p.images) && p.images[0]) {
    image =
      typeof p.images[0] === "string"
        ? p.images[0]
        : (p.images[0].url ?? "/product.png");
  } else if (p.image) {
    image =
      typeof p.image === "string" ? p.image : (p.image.url ?? "/product.png");
  }
  return {
    id: p._id ?? p.id ?? "",
    name: p.name ?? "",
    slug: p.slug ?? "",
    price: p.basePrice ?? p.price ?? 0,
    image,
  };
}

function parseResponse(json) {
  const raw = json.data ?? json;
  const items = Array.isArray(raw)
    ? raw
    : Array.isArray(raw.products)
      ? raw.products
      : Array.isArray(raw.items)
        ? raw.items
        : [];
  const meta = raw.pagination ?? raw.meta ?? {};
  const total = meta.total ?? meta.totalItems ?? items.length;
  const totalPages =
    meta.totalPages ?? meta.pages ?? (Math.ceil(total / LIMIT) || 1);
  return { products: items.map(normalizeProduct), totalPages };
}

export default function ProductsClient({
  initialProducts,
  initialTotalPages,
  typeName,
  coreCategory,
  occasionTags,
  subFilters,
}) {
  const [filters, setFilters] = useState({
    activeFilter: "all",
    priceSort: false,
    discounts: false,
    madeInNaija: false,
    page: 1,
  });

  const [fetchedProducts, setFetchedProducts] = useState(null);
  const [fetchedTotalPages, setFetchedTotalPages] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    activeFilter,
    priceSort,
    discounts,
    madeInNaija,
    page: currentPage,
  } = filters;
  const isDefault =
    activeFilter === "all" &&
    !priceSort &&
    !discounts &&
    !madeInNaija &&
    currentPage === 1;

  // Fall back to server-provided data when no filters are active
  const products =
    isDefault || fetchedProducts === null ? initialProducts : fetchedProducts;
  const totalPages =
    isDefault || fetchedTotalPages === null
      ? initialTotalPages
      : fetchedTotalPages;

  useEffect(() => {
    if (isDefault) return;

    const ctrl = new AbortController();

    const params = new URLSearchParams({
      page: String(currentPage),
      limit: String(LIMIT),
    });
    if (occasionTags?.length) {
      params.set("occasionTags", occasionTags.join(","));
    } else if (coreCategory && activeFilter === "all") {
      params.set("coreCategory", coreCategory);
    } else {
      params.set("subcategory", activeFilter !== "all" ? activeFilter : typeName);
    }
    if (priceSort) {
      params.set("sortBy", "basePrice");
      params.set("sortOrder", "asc");
    } else if (discounts) {
      params.set("sortBy", "discountPercentage");
      params.set("sortOrder", "desc");
    }
    if (madeInNaija) params.set("madeInNigeria", "true");

    fetch(`${API_URL}?${params.toString().replace(/\+/g, "%20")}`, {
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((json) => {
        const { products: p, totalPages: t } = parseResponse(json);
        setFetchedProducts(p);
        setFetchedTotalPages(t);
        setIsLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setIsLoading(false);
      });

    return () => ctrl.abort();
  }, [
    filters,
    typeName,
    coreCategory,
    occasionTags,
    isDefault,
    activeFilter,
    currentPage,
    priceSort,
    discounts,
    madeInNaija,
  ]);

  // Compute whether the next filter object will require a fetch
  const applyFilters = (next) => {
    const nextIsDefault =
      next.activeFilter === "all" &&
      !next.priceSort &&
      !next.discounts &&
      !next.madeInNaija &&
      next.page === 1;
    setFilters(next);
    setIsLoading(!nextIsDefault);
  };

  const handleFilterChange = (f) =>
    applyFilters({ ...filters, activeFilter: f, page: 1 });

  const handlePriceSort = () =>
    applyFilters({
      ...filters,
      priceSort: !priceSort,
      discounts: priceSort ? discounts : false,
      page: 1,
    });

  const handleDiscounts = () =>
    applyFilters({
      ...filters,
      discounts: !discounts,
      priceSort: discounts ? priceSort : false,
      page: 1,
    });

  const handleMadeInNaija = () =>
    applyFilters({ ...filters, madeInNaija: !madeInNaija, page: 1 });

  const goTo = (page) => {
    applyFilters({ ...filters, page });
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
        <aside className="hidden md:block shrink-0" style={{ width: "200px" }}>
          <div className="bg-white rounded-2xl pl-9 py-4 overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.07)]">
            <p className="text-[14px] font-normal text-[#0C0000] mb-3">
              Categories
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`whitespace-nowrap text-center px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                    activeFilter === "all"
                      ? "bg-[#000000] text-white"
                      : "bg-[#F8F8F8] text-[#0C0000]"
                  }`}
                >
                  All Products
                </button>
              </li>
              {subFilters.map((f) => {
                const label = typeof f === "string" ? f : f.name;
                return (
                  <li key={label}>
                    <button
                      onClick={() => handleFilterChange(label)}
                      className={`whitespace-nowrap text-center px-3 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                        activeFilter === label
                          ? "bg-[#0C0000] text-white"
                          : "bg-[#F5F5F5] text-[#0C0000]"
                      }`}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
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
              {subFilters.map((f) => {
                const label = typeof f === "string" ? f : f.name;
                return (
                  <button
                    key={label}
                    onClick={() => handleFilterChange(label)}
                    className={`flex-none px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                      activeFilter === label ? chipOn : chipOff
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Filter chips row */}
          <div className="flex flex-wrap items-center gap-2 mb-6 md:justify-end">
            <button
              onClick={handlePriceSort}
              className={`${chipBase} ${priceSort ? chipOn : chipOff}`}
            >
              Sort By Price
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDiscounts}
              className={`${chipBase} ${discounts ? chipOn : chipOff}`}
            >
              🏷️ Discounts
            </button>
            <button
              onClick={handleMadeInNaija}
              className={`${chipBase} ${madeInNaija ? chipOn : chipOff}`}
            >
              🇳🇬 Made In Naija
            </button>
          </div>

          {/* Product grid */}
          <div
            className={`transition-opacity duration-200 ${
              isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            {products.length === 0 && !isLoading ? (
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
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* ── Pagination ────────────────────────────────── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-10">
              <button
                onClick={() => goTo(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-text-dark-gray disabled:opacity-30 transition-colors hover:border-[#0C0000] hover:text-[#0C0000]"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

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
