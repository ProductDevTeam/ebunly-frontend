# Product Filtering API

`GET /api/v1/products` (public) and `GET /api/v1/admin/products` (admin) filter
server-side. Pass query parameters rather than downloading the catalogue and
filtering in the browser.

> **The authority is the live spec**, not this file: `/api-docs.json` on the API
> host (Swagger UI at `/api-docs`). This page is a summary of the parameters the
> storefront uses, kept next to the code that builds them —
> [lib/products.js](lib/products.js).
>
> **Unknown parameters are ignored, not rejected.** A misspelt or retired filter
> name returns the full unfiltered list with a `200`, so a broken facet looks
> like a working one. Check a filtered `meta.total` against the unfiltered one
> when adding a parameter.

## Query parameters

| Parameter | Type | Notes |
| :--- | :--- | :--- |
| `page` | Number | Default 1 |
| `limit` | Number | Default 10 |
| `search` | String | Substring match on name or description |
| `coreCategory` | Enum | One of the eight taxonomy categories |
| `subcategory` | String | A subcategory or type name from the taxonomy |
| `recipients` | Array | Women, Men, Couples, Kids, Babies, Mothers, Fathers, Friends, Colleagues |
| `occasionTags` | Array | Birthday, Wedding, Graduation, … (28 values) |
| `styleTags` | Array | Luxury, Budget-Friendly, Wellness, Eco-Friendly, Funny, Romantic, Minimalist, Bold, Traditional, Modern |
| `budgetTier` | Enum | `₦3k & Under` … `₦50k+` |
| `minPrice` / `maxPrice` | Number | Base price bounds |
| `minDiscount` | Number | Percentage, e.g. `20` for 20 %+ |
| `madeInNigeria` | Boolean | |
| `maxDeliveryDays` | Number | |
| `featured` | Boolean | |
| `vendor` | String | Vendor ID |
| `sortBy` | Enum | `createdAt`, `basePrice`, `discountPercentage` |
| `sortOrder` | Enum | `asc`, `desc` |

Array parameters accept repeats (`?recipients=Women&recipients=Men`).

### Retired names

`occasions`, `giftTypes` and the `For_Him` / `Boxes_Hampers` style values date
from before the taxonomy landed. They match the legacy scalar `occasion` and
`giftType` fields, which are empty on current products, so they return **zero
results** rather than erroring. `occasions` → `occasionTags`; the "gift type"
concept was split into `recipients` and `coreCategory`; `styleTags` is new.

The results page (`/shop/categories/[id]`, with `all` as the unscoped shelf)
still accepts the old names in its URL and maps them across, so old links keep
working.

## Vocabularies

`GET /products/taxonomy` returns every facet's allowed values —
`categories` (with `subcategories[].types[]`), `recipients`, `occasions`,
`styleTags`, `budgetTiers`. The filter UI reads it through
[hooks/use-taxonomy.js](hooks/use-taxonomy.js) instead of hardcoding options, so
a tag the backend adds appears without a deploy.

## Response

```json
{
  "success": true,
  "message": "Success",
  "data": [ /* products */ ],
  "meta": { "page": 1, "limit": 12, "total": 45, "totalPages": 4 }
}
```

Use `meta.totalPages` for pagination controls.
