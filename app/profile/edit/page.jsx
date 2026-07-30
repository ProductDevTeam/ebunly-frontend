import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import EditPhotoClient from "./edit-photo-client";

export const metadata = {
  title: "Profile Photo | Ebunly",
};

export default function EditProfilePage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <EditPhotoClient />
      <Footer />
    </div>
  );
}
