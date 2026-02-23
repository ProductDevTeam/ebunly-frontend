"use client";

import Image from "next/image";
import { ChevronDown, Camera, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMe, useUpdateProfile } from "@/hooks/use-profile";
import { useNotification } from "@/components/common/notification-provider";

const COUNTRIES = [
  { code: "NGN", name: "Nigeria", flag: "/flags/ng.svg" },
  { code: "USD", name: "United States", flag: "/flags/us.svg" },
  { code: "GBP", name: "United Kingdom", flag: "/flags/gb.svg" },
  { code: "EUR", name: "Europe", flag: "/flags/eu.svg" },
];

// ── Avatar with upload overlay ─────────────────────
function Avatar({ name, avatarUrl, onUpload, isUpdating }) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="relative w-20 h-20 mb-4">
      <motion.div
        className="w-20 h-20 rounded-full overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
            priority
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-orange-300 to-orange-400 flex items-center justify-center">
            <span className="text-xl font-bold text-white">{initials}</span>
          </div>
        )}
      </motion.div>

      {/* Upload overlay */}
      <label
        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
        style={{ background: "#FF5722" }}
        title="Change photo"
      >
        {isUpdating ? (
          <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
        ) : (
          <Camera className="w-3.5 h-3.5 text-white" />
        )}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUpload}
          disabled={isUpdating}
        />
      </label>
    </div>
  );
}

// ── Skeleton loader ────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center py-8 px-4 bg-[#FFF7F5] animate-pulse">
      <div className="w-20 h-20 rounded-full bg-orange-100 mb-4" />
      <div className="h-5 w-36 bg-orange-100 rounded-full mb-2" />
      <div className="h-4 w-48 bg-orange-100 rounded-full mb-4" />
      <div className="h-8 w-24 bg-orange-100 rounded-full" />
    </div>
  );
}

// ── Main component ─────────────────────────────────
const UserProfile = ({ onCountryChange = () => {} }) => {
  const { data, isLoading, isError } = useMe();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { error: notifyError, success: notifySuccess } = useNotification();

  const [isCountryOpen, setIsCountryOpen] = useState(false);

  const profile = data?.data;

  const currentCountry =
    COUNTRIES.find((c) => c.code === profile?.country) || COUNTRIES[0];

  const handleCountrySelect = (countryCode) => {
    setIsCountryOpen(false);
    updateProfile(
      { ...profile, country: countryCode },
      {
        onSuccess: () => {
          notifySuccess("Country updated successfully.");
          onCountryChange(countryCode);
        },
        onError: (err) => notifyError(err.message, "Update failed"),
      },
    );
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith("image/")) {
      notifyError("Please select a valid image file.", "Invalid file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notifyError("Image must be under 5MB.", "File too large");
      return;
    }

    // Convert to base64 or upload to storage — here we mock with object URL
    const previewUrl = URL.createObjectURL(file);
    updateProfile(
      { ...profile, avatarUrl: previewUrl },
      {
        onSuccess: () => notifySuccess("Profile photo updated."),
        onError: (err) => notifyError(err.message, "Upload failed"),
      },
    );
  };

  if (isLoading) return <ProfileSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center py-8 px-4 bg-[#FFF7F5]">
        <p className="text-sm text-gray-400">Failed to load profile.</p>
      </div>
    );
  }

  const fullName =
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();

  return (
    <div className="flex flex-col items-center py-8 px-4 font-sans bg-[#FFF7F5]">
      {/* Avatar */}
      <Avatar
        name={fullName}
        avatarUrl={profile?.avatarUrl}
        onUpload={handleAvatarUpload}
        isUpdating={isUpdating}
      />

      {/* Name */}
      <motion.h2
        className="text-xl font-semibold text-gray-900 mb-1"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {fullName || "—"}
      </motion.h2>

      {/* Email */}
      <motion.p
        className="text-sm text-gray-500 mb-4"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {profile?.email || "—"}
      </motion.p>

      {/* Country selector */}
      <motion.div
        className="relative"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <button
          onClick={() => setIsCountryOpen((o) => !o)}
          disabled={isUpdating}
          className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-full hover:border-gray-300 transition-colors disabled:opacity-60"
        >
          <div className="relative w-5 h-5 rounded-full overflow-hidden">
            <Image
              src={currentCountry.flag}
              alt={currentCountry.name}
              fill
              className="object-cover"
              sizes="20px"
            />
          </div>
          <span className="text-sm font-semibold text-black">
            {currentCountry.code}
          </span>
          <motion.div
            animate={{ rotate: isCountryOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-black" />
          </motion.div>
        </button>

        {/* Dropdown */}
        {isCountryOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10 min-w-[160px]"
          >
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => handleCountrySelect(country.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left ${
                  profile?.country === country.code ? "bg-orange-50" : ""
                }`}
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={country.flag}
                    alt={country.name}
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {country.code}
                  </span>
                  <span className="text-xs text-gray-500">{country.name}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Click outside */}
      {isCountryOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsCountryOpen(false)}
        />
      )}
    </div>
  );
};

export default UserProfile;
