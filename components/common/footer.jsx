import Image from "next/image";

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter (X)", href: "https://twitter.com" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Blog", href: "/blog" },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#FFF5F3] overflow-hidden pb-10 md:pb-0">
      {/* Background SVG */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/footer-bg.svg"
          alt=""
          fill
          className="object-cover blur-3xl"
          priority={false}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-12">
          {/* Left: Tagline */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Image
                src="/logo-basket.svg"
                alt="Ebunly Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            <div className="space-y-1 font-sans font-medium">
              <h2 className="text-3xl md:text-4xl  text-gray-900 leading-tight">
                Make
                <br />
                memories
              </h2>
              <p className="text-3xl md:text-4xl text-primary leading-tight">
                last.
              </p>
            </div>

            <p className="text-sm text-gray-900 font-medium">©Ebunly2026</p>
          </div>

          {/* Right: Socials & Company */}
          <div className="flex flex-col sm:flex-row gap-8 md:gap-12 lg:gap-28">
            {/* Socials */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Socials</h3>
              <ul className="space-y-3">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="pt-4">
                <a
                  href="mailto:Hello@Ebunly.com"
                  className="text-gray-900 hover:text-primary transition-colors"
                >
                  Hello@Ebunly.com
                </a>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Company</h3>
              <ul className="space-y-3">
                {COMPANY_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-900 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
