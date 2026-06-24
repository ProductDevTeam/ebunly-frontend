import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import CartClient from "./cart-client";

export const metadata = {
  title: "My Cart | Ebunly",
};

export default function CartPage() {
  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <NavbarServer showMobileSearch={false} />
      <CartClient />
      <Footer />
    </div>
  );
}
