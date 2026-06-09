import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Holds the authenticated user for client-side UI (e.g. the header).
 * The auth token itself lives in an httpOnly-style cookie set on login;
 * this store only mirrors the user profile so components can react to it.
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "ebunly-auth", // localStorage key
    },
  ),
);

/**
 * Best-effort display name from whatever shape the API returns.
 */
export function getDisplayName(user) {
  if (!user) return "";
  return (
    user.firstName ||
    user.name?.split(" ")[0] ||
    user.username ||
    user.email?.split("@")[0] ||
    "Account"
  );
}
