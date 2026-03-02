"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/utils/api-fetch";
import { useNotification } from "@/components/common/notification-provider";
import { validateEmail } from "@/utils/input-validation";
import {
  AuthButton,
  AuthInput,
  AuthFooter,
} from "@/components/common/auth/input";
import { MailCheck } from "lucide-react";

// ── API hook ───────────────────────────────────────────────────────────────
function useResendVerification() {
  return useMutation({
    mutationFn: (email) => apiPost("auth/resend-email-otp", { email }),
  });
}

// ── Success state ──────────────────────────────────────────────────────────
function SuccessView({ email, onRedirect }) {
  return (
    <div className="bg-[#FEEEE9] min-h-screen md:flex md:items-center md:justify-center">
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
          <div className="flex flex-col items-center text-center flex-1 justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#FFF0EB] flex items-center justify-center">
              <MailCheck className="w-9 h-9 text-[#FF5722]" />
            </div>

            <div className="max-w-3xs text-center mx-auto">
              <h1 className="font-semibold text-[36px] text-gray-900 mb-1 text-center">
                Check your inbox
              </h1>
              <p className="text-sm text-gray-500 leading-relaxed text-center">
                We&apos;ve sent a verification code to
              </p>
              <p className="text-sm font-semibold text-gray-900 mt-1 text-center">
                {email}
              </p>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-xs text-center">
              Enter the code in the next screen to verify your account. It may
              take a minute to arrive — check your spam folder if you don&apos;t
              see it.
            </p>

            <div className="w-full mt-2">
              <AuthButton onClick={onRedirect}>Enter Code</AuthButton>
            </div>
          </div>

          <AuthFooter
            text="Already verified?"
            linkText="Log in"
            href="/login"
          />
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ResendVerificationPage() {
  const router = useRouter();
  const { error: notifyError } = useNotification();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [sent, setSent] = useState(false);

  const { mutate: resend, isPending } = useResendVerification();

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      notifyError(err, "Invalid email");
      return;
    }
    setEmailError(null);

    resend(email.trim().toLowerCase(), {
      onSuccess: () => setSent(true),
      onError: (err) =>
        notifyError(
          err.message || "Failed to resend. Please try again.",
          "Error",
        ),
    });
  };

  const handleRedirectToVerify = () => {
    sessionStorage.setItem("verify_email", email.trim().toLowerCase());
    router.push("/verify");
  };

  if (sent) {
    return <SuccessView email={email} onRedirect={handleRedirectToVerify} />;
  }

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
            <div className="max-w-3xs text-center mx-auto">
              <h1 className="font-semibold text-[36px] text-gray-900 mb-1 text-center">
                Verify email
              </h1>
              <p className="paragraph text-black text-sm text-center">
                Enter the email you signed up with and we&apos;ll send a new
                verification code.
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
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                error={emailError}
                autoComplete="email"
                autoFocus
              />

              <AuthButton isLoading={isPending}>
                Send Verification Code
              </AuthButton>
            </form>
          </div>

          {/* Footer */}
          <AuthFooter
            text="Already verified?"
            linkText="Log in"
            href="/login"
          />
        </div>
      </div>
    </div>
  );
}
