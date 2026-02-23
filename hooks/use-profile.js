"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPatch } from "@/utils/api-fetch";

// ── Input sanitisation ─────────────────────────────────────────────────────
const sanitiseText = (value) => (value ?? "").trim();
const sanitiseEmail = (email) => (email ?? "").trim().toLowerCase();

// ── Query keys ─────────────────────────────────────────────────────────────
export const profileKeys = {
  me: ["profile", "me"],
};

// ── Rate limiter for change-password ──────────────────────────────────────
const CP_LIMIT = {
  maxAttempts: 3,
  windowMs: 30 * 60 * 1000,
  lockMs: 30 * 60 * 1000,
};

function checkChangePasswordLimit() {
  const key = "rl_changePassword";
  const now = Date.now();
  try {
    const raw = sessionStorage.getItem(key);
    const store = raw ? JSON.parse(raw) : null;

    if (store?.lockedUntil && now < store.lockedUntil) {
      const mins = Math.ceil((store.lockedUntil - now) / 60000);
      throw new Error(
        `Too many attempts. Please try again in ${mins} minute${mins !== 1 ? "s" : ""}.`,
      );
    }

    if (store?.firstAttempt && now - store.firstAttempt > CP_LIMIT.windowMs) {
      sessionStorage.removeItem(key);
    }

    const fresh = (sessionStorage.getItem(key)
      ? JSON.parse(sessionStorage.getItem(key))
      : null) || { count: 0, firstAttempt: now };

    if (fresh.count + 1 > CP_LIMIT.maxAttempts) {
      sessionStorage.setItem(
        key,
        JSON.stringify({ ...fresh, lockedUntil: now + CP_LIMIT.lockMs }),
      );
      throw new Error("Too many attempts. Please try again in 30 minutes.");
    }

    sessionStorage.setItem(
      key,
      JSON.stringify({
        count: fresh.count + 1,
        firstAttempt: fresh.firstAttempt ?? now,
      }),
    );
  } catch (e) {
    if (e.message.includes("attempt")) throw e;
    // sessionStorage unavailable — fail open
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /auth/me
// ─────────────────────────────────────────────────────────────────────────────
async function fetchMe() {
  return apiGet("auth/me");
}

export function useMe() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: fetchMe,
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000, // 10 min cache
    retry: (failureCount, error) => {
      if (
        error?.message?.includes("401") ||
        error?.message?.toLowerCase().includes("unauthorized")
      )
        return false;
      return failureCount < 2;
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /auth/profile
// ─────────────────────────────────────────────────────────────────────────────
async function updateProfileApi(data) {
  const payload = {
    firstName: sanitiseText(data.firstName),
    lastName: sanitiseText(data.lastName),
    email: sanitiseEmail(data.email),
    phone: sanitiseText(data.phone ?? ""),
    country: sanitiseText(data.country ?? ""),
    ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
  };
  return apiPatch("auth/profile", payload);
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (responseData) => {
      // Optimistic cache update
      queryClient.setQueryData(profileKeys.me, (old) => {
        if (!old) return old;
        return { ...old, data: { ...old.data, ...responseData.data } };
      });
      // Re-fetch to confirm server state
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /auth/change-password
// ─────────────────────────────────────────────────────────────────────────────
async function changePasswordApi(data) {
  checkChangePasswordLimit();

  if (!data.currentPassword) throw new Error("Current password is required.");
  if (!data.newPassword) throw new Error("New password is required.");
  if (data.newPassword.length < 8)
    throw new Error("New password must be at least 8 characters.");
  if (data.newPassword === data.currentPassword)
    throw new Error("New password must differ from your current password.");
  if (data.newPassword !== data.confirmPassword)
    throw new Error("Passwords do not match.");

  return apiPost("auth/change-password", {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: changePasswordApi,
    onSuccess: () => {
      try {
        sessionStorage.removeItem("rl_changePassword");
      } catch {
        /* noop */
      }
    },
  });
}
