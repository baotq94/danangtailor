# Design System — Đà Nẵng tailor stall

> Source of truth for every visual decision on the site. If
> `design-system/danangtailor/pages/<page>.md` ever exists, it overrides this
> file for that page. There is one page, so expect it never to exist.

**Status:** Phase 0 draft, awaiting review · 2026-09-17
**Direction:** a real local shop that has done this for years. Photos carry the
page; type and layout get out of the way. Light mode only.

---

## 0. What the generator produced, and what was cut

The ui-ux-pro-max generator was run
(`"tailor local shop minimal photo-led"`, variance 3 / motion 1 / density 3).
Its output was then cut back against the brief:

| Generated | Decision | Why |
|---|---|---|
| Outfit (headings) + Work Sans (body) | **Cut both** | Outfit has no Vietnamese: glyph check found 97 of 135 tested Vietnamese characters missing, including `ẵ` in "Nẵng". Two Latin faces would also be one font too many once a CJK face is added. |
| Green `#15803D` primary + green secondary + pink `#EC4899` accent | **Cut** | Three hues, taken from a florist template. Nothing to do with fabric or the market. |
| "Hero + Features (3–5) + CTA" pattern | **Cut** | This is the forbidden three-feature-cards row. Page structure is fixed by the brief (S1–S8). |
| GSAP ScrollTrigger scroll reveal | **Cut** | Brief forbids scroll-triggered fade-ins and animation libraries. |
| Shadow scale (sm → xl), card hover lift `translateY` | **Cut** | No shadows. Hover never moves anything. |
| Modal `backdrop-filter: blur(4px)` | **Cut** | Too close to glassmorphism. |
| "Use Heroicons / Lucide" checklist item | **Cut** | Brief forbids decorative icon libraries. We use 8 hand-written inline SVGs. |
| Radius 8–16px | **Reduced** | 4px on controls only. Photos have square corners. |
| Spacing scale (spacious), 4.5:1 contrast, visible focus, reduced motion, 44px targets | **Kept** | These are sound defaults. |

Result: **1 Latin typeface + 1 CJK counterpart per script, 1 accent, 0 gradients, 0 shadows.**

---

## 1. Typography

### 1.1 Choice

| Script | Face | Weights | Used for |
|---|---|---|---|
| Latin + Vietnamese | **Be Vietnam Pro** | 400, 600 | Everything in vi / en, and all Latin text inside ko pages |
| Hangul | **Noto Sans KR** | 400, 600 | Hangul glyphs (reached through the font stack) |
| Kana / Kanji (phase 2) | **Noto Sans JP** | 400, 600 | `:lang(ja)` only |

This is **one voice**: a single sans with one CJK match for each script. There is
no separate display face.

### 1.2 Why this pairing: verified, not assumed

Checked on 2026-09-17 against the full font files from `google/fonts`, using a
cmap check with fontTools and a headless Chrome render.

| Font | "Nhà may Đà Nẵng" | All 134 Vietnamese letters + `₫` | Korean sentence | Japanese sentence |
|---|---|---|---|---|
| Be Vietnam Pro 400/600 | ✅ | ✅ | — (stack) | — (stack) |
| Noto Sans KR | ✅ | ✅ | ✅ | ✅ glyphs present, but Korean glyph forms for kanji (see 1.4) |
| Noto Sans JP | ✅ | ✅ | ❌ | ✅ |
| Lora | ✅ | ❌ no `₫` | ❌ | ❌ |
| Outfit (generator) | ❌ no `ề` | ❌ 97 of 135 missing | ❌ | ❌ |

Rendered side by side (`Nhà may Đà Nẵng · 한시장에서 아오자이를 24시간 안에 맞춤 제작해 드립니다. · Áo dài từ 1.200.000 ₫`):

- **Be Vietnam Pro → Noto Sans KR (chosen).** Hangul sits at the same weight and
  optical height as the Latin text next to it. Nothing visibly swaps
  mid-sentence. The shop name looks exactly the same on /vi, /ko and /en.
