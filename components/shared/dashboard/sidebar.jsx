"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/hooks/use-cart-store";

// Reads cart count only after hydration to avoid SSR mismatch
function useCartCount() {
  const [count, setCount] = useState(0);
  const storeCount = useCartStore((s) => s.totalCount());

  useEffect(() => {
    setCount(storeCount);
  }, [storeCount]);

  return count;
}

export default function Sidebar({ isOpen, setIsOpen, visible = true }) {
  const cartCount = useCartCount();

  const pathname = usePathname();
  const isHome = pathname === "/home";
  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  const menuItems = [
    {
      icon: "/icons/home.svg",
      iconActive: "/icons/home-2.svg",
      label: "Home",
      href: "/home",
    },
    {
      icon: "/icons/shop-2.svg",
      iconActive: "/icons/shop.svg",
      label: "Discover",
      href: "/discover",
    },
    {
      icon: "/icons/bag.svg",
      iconActive: "/icons/bag-active.svg",
      label: "Cart",
      href: "/cart",
      badge: cartCount || null,
    },
    {
      icon: "/icons/basket.svg",
      iconActive: "/icons/basket-active.svg",
      label: "For You",
      href: "/profile",
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`${isHome ? "hidden lg:hidden" : "hidden lg:block"} lg:static inset-y-0 left-0 z-50 w-72 pt-20 bg-white font-sans flex-col`}
      >
        <nav className="flex-1 overflow-y-auto pl-16">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center font-sans space-x-3 px-2.5 py-2.5 rounded-lg transition-colors ${
                      active
                        ? "bg-orange-50 text-orange-800"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-6 h-6 relative">
                      <Image
                        src={active ? item.iconActive : item.icon}
                        alt={item.label}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-around px-2 py-2.5 pb-safe">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center space-y-1 min-w-16 py-1 group relative"
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative w-6 h-6 z-10">
                  <Image
                    src={active ? item.iconActive : item.icon}
                    alt={item.label}
                    fill
                    className="object-contain"
                    priority={active}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium z-10 transition-colors ${
                    active ? "text-orange-600" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
                {item.badge && (
                  <motion.span
                    key={item.badge}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute top-0 right-2 z-20 bg-red-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full min-w-[16px] text-center"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <style jsx>{`
        .pb-safe {
          padding-bottom: max(0.625rem, env(safe-area-inset-bottom));
        }
      `}</style>
    </>
  );
}
