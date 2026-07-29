"use client";

import { useState } from "react";

import AccountPage from "@/components/shared/account/account-page";
import {
  AccountCard,
  AccountColumn,
  OutlinePill,
  ACCOUNT_INK,
  ACCOUNT_MUTED,
} from "@/components/shared/account/ui";
import WishlistModal from "@/components/shared/dashboard/product-detail/wishlist-modal";
import { useWishlists } from "@/hooks/use-wishlists";

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

export default function WishlistsClient({ mockWishlists = null }) {
  const [creating, setCreating] = useState(false);
  const { data, isLoading } = useWishlists({ enabled: !mockWishlists });

  const wishlists = mockWishlists ?? data ?? [];

  return (
    <AccountPage title="Wishlists">
      <OutlinePill className="mb-5" onClick={() => setCreating(true)}>
        + Create new
      </OutlinePill>

      {isLoading && !mockWishlists ? (
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
                  <OutlinePill>Manage</OutlinePill>
                </div>
              </div>
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
