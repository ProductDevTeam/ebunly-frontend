"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForgotPassword } from "@/hooks/use-auth";
import { validateEmail } from "@/utils/input-validation";
import {
  AuthButton,
  AuthFooter,
  AuthInput,
  BackButton,
} from "@/components/common/auth/input";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { mutate: sendCode, isPending } = useForgotPassword();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setServerError("");
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    sendCode(
      { email },
      {
        onSuccess: () => {
          router.push(`/verify?email=${encodeURIComponent(email)}`);
        },
        onError: (err) => {
          setServerError(
            err.message || "Failed to send code. Please try again.",
          );
        },
      },
    );
  };

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
            <div>
              <BackButton onClick={() => router.back()} />
            </div>

            <div className="max-w-3xs text-center mx-auto">
              <h1 className="font-semibold text-[36px] text-gray-900 mb-1 text-center">
                Forgot password?
              </h1>
              <p className="paragraph text-black text-sm text-center">
                Don&apos;t worry! Please enter the email associated with your
                account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              <AuthInput
                label="Email address"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                error={error}
                autoComplete="email"
              />

              {serverError && (
                <p className="text-sm text-red-500 text-center">
                  {serverError}
                </p>
              )}

              <AuthButton isLoading={isPending}>Send code</AuthButton>
            </form>
          </div>

          {/* Footer */}
          <AuthFooter
            text="Remember password?"
            linkText="Log in"
            href="/login"
          />
        </div>
      </div>
    </div>
  );
}
