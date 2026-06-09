"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import Navbar from "@/components/common/navbar";
import { useLogin, useGoogleAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/hooks/use-auth-store";
import { useNotification } from "@/components/common/notification-provider";
import { validateEmail, validatePassword } from "@/utils/input-validation";

// Pull the user object out of whatever shape the API returns.
const extractUser = (data) => data?.data?.user ?? data?.user ?? null;

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const { mutate: googleAuth, isPending: isGooglePending } = useGoogleAuth();
  const { error: notifyError, success: notifySuccess } = useNotification();
  const setUser = useAuthStore((s) => s.setUser);

  const googleBtnRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
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
          onSuccess: (data) => {
            setUser(extractUser(data));
            notifySuccess("Welcome back! Redirecting...", "Logged in");
            router.push("/");
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
  }, [googleAuth, notifyError, notifySuccess, router, setUser]);

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

    login(
      { email: form.email, password: form.password },
      {
        onSuccess: (data) => {
          setUser(extractUser(data));
          notifySuccess("Welcome back! Redirecting...", "Logged in");
          router.push("/");
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
      },
    );
  };

  /* ---------------- UI ---------------- */

  const inputClass =
    "h-[56px] w-full rounded-xl bg-[#F9F9F9] border border-[#D8DADC] px-4 text-[15px] text-gray-900 placeholder:text-[#9CA3AF] outline-none transition-colors focus:border-primary/60";

  return (
    <div className="min-h-screen  font-sans">
      {/* Header — present on all auth pages */}
      <Navbar showMobileSearch={false} />

      <div className="md:flex md:items-start md:justify-center md:py-10">
        <div className="w-full px-6 pb-10 pt-6 md:w-135.75  md:bg-white md:px-9.5 md:pb-11 md:pt-15">
          {/* Heading */}
          <div className="text-left md:text-center">
            <h1 className="text-[38px] font-bold leading-[1.1] tracking-tight text-[#1A1A1A] md:text-[36px]">
              Welcome Back
            </h1>
            <p className="mt-2 text-[15px] tracking-tight text-[#1A1A1A] md:mx-auto md:max-w-70 md:text-base md:text-[#333]">
              Log in to your Ebunly Account & gift to your heart&apos;s content
            </p>
          </div>

          {/* Email Not Verified Banner */}
          {emailNotVerified && (
            <div className="mt-5 flex flex-col gap-1 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3">
              <p className="text-sm font-medium text-orange-800">
                Your email address hasn&apos;t been verified yet.
              </p>
              <p className="text-xs text-orange-600">
                Please verify your email before logging in.
              </p>
              <button
                type="button"
                onClick={() => router.push("/resend-verification")}
                className="mt-1 self-start text-xs font-semibold text-primary underline underline-offset-2"
              >
                Resend verification email →
              </button>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-7 flex flex-col gap-5 md:mt-9"
          >
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-[15px] font-medium text-[#1A1A1A]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                className={inputClass}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-[15px] font-medium text-[#1A1A1A]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="must be 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  className={`${inputClass} pr-12 md:pr-4`}
                />
                {/* Eye toggle — mobile only (Figma shows it on mobile, not desktop) */}
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B] md:hidden"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-1 flex h-[56px] w-full items-center justify-center rounded-full bg-primary text-base font-semibold text-white disabled:opacity-70"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Please wait...
                </span>
              ) : (
                "Login"
              )}
            </button>

            {/* Forgot Password — mobile only, centered */}
            <Link
              href="/forgot-password"
              className="text-center text-[15px] font-semibold text-[#1A1A1A] md:hidden"
            >
              Forgot Password?
            </Link>
          </form>

          {/* Remember me + Forgot Password — desktop only */}
          <div className="mt-5 hidden items-center justify-between md:flex">
            <label className="flex cursor-pointer items-center gap-2.5">
              <span className="relative inline-flex h-5 w-5">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      rememberMe: e.target.checked,
                    }))
                  }
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-[5px] border-2 border-gray-300 transition-colors checked:border-black checked:bg-black"
                />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute inset-0 m-auto hidden h-3.5 w-3.5 peer-checked:block"
                >
                  <path
                    d="M5 12l4 4 10-10"
                    stroke="#fff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[15px] text-[#1A1A1A]">Remember me</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-[15px] font-medium text-[#1A1A1A]"
            >
              Forgot Password?
            </Link>
          </div>

          {/* "Or Login with" divider — mobile only */}
          <div className="my-6 flex items-center gap-3 md:hidden">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="whitespace-nowrap text-sm text-[#6B6B6B]">
              Or Login with
            </span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Hidden Google-rendered button (used to trigger the GSI flow) */}
          <div ref={googleBtnRef} className="hidden" />

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGooglePending}
            className="flex h-[56px] w-full items-center justify-center gap-3 rounded-full border border-[#E5E5E5] bg-white disabled:opacity-70 md:mt-8"
          >
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none">
              <path
                d="M47.532 24.552c0-1.636-.132-3.2-.38-4.704H24.48v9.02h12.944c-.568 2.988-2.24 5.52-4.752 7.22v6.004h7.692c4.496-4.14 7.168-10.244 7.168-17.54z"
                fill="#4285F4"
              />
              <path
                d="M24.48 48c6.48 0 11.916-2.148 15.888-5.828l-7.692-6.004c-2.144 1.436-4.888 2.288-8.196 2.288-6.304 0-11.644-4.26-13.556-9.988H3.008v6.196C6.964 42.892 15.132 48 24.48 48z"
                fill="#34A853"
              />
              <path
                d="M10.924 28.468A14.42 14.42 0 0 1 10 24c0-1.556.268-3.068.924-4.468v-6.196H3.008A23.956 23.956 0 0 0 .48 24c0 3.876.932 7.544 2.528 10.664l7.916-6.196z"
                fill="#FBBC05"
              />
              <path
                d="M24.48 9.544c3.552 0 6.74 1.22 9.252 3.624l6.908-6.908C36.392 2.38 30.96 0 24.48 0 15.132 0 6.964 5.108 3.008 13.336l7.916 6.196c1.912-5.728 7.252-9.988 13.556-9.988z"
                fill="#EA4335"
              />
            </svg>
            <span className="text-base font-medium text-[#1A1A1A]">
              Sign in with Google
            </span>
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-[15px] text-[#6B6B6B] md:mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="font-semibold text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
