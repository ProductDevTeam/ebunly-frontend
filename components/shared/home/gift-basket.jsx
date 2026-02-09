"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { categories } from "@/lib/data";

const GiftBasketsSection = () => {
  return (
    <section className="py-12 md:py-16 lg:py-20 px-6 md:px-0">
      <div className="max-w-7xl mx-auto">
        {/* Container: stack on mobile, row on desktop */}
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-62.5 xl:w-70 shrink-0"
          >
            <h2 className="text-xl md:text-3xl lg:text-4xl font-playfair leading-tight tracking-tighter lg:w-[80%] w-full">
              <span className="italic font-light">Gift Baskets </span>
              <span className="font-bold">for any event or occasion</span>
            </h2>
          </motion.div>

          {/* Categories Grid */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col"
              >
                <Link
                  href={`/categories/${category.name
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="block group"
                >
                  {/* Category Badge */}
                  <div
                    className={`${category.color} rounded-full px-4 py-2 inline-flex items-center gap-2 mb-2 transition-transform group-hover:scale-105`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full bg-gray-900`} />
                    <span className="text-sm font-semibold text-gray-900">
                      {category.name}
                    </span>
                  </div>

                  {/* Images Container - Single on mobile, Two on desktop */}
                  <div className="flex flex-col gap-2">
                    {/* First Image - Always visible */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow"
                      style={{ aspectRatio: "16 / 9" }}
                    >
                      <Image
                        src={category.images[0].src}
                        alt={category.images[0].alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    </motion.div>

                    {/* Second Image - Hidden on mobile, visible on desktop */}
                    {category.images[1] && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="hidden lg:block relative w-full rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow"
                        style={{ aspectRatio: "16 / 9" }}
                      >
                        <Image
                          src={category.images[1].src}
                          alt={category.images[1].alt}
                          fill
                          className="object-cover"
                          sizes="25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                      </motion.div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftBasketsSection;
