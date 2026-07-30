"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { useScrollLock } from "@/hooks/use-scroll-lock";
import { useNotification } from "@/components/common/notification-provider";
import {
  useWishlists,
  useCreateWishlist,
  useAddWishlistItem,
} from "@/hooks/use-wishlists";

/*
 * "Add to wishlist" — section 4 of the personalization key-info sheet.
 * Desktop is a centred 400px card, mobile the same content as a bottom sheet
 * with a drag handle and no close button. Three states: list, list + create
 * field, and the empty state ("Name your wishlist to get started"). Confirming
 * fires a dark toast.
 *
 * The rule under a list row is drawn whenever something follows it, which
 * includes the create field but not the "+ Create new wishlist" link.
 *
 * Lists come from GET /wishlists and both actions write straight through, so a
 * host only has to say which product is being saved. Creating a list from here
 * also puts the product in it — that is the whole point of the flow, and the
 * API needs the two calls. `wishlists` stays as a prop so the states harness
 * can render the dialog without a session.
 */
const BRAND = "#D85A30";
const PEACH_BORDER = "#993C1D";
const PEACH_INK = "#712B13";
const HAIRLINE = "#EBE5E0";
const RULE = "#ECE7E0";
const INK = "#24201C";
const MUTED = "#6E6659";
/* The sheet draws all three dialog titles in pure black, not the system ink. */
const TITLE = "#000000";

export default function WishlistModal({
  open,
  productId,
  wishlists: wishlistsProp,
  onClose,
  onAdd,
  onCreate,
  defaultCreating = false,
}) {
  const [creating, setCreating] = useState(defaultCreating);
  const [name, setName] = useState("");
  const [toast, setToast] = useState(null);

  const { error: notifyError } = useNotification();
  const { data: fetched } = useWishlists({ enabled: open && !wishlistsProp });
  const createList = useCreateWishlist();
  const addItem = useAddWishlistItem();

  const wishlists = wishlistsProp ?? fetched ?? [];
  const isEmpty = wishlists.length === 0;
  const busy = createList.isPending || addItem.isPending;

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Clear the draft once the dialog has finished animating out, so reopening
  // starts fresh without resetting state from inside an effect.
  const resetDraft = () => {
    setCreating(false);
    setName("");
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const handleAdd = async (list) => {
    if (busy) return;
    try {
      if (productId) {
        await addItem.mutateAsync({ wishlistId: list.id, productId });
      }
      onAdd?.(list);
      setToast(`Added to ${list.name}`);
      onClose();
    } catch (err) {
      notifyError(err.message, "Could not add to wishlist");
    }
  };

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed || busy) return;
    try {
      const created = await createList.mutateAsync({ name: trimmed });
      if (productId && created?.id) {
        await addItem.mutateAsync({ wishlistId: created.id, productId });
      }
      onCreate?.(created ?? trimmed);
      setToast(`Added to ${trimmed}`);
      setName("");
      setCreating(false);
      onClose();
    } catch (err) {
      notifyError(err.message, "Could not create wishlist");
    }
  };

  // The create field is always shown when there are no lists to pick from.
  const showCreate = creating || isEmpty;

  const body = (showClose) => (
    <>
      <div className="flex items-start justify-between gap-4">
        <p className="text-[16px] leading-5 font-medium" style={{ color: TITLE }}>
          Add to wishlist
        </p>
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="mt-1 shrink-0"
          >
            <X size={16} strokeWidth={1.5} style={{ color: INK }} />
          </button>
        )}
      </div>

      {isEmpty && (
        <p className="mt-2 text-[12px]" style={{ color: MUTED }}>
          Name your wishlist to get started
        </p>
      )}

      {!isEmpty && (
        <ul className="mt-4">
          {wishlists.map((list, i) => (
            <li
              key={list.id}
              className="flex items-center justify-between gap-4 py-2.5"
              style={
                // A rule sits under every row the create field follows, and
                // under every row but the last when it does not.
                i < wishlists.length - 1 || showCreate
                  ? { borderBottom: `1px solid ${RULE}` }
                  : undefined
              }
            >
              <div className="min-w-0">
                <p className="truncate text-[15px] leading-5" style={{ color: INK }}>
                  {list.name}
                </p>
                <p className="text-[11px] leading-4" style={{ color: MUTED }}>
                  {list.itemCount ?? 0} items
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleAdd(list)}
                disabled={busy}
                className="h-7 shrink-0 rounded-full border px-4 text-[12px]"
                style={{ borderColor: PEACH_BORDER, color: PEACH_INK }}
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}

      {!isEmpty && !creating && (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="mt-4 block w-fit text-[12px] leading-4 underline"
          style={{ color: PEACH_INK }}
        >
          + Create new wishlist
        </button>
      )}

      {showCreate && (
        <>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder="e.g My Birthday"
            aria-label="Wishlist name"
            className="mt-4 h-11 w-full rounded-lg border border-transparent bg-white px-3 text-[13px] placeholder:text-[#6E6659] focus:border-[#D85A30] focus:outline-none"
            style={{ color: INK }}
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={!name.trim() || busy}
            className="mt-3 h-11 w-full rounded-lg text-[13px] text-white"
            style={{ backgroundColor: BRAND }}
          >
            Create Wishlist
          </button>
        </>
      )}
    </>
  );

  return (
    <>
      <AnimatePresence onExitComplete={resetDraft}>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/25"
            />

            {/* Mobile: bottom sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Add to wishlist"
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
              {body(false)}
            </motion.div>

            {/* Desktop: centred card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              role="dialog"
              aria-modal="true"
              aria-label="Add to wishlist"
              className="fixed top-1/2 left-1/2 z-50 hidden w-100 -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-[#FDFBF9] p-6 md:block"
              style={{ borderColor: HAIRLINE }}
            >
              {body(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            role="status"
            className="fixed bottom-6 left-1/2 z-60 flex h-7 -translate-x-1/2 items-center rounded-lg bg-[#24201C] px-4 text-[12px] text-white"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
