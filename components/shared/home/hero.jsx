"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden h-[60vh] md:max-h-[88vh] flex flex-col items-center justify-center">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #FF3030 30.93%, #CD0F3F 100%)",
        }}
      />

      {/* Blurred Heart Images - Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Blurred Heart - Top Left */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute top-[15%] left-[5%] blur-xs hidden md:block"
        >
          <Image
            src="/full-heart.svg"
            alt=""
            width={350}
            height={350}
            className="w-70 md:w-25 h-auto"
          />
        </motion.div>

        {/* Large Blurred Heart - Bottom Right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute -bottom-[40%] -right-[10%] blur-sm hidden md:block"
        >
          <Image
            src="/full-heart.svg"
            alt=""
            width={400}
            height={400}
            className="w-[320px] md:w-100 h-auto"
          />
        </motion.div>
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 pb-16 flex items-center justify-center">
        {/* Small Heart - Near Text */}
        <motion.div
          initial={{ opacity: 0, rotate: -15 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-[5%] right-[15%] md:-right-[5%] z-5 hidden md:block"
        >
          <Image
            src="/full-heart.svg"
            alt=""
            width={80}
            height={80}
            className="w-12.5 md:w-17.5 lg:w-15 h-auto opacity-80"
          />
        </motion.div>

        {/* Text Content - Perfectly Centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 font-playfair max-w-xl text-center"
        >
          <h1 className="text-4xl md:text-3xl lg:text-4xl xl:text-5xl text-[#FAF9C6] mb-6 tracking-tighter">
            <span className="italic font-light">Thoughtful gifts</span>
            <br />
            <span className="font-bold font-sans">for moments worth</span>
            <br />
            <span className="font-bold font-sans">remembering</span>
          </h1>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-gray-900 px-8 py-2.5 rounded-full font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>

      {/* Main Heart Image - Bottom Left (Fully Visible) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute
          bottom-[-9%] left-[20%] 
          lg:bottom-[-8%] lg:left-[3%] 
          z-20
        "
      >
        <Image
          src="/heart.svg"
          alt="Red heart gift"
          width={420}
          height={420}
          priority
          sizes="
            (max-width: 640px) 280px,
            (max-width: 1024px) 360px,
            420px
          "
          className="w-65 sm:w-75 md:w-90 lg:w-[320px] h-auto"
        />
      </motion.div>

      {/* Subtle bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/5 to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
