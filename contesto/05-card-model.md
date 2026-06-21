# 05 — Card Model

> **Document status:** Official reference for Claude Design & Claude Code.
> **Project:** ADG Merengue Vault
> **Last updated:** 2026-06-20

This is the canonical definition of a **card**. Documents 04 (DB schema) and 07 (API) implement this model exactly. Field names here are the source of truth (snake_case).

---

## 1. Field overview

A card has eight logical groups: **General**, **Identification**, **Classification**, **Rarity**, **Grading**, **Acquisition**, **Value**, **Collection/Status**, **Media**, **Metadata/Flags**.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| **General** | | | |
| `id` | uuid | yes (auto) | Primary key |
| `created_at` | timestamptz | yes (auto) | Default `now()` |
| `updated_at` | timestamptz | yes (auto) | Auto-updated via trigger |
| **Identification** | | | |
| `player_name` | text | yes | e.g. "Cristiano Ronaldo" |
| `team` | text | no | Default focus "Real Madrid"; nullable for non-team cards |
| `season` | text | no | e.g. "2023-24" or "2023" |
| `brand` | text | no | e.g. "Topps", "Panini" |
| `product_line` | text | no | e.g. "Stadium Club", "Prizm" |
| `card_set` | text | no | e.g. "UCL", "Chrome" |
| `card_number` | text | no | e.g. "#GFCR", "120" (text — may be alphanumeric) |
| **Classification** | | | |
| `card_type` | enum `card_type` | no | See §3 |
| **Rarity** | | | |
| `serial_number` | integer | no | The print run, e.g. 25, 50, 99, 299, or `null` |
| `serial_text` | text | no | Human form, e.g. "12/25", "1/1", or `null` |
| **Grading** | | | |
| `graded` | boolean | yes | Default `false` |
| `grading_company` | enum `grading_company` | conditional | Required if `graded = true`; else `null` |
| `grade_value` | text | conditional | e.g. "10", "9.5"; if `graded = true`; else `null` |
| `certification_number` | text | conditional | Cert/serial of the slab; if `graded = true`; else `null` |
| `condition` | enum `card_condition` | conditional | Required if `graded = false`; else `null` |
| **Acquisition** | | | |
| `purchase_date` | date | no | When acquired |
| `purchase_price` | numeric(12,2) | no | Cost basis |
| `currency` | text (ISO 4217) | no | Default "EUR" |
| `source` | enum `acquisition_source` | no | See §3 |
| **Value** | | | |
| `estimated_value` | numeric(12,2) | no | Current estimated market value |
| `last_sale_value` | numeric(12,2) | no | Last comparable sale |
| **Collection / Status** | | | |
| `ownership_status` | enum `ownership_status` | yes | Default "PC" |
| **Media** | | | |
| `front_image_url` | text | no | Public URL in Supabase Storage |
| `back_image_url` | text | no | Public URL |
| `gallery_images` | text[] (jsonb array) | no | Extra image URLs |
| **Metadata / Flags** | | | |
| `is_rookie` | boolean | yes | Default `false` |
| `is_grail` | boolean | yes | Default `false` — feeds `/grails` |
| `is_autograph` | boolean | yes | Default `false` |
| `is_patch` | boolean | yes | Default `false` |
| `is_match_worn` | boolean | yes | Default `false` |
| `is_game_worn` | boolean | yes | Default `false` |
| `is_one_of_one` | boolean | yes | Default `false` |
| `featured` | boolean | yes | Default `false` — homepage feature |
| `notes` | text | no | Curatorial notes |

---

## 2. Conditional logic (grading)

The grading section is **mutually exclusive**:

```
IF graded == true:
    REQUIRE  grading_company  (PSA | BGS | SGC | CGC | TAG | Other)
    REQUIRE  grade_value      (e.g. "10", "9.5", "9", "8")
    OPTIONAL certification_number
    condition MUST be null

IF graded == false:
    REQUIRE  condition        (Poor … Mint)
    grading_company, grade_value, certification_number MUST be null
```

The UI (admin form) toggles which fields are shown based on the `graded` switch. The DB enforces this with a `CHECK` constraint (see doc 04). The API validates it server-side (see doc 07).

---

## 3. Enumerations

