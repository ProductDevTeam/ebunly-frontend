// ── All cart requests go through the proxy to forward auth cookies ──────────
const BASE = "/proxy/cart";

async function request(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // sends httpOnly auth cookie
  });

  const json = await res.json();

  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Cart request failed");
  }

  return json;
}

// ── GET /cart — fetch the current user's cart ────────────────────────────────
export async function getCart() {
  const json = await request(BASE);
  // Expected shape: { success, data: { items: [...], ... } }
  return json.data;
}

// ── POST /cart/items — add a product to cart ─────────────────────────────────
// payload: { productId, quantity, variants?, personalization? }
export async function addToCart(payload) {
  const json = await request(`${BASE}/items`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return json.data;
}

// ── PATCH /cart/items/:itemId — update quantity of a cart line ───────────────
export async function updateCartItem(itemId, quantity) {
  const json = await request(`${BASE}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
  return json.data;
}

// ── DELETE /cart/items/:itemId — remove a single item ────────────────────────
export async function removeCartItem(itemId) {
  const json = await request(`${BASE}/items/${itemId}`, {
    method: "DELETE",
  });
  return json.data;
}

// ── DELETE /cart — clear entire cart ─────────────────────────────────────────
export async function clearCart() {
  const json = await request(BASE, { method: "DELETE" });
  return json.data;
}
