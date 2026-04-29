import Link from "next/link";
import Image from "next/image";

const categories = [
  {
    id: 1,
    name: "Weddings",
    subtitle: "Gifts & Keepsakes",
    image: "/categories/wedding.jpg",
    icon: "/categories/wedding-icon.png",
    cardBg: "#C8EFE9",
    mobileBg: "#D4EFE9",
    href: "/discover?category=weddings",
  },
  {
    id: 2,
    name: "Conferences",
    subtitle: "Branded & Bulk Gifting",
    image: "/categories/conference.jpg",
    icon: "/categories/conference-icon.png",
    cardBg: "#FAE2D4",
    mobileBg: "#FAD9CE",
    href: "/discover?category=conferences",
  },
  {
    id: 3,
    name: "Parties",
    subtitle: "Celebrate in Style",
    image: "/categories/parties.jpg",
    icon: "/categories/parties-icon.png",
    cardBg: "#EDD9F9",
    mobileBg: "#EAD9F7",
    href: "/discover?category=parties",
  },
  {
    id: 4,
    name: "Birthdays",
    subtitle: "Any age. Any budget",
    image: "/categories/birthday.jpg",
    icon: "/categories/birthday-icon.png",
    cardBg: "#FEF3C7",
    mobileBg: "#FEF0C2",
    href: "/discover?category=birthdays",
  },
  {
    id: 5,
    name: "Corporate Events",
    subtitle: "Trophies, retreats, everything",
    image: "/categories/event.jpg",
    icon: "/categories/event-icon.png",
    cardBg: "#DBEAFE",
    mobileBg: "#E0EAF4",
    href: "/discover?category=corporate",
  },
];

const staggerDelays = ["reveal-d1", "reveal-d2", "reveal-d3", "reveal-d4", "reveal-d5"];

export default function GiftBasketsSection() {
  return (
    <section className="py-10 md:py-16 px-4 md:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div data-reveal className="reveal text-center mb-8 md:mb-10">
          <h2 className="inline leading-[96%]">
            <span
              className="font-playfair italic text-[26px] md:text-[34px] text-black"
              style={{ fontWeight: 400, letterSpacing: "-6%" }}
            >
              Gift Baskets{" "}
            </span>
            <span
              className="font-sans font-semibold text-[26px] md:text-[34px] text-black"
              style={{ letterSpacing: "-7%" }}
            >
              for any <br /> event or occasion
            </span>
          </h2>
        </div>

        {/* ── Desktop: 5-column grid ───────────────────── */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              data-reveal
              className={`reveal ${staggerDelays[i] ?? ""}`}
            >
              <Link href={cat.href} className="group block">
                <div
                  className="w-full rounded-2xl overflow-hidden"
                  style={{ backgroundColor: cat.cardBg }}
                >
                  <div className="relative aspect-4/3">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 20vw, 256px"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-3 translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                      <Image
                        src={cat.icon}
                        alt=""
                        width={28}
                        height={28}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="pt-9 pb-4 px-3">
                    <p className="font-bold text-[14px] text-gray-900 leading-snug">
                      {cat.name}
                    </p>
                    <p className="text-[12px] text-gray-400 mt-0.5">{cat.subtitle}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* ── Mobile: bento layout ─────────────────────── */}
        <div className="md:hidden flex flex-col gap-3">
          {/* Weddings — full width with photo */}
          <div data-reveal className="reveal">
            <Link href={categories[0].href} className="block">
              <div
                className="rounded-2xl p-3 flex items-center gap-2 h-28"
                style={{ backgroundColor: categories[0].mobileBg }}
              >
                <div className="flex-1">
                  <p className="font-bold text-[16px] text-gray-900 leading-tight">
                    {categories[0].name}
                  </p>
                  <p className="text-[12px] text-gray-500 mt-1 leading-tight">
                    {categories[0].subtitle}
                  </p>
                </div>
                <div className="w-7 h-7 shrink-0 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Image
                    src={categories[0].icon}
                    alt=""
                    width={16}
                    height={16}
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <div className="self-stretch w-[48%] shrink-0 rounded-2xl overflow-hidden relative -my-2 -mr-2">
                  <Image
                    src={categories[0].image}
                    alt={categories[0].name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              </div>
            </Link>
          </div>

          {/* 2×2 grid for remaining 4 */}
          <div className="grid grid-cols-2 gap-3">
            {categories.slice(1).map((cat, i) => (
              <div
                key={cat.id}
                data-reveal
                className={`reveal ${staggerDelays[i] ?? ""}`}
              >
                <Link href={cat.href} className="block h-full">
                  <div
                    className="rounded-2xl p-3 min-h-16 h-full flex flex-col justify-between relative"
                    style={{ backgroundColor: cat.mobileBg }}
                  >
                    <div className="self-end w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Image
                        src={cat.icon}
                        alt=""
                        unoptimized
                        width={24}
                        height={20}
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-gray-900 leading-tight">
                        {cat.name}
                      </p>
                      <p className="text-[12px] text-gray-500 mt-0.5 leading-tight">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
