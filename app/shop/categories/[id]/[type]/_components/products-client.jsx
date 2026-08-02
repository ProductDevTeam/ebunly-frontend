"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import ProductCard from "@/components/common/product-card";

const LIMIT = 8;
// Through the proxy, not straight at the API host: this runs in the browser,
// and a cross-origin request fails CORS preflight and empties the grid with no
// visible error. Same reason lib/products.js picks its base per environment.
const API_URL = "/proxy/products";

/*
 * Chrome measured from the Figma exports (desktop 2160px = 1440 frame @1.5x):
 *   container 1200px · sidebar rail at x120 · content column x400–1320
 *   every pill/select 40px tall, rounded-full
 *   active  → fill #FAECE7, border #993C1D, text #712B13
 *   idle    → transparent fill, border #EBE5E0, text #24201C
 *   hairline rule + count divider #EBE5E0
 */
const PEACH = "#FAECE7";
const BRAND = "#993C1D";
const BRAND_INK = "#712B13";
const HAIRLINE = "#EBE5E0";
const INK = "#24201C";

const PILL_BASE =
  "flex-none inline-flex items-center justify-center h-10 rounded-full border px-6 text-[15px] whitespace-nowrap transition-colors";

const pillStyle = (active) =>
  active
    ? { backgroundColor: PEACH, borderColor: BRAND, color: BRAND_INK }
    : { backgroundColor: "transparent", borderColor: HAIRLINE, color: INK };

