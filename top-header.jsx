"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function TopHeader() {
  return (
    <div className="hidden md:flex w-full bg-white border-b border-gray-100 font-sans">
      {/* Inner content constrained */}
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

        {/* Right: Cart & Sign Up */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-5 h-5 relative">
              <Image
                src="/icons/bag.svg"
                alt="Cart"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-sm font-medium">Cart</span>
          </button>

          <button className="px-14 py-2.5 bg-primary hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
