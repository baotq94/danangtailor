# Business requirements — danangtailor

**Status:** Approved; Phases 0–2 built · progress tracked in `docs/plan.md` · 2026-09-17
**Source:** Business brief, plus answers given on 2026-09-17. This document consolidates the brief.
**Companion:** `design-system/danangtailor/MASTER.md` (all visual decisions).

Rule for this document: **nothing here is invented.** Every fact is either
confirmed (with its source) or listed in §3 as a TODO. Where a placeholder is
needed to build the layout, it is marked `TODO` in the data and on the page.

---

## 1. Purpose

A single-page website for a real tailoring stall. Its one job is to get a
visitor to **call, message on Zalo, or walk to the stall**. Orders are taken on
the phone and in person, never on the site.

The site answers, in this order, the questions a tourist has in the few days
they are in town:

1. What does she make? → áo dài, modernised Vietnamese clothing, some vests/suits
2. **How many days until it's ready?** → **24h** (above the fold)
3. Roughly what does it cost? → price list, "from X"
4. Is it good? → photos of real work, real reviews with links
5. How do I find the stall inside Chợ Hàn? → stall number, photos, map pin
6. How do I reach her? → phone, Zalo

### Non-goals

- No online ordering, booking, payment, cart or contact form.
- No blog, news or content that needs updating.
- No invented policies (returns, refunds, payment, shipping).
- No dark mode.
- No Japanese at launch (structure ready, content in phase 2).

---

## 2. Business facts and demo contact data

| Fact | Value | Source |
|---|---|---|
| Owner / shop name | Anonymised: vi **Nhà may Đà Nẵng**, en **Da Nang Tailor**, ko **Da Nang 테일러샵**. The real owner name is deliberately not recorded here. | Owner request, 2026-09-19: keep the shop unidentifiable until she decides to publish. |
| Business | Tailoring stall inside **Chợ Hàn** (Han Market), Đà Nẵng | Brief |
| Products, by importance | 1. Áo dài · 2. Đồ cách tân (modernised Vietnamese clothing) · 3. Vest / suit, occasionally | Brief. **Not** a bespoke suit house; the site must not suggest one. |
| Customers | ~80% tourists (mostly Korean and Japanese, some Western), ~20% Đà Nẵng locals | Brief |
| Market context | Korea = Đà Nẵng's largest inbound market (20.55% of international arrivals, H1 2026). Japan ≈ 3.66%. | Brief |
| Tourist stay | 3–5 days | Brief |
| **Turnaround** | **24 hours** for a dress or an áo dài. **48 hours at most** for anything. | Brief addendum, confirmed as fact |
| Phone | **0900 000 000** → `tel:+84900000000` | Sample for the demo; replace before launch |
| Google Maps place | Da Nang city map · https://www.google.com/maps?q=Da+Nang | Generic demo map; not the shop listing. |
| Coordinates | 16.0544, 108.2022 | Sample city-centre pin; not the shop location |
| Conversion channels | Phone, Zalo, in person | Brief |
| Deploy target | Cloudflare Workers static assets, free tier, `https://example.com` (no custom domain yet) | Brief |

### How turnaround is stated, and where

| Place | Wording | Why |
|---|---|---|
| S1 Hero | **24h** | The decisive number for a tourist. It is true for the main products. |
| S4 Process | **24–48h** | At the stall, over-promising is worse than a slower number on the site. |
| Anywhere else | Don't repeat a third variant | Two statements only, so they never contradict each other |

---

## 3. Unknown: TODO before launch

These are **not** filled in with guesses. Each is `null` (or flagged) in the data
file named here and renders on the page as a grey English badge, e.g.
`TODO T1 stall no.`, so nothing ships looking finished when it isn't. Search the
built HTML for `class="todo"` to list what is still open.

