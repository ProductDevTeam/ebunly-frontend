"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

import { useAuthStore, getDisplayName } from "@/hooks/use-auth-store";
import { hasAuthToken, useMe } from "@/hooks/use-profile";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useLogout } from "@/hooks/use-logout";
import { AccountDropdown, AccountSheet } from "./account-menu";
import MobileMenu from "./mobile-menu";
import SearchSuggestions from "./search-suggestions";
import SearchOverlay from "./search-overlay";

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
  // Desktop shows the suggestion panel as an anchored dropdown; mobile opens
  // the full-screen overlay the two mobile frames draw.
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef(null);
  // Desktop uses an anchored dropdown, mobile a bottom sheet — separate state
  // so the mobile sheet's scroll lock can't fire from a desktop click.
  const [accountOpen, setAccountOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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

  // Favorites badge — local wishlist store, gated on hydration.
  const wishlist = useWishlist();
  const wishCount = hydrated ? wishlist.count() : 0;

  // The account menus greet by first name — prefer the fetched profile, fall
  // back to whatever the persisted auth store has.
  const { data: meData } = useMe();
  const firstName = meData?.firstName || displayName;

  // Close the desktop suggestion dropdown on an outside click.
  useEffect(() => {
    if (!searchOpen) return undefined;
    const onPointerDown = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [searchOpen]);

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
            <div className="relative flex-1" ref={searchRef}>
              <label className="flex items-center gap-2.5 h-9.5 bg-white border-[#E7E0D8] rounded-full px-4 border cursor-text">
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
                  onFocus={() => setSearchOpen(true)}
                  className="flex-1 text-sm text-gray-900 placeholder:text-gray-400 
                   bg-transparent focus:outline-none min-w-0"
                />
              </label>

              {searchOpen && (
                <div className="absolute top-full right-0 left-0 z-50 mt-2 rounded-2xl border border-[#F2EDE8] bg-white p-5">
                  <SearchSuggestions
                    query={search}
                    categories={categories}
                    onPick={setSearch}
                    onNavigate={() => setSearchOpen(false)}
                  />
                </div>
              )}
            </div>
            <button className="shrink-0 flex items-center gap-1.5 border border-[#993C1D] text-[#993C1D] rounded-full px-3.5 font-sans py-1.5 bg-[#FAF5F5] text-sm font-medium tracking-[0] whitespace-nowrap hover:bg-[#FAF6F5] cursor-pointer transition-colors **:">
              Shopping for an event?
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0 ">
            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative p-1.5"
              aria-label="Favorites"
            >
              <Image
                src="/icons/heart.svg"
                width={22}
                height={20}
                alt="Favorites"
              />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[10px] font-semibold leading-none flex items-center justify-center">
                  {wishCount > 99 ? "99+" : wishCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative p-1.5" aria-label="Basket">
              <Image
                src="/icons/shop.svg"
                width={24}
                height={24}
                alt="Basket"
              />
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
                  <AccountDropdown
                    firstName={firstName}
                    onClose={() => setAccountOpen(false)}
                    onLogout={logout}
                  />
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
            <button
              className="p-1.5"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
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
            <Link
              href="/favorites"
              className="relative p-1.5"
              aria-label="Favorites"
            >
              <Image
                src="/icons/heart.svg"
                width={22}
                height={20}
                alt="Favorites"
              />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[10px] font-semibold leading-none flex items-center justify-center">
                  {wishCount > 99 ? "99+" : wishCount}
                </span>
              )}
            </Link>
            <Link href="/cart" className="relative p-1.5" aria-label="Basket">
              <Image
                src="/icons/shop.svg"
                width={24}
                height={24}
                alt="Basket"
              />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[10px] font-semibold leading-none flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            {loggedInUser ? (
              <button
                onClick={() => setSheetOpen(true)}
                className="p-1.5 flex items-center"
                aria-label={displayName}
                aria-expanded={sheetOpen}
              >
                <Image
                  src="/icons/profile.svg"
                  width={24}
                  height={24}
                  alt="Profile"
                />
              </button>
            ) : (
              <Link href="/login" className="p-1.5" aria-label="Sign in">
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

        {/* Mobile Search */}
        {showMobileSearch && (
          <div className="px-4 py-2.5 ">
            <button
              type="button"
              onClick={() => setMobileSearchOpen(true)}
              className="flex w-full items-center gap-2.5 h-9 bg-white border border-gray-200 rounded-md px-4 text-left">
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
              <span className="flex-1 text-sm text-gray-400">
                Search for anything...
              </span>
            </button>
          </div>
        )}

        {/* Mobile overlays — both are `fixed`, so position here is irrelevant */}
        {mobileSearchOpen && (
          <SearchOverlay
            onClose={() => setMobileSearchOpen(false)}
            categories={categories}
          />
        )}
        <AccountSheet
          open={sheetOpen}
          firstName={firstName}
          onClose={() => setSheetOpen(false)}
          onLogout={logout}
        />
        <MobileMenu
          open={menuOpen}
          categories={categories}
          onClose={() => setMenuOpen(false)}
        />
      </div>
    </header>
  );
}
