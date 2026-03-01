# Product Filtering API Documentation

The `GET /api/v1/products` and `GET /api/v1/admin/products` endpoints now support advanced server-side filtering. Instead of downloading all products and filtering them on the frontend, you should pass these query parameters to the backend to get a paginated, filtered list of products.

## Endpoint Overview

**Endpoint**: `GET /api/v1/products` (Public) or `GET /api/v1/admin/products` (Admin)

### Supported Query Parameters

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `page` | Number | Page number for pagination (default: 1) | `?page=2` |
| `limit` | Number | Items per page (default: 10) | `?limit=12` |
| `search` | String | Substring search on product name or description | `?search=cake` |
| `vendor` | String | Filter products by a specific Vendor ID | `?vendor=64a2c4...` |
| `category` | String | Filter products by Category ID | `?category=64a2c4...` |
| `minPrice` | Number | Minimum base price threshold | `?minPrice=5000` |
| `maxPrice` | Number | Maximum base price threshold | `?maxPrice=25000` |
| `minDiscount` | Number | Minimum discount percentage (e.g., 20 for 20%+) | `?minDiscount=20` |
| `madeInNigeria` | Boolean | Filter explicitly by Made in Nigeria status | `?madeInNigeria=true` |
| `maxDeliveryDays` | Number | Maximum allowed estimated delivery days | `?maxDeliveryDays=3` |

### Array Parameters (Multiple Values)

For filters that allow multiple selections (like Checkboxes), you can send them as repeated query parameters, or as a single comma-separated string.

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `occasions` | Array | Filter by one or more occasions | `?occasions=Birthday&occasions=Wedding` <br> _or_ <br> `?occasions=Birthday,Wedding` |
| `giftTypes` | Array | Filter by one or more gift types | `?giftTypes=For_Him&giftTypes=Cooperate` |

## Example Frontend Implementation (React / Axios / Fetch)

Here is a recommended way to build the query from a frontend state using `URLSearchParams`:

```typescript
async function fetchProducts(filters: any) {
  const queryParams = new URLSearchParams();
  
  // Basic pagination & search
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.search) queryParams.append('search', filters.search);
  
  // Single-value filters
  if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
  if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
  if (filters.madeInNigeria !== undefined) queryParams.append('madeInNigeria', filters.madeInNigeria.toString());
  
  // Array filters (Checkboxes)
  if (filters.occasions && filters.occasions.length > 0) {
    filters.occasions.forEach(occ => queryParams.append('occasions', occ));
  }
  
  const response = await fetch(`/api/v1/products?${queryParams.toString()}`);
  const data = await response.json();
  
  return data;
}
```

## Response Format

The API returns a paginated response. Be sure to use `meta.totalPages` to build your pagination controls.

```json
{
  "success": true,
  "message": "Success",
  "data": [
    { /* Product 1 */ },
    { /* Product 2 */ }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```
