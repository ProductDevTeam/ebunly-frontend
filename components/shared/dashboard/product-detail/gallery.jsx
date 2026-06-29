"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [liked, setLiked] = useState(false);
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

  const goPrev = () => scrollToIndex(Math.max(0, activeIndex - 1));
  const goNext = () => scrollToIndex(Math.min(images.length - 1, activeIndex + 1));

  // When there's only one image, pad the thumbnail rail with duplicates so the
  // desktop two-column gallery layout doesn't break. Purely visual — the main
  // slider still shows the single image, and every thumbnail points back to it.
  const MIN_THUMBNAILS = 5;
  const isSingle = images.length === 1;
  const thumbnails = isSingle
    ? Array.from({ length: MIN_THUMBNAILS }, () => images[0])
    : images;

  return (
    <div className="bg-transparent">
      <div className="flex flex-col md:flex-row md:items-start md:gap-3">
        {/* Thumbnail Navigation — below on mobile, left column on desktop */}
        {thumbnails.length > 1 && (
          <div className="order-2 md:order-1 flex md:flex-col gap-2 px-4 md:px-0 py-3 md:py-0 overflow-x-auto md:overflow-y-auto scrollbar-hide shrink-0 md:w-16 lg:w-20 md:max-h-[600px]">
            {thumbnails.map((image, index) => {
              const targetIndex = isSingle ? 0 : index;
              const isActive = isSingle ? index === 0 : index === activeIndex;
              return (
                <button
                  key={index}
                  onClick={() => scrollToIndex(targetIndex)}
                  className={`shrink-0 relative w-16 h-16 lg:w-20 lg:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    isActive
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
              );
            })}
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
                className="shrink-0 w-[95%] md:w-full snap-center relative aspect-square md:aspect-8/7"
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

          {/* Favorite button */}
          <button
            onClick={() => setLiked((v) => !v)}
            aria-label={liked ? "Remove from favorites" : "Add to favorites"}
            className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-105"
          >
            <Heart
              className={`h-5 w-5 ${liked ? "fill-primary text-primary" : "text-gray-700"}`}
            />
          </button>

          {/* Prev / Next arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-transform hover:scale-105"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goNext}
                aria-label="Next image"
                className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition-transform hover:scale-105"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
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
