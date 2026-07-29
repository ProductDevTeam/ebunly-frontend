"use client";

import { Trash2 } from "lucide-react";

import AccountPage from "@/components/shared/account/account-page";
import {
  AccountCard,
  AccountColumn,
  OutlinePill,
  StatusChip,
  ACCOUNT_INK,
  ACCOUNT_MUTED,
} from "@/components/shared/account/ui";
import { mockPaymentMethods } from "@/lib/mock-account";

export default function PaymentMethodsClient() {
  return (
    <AccountPage title="Payment Methods">
      <OutlinePill className="mb-5">+ Add new payment method</OutlinePill>

      <AccountColumn>
        {mockPaymentMethods.map((method) => (
          <AccountCard key={method.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {method.isDefault && (
                  <div className="mb-2 flex">
                    <StatusChip>Default</StatusChip>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <span
                    className="h-[18px] w-7 shrink-0 rounded"
                    style={{ backgroundColor: method.swatch }}
                  />
                  <p
                    className="text-[14px] leading-4.5 font-medium"
                    style={{ color: ACCOUNT_INK }}
                  >
                    •••• •••• •••• {method.last4}
                  </p>
                </div>

                <p
                  className="mt-1 pl-10 text-[13px] leading-4.5"
                  style={{ color: ACCOUNT_MUTED }}
                >
                  Expires {method.expires}
                </p>
              </div>

              <button
                type="button"
                aria-label={`Delete card ending ${method.last4}`}
                className="shrink-0"
              >
                <Trash2
                  size={16}
                  strokeWidth={1.5}
                  style={{ color: ACCOUNT_INK }}
                />
              </button>
            </div>
          </AccountCard>
        ))}
      </AccountColumn>
    </AccountPage>
  );
}
