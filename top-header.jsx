"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMe } from "@/hooks/use-profile";
import { useCartStore } from "@/hooks/use-cart-store";

export default function TopHeader() {
  const { data, isLoading } = useMe();
  const user = data?.data;
  const isLoggedIn = !!user;

  const { totalCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const cartCount = mounted ? totalCount() : 0;

  return (
    <div className="hidden md:flex w-full bg-white font-sans">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 py-1">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="Ebunly Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </Link>

        {/* Center: Live Basket */}
        <div className="flex items-center gap-2 bg-white hover:bg-gray-100 py-2.5 px-4 rounded-2xl cursor-pointer transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-sm font-semibold text-gray-900">
            Live Basket
          </span>
        </div>

        {/* Right: Cart & Auth */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-center gap-2 px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors relative"
          >
            <div className="relative w-5 h-5">
              <Image
                src="/icons/bag.svg"
                alt="Cart"
                fill
                className="object-contain"
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            <span className="text-sm font-medium">Cart</span>
          </Link>

          {/* Auth — show skeleton only while loading, but keep layout stable */}
          {isLoading ? (
            <div className="w-32 h-9 bg-gray-100 animate-pulse rounded-lg" />
          ) : isLoggedIn ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {user.avatarUrl ? (
                <div className="w-7 h-7 relative rounded-full overflow-hidden">
                  <Image
                    src={user.avatarUrl}
                    alt={user.firstName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                  {(user.firstName?.[0] ?? "U").toUpperCase()}
                </div>
              )}
              <span className="text-sm font-medium text-gray-900">
                {user.firstName}
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-14 py-2.5 bg-primary hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Log In
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
