import NavbarServer from "@/components/common/navbar-server";
import Footer from "@/components/common/footer";
import ProfileEntryClient from "@/app/profile/profile-entry-client";

export const metadata = {
  title: "UI Test · Profile | Ebunly",
};

// Mock profile matching the GET /profile response shape.
const MOCK_USER = {
  id: "mock-user-1",
  firstName: "Adeoluwa",
  lastName: "Haastrup",
  email: "ExampleEmail@gmail.com",
  phone: "07051660251",
  dateOfBirth: "1998-08-29",
  profilePicture: null,
  role: "customer",
  address: {},
  memberSince: "2012-06-01T00:00:00.000Z",
};

export default function ProfileUiTestPage() {
  return (
    <div className="min-h-screen font-sans bg-[#FDFBF9]">
      <NavbarServer showMobileSearch={false} />
      <ProfileEntryClient mockUser={MOCK_USER} />
      <Footer />
    </div>
  );
}
