/*
 * Mock data for the account screens whose endpoints do not exist yet
 * (addresses, payment methods, wishlists, order detail). Values are the ones
 * drawn in the Figma exports. Swap each export for a real fetch as the
 * backend lands — the components read these shapes and nothing else.
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

export const mockPaymentMethods = [
  {
    id: "pm_1",
    last4: "4242",
    expires: "08/28",
    swatch: "#2F6B4F",
    isDefault: true,
  },
  {
    id: "pm_2",
    last4: "8810",
    expires: "02/27",
    swatch: "#B3A392",
    isDefault: false,
  },
];

export const mockWishlists = [
  {
    id: "wl_1",
    name: "Sarah's Birthday Wishlist",
    date: "Jul 24, 2026",
    funded: 3,
    total: 5,
    url: "wishlist.ebunly.com/sarah-b7f3",
    contributors: 2,
  },
  {
    id: "wl_2",
    name: "Sarah's Birthday_Wishlist",
    date: "Jul 24, 2026",
    funded: 3,
    total: 5,
    url: "wishlist.ebunly.com/sarah-b7f3",
    contributors: 2,
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
