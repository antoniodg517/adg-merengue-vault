# 02 — Brand Guidelines

> **Document status:** Official reference for Claude Design.
> **Project:** ADG Merengue Vault
> **Last updated:** 2026-06-20

This document defines the visual and verbal identity. Claude Design should treat it as binding for every public and admin screen.

---

## 1. Brand essence

**Name:** ADG Merengue Vault
**Theme:** Real Madrid Sports Cards · Premium Collection · Minimal Luxury
**One-liner (from Instagram):** *Merengue Vault — The White Side of Football (& more).*

**Keywords:** Collection · Vault · Heritage · Madridismo · Premium · Memorabilia · Legacy

The feeling: a private bank vault crossed with a modern art gallery. Quiet confidence, not loud hype. The cards are luxury objects; the UI is the velvet case.

---

## 2. Logo

The primary mark is the **"ADG" monogram with "MERENGUE VAULT" lockup beneath it** (see `foto/Logo.png`).

- **Construction:** Bold geometric uppercase "ADG", with "MERENGUE VAULT" in widely letter-spaced caps underneath, struck through by a thin horizontal rule (the rule passes through the wordmark).
- **Primary version:** White logo on black (the default — this is the brand's signature look).
- **Inverse version:** Black logo on white, for light surfaces.
- **Clear space:** Keep padding ≥ the height of the "A" on all sides.
- **Minimum size:** 96px wide on desktop nav, 72px on mobile.
- **Don'ts:** No drop shadows, gradients, color fills, rotation, or stretching. Do not place the white logo on busy or light imagery without a dark scrim.

**Favicon / avatar:** the "ADG" monogram in a black circle (matches the Instagram avatar).

---

## 3. Color palette

The palette is deliberately monochrome — **black and white are the brand**, echoing "the white side of football" and Real Madrid's all-white identity. One restrained accent is permitted for emphasis (grails, CTAs, highlights).

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-vault-black` | `#0A0A0A` | Primary background, hero sections, logo field |
| `--color-pure-black` | `#000000` | True black for slab backgrounds / deep contrast |
| `--color-vault-white` | `#FFFFFF` | Primary text on dark, card surfaces on light |
| `--color-off-white` | `#F5F5F4` | Light-mode background, subtle panels |
| `--color-graphite` | `#1A1A1A` | Cards/panels on dark, elevated surfaces |
| `--color-ash` | `#2A2A2A` | Borders & dividers on dark |
| `--color-silver` | `#A1A1AA` | Secondary/muted text |
| `--color-madrid-gold` | `#C8A75B` | **Accent** — grails, premium badges, key CTAs, "one of one" |
| `--color-madrid-blue` | `#00529F` | Secondary accent — Real Madrid crest blue, used sparingly (links, tags) |
| `--color-success` | `#16A34A` | "For Sale / For Trade" positive states |
| `--color-danger` | `#DC2626` | Destructive admin actions, "Sold" |

**Default mode:** Dark. The public site leads with the vault-black aesthetic. A light mode is optional/secondary.

**Accent discipline:** Gold is precious — reserve it for grails, one-of-ones, featured items, and primary CTAs. Never flood the page with gold.

---

## 4. Typography

A two-typeface system: a confident display face for headings and a clean grotesque for everything else.

| Role | Typeface | Notes |
|------|----------|-------|
| Display / Headings | **Anton** or **Archivo Black** (condensed, bold, uppercase) | Matches the logo's bold geometric energy. Use UPPERCASE with wide tracking for hero/section titles. |
| Body / UI | **Inter** (or Geist) | Clean, neutral, excellent at small sizes. |
| Numeric / Stats | **Inter** with `font-feature-settings: "tnum"` (tabular numbers) | For statistics, serials, prices — keeps figures aligned. |

**Type scale (Tailwind-friendly):**

| Element | Size | Weight | Tracking |
|---------|------|--------|----------|
| Hero title | `text-6xl`–`text-7xl` | 900 | `tracking-tight` to `tracking-wide` (uppercase) |
| Section title | `text-3xl`–`text-4xl` | 800 | uppercase, `tracking-wide` |
| Card title (player) | `text-lg`–`text-xl` | 700 | normal |
| Body | `text-base` | 400 | normal |
| Caption / meta | `text-sm`–`text-xs` | 500 | `tracking-wide` uppercase for labels |

---

## 5. Layout & spacing

- **Grid:** 12-column, max content width `1280px` (`max-w-7xl`), generous gutters.
- **Whitespace:** Luxury = space. Use large vertical rhythm (`py-16`–`py-24` for sections).
- **Corners:** Subtle radius (`rounded-xl` / `rounded-2xl`) on panels; card images can be near-square with slight radius mirroring real slab proportions.
- **Borders:** Hairline borders in `--color-ash`; avoid heavy boxes.
- **Elevation:** Prefer contrast and subtle shadows over loud borders. On dark mode, elevate with `--color-graphite` panels.

---

## 6. Card presentation (the hero element)

Cards are the product. Treat them like gallery pieces:

- Show on **near-black backgrounds** to make slabs pop (mirrors the Instagram grid).
- Maintain real card aspect ratio (≈ **2.5 : 3.5**, i.e. `aspect-[5/7]`).
- Subtle hover: gentle scale (`scale-105`), soft shadow, optional slab "shine" sweep.
- Badges overlaid on the corner: `GRADED`, grade value, `1/1`, `ROOKIE`, `AUTO`, `PATCH`, `GRAIL`, `FEATURED`.
- Watermark: discreet "ADG / MERENGUE VAULT" mark on gallery imagery (as seen on IG) — applied at upload, optional.

---

## 7. Iconography & imagery

- **Icons:** `lucide-react` (thin, geometric) — consistent stroke, minimal.
- **Imagery:** Only the collection's own card photography. No stock photos. Real Madrid white, stadium-night blacks, gold light.
- **Photography style:** high-contrast, centered slabs on black, consistent framing.

---

## 8. Verbal identity / voice

- **Tone:** Confident, curatorial, understated. Collector-to-collector respect. A touch of Madridista pride.
- **Person:** First person singular/plural for the collector ("the vault", "my grails") in About; neutral/curatorial elsewhere.
- **Do say:** "the vault", "grails", "PC" (personal collection), "pickups", "the collection", "memorabilia", "legacy".
- **Avoid:** hype-speak ("INSANE DEAL!!!"), clutter, excessive emoji on the website (emoji belong on IG, not the premium site).
- **Languages:** UI copy in English (matches IG bio's English). Documentation in English.

**Standard CTAs:** `Buy · Sell · Trade — DM` (links to Instagram), `View Card`, `Explore the Vault`, `See the Grails`.

---

## 9. Brand assets reference

| Asset | File | Notes |
|-------|------|-------|
| Primary logo | `foto/Logo.png` | White ADG monogram on black |
| Instagram profile | `foto/Screenshot ...18.32.14.png` | Bio, follower count, highlights |
| Collection grid sample | `foto/Screenshot ...18.32.18.png` | Graded slabs, ADC labels |
| Grail sample | `foto/Screenshot ...18.32.23.png` | CR7 Stadium Club Porsche Refractor |
| Instagram | `@adgmerenguevault` | Buy / Sell / Trade via DM |

---

## 10. Accessibility

- Maintain WCAG AA contrast (white on vault-black passes easily; gold on black must be checked for body text — use gold for large text/accents only).
- All card images require descriptive `alt` (e.g. "2023 Stadium Club Cristiano Ronaldo Porsche Refractor, PSA 10").
- Focus states visible (gold ring) for keyboard navigation.
- Respect `prefers-reduced-motion` for hover/shine animations.
