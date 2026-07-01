"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2, ShoppingBag } from "lucide-react";

import { useOrders, useCancelOrder, groupOrdersByYear } from "@/hooks/use-orders";
import { MOCK_ORDERS } from "@/lib/mock-orders";
import { useNotification } from "@/components/common/notification-provider";

function statusColor(status) {
  switch (String(status).toLowerCase()) {
    case "delivered":
      return "text-green-700";
    case "canceled":
    case "cancelled":
      return "text-red-600";
    case "in progress":
    case "processing":
    case "pending":
      return "text-gray-600";
    default:
      return "text-gray-600";
  }
}

function formatPrice(value) {
  if (typeof value === "number") return `₦${value.toLocaleString()}`;
  return value || "—";
}

function OrderRow({ order, onCancel, cancelling }) {
  return (
    <div className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0">
      <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
        <Image
          src={order.image}
          alt={order.name}
          fill
          unoptimized
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {order.name}
        </h3>
        <p className="text-sm text-gray-500 mb-0.5">Color: {order.color}</p>
        <p className="text-sm text-gray-500 mb-2">
          Personalization: {order.personalization}
        </p>
        <p className="font-semibold text-gray-900">{formatPrice(order.price)}</p>

        {order.cancellable && (
          <button
            onClick={() => onCancel(order.id)}
            disabled={cancelling}
            className="mt-2 text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors"
          >
            {cancelling ? "Cancelling..." : "Cancel order"}
          </button>
        )}
      </div>

      <div className="flex flex-col items-end justify-start text-right flex-shrink-0">
        <span className={`font-semibold mb-1 ${statusColor(order.status)}`}>
          {order.status}
        </span>
        {order.deliveryDate && (
          <span className="text-sm text-gray-600">{order.deliveryDate}</span>
        )}
      </div>
    </div>
  );
}

export default function OrdersClient() {
  const { data, isLoading, isError } = useOrders();
  const { mutate: cancelOrder, isPending: cancelling, variables: cancellingId } =
    useCancelOrder();
  const { success: notifySuccess, error: notifyError } = useNotification();

  const handleCancel = (id) =>
    cancelOrder(id, {
      onSuccess: () => notifySuccess("Order cancelled.", "Done"),
      onError: (err) =>
        notifyError(err.message || "Could not cancel order.", "Error"),
    });

  // Fall back to mock data only when the API returns nothing yet.
  const orders = data && data.length > 0 ? data : !isLoading ? MOCK_ORDERS : [];
  const grouped = groupOrdersByYear(orders);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Your Orders</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : isError && orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">Couldn&apos;t load your orders</p>
          <p className="text-gray-400 text-sm mt-2">Please try again later.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="w-9 h-9 text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">No orders yet</h2>
          <p className="text-sm text-gray-500 mb-6">
            Your order history will appear here
          </p>
          <Link
            href="/"
            className="bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-105 transition"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        grouped.map(({ year, orders: yearOrders }) => (
          <section key={year} className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{year}</h2>
            <div className="space-y-6 md:rounded-2xl md:border md:border-gray-100 md:p-6">
              {yearOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onCancel={handleCancel}
                  cancelling={cancelling && cancellingId === order.id}
                />
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  );
}
