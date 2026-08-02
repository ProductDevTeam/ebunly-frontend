"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { useScrollLock } from "@/hooks/use-scroll-lock";

/*
 * Confirmation before something irreversible — deleting an address, removing a
 * saved card. There is no Figma export for this, so it borrows the wishlist
 * dialog's shape: a centred 400px card on desktop, a bottom sheet on mobile.
 *
 * The destructive action is the filled button and carries the red the rest of
 * the app uses for removal (#D90101); Cancel is the quiet one and is what
 * Escape, the backdrop and the close of the sheet all resolve to.
 */
const HAIRLINE = "#EBE5E0";
const INK = "#24201C";
const MUTED = "#6E6659";
const DANGER = "#D90101";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  busy = false,
  onConfirm,
  onCancel,
}) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  const body = (
    <>
      <p className="text-[16px] leading-5 font-medium" style={{ color: INK }}>
        {title}
      </p>
      {message && (
        <p className="mt-2 text-[13px] leading-5" style={{ color: MUTED }}>
          {message}
        </p>
      )}

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="h-11 flex-1 rounded-lg text-[13px] text-white disabled:opacity-60"
          style={{ backgroundColor: DANGER }}
        >
          {busy ? "Working…" : confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="h-11 rounded-lg border px-5 text-[13px]"
          style={{ borderColor: HAIRLINE, color: INK }}
        >
          {cancelLabel}
        </button>
      </div>
    </>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={busy ? undefined : onCancel}
            className="fixed inset-0 z-50 bg-black/25"
          />

          {/* Mobile: bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl border-t bg-[#FDFBF9] px-5 pt-5 md:hidden"
            style={{
              borderColor: HAIRLINE,
              paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
            }}
          >
            <span
              className="mx-auto mb-4 block h-1 w-[37px] rounded-full"
              style={{ backgroundColor: "#E7E0D8" }}
            />
            {body}
          </motion.div>

          {/* Desktop: centred card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="alertdialog"
            aria-modal="true"
            aria-label={title}
            className="fixed top-1/2 left-1/2 z-50 hidden w-100 -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-[#FDFBF9] p-6 md:block"
            style={{ borderColor: HAIRLINE }}
          >
            {body}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
