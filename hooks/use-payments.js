"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiGet, apiPost, apiPatch, apiDelete } from "@/utils/api-fetch";
import { hasAuthToken } from "@/hooks/use-profile";

/*
 * Paystack-backed payments.
 *
 *   GET    /payments/cards                 saved cards (never the auth code)
 *   DELETE /payments/cards/{id}
 *   PATCH  /payments/cards/{id}/default
 *   POST   /payments/initialize            { orderId } → authorization_url
 *   GET    /payments/verify/{reference}    after Paystack redirects back
 *
 * Cards are added by paying, not by a form: Paystack stores the card during
 * checkout and the API surfaces it here afterwards. There is no create-card
 * endpoint, which is why the Payment Methods screen has no add form.
 */

export const paymentKeys = {
  cards: ["payments", "cards"],
  verify: (reference) => ["payments", "verify", reference],
};

/* Brand → the colour chip the Payment Methods export draws beside the number. */
const BRAND_SWATCH = {
  visa: "#1A1F71",
  mastercard: "#EB001B",
  verve: "#2F6B4F",
  amex: "#2E77BC",
};

function two(value) {
  return String(value ?? "").padStart(2, "0");
}

export function normalizeCard(card) {
  if (!card) return null;
  const brand = String(card.brand ?? card.cardType ?? "").toLowerCase();
  const month = card.expMonth ?? card.exp_month ?? card.expiryMonth;
  const year = card.expYear ?? card.exp_year ?? card.expiryYear;

  return {
    id: card._id ?? card.id,
    last4: card.last4 ?? card.lastFour ?? card.last_4 ?? "••••",
    brand,
    // "08/28" — the export's format.
    expires: month && year ? `${two(month)}/${String(year).slice(-2)}` : "",
    isDefault: Boolean(card.isDefault ?? card.default),
    swatch: BRAND_SWATCH[brand] ?? "#B3A392",
  };
}

const unwrap = (res) => res?.data ?? res;

/* A 401 will not become a 200 by asking again — fail straight to the empty state. */
function retryUnlessUnauthorized(failureCount, error) {
  if (/401|unauthor/i.test(error?.message ?? "")) return false;
  return failureCount < 2;
}

export function useSavedCards(options = {}) {
  return useQuery({
    queryKey: paymentKeys.cards,
    queryFn: async () => {
      const data = unwrap(await apiGet("payments/cards"));
      return (Array.isArray(data) ? data : (data?.cards ?? [])).map(
        normalizeCard,
      );
    },
    enabled: hasAuthToken(),
    staleTime: 60 * 1000,
    retry: retryUnlessUnauthorized,
    ...options,
  });
}

function useCardMutation(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: paymentKeys.cards }),
  });
}

export function useDeleteCard() {
  return useCardMutation((id) => apiDelete(`payments/cards/${id}`));
}

export function useSetDefaultCard() {
  return useCardMutation((id) => apiPatch(`payments/cards/${id}/default`));
}

/**
 * Starts a Paystack transaction for an order. Resolves to the checkout URL the
 * caller should send the browser to; Paystack returns to our callback with
 * `?reference=`, which `verifyPayment` then settles.
 */
export function useInitializePayment() {
  return useMutation({
    mutationFn: async (orderId) => {
      const data = unwrap(await apiPost("payments/initialize", { orderId }));
      return {
        authorizationUrl: data?.authorization_url ?? data?.authorizationUrl,
        reference: data?.reference,
        accessCode: data?.access_code ?? data?.accessCode,
      };
    },
  });
}

export async function verifyPayment(reference) {
  return unwrap(await apiGet(`payments/verify/${reference}`));
}

export function useVerifyPayment(reference, options = {}) {
  return useQuery({
    queryKey: paymentKeys.verify(reference),
    queryFn: () => verifyPayment(reference),
    enabled: Boolean(reference),
    // A settled transaction never changes, so never refetch one.
    staleTime: Infinity,
    retry: 2,
    ...options,
  });
}
