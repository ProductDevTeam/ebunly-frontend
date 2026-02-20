"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks/use-auth";
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
          // Navigate to enter-code screen passing the email
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
    <div className="min-h-screen bg-white flex flex-col px-6 pt-10 pb-8 font-sans max-w-md mx-auto">
      {/* Back button */}
      <div className="mb-8">
        <BackButton onClick={() => router.back()} />
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h1 className="hero-heading text-gray-900 mb-3">Forgot password?</h1>
        <p className="paragraph text-gray-500">
          Don&apos;t worry! It happens. Please enter the email associated with
          your account.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
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
          <p className="paragraph-s text-red-500 text-center">{serverError}</p>
        )}

        <div className="mt-2">
          <AuthButton isLoading={isPending}>Send code</AuthButton>
        </div>
      </form>

      {/* Footer */}
      <div className="mt-auto pt-8">
        <AuthFooter text="Remember password?" linkText="Log in" href="/login" />
      </div>
    </div>
  );
}
