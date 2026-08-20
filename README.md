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

🚧 **Pre-build.** The channel launched in August 2026; the site is being built alongside it.
Nothing is scaffolded yet — this README is the plan.

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

**Why not the YouTube Data API:** it requires an API key, and any key shipped to a static site is
public. The channel's RSS feed (`/feeds/videos.xml?channel_id=…`) is public, needs no
authentication, and carries everything the listing needs — id, title, publish date, thumbnail.

**Why not Mapbox or Google Maps:** both want an account, a key, and a credit card on file.
Leaflet with OpenStreetMap tiles has none of those requirements.

## Planned structure

```
.github/workflows/
  deploy.yml           # build + publish to GitHub Pages
  sync-videos.yml      # scheduled: refresh src/data/videos.json from the channel RSS feed
src/
  pages/               # index, sobre, videos, equipamento, mapa, rotas, contacto
  layouts/             # shared page shell — nav, footer, meta tags
  components/          # VideoCard, RideMap, RouteCard, …
  content/
    rotas/             # one Markdown file per route
  data/
    videos.json        # generated — do not hand-edit
    locais.json        # map pins: coordinates + the video each one links to
    equipamento.json   # gear list
  styles/
public/
  gpx/                 # route tracks
  img/
```

## Content workflows

**Publishing a route** — write `src/content/rotas/<slug>.md` with frontmatter (title, date,
distance, region, the GPX filename, and the related video id), then drop the track into
`public/gpx/`. The route page, the routes index, and the map pick it up on the next build.

**Adding a video** — nothing to do. The scheduled workflow reads the channel's RSS feed and
commits `videos.json` when something new appears.

**Adding a map pin** — add an entry to `locais.json` with coordinates, a label, and the video id
it should link to.

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

- **Contact form** — GitHub Pages is static and cannot send email. Either a plain `mailto:` link
  (zero setup, exposes the address to scrapers) or a third-party form service such as Formspree
  or Web3Forms (needs an account, free tier is limited). Not yet decided.
- **Custom domain** — currently would publish to `filipes0usa.github.io/sudorider`. A domain like
  `sudorider.pt` would need registering and a `CNAME` file.
- **Visual direction** — undecided beyond *simple and clean*.

## Licence

- **Code** — [MIT](LICENSE)
- **Content** — text, images and video stills are
  [CC BY-SA 4.0](LICENSE-CONTENT.md)
