import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden hero-gradient">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center md:items-stretch min-h-105 md:min-h-125">
        {/* Text block */}
        <div className="relative z-10 flex flex-col justify-center pt-12 pb-10 md:pt-0 md:pb-0 md:w-[44%] text-center md:text-left">
          <h1 className="hero-heading font-sans font-semibold text-text-new-gray mb-4 md:mb-5 hero-animate-text">
            Show her
            <br />
            you care
          </h1>
          <p className="hero-p font-sans text-text-new-gray mb-6 md:mb-8 hero-animate-sub">
            From birthdays to weddings —
            <br className="hidden md:block" />
            beautifully wrapped and ready to send.
          </p>
          <button className="hero-animate-cta inline-block bg-[#F85826] text-white px-7 py-2.5 rounded-full font-semibold text-[15px] md:text-base shadow-md hover:shadow-lg hover:scale-[1.04] active:scale-[0.96] transition-all font-sans cursor-pointer">
            Shop for her
          </button>
        </div>

        {/* Image block */}
        <div className="relative md:flex-1 flex items-center md:items-end justify-center md:justify-end">
          <div className="relative md:translate-y-[2%] hero-animate-image">
            <Image
              src="/hero-bg.svg"
              alt="Gift Boxes"
              width={820}
              height={560}
              priority
              sizes="(max-width: 768px) 320px, (max-width: 1024px) 420px, 560px"
              className="w-[320px] sm:w-95 md:w-110 lg:w-140 h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
