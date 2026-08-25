# SudoRider

Website for **[SudoRider](https://www.youtube.com/@SudoRider)** — a Portuguese motovlog about
trading screens for a helmet.

> *SudoRider | trocar os ecrãs por um capacete.*
>
> Sou o Filipe, ando numa CFMOTO 450 MT (a Dora) por Portugal e por onde a estrada nos levar a
> seguir. Ainda sem formato fixo: passeios, viagens, uma ou outra escapadela de campismo.
> Nascido em Évora, a viver em Lisboa, sempre à procura do próximo motivo para arrancar.

This repository holds the source for the project's website, published to GitHub Pages.

## Status

**Built and deploying.** The channel launched in August 2026 and the site went up alongside it.
All seven pages, the design system, both maps, the route collection, the GPX reader and both
workflows are in place. What is thin is content: the route write-ups and the map pins fill in as
videos come out.

## What the site is for

A home base outside YouTube: somewhere to introduce the project, keep the videos in one place,
show the gear that actually gets used, map where the rides happened, and publish the routes so
other people can ride them too.

## Sections

| Section | Route | Purpose |
| --- | --- | --- |
| **Início** (Home) | `/` | Short introduction to SudoRider, latest video, entry points to the rest |
| **Sobre** (About) | `/sobre` | The longer story — the person, the bike, why the channel exists |
| **Vídeos** (Videos) | `/videos` | Every video from the channel, newest first, embedded |
| **Equipamento** (Gear) | `/equipamento` | Cameras, mounts, helmet, comms, luggage — what's used and why |
| **Mapa** (Map) | `/mapa` | Interactive map of ride locations; clicking a pin opens that place's video |
| **Rotas** (Routes) | `/rotas` | Individual route write-ups with a track, distance, and notes |
| **Contacto** (Contact) | `/contacto` | Email and socials for collaborations and questions |

Site content is in **Portuguese**, matching the channel. This README stays in English as
developer documentation.

## Tech stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | [Astro](https://astro.build) | Ships static HTML with no client JS by default; content collections make "publish a route" a one-file job |
| Styling | Plain CSS with custom properties | The brief is *simple and clean* — a framework would be more weight than the site needs |
| Maps | [Leaflet](https://leafletjs.com) + OpenStreetMap tiles | Free, no API key, no billing account, no vendor lock-in |
| Route tracks | GPX files in the repo | Portable, exportable from any GPS app, renderable directly on the map |
| Video data | YouTube RSS feed → committed JSON | Public feed, no API key and no quota |
| Hosting | GitHub Pages via GitHub Actions | Free and already where the repo lives |
| Domain | `sudorider.com` via `public/CNAME` | Served from the root, so no base-path juggling |

**Why not the YouTube Data API:** it requires an API key, and any key shipped to a static site is
public. The channel's RSS feed (`/feeds/videos.xml?channel_id=…`) is public, needs no
authentication, and carries everything the listing needs — id, title, publish date, thumbnail.

**Why not Mapbox or Google Maps:** both want an account, a key, and a credit card on file.
Leaflet with OpenStreetMap tiles has none of those requirements.

## Structure

```
.github/workflows/
  deploy.yml           # reusable: build + publish to GitHub Pages
  sync-videos.yml      # scheduled: refresh videos.json, then call deploy.yml
scripts/
  sync-videos.mjs      # reads the channel RSS feed; merges, never overwrites
src/
  pages/               # index, sobre, videos, equipamento, mapa, rotas, contacto
  layouts/             # Base (document shell) and Page (header + container)
  components/          # VideoCard, RideMap, RouteMap, RouteCard, GearItem, …
  content/
    rotas/             # one Markdown file per route (_template.md is not published)
  data/
    videos.json        # generated — do not hand-edit
    locais.json        # map pins: coordinates + the video each one links to
    equipamento.json   # gear list
  lib/
    videos.ts          # the video list every page reads through (Shorts filtered here)
    locais.ts          # map pins grouped by place — shared by the map and its text list
    rotas.ts           # routes by video id, the track reader for the map, the GPX name guard
    gpx.ts             # GPX parser, distance, simplification, SVG projection
    url.ts             # withBase() — the single switch if the site leaves the root
  styles/              # tokens.css (custom properties) + global.css
public/
  gpx/                 # route tracks
  CNAME                # the custom domain — deleting this drops it on the next deploy
```

`docs/` holds the two specifications the build was written against — `brand.md` and
`design-system.md`. `CLAUDE.md` records the decisions that override them.

## Content workflows

**Publishing a route** — write `src/content/rotas/<slug>.md` with frontmatter (title, date,
distance, region, the GPX filename, and the related video id — or a list of ids, if the ride was
published as several videos), then drop the track into `public/gpx/`. The filename becomes the
URL, so name it after the place rather than the episode number. The route page, the routes index, and the map pick it up on the next build — the
track is drawn on `/mapa` as well as on the route's own page, so a linear ride reads as the road
it was rather than as a dot at one end.

**Adding a video** — nothing to do. The scheduled workflow reads the channel's RSS feed and
commits `videos.json` when something new appears.

**Adding a map pin** — add an entry to `locais.json` with coordinates, a label, and the video id
it should link to. Give it the same name as an existing pin and the two share one pin on the map,
listing both rides — that is how a second ride in a town you have already filmed is added. If a
route write-up points at the same video, the pin offers a link to it automatically; there is no
route field to fill in. The build refuses entries with no video id, non-numeric coordinates, or a
shared name across places tens of km apart.

For a ride outside Portugal, add `"country": "Espanha"`. The country shows in the label and is
part of what makes a pin distinct, so two places sharing a name across a border stay two pins.
Leave it out at home — `SITE.paisPredefinido` in `src/components/site.ts` fills it in, and a pin
whose country is the default one shows no country at all.

**Adding gear** — add an entry to `equipamento.json`.

## Local development

Requires Node.js.

```bash
npm install
npm run dev      # local dev server with hot reload
npm run build    # production build to ./dist
npm run preview  # serve the built site locally
```

## Deployment

Every push to `main` triggers the build workflow, which publishes `dist/` to GitHub Pages.
No manual deploy step.

## Channel reference

- **Channel:** <https://www.youtube.com/@SudoRider>
- **Channel ID:** `UCLFnLwTJIcE_dL1N7D5epaA`
- **RSS feed:** `https://www.youtube.com/feeds/videos.xml?channel_id=UCLFnLwTJIcE_dL1N7D5epaA`

## Open decisions

- **DNS for `sudorider.com`** — the domain is decided and `public/CNAME` is in place, but the DNS
  records and the repository's Pages *Custom domain* setting still need configuring before a
  deploy will serve correctly.
- **Route card track sketches** — `src/lib/gpx.ts` can project a GPX track to an inline SVG path
  at build time, but `RouteCard` still renders the meta-only fallback. Connecting it is what makes
  the routes index worth looking at.

Settled since the first draft: contact is a plain `mailto:` link, and the visual direction is
specified in `docs/design-system.md`.

## Licence

- **Code** — [MIT](LICENSE)
- **Content** — text, images, video stills and route data are
  [CC BY-SA 4.0](LICENSE-CONTENT.md)
- **Not licensed** — the SudoRider name, wordmark, logo and visual identity are excluded from the
  content licence and remain the author's. Reuse the writing and the routes; don't reuse the
  identity.
