"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPutForm } from "@/utils/api-fetch";
import { useAuthStore } from "@/hooks/use-auth-store";

// ── Input sanitisation ─────────────────────────────────────────────────────
const sanitiseText = (value) => (value ?? "").trim();

// ── Query keys ─────────────────────────────────────────────────────────────
export const profileKeys = {
  me: ["profile", "me"],
};

// ── Auth token presence (cookie set client-side on login) ──────────────────
export function hasAuthToken() {
  if (typeof document === "undefined") return false;
  return (
    document.cookie.includes("token=") ||
    document.cookie.includes("accessToken=")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /profile  — current user profile
// Response: { success, data: { id, email, firstName, lastName, phone,
//             profilePicture, dateOfBirth, role, address, memberSince } }
// ─────────────────────────────────────────────────────────────────────────────
// Unwraps the { success, data } envelope so consumers read `user.firstName`
// rather than `user.data.firstName`.
async function fetchMe() {
  const res = await apiGet("profile");
  return res?.data ?? res;
}

export function useMe() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: fetchMe,
    enabled: hasAuthToken(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
// PUT /profile  — multipart update (profile fields + optional avatar + password)
// Fields: firstName, lastName, phone, dateOfBirth, profilePicture (File),
//         address (JSON string), currentPassword, newPassword
// ─────────────────────────────────────────────────────────────────────────────
function buildProfileFormData(data) {
  const fd = new FormData();

  const append = (key, value) => {
    if (value !== undefined && value !== null && value !== "") {
      fd.append(key, value);
    }
  };

  append("firstName", sanitiseText(data.firstName));
  append("lastName", sanitiseText(data.lastName));
  append("phone", sanitiseText(data.phone));
  append("dateOfBirth", data.dateOfBirth);

  // Avatar — only when a real File is supplied
  if (data.profilePicture instanceof File) {
    fd.append("profilePicture", data.profilePicture);
  }

  // Address object → JSON string (per Swagger)
  if (data.address && typeof data.address === "object") {
    fd.append("address", JSON.stringify(data.address));
  }

  // Optional password change — both required together
  if (data.newPassword) {
    append("currentPassword", data.currentPassword);
    append("newPassword", data.newPassword);
  }

  return fd;
}

async function updateProfileApi(data) {
  const fd = buildProfileFormData(data);
  return apiPutForm("profile", fd);
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (responseData) => {
      // Optimistic cache update, then re-fetch to confirm server state
      // Cache holds the unwrapped user, so merge flat — not into `.data`.
      const updated = responseData?.data ?? responseData;
      queryClient.setQueryData(profileKeys.me, (old) =>
        old ? { ...old, ...updated } : updated,
      );
      queryClient.invalidateQueries({ queryKey: profileKeys.me });

      // The navbar's name pill reads useAuthStore.user, not useMe() — that
      // store is only ever set at login, so without this the header keeps
      // showing the pre-edit name until the next full login.
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.getState().setUser({ ...currentUser, ...updated });
      }
    },
  });
}
