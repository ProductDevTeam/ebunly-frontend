import Link from "next/link";
import Image from "next/image";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter (X)", href: "https://twitter.com" },
  { label: "Hello@Ebunly.com", href: "mailto:Hello@Ebunly.com" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Blog", href: "/blog" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0F0E0C] text-white font-sans overflow-hidden">
      {/* ── Star: top-right corner (mobile + desktop) ── */}
      <div className="absolute top-8 right-6 md:top-10 md:right-10 z-20 pointer-events-none">
        <Image src="/star.svg" alt="" width={24} height={24} />
      </div>

      {/* ── Main content ─────────────────────────────── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-14">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-12">
          {/* Left: Brand block */}
          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              className="font-panchang font-bold text-[26px] md:text-[28px] text-white leading-none tracking-tight"
            >
              EBUNLY
            </Link>
            <p
              className="text-[15px] md:text-[16px] text-white"
              style={{ lineHeight: "99%", letterSpacing: 0 }}
            >
              Making memories{" "}
              <span className="text-[#D85A30] font-semibold">last.</span>
            </p>
            <p
              className="text-[13px] text-white/50 "
              style={{ lineHeight: "20px", letterSpacing: 0 }}
            >
              ©Ebunly2026
            </p>
          </div>

          {/* Right: Link columns */}
          <div className="flex gap-10 md:gap-16 lg:gap-24">
            {/* Socials */}
            <div>
              <p className="text-[16px] tracking-[0] uppercase text-[#5C5C5C] mb-4 md:mb-5">
                Socials
              </p>
              <ul className="flex flex-col gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[16px] text-white hover:text-white/70 transition-colors leading-[120%] tracking-[0]"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[16px] tracking-[0] uppercase text-[#5C5C5C] mb-4 md:mb-5">
                Company
              </p>
              <ul className="flex flex-col gap-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[16px] text-white hover:text-white/70 transition-colors leading-[120%] tracking-[0]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Star: below Company column — desktop only */}
              <div className="hidden md:block mt-8">
                <Image src="/star.svg" alt="" width={20} height={20} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Giant outline EBUNLY ──────────────────────── */}
      <div className="relative mt-6 md:mt-10 overflow-hidden">
        {/* Star: bottom-left, overlapping the giant text */}
        <div className="absolute left-4 md:left-[138px] top-[50%] -translate-y-1/2 z-10 pointer-events-none">
          <Image src="/star.svg" alt="" width={28} height={28} />
        </div>

        <p
          className="font-panchang font-bold leading-[0.7] text-transparent select-none whitespace-nowrap pl-4 md:pl-36"
          style={{
            fontSize: "max(65px, 13vw)",
            WebkitTextStroke: "1px rgba(255,255,255,0.55)",
          }}
        >
          EBUNLY
        </p>
      </div>
    </footer>
  );
}
