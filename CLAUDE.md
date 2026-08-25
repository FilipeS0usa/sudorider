# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Website for **SudoRider** (<https://www.youtube.com/@SudoRider>), a Portuguese motovlog by Filipe —
CFMOTO 450 MT ("a Dora"), riding around Portugal. Published to GitHub Pages.

**Current state: built and deploying.** All seven pages exist, along with the design system
(`src/styles/tokens.css` + `global.css`), both maps, the `rotas` content collection, the GPX
reader and both workflows. The site has one published route and a small number of map pins; what
is thin is *content*, not structure. `docs/design-system.md` is the specification the build was
written against — read it before changing anything visual, and see the note below on where this
file overrides it.

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

**Where the specs and the build disagree, this file wins.** Two overrides so far, both
deliberate:

- **The wordmark is `SudoRider`, capitalised.** `docs/brand.md` §7 specifies a lowercase
  `sudorider`; Filipe overrode that. The ochre rule still spans exactly `Sudo`.
- **The map popup is not a single `<a>`.** `docs/design-system.md` §5.4 originally specified one
  anchor wrapping the whole popup. It cannot stay that way now the popup offers two actions — the
  video and the route write-up — because an anchor inside an anchor is not valid HTML. §5.4 has
  been rewritten to match the build; the note stays here because "the whole popup is one link" is
  the kind of shape someone reintroduces while tidying up.

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

**GPX is read at build time, by hand, with no dependency.** `src/lib/gpx.ts` parses the track,
measures it, simplifies it (Ramer–Douglas–Peucker) and can project it to an SVG path. It is
deliberately lenient — GPX in the wild comes out of phones, Garmins and Strava exports with
varying attribute order, single quotes, namespace prefixes and self-closing elements — and it
drops bad points rather than throwing, because one corrupt point in ten thousand should not cost
the reader the whole track. `RouteMap.astro` parses the file at build time and bakes the
coordinates into a data attribute, so the browser never fetches the `.gpx`. A raw track is tens of
thousands of points; past a few hundred the polyline costs payload without changing a rendered
pixel, hence the simplify-and-cap before it reaches the markup.

`trackToSvgPath()` exists and works but **is not wired into `RouteCard`** — the card still renders
the sanctioned meta-only fallback from design-system §5.2. That is the one piece of the GPX work
left to connect.

**Map pins are grouped by place, not one per video.** Two rides filmed in the same town land
within a few hundred metres of each other, and at the zoom levels this map uses that puts one
marker exactly on top of another: the one underneath cannot be clicked, cannot be tabbed to, and
reads as a missing video. `src/lib/locais.ts` groups them. The key is the place name — accents and
extra whitespace folded — so the *author* decides what shares a pin: same name groups, different
names do not. A distance threshold was considered and rejected, because it would silently regroup
pins whenever coordinates were edited, and design-system §5.4 already tells authors to nudge
coincident coordinates apart.

The key includes the country, not just the place name, so a Faro in Portugal and a Faro elsewhere
stay two pins instead of one averaged across a border. A pin with no `country` counts as
`SITE.paisPredefinido`, so omitting it at home never splits a place in two — and the country is
shown only when it is not the default, because on a Portuguese motovlog "Portugal" on every pin is
noise while "Espanha" is news.

**The map pans the whole world; only the opening view is about Portugal.** Two earlier versions
derived `maxBounds` from the pins — first a tight box, then a generous one — and both made the map
assert there was nothing past Portugal. That is the wrong claim for a channel that intends to ride
elsewhere, so the only limit left is the edge of the map itself: ±180° of longitude and the
latitudes Web Mercator can draw (±85.05°), which stops a drag wandering into the grey above the
pole or into a repeated copy of the world. `minZoom: 2` reaches a world view.

**There is no `maxBounds` at all, and that is the point.** Seeing the whole world means the world
is smaller than the viewport, and that is precisely the state in which Leaflet recentres:
`_panInsideMaxBounds` fires on `moveend`, and its `_rebound()` returns the recentring offset
`(left - right) / 2` whenever the viewport exceeds the box. `maxBoundsViscosity` does not prevent
this — it only limits how far a drag travels, never the spring-back — so *any* maxBounds, the whole
world included, turns every drag into a snap-back once you are zoomed out far enough to see it all.
Deriving a zoom floor from the viewport avoids the snap-back only by preventing the world view,
which is the thing that was wanted. Without maxBounds the handler is never registered and there is
nothing to spring back from. The cost is that panning can run past the edge of the map; `noWrap` on
the tile layer keeps that as honest grey instead of a repeated copy of the world.

The opening view still frames the rides (`fitBounds` over pins *and* track points), because
landing on a world map with one invisible dot in it helps nobody. Panning and zooming from there
is unrestricted.

That module is shared by `RideMap.astro` and `mapa.astro` on purpose. The "Locais" list under the
map is the map's text alternative (WCAG 1.1.1) — if the map draws one pin for Évora carrying two
rides, a flat list of two "Évora" entries describes a map that is not there. The grouping policy
therefore lives in one place; only presentation is allowed to differ. It was briefly written out
twice, and the two copies had drifted apart before anyone noticed.

