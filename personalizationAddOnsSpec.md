# Personalization & "Complete the Gift" — what the storefront needs

Two product-detail features are built and designed but have no working data
contract behind them. One of them silently loses customer input **after
payment**, which is the part worth reading first.

Everything below was verified against the live API on **2026-08-05** using a
freshly registered, verified customer account. Where I am proposing rather than
reporting, it says so.

---

## Summary

| | Options shown to the customer | Value reaches the cart | Value reaches the order |
|---|---|---|---|
| **Personalization** | invented by the frontend | ✅ yes | ❌ **dropped** |
| **Complete the Gift** (add-ons) | invented by the frontend | ❌ never sent | ❌ no |

**The urgent one is personalization.** A customer can type an engraving, see it
confirmed in their cart, pay for it, and the vendor never receives it. That is
a fulfilment failure on a paid order, not a cosmetic gap.

---

## 1. Personalization

### 1a. The engraving text is lost at checkout — bug

`POST /cart` accepts it and `GET /cart` echoes it back intact:

```jsonc
// GET /cart → data.cart.items[0]
{
  "personalization": {
    "text": "To the best sister",
    "textColor": "Gold",
    "fontStyle": "Font O2"
  },
  "quantity": 1, "unitPrice": 10000, …
}
```

Then `POST /orders/checkout` on that exact cart produces an order line with no
personalization at all:

```jsonc
// GET /orders/{id} → items[0] — keys, verbatim
["basePrice","optionsTotal","product","productImage","productName",
 "quantity","selectedOptions","selectedVariants","totalPrice","unitPrice",
 "variantsTotal","vendor"]
// personalization: absent
```

Note `selectedOptions` and `selectedVariants` *do* survive that hop —
personalization is the only one that does not.

**Needed:** carry `personalization` from the cart line onto the order line, and
return it from `GET /orders/{id}` (and in whatever the vendor/admin order view
reads). If it is already persisted and merely unserialized, serializing it is
the whole fix.

### 1b. The options offered are invented

The storefront reads `product.personalizationTypes`. **No product has that
field.** All 9 products in the catalogue return:

```jsonc
{
  "isPersonalizable": false,      // real — the UI does gate the card on this
  "personalizationType": "none",  // singular string, "none" on every product
  "personalizationOptions": []    // empty on every product
}
```

With the field missing, the component falls back to a hardcoded list —
**Engraving (+2 days), Print-on, Sticker** — including the "+2 days to
delivery" promise. Those three names, and that lead time, exist only in our
source. Only one product (`Custom Birthstone Bracelet`) has
`isPersonalizable: true`, so the card is nearly always hidden, which is what has
kept this from being obvious.

### 1c. There is already a real field we do not render

`customizationOptions` is populated and well-typed, and nothing in the
storefront reads it:

```jsonc
"customizationOptions": [
  { "name": "Front Design", "type": "select", "required": true,
    "options": ["Photo Only", "Text Only", "Photo + Text"], "priceModifier": 0 },
  { "name": "Upload Photo", "type": "image", "required": false,
    "options": [], "maxImages": 1 }
]
```

**Open question — please answer this one first, it changes the rest:** is
`customizationOptions` the intended mechanism for personalization? If so we
should render it and drop `personalizationTypes` from our side entirely, and the
only thing needed from the backend is a per-option lead-time field (below). If
it is meant for something else, we need the shape in §1d.

### 1d. Proposed shape, if personalization stays separate

On the product:

```jsonc
"isPersonalizable": true,
"personalizationTypes": [
  { "name": "Engraving", "extraDays": 2, "priceModifier": 0, "maxLength": 40 },
  { "name": "Print-on",  "extraDays": 0, "priceModifier": 500 },
  { "name": "Sticker",   "extraDays": 0, "priceModifier": 0 }
]
```

- `name` — shown on the pill and echoed back in `personalization.type`
- `extraDays` — drives "Engraving adds 2 days to delivery", currently hardcoded
- `priceModifier` — optional; if omitted we treat it as 0 and show no price change
- `maxLength` — optional; we cap the input rather than letting the API reject it

On the cart line, `personalization` needs one more field so the choice is
recoverable:

```jsonc
"personalization": {
  "type": "Engraving",          // NEW — which type was chosen
  "text": "To the best sister",
  "textColor": "Gold",
  "fontStyle": "Font O2"
}
```

Today `type` is not in the accepted body, so the cart records *what was written*
but not *how it should be applied*. The vendor cannot act on that.

