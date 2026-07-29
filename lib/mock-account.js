/*
 * Mock data for the account screens whose endpoints do not exist yet.
 * Addresses is the only one left — the API has no address resource, just a
 * single `address` string on PUT /profile. Values are the ones drawn in the
 * Figma exports; the order-detail record still backs the fields GET /orders/{id}
 * does not return.
 */

export const mockAddresses = [
  {
    id: "addr_1",
    label: "Home",
    line: "14 Admiralty Way, Lekki Phase 1, Lagos",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "Work",
    line: "5 Marina Street, Lagos Island, Lagos",
    isDefault: false,
  },
];

/** Order list rows, for the UI harness — the live screen fetches /orders. */
export const mockOrders = [
  {
    id: "EB10234",
    number: "EB10234",
    placedAt: "Jul 12, 2026",
    price: 30000,
    status: "Delivered",
    name: "Engraved jewellery box",
    image: "/product.png",
  },
  {
    id: "EB10221",
    number: "EB10221",
    placedAt: "Jul 8, 2026",
    price: 68000,
    status: "Out for delivery",
    name: "Gift hamper",
    image: "/product2.png",
  },
  {
    id: "EB10198",
    number: "EB10198",
    placedAt: "Jul 3, 2026",
    price: 22000,
    status: "Preparing",
    name: "Patterned shirt",
    image: "/gift-box.png",
  },
];

/** Ordered pipeline the order-detail tracker renders. */
export const ORDER_STAGES = [
  "Preparing",
  "Ready",
  "Out for delivery",
  "Delivered",
];

export const mockOrderDetail = {
  id: "EB10228",
  status: "Out for delivery",
  estimatedDelivery: "Jul 22, 2026",
  contact: { name: "Tunde Bakare", phone: "+234 803 555 0192" },
  items: [
    {
      id: "it_1",
      name: "Engraved jewellery box",
      price: 30000,
      image: "/product.png",
      note: 'Embroidery: "AO"',
    },
    {
      id: "it_2",
      name: "Engraved jewellery box",
      price: 30000,
      image: "/product2.png",
      note: 'Add-on: "Rose bouquet"',
    },
  ],
  deliveryAddress: "Work — 5 Marina Street, Lagos Island, Lagos",
  subtotal: 68000,
  delivery: 2000,
};
