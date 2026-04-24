"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  "Gifts",
  "Jewellery",
  "Fashion & Beauty",
  "Baby & Child",
  "Weddings",
];

export default function Navbar() {
  const [search, setSearch] = useState("");

  return (
    <header className="w-full bg-white font-sans sticky top-0 z-50">
      {/* ── Desktop Main Row ─────────────────────────── */}
      <div className="hidden md:block border-b border-gray-100">
        <div className="flex items-center h-17 max-w-7xl mx-auto px-6 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 font-panchang font-semibold text-[14px] text-gray-900 tracking-tight mr-1"
          >
            EBUNLY
          </Link>

          {/* Categories */}
          <button className="shrink-0 flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors">
            <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
              <rect width="16" height="1.8" rx="0.9" fill="currentColor" />
              <rect
                y="4.6"
                width="16"
                height="1.8"
                rx="0.9"
                fill="currentColor"
              />
              <rect
                y="9.2"
                width="16"
                height="1.8"
                rx="0.9"
                fill="currentColor"
              />
            </svg>
            Categories
          </button>

          {/* Search */}
          <div className="flex-1 max-w-125 mx-3">
            <label className="flex items-center gap-2.5 h-9.5 bg-white border border-gray-200 rounded-md px-4 cursor-text">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search for anything..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none min-w-0"
              />
            </label>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 ml-auto shrink-0">
            {/* Shopping for an event */}
            <button className="flex items-center gap-1.5 border border-primary text-primary rounded-[9px] px-3.5 font-sans py-1.75 bg-[#FAF5F5] text-sm font-medium tracking-[0] whitespace-nowrap hover:bg-[#FAF6F5] cursor-pointer transition-colors mr-2">
              Shopping for an event?
            </button>

            {/* User */}
            <button className="p-1.5">
              <Image
                src="/icons/heart.svg"
                width={22}
                height={20}
                alt="Wishlist"
              />
            </button>
            <button className="p-1.5">
              <Image src="/icons/shop.svg" width={24} height={24} alt="Shop" />
            </button>
            <button className="p-1.5">
              <Image
                src="/icons/profile.svg"
                width={24}
                height={24}
                alt="Profile"
              />
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop Secondary Nav ────────────────────── */}
      <div className="hidden md:flex items-center justify-center gap-8 h-9 border-b border-gray-100">
        {NAV_LINKS.map((item) => (
          <Link
            key={item}
            href="/discover"
            className="text-sm font-sans font-medium text-text-dark-gray hover:text-primary transition-colors py-1.5"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* ── Mobile Header ────────────────────────────── */}
      <div className="md:hidden">
        <div className="flex items-center justify-between h-13.5 px-4 border-b border-gray-100 relative">
          {/* Hamburger */}
          <div className="flex gap-2 items-center">
            <button className="p-1.5">
              <Image src="/icons/menu.svg" width={25} height={25} alt="Menu" />
            </button>
            {/* Logo centered */}
            <Link
              href="/"
              className="font-panchang font-bold text-[20px] leading-[100%] text-gray-900 tracking-tight"
            >
              EBUNLY
            </Link>
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            <button className="p-1.5">
              <Image
                src="/icons/heart.svg"
                width={22}
                height={20}
                alt="Wishlist"
              />
            </button>
            <button className="p-1.5">
              <Image src="/icons/shop.svg" width={24} height={24} alt="Shop" />
            </button>
            <button className="p-1.5">
              <Image
                src="/icons/profile.svg"
                width={24}
                height={24}
                alt="Profile"
              />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-4 py-2.5 border-b border-gray-100">
          <label className="flex items-center gap-2.5 h-9 bg-white border border-gray-200 rounded-md px-4 cursor-text">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search for anything..."
              className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none"
            />
          </label>
        </div>
      </div>
    </header>
  );
}