---

## 2. Complete the Gift (add-ons)

### 2a. There is no data model at all

The storefront reads `product.addOns`. It does not exist — and no field under
any similar name exists on any product. I checked every key across the whole
catalogue; the only near-match is `giftType`, which is an unrelated legacy
scalar.

So **the entire add-on catalogue is invented by the frontend**: the three
categories (Flowers, Card, Teddy), their filter tabs, every design, and every
price — Red roses ₦5,000, Rose bouquet ₦15,000, Large teddy ₦25,000, and the
rest. Those numbers are ours, not yours.

### 2b. The selection is discarded before it leaves the browser

Worse than mock: the customer's choice is never transmitted.

```
product page   const [addOns, setAddOns] = useState({})   ← held in React state
               <AddToCartDesktop … />                     ← addOns not passed
POST /cart     productId, quantity, selectedOptions,
               selectedVariants, personalization          ← no add-on field
POST /orders/checkout
               shippingAddress, billingAddress, notes     ← no add-on field
```

A customer picks "Rose bouquet, ₦5,000", sees it confirmed as a chip on the
product page, adds to cart, checks out and pays — and nothing about that add-on
is sent, stored, priced or ordered. The money is not collected and the vendor
has no idea it was requested.

### 2c. Proposed contract

**On the product** — which add-ons this product offers:

```jsonc
"addOns": [
  {
    "key": "flowers",
    "label": "Flowers",
    "hasMessage": false,
    "categories": ["All", "Bouquets", "Roses", "Tulips"],
    "designs": [
      { "id": "f1", "name": "Red roses", "price": 5000,
        "category": "Roses", "image": "https://…" }
    ]
  },
  {
    "key": "card",
    "label": "Card",
    "hasMessage": true,      // renders the "Your Message" box, 200 char limit
    "categories": ["All", "Birthday", "Valentine's", "Anniversary", "Christmas"],
    "designs": [ … ]
  }
]
```

`hasMessage` is the only per-type behaviour the design distinguishes: cards get
a message box, flowers and teddies do not.

If add-ons are global rather than per-product, `GET /add-ons` returning the same
array works just as well for us — say which, and whether availability varies by
product or vendor.

**On the cart line** — add one field to `POST /cart` and `PUT /cart/{itemId}`:

```jsonc
"addOns": [
  { "key": "card", "designId": "c1", "message": "Happy birthday!" },
  { "key": "flowers", "designId": "f3" }
]
```

We send `designId`, not a price — the server should price it from the catalogue
so the client cannot dictate cost. Echo the resolved add-ons back on the cart
line with their prices, the way `selectedVariants` already comes back with
`priceModifier`:

```jsonc
"addOns": [
  { "key": "card", "designId": "c1", "name": "Birthday 1",
    "price": 5000, "message": "Happy birthday!" }
],
"addOnsTotal": 5000
```

**On the order line** — the same array must survive checkout and be readable by
the vendor. This is the same hop personalization currently falls down.

---

## 3. Pricing

Both features change what is owed, so the server has to own the arithmetic:

- `unitPrice` should include add-on and personalization price modifiers, the way
  it already includes `variantsTotal` and `optionsTotal`
- an `addOnsTotal` per line, mirroring the existing `variantsTotal`, lets the
  cart show a breakdown without recomputing
- `extraDays` on the chosen personalization type should feed the order's
  delivery estimate, not just the product page copy

The storefront currently displays add-on prices from its own hardcoded
catalogue. Once the API prices them, we will read the server's numbers
everywhere and stop showing our own.

---

## 4. What the storefront does in the meantime

- **Personalization** stays visible. It is gated on the real `isPersonalizable`
  flag, the input works, and the value reaches the cart — the only fabricated
  part is the list of types. Once §1a is fixed it is genuinely end-to-end.
- **Complete the Gift** should be hidden until §2 lands. It currently accepts
  money-shaped input and drops it, which is worse than not offering it. Say the
  word and I will put it behind a flag that switches on when `product.addOns`
  is present, so it lights up on its own the moment the field appears.

## 5. Priority

1. **§1a — carry personalization onto the order.** Live paid orders are losing
   customer input right now.
2. **§1c — answer whether `customizationOptions` is the intended mechanism.**
   Cheap to answer, and it decides how much of §1d is needed.
3. **§2 — the add-on model.** Larger, and the storefront can hide the feature
   until it exists.
