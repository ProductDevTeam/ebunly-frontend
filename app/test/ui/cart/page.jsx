import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import CartClient from "@/app/cart/cart-client";

export const metadata = {
  title: "UI Test · Cart | Ebunly",
};

// The two rows the Figma frame draws — the cart store is empty in a fresh browser.
const MOCK_ITEMS = [
  {
    cartItemId: "ci_1",
    name: "Engraved jewellery box",
    basePrice: 30000,
    quantity: 1,
    maxQuantity: 10,
    images: ["/product.png"],
    personalization: { type: "Embroidery", text: "AO" },
    addOns: [
      { name: "Card", message: "Happy birthday, love you lots" },
      { name: "Teddy" },
    ],
    variants: {},
    estimatedDeliveryDays: 5,
  },
  {
    cartItemId: "ci_2",
    name: "Engraved jewellery box",
    basePrice: 30000,
    quantity: 1,
    maxQuantity: 10,
    images: ["/product2.png"],
    personalization: { type: "Embroidery", text: "AO" },
    addOns: [{ name: "Card", message: "Happy birthday, love you lots" }],
    variants: {},
    estimatedDeliveryDays: 3,
  },
];

export default function CartUiTestPage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <CartClient mockItems={MOCK_ITEMS} />
      <Footer />
    </div>
  );
}