### `card_type`
| Value | Label |
|-------|-------|
| `base` | Base |
| `parallel` | Parallel |
| `insert` | Insert |
| `auto` | Auto |
| `patch` | Patch |
| `patch_auto` | Patch Auto |
| `relic` | Relic |
| `booklet` | Booklet |
| `printing_plate` | Printing Plate |
| `one_of_one` | One of One |
| `other` | Altro / Other |

### `grading_company`
| Value | Label |
|-------|-------|
| `psa` | PSA |
| `bgs` | BGS |
| `sgc` | SGC |
| `cgc` | CGC |
| `tag` | TAG |
| `other` | Altro / Other |

> `grade_value` is stored as **text** (not numeric) because grades can be like "10", "9.5", "GEM MT 10", "AUTH". UI may suggest common values: 10, 9.5, 9, 8.5, 8 …

### `card_condition` (raw / ungraded)
Ordered worst → best:
| Value | Label |
|-------|-------|
| `poor` | Poor |
| `fair` | Fair |
| `good` | Good |
| `very_good` | Very Good |
| `excellent` | Excellent |
| `near_mint` | Near Mint |
| `mint` | Mint |

### `acquisition_source`
| Value | Label |
|-------|-------|
| `ebay` | eBay |
| `card_show` | Card Show |
| `trade` | Trade |
| `private_sale` | Private Sale |
| `break` | Break |
| `other` | Altro / Other |

### `ownership_status`
| Value | Label | Public meaning |
|-------|-------|----------------|
| `pc` | PC | Personal Collection — not available |
| `for_sale` | For Sale | Open to selling — DM |
| `for_trade` | For Trade | Open to trading — DM |
| `sold` | Sold | No longer owned (archived / "SOLD") |

---

## 4. Derived / computed fields (not stored)

The UI may compute these on the fly:

- **`is_numbered`** = `serial_number IS NOT NULL OR serial_text IS NOT NULL`
- **`display_grade`** = `graded ? grading_company + " " + grade_value : condition`
- **`profit_loss`** (admin only) = `estimated_value - purchase_price`
- **`rarity_label`** — derived from `serial_text`/`is_one_of_one` (e.g. "1/1", "/25", "/99").

> `is_one_of_one` should be kept consistent with `card_type = one_of_one` and `serial_text = "1/1"`; the admin form should auto-suggest setting all three together (see doc 09).

---

## 5. Validation rules (summary)

1. `player_name` is required and non-empty.
2. Grading conditional rules (§2) enforced at DB + API.
3. `serial_number` ≥ 1 when present.
4. `purchase_price`, `estimated_value`, `last_sale_value` ≥ 0 when present.
5. `currency` is a 3-letter ISO code (default `EUR`).
6. Image URLs must point to the project's Supabase Storage buckets.
7. `ownership_status` defaults to `pc`.

---

## 6. Example card (JSON)

```json
{
  "id": "8f1c2e3a-...-...",
  "player_name": "Cristiano Ronaldo",
  "team": "Real Madrid",
  "season": "2023-24",
  "brand": "Topps",
  "product_line": "Stadium Club",
  "card_set": "UEFA Champions League",
  "card_number": "#PCR",
  "card_type": "parallel",
  "serial_number": null,
  "serial_text": null,
  "graded": true,
  "grading_company": "psa",
  "grade_value": "10",
  "certification_number": "100024256",
  "condition": null,
  "purchase_date": "2024-11-02",
  "purchase_price": 220.00,
  "currency": "EUR",
  "source": "ebay",
  "estimated_value": 300.00,
  "last_sale_value": 285.00,
  "ownership_status": "pc",
  "front_image_url": "https://<project>.supabase.co/storage/v1/object/public/cards/front/8f1c....jpg",
  "back_image_url": null,
  "gallery_images": [],
  "is_rookie": false,
  "is_grail": true,
  "is_autograph": false,
  "is_patch": false,
  "is_match_worn": false,
  "is_game_worn": false,
  "is_one_of_one": false,
  "featured": true,
  "notes": "Porsche Refractor — vault centerpiece.",
  "created_at": "2024-11-03T10:00:00Z",
  "updated_at": "2024-11-03T10:00:00Z"
}
```
