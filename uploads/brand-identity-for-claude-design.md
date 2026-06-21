# ADG Merengue Vault — Brand Identity Brief

> **Paste this into Claude Design as the design system source of truth.**
> A premium online vault for a Real Madrid–focused sports-card collection.
> Design north star: **Minimal Luxury** — a private bank vault crossed with a modern art gallery. The cards are the heroes; the UI is the velvet case.

---

## 1. Brand essence

- **Name:** ADG Merengue Vault
- **Tagline:** *The White Side of Football (& more)*
- **Theme:** Real Madrid · Sports Cards · Premium Collection · Minimal Luxury
- **Keywords:** Collection · Vault · Heritage · Madridismo · Premium · Memorabilia · Legacy
- **Feeling:** Quiet confidence, not loud hype. Restraint over decoration. Generous space. Museum-grade.
- **Channel:** Instagram-first audience (`@adgmerenguevault`); Buy · Sell · Trade via DM.

**Design principles**
1. Black & white *are* the brand (Real Madrid all-white / "white side of football"). Color is an event, not a default.
2. Whitespace = luxury. Let it breathe.
3. The card image is always the loudest thing on screen.
4. One restrained metallic accent (gold) for things that deserve reverence: grails, 1-of-1s, primary CTAs.
5. Hairlines over heavy boxes. Contrast over borders.

---

## 2. Color palette

**Mode: Dark-first.** The public site leads with vault-black. Light mode is optional/secondary.

### Core
| Token | Hex | Role |
|-------|-----|------|
| `--vault-black` | `#0A0A0A` | Primary background, hero, logo field |
| `--pure-black` | `#000000` | Slab backgrounds, deepest contrast |
| `--graphite` | `#1A1A1A` | Elevated panels / cards on dark |
| `--ash` | `#2A2A2A` | Borders & dividers on dark |
| `--silver` | `#A1A1AA` | Secondary / muted text |
| `--off-white` | `#F5F5F4` | Light-mode background, subtle panels |
| `--vault-white` | `#FFFFFF` | Primary text on dark; surfaces on light |

### Accents (use sparingly)
| Token | Hex | Role |
|-------|-----|------|
| `--madrid-gold` | `#C8A75B` | **Primary accent** — grails, 1/1, featured, key CTAs |
| `--gold-soft` | `#E3CE9A` | Gold hover / subtle gold text on dark |
| `--madrid-blue` | `#00529F` | Secondary accent — crest blue, links, tags (rare) |

### Semantic
| Token | Hex | Role |
|-------|-----|------|
| `--success` | `#16A34A` | For Sale / For Trade positive states |
| `--danger` | `#DC2626` | Destructive actions, "Sold" |

**Accent discipline:** Gold is precious. Never flood a page with it. If everything is gold, nothing is.

### Tailwind config snippet
```js
// tailwind.config.ts → theme.extend.colors
colors: {
  vault:   { black: '#0A0A0A', white: '#FFFFFF' },
  graphite:'#1A1A1A',
  ash:     '#2A2A2A',
  silver:  '#A1A1AA',
  offwhite:'#F5F5F4',
  madrid:  { gold: '#C8A75B', goldSoft: '#E3CE9A', blue: '#00529F' },
  success: '#16A34A',
  danger:  '#DC2626',
}
```

### CSS variables (drop into `globals.css`)
```css
:root {
  --vault-black:#0A0A0A; --pure-black:#000000; --graphite:#1A1A1A;
  --ash:#2A2A2A; --silver:#A1A1AA; --off-white:#F5F5F4; --vault-white:#FFFFFF;
  --madrid-gold:#C8A75B; --gold-soft:#E3CE9A; --madrid-blue:#00529F;
  --success:#16A34A; --danger:#DC2626;
  --bg:var(--vault-black); --fg:var(--vault-white); --accent:var(--madrid-gold);
}
```

---

## 3. Logo

Primary mark: **"ADG" monogram** with **"MERENGUE VAULT"** in widely letter-spaced caps beneath, struck by a thin horizontal rule (file: `foto/Logo.png`).

- **Default:** white logo on black (signature look).
- **Inverse:** black on white for light surfaces.
- **Clear space:** ≥ the height of the "A" on all sides.
- **Min size:** 96px wide (desktop nav), 72px (mobile).
- **Favicon / avatar:** ADG monogram in a black circle.
- **Never:** shadows, gradients, color fills, rotation, stretching, or white logo on busy/light imagery without a dark scrim.

---

## 4. Typography

Two-typeface system: a bold display face that echoes the logo, plus a clean grotesque for everything else.

| Role | Typeface | Treatment |
|------|----------|-----------|
| Display / Headings | **Anton** or **Archivo Black** | UPPERCASE, condensed, bold |
| Body / UI | **Inter** (or Geist) | Neutral, excellent small |
| Numbers / Stats / Serials / Prices | **Inter** + tabular nums | `font-feature-settings:"tnum"` |

