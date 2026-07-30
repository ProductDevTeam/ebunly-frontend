"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Gift,
  LogOut,
  ArrowLeft,
} from "lucide-react";

/*
 * Shared chrome for the account area, measured from the 1440 exports.
 *
 * The content column is the site-wide 1200px (max-w-308 + px-4): a 242px
 * sidebar, a 64px gutter, then 894px of content. Nav items sit on a 44px pitch
 * with no gap; the active one is white with a 2px #D85A30 left bar that lines
 * up with the container's left edge.
 */
const INK = "#24201C";
const MUTED = "#6E6659";
const HAIRLINE = "#F2EDE8";

export const ACCOUNT_NAV = [
  { label: "My Account", href: "/profile", icon: User },
  { label: "Orders", href: "/profile/orders", icon: Package },
  { label: "Addresses", href: "/profile/addresses", icon: MapPin },
  { label: "Payment Methods", href: "/profile/payment-methods", icon: CreditCard },
  { label: "Wishlists", href: "/profile/wishlists", icon: Gift },
];

function initialOf(name) {
  return (name ?? "").trim().charAt(0).toUpperCase() || "A";
}

export default function AccountShell({
  title,
  titleAfter,
  backHref,
  user,
  onLogout,
  children,
}) {
  const pathname = usePathname();
  const name = user?.name ?? "";
  const email = user?.email ?? "";

  return (
    <div className="bg-[#FDFBF9] min-h-screen">
      <div className="max-w-308 mx-auto px-4 pt-8 pb-16 md:flex md:gap-16">
        {/*
         * Sidebar is desktop-only. The mobile frames drop it entirely — the
         * nav lives on the hub screen (MobileAccountHub) and every detail
         * screen is just a back arrow over full-width content.
         */}
        <aside className="hidden md:block md:w-[242px] md:shrink-0">
          {/* Identity */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[18px] font-medium"
              style={{ color: INK }}
            >
              {initialOf(name)}
            </span>
            <div className="min-w-0">
              <p
                className="text-[13px] font-medium truncate"
                style={{ color: INK }}
              >
                {name}
              </p>
              <p className="text-[11px] truncate" style={{ color: MUTED }}>
                {email}
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="block">
            {ACCOUNT_NAV.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-11 shrink-0 items-center gap-3 whitespace-nowrap px-4 text-[13px] md:px-4 ${
                    active
                      ? "bg-white md:border-l-2"
                      : "border-l-2 border-transparent"
                  }`}
                  style={{
                    color: INK,
                    borderLeftColor: active ? "#D85A30" : "transparent",
                  }}
                >
                  <Icon size={16} strokeWidth={1.5} style={{ color: MUTED }} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div
            className="hidden md:block mt-4 border-t pt-4"
            style={{ borderColor: HAIRLINE }}
          >
            <button
              type="button"
              onClick={onLogout}
              className="flex h-11 w-full items-center gap-3 px-4 text-[13px]"
              style={{ color: INK }}
            >
              <LogOut size={16} strokeWidth={1.5} style={{ color: MUTED }} />
              Logout
            </button>
          </div>
        </aside>

        {/* ── Content ─────────────────────────────────────── */}
        <section className="flex-1 min-w-0">
          {/*
           * Mobile margin is the tightest the exports draw (Addresses and
           * Payment Methods both put content 26px under the title ink). Orders
           * and Order details draw 36px and 41px, so those two add their own
           * top padding — the frames disagree, they are not derived values.
           */}
          <div className="mb-1.5 flex items-center gap-2 md:mb-6 md:gap-3">
            {/*
             * Mobile always gets a back arrow to the hub; on desktop it only
             * appears where the export draws one (order detail, edit photo).
             */}
            <Link
              href={backHref ?? "/profile"}
              aria-label="Back"
              className={backHref ? "" : "md:hidden"}
            >
              <ArrowLeft size={18} strokeWidth={1.5} style={{ color: INK }} />
            </Link>
            <h1
              className="font-playfair italic text-[22px] md:text-[34px]"
              style={{ fontWeight: 500, color: INK, letterSpacing: "-2%" }}
            >
              {title}
            </h1>
            {titleAfter}
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
