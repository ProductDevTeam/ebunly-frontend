"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import {
  useMe,
  useUpdateProfile,
  useChangePassword,
} from "@/hooks/use-profile";
import { useNotification } from "@/components/common/notification-provider";

const getPasswordStrength = (password) => {
  if (!password)
    return { label: "", color: "bg-gray-200", width: "w-0", score: 0 };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  if (score <= 1)
    return { label: "Weak", color: "bg-red-500", width: "w-1/4", score };
  if (score === 2)
    return { label: "Fair", color: "bg-orange-500", width: "w-2/4", score };
  if (score === 3)
    return { label: "Good", color: "bg-yellow-500", width: "w-3/4", score };
  if (score === 4)
    return { label: "Strong", color: "bg-green-500", width: "w-full", score };
  return {
    label: "Very Strong",
    color: "bg-green-600",
    width: "w-full",
    score,
  };
};

const EditProfilePage = () => {
  const router = useRouter();
  const { data: meData, isLoading } = useMe();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile();
  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword();
  const { success: notifySuccess, error: notifyError } = useNotification();

  const user = meData?.data;

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      }));
    }
  }, [user]);

  const passwordStrength = getPasswordStrength(formData.newPassword);

  const validateField = (name, value) => {
    switch (name) {
      case "firstName":
        if (!value.trim()) return "First name is required";
        if (value.trim().length < 2) return "Must be at least 2 characters";
        break;
      case "lastName":
        if (!value.trim()) return "Last name is required";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email address";
        break;
      case "phone":
        const digits = value.replace(/\D/g, "");
        if (digits && digits.length < 10) return "Must be at least 10 digits";
        break;
      case "newPassword":
        if (value && value.length < 8)
          return "Password must be at least 8 characters";
        if (value && !/\d/.test(value))
          return "Must contain at least one number";
        if (value && !/[!@#$%^&*(),.?":{}|<>]/.test(value))
          return "Must contain a special character";
        break;
      case "currentPassword":
        if (formData.newPassword && !value)
          return "Current password is required to set a new one";
        break;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error || undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error || undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "newPassword",
      "currentPassword",
    ];
    const newErrors = {};
    fields.forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    setTouched(fields.reduce((acc, k) => ({ ...acc, [k]: true }), {}));

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      notifyError(Object.values(newErrors)[0], "Please fix the errors");
      return;
    }

    // Update profile fields
    updateProfile(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      },
      {
        onSuccess: () => {
          notifySuccess("Profile updated successfully", "Saved");
        },
        onError: (err) => {
          notifyError(err.message || "Failed to update profile", "Error");
        },
      },
    );

    // Change password if filled
    if (formData.newPassword && formData.currentPassword) {
      changePassword(
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.newPassword,
        },
        {
          onSuccess: () => {
            setFormData((prev) => ({
              ...prev,
              currentPassword: "",
              newPassword: "",
            }));
            notifySuccess("Password changed successfully", "Done");
          },
          onError: (err) => {
            notifyError(err.message || "Failed to change password", "Error");
          },
        },
      );
    }
  };

  const inputBase =
    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900";

  const getInputClassName = (fieldName) => {
    if (errors[fieldName])
      return `${inputBase} border-red-500 focus:ring-red-200`;
    if (touched[fieldName] && !errors[fieldName] && formData[fieldName])
      return `${inputBase} border-green-500 focus:ring-green-200`;
    return `${inputBase} border-gray-200 focus:ring-[#FF5722]/20`;
  };

  const errorText = "mt-1 text-sm text-red-500 flex items-start gap-1";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:ml-36">
      <div className="max-w-md  px-6 py-8">
        <h1 className="text-2xl font-semibold mb-8">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("firstName")}
                placeholder="John"
              />
              {errors.firstName && (
                <p className={errorText}>
                  <span>⚠</span>
                  <span>{errors.firstName}</span>
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("lastName")}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className={errorText}>
                  <span>⚠</span>
                  <span>{errors.lastName}</span>
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName("email")}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className={errorText}>
                <span>⚠</span>
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName("phone")}
              placeholder="0701234567"
            />
            {errors.phone && (
              <p className={errorText}>
                <span>⚠</span>
                <span>{errors.phone}</span>
              </p>
            )}
          </div>

          {/* Password Section */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-500">
              Change Password <span className="font-normal">(optional)</span>
            </p>

            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("currentPassword")}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className={errorText}>
                  <span>⚠</span>
                  <span>{errors.currentPassword}</span>
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClassName("newPassword")}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {formData.newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-600">
                      Strength:{" "}
                      <span
                        className={`font-medium ${
                          passwordStrength.score <= 1
                            ? "text-red-500"
                            : passwordStrength.score === 2
                              ? "text-orange-500"
                              : passwordStrength.score === 3
                                ? "text-yellow-600"
                                : "text-green-600"
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {passwordStrength.score}/5
                    </p>
                  </div>
                  <div className="text-xs space-y-1 pt-1">
                    <p
                      className={
                        formData.newPassword.length >= 8
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {formData.newPassword.length >= 8 ? "✓" : "○"} At least 8
                      characters
                    </p>
                    <p
                      className={
                        /\d/.test(formData.newPassword)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {/\d/.test(formData.newPassword) ? "✓" : "○"} Contains a
                      number
                    </p>
                    <p
                      className={
                        /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
                        ? "✓"
                        : "○"}{" "}
                      Contains a special character
                    </p>
                  </div>
                </div>
              )}

              {errors.newPassword && (
                <p className={errorText}>
                  <span>⚠</span>
                  <span>{errors.newPassword}</span>
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving || isChangingPassword}
            className="w-full bg-[#FF5722] hover:bg-[#F4511E] disabled:opacity-60 text-white font-semibold py-3.5 rounded-lg transition-colors active:scale-[0.98] transform"
          >
            {isSaving || isChangingPassword ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
