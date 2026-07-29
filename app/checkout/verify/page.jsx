import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import VerifyClient from "./verify-client";

export const metadata = {
  title: "Payment | Ebunly",
};

export default function CheckoutVerifyPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF9] font-sans">
      <NavbarServer showMobileSearch={false} />
      <VerifyClient />
      <Footer />
    </div>
  );
}
