"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Calendar,
  Loader2,
  ChevronRight,
  ChevronDown,
  LogOut,
} from "lucide-react";

import { useMe, useUpdateProfile } from "@/hooks/use-profile";
import { useLogout } from "@/hooks/use-logout";
import { useNotification } from "@/components/common/notification-provider";

// Local display-currency options. Cosmetic for now — the profile API has no
// currency field, so this isn't persisted (only NGN has a flag asset).
const CURRENCIES = [
  { code: "NGN", flag: "/flags/ng.svg" },
  { code: "USD" },
  { code: "GBP" },
  { code: "EUR" },
];

// A single "Name" field maps to firstName + lastName.
function splitName(full) {
  const parts = (full ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

function initialsOf(name) {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

// ── Avatar — lavender halo, whole circle is the upload trigger (Figma shows
// no camera badge, so keep the control invisible but preserve upload). ───────
function Avatar({ name, src, onUpload, isUploading }) {
  return (
    <label
      className="relative w-28.75 h-28.75 rounded-full bg-[#F0E9FB] p-1.5 cursor-pointer block"
      title="Change photo"
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[#E4D8F7] flex items-center justify-center relative">
        {src ? (
          <Image
            src={src}
            alt={name || "Profile"}
            fill
            unoptimized
            className="object-cover"
            sizes="115px"
          />
        ) : (
          <span className="text-3xl font-semibold text-[#7C5DB0]">
            {initialsOf(name)}
          </span>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onUpload}
      />
    </label>
  );
}

// ── Currency selector pill (local/cosmetic) ─────────────────────────────────
function CurrencyPill() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("NGN");
  const current = CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];

  return (
    <div className="relative mt-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-white rounded-full pl-2.5 pr-3 py-1.5 shadow-sm"
      >
        {current.flag ? (
          <span className="relative w-4.5 h-4.5 rounded-full overflow-hidden">
            <Image src={current.flag} alt="" fill className="object-cover" />
          </span>
        ) : (
          <span className="w-4.5 h-4.5 rounded-full bg-gray-200 text-[9px] font-bold text-gray-600 flex items-center justify-center">
            {current.code[0]}
          </span>
        )}
        <span className="text-sm font-semibold text-gray-900">
          {current.code}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 w-32 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden py-1">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => {
                  setCode(c.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  c.code === code
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {c.flag ? (
                  <span className="relative w-4.5 h-4.5 rounded-full overflow-hidden shrink-0">
                    <Image src={c.flag} alt="" fill className="object-cover" />
                  </span>
                ) : (
                  <span className="w-4.5 h-4.5 rounded-full bg-gray-200 text-[9px] font-bold text-gray-600 flex items-center justify-center shrink-0">
                    {c.code[0]}
                  </span>
                )}
                {c.code}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProfileClient({ mockUser = null }) {
  const previewMode = !!mockUser;
  const { data, isLoading: meLoading } = useMe();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();
  const logout = useLogout();
  const { success: notifySuccess, error: notifyError } = useNotification();

  const user = mockUser ?? data?.data;
  const isLoading = previewMode ? false : meLoading;
  const dateRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    newPassword: "",
    currentPassword: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [hydratedUserId, setHydratedUserId] = useState(null);

  // Populate the form from the fetched profile once (and only when it changes
  // identity) — set during render rather than in an effect to avoid cascading
  // renders, and so a post-save refetch of the same user doesn't wipe edits.
  if (user && user.id !== hydratedUserId) {
    setHydratedUserId(user.id);
    setForm((prev) => ({
      ...prev,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      email: user.email ?? "",
      phone: user.phone ?? "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : "",
    }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notifyError("Please select a valid image file.", "Invalid file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notifyError("Image must be under 5MB.", "File too large");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      notifyError("Name is required.", "Please check the form");
      return;
    }
    if (form.newPassword && !form.currentPassword) {
      notifyError(
        "Enter your current password to set a new one.",
        "Current password required",
      );
      return;
    }

    if (previewMode) {
      notifySuccess("Preview mode — changes aren't saved.", "UI preview");
      return;
    }

    const { firstName, lastName } = splitName(form.name);

    updateProfile(
      {
        firstName,
        lastName,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth || undefined,
        profilePicture: avatarFile || undefined,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      },
      {
        onSuccess: () => {
          notifySuccess("Profile updated successfully.", "Saved");
          setForm((prev) => ({ ...prev, newPassword: "", currentPassword: "" }));
          setAvatarFile(null);
        },
        onError: (err) =>
          notifyError(err.message || "Failed to update profile.", "Error"),
      },
    );
  };

  const avatarSrc = avatarPreview || user?.profilePicture || null;

  // ── Field styles ──────────────────────────────────────────────────────────
  const labelClass = "block text-[15px] text-gray-500 mb-2";
  const inputClass =
    "w-full h-14 px-4 rounded-xl border border-gray-200 bg-white text-[15px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-primary/60 transition-colors";

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Mobile heading */}
      <h1 className="md:hidden text-2xl font-semibold text-gray-900 mb-7">
        Edit Profile
      </h1>

      <div className="md:flex md:gap-10 lg:gap-16 md:items-stretch">
        {/* ── Desktop profile card ───────────────────────────── */}
        <aside
          className="hidden md:flex md:flex-col md:items-center md:w-[40%] lg:w-100 shrink-0 rounded-[28px] px-10 pt-16 pb-10 relative overflow-hidden"
          style={{
            background:
              "radial-gradient(130px 120px at 82% 14%, rgba(248,88,38,0.16), transparent 70%), radial-gradient(150px 150px at 16% 68%, rgba(248,88,38,0.13), transparent 72%), linear-gradient(180deg, #FDEBE4 0%, #FFF6F2 100%)",
          }}
        >
          <Avatar
            name={form.name}
            src={avatarSrc}
            onUpload={handleAvatar}
            isUploading={isSaving && !!avatarFile}
          />
          <h2 className="mt-5 text-[28px] font-bold leading-tight text-center text-gray-900 max-w-[14ch]">
            {form.name || "—"}
          </h2>
          <CurrencyPill />

          {/* Brand mark — anchored to the bottom, partly clipped by the card */}
          <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-40 opacity-90">
            <Image src="/star.svg" alt="" fill className="object-contain" />
          </span>
        </aside>

        {/* ── Form ───────────────────────────────────────────── */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 md:max-w-xl space-y-6"
        >
          {/* Name */}
          <div>
            <label className={labelClass}>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="Your name"
              disabled={isLoading}
            />
          </div>

          {/* Email — read-only (the API has no email update) */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              readOnly
              className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`}
              placeholder="you@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              placeholder="0701234567"
              disabled={isLoading}
            />
          </div>

          {/* Update Password */}
          <div>
            <label className={labelClass}>Update Password</label>
            <div className="relative">
              <input
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={form.newPassword}
                onChange={handleChange}
                className={`${inputClass} pr-12`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Current password — revealed only when changing the password */}
            {form.newPassword && (
              <div className="relative mt-3">
                <input
                  name="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={handleChange}
                  className={`${inputClass} pr-12`}
                  placeholder="Current password (required to change)"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((s) => !s)}
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className={labelClass}>Date of Birth</label>
            <div className="relative">
              <input
                ref={dateRef}
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
                className={`${inputClass} pr-12 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-12 [&::-webkit-calendar-picker-indicator]:h-full`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => dateRef.current?.showPicker?.()}
                aria-label="Open calendar"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <Calendar size={20} />
              </button>
            </div>
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="w-full h-14 rounded-full bg-primary text-white text-base font-semibold disabled:opacity-60 hover:brightness-105 transition flex items-center justify-center"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </span>
            ) : (
              "Update Profile"
            )}
          </button>

          {/* Account actions — mobile only (desktop uses the header dropdown) */}
          <div className="pt-2 space-y-1 md:hidden">
            <Link
              href="/profile/orders"
              className="flex items-center justify-between py-3 text-gray-900 hover:text-primary transition-colors"
            >
              <span className="text-[15px]">Your Orders</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 py-3 text-[15px] text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Log Out
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
