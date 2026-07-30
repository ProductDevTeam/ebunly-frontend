"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { useMe, useUpdateProfile } from "@/hooks/use-profile";
import { useNotification } from "@/components/common/notification-provider";
import AccountPage from "@/components/shared/account/account-page";
import {
  AccountColumn,
  ACCOUNT_INK,
  ACCOUNT_MUTED,
  ACCOUNT_BRAND,
} from "@/components/shared/account/ui";

function initialsOf(name) {
  return (
    String(name ?? "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("") || "A"
  );
}

/*
 * Profile photo upload. There is no Figma frame for this screen — the account
 * exports show the sidebar avatar as display-only — so it is kept deliberately
 * plain and reuses the account shell rather than inventing a new layout.
 */
export default function EditPhotoClient() {
  const { data: user } = useMe();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();
  const { success: notifySuccess, error: notifyError } = useNotification();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const src = preview || user?.profilePicture || null;

  const handlePick = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    if (!picked.type.startsWith("image/")) {
      notifyError("Choose an image file.", "Unsupported file");
      return;
    }
    if (picked.size > 5 * 1024 * 1024) {
      notifyError("Images must be under 5MB.", "File too large");
      return;
    }
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  };

  const handleSave = () => {
    if (!file) return;
    updateProfile(
      { profilePicture: file },
      {
        onSuccess: () => {
          notifySuccess("Photo updated.", "Saved");
          setFile(null);
        },
        onError: (err) =>
          notifyError(err.message || "Failed to update photo.", "Error"),
      },
    );
  };

  return (
    <AccountPage title="Profile Photo" backHref="/profile">
      <AccountColumn>
        <div className="flex items-center gap-5">
          <label
            className="relative block h-28 w-28 shrink-0 cursor-pointer rounded-full bg-[#F0E9FB] p-1.5"
            title="Change photo"
          >
            <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#E4D8F7]">
              {src ? (
                <Image
                  src={src}
                  alt={name || "Profile"}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="112px"
                />
              ) : (
                <span className="text-[30px] font-semibold text-[#7C5DB0]">
                  {initialsOf(name)}
                </span>
              )}
              {isSaving && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </span>
              )}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePick}
            />
          </label>

          <div>
            <p className="text-[14px] font-medium" style={{ color: ACCOUNT_INK }}>
              {name || "Your photo"}
            </p>
            <p className="mt-1 text-[13px]" style={{ color: ACCOUNT_MUTED }}>
              Tap the circle to choose a new image. JPG or PNG, up to 5MB.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!file || isSaving}
            className="h-11 rounded-lg px-6 text-[14px] text-white disabled:opacity-50"
            style={{ backgroundColor: ACCOUNT_BRAND }}
          >
            {isSaving ? "Saving…" : "Save photo"}
          </button>
          <Link
            href="/profile"
            className="text-[13px] underline"
            style={{ color: ACCOUNT_MUTED }}
          >
            Back to account
          </Link>
        </div>
      </AccountColumn>
    </AccountPage>
  );
}
