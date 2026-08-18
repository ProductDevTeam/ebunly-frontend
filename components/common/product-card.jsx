"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import FavoriteButton from "@/components/common/favorite-button";

/*
 * The one product card used across the site (homepage rail, category grids).
 * Measured from the Figma exports: peach chrome #FAECE7 with #712B13 ink,
 * square image, per-image dot indicator, title over price.
 *
 * Multi-image cards also carry the carousel: swipe left/right on mobile,
 * and on desktop (md: cut, 768px) the images auto-advance every 3s, pausing
 * on hover. Either kind of manual interaction resets the autoplay timer.
 */
export const CARD_PEACH = "#FAECE7";
export const CARD_PEACH_INK = "#712B13";

const AUTOPLAY_MS = 3000;
const SWIPE_THRESHOLD_PX = 40;

export default function ProductCard({ product, sizes }) {
  const images =
    product.images?.length > 0
      ? product.images
      : [product.image].filter(Boolean);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const swipedRef = useRef(false);

  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!hasMultiple || paused) return;
    if (typeof window === "undefined" || !window.matchMedia("(min-width: 768px)").matches) {
      return;
    }
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
    // `index` is intentionally a dependency: any manual change (dot click or
    // swipe) restarts the timer so autoplay doesn't advance right after it.
  }, [hasMultiple, paused, images.length, index]);

  const goTo = (i) => setIndex((i + images.length) % images.length);

  const handleTouchStart = (e) => {
    if (!hasMultiple) return;
    touchStartX.current = e.touches[0].clientX;
    swipedRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (!hasMultiple || touchStartX.current === null) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD_PX) {
      goTo(index + (delta < 0 ? 1 : -1));
      swipedRef.current = true;
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
  };

  const handleImageClick = (e) => {
    // A swipe just happened on this same gesture — don't also navigate.
    if (swipedRef.current) {
      e.preventDefault();
      swipedRef.current = false;
    }
  };

  return (
    <div>
      <div
        className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#EFEFEF]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Link
          href={`/products/${product.slug}`}
          className="block h-full w-full"
          onClick={handleImageClick}
        >
          <Image
            src={images[index] ?? "/product.png"}
            alt={product.name}
            fill
            className="object-cover"
            sizes={sizes ?? "(max-width: 768px) 50vw, 220px"}
            loading="lazy"
          />
        </Link>

        {product.personalizable && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none"
            style={{ backgroundColor: CARD_PEACH, color: CARD_PEACH_INK }}
          >
            Personalizable
          </span>
        )}

        <FavoriteButton
          product={product}
          size={17}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#FAECE7]"
        />

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[rgba(43,43,43,0.55)] px-1.5 py-1">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === index}
                className={`h-[5px] w-[5px] rounded-full ${
                  i === index ? "bg-white" : "bg-[rgba(255,255,255,0.45)]"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <Link href={`/products/${product.slug}`} className="block">
        <p className="mt-3.5 truncate text-[15px] md:text-[16px] font-normal leading-[120%] text-[#1A1A1A]">
          {product.name}
        </p>
        <p className="mt-2 text-[15px] md:text-[16px] font-medium leading-[120%] text-[#1A1A1A]">
          ₦{(product.price ?? 0).toLocaleString()}
        </p>
      </Link>
    </div>
  );
}