function normalizeProduct(p) {
  const images = Array.isArray(p.images)
    ? p.images
        .map((img) => (typeof img === "string" ? img : img?.url))
        .filter(Boolean)
    : [];
  if (!images.length) {
    const single =
      typeof p.image === "string" ? p.image : (p.image?.url ?? "/product.png");
    images.push(single);
  }
  return {
    id: p._id ?? p.id ?? "",
    name: p.name ?? "",
    slug: p.slug ?? "",
    price: p.basePrice ?? p.price ?? 0,
    image: images[0],
    images,
    personalizable: Boolean(
      p.personalizable ?? p.isPersonalizable ?? p.personalization?.enabled,
    ),
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
  return { products: items.map(normalizeProduct), totalPages, total };
}

export default function ProductsClient({
  initialProducts,
  initialTotalPages,
  initialTotal,
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

  // `loaded` accumulates across "Load more"; null means "use the server data".
  const [loaded, setLoaded] = useState(null);
  const [fetchedTotalPages, setFetchedTotalPages] = useState(null);
  const [fetchedTotal, setFetchedTotal] = useState(null);
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

  const products = isDefault || loaded === null ? initialProducts : loaded;
  const totalPages =
    isDefault || fetchedTotalPages === null
      ? initialTotalPages
      : fetchedTotalPages;
  const total =
    isDefault || fetchedTotal === null
      ? (initialTotal ?? initialProducts.length)
      : fetchedTotal;

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
      params.set(
        "subcategory",
        activeFilter !== "all" ? activeFilter : typeName,
      );
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
        const { products: p, totalPages: t, total: n } = parseResponse(json);
        // Page 1 replaces the list, later pages append (Load more).
        setLoaded((prev) => (currentPage === 1 || prev === null ? p : [...prev, ...p]));
        setFetchedTotalPages(t);
        setFetchedTotal(n);
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

  const handleFilterChange = (f) => {
    setLoaded(null);
    applyFilters({ ...filters, activeFilter: f, page: 1 });
  };

  const handleDiscounts = () => {
    setLoaded(null);
    applyFilters({ ...filters, discounts: !discounts, page: 1 });
  };

  const handleMadeInNaija = () => {
    setLoaded(null);
    applyFilters({ ...filters, madeInNaija: !madeInNaija, page: 1 });
  };

  const handleSort = (e) => {
    setLoaded(null);
    applyFilters({ ...filters, priceSort: e.target.value === "price", page: 1 });
  };

  const loadMore = () => applyFilters({ ...filters, page: currentPage + 1 });

  const filterLabels = subFilters.map((f) =>
    typeof f === "string" ? f : f.name,
  );

  const sortSelect = (
    <div className="relative flex-none">
      <select
        value={priceSort ? "price" : "default"}
        onChange={handleSort}
        className="h-10 appearance-none rounded-full border bg-transparent pl-5 pr-11 text-[15px] focus:outline-none"
        style={{ borderColor: HAIRLINE, color: INK }}
        aria-label="Sort products"
      >
        <option value="default">Sort by: Default</option>
        <option value="price">Sort by: Price</option>
      </select>
      <ChevronDown
        size={16}
        strokeWidth={1.5}
        className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2"
        style={{ color: INK }}
      />
    </div>
  );

  const toggles = (
    <>
      <button
        type="button"
        onClick={handleDiscounts}
        className={PILL_BASE}
        style={pillStyle(discounts)}
      >
        Discounts
      </button>
      <button
        type="button"
        onClick={handleMadeInNaija}
        className={PILL_BASE}
        style={pillStyle(madeInNaija)}
      >
        Made in Nigeria
      </button>
    </>
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 xl:px-0 pb-10 md:pb-16">
      {/* ── Mobile: category rail ───────────────────────────── */}
      <div className="md:hidden -mx-4 px-4 flex gap-2.5 overflow-x-auto scrollbar-hide">
        <button
          type="button"
          onClick={() => handleFilterChange("all")}
          className={PILL_BASE}
          style={pillStyle(activeFilter === "all")}
        >
          All Products
        </button>
        {filterLabels.map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => handleFilterChange(label)}
            className={PILL_BASE}
            style={pillStyle(activeFilter === label)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Mobile: count + sort + toggles ──────────────────── */}
      <div className="md:hidden -mx-4 px-4 mt-4 flex items-center gap-2.5 overflow-x-auto scrollbar-hide">
        <span
          className="flex-none text-[13px]"
          style={{ color: "#6E6659" }}
        >
          {total} found
        </span>
        {sortSelect}
        {toggles}
      </div>

      {/* Sidebar rail + 80px gutter = the 280px offset to the content column */}
      <div className="flex md:gap-20">
        {/* ── Desktop sidebar ───────────────────────────────── */}
        <aside className="hidden md:block shrink-0 w-[200px] pt-1">
          <p
            className="text-[11px] font-medium tracking-[0.02em]"
            style={{ color: INK }}
          >
            CATEGORIES
          </p>
          <div className="mt-7 flex flex-col items-start gap-[13px]">
            <button
              type="button"
              onClick={() => handleFilterChange("all")}
              className={PILL_BASE}
              style={pillStyle(activeFilter === "all")}
            >
              All Products
            </button>
            {filterLabels.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => handleFilterChange(label)}
                className={PILL_BASE}
                style={pillStyle(activeFilter === label)}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Main column ───────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Desktop filter bar */}
          <div className="hidden md:flex items-center gap-2.5">
            {sortSelect}
            {toggles}

            <div className="ml-auto flex items-center gap-6">
              <span
                className="block w-px h-10"
                style={{ backgroundColor: HAIRLINE }}
              />
              <span className="text-[15px]" style={{ color: "#6E6659" }}>
                <span style={{ color: INK }}>{total}</span> gift options found
              </span>
            </div>
          </div>

          <div
            className="hidden md:block h-px mt-5 mb-4"
            style={{ backgroundColor: HAIRLINE }}
          />

          {/* Grid */}
          <div
            className={`mt-5 md:mt-0 transition-opacity duration-200 ${
              isLoading ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            {products.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-[16px] font-medium" style={{ color: INK }}>
                  No products found
                </p>
                <p className="mt-1 text-[14px]" style={{ color: "#6E6659" }}>
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Load more */}
          {currentPage < totalPages && products.length > 0 && (
            <div className="mt-9 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoading}
                className="inline-flex h-8 items-center rounded-full border px-5 text-[13px] disabled:opacity-50"
                style={{ borderColor: BRAND, color: BRAND_INK }}
              >
                {isLoading ? "Loading…" : "Load more"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
