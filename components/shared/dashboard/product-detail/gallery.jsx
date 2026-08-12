"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function ImageGallery({ media = [], images = [] }) {
  // Backward compat: if only images[] (URL strings) passed, convert to media format
  const items =
    media.length > 0
      ? media
      : images.map((url) => ({ type: "image", url }));

  const [activeIndex, setActiveIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState(null);
  const videoRefs = useRef({});
  const scrollRef = useRef(null);

  const pauseVideo = (index) => {
    const el = videoRefs.current[index];
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const newIndex = Math.round(
      scrollRef.current.scrollLeft / scrollRef.current.offsetWidth
    );
    if (newIndex !== activeIndex) {
      if (playingIndex !== null) {
        pauseVideo(playingIndex);
        setPlayingIndex(null);
      }
      setActiveIndex(newIndex);
    }
  };

  const scrollToIndex = (index) => {
    if (playingIndex !== null) {
      pauseVideo(playingIndex);
      setPlayingIndex(null);
    }
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.offsetWidth * index,
        behavior: "smooth",
      });
      setActiveIndex(index);
    }
  };

  const handleVideoHover = (index, entering) => {
    const el = videoRefs.current[index];
    if (!el) return;
    if (entering) {
      el.play().catch(() => {});
      setPlayingIndex(index);
    } else {
      pauseVideo(index);
      setPlayingIndex(null);
    }
  };

  const MIN_THUMBNAILS = 5;
  const isSingle = items.length === 1;
  const thumbnails = isSingle
    ? Array.from({ length: MIN_THUMBNAILS }, () => items[0])
    : items;

  return (
    <div className="bg-transparent">
      <div className="flex flex-col md:flex-row md:items-start md:gap-3">
        {/* Thumbnail rail */}
        {thumbnails.length > 1 && (
          <div className="order-2 md:order-1 flex md:flex-col gap-2 px-4 md:px-0 py-3 md:py-0 overflow-x-auto md:overflow-y-auto scrollbar-hide shrink-0 md:w-16 lg:w-20 md:max-h-[600px]">
            {thumbnails.map((item, index) => {
              const targetIndex = isSingle ? 0 : index;
              const isActive = isSingle ? index === 0 : index === activeIndex;
              const thumbUrl =
                item.type === "video" ? item.thumbnail : item.url;

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
                  {thumbUrl ? (
                    <Image
                      src={thumbUrl}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                        <polygon points="6,3 20,12 6,21" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Main slider */}
        <div className="order-1 md:order-2 relative flex-1 min-w-0">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="shrink-0 w-full snap-center relative aspect-square"
              >
                {item.type === "video" ? (
                  <div
                    className="relative w-full h-full"
                    onMouseEnter={() => handleVideoHover(index, true)}
                    onMouseLeave={() => handleVideoHover(index, false)}
                  >
                    <video
                      ref={(el) => {
                        videoRefs.current[index] = el;
                      }}
                      src={item.url}
                      poster={item.thumbnail || undefined}
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    {/* Play icon — visible when not playing */}
                    {playingIndex !== index && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-14 h-14 rounded-full bg-black/40 flex items-center justify-center">
                          <svg
                            width="26"
                            height="26"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <polygon points="8,5 19,12 8,19" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt={`Product image ${index + 1}`}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover rounded-2xl"
                    priority={index === 0}
                  />
                )}
              </div>
            ))}
          </div>
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
