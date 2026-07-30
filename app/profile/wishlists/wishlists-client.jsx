"use client";

import { useState } from "react";
import { Check, Copy, Trash2 } from "lucide-react";

import AccountPage from "@/components/shared/account/account-page";
import {
  AccountCard,
  AccountColumn,
  OutlinePill,
  ACCOUNT_INK,
  ACCOUNT_MUTED,
} from "@/components/shared/account/ui";
import WishlistModal from "@/components/shared/dashboard/product-detail/wishlist-modal";
import { useNotification } from "@/components/common/notification-provider";
import {
  useWishlists,
  useUpdateWishlist,
  useDeleteWishlist,
} from "@/hooks/use-wishlists";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  ACCOUNT_BRAND,
  ACCOUNT_HAIRLINE,
} from "@/components/shared/account/ui";

/** "Jul 24, 2026" — the format the Wishlists export draws. */
function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export default function WishlistsClient() {
  const [creating, setCreating] = useState(false);
  const [managing, setManaging] = useState(null);
  const [draftName, setDraftName] = useState("");
  const [copied, setCopied] = useState(null);

  const hydrated = useHydrated();
  const { data, isLoading } = useWishlists();
  const updateList = useUpdateWishlist();
  const deleteList = useDeleteWishlist();
  const { success: notifySuccess, error: notifyError } = useNotification();

  const wishlists = data ?? [];
  const busy = updateList.isPending || deleteList.isPending;

  const openManage = (list) => {
    setManaging(managing === list.id ? null : list.id);
    setDraftName(list.name);
  };

  const rename = async (list) => {
    const name = draftName.trim();
    if (!name || name === list.name) return setManaging(null);
    try {
      await updateList.mutateAsync({ id: list.id, name });
      setManaging(null);
      notifySuccess("Wishlist renamed.", "Saved");
    } catch (err) {
      notifyError(err.message, "Could not rename wishlist");
    }
  };

  const toggleVisibility = async (list) => {
    try {
      await updateList.mutateAsync({ id: list.id, isPublic: !list.isPublic });
      notifySuccess(
        list.isPublic
          ? "Wishlist is now private."
          : "Wishlist is now shareable.",
        "Saved",
      );
    } catch (err) {
      notifyError(err.message, "Could not change visibility");
    }
  };

  const remove = async (list) => {
    try {
      await deleteList.mutateAsync(list.id);
      setManaging(null);
      notifySuccess("Wishlist deleted.", "Deleted");
    } catch (err) {
      notifyError(err.message, "Could not delete wishlist");
    }
  };

  const copyLink = async (list) => {
    if (!list.shareUrl) return;
    try {
      await navigator.clipboard.writeText(`https://${list.shareUrl}`);
      setCopied(list.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      notifyError("Copy the link from the address shown.", "Clipboard blocked");
    }
  };

  return (
    <AccountPage title="Wishlists">
      <OutlinePill className="mb-5" onClick={() => setCreating(true)}>
        + Create new
      </OutlinePill>

      {!hydrated || isLoading ? (
        <p className="text-[13px]" style={{ color: ACCOUNT_MUTED }}>
          Loading your wishlists…
        </p>
      ) : wishlists.length === 0 ? (
        <p className="text-[13px]" style={{ color: ACCOUNT_MUTED }}>
          You have no wishlists yet.
        </p>
      ) : (
        <AccountColumn>
          {wishlists.map((list) => (
            <AccountCard key={list.id}>
              <div className="flex items-start justify-between gap-4">
                <p
                  className="text-[14px] font-medium"
                  style={{ color: ACCOUNT_INK }}
                >
                  {list.name}
                </p>
                <p
                  className="shrink-0 text-[13px]"
                  style={{ color: ACCOUNT_MUTED }}
                >
                  {formatDate(list.createdAt)}
                </p>
              </div>

              <p className="mt-1.5 text-[13px]" style={{ color: ACCOUNT_INK }}>
                {list.fundedCount ?? 0} of {list.itemCount ?? 0} items funded
              </p>

              <div className="mt-3 flex items-center justify-between gap-4">
                <p
                  className="min-w-0 truncate text-[12px]"
                  style={{ color: ACCOUNT_MUTED }}
                >
                  {list.shareUrl ?? ""}
                </p>

                <div className="flex shrink-0 items-center gap-2">
                  {/* No contributor list comes back yet, so the avatar stack
                      renders only once one does. */}
                  {list.contributors > 0 && (
                    <span className="flex items-center">
                      {Array.from({ length: list.contributors }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-5 w-5 rounded-full bg-[#D9D5D0] ${i > 0 ? "-ml-1.5" : ""}`}
                        />
                      ))}
                    </span>
                  )}
                  {list.shareUrl && (
                    <button
                      type="button"
                      onClick={() => copyLink(list)}
                      aria-label={`Copy link to ${list.name}`}
                      title="Copy share link"
                    >
                      {copied === list.id ? (
                        <Check
                          size={15}
                          strokeWidth={1.75}
                          style={{ color: ACCOUNT_BRAND }}
                        />
                      ) : (
                        <Copy
                          size={15}
                          strokeWidth={1.5}
                          style={{ color: ACCOUNT_MUTED }}
                        />
                      )}
                    </button>
                  )}
                  <OutlinePill onClick={() => openManage(list)}>
                    Manage
                  </OutlinePill>
                </div>
              </div>

              {/* Rename, visibility and delete — all of PUT/DELETE /wishlists.
                  There is no design for a manage screen, so it opens in place
                  rather than inventing one. */}
              {managing === list.id && (
                <div
                  className="mt-3 border-t pt-3"
                  style={{ borderColor: ACCOUNT_HAIRLINE }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && rename(list)}
                      aria-label="Wishlist name"
                      className="h-9 min-w-0 flex-1 rounded-lg border border-transparent bg-white px-3 text-[13px] focus:border-[#D85A30] focus:outline-none"
                      style={{ color: ACCOUNT_INK }}
                    />
                    <button
                      type="button"
                      onClick={() => rename(list)}
                      disabled={busy}
                      className="h-9 rounded-lg px-3 text-[12px] text-white"
                      style={{ backgroundColor: ACCOUNT_BRAND }}
                    >
                      Save
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => toggleVisibility(list)}
                      disabled={busy}
                      className="text-[12px] underline"
                      style={{ color: ACCOUNT_MUTED }}
                    >
                      {list.isPublic ? "Make private" : "Make shareable"}
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(list)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 text-[12px]"
                      style={{ color: "#D90101" }}
                    >
                      <Trash2 size={13} strokeWidth={1.5} />
                      Delete wishlist
                    </button>
                  </div>
                </div>
              )}
            </AccountCard>
          ))}
        </AccountColumn>
      )}

      {/* The same dialog as the product page, with no product to attach. */}
      <WishlistModal
        open={creating}
        defaultCreating
        onClose={() => setCreating(false)}
      />
    </AccountPage>
  );
}
