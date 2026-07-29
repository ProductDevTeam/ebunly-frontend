"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, LogOut, Package, User } from "lucide-react";

import { useScrollLock } from "@/hooks/use-scroll-lock";

/*
 * Measured from the Figma exports (1x):
 *   design screenshots/Profile dropdown.png         220 × 222
 *   design screenshots/Profile dropdown - mobile.png 361 × 287
 *
 * Shared tokens: surface #FDFBF9, hairline #F2EDE8, ink #24201C.
 * The exports render each item's icon as a flat #D9D9D9 circle (an unrendered
 * Figma component), so the closest lucide match is used at the measured box.
 */
const SURFACE = "#FDFBF9";
const HAIRLINE = "#F2EDE8";
const INK = "#24201C";

const LINKS = [
  { href: "/profile", desktop: "My account", mobile: "Account", Icon: User },
  { href: "/profile/orders", desktop: "Orders", mobile: "Orders", Icon: Package },
  { href: "/favorites", desktop: "Wishlists", mobile: "Wishlists", Icon: Heart },
];

/** Desktop — 220px card anchored under the account button. */
export function AccountDropdown({ firstName, onClose, onLogout }) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        className="absolute right-0 top-full mt-2 z-20 w-[220px] rounded-xl border overflow-hidden"
        style={{ backgroundColor: SURFACE, borderColor: HAIRLINE }}
      >
        <p
          className="flex items-center h-12 px-5 text-[13px] font-medium"
          style={{ color: INK }}
        >
          Hi, {firstName}
        </p>

        <div className="mx-2 h-px" style={{ backgroundColor: HAIRLINE }} />

        <div className="pt-[5px]">
          {LINKS.map(({ href, desktop, Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="flex items-center gap-2.5 h-[38px] px-5 text-[13px]"
              style={{ color: INK }}
            >
              <Icon size={15} strokeWidth={1.5} className="shrink-0" />
              {desktop}
            </Link>
          ))}
        </div>

        <div className="mx-2 h-px" style={{ backgroundColor: HAIRLINE }} />

        <div className="pt-[6px] pb-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center gap-2.5 h-[38px] px-5 text-[13px] text-left"
            style={{ color: INK }}
          >
            <LogOut size={15} strokeWidth={1.5} className="shrink-0" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

/** Mobile — bottom sheet with a drag handle. */
export function AccountSheet({ open, firstName, onClose, onLogout }) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const rows = [
    ...LINKS.map(({ href, mobile, Icon }) => ({ href, label: mobile, Icon })),
    { label: "Logout", Icon: LogOut, action: onLogout },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="md:hidden fixed inset-0 z-40 bg-black/25"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Account menu"
            className="md:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t pt-4 overflow-hidden"
            style={{
              backgroundColor: SURFACE,
              borderColor: HAIRLINE,
              // Design spec is 13px; add the home-indicator inset on top so the
              // sheet can sit flush against the bottom edge.
              paddingBottom: "calc(13px + env(safe-area-inset-bottom))",
            }}
          >
            <span
              className="block mx-auto w-[37px] h-1 rounded-full"
              style={{ backgroundColor: "#E7E0D8" }}
            />

            <p
              className="mt-[18px] px-5 text-[14px] font-semibold"
              style={{ color: INK }}
            >
              Hi, {firstName}
            </p>

            <div className="mt-[11px]">
              {rows.map(({ href, label, Icon, action }, i) => {
                const content = (
                  <>
                    <Icon size={18} strokeWidth={1.5} className="shrink-0" />
                    {label}
                  </>
                );
                const rowClass =
                  "w-full flex items-center gap-[13px] h-[51px] px-5 text-[15px] text-left";

                return (
                  <div key={label}>
                    {i > 0 && (
                      <div
                        className="mx-5 h-px"
                        style={{ backgroundColor: HAIRLINE }}
                      />
                    )}
                    {href ? (
                      <Link
                        href={href}
                        onClick={onClose}
                        className={rowClass}
                        style={{ color: INK }}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          action();
                        }}
                        className={rowClass}
                        style={{ color: INK }}
                      >
                        {content}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
