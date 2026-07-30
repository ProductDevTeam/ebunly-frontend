import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import OrdersClient from "@/app/profile/orders/orders-client";
import { mockOrders } from "@/lib/mock-account";

export const metadata = {
  title: "UI Test · Orders | Ebunly",
};

export default function OrdersUiTestPage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <OrdersClient mockOrders={mockOrders} />
      <Footer />
    </div>
  );
}
