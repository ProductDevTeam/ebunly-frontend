"use client";

import AccountPage from "@/components/shared/account/account-page";
import {
  AccountCard,
  AccountColumn,
  OutlinePill,
  ACCOUNT_INK,
  ACCOUNT_MUTED,
} from "@/components/shared/account/ui";
import { mockWishlists } from "@/lib/mock-account";

export default function WishlistsClient() {
  return (
    <AccountPage title="Wishlists">
      <OutlinePill className="mb-5">+ Create new</OutlinePill>

      <AccountColumn>
        {mockWishlists.map((list) => (
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
                {list.date}
              </p>
            </div>

            <p className="mt-1.5 text-[13px]" style={{ color: ACCOUNT_INK }}>
              {list.funded} of {list.total} items funded
            </p>

            <div className="mt-3 flex items-center justify-between gap-4">
              <p
                className="min-w-0 truncate text-[12px]"
                style={{ color: ACCOUNT_MUTED }}
              >
                {list.url}
              </p>

              <div className="flex shrink-0 items-center gap-2">
                <span className="flex items-center">
                  {Array.from({ length: list.contributors }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-5 w-5 rounded-full bg-[#D9D5D0] ${i > 0 ? "-ml-1.5" : ""}`}
                    />
                  ))}
                </span>
                <OutlinePill>Manage</OutlinePill>
              </div>
            </div>
          </AccountCard>
        ))}
      </AccountColumn>
    </AccountPage>
  );
}
