"use client";

import { useState } from "react";

import { useMe, useUpdateProfile } from "@/hooks/use-profile";
import { useNotification } from "@/components/common/notification-provider";
import AccountPage from "@/components/shared/account/account-page";
import {
  AccountColumn,
  ACCOUNT_INK,
  ACCOUNT_MUTED,
  ACCOUNT_BRAND,
} from "@/components/shared/account/ui";

const HAIRLINE = "#EBE5E0";

function splitName(full) {
  const parts = String(full ?? "").trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

/** Uppercase label over a bordered input — the pattern the export repeats. */
function Field({ label, ...props }) {
  return (
    <label className="block">
      <span
        className="block text-[11px] font-medium tracking-[0.04em]"
        style={{ color: ACCOUNT_MUTED }}
      >
        {label}
      </span>
      <input
        className="mt-2 h-11 w-full rounded-lg border bg-white px-4 text-[14px] focus:outline-none"
        style={{ borderColor: HAIRLINE, color: ACCOUNT_INK }}
        {...props}
      />
    </label>
  );
}

/** `mockUser` is for the UI harness at /test/ui/profile — unused in the app. */
export default function MyAccountClient({ mockUser = null }) {
  const { data: fetchedUser } = useMe();
  const user = mockUser ?? fetchedUser;
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();
  const { success: notifySuccess, error: notifyError } = useNotification();

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  // The export puts password behind a link rather than showing the fields.
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", next: "" });

  // Seed the form from the fetched user once, and re-seed if a different user
  // arrives — the React-recommended adjust-state-during-render pattern rather
  // than a cascading effect.
  const userId = user?._id ?? user?.id ?? null;
  const [seededFor, setSeededFor] = useState(null);
  if (user && userId !== seededFor) {
    setSeededFor(userId);
    setForm({
      name: [user.firstName, user.lastName].filter(Boolean).join(" "),
      email: user.email ?? "",
      phone: user.phone ?? "",
    });
  }

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      notifyError("Name is required.", "Please check the form");
      return;
    }
    if (passwords.next && !passwords.current) {
      notifyError(
        "Enter your current password to set a new one.",
        "Current password required",
      );
      return;
    }

    const { firstName, lastName } = splitName(form.name);

    updateProfile(
      {
        firstName,
        lastName,
        phone: form.phone,
        currentPassword: passwords.current || undefined,
        newPassword: passwords.next || undefined,
      },
      {
        onSuccess: () => {
          notifySuccess("Profile updated successfully.", "Saved");
          setPasswords({ current: "", next: "" });
          setShowPassword(false);
        },
        onError: (err) =>
          notifyError(err.message || "Failed to update profile.", "Error"),
      },
    );
  };

  return (
    <AccountPage title="My Account">
      <AccountColumn>
        <form onSubmit={handleSave} className="space-y-4">
          <Field
            label="NAME"
            value={form.name}
            onChange={set("name")}
            autoComplete="name"
          />
          <Field
            label="EMAIL"
            type="email"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
            readOnly
          />
          <Field
            label="PHONE NUMBER"
            type="tel"
            value={form.phone}
            onChange={set("phone")}
            autoComplete="tel"
          />

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-[13px] underline"
              style={{ color: ACCOUNT_BRAND }}
            >
              Change password
            </button>
          </div>

          {showPassword && (
            <div className="space-y-4">
              <Field
                label="CURRENT PASSWORD"
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, current: e.target.value }))
                }
                autoComplete="current-password"
              />
              <Field
                label="NEW PASSWORD"
                type="password"
                value={passwords.next}
                onChange={(e) =>
                  setPasswords((p) => ({ ...p, next: e.target.value }))
                }
                autoComplete="new-password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="h-11 w-full md:w-auto rounded-lg px-6 text-[14px] text-white disabled:opacity-60"
            style={{ backgroundColor: ACCOUNT_BRAND }}
          >
            {isSaving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </AccountColumn>
    </AccountPage>
  );
}
