"use client";

import { useState } from "react";
import UserProfile from "@/components/shared/profile/user-profile";
import ProfileMenu from "@/components/shared/profile/menu";
import { ChangePasswordModal } from "@/components/shared/profile/change-password";
import { useMe, useUpdateProfile } from "@/hooks/use-profile";
import { useNotification } from "@/components/common/notification-provider";

export default function ProfilePage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { data } = useMe();
  const { mutate: updateProfile } = useUpdateProfile();
  const { success: notifySuccess, error: notifyError } = useNotification();

  const handleCountryChange = (countryCode) => {
    // useUpdateProfile is already called inside UserProfile on country select.
    // Use this callback for any additional side effects e.g. updating currency context.
    console.log("Currency context updated to:", countryCode);
  };

  const handleProfileMenuAction = (action) => {
    switch (action) {
      case "change-password":
        setShowChangePassword(true);
        break;
      // Add other profile menu action handlers here as needed
      default:
        break;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-md mx-auto bg-white">
          {/* User Profile Section — fetches /auth/me internally */}
          <UserProfile onCountryChange={handleCountryChange} />

          {/* Profile Menu Section */}
          <ProfileMenu onAction={handleProfileMenuAction} />
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
}
