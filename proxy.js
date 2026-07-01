import { NextResponse } from "next/server";

// ── Config ─────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.ebunly.com";

// Routes that don't require an auth token
const PUBLIC_ROUTES = new Set([
  "/register",
  "/login",
  "/forgot-password",
  "/verify-email",
]);

// App pages that require the user to be logged in
const PROTECTED_PAGES = [
  "/profile",
  "/orders",
  "/wishlist",
  "/favorites",
  "/checkout",
];

// App pages only accessible when NOT logged in
const GUEST_ONLY_PAGES = ["/login", "/sign-up", "/forgot-password", "/verify"];

// ── Helpers ────────────────────────────────────────────────────────────────
function getToken(request) {
  return (
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    null
  );
}

function isProtectedPage(pathname) {
  return PROTECTED_PAGES.some((p) => pathname.startsWith(p));
}

function isGuestOnlyPage(pathname) {
  return GUEST_ONLY_PAGES.some((p) => pathname.startsWith(p));
}

function isApiProxy(pathname) {
  return pathname.startsWith("/proxy/");
}

// ── Security headers ───────────────────────────────────────────────────────
function applySecurityHeaders(response) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload",
  );
  return response;
}

// ── In-memory rate limiter ─────────────────────────────────────────────────
const rateLimitStore = new Map();

const RATE_LIMIT_RULES = {
  "/login": { maxRequests: 5, windowMs: 15 * 60 * 1000 },
  "/register": { maxRequests: 3, windowMs: 60 * 60 * 1000 },
  "/forgot-password": { maxRequests: 3, windowMs: 60 * 60 * 1000 },
  "/verify-email": { maxRequests: 5, windowMs: 15 * 60 * 1000 },
  "/change-password": { maxRequests: 3, windowMs: 30 * 60 * 1000 },
  "/profile": { maxRequests: 20, windowMs: 60 * 1000 },
};

