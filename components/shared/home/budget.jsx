import Link from "next/link";
import Image from "next/image";

const budgets = [
  {
    id: 1,
    amount: "₦3K",
    label: "& under",
    href: "/discover?budget=3000",
    dark: false,
  },
  {
    id: 2,
    amount: "₦5K",
    label: "& under",
    href: "/discover?budget=5000",
    dark: false,
  },
  {
    id: 3,
    amount: "₦10K",
    label: "& under",
    href: "/discover?budget=10000",
    dark: false,
  },
  {
    id: 4,
    amount: "₦10K+",
    label: "& above",
    href: "/discover?budget=10000plus",
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
          className="reveal font-sans font-semibold text-[20px] md:text-[32px] text-[#1E1E1E] mb-6 md:mb-8 leading-[120%] px-6 md:px-6"
          style={{ letterSpacing: "-2%" }}
        >
          Perfect Gifts at any budget
        </h2>

        {/* Mobile: horizontal scroll */}
        <div
          data-reveal
          className="reveal md:hidden flex gap-3 overflow-x-auto pt-2 pb-4 snap-x snap-mandatory scroll-pl-6 scrollbar-hide"
        >
          <div className="shrink-0 w-6" />
          {budgets.map((b) => (
            <div
              key={b.id}
              className="shrink-0 snap-start"
              style={{ width: "calc(50vw - 12px)" }}
            >
              <Link href={b.href} className="group block h-full">
                <div
                  className={`rounded-[28px] p-4 h-full flex flex-col justify-between min-h-36 relative overflow-hidden transition-transform group-hover:-translate-y-0.5 ${
                    b.dark
                      ? "bg-[#111111] text-white"
                      : "bg-white border border-[#A4A4A4] text-text-new-gray"
                  }`}
                >
                  <div className="absolute -right-2 bottom-0">
                    <Image src="/gift-box.png" alt="Gift Box" width={100} height={100} />
                  </div>
                  <div>
                    <p
                      className={`font-bold text-[32px] font-serif leading-[120%] mb-0.5 ${b.dark ? "text-white" : "text-black"}`}
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {b.amount}
                    </p>
                    <p className={`text-[13px] ${b.dark ? "text-white/70" : "text-black"}`}>
                      {b.label}
                    </p>
                  </div>
                  <p className="text-[12px] font-semibold uppercase tracking-wider mt-4 text-primary">
                    Shop Now
                  </p>
                </div>
              </Link>
            </div>
          ))}
          <div className="shrink-0 w-6" />
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
                  className={`rounded-2xl p-6 h-full flex flex-col justify-between min-h-40 relative overflow-hidden transition-transform group-hover:-translate-y-0.5 ${
                    b.dark
                      ? "bg-[#111111] text-white"
                      : "bg-white border border-[#A4A4A4] text-text-new-gray"
                  }`}
                >
                  <div className="absolute -right-0.5 top-1/2 -translate-y-[16%]">
                    <Image src="/gift-box.png" alt="Gift Box" width={120} height={120} />
                  </div>
                  <div>
                    <p
                      className={`font-bold text-[48px] font-serif leading-[120%] mb-1 ${b.dark ? "text-white" : "text-black"}`}
                      style={{ letterSpacing: "-0.02em" }}
                    >
                      {b.amount}
                    </p>
                    <p className={`text-[14px] ${b.dark ? "text-white/70" : "text-black"}`}>
                      {b.label}
                    </p>
                  </div>
                  <p className="text-[14px] font-semibold uppercase tracking-wider mt-4 text-primary">
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
