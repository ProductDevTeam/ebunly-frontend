import Link from "next/link";
import Image from "next/image";

const recipients = [
  {
    id: 1,
    label: "For Her",
    sub: "Jewellery, Beauty & More",
    href: "/discover?for=her",
    image: "/categories/for-her.jpg",
  },
  {
    id: 2,
    label: "For Him",
    sub: "Stylish & Thoughtful",
    href: "/discover?for=him",
    image: "/categories/for-him.jpg",
  },
  {
    id: 3,
    label: "For Couples",
    sub: "Gifts they'll both love",
    href: "/discover?for=couples",
    image: "/categories/for-couples.jpg",
    mobileBtn: true,
    mobileBtnImage: "/categories/couples.png",
  },
  {
    id: 4,
    label: "For Babies",
    sub: "Newborn to Toddler",
    href: "/discover?for=babies",
    image: "/categories/for-babies.jpg",
    mobileBtn: true,
    mobileBtnImage: "/categories/babies.png",
  },
];

const staggerDelays = ["reveal-d1", "reveal-d2", "reveal-d3", "reveal-d4"];

export default function WhoGiftingSection() {
  return (
    <section className="py-8 md:py-14 px-4 md:px-6 bg-white section-lazy">
      <div className="max-w-7xl mx-auto">
        <h2
          data-reveal
          className="reveal font-sans font-semibold text-[20px] md:text-[28px] text-text-new-gray mb-6 md:mb-8"
          style={{ letterSpacing: "-0.03em" }}
        >
          Who are you gifting?
        </h2>

        {/* ── Desktop: 4 equal columns ───────────────── */}
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          {recipients.map((r, i) => (
            <div
              key={r.id}
              data-reveal
              className={`reveal ${staggerDelays[i] ?? ""}`}
            >
              <Link
                href={r.href}
                className="group block relative rounded-2xl overflow-hidden h-65 lg:h-75"
              >
                <div className="absolute inset-0">
                  <Image
                    src={r.image}
                    alt={r.label}
                    fill
                    className="object-cover object-[65%_40%] scale-100"
                    sizes="25vw"
                  />
                </div>
                <div
                  className="absolute bottom-0 left-0 right-0 p-4"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 73.56%)",
                  }}
                >
                  <p className="text-white font-semibold text-[15px] leading-tight">
                    {r.label}
                  </p>
                  <p className="text-white/80 text-[12px] mt-0.5">{r.sub}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* ── Mobile ────────────────────────────────── */}
        <div className="md:hidden flex flex-col gap-3">
          {recipients.slice(0, 2).map((r, i) => (
            <div
              key={r.id}
              data-reveal
              className={`reveal ${staggerDelays[i] ?? ""}`}
            >
              <Link
                href={r.href}
                className="block relative rounded-2xl overflow-hidden h-52"
              >
                <div className="absolute right-0 top-0 bottom-0 w-[58%]">
                  <Image
                    src={r.image}
                    alt={r.label}
                    fill
                    className="object-cover object-[left_30%]"
                    sizes="60vw"
                  />
                </div>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, #000000 42%, rgba(0,0,0,0) 68%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-semibold text-[16px] leading-tight">
                    {r.label}
                  </p>
                  <p className="text-white/80 text-[13px] mt-0.5">{r.sub}</p>
                </div>
              </Link>
            </div>
          ))}

          <div data-reveal className="reveal reveal-d3 flex gap-3 mt-1">
            {recipients.slice(2).map((r) => (
              <Link
                key={r.id}
                href={r.href}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-full py-3 text-[14px] font-medium text-text-new-gray hover:bg-gray-50 transition-colors"
              >
                <Image
                  src={r.mobileBtnImage}
                  alt={r.label}
                  width={20}
                  height={20}
                  className="w-5 h-5 object-cover"
                />
                <span>{r.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
