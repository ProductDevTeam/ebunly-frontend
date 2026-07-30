import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import OrdersClient from "./orders-client";

export const metadata = {
  title: "Your Orders | Ebunly",
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <OrdersClient />
      <Footer />
    </div>
  );
}
