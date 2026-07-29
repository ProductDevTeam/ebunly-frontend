"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingBag } from "lucide-react";

import { useOrders } from "@/hooks/use-orders";
import AccountPage from "@/components/shared/account/account-page";
import {
  AccountColumn,
  ACCOUNT_INK,
  ACCOUNT_MUTED,
  ACCOUNT_HAIRLINE,
  ACCOUNT_BRAND,
} from "@/components/shared/account/ui";

/*
 * Status treatment from the export: "Delivered" is a green pill, in-transit
 * states a peach pill, and anything still being prepared is plain muted text
 * with no pill at all.
 */
function StatusBadge({ status }) {
  const key = String(status).toLowerCase();

  if (key === "delivered") {
    return (
      <span className="inline-flex items-center rounded-full bg-[#E6F3EA] px-2.5 py-1 text-[11px] leading-none text-[#2F6B4F]">
        {status}
      </span>
    );
  }

  if (key.includes("delivery") || key.includes("transit") || key.includes("shipped")) {
    return (
      <span className="inline-flex items-center rounded-full bg-[#FAECE7] px-2.5 py-1 text-[11px] leading-none text-[#712B13]">
        {status}
      </span>
    );
  }

  return (
    <span className="text-[11px]" style={{ color: ACCOUNT_MUTED }}>
      {status}
    </span>
  );
}

function OrderRow({ order, last }) {
  return (
    <div
      className="flex items-center gap-4 py-3"
      style={last ? undefined : { borderBottom: `1px solid ${ACCOUNT_HAIRLINE}` }}
    >
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#EFEFEF]">
        <Image
          src={order.image}
          alt={order.name}
          fill
          unoptimized
          className="object-cover"
          sizes="56px"
        />
      </span>

      {/* Leading is set per line so the three lines total the thumb's 56px. */}
      <div className="min-w-0 flex-1">
        <p
          className="text-[14px] leading-5 font-medium"
          style={{ color: ACCOUNT_INK }}
        >
          Order #{order.number}
        </p>
        {order.placedAt && (
          <p
            className="text-[13px] leading-4.5"
            style={{ color: ACCOUNT_MUTED }}
          >
            Placed {order.placedAt}
          </p>
        )}
        <Link
          href={`/profile/orders/${order.id}`}
          className="block w-fit text-[13px] leading-4.5 underline"
          style={{ color: ACCOUNT_BRAND }}
        >
          View details
        </Link>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <p className="text-[14px] leading-5" style={{ color: ACCOUNT_INK }}>
          ₦{Number(order.price).toLocaleString()}
        </p>
        <StatusBadge status={order.status} />
      </div>
    </div>
  );
}

/** `mockOrders` is for the UI harness at /test/ui/orders — unused in the app. */
export default function OrdersClient({ mockOrders = null }) {
  const { data, isLoading: fetching, isError } = useOrders();
  const orders = mockOrders ?? data ?? [];
  const isLoading = mockOrders ? false : fetching;

  return (
    <AccountPage title="Orders">
      <AccountColumn>
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : isError && orders.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[14px]" style={{ color: ACCOUNT_INK }}>
              Couldn&apos;t load your orders
            </p>
            <p className="mt-1 text-[13px]" style={{ color: ACCOUNT_MUTED }}>
              Please try again later.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FAECE7]">
              <ShoppingBag className="h-7 w-7" style={{ color: ACCOUNT_BRAND }} />
            </span>
            <p className="text-[14px] font-medium" style={{ color: ACCOUNT_INK }}>
              No orders yet
            </p>
            <p className="mt-1 text-[13px]" style={{ color: ACCOUNT_MUTED }}>
              Your order history will appear here
            </p>
            <Link
              href="/"
              className="mt-6 rounded-lg px-6 py-3 text-[14px] text-white"
              style={{ backgroundColor: ACCOUNT_BRAND }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /*
           * Wrapped so AccountColumn's row gap does not break the 80px pitch.
           * pt-2.5 is the extra the Orders frame draws above its first row —
           * see the note on the shell's title margin.
           */
          <div className="pt-2.5 md:pt-0">
            {orders.map((order, i) => (
              <OrderRow
                key={order.id}
                order={order}
                last={i === orders.length - 1}
              />
            ))}
          </div>
        )}
      </AccountColumn>
    </AccountPage>
  );
}
