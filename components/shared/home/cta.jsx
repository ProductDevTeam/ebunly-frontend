"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const EventShoppingCTA = () => {
  return (
    <section className="relative px-6 overflow-hidden bg-[#004138]">
      {/* Decorative Stars */}
      <motion.div
        initial={{ rotate: 0, opacity: 0 }}
        whileInView={{ rotate: 360, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-6 md:top-8 left-6 md:left-12 w-6 h-6 md:w-12 md:h-12 md:hidden"
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
        className="absolute bottom-24 md:top-6 right-6 md:left-[45%] w-10 h-10 md:w-10 md:h-10 hidden md:block"
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
        className="absolute bottom-24 md:bottom-28 right-6 md:right-12 w-6 h-6 md:w-12 md:h-12 lg:hidden"
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
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end gap-8">
        {/* Text & CTA — padded top and bottom, image will align to bottom */}
        <div className="flex-1 text-center md:text-left w-full md:w-[30%] pt-14 pb-14 md:pt-20 md:pb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="heading-1-mod text-white mb-6 md:mb-2 leading-9"
          >
            <span className="font-semibold">
              Shopping for
              <br /> an event or
            </span>
            <span className="font-playfair italic font-light">
              <br />
              Special Occasion?
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
                whileTap={{ scale: 0.95 }}
                className="bg-[#FF5722] md:mt-4 text-white px-2.5 md:px-5 py-1.5 md:py-2 cursor-pointer rounded-full font-bold text-base md:text-lg shadow-xl hover:shadow-2xl transition-shadow"
              >
                Switch to Group
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Illustration — self-end pins image flush to bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 max-w-full self-end scale-[1.15] origin-bottom"
        >
          <Image
            src="/people.svg"
            alt="People with gifts"
            width={1000}
            height={250}
            className="w-full h-auto object-contain block"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
};

export default EventShoppingCTA;
