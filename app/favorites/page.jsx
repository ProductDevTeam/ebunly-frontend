import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import FavoritesClient from "./favorites-client";

export const metadata = {
  title: "Favorites | Ebunly",
};

export default function FavoritesPage() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <NavbarServer showMobileSearch={false} />
      <FavoritesClient />
      <Footer />
    </div>
  );
}
