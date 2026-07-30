// ── Server cart — all requests go through the proxy to forward auth cookies ──
// Endpoints (all auth-protected) per the API Swagger:
//   GET    /cart                — current user's cart (items + subtotal)
//   POST   /cart                — add a product (with options/variants/personalization)
//   PUT    /cart/{itemId}       — update a line (quantity, personalization)
//   DELETE /cart/{itemId}       — remove a line
//   POST   /cart/clear-all      — empty the cart in one call
const BASE = "/proxy/cart";

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // sends the auth cookie
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success === false) {
    throw new Error(json?.message || "Cart request failed");
  }

  return json;
}

// ── GET /cart — fetch the current user's cart ────────────────────────────────
// Returns: { items: [...], subtotal, ... }
export async function getCart() {
  const json = await request(BASE);
  return json.data;
}

// ── POST /cart — add a product to the cart ───────────────────────────────────
// payload: { productId, quantity, selectedOptions?, selectedVariants?, personalization? }
export async function addToCart(payload) {
  const json = await request(BASE, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return json.data;
}

// ── PUT /cart/:itemId — update a cart line ───────────────────────────────────
// patch: { quantity?, personalization? }
export async function updateCartItem(itemId, patch) {
  const json = await request(`${BASE}/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
  return json.data;
}

// ── DELETE /cart/:itemId — remove a single line ──────────────────────────────
export async function removeCartItem(itemId) {
  const json = await request(`${BASE}/${itemId}`, {
    method: "DELETE",
  });
  return json.data;
}

// ── POST /cart/clear-all — empty the cart ────────────────────────────────────
export async function clearCart() {
  const json = await request(`${BASE}/clear-all`, { method: "POST" });
  return json.data;
}
