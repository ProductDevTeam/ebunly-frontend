"use client";

import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, User, Package, LogOut } from "lucide-react";

import { useAuthStore, getDisplayName } from "@/hooks/use-auth-store";
import { hasAuthToken } from "@/hooks/use-profile";
import { useCart } from "@/hooks/use-cart";
import { useLogout } from "@/hooks/use-logout";

const FALLBACK_CATEGORIES = [
  { id: "fashion-accessories", label: "Fashion & Accessories" },
  { id: "beauty-self-care", label: "Beauty & Self Care" },
  { id: "food-treats", label: "Food & Treats" },
  { id: "gift-boxes", label: "Gift Boxes" },
  { id: "home-living", label: "Home & Living" },
  { id: "tech-gadgets", label: "Tech & Gadgets" },
  { id: "baby-child", label: "Baby & Child" },
  { id: "personalized-gifts", label: "Personalized Gifts" },
];

export default function Navbar({
  categories = FALLBACK_CATEGORIES,
  showMobileSearch = true,
}) {
  const [search, setSearch] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const pathname = usePathname();
  const logout = useLogout();

  // Persisted auth state hydrates on the client only — render the
  // logged-out markup during SSR/first paint to avoid a hydration mismatch.
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const user = useAuthStore((s) => s.user);
  // Treat as logged in only when the persisted user AND the auth cookie agree —
  // the cookie is what the proxy gates protected routes on, so this keeps the
  // navbar and route guard from drifting (fixes the profile→login bounce).
  const loggedInUser = hydrated && user && hasAuthToken() ? user : null;
  const displayName = getDisplayName(loggedInUser);

  // Cart badge — facade routes to the server cart when logged in, local store
  // for guests. Gate behind `hydrated` so SSR (empty) matches first paint.
  const cart = useCart();
  const cartCount = hydrated ? cart.totalCount() : 0;

  return (
    <header className="w-full font-sans">
      {/* ── Desktop Main Row ─────────────────────────── */}
      <div className="hidden md:block ">
        <div className="max-w-7xl flex items-center justify-between h-17 mx-auto px-6 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 font-panchang font-semibold text-[16px] text-gray-900 tracking-tight mr-1"
          >
            EBUNLY
          </Link>

          {/* Search + Shopping for an event */}
          <div className="flex items-center gap-5 flex-1 max-w-xl">
            <div className="flex-1">
              <label className="flex items-center gap-2.5 h-9.5 bg-white rounded-md px-4 cursor-text">
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
            <button className="shrink-0 flex items-center gap-1.5 border border-primary text-primary rounded-[9px] px-3.5 font-sans py-1.75 bg-[#FAF5F5] text-sm font-medium tracking-[0] whitespace-nowrap hover:bg-[#FAF6F5] cursor-pointer transition-colors">
              Shopping for an event?
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0 ">
            {/* User */}
            <button className="p-1.5">
              <Image
                src="/icons/heart.svg"
                width={22}
                height={20}
                alt="Wishlist"
              />
            </button>
            <Link href="/cart" className="relative p-1.5" aria-label="Basket">
              <Image src="/icons/shop.svg" width={24} height={24} alt="Basket" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[10px] font-semibold leading-none flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            {loggedInUser ? (
              <div className="relative">
                <button
                  onClick={() => setAccountOpen((o) => !o)}
                  className="flex items-center gap-1.5 p-1.5"
                  aria-label={displayName}
                  aria-expanded={accountOpen}
                >
                  <Image
                    src="/icons/profile.svg"
                    width={24}
                    height={24}
                    alt="Profile"
                  />
                  <span className="max-w-[120px] truncate text-sm font-medium text-gray-900">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {accountOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setAccountOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-20 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1">
                      <Link
                        href="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-500" /> Your Profile
                      </Link>
                      <Link
                        href="/profile/orders"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <Package className="w-4 h-4 text-gray-500" /> Your Orders
                      </Link>
                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 p-1.5"
                aria-label="Sign in"
              >
                <Image
                  src="/icons/profile.svg"
                  width={24}
                  height={24}
                  alt="Profile"
                />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop Secondary Nav ────────────────────── */}
      <div className="hidden md:flex items-center justify-start lg:justify-center gap-8 h-9 px-6 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const isActive = pathname === `/shop/categories/${cat.id}`;
          return (
            <Link
              key={cat.id}
              href={`/shop/categories/${cat.id}`}
              className={`shrink-0 text-sm font-sans transition-colors py-1.5 ${
                isActive
                  ? "font-bold text-[#0C0000]"
                  : "font-medium text-text-dark-gray hover:text-primary"
              }`}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* ── Mobile Header ────────────────────────────── */}
      <div className="md:hidden">
        <div className="flex items-center justify-between h-13.5 px-4 relative">
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
            <Link href="/cart" className="relative p-1.5" aria-label="Basket">
              <Image src="/icons/shop.svg" width={24} height={24} alt="Basket" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[10px] font-semibold leading-none flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <Link
              href={loggedInUser ? "/profile" : "/login"}
              className="p-1.5"
              aria-label={loggedInUser ? displayName : "Sign in"}
            >
              <Image
                src="/icons/profile.svg"
                width={24}
                height={24}
                alt="Profile"
              />
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="px-4 py-2.5 ">
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
        )}
      </div>
    </header>
  );
}
