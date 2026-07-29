import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import OrderDetailClient from "./order-detail-client";

export const metadata = {
  title: "Order Details | Ebunly",
};

export default function OrderDetailPage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <OrderDetailClient />
      <Footer />
    </div>
  );
}
