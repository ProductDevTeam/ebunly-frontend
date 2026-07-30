import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import ProfileEntryClient from "./profile-entry-client";

export const metadata = {
  title: "My Profile | Ebunly",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <ProfileEntryClient />
      <Footer />
    </div>
  );
}
