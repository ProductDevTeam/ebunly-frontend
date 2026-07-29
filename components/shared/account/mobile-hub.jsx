"use client";

import Link from "next/link";
import { ChevronRight, LogOut } from "lucide-react";

import { ACCOUNT_NAV } from "./account-shell";
import { ACCOUNT_INK, ACCOUNT_MUTED, ACCOUNT_HAIRLINE } from "./ui";

/*
 * The mobile account hub ("Mobile - Profile Page"). Replaces the sidebar below
 * 768px: identity block, then one chevron row per destination on a hairline,
 * a rule, and Logout. No page title — the export draws none.
 */
export default function MobileAccountHub({ user, onLogout }) {
  const name = user?.name ?? "";
  const email = user?.email ?? "";

  return (
    <div className="md:hidden">
      {/* Identity */}
      <div className="flex items-center gap-3 px-1 pb-5">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[18px] font-medium"
          style={{ color: ACCOUNT_INK }}
        >
          {(name || "A").trim().charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p
            className="text-[14px] font-medium truncate"
            style={{ color: ACCOUNT_INK }}
          >
            {name}
          </p>
          <p className="text-[12px] truncate" style={{ color: ACCOUNT_MUTED }}>
            {email}
          </p>
        </div>
      </div>

      {/* Destinations */}
      <nav>
        {ACCOUNT_NAV.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href === "/profile" ? "/profile/account" : href}
            className="flex items-center gap-3 py-4"
            style={{ borderTop: `1px solid ${ACCOUNT_HAIRLINE}` }}
          >
            <Icon size={17} strokeWidth={1.5} style={{ color: ACCOUNT_INK }} />
            <span className="flex-1 text-[14px]" style={{ color: ACCOUNT_INK }}>
              {label}
            </span>
            <ChevronRight
              size={16}
              strokeWidth={1.5}
              style={{ color: ACCOUNT_MUTED }}
            />
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div
        className="mt-4 pt-4"
        style={{ borderTop: `1px solid ${ACCOUNT_HAIRLINE}` }}
      >
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-3 py-2 text-[14px]"
          style={{ color: ACCOUNT_INK }}
        >
          <LogOut size={17} strokeWidth={1.5} style={{ color: ACCOUNT_INK }} />
          Logout
        </button>
      </div>
    </div>
  );
}