`agruparLocais()` also fails the build on authoring mistakes that would otherwise ship silently: a
pin with no video id, coordinates that are not finite numbers (`locais.json` is *cast*, not
parsed, so a quoted number type-checks fine), and entries sharing a name that are tens of km
apart — two places that would end up with one pin between them. Duplicate video ids and videos
missing from `videos.json` warn instead, because the page still works.

**The overview map draws route tracks, not just pins.** A pin says where a video was filmed; a
track says where the ride went, and for a linear route those are very different things — without
the track, a 130km run down the Costa Vicentina and a 5km loop are the same dot. `/mapa` therefore
reads every published route's GPX at build time (`tracadosDasRotas()`) and bakes the coordinates
in alongside the pins.

The overview simplifies far harder than a route page does: 100m tolerance against the route
page's 10m, because at national zoom a point every 100m is already finer than a pixel. That is
what makes it affordable — measured at ~3KB for a 130km route, so twenty-five of them cost on the
order of 75KB of coordinates. The point cap is shared out across a route's segments rather than
applied to each one: a GPX recorded with pauses in it arrives as a dozen segments, and a per-segment
cap silently buys a dozen budgets. Tracks are drawn `interactive: false` and land in the overlay pane, so the
pins in the marker pane stay on top, a track can never swallow a click meant for a pin, and
nothing new enters the accessibility tree. The routes are listed in text under the map from the
same source that draws them, so the alternative cannot advertise a route the map does not show.

**The route↔video link is derived, not stored.** A route's frontmatter already carries the
YouTube id, so `src/lib/rotas.ts` indexes the collection by it and the map asks that index whether
a pin has a route to offer. `locais.json` has no route field — one id to keep correct instead of
two. Drafts are excluded, since linking to a page `getStaticPaths` does not emit would ship a 404
from the map.

`video` takes **one id or a list of them**, because one ride is not always one video — a long day
gets published as "Parte 1" and "Parte 2". Every id in the list indexes to the same route, so a
pin for either part offers the write-up. `idsDeVideo()` normalises the two shapes in one place, and
everything downstream reads a list; the alternative is two readers disagreeing about what a bare
string means. The route page renders one button per video, numbered rather than called "Parte N" —
the numbering is ours, and only the author's titles know whether these are parts, camera angles or
a re-cut.

**Moving focus around a Leaflet popup takes three tricks, all of them found by measuring.** They
are cheap to "simplify" and every simplification silently breaks keyboard use, so:

1. **`focus()` has to keep asking.** While Leaflet is opening or tearing a popup down, a `focus()`
   call is a no-op that reports no error. How long that lasts depends on the path: with animations
   on it takes immediately; with `prefers-reduced-motion` (fadeAnimation off) it needs tens of
   milliseconds. `focar()` retries across a few frames rather than hard-coding a delay that would
   be wrong on a slower machine.
2. **Whether focus was in the popup must be recorded on the way in.** Leaflet fires `popupclose`
   *after* `DivOverlay.onRemove` has detached the container, so asking the question at close time
   answers "no" and the pin never gets focus back.
3. **Closing has two shapes.** With fade on, removal is deferred by a timeout, so at `popupclose`
   the popup is still in the document and still holds focus. With fade off it is already detached
   and focus has fallen to `<body>`. The close handler accepts both, and nothing else — someone
   who tabbed to the zoom control should not be dragged back to the pin.

Do not rewrite any of this against `focusin`/`focusout`: focus events do not fire when the window
itself is not focused, which makes that version untestable headlessly and quietly wrong in a
background tab. `document.activeElement` is correct in both.

**Leaflet's Escape handling cannot be trusted, so the map does it itself.** Leaflet binds its
document `keydown` listener on the map container's `focus` event and unbinds it on `blur` — and
`focus`/`blur` do not bubble. The moment a user tabs from the container to a marker or into a
popup, Leaflet has already torn the listener down. With a mouse it works, because every
`mousedown` hands focus back to the container; by keyboard, which is exactly who needs it, Escape
does nothing. `RideMap.astro` therefore keeps one `keydown` listener on the canvas. Do not remove
it as redundant. For the same reason the component moves focus into the popup on open and back to
the pin on close: Leaflet never moves focus, and the popup pane sits *after* the marker pane in
the DOM, so tabbing from a freshly opened popup would otherwise skip everything it just revealed
and land on the next pin.

## Agents

`.claude/agents/` holds a project-scoped roster (frontend, UI/UX, brand, web GIS/cartography,
DevOps, accessibility, code review, SEO, video optimisation), committed so it travels with the
repo rather than living on one machine. See `.claude/agents/README.md` for what each is for.

## Licensing

Dual-licensed on purpose: code is MIT (`LICENSE`), and site content — text, images, video stills —
is CC BY-SA 4.0 (`LICENSE-CONTENT.md`). Keep contributions on the correct side of that line.
