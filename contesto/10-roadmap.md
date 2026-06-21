# 10 — Roadmap

> **Document status:** Official reference for the team.
> **Project:** ADG Merengue Vault
> **Last updated:** 2026-06-20

Phased delivery plan. Documentation (this set, `01`–`10`) is **Phase 0** and is complete before any implementation begins.

---

## Phase 0 — Documentation & foundation ✅
*Goal: a single source of truth before code.*
- [x] Project vision (01)
- [x] Brand guidelines (02)
- [x] Information architecture (03)
- [x] Database schema (04)
- [x] Card model (05)
- [x] User flows (06)
- [x] API contracts (07)
- [x] Storage strategy (08)
- [x] Admin panel (09)
- [x] Roadmap (10)

**Exit criteria:** all docs reviewed/approved by owner. ✅

---

## Phase 1 — Backend foundation (Claude Code)
*Goal: working Supabase backend matching docs 04/07/08.*
- [ ] Create Supabase project; configure env vars.
- [ ] Migrations: extensions, enums, `set_updated_at`, `admins` + `is_admin()`.
- [ ] `cards` table + trigger + indexes + `search_tsv`.
- [ ] `wishlist`, `contact_messages` tables.
- [ ] `cards_public` view; `get_collection_stats()` + `get_admin_stats()`.
- [ ] Enable RLS + all policies.
- [ ] Storage buckets (`cards`, `wishlist`) + storage policies.
- [ ] Seed a few sample cards (incl. the CR7 grail) for development.
- [ ] Generate TypeScript types (`supabase gen types`).

**Exit:** can CRUD a card and read stats via Supabase with RLS enforced.

---

## Phase 2 — Frontend scaffold & design system (Claude Design)
*Goal: the brand, layout, and component kit.*
- [ ] Next.js (App Router) + TypeScript + Tailwind + shadcn/ui setup.
- [ ] Theme tokens from doc 02 (colors, type, spacing); dark-first.
- [ ] Layout shell: header/nav, footer, mobile menu, 404.
- [ ] Core components: `CardTile`, `CardBadge`, `StatCard`, `FilterBar`, `Lightbox`, `SectionTitle`.
- [ ] Supabase client wiring (anon reads via `cards_public`).

**Exit:** brand-accurate shell renders with real components and live data hookup.

---

## Phase 3 — Public site (MVP)
*Goal: visitors can fully browse the collection.*
- [ ] `/` Homepage (hero, featured grails, snapshot stats, latest pickups, IG band).
- [ ] `/collection` (grid, filters, search, sort, pagination).
- [ ] `/card/[id]` (gallery, identification, grading/condition, value, status, enquire CTA, related).
- [ ] `/grails` (editorial layout).
- [ ] `/statistics` (KPIs + charts from `get_collection_stats()`).
- [ ] `/about`, `/contact` (+ optional contact form).
- [ ] SEO: metadata, Open Graph images, sitemap; mobile QA.

**Exit:** public site is feature-complete and deployable to Vercel.

---

## Phase 4 — Admin panel
*Goal: owner manages everything without code (doc 09).*
- [ ] Auth + admin guard middleware.
- [ ] `/admin` dashboard (KPIs, recent, quick actions, data-quality nudges).
- [ ] `/admin/cards` table (search/filter/sort, inline toggles, delete w/ image cascade).
- [ ] `/admin/cards/new` + `/admin/cards/[id]` form (all groups, conditional grading, smart assists, image upload).
- [ ] `/admin/uploads` manager.
- [ ] `/admin/statistics` (financial view, `get_admin_stats()`).
- [ ] Wishlist manager; messages (optional).

**Exit:** owner can run the entire catalog from the browser.

---

## Phase 5 — Polish & launch
- [ ] Wishlist public page wired to admin.
- [ ] Performance: image variants/transforms, caching, Lighthouse ≥ 90 mobile.
- [ ] Accessibility pass (contrast, alt text, focus, reduced motion).
- [ ] Watermarking pipeline (optional).
- [ ] Analytics (privacy-friendly, e.g. Vercel Analytics / Plausible).
- [ ] Deploy production on Vercel + custom domain; link from Instagram bio.
- [ ] Backfill the real collection.

**Exit:** public launch announced on `@adgmerenguevault`.

---

## Phase 6 — Future enhancements (backlog)
- Human-readable card slugs (`/card/[id]/[slug]`).
- Sold archive view + realized P/L tracking.
- Public "Latest pickups" / changelog feed.
- Instagram feed embed / auto-cross-post new cards.
- Value history tracking (price over time) per card.
- Multi-image zoom / 360° slab view.
- Export collection (CSV/PDF "vault report").
- Light mode toggle.
- Optional public "make an offer" form per card (still routed to DM).
- Card-type-aware templates to speed bulk entry (e.g. base set runs).

---

## Suggested sequencing
```
Phase 0 (docs) → Phase 1 (backend) → Phase 2 (design system)
   → Phase 3 (public) ┐
   → Phase 4 (admin)  ┘ (can overlap once Phase 2 done)
   → Phase 5 (launch) → Phase 6 (iterate)
```

## Ownership
| Area | Tool |
|------|------|
| Backend, migrations, RLS, API | **Claude Code** |
| Frontend, components, pages, brand | **Claude Design** |
| Hosting / CI | **Vercel** |
| Source of truth | `docs/` (this set) |
