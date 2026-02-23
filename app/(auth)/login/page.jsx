"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/use-auth";
import { useNotification } from "@/components/common/notification-provider";
import { validateEmail, validatePassword } from "@/utils/input-validation";
import {
  AuthButton,
  AuthFooter,
  AuthInput,
  GoogleButton,
  OrDivider,
} from "@/components/common/auth/input";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const { error: notifyError, success: notifySuccess } = useNotification();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstErr = Object.values(newErrors)[0];
      notifyError(firstErr, "Please fix the following");
      return;
    }

    login(
      { email: form.email, password: form.password },
      {
        onSuccess: () => {
          notifySuccess("Welcome back! Redirecting you now.", "Logged in");
          setTimeout(() => router.push("/home"), 1000);
        },
        onError: (err) => {
          notifyError(
            err.message || "Incorrect email or password. Please try again.",
            "Login failed",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12 pb-8 font-sans max-w-md mx-auto">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="hero-heading text-gray-900 mb-2">Welcome back</h1>
        <p className="paragraph text-black">
          Log in to your Ebunly account
          <br />& continue gifting
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
          label="Password"
          name="password"
          type="password"
          placeholder="your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        {/* Forgot password link */}
        <div className="flex justify-end -mt-2">
          <a
            href="/forgot-password"
            className="text-sm font-medium"
            style={{ color: "#FF5722", fontFamily: "'DM Sans', sans-serif" }}
          >
            Forgot password?
          </a>
        </div>

        <div className="mt-2">
          <AuthButton isLoading={isPending}>Log In</AuthButton>
        </div>
      </form>

      <div className="my-6">
        <OrDivider label="Or continue with" />
      </div>

      <GoogleButton label="Sign in with Google" />

      <div className="mt-auto pt-8">
        <AuthFooter
          text="Don't have an account?"
          linkText="Sign up"
          href="/sign-up"
        />
      </div>
    </div>
  );
}
