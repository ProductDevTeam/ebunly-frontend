import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import AddressesClient from "./addresses-client";

export const metadata = {
  title: "Addresses | Ebunly",
};

export default function AddressesPage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <AddressesClient />
      <Footer />
    </div>
  );
}
