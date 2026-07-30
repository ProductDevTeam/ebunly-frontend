"use client";

import AccountShell from "./account-shell";
import { useMe } from "@/hooks/use-profile";
import { useLogout } from "@/hooks/use-logout";

/*
 * Wraps AccountShell with the real signed-in user. Identity comes from the
 * live API even on the screens whose own data is still mocked.
 */
export default function AccountPage({ title, titleAfter, backHref, children }) {
  const { data: me } = useMe();
  const logout = useLogout();

  const user = {
    name: [me?.firstName, me?.lastName].filter(Boolean).join(" ") || me?.name,
    email: me?.email,
  };

  return (
    <AccountShell
      title={title}
      titleAfter={titleAfter}
      backHref={backHref}
      user={user}
      onLogout={logout}
    >
      {children}
    </AccountShell>
  );
}
