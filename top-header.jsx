"use client";

import Image from "next/image";
import Link from "next/link";
import { useMe } from "@/hooks/use-profile";

export default function TopHeader() {
  const { data, isLoading } = useMe();
  const user = data?.data;
  const isLoggedIn = !!user;

  return (
    <div className="hidden md:flex w-full bg-white border-b border-gray-100 font-sans">
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
          <Link
            href="/cart"
            className="flex items-center gap-2 px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-5 h-5 relative">
              <Image
                src="/icons/bag.svg"
                alt="Cart"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-medium">Cart</span>
          </Link>

          {isLoading ? (
            /* Skeleton to avoid layout shift */
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
                className="px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/sign-up"
                className="px-14 py-2.5 bg-primary hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
