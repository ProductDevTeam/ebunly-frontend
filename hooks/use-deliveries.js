"use client";

import { useQuery } from "@tanstack/react-query";

import { apiGet } from "@/utils/api-fetch";

/*
 * Kwik-backed delivery.
 *
 *   GET /deliveries/cost?state=&vendors=   quote for checkout
 *   GET /deliveries/status/{orderNo}       live job status for a placed order
 *
 * `vendors` is the number of distinct vendors in the basket, because each one
 * is a separate pickup.
 *
 * The quote is treated as best-effort on purpose. As of 2026-07-29 the endpoint
 * answers 500 for every request — the API cannot resolve its Kwik staging host
 * ("Kwik vendor_login: getaddrinfo ENOTFOUND staging-api-test.kwik.delivery") —
 * so `unavailable` is the normal path today and checkout must stay usable
 * without a figure. Do not turn this into a blocking error.
 */

export const deliveryKeys = {
  cost: (state, vendors) => ["deliveries", "cost", state, vendors],
  status: (orderNo) => ["deliveries", "status", orderNo],
};

const unwrap = (res) => res?.data ?? res;

/** Distinct vendors across cart lines — one pickup each. */
export function countVendors(items = []) {
  const ids = new Set();
  items.forEach((item) => {
    const vendor = item.vendor ?? item.product?.vendor;
    const id =
      typeof vendor === "object" ? (vendor?._id ?? vendor?.id) : vendor;
    if (id) ids.add(String(id));
  });
  return ids.size || 1;
}

export function useDeliveryCost(state, vendors = 1) {
  const trimmed = (state ?? "").trim();

  const query = useQuery({
    queryKey: deliveryKeys.cost(trimmed, vendors),
    queryFn: async () => {
      const data = unwrap(
        await apiGet(
          `deliveries/cost?state=${encodeURIComponent(trimmed)}&vendors=${vendors}`,
        ),
      );
      const cost = data?.cost ?? data?.amount ?? data?.total;
      return typeof cost === "number" ? cost : null;
    },
    enabled: trimmed.length > 1,
    staleTime: 5 * 60 * 1000,
    // One retry, then fall back — a quote is not worth stalling checkout for.
    retry: 1,
  });

  return {
    cost: query.data ?? null,
    isLoading: query.isLoading,
    unavailable: query.isError || (query.isSuccess && query.data == null),
  };
}

export function useDeliveryStatus(orderNo, options = {}) {
  return useQuery({
    queryKey: deliveryKeys.status(orderNo),
    queryFn: async () => unwrap(await apiGet(`deliveries/status/${orderNo}`)),
    enabled: Boolean(orderNo),
    staleTime: 60 * 1000,
    retry: 1,
    ...options,
  });
}
