# 03 — Information Architecture

> **Document status:** Official reference for Claude Design.
> **Project:** ADG Merengue Vault
> **Last updated:** 2026-06-20

Defines the sitemap, navigation, and the purpose + content of every page.

---

## 1. Sitemap

```
ADG Merengue Vault
│
├── Public
│   ├── /                     Homepage
│   ├── /collection           Full catalog (filter, search, sort)
│   ├── /card/[id]            Single card detail
│   ├── /grails               Most important cards
│   ├── /wishlist             Wanted cards
│   ├── /statistics           Collection statistics
│   ├── /about                Collector's story
│   └── /contact              Contact + Instagram
│
└── Admin (auth required)
    ├── /admin                Dashboard
    ├── /admin/cards          Card management (CRUD, list/table)
    ├── /admin/cards/new      Create card
    ├── /admin/cards/[id]     Edit card
    ├── /admin/uploads        Image upload manager
    └── /admin/statistics     Admin statistics
```

---

## 2. Global navigation

### Public header (sticky, dark)
- **Left:** ADG Merengue Vault logo → `/`
- **Center / right links:** `Collection` · `Grails` · `Wishlist` · `Statistics` · `About` · `Contact`
- **Right CTA:** `Buy · Sell · Trade` button → Instagram DM (external)
- **Mobile:** hamburger → full-screen overlay menu (vault-black), same links + Instagram.

### Public footer
- Logo + tagline ("The White Side of Football").
- Quick links (mirror of nav).
- Instagram icon/link `@adgmerenguevault`.
- Small print: "© ADG Merengue Vault — Private Collection."
- Subtle stats teaser (e.g. "X cards · Y graded") — optional.

### Admin navigation (sidebar, only when authenticated)
- `Dashboard` · `Cards` · `Uploads` · `Statistics`
- Footer of sidebar: signed-in email, `Sign out`, link back to public site.

---

## 3. Page specifications

### 3.1 `/` — Homepage
**Purpose:** Make a premium first impression; funnel to the collection, grails, and Instagram.

Sections (top → bottom):
1. **Hero** — full-bleed vault-black, logo/large wordmark, tagline, primary CTAs (`Explore the Vault`, `See the Grails`). Optional featured grail image behind a dark scrim.
2. **Featured grails strip** — 3–5 cards where `is_grail = true` or `featured = true`, horizontal showcase.
3. **Collection snapshot** — key stats (total cards, total value, graded count, #1/1s) pulled live from `/statistics` data.
4. **New acquisitions** — most recent cards by `created_at` (e.g. latest 6–8), labeled "Latest Pickups".
5. **Brand statement** — short paragraph (Madridismo / Heritage / Legacy), pulled from About.
6. **Instagram CTA band** — follow / DM to Buy·Sell·Trade.

### 3.2 `/collection` — Full catalog
**Purpose:** Browse and explore the whole collection.

- **Grid** of card thumbnails (responsive: 2 cols mobile → 5–6 desktop), each showing front image, player, season, brand, grade/serial badges.
- **Filters (sidebar / drawer):**
  - Player (`player_name`)
  - Team (`team`) — default lens Real Madrid
  - Season (`season`)
  - Brand (`brand`) & Product line (`product_line`)
  - Card type (`card_type`)
  - Graded (yes/no) + grading company + grade
  - Ownership status (`ownership_status`)
  - Flags: rookie, autograph, patch, one-of-one, grail, featured
- **Search:** free-text across player, brand, set, card number.
- **Sort:** newest, oldest, value (high→low), serial rarity, player A–Z.
- **Result count** + active-filter chips.
- Each card links to `/card/[id]`.

### 3.3 `/card/[id]` — Card detail
**Purpose:** The full memorabilia page for one card.

- **Gallery:** front image (primary), back image, plus `gallery_images` thumbnails → lightbox/zoom.
- **Header:** player name, team, season; key badges (graded grade, 1/1, rookie, auto, patch, grail).
- **Identification block:** brand, product line, card set, card number, card type.
- **Rarity block:** serial number / serial text (e.g. "12/25").
- **Grading block (if `graded`):** company, grade value, certification number (+ link to verify, optional). **If not graded:** condition.
- **Acquisition block (optional/public-safe):** source, purchase date — *price visibility configurable; default hide purchase price publicly.*
- **Value block:** estimated value, last sale value (display rules per privacy settings).
- **Status:** ownership status badge (PC / For Sale / For Trade / Sold).
- **Notes:** curatorial notes.
- **CTA:** if `For Sale`/`For Trade` → "Enquire via Instagram DM".
- **Related:** more cards of the same player/team.

### 3.4 `/grails` — Grail cards
**Purpose:** Hall of fame for the collection's crown jewels.

- Cards where `is_grail = true`.
- Editorial, large-format layout (one or two per row), gold accents, more storytelling per card.
- Each links to its `/card/[id]`.

### 3.5 `/wishlist` — Wanted cards
**Purpose:** Publicly show what the collector is hunting (drives trades/offers).

- A list/grid of wishlist entries (player, set, parallel/serial sought, target, priority).
- Each entry can show a reference image, notes, and "Have one? DM me".
- Backed by a separate `wishlist` table (not the `cards` table).

### 3.6 `/statistics` — Collection statistics
**Purpose:** Data-driven overview of the vault.

Displays (all computed from `cards`):
- Total cards · Total estimated value · Average card value
- Graded count & % · grading distribution (PSA/BGS/SGC/CGC/TAG/Other, by grade)
- Brand distribution · player distribution · **top players**
- # rookies · # autographs · # patches · # one-of-ones
- Ownership status breakdown (PC / For Sale / For Trade / Sold)
- Visuals: charts (bar/donut), headline stat cards. (See doc 07 for the stats endpoint.)

### 3.7 `/about` — Collector's story
**Purpose:** The human + Madridista narrative.

- Story of ADG, why Real Madrid, how the vault started, collecting philosophy.
- Pull-quotes, a hero portrait/branding, links to grails and Instagram.

### 3.8 `/contact` — Contact & Instagram
**Purpose:** Connect for Buy · Sell · Trade.

- Prominent Instagram link/handle (primary channel — DMs).
- Optional contact form (name, email, message) → email/Supabase table.
- Buy/Sell/Trade explainer; what the collector is open to.

---

## 4. Admin pages (overview — full spec in doc 09)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard: KPIs, recent activity, quick actions |
| `/admin/cards` | Table of all cards: search, filter, edit, delete, toggle flags/status |
| `/admin/cards/new` | Create card form (all fields, conditional grading) |
| `/admin/cards/[id]` | Edit card form |
| `/admin/uploads` | Upload/manage images in Supabase Storage |
| `/admin/statistics` | Same stats as public + private (cost basis, P/L) |

---

## 5. URL & routing conventions

- All public pages server-rendered for SEO and speed (Next.js App Router, RSC where possible).
- `/card/[id]` uses the card UUID; consider an optional human-readable slug (`/card/[id]/[slug]`) later.
- Admin routes protected by middleware (Supabase auth) — unauthenticated users redirected to sign-in.
- 404 page on-brand (vault-black, "This vault is empty" style).

---

## 6. Responsive priority

Mobile-first (the audience comes from Instagram). Breakpoints: base (mobile) → `md` (tablet) → `lg`/`xl` (desktop). Collection grid and stats must look excellent on a phone.
