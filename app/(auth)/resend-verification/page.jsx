"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12 pb-8 font-sans max-w-md mx-auto">
      <div className="flex flex-col items-center text-center mt-16">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "#FFF0EB" }}
        >
          <MailCheck className="w-9 h-9" style={{ color: "#FF5722" }} />
        </div>

        <h1
          className="text-2xl font-bold text-gray-900 mb-3"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Check your inbox
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-2">
          We&apos;ve sent a verification code to
        </p>
        <p className="text-sm font-semibold text-gray-900 mb-8">{email}</p>

        <p className="text-xs text-gray-400 mb-8 leading-relaxed max-w-xs">
          Enter the code in the next screen to verify your account. It may take
          a minute to arrive — check your spam folder if you don&apos;t see it.
        </p>

        <button
          type="button"
          onClick={onRedirect}
          className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
          style={{ background: "#FF5722", fontFamily: "'DM Sans', sans-serif" }}
        >
          Enter Code
        </button>
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
    <div className="min-h-screen bg-white flex flex-col px-6 pt-12 pb-8 font-sans max-w-md mx-auto">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-gray-900 mb-2"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Verify your email
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          Enter the email address you signed up with and we&apos;ll send you a
          new verification code.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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

        <div className="mt-2">
          <AuthButton isLoading={isPending}>Send Verification Code</AuthButton>
        </div>
      </form>

      <div className="mt-auto pt-8">
        <AuthFooter text="Already verified?" linkText="Log in" href="/login" />
      </div>
    </div>
  );
}