| # | Missing | Needed for | Lives in |
|---|---|---|---|
| T1 | **Stall number** (and floor, if applicable) | S1 subline, S5, S7, footer | `content/site.json` |
| T2 | **Opening hours** (days + times; any closed days) | S5, S7, footer | `content/site.json` |
| T3 | **Real Zalo link** | Floating button, S7. Temporary sample link until the owner supplies it. | `content/site.json` |
| T4 | **Exact postal address line** as the owner wants it shown (market address + stall; Đà Nẵng ward names changed in 2025, so confirm the current form) | S5, S7, footer | `content/site.json` |
| T5 | **Years of experience** and other story numbers | S2 | `content/i18n/*.json` (`story.*`) |
| T6 | **Real prices** (placeholders are seeded) | S4 price list | `content/pricing.json` |
| T7 | **Photos** (hero, work, stall front, approach, process) | All image slots | `photos/` + `photos/manifest.json` |
| T8 | **Testimonials** copied from Google Maps / TripAdvisor / Naver | S6 | `src/app/content/content.ts` (`testimonials`) |
| T9 | **Korean copy review** by a native speaker (and Japanese in phase 2) | All ko strings | `content/i18n/ko.json` |
| T10 | **Google Maps embed URL** from Maps → Share → Embed a map (the short link cannot be embedded) | S5 iframe | `content/site.json`. Until then, a coordinate-based embed is used. |
| T11 | **Directions** from a market entrance, 1–2 sentences (S5) | S5 | `content/i18n/*.json` |
| T12 | **How customers address her** in each language. Copy is currently anonymous: vi "cô", ko "사장님", en "the tailor". | S2 | `content/i18n/*.json` (`story.*`) |

---

## 4. Audience and context of use

- **Device:** a phone, on 4G, often standing in a crowded market aisle. Must
  work one-handed, with the phone number reachable at all times.
- **Language:** Korean is the largest single foreign group, then Japanese and
  Western. Locals read Vietnamese.
- **Can't ask for directions:** foreign customers can't ask a vendor in
  Vietnamese where the stall is. The page has to get them there on its own
  (photos, stall number, map).
- **Time pressure:** 3–5 days in town. The turnaround decides whether they order
  at all.

### Consequences for the build

| Context | Requirement |
|---|---|
| 4G in a market | Lighthouse mobile (throttled) **Performance ≥ 95**. Static HTML, self-hosted fonts, AVIF/WebP, lazy-loaded images. |
| Foreign SIM | `tel:` always uses `+84`. On ko/en the number is also *displayed* with `+84`. |
| One-handed | Call button in the sticky header, targets ≥ 44px, floating Zalo button bottom-right. |
| Screen reader / low vision | **Accessibility ≥ 95**, alt text in every language, visible focus. |

---

## 5. Languages and routing

| Requirement | Detail |
|---|---|
| Launch locales | `vi` (default), `ko`, `en` |
| Phase 2 | `ja`. Adding it = drop in `content/i18n/ja.json` + register `ja` in the locale list + add `ja` alt text to photos. No code changes in components. |
| Routing | `/vi`, `/ko`, `/en`. `/` redirects to `/vi`. Unknown locale → `/vi`. |
| Not allowed | `@angular/localize` (one build per locale is overkill for one page) |
| Mechanism | One JSON dictionary per locale + a **signal-based translation service** that reads the `:lang` route param |
| Prerendering | All locale routes prerendered through `getPrerenderParams` (static output) |
| SEO | `<html lang>` per locale. `<link rel="alternate" hreflang>` for each locale + `x-default` → `/vi/`. Canonical/og/hreflang URLs end in `/` (the files are `vi/index.html`; Cloudflare Pages redirects `/vi` → `/vi/`, verify in Phase 4). Per-locale `<title>`, `description`, `og:title`, `og:description`, `og:locale` (`vi_VN`, `ko_KR`, `en_US`), `og:url`, `og:image`. |
| Language switch | Visible in the header. Each language named in its own script (Tiếng Việt / 한국어 / English). A real link to the same page in the other locale, not a JS toggle. |
| Missing key | Build fails: `ko`/`en` loaders must `satisfy` the shape of `vi.json`, and `t()` keys are typed. Unit test also rejects extra or empty keys. At runtime (drift): dev logs the key and locale, prod falls back to `vi`. |

### Content that is **not** translated

- **Testimonial quotes:** always shown in the language they were published in,
  marked with `lang`, never translated or paraphrased (see §8).
- **Garment names in the price list:** English, same in every locale (owner OK'd
  English, 2026-09-17). The heading, "from" wording and fabric note *are*
  translated.
- **The shop name:** anonymised — vi "Nhà may Đà Nẵng", en "Da Nang Tailor", ko "Da Nang 테일러샵". No personal name appears in any locale; `src/app/app.spec.ts` fails the build if one reappears.

---

## 6. Page structure (single page, anchor navigation)

