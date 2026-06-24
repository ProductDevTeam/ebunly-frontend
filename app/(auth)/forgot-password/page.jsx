"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/navbar";
import { useForgotPassword } from "@/hooks/use-auth";
import { validateEmail } from "@/utils/input-validation";
import {
  AuthButton,
  AuthFooter,
  AuthInput,
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
    <div className="min-h-screen font-sans">
      {/* Header — same as login */}
      <Navbar showMobileSearch={false} />

      <div className="md:flex md:items-start md:justify-center md:py-10">
        <div className="w-full px-6 pb-10 pt-6 md:w-135.75 md:bg-white md:px-9.5 md:pb-11 md:pt-15">
          {/* Heading */}
          <div className="text-left md:text-center">
            <h1 className="text-[38px] font-bold leading-[1.1] tracking-tight text-[#1A1A1A] md:text-[36px]">
              Forgot password?
            </h1>
            <p className="mt-2 text-[15px] tracking-tight text-[#1A1A1A] md:mx-auto md:max-w-70 md:text-base md:text-[#333]">
              Don&apos;t worry! Please enter the email associated with your
              account.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-7 flex flex-col gap-4 md:mt-9"
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
              <p className="text-sm text-red-500 text-center">{serverError}</p>
            )}

            <AuthButton isLoading={isPending}>Send code</AuthButton>
          </form>

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
