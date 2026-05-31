# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`Sponsor` is L1nSn0w's sponsor hub at **sponsor.sn0w.fyi** — a postage-stamp
thank-you wall plus a collapsible "buy me a coffee" CTA. It is a static
React + Vite + Tailwind v4 single page: one route, no router, no backend, no
tests. It shares the "desk / annotated notebook" aesthetic of the main homepage
(sn0w.fyi) so the two read as the same hand.

## Commands

Package manager is **bun** (see `bun.lock`).

```bash
bun install
bun run dev          # vite dev server
bun run build        # tsc -b && vite build  → dist/
bun run lint         # eslint .
bun run lint:fix     # eslint . --fix
bun run format       # prettier --write .
bun run format:check # prettier --check .
bun run preview      # serve the built dist/
```

## Architecture

The codebase is deliberately tiny and split along one axis: **content vs. layout.**

- **`src/sponsors.json`** — the hand-maintained source of truth: the `afdian`
  support link and the `sponsors` array (each with `name`, optional `tier`,
  `link`, `message`, `seed`, `date`). Edit the wall here without touching code.
- **`src/sponsors.ts`** — types `sponsors.json`, re-exports `afdian`/`sponsors`,
  and defines the `TIERS` map (tier → sticker label + marker accent;
  deliberately no amounts, so the wall stays a thank-you, not a leaderboard).
- **`src/Sponsor.tsx`** — the page itself: the stamp wall (`StampCard`,
  `TierBadge`), the `SupportCoffee` CTA (drawn `CoffeeCup`, Afdian link, WeChat
  QR), and the page shell/header. `WALL_LIMIT` bounds how many stamps show.
- **`src/Avatar.tsx`** — a DiceBear "micah" avatar generated deterministically
  from a seed, rendered square to sit inside a postage-stamp frame.
- **`src/components/desk.tsx`** — the reusable presentational primitives that
  carry the aesthetic: `Monogram`, `HandUnderline`, `LinkDoodle`, `DashedFrame`,
  `Pushpin`, `SectionLabel`. Internal-only helpers (`useHoverReplay`,
  `Annotation`, `Spark`, the `MARKER` map) are not exported.
- **`src/index.css`** — the design system, defined through Tailwind v4's
  `@theme` and `@layer` blocks rather than a JS config. Defines the named font
  roles (`--font-sans` body, `--font-mono` labels, `--font-hand` marker
  scribbles, `--font-script` corner monogram), the warm-paper palette, and
  component classes (`.sticky-note`, `.note`, `.postage`, `.fold`, the
  entrance/scribble/inkwipe/steam animations).
- **`src/main.tsx`** — the entry: imports `@/index.css` and renders `<Sponsor />`.

The `@` alias points at `src/` (see `vite.config.ts` and `tsconfig.app.json`).

When adding sponsors, edit `src/sponsors.json`. Reach for `src/components/` (and
`index.css`) only for genuinely new visual elements — put reusable primitives in
`desk.tsx`.

## Conventions

- Tailwind v4 is configured via the Vite plugin (`@tailwindcss/vite`) and
  `@import "tailwindcss"` in `index.css` — there is **no `tailwind.config.js`**.
  Design tokens are CSS variables in the `@theme` block; reference them as
  Tailwind utilities (e.g. `text-ink`, `bg-paper`) or via `var(...)`.
- The aesthetic relies on intentional irregularity (slight tilts, uneven
  border-radii, hand-drawn marker fonts). Match the surrounding style when
  adding elements rather than normalizing them.
- Fonts are bundled (not loaded from a CDN). Body/mono/marker faces come from
  `@fontsource*` imports in `index.css` (mono uses only the Latin 400 + 500
  subsets). The decorative `Pinyon Script` monogram is a self-hosted A–Z subset
  at `src/assets/fonts/pinyon-script-AZ-400.woff2` (~12 kB) declared via a local
  `@font-face`; regenerate it with `pyftsubset … --unicodes="U+0041-005A"`.
- Formatting is handled by **Prettier** (`prettier.config.js`: double quotes,
  semicolons, trailing commas); `eslint-config-prettier` is last in
  `eslint.config.js` so ESLint doesn't fight it. Run `bun run format` before
  committing — don't hand-format.

## Deployment

Deployed to Cloudflare Workers Static Assets as the `sn0w-sponsor` Worker at
`sponsor.sn0w.fyi`. `wrangler.jsonc` serves `./dist`. GitHub Actions
(`.github/workflows/deploy.yml`) builds and deploys on push to `main`.

The custom domain (`sponsor.sn0w.fyi`) is **not** managed by `wrangler.jsonc` —
it is provisioned once by hand in the Cloudflare dashboard (Workers & Pages →
`sn0w-sponsor` → Settings → Domains & Routes → Add → Custom Domain). This keeps
the CI deploy token scoped to **Workers Scripts: Edit** only; it never needs
Workers Routes / DNS permissions on the `sn0w.fyi` zone. (Putting a
`custom_domain` route back in `wrangler.jsonc` makes wrangler call the zone's
`/workers/routes` endpoint on every deploy, which fails with API error 10000
unless the token is also scoped to that zone.)