Header (sticky): shop name · anchor menu · language switch · **call button**.

### S1 — Hero `#top`

- One photo (3:2), or a slideshow when there are several hero photos (owner's decision, 2026-09-17):
  - Advances every 5s, loops, swipes, ‹ › buttons, dots show the position.
  - Pause button always visible. Also stops on mouse hover, keyboard focus and in a background tab.
    Starts paused with reduced motion (WCAG 2.2.2).
  - First photo loads with high priority; the others load after the page has loaded.
- Shop name (h1).
- One line on what she makes: áo dài, modernised Vietnamese clothing, some vests.
- **Turnaround as a concrete number: "24h"**, visually the largest figure on the screen.
- **Primary CTA: the phone number** (call button).
- Must fit above the fold at 375 × 667: photo, name, line, 24h, call button.
- **Not allowed:** white centred text over a darkened full-bleed photo, gradient, a slideshow without a pause button.

### S2 — Story `#story`

- 3–4 sentences, no filler: who she is, how long she has done this, what she makes.
- Numbers (years, etc.) are **TODO placeholders** for the owner to fill (T5).

### S3 — Work `#work`

- Photo grid, all 4:5, in pages of 8: 4 × 2 from 48rem up, 2 × 4 on phones.
- More than 8 photos: swipe or ‹ › buttons move one page, with a visible "Page 2 of 3" counter.
  Loops endlessly (last page → first). Never moves by itself. Reduced motion: no slide animation.
- Filter: **All · Áo dài · Đồ cách tân · Vest & âu phục**. Static, `@for` over a signal. Changing the filter returns to page 1.
- Optional lightbox: native `<dialog>`, about 30 lines, no library.
- Photos and their order come from `photos/manifest.json` (§9).

### S4 — Process `#process`

Four steps, each with a 1:1 photo:

1. Tư vấn & chọn mẫu: consultation and choosing a design
2. Chọn vải: choosing fabric
3. Lấy số đo: measurements
4. Thử & giao: fitting and pickup

- States the turnaround honestly: **"24–48h"**.
- **Price list** follows the steps (§7).

### S5 — Finding the stall `#find` (a real section, not a footer line)

- **Stall number**, large (T1).
- **Photo of the stall front** (3:2), so it can be recognised from the aisle.
- **Photo of the approach / nearest landmark** (3:2), e.g. the entrance or aisle to use.
- One or two sentences of directions from a market entrance *(content TODO,
  written only from the owner's description)*.
- **Embedded Google Maps pin** (lazy iframe) + an "Open in Google Maps" button
  linking to https://www.google.com/maps?q=Da+Nang.
- **Opening hours** (T2).

### S6 — Testimonials `#reviews`

- Layout built now. Content comes later (T8).
- If there are no valid entries, **the whole section and its nav link are hidden**
  (no empty heading).
- Sourcing rules: §8.

### S7 — Contact `#contact`

- **Phone number as a large `tel:` link**. This is the main conversion.
- Zalo button.
- Address.
- Hours.
- **No contact form.**

### S8 — Footer

- Name, address, hours, phone. Nothing else.
- **No** return / refund / payment / shipping policies. No newsletter, no social
  icon row.

### Floating affordance

- **One** Zalo button, fixed bottom-right. It must not cover content on mobile
  (page gets bottom padding; the button hides while S7 is on screen).
- The phone number is always reachable: sticky header call button + hero + S7 + footer.

---

## 7. Price list

**File:** `content/pricing.json`. This is the only place prices exist. Changing a
price must never mean touching a component.

### Data model

```json
{
  "placeholder": true,
  "currency": "VND",
  "items": [
    { "garment": "Áo dài (women)", "priceFrom": 1200000, "currency": "VND" }
  ]
}
```

| Field | Type | Rule |
|---|---|---|
| `placeholder` | boolean | Top level. `true` while the seed prices below are stand-ins; shows a `TODO T6` badge next to the heading. Set to `false` (or delete) with the real prices. |
| `garment` | string | Required. English name, shown as-is in every locale. |
| `priceFrom` | number | Required. Integer VND. No strings, no thousand separators in the file. |
| `currency` | `"VND"` | Required per entry (as the brief specifies). Only VND is supported. |

### Rendering

| Locale | Output |
|---|---|
| vi | `từ 1.200.000 ₫` |
| ko | `₫1,200,000부터` |
| en | `from ₫1,200,000` |

- Number formatting uses `Intl.NumberFormat` for the locale (checked in Node:
  vi → `1.200.000 ₫`, ko/en → `₫1,200,000`). The "from" wording and its position
  come from the dictionary.
- A translated note always follows the list: **the final price depends on the
  fabric.**
- A malformed file (string price, separators, non-VND) **fails the build** with
  the item index, rather than shipping a wrong number.
- No currency conversion to KRW/JPY/USD. Rates change, and a wrong conversion is
  a promise the stall can't keep.

### Seed data: **placeholders, T6, owner will replace**

| garment | priceFrom (VND) |
|---|---|
| Áo dài (women) | 1,200,000 |
| Áo dài (men) | 1,000,000 |
| Áo dài (children) | 600,000 |
| Modernised áo dài (cách tân) | 800,000 |
| Vest / suit jacket | 2,500,000 |
| Trousers | 500,000 |

---

## 8. Testimonials: sourcing rules (enforced in the data model)

**Source:** `src/app/content/content.ts`, field `testimonials`

Reviews are **copied** from Google Maps, TripAdvisor or Naver blogs. They are
never written, paraphrased, "cleaned up", translated or improved.

### Data model

| Field | Type | Required | Rule |
|---|---|---|---|
| `id` | string | ✅ | Stable, unique |
| `quote` | string | ✅ | **1–2 sentences only**, copied verbatim. Never the full review. Cut with `…`, never reworded. |
| `quoteLang` | `"ko" \| "ja" \| "en" \| "vi" \| …` | ✅ | Language the review was written in. Rendered as `lang` on the blockquote. |
| `author` | string | ✅ | Name **exactly as published** on the platform |
| `platform` | `"Google Maps" \| "TripAdvisor" \| "Naver Blog"` | ✅ | Closed list. A new platform = a deliberate code change. |
| `sourceUrl` | string (https URL) | ✅ | **Link to the original review/post** |
| `publishedDate` | string (ISO date) | optional | Only as shown on the platform |
| `avatar` | photo id (1:1) | optional | Only if the reviewer published one |

No star-rating field. Ratings are not shown.

### Behaviour

- The platform name and the source link are **visible** on every rendered quote
  (e.g. "Kim J. · Naver Blog ↗"). Not hidden in a tooltip.
- **An entry missing `sourceUrl`** (or with an empty or non-https URL, or missing
  `quote` / `author` / `platform`):
  - **Dev** (`isDevMode()`): throw an error naming the entry `id` and the missing
    field. The page visibly fails.
  - **Prod:** skip the entry silently.
- Order: entries whose `quoteLang` matches the page locale come first, then the rest
  in file order. A Korean visitor sees Korean reviews first, but every review is
  still shown in its original words.
- Quotes longer than ~2 sentences (> 280 characters) trigger a dev-mode warning.

---

## 9. Photos

### 9.1 Locked aspect ratios (before any photo exists)

| Slot | Ratio | Expected files (placeholder labels) |
|---|---|---|
| Hero | **3:2** | `hero.jpg` |
| Work grid | **4:5**, all of them | `work/ao-dai-01.jpg`, `work/cach-tan-01.jpg`, `work/vest-01.jpg`, … |
| Stall front | **3:2** | `stall-front.jpg` |
| Stall approach / landmark | **3:2** | `stall-approach.jpg` |
| Process steps | **1:1** | `process-1-tu-van.jpg`, `process-2-chon-vai.jpg`, `process-3-so-do.jpg`, `process-4-thu-giao.jpg` |
| Testimonial avatars | **1:1**, optional | `avatars/<testimonial-id>.jpg` |

- Until a photo exists: a grey placeholder at the **exact** ratio, labelled with
  the filename it expects.
- Every `<img>` has `width`/`height` and/or `aspect-ratio`, so there is **no layout
  shift** while loading.
- Everything below the fold is lazy-loaded. The hero loads eagerly with high priority.
- **Never** stock photography or AI-generated images, including as a "temporary" placeholder.

### 9.2 Pipeline (Phase 3)

The manifest format is designed for this landing page (owner, 2026-09-17: "do it
proper since this is landing page, not blog"). It does not copy a blog
`posts.json`.

```
photos/                      ← originals, committed, downscaled to 2000px max edge
  manifest.json              ← hand-edited, the only file to touch when adding a photo
  hero.jpg
  work/ao-dai-01.jpg
  …
scripts/build-photos.mjs     ← prebuild: sharp → AVIF + WebP at 3 widths
public/img/                  ← generated, gitignored
src/app/photos.generated.json← generated: intrinsic width/height + srcset per photo, gitignored
```

### 9.3 Manifest model

```json
{
  "photos": [
    {
      "id": "work-ao-dai-01",
      "file": "work/ao-dai-01.jpg",
      "slot": "work",
      "category": "ao-dai",
      "order": 1,
      "alt": {
        "vi": "…",
        "ko": "…",
        "en": "…"
      }
    }
  ]
}
```

| Field | Rule |
|---|---|
| `id` | Required, unique, used by components and testimonials |
| `file` | Required. Path under `photos/`. Must exist. |
| `slot` | Required: `hero` \| `work` \| `stall-front` \| `stall-approach` \| `process` \| `avatar`. Decides the enforced ratio. |
| `category` | Required when `slot = work`: `ao-dai` \| `cach-tan` \| `vest`. Otherwise absent. |
| `order` | Required. Sort order within its slot (and category). |
| `alt` | **Required for every active locale.** Written by a person. **Never auto-generated.** |

**Adding a photo = drop the file in `photos/` + add one manifest entry.**

### 9.4 Build-time validation (fails the build)

- File referenced but missing, or file present but not in the manifest (warning).
- Missing or empty `alt` for any active locale. When `ja` is added, every photo
  needs `alt.ja` before the build passes.
- Duplicate `id`, unknown `slot` / `category`.
- Source image whose ratio differs from its slot's ratio by more than 2%
  (warning: it will be cropped with `object-fit: cover`).
- Source longer than 2000px on its long edge (warning: downscale before committing).

Output: AVIF + WebP at **480, 960, 1600px** widths, rendered through `<picture>`
with `srcset` / `sizes`.

---

## 10. Site configuration: one place

**File:** `content/site.json`, read at build time.

| Key | Value now | Notes |
|---|---|---|
| `siteUrl` | `https://example.com` | **The one value** behind `<base href>`, `og:url`, canonical and hreflang URLs. Switching to a real domain = changing this line. |
| `phoneE164` | `+84900000000` | `tel:` target |
| `phoneDisplayLocal` | `0900 000 000` | Shown on /vi |
| `phoneDisplayIntl` | `+84 900 000 000` | Shown on /ko, /en, /ja |
| `zaloUrl` | `https://zalo.me/0900000000` | **Sample only (T3)**, owner will replace |
| `mapsUrl` | `https://www.google.com/maps?q=Da+Nang` | "Open in Google Maps" |
| `mapsEmbedUrl` | `TODO` (T10) | Until then, a coordinate-based embed for 16.0544, 108.2022 |
| `stallNumber` | `TODO` (T1) | |
| `hours` | `null` (T2) | `[{ "days": [1,2,3,4,5,6,7], "open": "07:00", "close": "18:00" }]`. ISO weekdays (1 = Monday). One entry per distinct time range; each locale names the days itself (`Monday–Sunday: 07:00–18:00`). |
| `address` | `TODO` (T4) | |
| `cfAnalyticsToken` | `TODO` (Phase 4) | |

---

## 11. Design constraints (summary)

The full system is in `design-system/danangtailor/MASTER.md`. Hard rules:

- Minimal, modern, quietly confident: a shop that has been doing this for years,
  not a startup. Photos carry the page.
- Be Vietnam Pro + Noto Sans KR (Noto Sans JP in phase 2). Chosen after glyph
  coverage and render tests.
- Warm muted palette from fabric/market. **One** accent (`#9B2F26`), only on
  interactive elements. Light mode only.
- **Forbidden:** gradient heroes · purple/indigo · glassmorphism · neumorphism ·
  white centred text over darkened full-bleed photo · a row of three icon feature
  cards · decorative icon libraries · auto-playing carousels (except the hero slideshow, S1) · parallax ·
  scroll-triggered fade-ins · stock or AI images · "premium", "luxury", "crafted
  with passion", "elevate your style" (in any language) · centre-aligning
  everything.

---

## 12. Technical requirements

| Area | Requirement |
|---|---|
| Framework | Angular 22 (repo is on 22.1), standalone components, signals |
| Styling | SCSS + CSS custom properties. **No** Tailwind, UI library or animation library. |
| Rendering | `@angular/ssr`, `outputMode: 'static'`. Fully static output. The Express `server.ts` is removed. |
| Hosting | Cloudflare Workers static assets, free tier, `example.com` |
| Deploy | GitHub Actions + `cloudflare/wrangler-action`, secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. **The Actions-vs-Cloudflare-Git-integration choice is presented with reasoning before any workflow is written** (Phase 4). |
| Analytics | Cloudflare Web Analytics (cookieless → no consent banner). **Not** Google Analytics. |
| Performance | Lighthouse mobile, throttled: **Performance ≥ 95** |
| Accessibility | Lighthouse mobile: **Accessibility ≥ 95**, and WCAG 2.2 AA contrast, keyboard access, visible focus, reduced motion |
| Images | AVIF + WebP, 3 widths, explicit dimensions, lazy below the fold |
| Fonts | Self-hosted woff2, subset. No runtime request to Google Fonts. |

**Known limitation:** Cloudflare Web Analytics has no custom events, so `tel:` and
Zalo clicks **can't be counted**. It reports page views, referrers, countries
and Web Vitals. If click counts matter later, that is a separate decision.

---

## 13. Decisions and open questions for review

### Decisions made in Phase 0 (reversible, flag if you disagree)

| # | Decision | Reason |
|---|---|---|
| D1 | Garment names in the price list are English in every locale | Owner OK'd, 2026-09-17. Keeps prices in one file. |
| D2 | Photo manifest designed for this site, not copied from a blog `posts.json` | Owner, 2026-09-17 |
| D3 | Phone displayed with `+84` on non-Vietnamese locales. `tel:` always `+84`. | Tourists on foreign SIMs |
| D4 | Testimonials shown in their original language only, with matching-language entries first | Translating them would paraphrase customers' words |
| D5 | S6 hidden entirely when there are no valid testimonials | No empty section at launch |
| D6 | Zalo button uses the site accent + "Zalo" label, not Zalo brand blue | One-accent rule |
| D7 | Self-hosted fonts instead of the Google Fonts CDN | 4G latency, no third-party requests |
| D8 | Map iframe lazy-loaded. Switch to a click-to-load facade if it costs > 2 Lighthouse points. | Performance target |
| D9 | No currency conversion in the price list | Rates change; a wrong number is a promise |

### Open questions

| # | Question |
|---|---|
| Q1 | **Zalo vs. tourist messengers:** 80% of customers are tourists, and Korean visitors mostly use KakaoTalk, Western ones WhatsApp. Zalo mainly reaches locals. The brief specifies one Zalo button and that is what will be built. Does she have KakaoTalk or WhatsApp on the same number worth adding later? *(Not adding anything without a yes.)* |
| Q2 | Should the header show the stall number next to the name once T1 is known? It would help people already in the market. |
| Q3 | Hero photo subject: a finished áo dài on a person, or the owner at the stall? It changes what the one-line description under the name should say. (A photo of the owner un-anonymises the site.) |

---

## 14. Phases and acceptance criteria

Work stops after each phase for review.

| Phase | Scope | Done when |
|---|---|---|
| **0** | This document + `MASTER.md`. No code. | Both reviewed and approved |
| **1** | Scaffold to static output, design tokens, fonts, i18n plumbing (routes, dictionaries, service, prerender params, hreflang/og), `content/site.json`, header, empty S1–S8 shells | `ng build` produces `/vi`, `/ko`, `/en` HTML. `/` redirects. hreflang + og tags correct in each file. Font test string renders correctly on all three. |
| **2** | S1–S8 built with placeholders and dictionary keys. Price list from `pricing.json`. Testimonial validation. Lightbox. Floating Zalo. | Every section present in 3 locales. 375 × 667 hero check passes. Dev throws on a testimonial with no link, prod skips it. MASTER.md checklist passes. |
| **3** | `sharp` prebuild, manifest + validation, `<picture>` output | Adding a photo = file + one manifest entry. A missing alt fails the build. No CLS from images. |
| **4** | Hosting decision explained → workflow → Cloudflare Workers → Web Analytics → Lighthouse | Live at `example.com`. Mobile Lighthouse Performance ≥ 95 and Accessibility ≥ 95 on /vi, /ko, /en. |
