"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/hooks/use-auth";
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

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

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
    setServerError("");
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    login(
      { email: form.email, password: form.password },
      {
        onSuccess: () => {
          router.push("/home");
        },
        onError: (err) => {
          setServerError(err.message || "Invalid email or password.");
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12 pb-8 font-sans max-w-md mx-auto">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="hero-heading text-gray-900 mb-2">Welcome Back</h1>
        <p className="paragraph text-gray-500">
          Log in to your Ebunly Account
          <br />& gift to your heart&apos;s content
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
          placeholder="must be 8 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        {serverError && (
          <p className="paragraph-s text-red-500 text-center">{serverError}</p>
        )}

        <div className="mt-2 flex flex-col gap-3">
          <AuthButton isLoading={isPending}>Login</AuthButton>

          <a
            href="/auth/forgot-password"
            className="paragraph-s text-gray-900 font-medium text-center hover:text-primary transition-colors"
          >
            Forgot Password?
          </a>
        </div>
      </form>

      {/* Divider */}
      <div className="my-6">
        <OrDivider label="Or Login with" />
      </div>

      {/* Google */}
      <GoogleButton label="Sign in with Google" />

      {/* Footer */}
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
