"use server";

import { cookies } from "next/headers";

export async function login(credentials) {
  try {
    const response = await fetch(
      "https://craft-basket-server.onrender.com/api-docs/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        status: "failed",
        error: error.message || "Invalid credentials",
      };
    }

    const data = await response.json();

    /**
     * Example response:
     * {
     *   accessToken: "...",
     *   refreshToken: "...",
     *   user: {...}
     * }
     */

    // ✅ Store token securely (server-only)
    cookies().set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return {
      status: "ok",
      user: data.user,
    };
  } catch (error) {
    return {
      status: "failed",
      error: "Login failed",
    };
  }
}