- **Noto Sans KR for everything.** Works, but its Latin is narrower and plainer.
  The shop name would look different on /ko than on /vi.
- **Lora → Noto Sans KR.** Serif Latin next to sans Hangul in the same line is
  exactly the mid-sentence clash the brief warns about. Prices would also pull
  `₫` from a fallback font. Rejected.
- **Outfit.** `ề` renders from a fallback font, and the difference is visible.
  Rejected.

Be Vietnam Pro was drawn for Vietnamese: stacked diacritics (`ề ẫ ặ ỗ`) are
spaced properly rather than squashed. That matters because every heading on /vi
contains them.

### 1.3 Font stacks

```scss
--font-sans: "Be Vietnam Pro", "Noto Sans KR", "Apple SD Gothic Neo",
             "Malgun Gothic", system-ui, sans-serif;

:lang(ja) {  // phase 2
  --font-sans: "Be Vietnam Pro", "Noto Sans JP", "Hiragino Sans",
               "Yu Gothic", system-ui, sans-serif;
}
```

The stack is the same on every locale; each face's `unicode-range` decides which
glyphs come from where. A Korean testimonial on /vi (`<blockquote lang="ko">`)
renders correctly with no extra rule.

### 1.4 Loading (performance on 4G)

- **Self-hosted** `woff2`, served from the same origin on Cloudflare. No request
  to Google Fonts at runtime: no extra DNS/TLS round-trip on 4G, and no visitor
  IP sent to a third party.
- **Be Vietnam Pro:** only the `latin` + `vietnamese` subsets, 400 and 600, 4
  files. Preload the 600 `latin` file used by the hero heading.
- **Noto Sans KR:** Google's unicode-range slices mirrored by
  `npm run fonts:fetch` (120 variable files, each declared once as `400 600`).
  The @font-face rules live in `/fonts/noto-sans-kr.css`, **linked on /ko only**
  (via `fontStylesheet` in `locales.ts`), so /vi and /en don't carry 23 KB of
  gzipped CSS. On those pages the "한국어" switcher label uses the system Korean
  font, which is acceptable for one small label.
- **Noto Sans JP** only arrives with the ja locale. Noto Sans KR's kanji follow
  Korean Hanja forms, so ja **must** use the JP face, not the KR fallback.
- `font-display: swap`, plus a metric-matched fallback `@font-face` (`size-adjust`
  / `ascent-override` over local Arial) so the swap doesn't shift layout.

### 1.5 Scale (mobile-first, fluid)

| Token | Value | Use |
|---|---|---|
| `--text-sm` | `0.875rem` (14px) | Captions, meta, filename labels. Never body text. |
| `--text-base` | `1rem` → `1.0625rem` ≥ 64rem | Body |
| `--text-lg` | `1.25rem` | Lead sentence, step titles, prices |
| `--text-xl` | `clamp(1.5rem, 1.2rem + 1.2vw, 2rem)` | Section headings (h2) |
| `--text-2xl` | `clamp(2rem, 1.4rem + 2.6vw, 3.25rem)` | Shop name (h1) |
| `--text-display` | `clamp(3rem, 2rem + 5vw, 5.5rem)` | The turnaround number "24h" only |

### 1.6 Rules

- Two weights only: **400** and **600**. No light weights; they break down on
  small, low-DPI Android screens.
- Line height: body `1.6`, headings `1.25` (stacked Vietnamese marks need the
  room). `:lang(ko)` body `1.7`.
- **No all-caps anywhere.** Uppercase Vietnamese collides with the line above,
  and it does nothing for Hangul or kana.
- Letter-spacing `0`. Headings may use `-0.01em`, but never on `:lang(ko)` or
  `:lang(ja)`.
- `:lang(ko) { word-break: keep-all; }` so Korean breaks between words, not
  mid-word. `:lang(ja) { line-break: strict; }` in phase 2.
