"use client";

import { useMutation } from "@tanstack/react-query";

// ── API base ───────────────────────────────────────
// Replace with your actual API base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.ebunly.com";

// ── API functions (commented out — wire up when ready) ────────────────

async function signUpApi(data) {
  // const res = await fetch(`${API_BASE}/auth/register`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) {
  //   const err = await res.json();
  //   throw new Error(err.message || "Sign up failed");
  // }
  // return res.json();

  // ── Mock for development ──
  await new Promise((r) => setTimeout(r, 1200));
  return { user: { email: data.email }, token: "mock-token" };
}

async function loginApi(data) {
  // const res = await fetch(`${API_BASE}/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) {
  //   const err = await res.json();
  //   throw new Error(err.message || "Login failed");
  // }
  // return res.json();

  // ── Mock for development ──
  await new Promise((r) => setTimeout(r, 1200));
  return { user: { email: data.email }, token: "mock-token" };
}

async function forgotPasswordApi(data) {
  // const res = await fetch(`${API_BASE}/auth/forgot-password`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) {
  //   const err = await res.json();
  //   throw new Error(err.message || "Failed to send code");
  // }
  // return res.json();

  // ── Mock for development ──
  await new Promise((r) => setTimeout(r, 1000));
  return { success: true };
}

async function verifyCodeApi(data) {
  // const res = await fetch(`${API_BASE}/auth/verify-code`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) {
  //   const err = await res.json();
  //   throw new Error(err.message || "Invalid code");
  // }
  // return res.json();

  // ── Mock for development ──
  await new Promise((r) => setTimeout(r, 1000));
  return { success: true };
}

// ── Hooks ──────────────────────────────────────────

export function useSignUp() {
  return useMutation({
    mutationFn: signUpApi,
    // onSuccess: (data) => {
    //   // Store token, redirect, etc.
    //   // localStorage.setItem("token", data.token);
    // },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: loginApi,
    // onSuccess: (data) => {
    //   // localStorage.setItem("token", data.token);
    // },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: forgotPasswordApi,
  });
}

export function useVerifyCode() {
  return useMutation({
    mutationFn: verifyCodeApi,
  });
}
