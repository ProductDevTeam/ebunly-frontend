# Component inventory

Assemble screens from these before writing anything new. Paths are from the project root, importable via the `@/` alias.

Every component is a **default export** unless marked otherwise. All are `.jsx`.

---

## Layout & chrome

| Component | Path | Props |
|---|---|---|
| `Navbar` | `components/common/navbar.jsx` | `categories` (falls back to a built-in list), `showMobileSearch = true` |
| `NavbarServer` | `components/common/navbar-server.jsx` | server wrapper that feeds `Navbar` |
| `Footer` | `components/common/footer.jsx` | none |
| `Breadcrumb` | `components/common/breadcrumb.jsx` | `items: [{label, href?}]` — last item renders unlinked as current page; `className` |
| `DesktopHeader` | `components/shared/desktop-header.jsx` | `value = "personal"`, `onChange` |
| `MobileHeader` | `components/shared/mobile-header.jsx` | `value = "personal"`, `onChange` |
| `ScrollReveal` | `components/common/scroll-reveal.jsx` | none — mount once per page to activate `.reveal*` classes |

Note there are **two** `DesktopHeader`s: the top-level one above, and `components/shared/dashboard/desktop-header.jsx` with the same signature. Check which one the page already imports before adding an import.

## Product

| Component | Path | Props |
|---|---|---|
| `ProductCard` | `components/common/product-card.jsx` | `product`, `sizes` — the one card used across the site (homepage rail, category grids); expects `normalizeProduct`'s `{price, image, images}` shape, not raw API fields |
| `ProductGrid` | `components/shared/dashboard/product-grid.jsx` | `products = []`, `isLoading`, `isError`, `error`, `pagination` — includes its own skeleton and empty states |
| `RelatedProducts` | `.../product-detail/related.jsx` | `products`, `className` |
| `ImageGallery` | `.../product-detail/gallery.jsx` | `images`, `product` |
| `ProductOptions` | `.../product-detail/options.jsx` | `product`, `selectedOptions`, `onOptionChange` |
| `ProductPersonalization` | `.../product-detail/personalization.jsx` | `value`, `onChange`, `types`, `colors` |
| `ProductDescription` | `.../product-detail/description.jsx` | `description` |
| `ProductKeyInfo` | `.../product-detail/info.jsx` | `keyInfo` |
| `AddToCartSection` | `.../product-detail/add-to-cart.jsx` | `product`, `selectedOptions`, `personalization`, `deliveryDate`, `onOptionChange` — mobile |
| `AddToCartDesktop` | `.../product-detail/desktop-cart.jsx` | same shape — desktop |

`.../product-detail/` = `components/shared/dashboard/product-detail/`

## Discovery & filtering

| Component | Path | Props |
|---|---|---|
| `SearchBar` | `components/shared/dashboard/search-bar.jsx` | `onSearch`, `onRestoreFilters`, `initialValue`, `className` — wired to search history |
| `FilterBar` | `components/shared/dashboard/filterbar.jsx` | `onFilterChange`, `externalFilters` |
| `MobileFilter` | `components/shared/dashboard/mobile-filter.jsx` | — |
| `MobileFilterSheet` | `components/shared/dashboard/mobile-filter-sheet.jsx` | `activeFilter`, `onClose`, `onFilterChange`, `currentFilters` |
| `Sidebar` | `components/shared/dashboard/sidebar.jsx` | `isOpen`, `setIsOpen`, `visible = true` |

## Forms, modals, feedback

| Component | Path | Props |
|---|---|---|
| `AuthInput` *(named)* | `components/common/auth/input.jsx` | `label`, `type`, `placeholder`, `value`, `onChange`, `error`, `name`, `autoComplete` — handles password show/hide itself |
| `AuthButton` *(named)* | same file | `children`, `isLoading`, `type = "submit"`, `onClick`, `variant = "primary"` |
| `OrDivider`, `GoogleButton`, `AuthFooter` *(named)* | same file | `label` · `label, onClick, isLoading` · `text, linkText, href` |
| `RegistrationSuccessModal` *(named)* | `components/common/auth/success-modal.jsx` | `isOpen`, `firstName`, `email`, `onClose` |
| `CheckoutModal` | `components/cart/checkout-modal.jsx` | `open`, `onClose`, `onSuccess` |
| `FavoriteButton` | `components/common/favorite-button.jsx` | `product`, `className`, `size = 22`, `aria-label` — owns its own wishlist state |
| `LiveBasket` | `components/common/livebasket.jsx` | `isExpanded`, `onToggle`, `notifications = []`, `onDismiss` |

The auth file exports are **named, not default** — `import { AuthInput, AuthButton } from "@/components/common/auth/input"`.

## Home sections

`components/shared/home/` — `hero`, `carousal`, `gift-basket`, `who-gifting`, `budget`, `group-gifting`, `newsletter`, `cta`. Mostly self-contained; read one before assuming its props.

---

## Hooks — wire behavior, don't reimplement it

All in `hooks/`, all named exports.

| Hook | Returns / purpose |
|---|---|
| `useCart()` | `{ addItem, increment, decrement, getCartItem, hydrated, ... }`. `toCartProduct(p)` from the same file normalizes an API product into cart shape. |
| `useWishlist()` | `{ hydrated, isLoggedIn, items, toggle, remove, has(id) }` |
| `useNotification()` | from `components/common/notification-provider.jsx` — `{ notify, success, ... }`. Provider is already mounted in `app/layout.js`. |
| `useProducts(filters, options)` / `useProduct(id, options)` | react-query product fetching |
| `useOrders(params)`, `useCancelOrder()`, `useCheckout()`, `groupOrdersByYear(orders)` | |
| `useMe()`, `useUpdateProfile()`, `hasAuthToken()` | profile / auth state |
| `useSignUp()`, `useLogin()`, `useGoogleAuth()`, `useForgotPassword()`, `useVerifyCode()`, `useLogout()` | auth flows |
| `useSearchHistory()`, `buildFilterSummary(filters)` | |
| `useDebounce(value, delay = 500)` | |

Stores (zustand, persisted): `useCartStore`, `useWishlistStore`, `useAuthStore` + `getDisplayName(user)`.

**Hydration:** the persisted stores expose a `hydrated` flag. Components that read them render the logged-out / empty markup during SSR and swap after hydration — follow that pattern (see `navbar.jsx` and `favorite-button.jsx`) rather than reading the store directly on first paint.

---

## Where new files go

- Route-specific, used once → `app/<route>/_components/`
- Shared across a feature area → `components/shared/<area>/`
- Shared app-wide → `components/common/`

Filenames are `kebab-case.jsx`.
