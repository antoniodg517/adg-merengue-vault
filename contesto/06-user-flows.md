# 06 — User Flows

> **Document status:** Official reference for Claude Design.
> **Project:** ADG Merengue Vault
> **Last updated:** 2026-06-20

Describes how the two user types move through the product. Use these to design states, transitions, and empty/edge cases.

---

## 1. User types

| Type | Auth | Goal |
|------|------|------|
| **Visitor** (collector, trader, fan) | None | Admire the collection, find cards, reach out to deal. |
| **Admin** (ADG, owner) | Supabase auth (allow-listed) | Manage catalog, images, and review stats. |

---

## 2. Visitor flows

### 2.1 First visit → explore
```
Land on /  (Instagram link in bio)
  → See hero + featured grails + snapshot stats + latest pickups
  → Click "Explore the Vault"  → /collection
  → Browse grid → apply filters (player / team / graded / type)
  → Click a card → /card/[id]
  → View gallery, identification, grading, value, status
  → If For Sale/For Trade → "Enquire via Instagram DM" → opens IG
```

### 2.2 Find a specific card
```
/collection
  → Use search box (player / brand / set / number)
  → Or filter (player_name = "Bellingham", graded = true)
  → Sort by value or rarity
  → Open card detail
```

### 2.3 Admire the grails
```
/  or nav → /grails
  → Editorial layout of is_grail cards (gold accents)
  → Click → /card/[id]
```

### 2.4 Check the wishlist (offer a card)
```
nav → /wishlist
  → See wanted cards (player, set, serial sought, priority)
  → "Have one? DM me" → Instagram
```

### 2.5 Read about / contact
```
nav → /about     → collector story
nav → /contact   → Instagram handle + (optional) contact form
  → Submit form → contact_messages insert → confirmation state
```

### 2.6 Visitor edge / empty states
- Empty collection / no filter results → on-brand empty state ("No cards match — adjust filters").
- Card with no back/gallery images → show front only, hide gallery.
- Card `sold` → shown with "SOLD" overlay (per setting it may be hidden from default collection view and only visible via a "Sold archive" filter).
- Prices hidden by privacy setting → value block omitted gracefully.

---

## 3. Admin flows

### 3.1 Sign in
```
Visit /admin (unauthenticated)
  → Middleware redirects → /admin sign-in (Supabase email magic-link or password)
  → On success, is_admin() check → /admin dashboard
  → Non-admin authenticated user → access denied
```

### 3.2 Add a new card (core flow)
```
/admin → "Add Card"  → /admin/cards/new
  1. Upload front image (drag/drop) → stored in `cards/front/`
  2. (Optional) back + gallery images
  3. Fill Identification: player_name*, team (default Real Madrid), season, brand, product_line, card_set, card_number
  4. Classification: card_type
  5. Rarity: serial_number / serial_text
  6. Grading toggle:
       graded = ON  → company*, grade_value*, certification_number
       graded = OFF → condition*
  7. Acquisition: purchase_date, purchase_price, currency, source
  8. Value: estimated_value, last_sale_value
  9. Status: ownership_status (default PC)
 10. Flags: rookie / grail / autograph / patch / match_worn / game_worn / one_of_one / featured
 11. Notes
  → Validate (conditional grading rules) → Save → row in `cards`
  → Redirect to /admin/cards with success toast
```
**Smart assists:** selecting `card_type = one_of_one` auto-suggests `is_one_of_one = true` + `serial_text = "1/1"`; `card_type = auto`/`patch_auto` suggests `is_autograph`/`is_patch`.

### 3.3 Edit / update a card
```
/admin/cards → search/find row → Edit → /admin/cards/[id]
  → Same form, pre-filled → change fields → Save
  → updated_at auto-bumped
```

### 3.4 Quick actions (from the cards table)
```
/admin/cards
  → Toggle `featured` (star)        — inline
  → Toggle `is_grail`               — inline
  → Change `ownership_status`       — inline dropdown (PC → For Sale → Sold …)
  → Delete card                     — confirm modal → also delete its images (doc 08)
```

### 3.5 Manage images
```
/admin/uploads
  → Upload new images to a bucket/folder
  → Browse existing images, copy public URL, delete orphans
  → (Or images managed inline within the card form — preferred)
```

### 3.6 Manage wishlist
```
/admin → Wishlist section (or /admin/wishlist)
  → Add wanted card (player, set, desired_serial, priority, reference image, notes)
  → Reorder (sort_order), mark acquired, delete
```

### 3.7 Review statistics
```
/admin/statistics
  → KPIs incl. cost basis & profit/loss (admin-only)
  → Distributions & top players (same engine as public /statistics)
```

### 3.8 Admin edge cases
- Validation failure on save → inline field errors, no data loss.
- Image upload fails → retry, card can still be saved without image.
- Deleting a card → confirm; cascade-delete its storage objects.
- Session expired → redirect to sign-in, return to intended page after.

---

## 4. Cross-cutting flow: card lifecycle

```
[Draft in admin] → created (ownership_status = pc)
   → featured? → appears on homepage
   → is_grail? → appears on /grails
   → status = for_sale/for_trade → "Enquire via DM" CTA active
   → status = sold → SOLD overlay / archived
```

---

## 5. Conversion path (business goal)

Every visitor path should make the **Instagram Buy·Sell·Trade DM** reachable in ≤ 2 clicks: persistent header CTA, footer link, and per-card enquire button on available cards.
