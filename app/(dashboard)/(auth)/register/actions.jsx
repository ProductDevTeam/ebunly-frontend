"use server";

export async function register(formData) {
  try {
    const response = await fetch(
      "https://craft-basket-server.onrender.com/api-docs/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        cache: "no-store", // recommended for auth
      },
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        status: "failed",
        error,
      };
    }

    const data = await response.json();

    return {
      status: "ok",
      data,
    };
  } catch (error) {
    return {
      status: "failed",
      error: error.message,
    };
  }
}
