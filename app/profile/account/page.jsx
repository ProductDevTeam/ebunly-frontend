import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import MyAccountClient from "../my-account-client";

export const metadata = {
  title: "My Account | Ebunly",
};

export default function MyAccountPage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <MyAccountClient />
      <Footer />
    </div>
  );
}
