"use client";

import Image from "next/image";

const OrdersPage = () => {
  const orders = {
    2026: [
      {
        id: 1,
        name: "Black Embroide...",
        color: "Black",
        personalization: "None",
        price: "N30,000",
        status: "In Progress",
        deliveryDate: "Est. 7 Jan",
        image: "/product.png",
      },
    ],
    2025: [
      {
        id: 2,
        name: "Black Embroide...",
        color: "Black",
        personalization: "None",
        price: "N30,000",
        status: "Delivered",
        deliveryDate: "On 12 Aug",
        image: "/product.png",
      },
      {
        id: 3,
        name: "Black Embroide...",
        color: "Black",
        personalization: "None",
        price: "N30,000",
        status: "Delivered",
        deliveryDate: "On 12 Aug",
        image: "/product.png",
      },
      {
        id: 4,
        name: "Black Embroide...",
        color: "Black",
        personalization: "None",
        price: "N30,000",
        status: "Canceled",
        deliveryDate: "",
        image: "/product.png",
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-gray-600";
      case "Delivered":
        return "text-green-700";
      case "Canceled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Your Orders
        </h1>

        {/* Orders grouped by year */}
        {Object.keys(orders)
          .sort((a, b) => b - a) // Sort years in descending order
          .map((year) => (
            <div key={year} className="mb-10">
              {/* Year Header */}
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {year}
              </h2>

              {/* Orders List */}
              <div className="space-y-6">
                {orders[year].map((order) => (
                  <div
                    key={order.id}
                    className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={order.image}
                        alt={order.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {order.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1">
                        Color: {order.color}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        Personalization: {order.personalization}
                      </p>
                      <p className="font-semibold text-gray-900">
                        {order.price}
                      </p>
                    </div>

                    {/* Status and Date */}
                    <div className="flex flex-col items-end justify-start text-right flex-shrink-0">
                      <span
                        className={`font-semibold mb-1 ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                      {order.deliveryDate && (
                        <span className="text-sm text-gray-600">
                          {order.deliveryDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        {/* Empty State (Optional) */}
        {Object.keys(orders).length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No orders yet</p>
            <p className="text-gray-400 text-sm mt-2">
              Your order history will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
