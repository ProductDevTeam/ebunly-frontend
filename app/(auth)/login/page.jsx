"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLogin, useGoogleAuth } from "@/hooks/use-auth";
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
  const { mutate: googleAuth, isPending: isGooglePending } = useGoogleAuth();
  const { error: notifyError, success: notifySuccess } = useNotification();
  const googleBtnRef = useRef(null);

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");

  useEffect(() => {
    if (typeof window === "undefined" || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: (response) => {
        const idToken = response.credential;
        googleAuth(idToken, {
          onSuccess: () => {
            notifySuccess("Welcome back! Redirecting you now.", "Logged in");
            setTimeout(() => router.push("/home"), 800);
          },
          onError: (err) => {
            notifyError(
              err.message || "Google sign-in failed. Please try again.",
              "Login failed",
            );
          },
        });
      },
    });

    if (googleBtnRef.current) {
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
      });
    }
  }, []);

  const handleGoogleLogin = () => {
    googleBtnRef.current?.querySelector("div[role=button]")?.click();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    if (name === "email") setEmailNotVerified(false);
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
    setEmailNotVerified(false);

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      notifyError(Object.values(newErrors)[0], "Please fix the following");
      return;
    }

    login(
      { email: form.email, password: form.password },
      {
        onSuccess: () => {
          notifySuccess("Welcome back! Redirecting you now.", "Logged in");
          setTimeout(() => router.push("/home"), 1500);
        },
        onError: (err) => {
          const msg = err.message || "";
          const isUnverified =
            msg.toLowerCase().includes("email not verified") ||
            msg.toLowerCase().includes("verify your email") ||
            msg.toLowerCase().includes("email is not verified");

          if (isUnverified) {
            setEmailNotVerified(true);
            setUnverifiedEmail(form.email);
          } else {
            notifyError(
              msg || "Incorrect email or password. Please try again.",
              "Login failed",
            );
          }
        },
      },
    );
  };

  const handleResendVerification = () => {
    router.push("/resend-verification");
  };

  return (
    <div className="h-screen bg-white flex flex-col px-6 py-6 font-sans max-w-md mx-auto justify-between">
      {/* Top section */}
      <div className="flex flex-col gap-5">
        {/* Heading */}
        <div>
          <h1 className="hero-heading text-gray-900 mb-1">Welcome back</h1>
          <p className="paragraph text-black text-sm">
            Log in to your Ebunly account & continue gifting
          </p>
        </div>

        {/* Email not verified banner */}
        {emailNotVerified && (
          <div className="rounded-2xl bg-orange-50 border border-orange-200 px-4 py-3 flex flex-col gap-1">
            <p className="text-sm font-medium text-orange-800">
              Your email address hasn&apos;t been verified yet.
            </p>
            <p className="text-xs text-orange-600">
              Please verify your email before logging in.
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              className="mt-1 self-start text-xs cursor-pointer font-semibold underline underline-offset-2"
              style={{ color: "#FF5722" }}
            >
              Resend verification email →
            </button>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-4"
        >
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
          <div className="flex justify-end -mt-1">
            <a
              href="/forgot-password"
              className="text-sm font-medium"
              style={{ color: "#FF5722", fontFamily: "'DM Sans', sans-serif" }}
            >
              Forgot password?
            </a>
          </div>

          <AuthButton isLoading={isPending}>Log In</AuthButton>
        </form>

        {/* Divider + Google */}
        <div className="flex flex-col gap-4">
          <OrDivider label="Or continue with" />

          {/* Hidden Google rendered button — do not remove */}
          <div ref={googleBtnRef} className="hidden" />

          <GoogleButton
            label="Sign in with Google"
            onClick={handleGoogleLogin}
            isLoading={isGooglePending}
          />
        </div>
      </div>

      {/* Footer pinned to bottom */}
      <AuthFooter
        text="Don't have an account?"
        linkText="Sign up"
        href="/sign-up"
      />
    </div>
  );
}
