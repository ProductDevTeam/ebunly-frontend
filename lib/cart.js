// ── Server cart — all requests go through the proxy to forward auth cookies ──
// Endpoints (all auth-protected) per the API Swagger:
//   GET    /cart                — current user's cart (items + subtotal)
//   POST   /cart                — add a product (with options/variants/personalization)
//   PUT    /cart/{itemId}       — update a line (quantity, personalization)
//   DELETE /cart/{itemId}       — remove a line
//   POST   /cart/clear-all      — empty the cart in one call
//
// Every one of them nests the cart a level deeper than the other resources —
// `{ success, data: { cart: { items, subtotal } } }`, not `{ data: { items } }`
// — so unwrap through `cartOf` rather than reading `json.data` directly. Reading
// one level too shallow yields `items === undefined`, which renders as an empty
// cart with no error anywhere.
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

/** Pulls the cart out of the response envelope, whichever depth it arrives at. */
function cartOf(json) {
  const data = json?.data ?? json ?? {};
  return data.cart ?? data;
}

// ── GET /cart — fetch the current user's cart ────────────────────────────────
// Returns: { items: [...], subtotal, itemCount }
export async function getCart() {
  return cartOf(await request(BASE));
}

// ── POST /cart — add a product to the cart ───────────────────────────────────
// payload: { productId, quantity, selectedOptions?, selectedVariants?, personalization? }
export async function addToCart(payload) {
  return cartOf(
    await request(BASE, { method: "POST", body: JSON.stringify(payload) }),
  );
}

// ── PUT /cart/:itemId — update a cart line ───────────────────────────────────
// patch: { quantity?, personalization? }
export async function updateCartItem(itemId, patch) {
  return cartOf(
    await request(`${BASE}/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    }),
  );
}

// ── DELETE /cart/:itemId — remove a single line ──────────────────────────────
export async function removeCartItem(itemId) {
  return cartOf(await request(`${BASE}/${itemId}`, { method: "DELETE" }));
}

// ── POST /cart/clear-all — empty the cart ────────────────────────────────────
export async function clearCart() {
  return cartOf(await request(`${BASE}/clear-all`, { method: "POST" }));
}
