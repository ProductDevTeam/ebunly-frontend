"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function ImageGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const itemWidth = scrollRef.current.offsetWidth;
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(index);
    }
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: itemWidth * index,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  return (
    <div className="bg-transparent">
      <div className="flex flex-col md:flex-row md:items-start md:gap-3">
        {/* Thumbnail Navigation — below on mobile, left column on desktop */}
        {images.length > 1 && (
          <div className="order-2 md:order-1 flex md:flex-col gap-2 px-4 md:px-0 py-3 md:py-0 overflow-x-auto md:overflow-y-auto scrollbar-hide shrink-0 md:w-16 lg:w-20 md:max-h-[600px]">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`shrink-0 relative w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === activeIndex
                    ? "border-orange-500 ring-2 ring-orange-200"
                    : "border-gray-200"
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  unoptimized
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image Slider */}
        <div className="order-1 md:order-2 relative flex-1 min-w-0">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="shrink-0 w-[95%] md:w-full snap-center relative aspect-square"
              >
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover md:rounded-2xl"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Pagination Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === activeIndex
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/50"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
