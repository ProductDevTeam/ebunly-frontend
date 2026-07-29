import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import OrderDetailClient from "@/app/profile/orders/[id]/order-detail-client";

export const metadata = {
  title: "UI Test · Order detail | Ebunly",
};

/*
 * No route param here, so useOrder() stays disabled and the screen renders
 * entirely from mockOrderDetail — which is the Figma frame's data.
 */
export default function OrderDetailUiTestPage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <OrderDetailClient />
      <Footer />
    </div>
  );
}
