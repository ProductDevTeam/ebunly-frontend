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
import { useNotification } from "@/components/common/notification-provider";
import {
  useSavedCards,
  useDeleteCard,
  useSetDefaultCard,
} from "@/hooks/use-payments";
import { useHydrated } from "@/hooks/use-hydrated";

export default function PaymentMethodsClient() {
  const { error: notifyError } = useNotification();
  const hydrated = useHydrated();
  const { data, isLoading } = useSavedCards();
  const deleteCard = useDeleteCard();
  const setDefault = useSetDefaultCard();

  const methods = data ?? [];

  const remove = (method) =>
    deleteCard.mutate(method.id, {
      onError: (err) => notifyError(err.message, "Could not remove card"),
    });

  return (
    <AccountPage title="Payment Methods">
      {/* Left inert, as it was: Paystack saves a card during checkout and there
          is no add-card endpoint to call from here. The empty state says so. */}
      <OutlinePill className="mb-5">+ Add new payment method</OutlinePill>

      {!hydrated || isLoading ? (
        <p className="text-[13px]" style={{ color: ACCOUNT_MUTED }}>
          Loading your cards…
        </p>
      ) : methods.length === 0 ? (
        <p className="text-[13px]" style={{ color: ACCOUNT_MUTED }}>
          No saved cards yet. Cards you pay with are saved here automatically.
        </p>
      ) : (
        <AccountColumn>
          {methods.map((method) => (
            <AccountCard key={method.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  {method.isDefault ? (
                    <div className="mb-2 flex">
                      <StatusChip>Default</StatusChip>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        setDefault.mutate(method.id, {
                          onError: (err) =>
                            notifyError(err.message, "Could not set default"),
                        })
                      }
                      className="mb-2 block text-[12px] underline"
                      style={{ color: ACCOUNT_MUTED }}
                    >
                      Set as default
                    </button>
                  )}

                  <div className="flex items-center gap-3">
                    <span
                      className="h-4.5 w-7 shrink-0 rounded"
                      style={{ backgroundColor: method.swatch }}
                    />
                    <p
                      className="text-[14px] leading-4.5 font-medium"
                      style={{ color: ACCOUNT_INK }}
                    >
                      •••• •••• •••• {method.last4}
                    </p>
                  </div>

                  {method.expires && (
                    <p
                      className="mt-1 pl-10 text-[13px] leading-4.5"
                      style={{ color: ACCOUNT_MUTED }}
                    >
                      Expires {method.expires}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => remove(method)}
                  disabled={deleteCard.isPending}
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
      )}
    </AccountPage>
  );
}
