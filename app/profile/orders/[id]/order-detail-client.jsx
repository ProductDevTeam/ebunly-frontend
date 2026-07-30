"use client";

import { Fragment } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Phone, Truck } from "lucide-react";

import { useCancelOrder, useOrder } from "@/hooks/use-orders";
import { useNotification } from "@/components/common/notification-provider";

import AccountPage from "@/components/shared/account/account-page";
import {
  AccountColumn,
  OutlinePill,
  StatusChip,
  ACCOUNT_INK,
  ACCOUNT_MUTED,
  ACCOUNT_HAIRLINE,
  ACCOUNT_BRAND,
} from "@/components/shared/account/ui";
import { mockOrderDetail, ORDER_STAGES } from "@/lib/mock-account";

/*
 * Stage tracker. Each 10px dot is centred over its own label rather than over
 * an even division of the row, so the columns shrink to their text and the
 * connectors take the slack. The connectors sit on the label's first line
 * (14px below the row top), not on the dot centreline — that is what the
 * export draws. Completed stages are solid brand, the current one a hollow
 * brand ring, later ones grey.
 */
const STAGE_GREY = "#E7E0D8";
const STAGE_LINE_GREY = "#EAE4DC";

function OrderTracker({ status }) {
  const current = Math.max(0, ORDER_STAGES.indexOf(status));

  return (
    <div className="flex items-start">
      {ORDER_STAGES.map((stage, i) => {
        const done = i < current;
        const isCurrent = i === current;
        return (
          <Fragment key={stage}>
            {/* 46px is the width that wraps "Out for delivery" as drawn. */}
            <div className="flex max-w-[46px] flex-col items-center">
              <span
                className="h-2.5 w-2.5 rounded-full border"
                style={{
                  backgroundColor: isCurrent
                    ? "transparent"
                    : done
                      ? ACCOUNT_BRAND
                      : STAGE_GREY,
                  borderColor:
                    done || isCurrent ? ACCOUNT_BRAND : STAGE_GREY,
                }}
              />
              <span
                className="text-center text-[11px] leading-[13px]"
                style={{ color: ACCOUNT_MUTED }}
              >
                {stage}
              </span>
            </div>

            {i < ORDER_STAGES.length - 1 && (
              <span
                className="mx-3 mt-3.5 h-px flex-1"
                style={{
                  backgroundColor: done ? ACCOUNT_BRAND : STAGE_LINE_GREY,
                }}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

const CANCELLABLE = new Set(["preparing", "ready", "pending", "processing"]);

/*
 * Maps a fetched order onto the shape this screen renders, falling back to the
 * mock field by field. Delete the fallbacks once the payload is specified.
 */
function toOrderView(fetched) {
  if (!fetched) return mockOrderDetail;
  const raw = fetched.raw ?? {};

  const items = Array.isArray(raw.items)
    ? raw.items.map((item, i) => {
        const product = item.product ?? item;
        return {
          id: item._id ?? item.id ?? `it_${i}`,
          name: product.name ?? item.name ?? "Item",
          price: item.price ?? product.basePrice ?? 0,
          image:
            product.images?.[0]?.url ??
            product.images?.[0] ??
            product.image ??
            "/product.png",
          note:
            item.personalization?.text
              ? `${item.personalization.type ?? "Personalization"}: "${item.personalization.text}"`
              : item.addOns?.[0]?.name
                ? `Add-on: "${item.addOns[0].name}"`
                : "",
        };
      })
    : mockOrderDetail.items;

  const subtotal = raw.subtotal ?? raw.subTotal ?? mockOrderDetail.subtotal;
  const delivery =
    raw.deliveryFee ?? raw.shippingFee ?? mockOrderDetail.delivery;

  return {
    id: fetched.number ?? mockOrderDetail.id,
    status: fetched.status ?? mockOrderDetail.status,
    estimatedDelivery: fetched.deliveryDate || mockOrderDetail.estimatedDelivery,
    contact: {
      name: raw.contactName ?? raw.recipientName ?? mockOrderDetail.contact.name,
      phone:
        raw.contactPhone ?? raw.recipientPhone ?? mockOrderDetail.contact.phone,
    },
    items: items.length > 0 ? items : mockOrderDetail.items,
    deliveryAddress:
      raw.deliveryAddress ??
      raw.shippingAddress?.formatted ??
      mockOrderDetail.deliveryAddress,
    subtotal,
    delivery,
  };
}

export default function OrderDetailClient() {
  const { id } = useParams();
  const { mutate: cancelOrder, isPending: cancelling } = useCancelOrder();
  const { success: notifySuccess, error: notifyError } = useNotification();

  // GET /orders/:id exists; the address/contact/add-on fields it returns are
  // not yet specified, so each falls back to the mock individually rather than
  // the screen flipping wholesale between real and fake.
  const { data: fetched } = useOrder(id);
  const order = toOrderView(fetched);
  const total = order.subtotal + order.delivery;
  const canCancel = CANCELLABLE.has(String(order.status).toLowerCase());

  const handleCancel = () =>
    cancelOrder(id, {
      onSuccess: () => notifySuccess("Order cancelled.", "Done"),
      onError: (err) =>
        notifyError(err.message || "Could not cancel order.", "Error"),
    });

  return (
    <AccountPage
      title={`Order #${order.id}`}
      backHref="/profile/orders"
      titleAfter={<StatusChip>{order.status}</StatusChip>}
    >
      <AccountColumn>
        {/* Extra the Order-details frame draws above the tracker on mobile. */}
        <div className="pt-4 md:pt-0">
          <OrderTracker status={order.status} />
        </div>

        <p
          className="flex items-center gap-2 pt-2.5 text-[13px] md:pt-4"
          style={{ color: ACCOUNT_MUTED }}
        >
          <Truck size={16} strokeWidth={1.5} className="shrink-0" />
          Estimated delivery: {order.estimatedDelivery}
        </p>

        {/* Contact — the pill stacks under the number on mobile. */}
        <div className="flex flex-col items-start gap-2.5 rounded-xl bg-white p-4 md:flex-row md:items-center md:justify-between md:gap-4">
          <div className="min-w-0">
            <p
              className="text-[14px] leading-5 font-medium"
              style={{ color: ACCOUNT_INK }}
            >
              {order.contact.name}
            </p>
            <p
              className="mt-1 text-[13px] leading-4.5"
              style={{ color: ACCOUNT_MUTED }}
            >
              {order.contact.phone}
            </p>
          </div>
          <OutlinePill>
            <Phone size={14} strokeWidth={1.5} />
            Call
          </OutlinePill>
        </div>

        {/* Items — every row carries a rule, including the last. */}
        <div className="pt-2 md:pt-0">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 py-3"
              style={{ borderBottom: `1px solid ${ACCOUNT_HAIRLINE}` }}
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#EFEFEF]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </span>
              <div className="min-w-0">
                <p
                  className="text-[13px] leading-4.5"
                  style={{ color: ACCOUNT_INK }}
                >
                  {item.name} — ₦{item.price.toLocaleString()}
                </p>
                <p
                  className="mt-1 text-[12px] leading-4"
                  style={{ color: ACCOUNT_MUTED }}
                >
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Delivery address */}
        <div className="pt-2.5 md:pt-0">
          <p
            className="text-[11px] leading-4 font-medium tracking-[0.04em]"
            style={{ color: ACCOUNT_MUTED }}
          >
            DELIVERY ADDRESS
          </p>
          <p
            className="mt-1.5 text-[13px] leading-4.5"
            style={{ color: ACCOUNT_INK }}
          >
            {order.deliveryAddress}
          </p>
        </div>

        {/* Totals */}
        {/* Totals — a rule separates Total from the lines above it. */}
        <dl className="pt-1 md:pt-3">
          {[
            ["Subtotal", order.subtotal, false],
            ["Delivery", order.delivery, false],
            ["Total", total, true],
          ].map(([label, value, ruled]) => (
            <div
              key={label}
              className={`flex justify-between ${ruled ? "pt-3 md:mt-2" : "py-1.5"}`}
              style={
                ruled ? { borderTop: `1px solid ${ACCOUNT_HAIRLINE}` } : undefined
              }
            >
              <dt
                className="text-[13px] leading-4 md:leading-4.5"
                style={{ color: ACCOUNT_INK }}
              >
                {label}
              </dt>
              <dd
                className="text-[13px] leading-4 md:leading-4.5"
                style={{ color: ACCOUNT_INK }}
              >
                ₦{value.toLocaleString()}
              </dd>
            </div>
          ))}
        </dl>

        {canCancel && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="text-[13px] disabled:opacity-50"
              style={{ color: "#C0392B" }}
            >
              {cancelling ? "Cancelling…" : "Cancel order"}
            </button>
          </div>
        )}
      </AccountColumn>
    </AccountPage>
  );
}
