// utils/api-fetch.js
// All API calls go through /api/proxy/* so the middleware can
// apply rate limiting, inject auth headers, and forward cookies.

function getCsrfToken() {
  if (typeof document === "undefined") return "";
  return document.querySelector('meta[name="csrf-token"]')?.content ?? "";
}

function parseApiError(json, status) {
  if (!json) return "Something went wrong. Please try again.";
  if (status === 429)
    return json.message || "Too many requests. Please slow down.";
  if (status === 503) return "Service unavailable. Please try again later.";
  if (Array.isArray(json.errors) && json.errors.length > 0) {
    return json.errors.map((e) => e.message).join(" · ");
  }
  return json.message || "Something went wrong. Please try again.";
}

/**
 * Sends a request through the Next.js middleware proxy.
 * @param {string} path  - API path e.g. "auth/login" (no leading slash needed)
 * @param {object} options - fetch options override
 */
export async function apiFetch(path, options = {}) {
  // Route through proxy — middleware strips /api/proxy and forwards to API_BASE
  const url = `/proxy/${path}`;

  const csrfToken = getCsrfToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      ...options.headers,
    },
    credentials: "include", // send httpOnly cookies
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    throw new Error(parseApiError(json, res.status));
  }

  return json;
}

export const apiGet = (path) => apiFetch(path, { method: "GET" });
export const apiPost = (path, body) =>
  apiFetch(path, { method: "POST", body: JSON.stringify(body) });
export const apiPatch = (path, body) =>
  apiFetch(path, { method: "PATCH", body: JSON.stringify(body) });
