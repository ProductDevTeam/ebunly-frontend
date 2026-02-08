"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const EventShoppingCTA = () => {
  return (
    <section className="relative pt-10 px-6 overflow-hidden bg-[#1A4D4D]">
      {/* Decorative Stars */}
      <motion.div
        initial={{ rotate: 0, opacity: 0 }}
        whileInView={{ rotate: 360, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-6 md:top-8 left-6 md:left-12 w-10 h-10 md:w-12 md:h-12"
      >
        <Image
          src="/star.svg"
          alt="Decorative star"
          width={48}
          height={48}
          className="w-full h-full"
        />
      </motion.div>

      <motion.div
        initial={{ rotate: 0, opacity: 0 }}
        whileInView={{ rotate: -360, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute bottom-24 md:bottom-28 right-6 md:right-12 w-10 h-10 md:w-12 md:h-12"
      >
        <Image
          src="/star.svg"
          alt="Decorative star"
          width={48}
          height={48}
          className="w-full h-full"
        />
      </motion.div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Text & CTA */}
        <div className="flex-1 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white mb-6 md:mb-8 leading-tight"
          >
            <span className="font-bold">Shopping for an event</span>
            <br />
            <span className="font-playfair italic font-light">
              or Special Occasion?
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/group-shopping">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#FF5722] text-white px-8 md:px-6 py-3 md:py-1.5 cursor-pointer rounded-full font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-shadow"
              >
                Switch to Group
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 max-w-full"
        >
          <Image
            src="/people.svg"
            alt="People with gifts"
            width={800}
            height={250}
            className="w-full h-auto object-contain"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
};

export default EventShoppingCTA;
