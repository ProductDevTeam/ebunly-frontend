import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center md:items-stretch max-h-105 md:min-h-125">
        {/* Text block */}
        <div className="relative z-10 flex flex-col justify-center pt-12 pb-10 md:pt-0 md:pb-0 md:w-[44%] text-center md:text-left">
          <h1
            className="hero-heading font-sans font-semibold text-text-new-gray mb-4 md:mb-5 hero-animate-text"
            style={{ lineHeight: "91%", letterSpacing: "-6%" }}
          >
            Show her
            <br />
            you care
          </h1>
          <p
            className="hero-p font-sans text-black mb-6 md:mb-8 hero-animate-sub"
            style={{ lineHeight: "120%", letterSpacing: "-2%" }}
          >
            From birthdays to weddings —
            <br className="block" />
            beautifully wrapped and <br className="block md:hidden" /> ready to
            send.
          </p>
          <Link
            href="/shop/categories/for-her"
            className="hero-animate-cta w-fit self-center md:self-start bg-[#D85A30] text-white px-7 py-3 md:px-6.5 rounded-full font-semibold text-[15px] md:text-base shadow-md hover:shadow-lg hover:scale-[1.04] active:scale-[0.96] transition-all font-sans cursor-pointer"
          >
            Shop for her
          </Link>
        </div>

        {/* Image block */}
        <div className="relative md:flex-1 flex items-center md:items-end justify-center md:justify-end">
          <div className="relative -translate-y-[10%] -translate-x-12 md:translate-y-[23%] hero-animate-image">
            <Image
              src="/hero-bg.png"
              alt="Gift Boxes"
              width={920}
              height={660}
              priority
              sizes="(max-width: 768px) 1200px, (max-width: 1024px) 420px, 560px"
              className="w-[600px] m:w-95 md:w-110 lg:w-140 h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
