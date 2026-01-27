"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const getPasswordStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score === 0)
    return { label: "Too weak", color: "bg-red-500", width: "w-1/4" };
  if (score === 1)
    return { label: "Weak", color: "bg-orange-500", width: "w-1/4" };
  if (score === 2)
    return { label: "Medium", color: "bg-yellow-500", width: "w-2/4" };
  return { label: "Strong", color: "bg-green-500", width: "w-full" };
};

const EditProfilePage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "Adeoluwa Haastrup",
    email: "ExampleEmail@gmail.com",
    phone: "07051660251",
    password: "password123",
    dateOfBirth: "1998-08-29",
  });

  const passwordStrength = getPasswordStrength(formData.password);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Phone number must be 10–15 digits";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Form submitted:", formData);
  };

  const inputBase =
    "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all text-gray-900";

  const errorText = "mt-1 text-sm text-red-500";

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold mb-8">Edit Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm mb-2">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`${inputBase} ${errors.name ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.name && <p className={errorText}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${inputBase} ${errors.email ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.email && <p className={errorText}>{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm mb-2">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`${inputBase} ${errors.phone ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.phone && <p className={errorText}>{errors.phone}</p>}
          </div>

          {/* Password + Strength Meter */}
          <div>
            <label className="block text-sm mb-2">Update Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${inputBase} pr-12 ${
                  errors.password ? "border-red-500" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Strength bar */}
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all`}
                />
              </div>
              <p className="text-xs mt-1 text-gray-600">
                Strength:{" "}
                <span className="font-medium">{passwordStrength.label}</span>
              </p>
            </div>

            {errors.password && <p className={errorText}>{errors.password}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm mb-2">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`${inputBase} ${
                errors.dateOfBirth ? "border-red-500" : "border-gray-200"
              }`}
            />
            {errors.dateOfBirth && (
              <p className={errorText}>{errors.dateOfBirth}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF5722] hover:bg-[#F4511E] text-white font-semibold py-3.5 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;
