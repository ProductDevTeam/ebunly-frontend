"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const getPasswordStrength = (password) => {
  if (!password) {
    return { label: "", color: "bg-gray-200", width: "w-0", score: 0 };
  }

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
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [formData, setFormData] = useState({
    name: "Adeoluwa Haastrup",
    email: "ExampleEmail@gmail.com",
    phone: "07051660251",
    password: "",
    dateOfBirth: "1998-08-29",
  });

  const passwordStrength = getPasswordStrength(formData.password);

  // Real-time validation for a specific field
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email address";
        }
        break;

      case "phone":
        const digits = value.replace(/\D/g, "");
        if (!digits) {
          error = "Phone number is required";
        } else if (digits.length < 10) {
          error = "Phone number must be at least 10 digits";
        } else if (digits.length > 15) {
          error = "Phone number must not exceed 15 digits";
        }
        break;

      case "password":
        if (value && value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (value && !/\d/.test(value)) {
          error = "Password must contain at least one number";
        } else if (value && !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
          error = "Password must contain at least one special character";
        }
        break;

      case "dateOfBirth":
        if (!value) {
          error = "Date of birth is required";
        } else {
          const birthDate = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - birthDate.getFullYear();
          if (age < 13) {
            error = "You must be at least 13 years old";
          } else if (age > 120) {
            error = "Please enter a valid date of birth";
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate all fields
  const validateAll = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation only if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on blur
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error || undefined,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateAll()) return;

    console.log("Form submitted:", formData);
    // TODO: API call to update profile
  };

  const inputBase =
    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900";

  const getInputClassName = (fieldName) => {
    if (errors[fieldName]) {
      return `${inputBase} border-red-500 focus:ring-red-200`;
    }
    if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) {
      return `${inputBase} border-green-500 focus:ring-green-200`;
    }
    return `${inputBase} border-gray-200 focus:ring-[#FF5722]/20`;
  };

  const errorText = "mt-1 text-sm text-red-500 flex items-start gap-1";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-8">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName("name")}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className={errorText}>
                <span>⚠</span>
                <span>{errors.name}</span>
              </p>
            )}
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

          {/* Password + Strength Meter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Update Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClassName("password")}
                placeholder="Enter new password (optional)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Strength bar - only show when password is being entered */}
            {formData.password && (
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

                {/* Password requirements checklist */}
                <div className="text-xs space-y-1 pt-1">
                  <p
                    className={
                      formData.password.length >= 8
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {formData.password.length >= 8 ? "✓" : "○"} At least 8
                    characters
                  </p>
                  <p
                    className={
                      /\d/.test(formData.password)
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {/\d/.test(formData.password) ? "✓" : "○"} Contains a number
                  </p>
                  <p
                    className={
                      /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  >
                    {/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
                      ? "✓"
                      : "○"}{" "}
                    Contains a special character
                  </p>
                </div>
              </div>
            )}

            {errors.password && (
              <p className={errorText}>
                <span>⚠</span>
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              className={getInputClassName("dateOfBirth")}
              max={new Date().toISOString().split("T")[0]}
            />
            {errors.dateOfBirth && (
              <p className={errorText}>
                <span>⚠</span>
                <span>{errors.dateOfBirth}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold py-3.5 rounded-lg transition-colors active:scale-[0.98] transform"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
