"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useVerifyCode } from "@/hooks/use-auth";
import { useNotification } from "@/components/common/notification-provider";
import { AuthButton, BackButton } from "@/components/common/auth/input";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 20;

function EnterCodeContent() {
  const router = useRouter();

  const { mutate: verifyCode, isPending } = useVerifyCode();
  const { error: notifyError } = useNotification();

  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("verify_email");
    if (!stored) {
      router.replace("/login");
      return;
    }
    setEmail(stored);
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (digits[index]) {
        const newDigits = [...digits];
        newDigits[index] = "";
        setDigits(newDigits);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    const newDigits = Array(CODE_LENGTH).fill("");
    pasted.split("").forEach((char, i) => {
      newDigits[i] = char;
    });
    setDigits(newDigits);
    const nextEmpty = newDigits.findIndex((d) => !d);
    const focusIdx = nextEmpty === -1 ? CODE_LENGTH - 1 : nextEmpty;
    inputRefs.current[focusIdx]?.focus();
  };

  const handleResend = () => {
    if (countdown > 0) return;
    setCountdown(RESEND_SECONDS);
    setDigits(Array(CODE_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = digits.join("");

    if (code.length < CODE_LENGTH) {
      notifyError(
        "Please enter all 6 digits of your verification code.",
        "Incomplete code",
      );
      return;
    }

    if (!email) {
      notifyError(
        "Email address is missing. Please go back and try again.",
        "Missing email",
      );
      return;
    }

    verifyCode(
      { email, otp: code },
      {
        onSuccess: () => {
          sessionStorage.removeItem("verify_email");
          router.push("/");
        },
        onError: (err) => {
          notifyError(
            err.message || "Invalid code. Please try again.",
            "Verification failed",
          );
          setDigits(Array(CODE_LENGTH).fill(""));
          inputRefs.current[0]?.focus();
        },
      },
    );
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const filledCount = digits.filter(Boolean).length;
  const isComplete = filledCount === CODE_LENGTH;

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
                Enter code
              </h1>
              <p className="paragraph text-black text-sm text-center">
                We&apos;ve sent an activation code to{" "}
                {email ? (
                  <span className="font-medium text-gray-900">{email}</span>
                ) : (
                  <span className="font-medium text-gray-400">your email</span>
                )}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-4"
            >
              {/* OTP Inputs */}
              <div className="flex items-center gap-3" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-full aspect-square max-w-16 text-center text-xl font-semibold rounded-2xl border-2 outline-none transition-all
                      ${digit ? "border-gray-900 bg-white" : "border-gray-200 bg-white"}
                      focus:border-gray-900
                    `}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Progress indicator */}
              <p className="text-xs text-gray-400 text-right">
                {filledCount}/{CODE_LENGTH} digits entered
              </p>

              <AuthButton
                isLoading={isPending}
                disabled={!isComplete || isPending}
              >
                Verify code
              </AuthButton>
            </form>
          </div>

          {/* Footer — resend */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <button
              type="button"
              onClick={handleResend}
              disabled={countdown > 0}
              className={`text-sm font-semibold transition-colors ${
                countdown > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-900 hover:text-[#FF5722]"
              }`}
            >
              Send code again
            </button>
            {countdown > 0 && (
              <span className="text-sm text-gray-400">
                {formatTime(countdown)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnterCodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FEEEE9]" />}>
      <EnterCodeContent />
    </Suspense>
  );
}
