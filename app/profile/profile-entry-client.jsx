"use client";

import { useMe } from "@/hooks/use-profile";
import { useLogout } from "@/hooks/use-logout";
import MobileAccountHub from "@/components/shared/account/mobile-hub";
import MyAccountClient from "./my-account-client";

/*
 * /profile is two different screens in the exports: the mobile frame is the
 * account hub (nav list, no title), the desktop frame is the My Account form
 * beside the sidebar. The form also lives at /profile/account, which is where
 * the hub's first row points so mobile can still reach it.
 */
export default function ProfileEntryClient({ mockUser = null }) {
  const { data: fetchedUser } = useMe();
  const logout = useLogout();
  const me = mockUser ?? fetchedUser;

  const user = {
    name: [me?.firstName, me?.lastName].filter(Boolean).join(" ") || me?.name,
    email: me?.email,
  };

  return (
    <>
      <div className="md:hidden bg-[#FDFBF9] min-h-screen">
        <div className="max-w-308 mx-auto px-4 pt-8 pb-16">
          <MobileAccountHub user={user} onLogout={logout} />
        </div>
      </div>

      <div className="hidden md:block">
        <MyAccountClient mockUser={mockUser} />
      </div>
    </>
  );
}
