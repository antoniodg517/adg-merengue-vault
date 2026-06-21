# 07 — API Contracts

> **Document status:** Official reference for Claude Code & Claude Design.
> **Project:** ADG Merengue Vault
> **Last updated:** 2026-06-20

Defines how the frontend reads/writes data. The backend is **Supabase**; two access patterns are supported and both are documented:

- **A — Supabase client (recommended):** the Next.js app talks to Supabase directly using `@supabase/supabase-js` (anon key on the client for public reads via the `cards_public` view; service/admin actions through authenticated server actions). RLS (doc 04) enforces security.
- **B — Next.js Route Handlers:** thin REST endpoints under `/api/*` that wrap Supabase server-side (useful for validation, hiding keys, and shaping responses). Contracts below are written REST-style and map 1:1 onto Supabase queries.

All responses are JSON. All write endpoints require an authenticated admin (RLS + `is_admin()`).

---

## 1. Conventions

- Base path: `/api`
- Auth: Supabase session cookie (admin routes). Public GETs are open.
- Errors: `{ "error": { "code": string, "message": string, "details"?: any } }` with appropriate HTTP status (400 validation, 401 unauth, 403 forbidden, 404 not found, 500 server).
- Timestamps: ISO 8601 UTC.
- Money: numbers (2 decimals); `currency` ISO code.
- Pagination: `?page` (1-based) + `?limit` (default 24, max 100) → response includes `meta: { page, limit, total }`.

---

## 2. Cards — public reads

### `GET /api/cards`
List cards (from `cards_public` view; cost basis excluded).

**Query params:**
| Param | Type | Notes |
|-------|------|-------|
| `q` | string | Full-text search (player/brand/set/number/season) |
| `player` | string | exact/`ilike` filter on `player_name` |
| `team` | string | filter `team` |
| `season` | string | |
| `brand` | string | |
| `product_line` | string | |
| `card_type` | enum | `card_type` value |
| `graded` | boolean | |
| `grading_company` | enum | |
| `grade` | string | `grade_value` |
| `ownership_status` | enum | |
| `is_grail`, `is_rookie`, `is_autograph`, `is_patch`, `is_one_of_one`, `featured` | boolean | flag filters |
| `sort` | enum | `newest`(default) \| `oldest` \| `value_desc` \| `value_asc` \| `player_az` \| `rarity` |
| `page`, `limit` | int | pagination |

**200 response:**
```json
{
  "data": [ { /* PublicCard */ } ],
  "meta": { "page": 1, "limit": 24, "total": 137 }
}
```

`PublicCard` = all fields from `cards_public` (doc 04 §8) — i.e. the card model **minus** `purchase_price`, `purchase_date`, `currency`, `source` (hidden by default privacy setting; `estimated_value`/`last_sale_value` shown per setting).

### `GET /api/cards/[id]`
Single card detail (public view).
- **200:** `{ "data": { /* PublicCard */ } }`
- **404:** not found.

### `GET /api/cards/featured`
Convenience: `featured = true`, limited (homepage). → `{ "data": [PublicCard] }`

### `GET /api/cards/latest`
Most recent by `created_at` (homepage "Latest Pickups"). `?limit=8`.

---

## 3. Grails

### `GET /api/grails`
Cards where `is_grail = true`, sorted by `featured` then `created_at desc`.
→ `{ "data": [PublicCard] }`

---

## 4. Cards — admin writes (auth required)

Payload = the full card model (doc 05), snake_case. Server validates the **grading conditional rules** before insert/update.

### `POST /api/cards`
Create. Body: `CardInput` (all fields except `id/created_at/updated_at`).
- **201:** `{ "data": { /* full Card incl. cost basis */ } }`
- **400:** validation error (e.g. `graded=true` but missing `grading_company`).

### `PATCH /api/cards/[id]`
Partial update. Body: any subset of `CardInput`.
- **200:** `{ "data": Card }`
- **400 / 404** as applicable.

### `DELETE /api/cards/[id]`
Delete card **and** its storage images (front/back/gallery).
- **200:** `{ "data": { "id": "..." , "deleted": true } }`

### Validation contract (server-side)
```
player_name: required, non-empty
if graded == true:  grading_company ∈ enum, grade_value non-empty; condition must be null
if graded == false: condition ∈ enum;       grading_company/grade_value/cert must be null
serial_number: integer >= 1 or null
purchase_price/estimated_value/last_sale_value: >= 0 or null
currency: 3-letter ISO (default EUR)
card_type/grading_company/condition/source/ownership_status: valid enum or null (where allowed)
image URLs: must be within project Supabase Storage public URLs
```

