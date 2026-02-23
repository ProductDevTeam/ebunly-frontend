"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

/**
 * RegistrationSuccessModal
 * Props:
 *  - isOpen: boolean
 *  - firstName: string
 *  - email: string
 *  - onClose: () => void
 */
export function RegistrationSuccessModal({
  isOpen,
  firstName = "",
  email = "",
  onClose,
}) {
  const router = useRouter();

  const handleContinue = () => {
    onClose?.();
    router.push(`/verify?email=${encodeURIComponent(email)}`);
  };

  // Auto-redirect after 8s
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(handleContinue, 8000);
    return () => clearTimeout(timer);
  }, [isOpen, email]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.88, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-6 pointer-events-none"
          >
            <div
              className="pointer-events-auto bg-white rounded-3xl shadow-2xl w-full max-w-sm px-8 py-10 flex flex-col items-center text-center"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* Envelope animation */}
              <div className="relative mb-6">
                <motion.span
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: [1, 1.22, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{ background: "#FFF3EE" }}
                />
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="relative w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF5722 0%, #FF8A65 100%)",
                  }}
                >
                  <motion.svg
                    width="38"
                    height="38"
                    viewBox="0 0 38 38"
                    fill="none"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                  >
                    <rect
                      x="5"
                      y="10"
                      width="28"
                      height="20"
                      rx="3"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <motion.path
                      d="M5 13L19 22L33 13"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        delay: 0.5,
                        duration: 0.45,
                        ease: "easeOut",
                      }}
                    />
                    <motion.circle
                      cx="28"
                      cy="12"
                      r="7"
                      fill="#4ADE80"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.7,
                        type: "spring",
                        stiffness: 300,
                      }}
                    />
                    <motion.path
                      d="M25 12L27.5 14.5L31 10"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.85, duration: 0.3 }}
                    />
                  </motion.svg>
                </motion.div>
              </div>

              {/* Heading */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-bold text-gray-900 mb-2"
                style={{ fontSize: "1.35rem", lineHeight: 1.3 }}
              >
                Check your inbox{firstName ? `, ${firstName}` : ""}!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-500 text-sm leading-relaxed mb-3"
              >
                We&apos;ve sent a 6-digit verification code to
              </motion.p>

              {/* Email pill */}
              {email && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.58 }}
                  className="mb-5 px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{ background: "#FFF3EE", color: "#FF5722" }}
                >
                  {email}
                </motion.div>
              )}

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="text-gray-400 text-xs leading-relaxed mb-7"
              >
                Enter the code in the next step to activate your account.
                <br />
                Don&apos;t forget to check your spam folder.
              </motion.p>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.72 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleContinue}
                className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm tracking-wide transition-opacity hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #FF5722 0%, #FF7043 100%)",
                }}
              >
                Enter verification code →
              </motion.button>

              {/* Auto-redirect progress */}
              <div
                className="mt-5 w-full h-1 rounded-full overflow-hidden"
                style={{ background: "#FFF3EE" }}
              >
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: 8, ease: "linear" }}
                  className="h-full rounded-full"
                  style={{ background: "#FF5722" }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Redirecting to verification automatically…
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
