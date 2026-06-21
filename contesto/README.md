# ADG Merengue Vault — Documentation

Official project documentation. This set is the **single source of truth**: Claude Design and Claude Code should be able to build the product from these documents without reading source code.

**Project:** ADG Merengue Vault — a premium online vault for a Real Madrid–focused sports-card collection.
**Instagram:** [@adgmerenguevault](https://instagram.com/adgmerenguevault) — *The White Side of Football (& more)*.
**Stack:** Next.js (App Router) · TypeScript · Tailwind · shadcn/ui (Claude Design) · Supabase / PostgreSQL / Storage / RLS (Claude Code) · Vercel.

## Read in order

| # | Doc | Purpose | For |
|---|-----|---------|-----|
| 01 | [Project Vision](01-project-vision.md) | What & why, goals, audience, scope | Everyone |
| 02 | [Brand Guidelines](02-brand-guidelines.md) | Logo, color, type, voice | Claude Design |
| 03 | [Information Architecture](03-information-architecture.md) | Sitemap, nav, page specs | Claude Design |
| 04 | [Database Schema](04-database-schema.md) | Postgres tables, RLS, stats RPCs | Claude Code |
| 05 | [Card Model](05-card-model.md) | Canonical card fields & enums | Both |
| 06 | [User Flows](06-user-flows.md) | Visitor & admin journeys | Claude Design |
| 07 | [API Contracts](07-api-contracts.md) | Endpoints, payloads, types | Both |
| 08 | [Storage Strategy](08-storage-strategy.md) | Buckets, images, security | Claude Code |
| 09 | [Admin Panel](09-admin-panel.md) | Admin area spec | Both |
| 10 | [Roadmap](10-roadmap.md) | Phased delivery plan | Everyone |

## Key conventions
- Field names are **snake_case**; doc 05 is authoritative for the card model.
- Enums are defined once in doc 05 §3 and implemented in doc 04 §2.
- Cost basis (purchase price/source/date) is **never** public — enforced via the `cards_public` view.
- Brand is **dark-first, minimal luxury**: black/white + restrained gold accent.

## Brand assets
See `../foto/` — `Logo.png` and Instagram/collection reference screenshots.
