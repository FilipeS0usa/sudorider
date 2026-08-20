# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for **SudoRider** (<https://www.youtube.com/@SudoRider>), a Portuguese motovlog by Filipe —
CFMOTO 450 MT ("a Dora"), riding around Portugal. Published to GitHub Pages.

**Current state: scaffolded, not built.** Astro 7 is installed and building, with a placeholder
`src/pages/index.astro`. None of the seven real pages, the map, the content collections or the
workflows exist yet. The README is the plan of record; read it before starting work.

`AGENTS.md` (from the Astro starter) carries Astro-specific mechanics and doc links — notably
`astro dev --background` for running the dev server. This file carries project decisions.

## Commands

```bash
npm install
npm run dev      # dev server, hot reload
npm run build    # static build to ./dist
npm run preview  # serve the built output
```

No test suite exists yet; there is no framework decision recorded for one.

## Hard constraints

These are decisions already made. Do not quietly reverse them — raise it with the user instead.

- **Static only.** GitHub Pages serves files; there is no server runtime and no place to hide a
  secret. Anything needing credentials or a backend must run at build time in a GitHub Action, or
  be delegated to a third-party service.
- **No client-side API keys.** A key shipped to a static site is public. This drives two choices:
  video data comes from the channel's public RSS feed rather than the YouTube Data API, and maps
  use Leaflet + OpenStreetMap rather than Mapbox or Google Maps. Both alternatives require keys and
  billing accounts; both were rejected for that reason.
- **Site content is Portuguese.** Every user-facing string, page title, route slug and nav label.
  Code, comments, commit messages and the README stay English.
- **Simple and clean.** Plain CSS with custom properties, no CSS framework. Astro ships zero client
  JS by default — keep it that way. The map is the only genuinely interactive piece.
- **The site runs on the custom domain `sudorider.com`**, served from the root. `site` is set in
  `astro.config.mjs` and `public/CNAME` carries the domain into the build output — deleting that
  file silently drops the custom domain on the next deploy. No `base` is needed, but internal
  links and assets should still go through `withBase()` in `src/lib/url.ts`, which is a
  passthrough today and the single switch if the site ever falls back to the
  `github.io/sudorider` project path. `import.meta.env.BASE_URL` carries no trailing slash, so
  naive concatenation produces `/sudoriderfavicon.svg` — the starter's `index.astro` shipped with
  exactly that bug.

## Architecture notes

**Video listing is generated, not authored.** A scheduled workflow fetches
`https://www.youtube.com/feeds/videos.xml?channel_id=UCLFnLwTJIcE_dL1N7D5epaA` and commits
`src/data/videos.json`. Never hand-edit that file — the next sync overwrites it. To change how
videos are *presented*, edit the component, not the data.

**Leaflet cannot be server-rendered.** It touches `window` at import time, so it must be an island
excluded from the static build (`client:only`), not a plain component. Expect any "the map broke
the build" symptom to trace back to this.

**Three data sources feed the site**, and the map is where they meet: `videos.json` (generated),
`locais.json` (map pins, each carrying the video id it links to), and `src/content/rotas/`
(Markdown route write-ups, each referencing a GPX file in `public/gpx/`). A map pin's whole purpose
is to link a place to the video filmed there, so a pin without a valid video id is a bug.

**The two workflows do not chain by default.** `sync-videos.yml` commits `videos.json` using the
default `GITHUB_TOKEN`, and commits made with that token deliberately do not trigger further
workflow runs. Left alone, a new video lands in the repo but never reaches the built site. The
sync workflow therefore has to either invoke the deploy itself (`workflow_call` /
`workflow_dispatch`) or do the build and publish in the same job. Expect "the video is in
videos.json but not on the site" to trace back to this.

**Routes are a content collection**, so publishing one is a Markdown file plus a GPX track — the
route page, the routes index and the map all derive from that. Keep it a one-file job; that was the
reason Astro was chosen over hand-written HTML.

## Agents

`.claude/agents/` holds a project-scoped roster (frontend, UI/UX, brand, web GIS/cartography,
DevOps, accessibility, code review, SEO, video optimisation), committed so it travels with the
repo rather than living on one machine. See `.claude/agents/README.md` for what each is for.

## Licensing

Dual-licensed on purpose: code is MIT (`LICENSE`), and site content — text, images, video stills —
is CC BY-SA 4.0 (`LICENSE-CONTENT.md`). Keep contributions on the correct side of that line.
