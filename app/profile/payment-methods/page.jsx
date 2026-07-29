import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import PaymentMethodsClient from "./payment-methods-client";

export const metadata = {
  title: "Payment Methods | Ebunly",
};

export default function PaymentMethodsPage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <PaymentMethodsClient />
      <Footer />
    </div>
  );
}
