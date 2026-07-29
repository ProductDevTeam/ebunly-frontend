"use client";

import { Pencil, Trash2 } from "lucide-react";

import AccountPage from "@/components/shared/account/account-page";
import {
  AccountCard,
  AccountColumn,
  OutlinePill,
  StatusChip,
  ACCOUNT_INK,
  ACCOUNT_MUTED,
} from "@/components/shared/account/ui";
import { mockAddresses } from "@/lib/mock-account";

export default function AddressesClient() {
  return (
    <AccountPage title="Addresses">
      <OutlinePill className="mb-5">+ Add new address</OutlinePill>

      <AccountColumn>
        {mockAddresses.map((address) => (
          <AccountCard key={address.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {address.isDefault && (
                  <div className="mb-2 flex">
                    <StatusChip>Default</StatusChip>
                  </div>
                )}
                <p
                  className="text-[14px] leading-4.5 font-medium"
                  style={{ color: ACCOUNT_INK }}
                >
                  {address.label}
                </p>
                <p
                  className="mt-1 text-[13px] leading-4.5"
                  style={{ color: ACCOUNT_MUTED }}
                >
                  {address.line}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button type="button" aria-label={`Edit ${address.label}`}>
                  <Pencil
                    size={16}
                    strokeWidth={1.5}
                    style={{ color: ACCOUNT_INK }}
                  />
                </button>
                <button type="button" aria-label={`Delete ${address.label}`}>
                  <Trash2
                    size={16}
                    strokeWidth={1.5}
                    style={{ color: ACCOUNT_INK }}
                  />
                </button>
              </div>
            </div>
          </AccountCard>
        ))}
      </AccountColumn>
    </AccountPage>
  );
}
