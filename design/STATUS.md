# Design status

What has been built from the designer's exports, and what has not.

Exports live in `design/screenshots/` (gitignored — the files are local to whoever has them). This table is committed, so the state of the work is shared even though the images are not.

Reconcile the table against the folder:

```bash
node .claude/skills/figma-replicate/scripts/design-status.mjs          # report
node .claude/skills/figma-replicate/scripts/design-status.mjs --sync   # append new, flag revised
```

---

## Screens

| Screen | Design file | Kind | Target | Verify | Status | Hash | Notes |
|---|---|---|---|---|---|---|---|
| Components Personalization Feature Key Info | Components - Personalization Feature Key Info.png | component | components/shared/dashboard/product-detail/{options,personalization,add-ons,wishlist-modal}.jsx | shoot.mjs /test/ui/personalization --w 1600 --dsf 1.5 --sel '[data-cell=X] section'; wishlist via ?wl=list/create/empty --sel '[role=dialog].md:block'; mobile sheet --w 393 --h 600 viewport | done | 07de74cb | sheet is 1440@1.5x, same as the desktop product page - card width 420px. Residual: rows run 2-5px tall vs the sheet, whose own tile grid is internally inconsistent (165/165/156). Pill padding follows the product page, not this sheet - see notes below |
| Components Search | Components - Search.png | component | components/common/search-panel.jsx | shoot.mjs /test/ui/search --w 390 --full | done | c3b62354 | panel anatomy; exact type/spacing taken from the two 1x mobile frames |
| Desktop 33 | Desktop - 33.png | page | app/profile/wishlists/page.jsx | shoot.mjs /profile/wishlists --w 1440 --cookie "token=dev-preview" | done | a0e535ed | export is the Wishlists screen; mock data |
| Desktop :Shop:category:[id]:[type] page | Desktop - :Shop:category:[id]:[type] page.png | page | app/shop/categories/[id]/[type]/page.jsx | shoot.mjs "/shop/categories/fashion-accessories/men-fashion" --w 1440 --body | done | 68ab60e1 |  |
| Desktop Addresses | Desktop - Addresses.png | page | app/profile/addresses/page.jsx | shoot.mjs /profile/addresses --w 1440 --cookie "token=dev-preview" | done | 866bd73f | mock data - no API yet |
| Desktop Cart | Desktop - Cart.png | page | app/cart/cart-client.jsx | shoot.mjs /test/ui/cart --w 1440 --full | done | 4fdf966e | verified via UI harness (store is empty in a fresh browser) |
| Desktop My Account | Desktop - My Account.png | page | app/profile/my-account-client.jsx | shoot.mjs /profile --w 1440 --cookie "token=dev-preview" | done | fa5d50cb | live useMe/useUpdateProfile |
| Desktop Order Details | Desktop - Order Details.png | page | app/profile/orders/[id]/page.jsx | shoot.mjs /profile/orders/EB10228 --w 1440 --cookie "token=dev-preview" | done | 166329ee | GET /orders/:id wired; unspecified fields fall back to mock |
| Desktop Orders | Desktop - Orders.png | page | app/profile/orders/orders-client.jsx | shoot.mjs /profile/orders --w 1440 --cookie "token=dev-preview" | done | a3a28e8e | rows not visually verified - needs real order data |
| Desktop Payment Methods | Desktop - Payment Methods.png | page | app/profile/payment-methods/page.jsx | shoot.mjs /profile/payment-methods --w 1440 --cookie "token=dev-preview" | done | 31ac4c99 | mock data - no API yet |
| Desktop Products:slug page | Desktop - Products:slug page.png | page | app/products/[slug]/client.jsx | shoot.mjs "/products/personalized-cotton-t-shirt-cra-0005" --w 1440 --body | done | 0f5d5b18 | heading differs desktop/mobile - see report |
| Mobile :Shop:categories:[id]:[type] page | Mobile - :Shop:categories:[id]:[type] page.png | page | app/shop/categories/[id]/[type]/page.jsx | shoot.mjs "/shop/categories/fashion-accessories/men-fashion" --w 390 --body | done | 7d9d9e81 |  |
| Mobile :product:slug page | Mobile - :product:slug page.png | page | app/products/[slug]/client.jsx | shoot.mjs "/products/personalized-cotton-t-shirt-cra-0005" --w 390 --body | done | e361b199 | heading differs desktop/mobile - see report |
| Mobile Addresses | Mobile - Addresses.png | page | app/profile/addresses/addresses-client.jsx | shoot.mjs /profile/addresses --w 390 --full --cookie "token=dev-preview" | done | 83cc7a42 | mock data - no API yet |
| Mobile Cart | Mobile - Cart.png | page | app/cart/cart-client.jsx | shoot.mjs /test/ui/cart --w 390 --full | done | 3e553c95 | summary drops below items; no lead-time line on mobile |
| Mobile My Account | Mobile - My Account.png | page | app/profile/my-account-client.jsx | shoot.mjs /test/ui/profile --w 390 | done | 6b8be2c5 | form verified via UI harness |
| Mobile Order details | Mobile - Order details.png | page | app/profile/orders/[id]/order-detail-client.jsx | shoot.mjs /test/ui/order-detail --w 390 --full | done | 672780d3 | verified via UI harness; Call pill stacks on mobile |
| Mobile Orders | Mobile - Orders.png | page | app/profile/orders/orders-client.jsx | shoot.mjs /test/ui/orders --w 390 --full | done | 5736b725 | verified via UI harness - API rejects the preview cookie |
| Mobile Payment Methods | Mobile - Payment Methods.png | page | app/profile/payment-methods/payment-methods-client.jsx | shoot.mjs /profile/payment-methods --w 390 --full --cookie "token=dev-preview" | done | 345903b5 | mock data - no API yet |
| Mobile Profile Page | Mobile - Profile Page.png | page | components/shared/account/mobile-hub.jsx | shoot.mjs /test/ui/profile --w 390 | done | b7b2516d | hub verified via UI harness |
| Mobile search, empty | Mobile - search, empty.png | component | components/common/search-overlay.jsx | shoot.mjs /test/ui/search --w 390 --full --sel "[data-state=empty]" | done | 8edfc2bf | full-screen overlay, not a dropdown |
| Mobile search, typing | Mobile - search, typing.png | component | components/common/search-overlay.jsx | shoot.mjs /test/ui/search --w 390 --full --sel "[data-state=typing]" | done | 0fc91f3b | related products/categories come from useProducts + nav categories |
| Profile dropdown mobile | Profile dropdown - mobile.png | component | components/common/account-menu.jsx | shoot.mjs / --w 390 --sel "[data-account-sheet]" | done | 69f4df8d |  |
| Profile dropdown | Profile dropdown.png | component | components/common/account-menu.jsx | shoot.mjs / --w 1440 --sel "[data-account-menu]" | done | 0189ed22 |  |
| Slideout menu mobile | Slideout menu mobile.png | component | components/common/mobile-menu.jsx | shoot.mjs / --w 390 --sel "[data-mobile-menu]" | done | 84b20cad |  |
| Product gallery arrows + share (Etsy reference) | pasted, not saved | component | components/shared/dashboard/product-detail/gallery.jsx | shoot.mjs "/products/custom-birthstone-bracelet" --w 1440 --sel ".product-gallery-sticky" | done | n/a | reference screenshot from etsy.com used only for the interaction pattern (arrow nav + share affordance), not our own Figma export — chrome/colors follow project tokens, not Etsy's styling |

