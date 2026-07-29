"use client";

import { useState } from "react";
import Image from "next/image";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="py-12 md:py-14 px-4 md:px-6 bg-[#FAF5F5] relative overflow-hidden section-lazy">
      {/* Decorative star — left */}
      <div
        data-reveal
        className="md:star-reveal absolute left-[4%] top-[18%] md:left-[30%] md:top-[22%] w-4 h-4 md:w-7 md:h-7 pointer-events-none"
      >
        <Image
          src="/star.svg"
          alt=""
          width={12}
          height={12}
          className="w-full h-full"
        />
      </div>

      {/* Decorative star — bottom-left blur */}
      <div
        data-reveal
        className="star-reveal absolute left-[4%] top-[25%] md:left-[11%] md:top-[70%] w-10 h-10 md:w-22 md:h-22 md:blur-lg pointer-events-none hidden md:block"
      >
        <Image
          src="/star.svg"
          alt=""
          width={88}
          height={88}
          className="w-full h-full"
        />
      </div>

      {/* Decorative star — right */}
      <div
        data-reveal
        className="star-reveal-neg absolute right-[4%] bottom-[18%] md:right-[8%] md:bottom-[22%] w-12 h-12 blur-lg md:w-5 md:h-5 pointer-events-none"
      >
        <Image
          src="/star.svg"
          alt=""
          width={36}
          height={36}
          className="w-full h-full"
        />
      </div>

      {/* Content */}
      <div className="max-w-130 mx-auto text-center relative z-10">
        <div data-reveal className="reveal">
          <h2
            className="font-sans font-semibold text-[24px] md:text-[32px] text-[#1E1E1E] mb-2 md:mb-3"
            style={{ letterSpacing: "-4%", lineHeight: "120%" }}
          >
            Stay in the loop
          </h2>
          <p
            className="text-[14px] md:text-[15px] text-black mb-6 md:mb-8 "
            style={{ letterSpacing: "-2%", lineHeight: "140%" }}
          >
            Sign up for sales, discounts, and unique gift ideas
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center sm:flex-row sm:items-center gap-3 w-full sm:max-w-105 mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full sm:flex-1 h-12 sm:h-11 border border-gray-200 rounded-full px-6 text-[14px] text-text-new-gray placeholder:text-gray-400 focus:outline-none focus:border-gray-300 bg-white"
            />
            <button
              type="submit"
              className="shrink-0 h-11 px-8 bg-[#D85A30] text-white font-semibold text-[14px] rounded-full hover:bg-orange-600 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
