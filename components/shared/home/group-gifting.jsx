import Image from "next/image";
import Link from "next/link";

export default function GroupGiftingSection() {
  return (
    <section className="py-8 md:py-14 px-4 md:px-6 bg-[#FFFAEB] section-lazy">
      <div className="max-w-7xl mx-auto">
        <div
          data-reveal
          className="reveal rounded-3xl overflow-hidden flex flex-col flex-col-reverse md:flex-row"
          style={{
            background: "#FFFFFF",
          }}
        >
          {/* ── Yellow illustration block ───── */}
          <div
            data-reveal
            className="reveal reveal-d-100 md:w-[45%] flex items-end justify-center overflow-hidden min-h-35 md:min-h-85 rounded-2xl"
            style={{ background: "#FDC103" }}
          >
            <Image
              src="/people.png"
              alt="Group gifting illustration"
              width={600}
              height={340}
              className="w-[70%] md:w-[90%] h-auto object-contain block mx-auto translate-y-10 md:translate-y-16"
            />
          </div>
          {/* ── Text content ─────────────── */}
          <div className="flex-1 flex flex-col justify-center px-7 py-8 md:px-10 md:py-12 bg-[#FFFAEB]">
            <p className="text-[#F85826] font-semibold text-[12px] uppercase tracking-[6%] leading-[140%] mb-3">
              Group Gifting
            </p>
            <h2
              className="font-sans font-semibold text-[#1E1E1E] text-[22px] md:text-[32px] leading-[120%] mb-1"
              style={{ letterSpacing: "-2%" }}
            >
              Plan your next event
            </h2>
            <p className="text-black text-[16px] md:text-[15px] mb-6 leading-[140%]">
              Not sure of the right gift for your event?
            </p>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-black text-[14px] md:text-[15px] hover:gap-3 transition-all group leading-[140%] tracking-[-1%]"
            >
              Get Inspired
              <span className="inline-flex items-center group-hover:translate-x-1 transition-transform">
                <svg
                  width="36"
                  height="12"
                  viewBox="0 0 36 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line
                    x1="0"
                    y1="6"
                    x2="30"
                    y2="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M25 1L31 6L25 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