---

## 5. Wishlist

### `GET /api/wishlist`
Public read. `?priority=high&acquired=false`, sorted by `sort_order`, then `priority`.
→ `{ "data": [WishlistItem] }`

### Admin (auth):
- `POST /api/wishlist` — create item.
- `PATCH /api/wishlist/[id]` — update (incl. `acquired`, `sort_order`).
- `DELETE /api/wishlist/[id]` — remove.

`WishlistItem`: `{ id, player_name, team, season, brand, product_line, card_set, card_type, desired_serial, priority, reference_image_url, notes, acquired, sort_order, created_at }`.

---

## 6. Statistics

### `GET /api/statistics`  (public)
Wraps RPC `get_collection_stats()`. **No cost basis.**

**200:**
```json
{
  "data": {
    "total_cards": 137,
    "total_value": 18450.00,
    "average_value": 134.67,
    "graded_count": 64,
    "graded_percent": 46.7,
    "rookie_count": 21,
    "autograph_count": 18,
    "patch_count": 9,
    "one_of_one_count": 4,
    "grading_distribution": { "psa": 40, "bgs": 12, "sgc": 8, "cgc": 2, "tag": 1, "other": 1 },
    "brand_distribution":   { "Topps": 70, "Panini": 55, "Unknown": 12 },
    "player_distribution":  { "Cristiano Ronaldo": 22, "Jude Bellingham": 14 },
    "top_players": [ { "player_name": "Cristiano Ronaldo", "c": 22 } ],
    "ownership_distribution": { "pc": 110, "for_sale": 15, "for_trade": 8, "sold": 4 }
  }
}
```

### `GET /api/admin/statistics`  (auth)
Wraps `get_admin_stats()` — adds `total_cost`, `total_profit_loss`, `avg_cost`, `roi_percent`, plus per-source spend. Admin only.

---

## 7. Uploads (Storage)

Handled via Supabase Storage client (signed/admin). See doc 08 for buckets/paths.

### `POST /api/uploads`  (auth)
Multipart or direct-to-Supabase. Body: `file`, `bucket` (`cards`|`wishlist`), `kind` (`front`|`back`|`gallery`|`reference`).
- **201:** `{ "data": { "url": "https://.../object/public/cards/front/<uuid>.jpg", "path": "front/<uuid>.jpg" } }`

### `DELETE /api/uploads`  (auth)
Body: `{ "bucket": "cards", "path": "front/<uuid>.jpg" }` → removes object.

> Preferred pattern: client uploads directly to Supabase Storage (admin session), receives the public URL, then includes that URL in the card `POST/PATCH`. The `/api/uploads` routes are the server-mediated alternative.

---

## 8. Contact (optional)

### `POST /api/contact`  (public)
Body: `{ name, email, message }` → insert into `contact_messages`.
- **201:** `{ "data": { "ok": true } }`
- Add rate-limiting / spam protection (honeypot or hCaptcha).

### `GET /api/admin/contact`  (auth)
List messages; `PATCH` to mark `handled`.

---

## 9. TypeScript types (shared)

Claude Code should generate types from the DB (`supabase gen types typescript`) and expose:

```ts
type CardType = 'base'|'parallel'|'insert'|'auto'|'patch'|'patch_auto'
  |'relic'|'booklet'|'printing_plate'|'one_of_one'|'other';
type GradingCompany = 'psa'|'bgs'|'sgc'|'cgc'|'tag'|'other';
type CardCondition = 'poor'|'fair'|'good'|'very_good'|'excellent'|'near_mint'|'mint';
type AcquisitionSource = 'ebay'|'card_show'|'trade'|'private_sale'|'break'|'other';
type OwnershipStatus = 'pc'|'for_sale'|'for_trade'|'sold';

interface PublicCard { /* model minus cost-basis fields */ }
interface Card extends PublicCard { purchase_date?: string; purchase_price?: number; currency: string; source?: AcquisitionSource; }
```

---

## 10. Security notes

- Anon key is safe on the client **only** because RLS restricts writes; never expose the service-role key to the browser.
- All mutations go through authenticated server actions / route handlers verifying `is_admin()`.
- Public endpoints read the `cards_public` view so cost basis never leaves the server.
- Validate enums and the grading constraint at the API layer too (don't rely on DB constraint alone for good UX errors).
