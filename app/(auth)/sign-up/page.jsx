"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useSignUp, useGoogleAuth } from "@/hooks/use-auth";
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
  const router = useRouter();
  const { mutate: signUp, isPending } = useSignUp();
  const { mutate: googleAuth, isPending: isGooglePending } = useGoogleAuth();
  const { error: notifyError, success: notifySuccess } = useNotification();
  const googleBtnRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: (response) => {
        const idToken = response.credential;
        googleAuth(idToken, {
          onSuccess: () => {
            notifySuccess("Account created with Google!", "Welcome to Ebunly");
            setTimeout(() => router.push("/home"), 800);
          },
          onError: (err) => {
            notifyError(
              err.message || "Google sign-up failed. Please try again.",
              "Sign up failed",
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

  const handleGoogleSignUp = () => {
    googleBtnRef.current?.querySelector("div[role=button]")?.click();
  };

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
      notifyError(Object.values(newErrors)[0], "Please fix the following");
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
        onSuccess: () => setShowSuccess(true),
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
          <div
            className="
            h-screen md:h-[85vh]
            bg-white flex flex-col
            px-6 py-6 md:px-10 md:py-8
            font-sans w-full
            md:max-w-lg mx-auto
            justify-between rounded-3xl
            pt-4 md:pt-8
            md:shadow-xl
          "
          >
            {/* Heading */}
            <div className="max-w-2xs text-center mx-auto">
              <h1 className="font-semibold text-[36px] text-gray-900 text-center tracking-tighter">
                Sign up
              </h1>
              <p className="text-black text-sm text-center tracking-tighter">
                Create a free Ebunly Account &amp; gift to your heart&apos;s
                content
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-3 flex-1 mt-4 md:mt-3"
            >
              {/* Name row — side by side on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              </div>

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

              {/* Password row — side by side on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AuthInput
                  label="Create a password"
                  name="password"
                  type="password"
                  placeholder="min. 8 characters"
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
              </div>

              <AuthButton isLoading={isPending}>Create Account</AuthButton>

              {/* Divider + Google */}
              <div className="flex flex-col gap-3">
                <OrDivider label="Or Register with" />
                <div ref={googleBtnRef} className="hidden" />
                <GoogleButton
                  label="Sign up with Google"
                  onClick={handleGoogleSignUp}
                  isLoading={isGooglePending}
                />
              </div>
            </form>

            {/* Footer */}
            <AuthFooter
              text="Already have an account?"
              linkText="Log in"
              href="/login"
            />
          </div>
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
