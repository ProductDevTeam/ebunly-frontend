"use client";

import UserProfile from "@/components/shared/profile/user-profile";
import ProfileMenu from "@/components/shared/profile/menu";

export default function ProfilePage() {
  const handleCountryChange = (countryCode) => {
    console.log("Country changed to:", countryCode);
    // Add your logic here (e.g., update user preferences, currency, etc.)
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto bg-white">
        {/* User Profile Section */}
        <UserProfile
          name="Adeoluwa Haastrup"
          email="Example.Email@gmail.com"
          avatarUrl="/avatars/profile.svg"
          defaultCountry="NGN"
          onCountryChange={handleCountryChange}
        />

        {/* Profile Menu Section */}
        <ProfileMenu />
      </div>
    </div>
  );
}
