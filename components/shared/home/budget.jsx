import Link from "next/link";
import Image from "next/image";

// `budget=` was never read by the results page — the products API filters on
// minPrice / maxPrice, which the results page now hydrates from the URL.
const budgets = [
  {
    id: 1,
    amount: "₦3K",
    label: "& under",
    href: "/shop/categories/all?maxPrice=3000",
    dark: false,
  },
  {
    id: 2,
    amount: "₦5K",
    label: "& under",
    href: "/shop/categories/all?maxPrice=5000",
    dark: false,
  },
  {
    id: 3,
    amount: "₦10K",
    label: "& under",
    href: "/shop/categories/all?maxPrice=10000",
    dark: false,
  },
  {
    id: 4,
    amount: "₦10K+",
    label: "& above",
    href: "/shop/categories/all?minPrice=10000",
    dark: true,
  },
];

const staggerDelays = ["reveal-d1", "reveal-d2", "reveal-d3", "reveal-d4"];

export default function BudgetSection() {
  return (
    <section className="py-8 md:py-14 bg-white section-lazy">
      <div className="max-w-7xl mx-auto">
        <h2
          data-reveal
          className="reveal font-sans font-semibold text-[20px] md:text-[32px] text-[#1E1E1E] mb-6 md:mb-8 leading-[120%] px-4 md:px-6"
          style={{ letterSpacing: "-0.02em" }}
        >
          Perfect Gifts at any budget
        </h2>

        {/* Mobile: horizontal scroll */}
        <div
          data-reveal
          className="reveal md:hidden flex gap-3 overflow-x-auto pt-2 pb-4 snap-x snap-mandatory scroll-pl-4 scrollbar-hide"
        >
          <div className="shrink-0 w-4" />
          {budgets.map((b) => (
            <div
              key={b.id}
              className="shrink-0 snap-start w-[44vw] min-w-[155px] max-w-[220px]"
            >
              <Link href={b.href} className="group block h-full">
                <div
                  className={`rounded-[24px] p-4 h-full flex flex-col justify-between min-h-[148px] relative overflow-hidden transition-transform group-hover:-translate-y-0.5 ${
                    b.dark ? "bg-[#111111]" : "bg-white border border-[#A4A4A4]"
                  }`}
                >
                  {/* Decorative — sits behind all content */}
                  <div className="absolute -right-3 -bottom-5 z-0 pointer-events-none select-none">
                    <Image src="/gift-box.png" alt="" width={90} height={90} />
                  </div>

                  <div className="relative z-10">
                    <p
                      className={`font-bold text-[28px] font-serif leading-[120%] mb-0.5 ${b.dark ? "text-white" : "text-black"}`}
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {b.amount}
                    </p>
                    <p
                      className={`text-[12px] ${b.dark ? "text-white/70" : "text-black"}`}
                    >
                      {b.label}
                    </p>
                  </div>

                  <p className="relative z-10 text-[11px] font-semibold uppercase tracking-wider mt-4 text-primary">
                    Shop Now
                  </p>
                </div>
              </Link>
            </div>
          ))}
          <div className="shrink-0 w-4" />
        </div>

        {/* Desktop: 4-column grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 px-6">
          {budgets.map((b, i) => (
            <div
              key={b.id}
              data-reveal
              className={`reveal ${staggerDelays[i] ?? ""}`}
            >
              <Link href={b.href} className="group block h-full">
                <div
                  className={`rounded-2xl p-5 lg:p-6 h-full flex flex-col justify-between min-h-[160px] relative overflow-hidden transition-transform group-hover:-translate-y-0.5 ${
                    b.dark ? "bg-[#111111]" : "bg-white border border-[#A4A4A4]"
                  }`}
                >
                  {/* Decorative — sits behind all content */}
                  <div className="absolute -right-4 -bottom-8 z-0 pointer-events-none select-none">
                    <Image
                      src="/gift-box.png"
                      alt=""
                      width={110}
                      height={110}
                    />
                  </div>

                  <div className="relative z-10">
                    <p
                      className={`font-bold text-[36px] lg:text-[48px] font-serif leading-[120%] mb-1 ${b.dark ? "text-white" : "text-black"}`}
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {b.amount}
                    </p>
                    <p
                      className={`text-[13px] lg:text-[14px] ${b.dark ? "text-white/70" : "text-black"}`}
                    >
                      {b.label}
                    </p>
                  </div>

                  <p className="relative z-10 text-[13px] lg:text-[14px] font-semibold uppercase tracking-wider mt-4 text-primary">
                    Shop Now
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