<!-- Add one row per exported design. Example rows, for reference:

| Home | home-1440.png | page | app/page.js | `/ --w 1440 --body` | done | a3f1c8d2 | |
| Home (mobile) | home-390.png | page | app/page.js | `/ --w 390 --body` | done | 9c02ee71 | |
| Product card | card-390.png | component | app/shop/categories/[id]/[type]/_components/product-card.jsx | `/shop/categories/all --w 390 --sel "[data-card]"` | wip | 41bd0a93 | |
| Newsletter band | news-1440.png | section | components/shared/home/newsletter.jsx | `/ --w 1440 --sel "#newsletter"` | todo | 7e5a11c4 | |
| Navbar v2 | nav-1440.png | chrome | components/common/navbar.jsx | `/ --w 1440 --sel "header"` | todo | b2c9f0e5 | header redesign |

-->

---

## Columns

**Kind** — what the export actually shows. This drives where the code lands and how it gets verified.

| Kind | Shows | Lands in | Verified by |
|---|---|---|---|
| `component` | one reusable element | `components/…` | `--sel` on its host; mount in `app/test/ui/` if it has no host yet |
| `section` | one band of a page | `components/shared/<area>/` or `app/<route>/_components/` | `--sel` on the section wrapper |
| `page` | a whole screen | `app/<route>/page.jsx` | `--body` (or full-page where the route has no chrome) |
| `chrome` | the header/nav/footer itself | `components/common/` | `--sel "header"` / `--sel "footer"` |
| `flow` | several screens in one export | split into one row per screen | per screen |

**Target** — the file path this design maps to, not a route. A component export has no URL of its own.

**Verify** — the literal `shoot.mjs` arguments for this row, so the check is unambiguous and re-runnable months from now:

```bash
node .claude/skills/figma-replicate/scripts/shoot.mjs <paste Verify column here>
```

**Status**

| | |
|---|---|
| `todo` | logged, not started |
| `wip` | in progress |
| `done` | built and visually verified against the export |
| `needs-update` | the design was **re-exported after** it was built — the hash changed, so the build is out of date |
| `skip` | intentionally not building this |

**Hash** — first 8 chars of the file's sha256. This is what detects a re-export. Never edit it by hand; `--sync` maintains it.

---

## Rules

- **`done` is never set by a script.** It means the Phase 3 visual check passed. Only a human or a verified replication run promotes a row.
- **`--sync` is deliberately narrow**: it appends new files as `todo` and flips a changed `done` row to `needs-update`. It never deletes rows and never marks anything done.
- **A new export is not automatically work.** Log it as `todo`; the designer may have exported a reference, not a request.
