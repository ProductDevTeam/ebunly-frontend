"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/utils/api-fetch";
import { hasAuthToken } from "@/hooks/use-profile";

export const orderKeys = {
  all: ["orders"],
  list: (params) => ["orders", "list", params],
  detail: (id) => ["orders", "detail", id],
};

const CANCELLABLE = new Set(["pending", "in progress", "processing"]);

// ── Defensive normaliser ────────────────────────────────────────────────────
// The orders response shape isn't fully specified in Swagger, so map tolerantly.
// NOTE: field names here may need a small tweak once we see a live response.
function normalizeOrder(order) {
  const firstItem = order.items?.[0] ?? order.product ?? {};
  const product = firstItem.product ?? firstItem;
  const created = order.createdAt ?? order.created_at ?? order.date;
  const year = created ? new Date(created).getFullYear() : "—";
  const status = order.status ?? "Pending";

  const image =
    product.images?.[0]?.url ??
    product.images?.[0] ??
    product.image ??
    "/product.png";

  const variantText =
    firstItem.selectedVariants
      ?.map((v) => v.selectedOption)
      .filter(Boolean)
      .join(", ") ||
    firstItem.color ||
    "—";

  const id = order._id ?? order.id;

  return {
    id,
    // The Orders list is keyed by order number and placed date, not product.
    number: order.orderNumber ?? order.number ?? String(id ?? "").slice(-6).toUpperCase(),
    placedAt: created
      ? new Date(created).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "",
    name: product.name ?? firstItem.name ?? "Order",
    color: variantText,
    personalization: firstItem.personalization?.text ? "Custom" : "None",
    price: order.total ?? order.totalAmount ?? firstItem.price ?? 0,
    status,
    deliveryDate:
      order.estimatedDelivery ?? order.deliveryDate ?? order.deliveredOn ?? "",
    image,
    year,
    cancellable: CANCELLABLE.has(String(status).toLowerCase()),
  };
}

function buildQuery({ status, page, limit } = {}) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (page) params.set("page", String(page));
  if (limit) params.set("limit", String(limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

// ── GET /orders ─────────────────────────────────────────────────────────────
export function useOrders(params = {}) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: async () => {
      const res = await apiGet(`orders${buildQuery(params)}`);
      const list = res?.data?.orders ?? res?.data ?? res?.orders ?? [];
      return Array.isArray(list) ? list.map(normalizeOrder) : [];
    },
    enabled: hasAuthToken(),
    staleTime: 60 * 1000,
  });
}

// ── GET /orders/:id ─────────────────────────────────────────────────────────
// The detail screen needs the line items, address and totals, which the list
// normaliser flattens away — so keep the raw payload alongside the summary.
export function useOrder(id) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const res = await apiGet(`orders/${id}`);
      const raw = res?.data?.order ?? res?.data ?? res?.order ?? res;
      if (!raw || typeof raw !== "object") return null;
      return { ...normalizeOrder(raw), raw };
    },
    enabled: Boolean(id) && hasAuthToken(),
    staleTime: 60 * 1000,
    retry: false,
  });
}

// ── POST /orders/:id/cancel ─────────────────────────────────────────────────
export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiPost(`orders/${id}/cancel`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: orderKeys.all }),
  });
}

// ── POST /orders/checkout — create an order from the cart ───────────────────
export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body) => apiPost("orders/checkout", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

// Group normalised orders by year (desc), for rendering.
export function groupOrdersByYear(orders = []) {
  const groups = {};
  for (const order of orders) {
    const year = order.year ?? "—";
    (groups[year] ??= []).push(order);
  }
  return Object.keys(groups)
    .sort((a, b) => Number(b) - Number(a))
    .map((year) => ({ year, orders: groups[year] }));
}
