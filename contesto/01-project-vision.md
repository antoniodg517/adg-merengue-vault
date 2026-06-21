# 01 — Project Vision

> **Document status:** Official reference for Claude Design & Claude Code.
> **Project:** ADG Merengue Vault
> **Owner:** Antonio Del Giudice (ADG)
> **Last updated:** 2026-06-20

---

## 1. What is ADG Merengue Vault?

ADG Merengue Vault is a **premium digital home for a personal sports-card collection focused on Real Madrid**. It is the web extension of the Instagram presence [@adgmerenguevault](https://instagram.com/adgmerenguevault) — *"Merengue Vault — The White Side of Football (& more)"*.

It is **not** a generic portfolio or a card-shop template. It is a curated, museum-grade showcase that treats each card as memorabilia: cataloged, graded, valued, and presented with the gravity of a private vault.

The site has two faces:

- **Public face** — a beautiful, fast, mobile-first gallery that anyone (collectors, traders, fellow Madridistas) can browse to admire the collection, study the catalog, see the grails, and reach out to buy/sell/trade.
- **Private face** — a secure admin area where the owner manages the catalog, uploads images, and reviews statistics, with no need to touch code or the database directly.

---

## 2. Mission

> Build the most refined, trustworthy, and complete online vault for a Real Madrid–centric sports-card collection — a place where the collection lives, grows, and tells its story.

---

## 3. Core objectives

| # | Objective | Why it matters |
|---|-----------|----------------|
| 1 | **Showcase the collection** | A premium, visual catalog that does justice to graded slabs and grails. |
| 2 | **Manage the catalog** | Full CRUD over cards without leaving the browser. |
| 3 | **Visualize statistics** | Total cards, total value, grading distribution, top players, and more. |
| 4 | **Maintain a wishlist** | Publicly signal which cards are hunted — fuels trades/offers. |
| 5 | **Highlight new acquisitions** | Keep the audience engaged with fresh pickups. |
| 6 | **Publish grail cards** | A dedicated hall-of-fame for the most important pieces (e.g. the CR7 Stadium Club refractor). |
| 7 | **Establish an online presence** | A professional hub linked tightly to the Instagram page and DMs for Buy / Sell / Trade. |

---

## 4. Target audience

- **Sports-card collectors & traders** — people who understand parallels, serials, grading, and want to deal.
- **Madridistas / football fans** — fans of Real Madrid and its legends (Ronaldo, Bellingham, Mbappé, Zidane, Raúl, etc.).
- **The owner himself (ADG)** — as the primary admin and curator, needs frictionless catalog management.
- **Instagram followers** (1.2k+ at launch) — already engaged, looking for a richer, persistent destination beyond the feed.

---

## 5. Positioning & tone

**Theme:** *Real Madrid · Sports Cards · Premium Collection · Minimal Luxury.*

The product should feel like the meeting point of a **private bank vault** and a **modern art gallery**. Restraint over decoration. Black, white, and a single restrained accent. Generous whitespace. The cards are the heroes; the interface gets out of the way.

**Brand keywords (recur throughout the experience):**
`Collection` · `Vault` · `Heritage` · `Madridismo` · `Premium` · `Memorabilia` · `Legacy`

---

## 6. Scope of the collection

- **Primary focus: Real Madrid.** The vast majority of cards depict Real Madrid players, past and present.
- **Secondary (rare): other teams/players.** Occasionally the collection includes cards outside Real Madrid (and, per the Instagram tagline, "& more" — including the odd non-football card). The data model and UI must therefore treat `team` as a real, filterable field rather than assuming Real Madrid everywhere — but Real Madrid is always the default lens and the marketing center of gravity.

---

## 7. Success criteria

The first release is successful when:

1. Every card in the collection is cataloged with images, identification, grading/condition, and value.
2. A visitor can browse `/collection`, filter and search, open any `/card/[id]`, and admire the `/grails`.
3. The `/statistics` page renders accurate, live figures derived from the catalog.
4. The owner can add/edit/delete a card and upload images entirely from `/admin`, with zero code.
5. The site is fast (mobile-first), looks unmistakably premium, and links cleanly to Instagram for Buy/Sell/Trade.

---

## 8. Non-goals (for v1)

- No public user accounts, comments, or social features (auth is admin-only).
- No on-site payments / checkout — transactions happen via Instagram DM.
- No real-time market price scraping (values are entered/maintained manually).
- No multi-collector / multi-tenant support — this is a single-owner vault.

---

## 9. Technology summary

| Layer | Stack |
|-------|-------|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui — built primarily via **Claude Design** |
| Backend | Supabase (PostgreSQL, Storage, Row Level Security) — built via **Claude Code** |
| Hosting | Vercel |
| Repository | `adg-merengue-vault` |

> Detailed brand, IA, data, and flow specifications follow in documents `02`–`10`. This documentation set is the single source of truth: Claude Design and Claude Code should be able to build the product from these documents without reading source code.
