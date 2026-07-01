"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";

/**
 * Heart toggle used on every product card. Outline (matches the existing
 * `/icons/heart.svg`) when not saved; solid brand-red when saved.
 */
export default function FavoriteButton({
  product,
  className = "",
  size = 22,
  "aria-label": ariaLabel,
}) {
  const { hydrated, has, toggle } = useWishlist();
  const id = product?.id ?? product?._id;
  const active = hydrated && has(id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      className={`p-1.5 shrink-0 ${className}`}
      aria-label={ariaLabel ?? (active ? "Remove from favorites" : "Save to favorites")}
      aria-pressed={active}
    >
      {active ? (
        <Heart
          style={{ width: size, height: size }}
          className="text-[#F85826] fill-[#F85826]"
        />
      ) : (
        <Image
          src="/icons/heart.svg"
          width={size}
          height={size - 2}
          alt=""
          unoptimized
        />
      )}
    </button>
  );
}
