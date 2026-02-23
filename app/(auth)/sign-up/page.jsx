"use client";

import { useState } from "react";
import { useSignUp } from "@/hooks/use-auth";
import { useNotification } from "@/components/common/notification-provider";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/input-validation";
import {
  AuthButton,
  AuthFooter,
  AuthInput,
  GoogleButton,
  OrDivider,
} from "@/components/common/auth/input";
import { RegistrationSuccessModal } from "@/components/common/auth/success-modal";

export default function SignUpPage() {
  const { mutate: signUp, isPending } = useSignUp();
  const { error: notifyError } = useNotification();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    const confirmErr = validateConfirmPassword(form.password, form.confirm);
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (confirmErr) newErrors.confirm = confirmErr;
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Surface the first validation error as a toast too
      const firstErr = Object.values(newErrors)[0];
      notifyError(firstErr, "Please fix the following");
      return;
    }

    signUp(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
        },
        onError: (err) => {
          notifyError(
            err.message || "Something went wrong. Please try again.",
            "Sign up failed",
          );
        },
      },
    );
  };

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col px-6 pt-12 pb-8 font-sans max-w-md mx-auto">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="hero-heading text-gray-900 mb-2">Sign up</h1>
          <p className="paragraph text-black">
            Create a free Ebunly Account
            <br />& gift to your heart&lsquo;s content
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          <AuthInput
            label="First name"
            name="firstName"
            type="text"
            placeholder="John"
            value={form.firstName}
            onChange={handleChange}
            error={errors.firstName}
            autoComplete="given-name"
          />
          <AuthInput
            label="Last name"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={form.lastName}
            onChange={handleChange}
            error={errors.lastName}
            autoComplete="family-name"
          />
          <AuthInput
            label="Email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
          />
          <AuthInput
            label="Create a password"
            name="password"
            type="password"
            placeholder="must be 8 characters"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="new-password"
          />
          <AuthInput
            label="Confirm password"
            name="confirm"
            type="password"
            placeholder="repeat password"
            value={form.confirm}
            onChange={handleChange}
            error={errors.confirm}
            autoComplete="new-password"
          />

          <div className="mt-2">
            <AuthButton isLoading={isPending}>Create Account</AuthButton>
          </div>
        </form>

        <div className="my-6">
          <OrDivider label="Or Register with" />
        </div>

        <GoogleButton label="Sign up with Google" />

        <div className="mt-auto pt-8">
          <AuthFooter
            text="Already have an account?"
            linkText="Log in"
            href="/login"
          />
        </div>
      </div>

      <RegistrationSuccessModal
        isOpen={showSuccess}
        firstName={form.firstName}
        email={form.email}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}
