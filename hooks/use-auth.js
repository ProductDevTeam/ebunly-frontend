"use client";

import { useMutation } from "@tanstack/react-query";
import { apiPost } from "@/utils/api-fetch";

// ── Rate limiter (sessionStorage, per action) ──────────────────────────────
const RATE_LIMITS = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000, lockMs: 15 * 60 * 1000 },
  signUp: { maxAttempts: 3, windowMs: 60 * 60 * 1000, lockMs: 60 * 60 * 1000 },
  forgotPassword: {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
    lockMs: 60 * 60 * 1000,
  },
  verifyCode: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
    lockMs: 30 * 60 * 1000,
  },
};

function getStore(action) {
  try {
    const raw = sessionStorage.getItem(`rl_${action}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStore(action, data) {
  try {
    sessionStorage.setItem(`rl_${action}`, JSON.stringify(data));
  } catch {
    /* fail open */
  }
}

function clearStore(action) {
  try {
    sessionStorage.removeItem(`rl_${action}`);
  } catch {
    /* noop */
  }
}

function formatLockRemaining(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds} seconds`;
  const mins = Math.ceil(totalSeconds / 60);
  return `${mins} minute${mins !== 1 ? "s" : ""}`;
}

function checkRateLimit(action) {
  const cfg = RATE_LIMITS[action];
  if (!cfg) return;

  const now = Date.now();
  const store = getStore(action);

  if (store?.lockedUntil && now < store.lockedUntil) {
    throw new Error(
      `Too many attempts. Please try again in ${formatLockRemaining(store.lockedUntil - now)}.`,
    );
  }

  if (store?.firstAttempt && now - store.firstAttempt > cfg.windowMs) {
    clearStore(action);
  }

  const fresh = getStore(action) || { count: 0, firstAttempt: now };

  if (fresh.count + 1 > cfg.maxAttempts) {
    setStore(action, { ...fresh, lockedUntil: now + cfg.lockMs });
    throw new Error(
      `Too many attempts. Please try again in ${formatLockRemaining(cfg.lockMs)}.`,
    );
  }

  setStore(action, {
    count: fresh.count + 1,
    firstAttempt: fresh.firstAttempt ?? now,
  });
}

function resetRateLimit(action) {
  clearStore(action);
}

// ── Input sanitisation ─────────────────────────────────────────────────────
const sanitiseEmail = (email) => (email ?? "").trim().toLowerCase();
const sanitiseText = (value) => (value ?? "").trim();

// ── API functions ──────────────────────────────────────────────────────────

async function signUpApi(data) {
  checkRateLimit("signUp");
  const result = await apiPost("auth/register", {
    firstName: sanitiseText(data.firstName),
    lastName: sanitiseText(data.lastName),
    email: sanitiseEmail(data.email),
    password: data.password,
  });
  resetRateLimit("signUp");
  return result;
}

async function loginApi(data) {
  checkRateLimit("login");
  const result = await apiPost("auth/login", {
    email: sanitiseEmail(data.email),
    password: data.password,
  });
  resetRateLimit("login");
  return result;
}

async function forgotPasswordApi(data) {
  checkRateLimit("forgotPassword");
  const result = await apiPost("auth/forgot-password", {
    email: sanitiseEmail(data.email),
  });
  resetRateLimit("forgotPassword");
  return result;
}

async function verifyCodeApi(data) {
  checkRateLimit("verifyCode");
  const result = await apiPost("auth/verify-email", {
    email: sanitiseEmail(data.email),
    otp: sanitiseText(data.otp),
  });
  resetRateLimit("verifyCode");
  return result;
}

// ── Hooks ──────────────────────────────────────────────────────────────────

export function useSignUp() {
  return useMutation({ mutationFn: signUpApi });
}
export function useLogin() {
  return useMutation({ mutationFn: loginApi });
}
export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPasswordApi });
}
export function useVerifyCode() {
  return useMutation({ mutationFn: verifyCodeApi });
}