- Line length: `max-width: 60ch` for Latin paragraphs, `34rem` for ko.
- No `tabular-nums`: Be Vietnam Pro has no `tnum` feature (checked: its GSUB
  features are `aalt case ccmp dnom frac liga locl numr ordn sinf ss01 subs sups`).
  Price columns line up by being **right-aligned** instead.
- Text is **left-aligned**. Nothing is centred except the numeral inside a
  square step marker.

---

## 2. Colour

Taken from what's actually at the stall: unbleached silk and raw cotton on the
shelves, tailor's chalk, dark thread, and the red silk of a wedding áo dài.

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F6F1E9` | Page ground: unbleached silk |
| `--linen` | `#EBE4D8` | Alternate section band (S5 Finding the stall, S7 Contact) |
| `--ink` | `#2A2420` | Text and headings: dark thread, not pure black |
| `--ink-muted` | `#675D54` | Secondary text, captions, meta |
| `--rule` | `#D6CCBE` | 1px hairlines between rows and sections: tailor's chalk. Decorative only. |
| `--control-border` | `#8C8177` | Outlines of secondary buttons and filter tabs |
| `--placeholder` | `#D3CEC6` | Grey photo placeholder fill |
| `--placeholder-ink` | `#4F4943` | Filename label on placeholders |
| **`--accent`** | **`#9B2F26`** | **The one accent: red áo dài silk. Interactive elements only.** |
| `--accent-hover` | `#7E251E` | Darker shade of the same accent, for hover/active. Not a second colour. |
| `--on-accent` | `#F6F1E9` | Text on accent fills (same value as paper) |

### 2.1 Verified contrast (WCAG 2.2)

| Pair | Ratio | Requirement |
|---|---|---|
| ink on paper | 13.62 | AA text ✅ |
| ink on linen | 12.12 | AA text ✅ |
| ink-muted on paper | 5.71 | AA text ✅ |
| ink-muted on linen | 5.08 | AA text ✅ |
| placeholder-ink on placeholder | 5.67 | AA text ✅ |
| accent on paper (links) | 6.60 | AA text ✅ |
| accent on linen (links) | 5.88 | AA text ✅ |
| on-accent on accent (buttons) | 6.60 | AA text ✅ |
| on-accent on accent-hover | 8.61 | AA text ✅ |
| control-border on paper | 3.38 | 3:1 non-text UI ✅ |
| rule on paper | 1.41 | Decorative only. Never the sole boundary of a control. |

### 2.2 Rules

- **The accent means "you can press this".** Buttons, links, the selected filter
  tab, the Zalo button. Never on headings, rules, icons that aren't in a control,
  or backgrounds.
- The Zalo button uses the site accent with a visible "Zalo" label, **not** Zalo
  brand blue. A second hue would break the one-accent rule, and the word carries
  the recognition. *(Open for review. See business-requirements §13.)*
- No gradients, not even subtle ones. No tints of the accent as backgrounds.
- No purple, indigo or blue anywhere.
- There is no error/destructive colour: the site has no forms or error states. If
  one is ever needed, it is a text message in `--ink` with an icon, not red,
  because red is already the interactive colour.
- Photos are never overlaid with colour, darkening layers or white text.

---

## 3. Space and layout

### 3.1 Spacing (4px base)

| Token | Value |
|---|---|
| `--space-1` | `0.25rem` (4) |
| `--space-2` | `0.5rem` (8) |
| `--space-3` | `0.75rem` (12) |
| `--space-4` | `1rem` (16) |
| `--space-6` | `1.5rem` (24) |
| `--space-8` | `2rem` (32) |
| `--space-12` | `3rem` (48) |
| `--space-16` | `4rem` (64) |
| `--space-24` | `6rem` (96) |

Section `padding-block`: `--space-16` on mobile, `--space-24` at ≥ 64rem.

### 3.2 Grid

