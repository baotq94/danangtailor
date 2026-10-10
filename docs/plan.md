# Plan — danangtailor

Tracking checklist for `docs/business-requirements.md` (BR). Tick a box when it
is done and verified. IDs (T1, Q1, D6…) match the BR.

Last updated: 2026-09-17

---

## Phases

- [x] **Phase 0**: business requirements + `design-system/danangtailor/MASTER.md`
- [x] **Phase 1**: static prerender `/vi` `/ko` `/en`, typed dictionaries, fonts, SEO tags, header
- [x] **Phase 2**: S1–S8, price list, testimonial validation, lightbox, floating Zalo
- [ ] **Sample launch** (see below)
- [ ] **Phase 3**: photo pipeline
- [ ] **Phase 4**: hosting, deploy, analytics, Lighthouse
- [ ] **Launch**: all TODO content replaced with real content

---

## Sample launch (now)

One build only (chosen 2026-09-17, owner accepts the risk): the site goes live with
sample content in `src/app/content/content.ts`. `npm start` / `npm run build`.
Everything listed under "Real content from the owner" is still sample until ticked.

- [x] Sample photos (35 Unsplash: 5 hero, 24 work gallery, credits in `photos/CREDITS.md`)
- [x] Hero slideshow: 5 photos, 5s autoplay with pause, swipe, loop
- [x] Work gallery: 8 per page (PC 4×2, phone 2×4), swipe + ‹ ›, endless loop
- [x] Sample stall number, address, hours, directions, 5 reviews; years = 25
- [x] `noindex` while content is sample (robots meta + `public/_headers` X-Robots-Tag)
- [x] Wording: vi "Giới thiệu", "Mẫu may"; vi story rewritten; ko / en story to match
- [x] Photos → WebP (`npm run photos`, sharp, 480/960/1600 into `.photos/`, served at `/img/`)
- [x] Deploy: GitHub → Cloudflare Workers Git integration (static assets, `wrangler.jsonc`)
  - Build `npm run build` · deploy `npx wrangler deploy` · Node from `.node-version`
  - [x] `siteUrl` set to the workers.dev URL
- [ ] Show the owner, collect feedback

---

## Phase 3: photo pipeline (BR §9)

- [x] `photos/` folder for originals (≤ 2000px long edge)
- [ ] `photos/manifest.json` (id, file, slot, category, order, alt per locale)
- [ ] `scripts/build-photos.mjs` prebuild: sharp → AVIF + WebP at 480 / 960 / 1600 (WebP done)
- [ ] Generated `public/img/` + `src/app/photos.generated.json` (gitignored)
- [ ] `PhotoSlot` renders `<picture>` with `srcset` / `sizes`, width/height set (WebP `srcset` / `sizes` done)
- [ ] Build fails on: missing file, missing/empty alt for any locale, duplicate id, unknown slot/category
- [ ] Build warns on: file not in manifest, ratio off by > 2%, source > 2000px
- [ ] Work grid + filter + lightbox read order and category from the manifest
- **Done when:** adding a photo = file + one manifest entry · a missing alt fails the build · no CLS from images

---

## Phase 4: hosting (BR §12, §14)

- [x] Explain GitHub Actions + wrangler-action vs Cloudflare Git integration → **Git integration** (2026-09-17)
- [x] Public repository with a fresh Git history
- [ ] Connect this repository to Cloudflare Git integration
- [ ] Deploy the public demo to Cloudflare Worker `danangtailor`; update `siteUrl` after deployment
- [ ] Verify redirects after deployment
- [ ] Verify canonical / hreflang / og URLs on the live site
- [ ] Configure a new Cloudflare Web Analytics token in `content/site.json` if analytics is needed
- [ ] Lighthouse mobile, throttled, on `/vi/` `/ko/` `/en/`: **Performance ≥ 95**
- [ ] Lighthouse mobile: **Accessibility ≥ 95**
- [ ] D8: if the map iframe costs > 2 points, switch to click-to-load

---

## Real content from the owner (BR §3)

Contact details and the map use anonymised demo values (see `content/site.json` and `src/app/content/content.ts`); T5 years = 25 is real. Remove `noindex` (content.ts + `public/_headers`) once T1–T4, T6–T8, T11 are real.

- [ ] **T1** Stall number (and floor) → `content/site.json` `stallNumber`
- [ ] **T2** Opening hours, closed days → `content/site.json` `hours`
- [ ] **T3** Real Zalo link → `content/site.json` `zaloUrl`, set `zaloIsSample: false`
- [ ] **T4** Address line as she wants it shown (2025 ward names) → `content/site.json` `address`
- [x] **T5** Years of experience → `src/app/content/content.ts` `yearsOfExperience`
- [ ] **T6** Real prices → `content/pricing.json`, set `placeholder: false`
- [ ] **T7** Real photos (hero, 8+ work, stall front, approach, 4 process) → `photos/` (after Phase 3)
- [ ] **T8** Real reviews copied from Google Maps / TripAdvisor / Naver, with links → `src/app/content/content.ts` (`testimonials`)
- [ ] **T9** Korean copy checked by a native speaker → `content/i18n/ko.json`
- [ ] **T10** Google Maps embed URL (Share → Embed a map) → `content/site.json` `mapsEmbedUrl`
- [ ] **T11** Directions from a market entrance → `src/app/content/content.ts` `directions`
- [ ] **T12** How customers address her (currently anonymous: vi "cô", ko "사장님", en "the tailor") → `content/i18n/*.json`

---

## Open questions (need an answer)

- [ ] **Q1** KakaoTalk / WhatsApp on the same number? (nothing added without a yes)
- [ ] **Q2** Show the stall number next to the name in the header once T1 is known?
- [ ] **Q3** Hero photo: a finished áo dài on a person, or the owner at the stall?
- [ ] **D6** Zalo button: keep site red, or Zalo brand blue?
- [ ] Count call / Zalo taps? (Cloudflare Web Analytics can't, BR §12: separate decision)

## Known issues

- [ ] At 320px width, the floating Zalo button can overlap the Korean hero call button after scrolling

---

## Later (not at launch)

- [ ] Japanese: `content/i18n/ja.json` + register `ja` + `alt.ja` on every photo
- [ ] Custom domain: change `siteUrl` in `content/site.json`
