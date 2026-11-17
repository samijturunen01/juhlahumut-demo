# Juhlahumut – website redesign concept

> **Konseptidemo.** Tämä on Juhlahumujen verkkosivuston uudistuskonsepti, ei yrityksen virallinen sivusto. Tarjouspyyntölomake on demotilassa: mitään ei lähetetä eikä tallenneta. Virallinen sivusto: [juhlahumut.fi](https://juhlahumut.fi/).

A speculative redesign of [juhlahumut.fi](https://juhlahumut.fi/), a private event venue with a sauna, games room and catering in Joensuu, Finland. All customer-facing copy is in Finnish. It is a complete multi-page site built from the company's own photographs and verified business information.

**Live demo:** https://samijturunen01.github.io/juhlahumut-demo/ (`noindex`)

## Concept – "Ilta syttyy" (the evening lights up)

Juhlahumut's logo is a neon sign over a city at dusk, and the art direction grows from it: warm black, amber light, neon red, and cream editorial pages between the dark ones. Typography pairs **Fraunces** (an expressive optical-size serif with a lively italic) with **Instrument Sans**.

- **Homepage intro (~3 s, once per session, skippable):** the real venue photo starts unlit. The logo's amber disc and skyline glow up and the name lights like a neon tube – current runs through it, it flickers once and holds. Its light then spreads over the photograph, revealing the room from the sign outwards, and the wordmark flies into the header while the headline rises. It never blocks: navigation works from the first frame, any scroll or key press completes it, and with `prefers-reduced-motion` it does not run.
- **Pages:** Etusivu, Juhlatilat, Hinnasto, Catering, Galleria, Yhteystiedot, Tarjouspyyntö, Kokoukset and a branded 404.
- **Signature details:** the venue tour told as one evening, with a sticky clock (16:00 → 22:00, labelled as illustration); an occasions index with a cursor-following photo; printed-menu cards; a tilted "disc" from the logo reused as light and as a photo mask; a full-screen gallery viewer with keyboard, swipe and thumbnails.

## Stack

React 19 · Vite 8 · TypeScript · Tailwind CSS 4 · React Router 8 · GSAP 3 + ScrollTrigger · Lucide icons. Every route is **prerendered to static HTML** at build time and hydrated in the browser, so deep links, refreshes and HTTP 404s work natively on GitHub Pages.

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173/juhlahumut-demo/
npm run check        # typecheck + lint + unit tests + production build
npm run build        # dist/ (client build → SSR build → prerender)
node scripts/serve-dist.mjs   # serve dist/ exactly like GitHub Pages, on :4173
npm run test:e2e     # Playwright on desktop, tablet and mobile (after a build)
```

Node ≥ 22.22. On Windows, run Vitest from a path with an upper-case drive letter (`C:\…`). A lower-case `c:\` working directory makes Vitest load two copies of itself.

| Script | What it does |
| --- | --- |
| `npm run images` | Re-creates `public/images/` (AVIF + WebP, 400–1200 px) and `src/data/images.generated.ts` from `assets-src/originals/` |
| `npm run typecheck` / `lint` / `test` | TypeScript, ESLint, Vitest (46 tests) |
| `npm run test:e2e` | 56 Playwright checks: every route, 404, back/forward, mobile menu, intro, reduced motion, gallery keyboard and swipe, catering, quote form |

## Project structure

```
src/
  data/         company, pricing, menus, venue, gallery, occasions, pages – the single source of truth
  pages/        one component per route
  components/   home/ sections · layout/ header, footer, demo badge · quote/ form, date picker
                gallery/ lightbox · pricing/ panels · ui/ picture, page hero, CTA band
  lib/          quote/ (validation, prefill, estimate, transports) · dates · format · gsap
  hooks/        page reveal motion, document meta, mounted
  brand/        authentic/ real logo (vector, used by the site) · fallback/ neutral wordmark
  styles/       design tokens and component styles (Tailwind 4 @theme)
scripts/        prerender, image optimisation, GitHub Pages-like server, screenshot helpers
docs/           ASSET_PROVENANCE · CONTENT_VERIFICATION · BACKEND_INTEGRATION
e2e/            Playwright tests
```

To change prices, menus or contact details, edit `src/data/`. The unit tests in `src/data/data.test.ts` will then fail and point at what to re-verify.

## Demo safeguards

- "Demo" badge in the header on every page, a notice in the footer, and a notice on the form.
- `noindex,nofollow` everywhere. No canonical URL, sitemap or structured-data URL points at the company's domain (`ALLOW_INDEXING=false`).
- The quote form uses `src/lib/quote/transports/mock.ts`: no network request, no storage. After submitting it says **"Demoversio – tarjouspyyntöä ei lähetetty."**
- No secrets anywhere. The future Apps Script / reCAPTCHA integration is documented, not enabled ([docs/BACKEND_INTEGRATION.md](docs/BACKEND_INTEGRATION.md)).

## Authentic logo

The real Juhlahumut logo is rebuilt as layered vector art (neon script traced 1:1, amber disc, skyline with lit windows) in `src/brand/authentic/`, generated by `scripts/build-logo.mjs` (`npm run logo`) from the original bitmap in `assets-src/brand/logo-original.png`. Permission to publish it was confirmed on 17.11.2026 (see [docs/ASSET_PROVENANCE.md](docs/ASSET_PROVENANCE.md)), and the demo uses it in the intro, header and footer.

The build picks the authentic art automatically when `src/brand/authentic/` exists. `src/brand/fallback/` keeps a neutral wordmark with the same interface; build with `VITE_BRAND_LOGO=wordmark` to use it instead.

## Deployment

`.github/workflows/deploy.yml` runs typecheck, lint, tests and the build on every push to `main`, then publishes `dist/` to GitHub Pages. The base path is derived from the repository name. For a custom domain at the root, build with `VITE_BASE_PATH=/`. Set `ALLOW_INDEXING=true` and `SITE_URL=https://…` **only** on the company's own authorised domain.

## Before production

See [docs/CONTENT_VERIFICATION.md](docs/CONTENT_VERIFICATION.md) for the full list. In short:

- the owner confirms the current VAT-inclusive catering prices (the old site still says "alv 14 %") and the hot-tub VAT-free figure;
- the owner confirms Christmas-season weekend pricing, the actual booking procedure, and whether to promote weddings;
- the real backend (Apps Script + server-side reCAPTCHA), a privacy notice and consent text;
- `ALLOW_INDEXING=true`, `SITE_URL` and a custom domain – only with the company's authorisation.
