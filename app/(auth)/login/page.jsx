"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  /* ---------------- Google Initialization ---------------- */

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.google || !window.google.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: (response) => {
        const idToken = response.credential;

        googleAuth(idToken, {
          onSuccess: () => {
            notifySuccess("Welcome back! Redirecting...", "Logged in");
            router.push("/home");
          },
          onError: (err) => {
            notifyError(
              err?.message || "Google sign-in failed. Please try again.",
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
  }, [googleAuth, notifyError, notifySuccess, router]);

  const handleGoogleLogin = useCallback(() => {
    const button = googleBtnRef.current?.querySelector('div[role="button"]');
    button?.click();
  }, []);

  /* ---------------- Form Handling ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    if (name === "email") {
      setEmailNotVerified(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);

    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;

    return newErrors;
  };

  const isUnverifiedError = (message) => {
    const msg = message.toLowerCase();
    return (
      msg.includes("email not verified") || msg.includes("verify your email")
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailNotVerified(false);

    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      notifyError(
        Object.values(validationErrors)[0],
        "Please fix the following",
      );
      return;
    }

    login(form, {
      onSuccess: () => {
        notifySuccess("Welcome back! Redirecting...", "Logged in");
        router.push("/home");
      },
      onError: (err) => {
        const message = err?.message || "";

        if (isUnverifiedError(message)) {
          setEmailNotVerified(true);
        } else {
          notifyError(
            message || "Incorrect email or password.",
            "Login failed",
          );
        }
      },
    });
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-[#FEEEE9] min-h-screen md:flex md:items-center md:justify-center">
      {/* Logo (Desktop Only) */}
      <Link
        href="/"
        className="hidden md:flex items-center gap-2 absolute top-6 left-20"
      >
        <Image
          src="/logo.svg"
          alt="Ebunly Logo"
          width={100}
          height={100}
          className="object-contain"
        />
      </Link>

      <div className="flex items-center justify-center w-full">
        <div className="h-screen md:h-auto bg-white flex flex-col px-6 py-6 font-sans w-full md:max-w-md mx-auto justify-between rounded-3xl pt-20 md:pt-10 md:shadow-xl">
          {/* Top Section */}
          <div className="flex flex-col gap-5 pb-4">
            {/* Heading */}
            <div className="max-w-full text-center mx-auto">
              <h1 className="font-semibold text-[36px] text-gray-900 mb-1 text-center tracking-tighter">
                Welcome back
              </h1>
              <p className="paragraph text-black text-sm text-center w-[60%] mx-auto tracking-tighter">
                Log in to your Ebunly Account & gift to your heart&apos;s
                content
              </p>
            </div>

            {/* Email Not Verified Banner */}
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
                  onClick={() => router.push("/resend-verification")}
                  className="mt-1 self-start text-xs font-semibold underline underline-offset-2 text-[#FF5722]"
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

              <div className="flex items-center justify-between -mt-1">
                {/* Remember Me */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={form.rememberMe ?? false}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        rememberMe: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-gray-300 text-black accent-black cursor-pointer"
                  />
                  <span className="text-sm text-black">Remember me</span>
                </label>

                {/* Forgot Password */}
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#FF5722]"
                >
                  Forgot password?
                </Link>
              </div>

              <AuthButton isLoading={isPending}>Log In</AuthButton>
            </form>

            {/* Divider + Google */}
            <div className="flex flex-col gap-4">
              <OrDivider label="Or continue with" />
              <div ref={googleBtnRef} className="hidden" />
              <GoogleButton
                label="Sign in with Google"
                onClick={handleGoogleLogin}
                isLoading={isGooglePending}
              />
            </div>
          </div>

          {/* Footer */}
          <AuthFooter
            text="Don't have an account?"
            linkText="Sign up"
            href="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}
