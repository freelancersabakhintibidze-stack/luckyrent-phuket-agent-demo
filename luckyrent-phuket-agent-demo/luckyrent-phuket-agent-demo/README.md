# Luckyrent Phuket · 24/7 Booking Agent Demo

An independent, working demo of an AI booking agent for **Luckyrent Phuket**
(motorbike & scooter rental, Phuket, Thailand), prepared as a free gift by
**Saba Khintibidze** (AI automation engineer). Not the official Luckyrent site.

- Public demo (Surface A): `/` — honesty banner, real fleet data, live 4-language chat demo
  (EN / RU / UA / TH), finished booking cards, "Hand to manager" flow.
- Owner console (Surface B): `/owner` — coverage clock (09:00-21:00 staffed vs 12 h waiting),
  KPI ledger, revenue-leak calculator, inbox of finished bookings, append-only audit log, FAQ.
- Legal & provenance (Surface C): `/terms`, `/privacy`, `/provenance`.

The "AI agent" in this demo is a **deterministic scripted engine** (a state machine over
`data/scripts.json`), clearly labeled as a demo of the agent UX. No LLM, no API keys, no paid
services, no network calls at runtime. The production agent would be LLM-backed with the same UX
and the same honesty rules (stated in the owner console FAQ).

Truth contract honored throughout: every price, spec, zone, quote and hour traces to the real
source block (public luckyrent-phuket.com + their Telegram bio, fetched 2026-10-20); everything
else is visibly labeled **DEMO** or **SAMPLE** with the reason "simulated for demonstration", and
every calculated figure shows its formula in the UI.

## One-command deploy to Vercel

```bash
npx vercel --prod
```

That is the whole setup. Framework auto-detected (Next.js), build command `next build`,
output `.next`. **Zero environment variables are required.**

Zero-env guarantee:

- No `DATABASE_URL`, no LLM keys, no third-party services. The demo store is in-memory, mirrored
  to the visitor's `localStorage` so a booking handed over on `/` appears in the owner inbox on
  `/owner` in the same browser (`lib/store.ts`). In production, `lib/store.ts` is the single swap
  point for a real database.
- `SITE_URL` (used only for absolute metadata / sitemap / OG URLs) falls back to
  `http://localhost:3000` when `VERCEL_URL` / `VERCEL_PROJECT_PRODUCTION_URL` are absent, so local
  builds work with no configuration at all.
- Fonts are self-hosted (`public/fonts/`, generated once by `scripts/fetch-fonts.mjs`); the app
  makes no runtime requests to Google or any other third party.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

## Scripts

| command            | what it does |
| ------------------ | ------------ |
| `npm run dev`      | Next.js dev server |
| `npm run build`    | production build |
| `npm run start`    | serve the production build (`PORT` env respected) |
| `npm run lint`     | ESLint (flat config, `next/core-web-vitals` + `next/typescript`) |
| `npm run typecheck`| `tsc --noEmit` (strict, `noUncheckedIndexedAccess`) |
| `npm test`         | unit tests (node:test + tsx): price math, agent engine, stock conflicts |
| `npm run e2e`      | Playwright suite: 4-language bookings, audit rows, 375px, reduced motion |

## Where to edit what

| you want to change | edit |
| ------------------ | ---- |
| fleet models, tier prices, specs, zones, value props, rating, review quotes | `data/fleet.ts` (single source of truth, mirrors the real data block) |
| conversations: intents, per-language scripts, keywords, booking slot prompts, card labels | `data/scripts.json` |
| price rules (tier lookup + nearest-tier pro-rate) and the formula strings | `lib/pricing.ts` |
| availability model (SAMPLE capacities + seeded sample bookings) | `lib/stock.ts` |
| SAMPLE seeds: inbox conversations, audit rows, KPI values, calculator defaults | `data/seed.ts` |
| demo store / hand-over / audit mutations (production DB swap point) | `lib/store.ts` |
| design tokens, components, cursor styles | `app/globals.css` |

## Quality gates (run before delivery, all clean)

- `npm run lint` · `npm run typecheck` · `npm run build` — clean.
- `npm test` — 28 unit tests, including the mandated edge durations 1, 6, 8, 29, 45 days and the
  verbatim Section 4 answers in all four languages.
- `npm run e2e` — Playwright: one completed booking per language with exact tier totals
  (14-day Scoopy = 2,520 ฿); `/owner` audit log gains exactly 4 rows after 4 handovers;
  double-booked overlap refused with named conflicts; 375px has no horizontal scroll on any route;
  reduced-motion mode runs zero animations; honesty banner present on every route.

## Provenance (full table in-app at `/provenance`)

| data point | source | fetched |
| ---------- | ------ | ------- |
| brand, rating 4.7 / 743 Google reviews, headline price from 130 ฿/day (~$4), 4 value props | https://luckyrent-phuket.com/ (homepage + reviews widget) | 2026-10-20 |
| 60-minute delivery promise | https://luckyrent-phuket.com/location/bang-tao-beach/ | 2026-10-20 |
| staff hours: bookings 09:00-21:00, support 10:00-20:00 | Luckyrent Telegram bio (per project data block) | 2026-10-20 |
| 6 models: load/max/comfortable specs + 7/14/21/30-day tier prices | homepage fleet section; product pages (e.g. /product/honda-scoopy-110/) | 2026-10-20 |
| zones Bang Tao, Kamala, Rawai + island-wide delivery | /location/bang-tao-beach/, /location/kamala-rent-bike/, /location/rawai-motorbike-rental/, homepage | 2026-10-20 |
| 2 review quotes (Jordan Guerin, A. Zinbi), used verbatim with names | public reviews widget on their homepage | 2026-10-20 |

Everything else (KPI seeds, stock, sample bookings LR-SAMPLE-*, night-message volume, close rate,
demo refs LR-DEMO-*) is invented for illustration and labeled SAMPLE/DEMO in the UI; the
point-by-point inventory is on `/provenance`.

## Design system

"Night-tropics": deep emerald ground (`#04110A`) with soft radial glows, warm gold accents
(`#D4AF37` / `#ECC95C`), ivory text. Cormorant Garamond for large display headings and big
figures (lining numerals), Inter 400-600 for all body and UI text, JetBrains Mono only for data
(refs, dates, formulas). Real card components with rounded corners (14-22px) and soft depth;
pill buttons, chips and tags; slim honesty strip on top plus a sticky blurred nav bar; two-column
hero with a rating/price stat card; card grids for fleet (3 across), delivery zones (4 across),
handover steps and reviews; KPI cards, styled sliders and result cards in the owner console;
zebra-striped audit and provenance tables. Minimum text size is 11px (labels) and 12px+ for
notes; body is 16px. The custom gold ring cursor no longer hides the native cursor.
All tokens live at the top of `app/globals.css`. Icons are inline SVG only; fonts are self-hosted.

## Spec-conflict resolutions (for transparency)

- The brief bans em dashes in UI copy but quotes some strings containing them (banner, caption,
  intent-2 answer). Every word of those strings is preserved; the em dashes were replaced with
  sentence splits or middle dots so both rules hold.
- "No skeleton loaders" is listed among the slop mistakes to avoid missing, so the owner console
  shows brief skeleton states while its client store hydrates (static under reduced motion).

## Contact

Built by Saba Khintibidze · AI automation engineer · t.me/Saba_Khintibidze999 ·
github.com/freelancersabakhintibidze-stack
