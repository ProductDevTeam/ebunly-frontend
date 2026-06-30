import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import ProfileClient from "./profile-client";

export const metadata = {
  title: "My Profile | Ebunly",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen font-sans bg-white">
      <NavbarServer showMobileSearch={false} />
      <ProfileClient />
      <Footer />
    </div>
  );
}
