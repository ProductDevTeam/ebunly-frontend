# Design tokens

Source of truth: [app/globals.css](../../../../app/globals.css) and [app/layout.js](../../../../app/layout.js). Tailwind **v4** — tokens live in `@theme inline`, there is no `tailwind.config.js`.

When a value you read from a screenshot appears in these tables, **write the token**. When it does not, write an arbitrary value and mark it `NEW`. Never round a design value to a near-miss token.

---

## Colors

| Hex in design | Write | Notes |
|---|---|---|
| `#d85a30` | `text-primary` `bg-primary` `border-primary` | Brand orange. The only brand color in the theme. |
| `#333333` | `text-text-new-gray` | Class name is literally `text-text-new-gray` (token is `--color-text-new-gray`). |
| `#444444` | `text-text-dark-gray` | |
| `#707070` | `text-text-gray` | Muted / secondary copy. |
| `#171717` | `text-foreground` | Default body text. |
| `#ffffff` | `bg-background` / `bg-white` | |

Gradient: `#fbf1dc → #fac5a0`, 90deg — use `.hero-gradient`.

Anything else (`#F5F5F5` card wells, `#0C0000` icon fills, etc.) has no token today and appears as arbitrary values throughout the codebase. That is expected — use `bg-[#F5F5F5]` and mark it `NEW`.

---

## Type scale

These classes set size, weight, letter-spacing and line-height together, **and carry their own ≤768px override**. Using one gives you the responsive behavior for free; hand-rolling `text-[32px] tracking-[-0.04em]` does not.

| Class | Desktop | ≤768px |
|---|---|---|
| `.hero-heading` | 60px · -6% · 91% · 600 | 47px · -2% · 91% |
| `.heading-1` | 32px · -0.04em · 140% · 600 | 18px · -0.02em · 120% |
| `.heading-1-mod` | 32px · -0.04em · 600 · *no line-height* | 18px · -0.02em |
| `.heading-2` | 24px · -0.02em · 140% · 600 | 18px · -0.02em · 120% |
| `.paragraph` | 16px · 0 · 140% · 400 | 14px |
| `.paragraph-s` | 14px · 0 · 140% · 400 | 12px |
| `.small` | 12px · -0.02em · 140% · 400 | 10px · -0.02em |
| `.hero-p` | 18px · -2% · 120% | — |

Reading the table: *size · letter-spacing · line-height · weight*.

**Matching rule.** If the desktop design shows 24px/-0.02em/140% semibold → `.heading-2`. If it shows 24px/-0.02em/140% but **regular** weight, that is not `.heading-2` — the class hardcodes 600. Use arbitrary values and mark `NEW`.

**The mobile shortcut.** If the designer gives you both a desktop and a mobile frame and the pair matches a row above (e.g. 32px → 18px), one class covers both. Do not add a `md:` override on top of it — you will fight the media query.

---

## Fonts

Loaded in [app/layout.js](../../../../app/layout.js), applied on `<body>`.

| Class | Font | Where it's used today |
|---|---|---|
| `font-sans` | DM Sans | Default for everything (~53 uses) |
| `font-serif` | PT Serif | Rare accent |
| `font-playfair` | Playfair Display | Rare display accent |
| `font-panchang` | Panchang (local variable, `public/fonts/`) | Display headings |

If a heading in the design is visibly not DM Sans, it is most likely Panchang — check the letterforms before assuming Playfair.

> Landmine: `globals.css` also sets `body { font-family: Arial, Helvetica, sans-serif }`. The `font-sans` class on `<body>` wins on specificity, so DM Sans renders. If text ever shows up as Arial, that rule is why.

---

## Breakpoint convention

The designer's cut is **768px** — every override in globals.css uses `@media (max-width: 768px)`. Tailwind's `md:` is `min-width: 768px`, so `md:` and the CSS overrides align.

- Mobile-first utility, desktop override: `text-[14px] md:text-[16px]`
- Screenshot widths to verify at: **390** (mobile) and **1440** (desktop)

Only introduce `sm:`, `lg:`, or `xl:` if you were given a frame at that width. `lg:` does appear in existing dashboard grids — follow the local file when editing one.

---

## Utility classes already available

Reach for these before writing new CSS.

**Motion / reveal** — mount `<ScrollReveal />` ([components/common/scroll-reveal.jsx](../../../../components/common/scroll-reveal.jsx)) once on the page; it toggles `.is-visible` via IntersectionObserver.

- `.reveal` `.reveal-sm` `.reveal-left` `.reveal-right` `.reveal-scale`
- Stagger: `.reveal-d1` … `.reveal-d6` (40ms steps), plus `.reveal-d-60/100/120/150`
- Above-fold, no observer needed: `.hero-animate-text` `.hero-animate-sub` `.hero-animate-cta` `.hero-animate-image`
- `.star-reveal` / `.star-reveal-neg` — decorative star rotations

**Layout / behavior**

- `.scrollbar-hide` — hides scrollbar, keeps scrolling
- `.safe-area-top` / `.safe-area-bottom` — iOS insets
- `.mobile-content-padding` — clears the mobile bottom nav (≤1023px)
- `.bottom-nav-item`, `.bottom-nav-blur` — bottom nav transition + backdrop blur
- `.section-lazy` — `content-visibility: auto` for off-screen sections
- `.skeleton` — shimmer placeholder
- `.hero-gradient`, `.stretch-text`

`prefers-reduced-motion` is already handled globally — do not re-implement it per component.

Only add animation classes when the motion is **visible in the design or explicitly requested**.
