"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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

  // Read email from sessionStorage (set by sign-up or resend-verification flows)
  useEffect(() => {
    const stored = sessionStorage.getItem("verify_email");
    if (!stored) {
      router.replace("/login");
      return;
    }
    setEmail(stored);
    // Do NOT remove here — keep it so resend can re-use it if needed
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
          sessionStorage.removeItem("verify_email"); // clean up on success
          router.push("/home");
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
    <div className="min-h-screen bg-white flex flex-col px-6 pt-10 pb-8 font-sans max-w-md mx-auto">
      <div className="mb-8">
        <BackButton onClick={() => router.back()} />
      </div>

      <div className="mb-8">
        <h1 className="hero-heading text-gray-900 mb-3">Enter code</h1>
        <p className="paragraph text-gray-500">
          We&apos;ve sent an email with an activation code to{" "}
          {email ? (
            <span className="font-medium text-gray-900">{email}</span>
          ) : (
            <span className="font-medium text-gray-400">your email</span>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="flex items-center gap-3 mb-6" onPaste={handlePaste}>
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
        <p className="text-xs text-gray-400 mb-4 text-right">
          {filledCount}/{CODE_LENGTH} digits entered
        </p>

        <AuthButton isLoading={isPending} disabled={!isComplete || isPending}>
          Verify code
        </AuthButton>
      </form>

      <div className="mt-auto pt-8 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleResend}
          disabled={countdown > 0}
          className={`paragraph-s font-semibold transition-colors ${
            countdown > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-900 hover:text-primary"
          }`}
        >
          Send code again
        </button>
        {countdown > 0 && (
          <span className="paragraph-s text-gray-400">
            {formatTime(countdown)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function EnterCodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <EnterCodeContent />
    </Suspense>
  );
}