- Container: `max-width: 72rem`. Side gutter `--space-4` (mobile), `--space-6`
  (≥ 48rem), `--space-12` (≥ 80rem).
- Breakpoints (min-width): `30rem` (480), `48rem` (768), `64rem` (1024), `80rem` (1280).
- Below 64rem: one column. ≥ 64rem: 12-column grid, `gap: --space-6` (the grid and the sections' `grid-column` spans switch at the same breakpoint).
- **Asymmetric by default.** Text blocks sit on the left and span 5–7 columns.
  Images take the larger share. Sections don't mirror each other.

### 3.3 Section layouts

| Section | Mobile | ≥ 64rem |
|---|---|---|
| S1 Hero | Photo (3:2, full width) → h1 → one line → **24h** → call button | Text cols 1–5, photo cols 6–12, top-aligned |
| S2 Story | Heading, 3–4 sentences, `60ch` | Heading cols 1–4, text cols 5–11 |
| S3 Work | Filter tabs → 2-col grid of 4:5 | 3 cols at 48rem, 4 cols at 64rem |
| S4 Process + prices | 4 steps stacked (1:1 image left 30%, text right) → price rows | 4 steps in a row → price list cols 1–7, fabric note cols 9–12 |
| S5 Finding the stall | `--linen` band. Stall number large → front photo → approach photo → hours → map | Photos cols 1–7 stacked; stall number, hours, directions, map cols 8–12 |
| S6 Testimonials | Stacked quotes, rules between | 2 columns, **no cards** |
| S7 Contact | `--linen` band. Phone number at `--text-2xl`, Zalo, address, hours | Phone cols 1–7, details cols 9–12 |
| S8 Footer | Plain rows | Name / address / hours / phone in one line of 4 |

**Hero must pass at 375 × 667:** the "24h" figure and the call button are visible
without scrolling, with the header counted. Photo height at 375px ≈ 250px.

### 3.4 Other

- **Radius:** `--radius: 4px` on buttons and tabs only. Photos and placeholders
  have `0`.
- **Shadows:** none. Separation comes from `--rule` hairlines and the `--linen`
  band.
- **Borders:** 1px only.

---

## 4. Components

### 4.1 Header (sticky)

- **Language strip** above the bar: `--linen`, right-aligned, 44px tall links,
  current language bold + underlined. It scrolls away; it is not sticky.
- **Bar:** height 56px, sticky, `--paper` ground, always a 1px `--rule` bottom
  border (no scroll listener).
- Mobile: shop name (left) · "Menu" disclosure button (`aria-expanded`) · **call
  button with icon, short label "Gọi", accessible label "Gọi 0900 000 000"**.
  No horizontally scrolling nav strip.
- ≥ 64rem: name · anchor links · phone number as text link.
- `scroll-margin-top: 64px` on every section so anchors don't land under the
  header.

### 4.2 Buttons

| Variant | Spec |
|---|---|
| Primary (call) | `--accent` fill, `--on-accent` text, 600, `min-height: 48px`, `padding: 12px 20px`, radius 4, phone icon + number |
| Secondary (Zalo, "Open in Google Maps") | Transparent, 1px `--control-border`, `--ink` text. Hover: border and text turn `--accent`. |
| Hover | `background-color` / `color` / `border-color` only, `120ms ease-out`. **No transform, no shadow, no opacity change.** |
| Focus | `outline: 2px solid var(--ink); outline-offset: 3px` on `:focus-visible`, on every interactive element. Never removed. |

All targets ≥ 44 × 44px, with ≥ 8px between adjacent targets.

### 4.3 Links

In body copy: `--accent`, always underlined (`text-underline-offset: 0.2em`,
1px). Hover: `--accent-hover`, 2px underline. Colour is never the only cue.

### 4.4 Phone number

- Always links to `tel:+84900000000`. That works from a Vietnamese SIM and from a
  Korean/Japanese/Western roaming SIM.
- Displayed as `0900 000 000` on /vi and `+84 900 000 000` on /ko, /en (and /ja),
  because a tourist copying the digits needs the country code.
- In S7 it is the largest interactive text on the page (`--text-2xl`, 600,
  accent, underlined).

### 4.5 Floating Zalo button

- `position: fixed`, bottom-right, offset `max(16px, env(safe-area-inset-bottom))`.
- 48px tall pill: Zalo mark + "Zalo" label, accent fill.
- **Doesn't cover content:** on < 48rem, `body` gets
  `padding-bottom: calc(48px + 32px)` so the last line of the footer scrolls clear
  of it. It never overlaps the S7 call button: hide it
  (`visibility: hidden`, no animation) while S7 is in the viewport, using one
  `IntersectionObserver`.

### 4.6 Work filter (S3)

- A `role="group"` of `<button aria-pressed>` tabs: Tất cả / Áo dài / Đồ cách tân /
  Vest & âu phục.
- Selected: `--ink` text + 2px `--accent` bottom border. Unselected:
  `--ink-muted`, 1px `--control-border` bottom border.
- Filtering swaps the grid immediately. **No animation, no reflow effect.**

### 4.7 Photo slot / placeholder

- Wrapper with `aspect-ratio` fixed per slot (see §6). The `<img>` inside has
  explicit `width` / `height`, `object-fit: cover`.
- Placeholder state: `--placeholder` fill, label bottom-left in `--text-sm`
  `--placeholder-ink`: `hero.jpg · 3:2`. Mark as `role="img"` with the
  translated alt text, so the a11y tree matches the finished page.
- `loading="lazy"` + `decoding="async"` everywhere **except** the hero, which gets
  `fetchpriority="high"`, no lazy.

### 4.8 Lightbox (S3, optional)

- Native `<dialog>` + `showModal()`. About 30 lines, no library.
- `::backdrop { background: rgb(42 36 32 / 0.9); }`. **No blur.**
- The image is shown at its natural ratio with `max-height: 90dvh`. The close
  button is 44px, top-right, labelled. Esc and backdrop click both close it, and
  focus returns to the thumbnail.
- Opens with no animation, or a `120ms` opacity fade that is removed under
  `prefers-reduced-motion`.

### 4.9 Process step (S4)

- A step number (`01`–`04`, 600, `--ink`) with a 1:1 photo, a title
  (`--text-lg`) and one sentence.
- The turnaround line sits right under the steps, in body text rather than a
  badge: **"24–48h"**.

### 4.10 Price list (S4)

- A `<dl>` or two-column table. Each row: garment name (left) ·
  `từ 1.200.000 ₫` (right-aligned). `--rule` hairline between rows.
- Price formatting via `Intl.NumberFormat(locale, { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })`
  with "from" wording from the dictionary.
- Under the list, in `--ink-muted`: the note that the final price depends on the
  fabric.

### 4.11 Testimonial (S6)

- `<figure>` → `<blockquote lang="{quoteLang}">` (quote as published) →
  `<figcaption>`: author name · `<a href={sourceUrl}>Platform ↗</a>`.
- Quote in `--text-lg`, `--ink`. No oversized quotation-mark graphic. No star
  ratings (not part of the data model, never invented). No cards. Rows are
  separated by `--rule`.
- Avatar (optional) is 1:1, 40px, and only if the data has one. No initials
  bubble fallback.

### 4.12 Map (S5)

- A Google Maps `<iframe loading="lazy" title="…">` in a 4:3 frame (mobile) or
  1:1 (≥ 64rem), 1px `--rule` border.
- Always paired with a secondary button, **"Open in Google Maps"**, linking to
  the share URL, because the app is how people actually walk there.
- If Lighthouse shows the iframe costing more than 2 performance points, switch
  to a click-to-load facade (the stall-front photo plus a "Show map" button).

---

## 5. Icons

Exactly eight icons, written by hand as inline SVG. No icon library.

| Icon | Where |
|---|---|
| Phone | Call buttons |
| Zalo mark | Zalo buttons |
| Map pin | "Open in Google Maps", stall number |
| External arrow ↗ | Testimonial source links (tells the reader "leaves this site") |
| Chevron ‹ › | Hero slideshow and work gallery: previous / next |
| Pause ‖ / play ▷ | Hero slideshow |

- 20px in text, 24px in buttons. Stroke `1.5`, `currentColor`, `aria-hidden="true"`,
  always next to a visible text label. The one exception is the carousel controls (chevrons,
  pause/play): icon-only buttons with a translated `aria-label`.
- No icons next to headings, in the story, in steps, or in the footer.

---

## 6. Photography

| Slot | Ratio | Notes |
|---|---|---|
| Hero | **3:2** | One real photo: a finished áo dài or the owner at the stall |
| Work grid | **4:5** (all) | Full garment, consistent framing where possible |
| Stall front / approach | **3:2** | Must be recognisable from the aisle |
| Process steps | **1:1** | Hands, tape, fabric bolts, fitting |
| Testimonial avatars | **1:1**, optional | Only if published with the review |

- Real photos only. Never stock, never AI-generated, never an "illustrative"
  image.
- No filters, colour overlays, duotones or vignettes. Colour correction only.
- The site's colours are neutral so the fabric colours in the photos read true.

---

## 7. Motion

- **Allowed:** colour/border transitions on hover/focus (`120ms ease-out`), the
  optional dialog fade (`120ms`), the carousel slide (`350ms ease-out`, `0ms` under
  reduced motion).
- **Hero slideshow (owner's decision, 2026-09-17):** the one auto-playing element.
  5s per photo, with a pause button; stops on hover, keyboard focus and in a
  background tab; starts paused under reduced motion (WCAG 2.2.2).
- **Forbidden:** scroll-triggered reveals, parallax, any other auto-playing carousel,
  hover transforms, animated counters, loading skeleton shimmer, smooth-scroll
  JS (CSS `scroll-behavior: smooth` is allowed and disabled under reduced motion).
- `@media (prefers-reduced-motion: reduce)` sets every transition to `0ms`.

---

## 8. Voice (visual copy rules)

- Concrete over adjectival: "24h", "stall 123", "from 1.200.000 ₫". *(Stall
  number is a TODO.)*
- Banned words in every language: premium, luxury, crafted with passion, elevate
  your style, and their translations (cao cấp / sang trọng / 프리미엄 / 럭셔리).
- The shop name is always the anonymised one: vi **Nhà may Đà Nẵng**, en **Da Nang Tailor**, ko **Da Nang 테일러샵**. No personal name anywhere.

---

## 9. Pre-delivery checklist (every phase that ships UI)

- [ ] Fonts: at most Be Vietnam Pro + the CJK Noto face. No third family.
- [ ] Exactly one accent (`--accent`, `--accent-hover` shade). Nothing else coloured.
- [ ] `grep -riE "gradient|backdrop-filter|box-shadow|text-transform: *uppercase"` in `src/` → no hits
- [ ] No icon library in `package.json`. Only the 8 inline SVGs.
- [ ] Every `<img>` / slot has `aspect-ratio` and `width`/`height`.
- [ ] Below-the-fold images are `loading="lazy"`. The hero is not.
- [ ] At 375 × 667 the hero shows "24h" and the call button without scrolling.
- [ ] Floating Zalo button never covers the footer's last line or the S7 phone link.
- [ ] Every interactive element has a visible `:focus-visible` outline.
- [ ] All targets ≥ 44px.
- [ ] Nothing centred except step numerals.
- [ ] `prefers-reduced-motion` → no transitions.
- [ ] Rendered and checked on /vi, /ko, /en: no font swap mid-line, no clipped diacritics.
- [ ] Lighthouse mobile (throttled): Performance ≥ 95, Accessibility ≥ 95.