### Scale
| Element | Size | Weight | Tracking |
|---------|------|--------|----------|
| Hero title | `text-6xl`–`7xl` | 900 | uppercase, `tracking-tight`→`wide` |
| Section title | `text-3xl`–`4xl` | 800 | uppercase, `tracking-wide` |
| Card title (player) | `text-lg`–`xl` | 700 | normal |
| Body | `text-base` | 400 | normal |
| Label / caption | `text-xs`–`sm` | 500 | uppercase, `tracking-wide`, `--silver` |

Headings uppercase with wide tracking; body sentence case. Stats always tabular.

---

## 5. Layout & spacing

- **Grid:** 12-col, max width `1280px` (`max-w-7xl`), generous gutters.
- **Section rhythm:** `py-16` → `py-24`.
- **Radius:** `rounded-xl` / `rounded-2xl` on panels.
- **Borders:** hairline `--ash`; avoid heavy boxes.
- **Elevation:** contrast + subtle shadow on `--graphite` panels, not loud outlines.
- **Mobile-first** (audience comes from Instagram). Collection grid and stats must look excellent on a phone.

---

## 6. The card (hero element)

Treat each card like a gallery piece.

- Show on **near-black** backgrounds so slabs pop (mirrors the IG grid).
- **Aspect ratio ≈ 5 : 7** (`aspect-[5/7]`). Never crop a slab — letterbox on black if needed.
- **Hover:** gentle `scale-105`, soft shadow, optional slab "shine" sweep (respect `prefers-reduced-motion`).
- **Corner badges:** `GRADED` + grade, `1/1`, `ROOKIE`, `AUTO`, `PATCH`, `GRAIL`, `FEATURED`.
  - Grail / 1-of-1 / Featured badges → gold. Status badges → semantic colors. Everything else → graphite/ash with white text.
- **Watermark:** discreet "ADG / MERENGUE VAULT" on imagery (subtle, off-center), applied at upload.

---

## 7. Component direction (shadcn/ui)

| Component | Style notes |
|-----------|-------------|
| Header / nav | Sticky, vault-black, hairline bottom border; logo left, links center/right; **`Buy · Sell · Trade` gold CTA → Instagram DM**. Mobile: full-screen black overlay menu. |
| Buttons | Primary = gold fill, black text. Secondary = ash border, white text, transparent. Ghost = text only. Generous padding, subtle radius. |
| Card tile | Image-dominant, minimal chrome, player + season + grade/serial below; badges overlaid. |
| Stat card | Big tabular number, small uppercase silver label; thin gold underline accent on key stats. |
| Badge / tag | Pill, uppercase, `tracking-wide`; gold for premium, semantic for status, graphite otherwise. |
| Filter bar | Quiet controls, active filters shown as removable chips. |
| Lightbox / gallery | Black backdrop, image centered, minimal controls, zoom. |
| Footer | Black, logo + tagline, nav mirror, Instagram link, "© ADG Merengue Vault — Private Collection." |
| 404 / empty | On-brand black, "This vault is empty" tone. |

**Icons:** `lucide-react` — thin, geometric, consistent stroke.

---

## 8. Voice & copy

- **Tone:** curatorial, understated, collector-to-collector, a touch of Madridista pride.
- **Lexicon:** "the vault", "grails", "PC" (personal collection), "pickups", "memorabilia", "legacy".
- **Avoid:** hype ("INSANE DEAL!!!"), clutter, on-site emoji (emoji live on IG, not the premium site).
- **Standard CTAs:** `Explore the Vault` · `See the Grails` · `View Card` · `Enquire via Instagram DM` · `Buy · Sell · Trade`.
- **Language:** English UI.

---

## 9. Imagery

- Only the collection's own card photography — no stock.
- High-contrast, centered slabs on black; consistent framing.
- Palette in photos: Real Madrid white, stadium-night blacks, gold light.

---

## 10. Accessibility

- WCAG AA contrast. White-on-vault-black passes easily; **gold is for large text / accents only**, not body copy.
- Descriptive `alt` on every card image (e.g. "2023 Stadium Club Cristiano Ronaldo Porsche Refractor, PSA 10").
- Visible focus states — **gold ring** for keyboard nav.
- Respect `prefers-reduced-motion` for hover/shine animations.

---

## 11. Quick reference card

```
Mood:      Minimal luxury · vault · gallery · Madridismo
Mode:      Dark-first
BG:        #0A0A0A   Text: #FFFFFF   Muted: #A1A1AA
Panel:     #1A1A1A   Border: #2A2A2A
Accent:    #C8A75B (gold — grails/1of1/featured/CTA only)
2nd accent:#00529F (Madrid blue — rare)
Display:   Anton / Archivo Black (UPPERCASE)
Body:      Inter (tabular nums for stats)
Card ratio:5 : 7 on near-black
Rule:      Gold is precious. Space is luxury. Cards are the hero.
```
