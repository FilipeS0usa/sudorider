# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for **SudoRider** (<https://www.youtube.com/@SudoRider>), a Portuguese motovlog by Filipe —
CFMOTO 450 MT ("a Dora"), riding around Portugal. Published to GitHub Pages.

**Current state: scaffolded, not built.** Astro 7 is installed and building, with a placeholder
`src/pages/index.astro`. Both workflows exist (Pages deploy and the
daily video sync). None of the seven real pages, the map or the content collections do yet. The README is the plan of record; read it before starting work.

`AGENTS.md` (from the Astro starter) carries Astro-specific mechanics and doc links — notably
`astro dev --background` for running the dev server. This file carries project decisions.

## Commands

```bash
npm install
npm run dev          # dev server, hot reload
npm run build        # static build to ./dist
npm run preview      # serve the built output
npm run sync:videos  # refresh src/data/videos.json from the channel RSS feed
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

**The wordmark is `SudoRider`, capitalised.** `docs/brand.md` §7 specifies a lowercase
`sudorider`; Filipe overrode that. The ochre rule still spans exactly `Sudo`. The brand doc has
not been rewritten, so treat this file as the authority where the two disagree.

**Video listing is generated, not authored.** `sync-videos.yml` runs `scripts/sync-videos.mjs`
daily, which reads the channel's RSS feed and commits `src/data/videos.json`. Never hand-edit that
file — the next sync overwrites its fields. To change how videos are *presented*, edit the
component, not the data. Run it locally with `npm run sync:videos`.

**Leaflet cannot be server-rendered.** It touches `window` at import time, so it must be an island
excluded from the static build (`client:only`), not a plain component. Expect any "the map broke
the build" symptom to trace back to this.

**Three data sources feed the site**, and the map is where they meet: `videos.json` (generated),
`locais.json` (map pins, each carrying the video id it links to), and `src/content/rotas/`
(Markdown route write-ups, each referencing a GPX file in `public/gpx/`). A map pin's whole purpose
is to link a place to the video filmed there, so a pin without a valid video id is a bug.

**The two workflows chain explicitly, and must keep doing so.** `sync-videos.yml` commits
`videos.json` with the default `GITHUB_TOKEN`, and commits made with that token deliberately do
not fire the `push` trigger. So `deploy.yml` is a reusable workflow (`on: workflow_call`) that the
sync calls directly in a second job, gated on a `changed` output. Removing that `workflow_call`
trigger, or the `deploy` job in the sync, reintroduces the failure quietly: the video appears in
the repo, both workflows report success, and the site never updates.

**The feed 404s intermittently from CI.** Observed in a real scheduled run: YouTube answered the
RSS feed with 404 from a GitHub Actions runner, and the identical request succeeded on a re-run
minutes later and always succeeds from a home connection. It appears to be datacenter-IP related.
`sync-videos.mjs` therefore sends a browser user-agent and retries four times with backoff before
giving up. Do not reduce this to a single attempt: the visible symptom is a red workflow, but the
real cost is a morning where a newly published video is silently skipped until the next run.

**Shorts are excluded from the site by choice.** Filipe wants the site to carry the full
motovlogs only. The filter lives in `src/lib/videos.ts`, which every page and component reads
videos through — not in the sync, which still records Shorts and their `isShort` flag. So
reversing the decision is one line and no history is lost. `VideoCard` keeps its 9:16 handling for
the same reason; it is currently unexercised, not dead.

**Shorts are detected by probe, not by heuristic.** The feed carries no aspect ratio and every
thumbnail is 480x360, so nothing in the feed distinguishes a 9:16 Short from a 16:9 video — and a
title heuristic fails on real data (the channel's Short says "Short" in the title but carries no
`#shorts` tag). `youtube.com/shorts/<id>` answers definitively: 200 for a Short, a redirect to
`/watch` otherwise. The probe sends a consent cookie because from an EU IP every YouTube request
302s to a consent interstitial, which would silently classify everything as "not a Short". The
result is cached per video, so it is probed once and never again.

**The RSS feed only returns the latest 15 entries.** `scripts/sync-videos.mjs` therefore *merges*
into `videos.json` keyed by video id instead of overwriting it — otherwise the sixteenth upload
would silently delete the back catalogue from the site. The script also refuses to write when the
feed parses to zero entries, so a change to YouTube's feed format fails loudly rather than
emptying the file.

**Deleting a route file does not un-build it.** Astro's content layer keeps a persistent data
store at `node_modules/.astro/data-store.json` — *not* in `.astro/`, which is the obvious place to
look. Removing a Markdown file from `src/content/rotas/` leaves its entry in that store, so the
page keeps being emitted from a stale record and `rm -rf .astro dist` does not help. Clear
`node_modules/.astro` as well. CI is unaffected (it installs fresh), so this only ever bites
locally — which is exactly why it is confusing.

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