function checkServerRateLimit(ip, apiPath) {
  const rule = RATE_LIMIT_RULES[apiPath];
  if (!rule) return { limited: false };

  const key = `${ip}:${apiPath}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (entry) {
    if (now - entry.firstRequest > rule.windowMs) {
      rateLimitStore.set(key, { count: 1, firstRequest: now });
      return { limited: false };
    }
    if (entry.count >= rule.maxRequests) {
      const retryAfterMs = rule.windowMs - (now - entry.firstRequest);
      return { limited: true, retryAfterMs };
    }
    entry.count += 1;
    return { limited: false };
  }

  rateLimitStore.set(key, { count: 1, firstRequest: now });
  return { limited: false };
}

function pruneRateLimitStore() {
  const now = Date.now();
  const maxWindow = Math.max(
    ...Object.values(RATE_LIMIT_RULES).map((r) => r.windowMs),
  );
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.firstRequest > maxWindow) rateLimitStore.delete(key);
  }
}

// ── Upstream fetch with retry ──────────────────────────────────────────────
// Node's fetch (undici) pools connections. When the upstream (e.g. a Render
// instance that spun down while idle) destroys a keep-alive/HTTP2 session, a
// reused pooled socket fails immediately with "fetch failed" /
// ERR_HTTP2_INVALID_SESSION. Retrying transparently opens a fresh connection
// and also rides out cold-start latency. We only retry idempotent-safe
// transient network errors — never a real HTTP response.
async function fetchWithRetry(destination, options, retries = 2) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fetch(destination, options);
    } catch (err) {
      const transient =
        err?.cause?.code === "ERR_HTTP2_INVALID_SESSION" ||
        err?.cause?.code === "UND_ERR_SOCKET" ||
        err?.cause?.code === "ECONNRESET" ||
        err?.name === "TypeError"; // "fetch failed" wrapper
      if (!transient || attempt >= retries) throw err;
      // Small backoff so the pool can discard the dead socket.
      await new Promise((r) => setTimeout(r, 150 * (attempt + 1)));
    }
  }
}

// ── Proxy handler ──────────────────────────────────────────────────────────
async function handleProxy(request, pathname) {
  // Strip /proxy prefix
  const apiPath = pathname.replace(/^\/proxy\//, "");
  const search = request.nextUrl.search;
  const destination = `${API_BASE}/${apiPath}${search}`;

  console.log(destination);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Rate limit against the normalised API path
  const { limited, retryAfterMs } = checkServerRateLimit(ip, `/${apiPath}`);
  if (limited) {
    const retryAfterSecs = Math.ceil((retryAfterMs ?? 60000) / 1000);
    return applySecurityHeaders(
      NextResponse.json(
        {
          success: false,
          message: `Too many requests. Please try again in ${retryAfterSecs} seconds.`,
        },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSecs) },
        },
      ),
    );
  }

  const token = getToken(request);

  const forwardHeaders = new Headers();
  // Preserve the incoming Content-Type so multipart/form-data boundaries
  // survive (e.g. the avatar upload on PUT /profile). JSON callers still send
  // application/json, so existing requests are unaffected.
  const incomingContentType = request.headers.get("content-type");
  if (incomingContentType)
    forwardHeaders.set("Content-Type", incomingContentType);
  forwardHeaders.set("Accept", "application/json");
  forwardHeaders.set("X-Forwarded-For", ip);
  forwardHeaders.set("X-Forwarded-Host", request.headers.get("host") || "");

  if (token) forwardHeaders.set("Authorization", `Bearer ${token}`);

  const csrfToken = request.headers.get("x-csrf-token");
  if (csrfToken) forwardHeaders.set("X-CSRF-Token", csrfToken);

  try {
    // Forward raw bytes rather than re-serialising as text — works for JSON
    // and binary/multipart bodies alike without mangling the boundary.
    const body =
      request.method !== "GET" && request.method !== "HEAD"
        ? await request.arrayBuffer()
        : undefined;

    const apiResponse = await fetchWithRetry(destination, {
      method: request.method,
      headers: forwardHeaders,
      body,
    });

    const responseData = await apiResponse.text();

    const proxiedResponse = new NextResponse(responseData, {
      status: apiResponse.status,
      headers: {
        "Content-Type":
          apiResponse.headers.get("Content-Type") || "application/json",
      },
    });

    // ✅ Forward ALL Set-Cookie headers using getSetCookie() array
    // This replaces the old single .get("set-cookie") approach which
    // only returned the first cookie and used .set() (overwrites).
    const setCookies = apiResponse.headers.getSetCookie?.() ?? [];
    setCookies.forEach((cookie) => {
      proxiedResponse.headers.append("Set-Cookie", cookie);
    });

    return applySecurityHeaders(proxiedResponse);
  } catch (err) {
    console.error("[Proxy Error]", err);
    return applySecurityHeaders(
      NextResponse.json(
        { success: false, message: "Service unavailable. Please try again." },
        { status: 503 },
      ),
    );
  }
}

// ── Main export — Next.js 16 proxy convention ──────────────────────────────
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  pruneRateLimitStore();

  // 1. Handle API proxy requests
  if (isApiProxy(pathname)) {
    return handleProxy(request, pathname);
  }

  const token = getToken(request);

  // 2. Redirect unauthenticated users away from protected pages
  if (isProtectedPage(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return applySecurityHeaders(NextResponse.redirect(loginUrl));
  }

  // 3. Redirect authenticated users away from guest-only pages
  if (isGuestOnlyPage(pathname) && token) {
    return applySecurityHeaders(
      NextResponse.redirect(new URL("/", request.url)),
    );
  }

  // 4. Pass through with security headers
  return applySecurityHeaders(NextResponse.next());
}

// ── Matcher ────────────────────────────────────────────────────────────────
export const config = {
  matcher: [
    "/proxy/:path*",
    "/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/favorites/:path*",
    "/checkout/:path*",
    "/login",
    "/sign-up",
    "/forgot-password",
    "/verify",
  ],
};
