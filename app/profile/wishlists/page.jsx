import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import WishlistsClient from "./wishlists-client";

export const metadata = {
  title: "Wishlists | Ebunly",
};

export default function WishlistsPage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <WishlistsClient />
      <Footer />
    </div>
  );
}
