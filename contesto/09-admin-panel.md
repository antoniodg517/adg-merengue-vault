# 09 — Admin Panel

> **Document status:** Official reference for Claude Design & Claude Code.
> **Project:** ADG Merengue Vault
> **Last updated:** 2026-06-20

The private control room for the vault. Only the owner (allow-listed admin) can access it. Goal: manage the entire collection without touching code or the database.

---

## 1. Access & auth

- Routes under `/admin` are protected by Next.js middleware checking a valid Supabase session **and** `is_admin()` (doc 04 §7).
- Sign-in: Supabase Auth — email magic link (preferred for single owner) or email+password.
- Unauthenticated → redirect to sign-in. Authenticated non-admin → "Access denied".
- The admin UI reuses the brand (vault-black, gold accents) but is denser and utility-first.

---

## 2. Layout

- **Left sidebar:** `Dashboard` · `Cards` · `Uploads` · `Statistics` (+ optional `Wishlist`, `Messages`).
- **Top bar:** page title, global "Add Card" button, signed-in email, sign-out, "View site" link.
- Built with shadcn/ui (`Table`, `Dialog`, `Form`, `Tabs`, `Switch`, `Select`, `Badge`, `Toast`, `Card`).

---

## 3. `/admin` — Dashboard

**KPI cards (top row):**
- Total cards · Total estimated value · Graded count (& %) · One-of-ones
- (Admin-only) Total cost basis · Profit/Loss · ROI %

**Panels:**
- **Recent activity** — latest created/updated cards (links to edit).
- **Quick actions** — Add Card, Upload Images, Manage Wishlist.
- **Featured & grails** — quick toggles / overview of what's promoted.
- **To-do nudges** — cards missing images, missing value, or missing grading/condition (data-quality helper).

---

## 4. `/admin/cards` — Card management

The workhorse. A **data table** of all cards.

**Columns:** thumbnail · player_name · team · season · brand/product_line · card_type · grade/condition · serial · estimated_value · ownership_status · flags (icons) · actions.

**Features:**
- Search (full-text) + filters (mirror `/collection` filters + cost/value ranges).
- Sort by any column.
- Pagination (server-side).
- **Inline quick edits:** toggle `featured`, `is_grail`; change `ownership_status` via dropdown.
- **Row actions:** Edit → `/admin/cards/[id]`; Duplicate (clone for similar cards); Delete (confirm modal → cascades image deletion, doc 08 §6).
- **Bulk actions (optional):** multi-select → set status / feature / delete.

---

## 5. `/admin/cards/new` & `/admin/cards/[id]` — Card form

One shared form component (create vs edit). Organized into the model's groups (doc 05), using tabs or sections.

### Sections
1. **Media** — drag/drop front (required-ish), back, gallery (multi). Live preview as a slab. Upload → Supabase (doc 08).
2. **Identification** — `player_name`* (autocomplete from existing players), `team` (default "Real Madrid", autocomplete), `season`, `brand`, `product_line`, `card_set`, `card_number`.
3. **Classification** — `card_type` (Select).
4. **Rarity** — `serial_number` (int), `serial_text` (text, e.g. "12/25"). Helper: typing serial_text auto-fills serial_number when parseable.
5. **Grading** — `graded` Switch:
   - ON → `grading_company` (Select), `grade_value` (text w/ suggestions 10/9.5/9…), `certification_number`.
   - OFF → `condition` (Select).
   - The form **enforces mutual exclusivity** (doc 05 §2) and hides the irrelevant fields.
6. **Acquisition** — `purchase_date`, `purchase_price`, `currency` (default EUR), `source` (Select).
7. **Value** — `estimated_value`, `last_sale_value`.
8. **Collection** — `ownership_status` (Select, default PC).
9. **Flags** — switches: `is_rookie`, `is_grail`, `is_autograph`, `is_patch`, `is_match_worn`, `is_game_worn`, `is_one_of_one`, `featured`.
10. **Notes** — textarea.

### Smart assists
- `card_type = one_of_one` → prompt to set `is_one_of_one = true` and `serial_text = "1/1"`.
- `card_type = auto` / `patch_auto` → suggest `is_autograph` / `is_patch`.
- `is_grail = true` → reminder it will appear on `/grails`.
- Validation surfaced inline; Save disabled until required fields valid.

### Actions
- **Save** (create→`POST /api/cards`; edit→`PATCH /api/cards/[id]`).
- **Save & add another** (fast bulk entry).
- **Delete** (edit mode).

---

## 6. `/admin/uploads` — Image manager

- Upload images to `cards` / `wishlist` buckets, choose `kind` (front/back/gallery/reference).
- Grid of existing objects with public URL copy button + delete.
- Optional "orphan finder" (objects with no card reference).
- Most uploading happens inside the card form; this page is for housekeeping.

---

## 7. `/admin/statistics` — Statistics (admin)

- Everything from public `/statistics` **plus** financial view:
  - Total cost basis, total estimated value, **unrealized P/L**, ROI %.
  - Spend by `source`, value by `brand`/`player`, average cost vs average value.
  - Realized P/L from `sold` cards (if last_sale recorded).
- Charts via Recharts/Chart.js. Powered by `get_admin_stats()` (doc 04 §6 / doc 07 §6).

---

## 8. `/admin` — Wishlist & Messages (optional sub-areas)

- **Wishlist manager:** CRUD wishlist items, reorder (`sort_order`), set `priority`, mark `acquired`, reference image.
- **Messages:** if the contact form is enabled, list `contact_messages`, mark `handled`.

---

## 9. Privacy controls

- A settings toggle controls **public price visibility**:
  - Default: hide all prices publicly; show `estimated_value` only on `for_sale`/`for_trade` cards.
  - Cost basis (`purchase_price`, `source`, `purchase_date`) is **never** public (enforced by `cards_public` view, doc 04 §8).

---

## 10. UX principles for admin

- Speed of data entry is paramount (the owner enters many cards). Keyboard-friendly, autocomplete, "save & add another".
- Non-destructive by default; confirm deletes; toasts for every mutation.
- Mobile-usable (owner may add cards from a phone after a pickup).
- Forgiving validation with clear messages, never lose entered data on error.
