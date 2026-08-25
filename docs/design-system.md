# SudoRider — UI design system

Layout, spacing, type scale, components and page structure for sudorider.com.

**Scope.** This document owns *structure*: the grid, the scale, the components, the page
layouts, the motion. It does **not** pick colours or typefaces — those are the Brand Guardian's,
and this spec consumes them by semantic token name (`--color-accent`, `--font-display`) so the
two documents compose without either editing the other. The [token contract](#1-token-contract)
is the seam between them.

Nothing here is implemented yet. This is a specification; a frontend pass turns it into
`src/styles/` and `src/components/`.

---

## 0. Decisions taken, up front

The brief asked for judgement. These are the calls, with the reasoning compressed. Everything
below is the detail behind them.

| Question | Decision |
| --- | --- |
| **Above the fold on `/`** | Wordmark, tagline, one sentence of who this is, two buttons, and the **top of the latest video card**. Measured to fit in 700px on a 390px phone. |
| **Live map on `/`?** | **No.** A static, build-time SVG teaser of Portugal with the real pins projected onto it, linking to `/mapa`. The live map is the only JS on the site; it does not belong on the page that has three seconds to load. |
| **Video embeds** | **Nobody gets an eager `<iframe>`, including the homepage.** Every video is a `<details>` facade: poster in the `<summary>`, lazy iframe in the open state. Zero third-party JS until a deliberate click. |
| **Sparse content** | The grid is **not** used below 4 items. 0 items → a written empty panel; 1–3 → full-width stacked feature rows; 4 → a 2×2 grid; 5+ → the auto-fit grid. Launch day shows 2 videos as two large editorial rows, which reads as *deliberate*, not *empty*. |
| **`/rotas` at zero routes** | Ships, linked in the nav, with a real empty state that explains what will appear. It is **omitted from the homepage** entirely until the first route exists. |
| **Shorts vs full videos** | Uniform card footprint everywhere. A Short's poster sits in a centred 9:16 frame inside the standard 16:9 well, which crops away YouTube's baked-in pillarbox bars. Opened, a Short's player switches to 9:16 and the card spans the full grid row. |
| **Mobile nav** | Native `<details>`/`<summary>` disclosure. Not the checkbox hack — see [§3.3](#33-mobile-the-disclosure). |
| **Theme toggle** | **Not at launch.** Follow `prefers-color-scheme`. A `[data-theme]` hook is reserved in the selectors so a toggle can be added later without restyling anything. |
| **Sticky header** | No. Pages are short, the map needs the full viewport, and a sticky header on mobile costs 56px of the only fold that matters. |

---

## 1. Token contract

### 1.1 Supplied by the Brand Guardian

This spec references exactly these names. **`docs/brand.md` shipped in parallel using a `--sr-*`
prefix — see [§13](#13-reconciliation-with-docsbrandmd) for the mapping; the brand spec's values
win.** If a name here does not exist in the brand spec, the layout breaks silently — a mismatch is a bug in one of the two documents, not something to
paper over locally.

| Token | Role | Constraint this spec imposes |
| --- | --- | --- |
| `--color-bg` | Page background | — |
| `--color-surface` | Card / panel / popup background | Distinguishable from `--color-bg` in both themes |
| `--color-surface-2` | Recessed field: media wells, map letterbox, code | — |
| `--color-text` | Body text | ≥ 7:1 on `--color-bg` (AAA target; AA is the floor) |
| `--color-text-muted` | Meta, captions, secondary | **≥ 4.5:1 on both `--color-bg` and `--color-surface`** |
| `--color-border` | Hairlines, dividers, card edges | ≥ 1.6:1 on its background (decorative) |
| `--color-border-strong` | Input borders, interactive edges, empty-state dash | **≥ 3:1** (non-text contrast) |
| `--color-accent` | Links, primary button fill, map pins, route tracks | ≥ 4.5:1 as link text on `--color-bg` **and** on `--color-surface` |
| `--color-accent-hover` | Hover/active accent | Perceptibly different, still ≥ 4.5:1 |
| `--color-accent-contrast` | Text on an accent fill | ≥ 4.5:1 against `--color-accent` |
| `--color-focus` | Focus ring | **≥ 3:1 against both `--color-bg` and `--color-surface`.** May be its own colour; do not assume accent works in both themes |
| `--font-display` | Wordmark, h1–h3, buttons | Must carry `ç ã õ á é í ó ú â ê ô à` — non-negotiable for Portuguese |
| `--font-body` | Body, UI, meta | Same diacritic requirement |
| `--font-mono` | Distances, dates, the `sudo` motif | Optional; falls back to `--font-body` |

Weights used: 400, 500, 600, 700. If the display face ships no 500, map 500 → 400 in the token
layer rather than letting the browser synthesise it.

Two theme-dependent values the brand layer must also set, because shadows read as grime on dark
backgrounds:

```css
/* light */  --shadow-1: 0 1px 2px rgb(0 0 0 / .06), 0 1px 3px rgb(0 0 0 / .04);
             --shadow-2: 0 4px 14px -4px rgb(0 0 0 / .12);
/* dark  */  --shadow-1: none;  --shadow-2: none;   /* separation comes from --color-border */
```

### 1.2 Theme mechanics

```css
:root { color-scheme: light dark; /* light tokens */ }

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* dark overrides */ }
}
:root[data-theme="dark"] { /* dark overrides — same block, reserved for a future toggle */ }
```

Every colour gets its light value on bare `:root`. Dark blocks **only override**; a token whose
sole definition lives inside a media query is a bug. `color-scheme` makes scrollbars, form
controls and the `<details>` marker follow the theme for free.

In `<head>`, both theme-colours:

```html
<meta name="theme-color" content="…" media="(prefers-color-scheme: light)" />
<meta name="theme-color" content="…" media="(prefers-color-scheme: dark)" />
```

---

## 2. Foundations

### 2.1 Spacing — 4px base

Base unit 4px. The ramp doubles to 32px and then steps in 16s, because a scale that keeps
doubling past 32 (→64 →128) has nothing usable between "gap inside a card" and "gap between
sections", which is exactly the range a content site lives in.

```css
--space-1: 0.25rem;  /*  4px  icon-to-text, badge padding            */
--space-2: 0.5rem;   /*  8px  tight stack, meta row gap              */
--space-3: 0.75rem;  /* 12px  card inner padding (mobile)            */
--space-4: 1rem;     /* 16px  default gap, card padding              */
--space-5: 1.5rem;   /* 24px  grid column gap, card padding (desktop)*/
--space-6: 2rem;     /* 32px  grid row gap, block separation         */
--space-7: 3rem;     /* 48px  sub-section separation                 */
--space-8: 4rem;     /* 64px  section padding (mobile floor)         */
--space-9: 6rem;     /* 96px  section padding (desktop ceiling)      */

/* Vertical section rhythm — the only fluid spacing value. */
--space-section: clamp(3rem, 1.6rem + 5.6vw, 6rem);   /* 48px @390 → 96px @1257+ */

/* Paragraph rhythm. In `em` so it tracks the element's own size. */
--space-flow: 1em;
```

Owl selector for vertical rhythm, so components never set their own outer margins:

```css
.flow > * + * { margin-block-start: var(--flow-space, var(--space-flow)); }
```

### 2.2 Type scale — 1.2 mobile → 1.25 desktop

Ratio **1.2 (minor third)** at 390px, opening to **1.25 (major third)** at 1440px, expressed as
`clamp()` so there are no type breakpoints. A minor third on mobile keeps eight steps inside a
small viewport without h2 and h3 colliding; the wider ratio on desktop buys the hero the drama it
needs at 1440.

```css
--fs-100: 0.8125rem;                                   /* 13    badges, attribution   */
--fs-200: 0.875rem;                                    /* 14    meta, captions        */
--fs-300: 1rem;                                        /* 16    UI, nav, buttons      */
--fs-400: clamp(1rem,     0.97rem + 0.15vw, 1.0625rem);/* 16→17 body                  */
--fs-500: clamp(1.125rem, 1.07rem + 0.23vw, 1.25rem);  /* 18→20 lead paragraph        */
--fs-600: clamp(1.25rem,  1.14rem + 0.45vw, 1.5rem);   /* 20→24 h3 / card title       */
--fs-700: clamp(1.5rem,   1.28rem + 0.90vw, 2rem);     /* 24→32 h2 / section head     */
--fs-800: clamp(1.875rem, 1.53rem + 1.40vw, 2.75rem);  /* 30→44 h1 / page header      */
--fs-900: clamp(2.25rem,  1.70rem + 2.25vw, 3.5rem);   /* 36→56 homepage hero only    */
```

Line height, weight, tracking:

```css
--lh-tight: 1.12;   /* --fs-800 / --fs-900            */
--lh-snug:  1.25;   /* --fs-600 / --fs-700, card titles */
--lh-base:  1.5;    /* UI, meta, buttons              */
--lh-prose: 1.7;    /* body copy — see below          */

--fw-regular: 400; --fw-medium: 500; --fw-semibold: 600; --fw-bold: 700;

--tracking-tight: -0.02em;  /* display sizes ≥ --fs-700 */
--tracking-wide:   0.08em;  /* uppercase badges only    */
```

**Portuguese-specific type rules.** These are not decoration; PT runs roughly 20–25% longer than
English and stacks accents above the cap line.

- `--lh-prose: 1.7`, not 1.5. Diacritics (`ã õ ç á`) need the leading, and long-line PT prose
  fatigues faster at tight leading.
- `--measure: 36rem` (576px ≈ 66–68 PT characters at 17px). Prose columns never exceed it.
- `hyphens: auto` on `.prose` with `lang="pt-PT"` on `<html>` — without the correct `lang`,
  no hyphenation dictionary loads and words like *Equipamento* or *aproximadamente* punch out
  of narrow columns.
- `text-wrap: balance` on h1/h2 (short, ≤ 4 lines), `text-wrap: pretty` on paragraphs.
- Never `text-transform: uppercase` on body or nav — it inflates already-long PT labels and
  degrades accent legibility. Uppercase is confined to `.tag` at `--fs-100`.

### 2.3 Radii, borders, elevation

```css
--radius-1: 0.25rem;  /* tags, small controls   */
--radius-2: 0.5rem;   /* cards, buttons, popups */
--radius-3: 0.75rem;  /* media wells, panels    */
--radius-full: 999px; /* pins, pills            */
--border-hair: 1px solid var(--color-border);
```

One elevation step only (`--shadow-1` resting, `--shadow-2` hover). A site this size does not
need an elevation *system*; it needs cards that look attached to the page.

### 2.4 Layout tokens

```css
--width-page:  68rem;   /* 1088px — max content width          */
--width-prose: 36rem;   /*  576px — reading column (= --measure)*/
--width-lead:  30rem;   /*  480px — page-header lead paragraph  */
--gutter: clamp(1rem, 0.5rem + 2.2vw, 2rem);  /* 17px @390 → 32px @1091+ */
--header-h: 3.5rem;     /* 4rem at ≥ 52rem — see §3            */

--z-content: 1;
--z-header: 10;
--z-nav-panel: 1200;    /* MUST clear Leaflet: panes 200–700, controls 800–1000 */
```

`--z-nav-panel: 1200` is load-bearing. Leaflet assigns its own z-indexes up to 1000; an open
mobile menu on `/mapa` with a lower value slides *underneath* the map controls.

### 2.5 Motion tokens

```css
--dur-1: 120ms;   /* colour, border, opacity   */
--dur-2: 200ms;   /* transform, poster zoom    */
--ease-out: cubic-bezier(.2, .6, .3, 1);
```

---

## 3. Layout system

### 3.1 Page shell

```
<body>
  <a class="skip" href="#conteudo">Saltar para o conteúdo</a>
  <header class="site-header">      <!-- wordmark + nav, --header-h tall -->
  <main id="conteudo" tabindex="-1">
  <footer class="site-footer">
```

`<main>` has **no padding and no max-width of its own.** Each section inside it applies
`.container` for itself. This is deliberate: it means `/mapa` can go edge-to-edge simply by *not*
adding the class, and nothing needs the `margin-inline: calc(50% - 50vw)` full-bleed hack, which
produces horizontal overflow whenever a classic scrollbar is present.

```css
.container { width: 100%; max-width: var(--width-page);
             margin-inline: auto; padding-inline: var(--gutter); }
.prose     { max-width: var(--width-prose); }        /* inside .container */
.section   { padding-block: var(--space-section); }
.section + .section { border-block-start: var(--border-hair); }  /* homepage only */

.skip { position: absolute; inset-block-start: -100%; }
.skip:focus { position: static; display: block; padding: var(--space-3) var(--gutter);
              background: var(--color-accent); color: var(--color-accent-contrast); }
```

`#conteudo` carries `tabindex="-1"` so the skip link actually moves focus, not just the scroll
position. Style `main:focus { outline: none }` — the destination should not draw a ring.

### 3.2 Breakpoints

Three, chosen from **where this site's content breaks**, not from device catalogues. Named for
documentation; note that CSS cannot use custom properties inside `@media`, so the raw values are
duplicated in the media queries — keep the comment next to each one.

| Token | Value | Why exactly here |
| --- | --- | --- |
| *(base)* | 390px | Design floor. iPhone 14/15/16 logical width, and the narrowest viewport worth supporting in 2026. Base styles are the mobile styles — no `min-width: 0` query exists. |
| `--bp-sm` | **36rem / 576px** | The gear grid gets a second column. Content width here is 576 − 34 = 542px; two 14rem (224px) cards plus a 24px gap need 472px. First point where two cards are not cramped. |
| `--bp-md` | **52rem / 832px** | **The nav breakpoint.** The seven Portuguese labels plus wordmark measure ≈ 700px at 15px (see §3.3). 832px gives ~130px of slack for a wider display face, letter-spacing, and users at 110–125% font size. Also where the header grows to 4rem and prose gains a sidebar on route pages. |
| `--bp-lg` | **68rem / 1088px** | `--width-page` is reached; the container stops growing and only the gutter changes. Video grid settles at three columns. Above this nothing new happens — 1440px looks identical to 1088px plus margin, which is correct for a text-and-video site. |

A fourth breakpoint was considered for 1440px and rejected: widening the measure or adding a
fourth column would make the site *worse* on the largest screens.

At 200% browser zoom on a 1280px window the effective width is 640px — below `--bp-md`, so the
mobile nav engages. That is the intended behaviour and satisfies WCAG 1.4.4 (Resize Text) and
1.4.10 (Reflow) without a separate code path.

### 3.3 The card grid

```css
.cards {
  --card-min: 18rem;
  display: grid;
  gap: var(--space-6) var(--space-5);          /* row 32 / column 24 */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--card-min)), 1fr));
}
.cards--videos { --card-min: 18rem; }   /* 3 cols at 1088 (346px each) */
.cards--rotas  { --card-min: 20rem; }   /* 3 cols at 1088 (346px each) */
.cards--gear   { --card-min: 14rem; }   /* 2 cols at 576, 4 at 1088    */
```

`min(100%, …)` is required — without it, a `--card-min` wider than the viewport forces horizontal
overflow at 390px.

**Count-aware layout.** The grid is only used when there is enough content to fill it. Set
`data-count={Math.min(items.length, 5)}` on the grid container and branch:

| Count | Layout | Rationale |
| --- | --- | --- |
| 0 | `.empty` panel (§5.8) | A grid with nothing in it is the worst possible answer |
| 1–3 | `.stack` — full-width rows, media left / text right at ≥ `--bp-md` | Large, editorial, confident. **This is launch day.** |
| 4 | `repeat(2, 1fr)` at ≥ `--bp-md` | A 2×2 block; avoids the sad orphan card of a 3-col grid |
| 5+ | `.cards` auto-fit as above | Enough mass for a real grid |

```css
.stack { display: grid; gap: var(--space-7); }
@media (min-width: 52rem) {                     /* --bp-md */
  .stack > * { display: grid; grid-template-columns: minmax(0, 22rem) minmax(0, 1fr);
               gap: var(--space-5); align-items: start; }
  .cards[data-count="4"] { grid-template-columns: repeat(2, 1fr); }
}
```

This single rule is the answer to "the grid looks desolate with 2 items". Two videos rendered as
two 352px-wide posters with the title, date and opening paragraph beside them fills 1088px
honestly. The same two videos in a 3-column grid would leave a third of every row blank.

---

## 4. Navigation

Seven items, all seven present in both layouts — one list in the DOM, restyled. A nav that
differs between viewports is a maintenance trap and it teaches users two different mental models.

**Recommended order** (a one-line change from the README's IA order, which is fine too):

```
Início · Vídeos · Mapa · Rotas · Equipamento · Sobre · Contacto
```

Content people came for first, identity and contact last. Mapa sits second because it is the most
distinctive thing here, and Rotas sits beside it because they are conceptual siblings. *If Rotas
is still empty three months in, move it after Equipamento — a top-billed empty section is worse
than a buried one.*

### 4.1 Label budget

| Label | Chars | ≈ width @ 15px |
| --- | --- | --- |
| Início | 6 | 44px |
| Vídeos | 6 | 45px |
| Mapa | 4 | 34px |
| Rotas | 5 | 38px |
| **Equipamento** | **11** | **88px** |
| Sobre | 5 | 38px |
| Contacto | 8 | 61px |
| | | **≈ 348px** + 6 gaps × 28px = **516px** |

Plus wordmark (~95px) and gutters (2 × 32px) → **≈ 675px**. It fits from about 700px; the
breakpoint is set at 832px so it never becomes a squeeze.

Every nav link carries `white-space: nowrap`. *Equipamento* wrapping to two lines is the single
most likely visual failure in this header, and `nowrap` plus the 130px of slack prevents it.

### 4.2 Desktop (≥ 52rem)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  SudoRider          Início  Vídeos  Mapa  Rotas  Equipamento  Sobre  Contacto │
└──────────────────────────────────────────────────────────────────────────┘
   ↑ wordmark, links home            ↑ nav, right-aligned, gap 1.75rem
   1px bottom hairline, --header-h: 4rem
```

- `.site-header > .container { display: flex; align-items: center; justify-content: space-between; }`
- Link: `--fs-300`, `--fw-medium`, `--color-text`, `padding-block: var(--space-2)`.
- Hover: `--color-accent`. No underline on hover — the current-page marker is the underline, and
  reusing it for hover makes the two indistinguishable.
- **Current page**: `aria-current="page"` → `--color-accent` + a 2px accent underline drawn with
  `box-shadow: inset 0 -2px 0 var(--color-accent)` (no layout shift). Colour is not the only
  signal: the underline carries it for colour-blind users.
- Focus: the global ring (§9).

### 4.3 Mobile: the disclosure (< 52rem)

```
┌────────────────────────────────────┐        ┌────────────────────────────────────┐
│  SudoRider              Menu  ▾    │        │  SudoRider              Menu  ▴    │
└────────────────────────────────────┘        ├────────────────────────────────────┤
                                              │  Início                            │
                                              │  Vídeos                            │
                                              │  Mapa                              │
                                              │  Rotas                             │
                                              │  Equipamento                       │
                                              │  Sobre                             │
                                              │  Contacto                          │
                                              └────────────────────────────────────┘
```

**`<details>`, not the checkbox hack.** The argument:

1. `<details>`/`<summary>` is a *native disclosure widget*. The browser supplies the expanded /
   collapsed state to assistive tech itself. The checkbox hack cannot — `aria-expanded` on a
   `<label>` is static markup, so with no JS it is either permanently wrong or absent, and a
   `<label>` is not a button to begin with.
2. Keyboard operation (Enter and Space, correct focus order) is free. The checkbox hack requires
   the input be focusable-but-invisible, which reliably regresses into `display: none` at some
   point and silently drops keyboard access.
3. Zero extra elements. One `<summary>`, one panel.

The trade-offs, accepted: it cannot be closed by clicking outside or by `Esc` without JS, and the
open height cannot be animated. Neither matters — every menu item is a link, and following a link
is a full page load, which resets the disclosure. (This is a further reason not to adopt Astro's
`<ViewTransitions>`: it would preserve the open menu across navigations *and* ship a router.)

```html
<nav aria-label="Principal">
  <details class="nav">
    <summary class="nav__toggle">Menu<span class="nav__chevron" aria-hidden="true"></span></summary>
    <ul class="nav__list"> … seven <li><a> … </ul>
  </details>
</nav>
```

- **Do not** add `role="button"`, `aria-expanded` or `aria-controls` to the `<summary>`. They
  fight the native semantics. Do not add `aria-label="Menu"` either — the visible word is the name.
- `summary { list-style: none; } summary::-webkit-details-marker { display: none; }` then draw
  the chevron: an 8px square with 2px right+bottom borders rotated 45°, flipped 180° under
  `details[open]`.
- Toggle hit area: `min-height: 2.75rem`, `padding-inline: var(--space-3)`, extending to the
  header's right gutter edge.
- Panel: `position: absolute; inset-inline: 0; top: 100%; z-index: var(--z-nav-panel);`
  `background: var(--color-surface); border-block: var(--border-hair); box-shadow: var(--shadow-2);`
  with the header set `position: relative`. Absolute, not static, so the header does not grow and
  shove the page down — on `/mapa` a pushing panel would resize the map.
- Items: full-width, `min-height: 2.75rem` (44px target), `padding: var(--space-3) var(--gutter)`,
  `--fs-400`, hairline between items, current page gets a 3px inset accent bar on the leading edge.

At ≥ 52rem the `<details>` is neutralised rather than duplicated:

```css
@media (min-width: 52rem) {           /* --bp-md */
  .nav { display: contents; }         /* details/summary stop generating boxes */
  .nav__toggle { display: none; }
  .nav__list { display: flex; gap: 1.75rem; position: static; box-shadow: none; border: 0;
               background: none; }
}
```

`display: contents` on the `<details>` is the trick that lets one element serve both layouts.
Verify once with a screen reader that the collapsed-state semantics do not leak at desktop width;
if any AT reports it as collapsed, fall back to `.nav { display: block }` with the panel forced
visible via `.nav__list { display: flex !important }`.

---

## 5. Components

### 5.1 Video card

The most-used and most constrained component. Three jobs: look right at 2 items and at 60, handle
16:9 and 9:16 in the same grid, and cost nothing until clicked.

#### Structure

```html
<article class="v-card" data-format="wide">        <!-- or data-format="short" -->
  <details class="v-card__disclosure">
    <summary class="v-card__summary">
      <span class="v-card__well">
        <img class="v-card__poster" src={thumbnail} width="480" height="360"
             alt="" loading="lazy" decoding="async" />
        <span class="v-card__play" aria-hidden="true"></span>
        <span class="tag v-card__badge">Short</span>   <!-- short only -->
      </span>
      <h3 class="v-card__title">{cleanTitle(title)}</h3>
    </summary>
    <div class="v-card__player">
      <iframe src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
              title={`Vídeo: ${cleanTitle(title)}`} loading="lazy" allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin"
              allow="accelerometer; encrypted-media; picture-in-picture; web-share"></iframe>
    </div>
  </details>
  <p class="v-card__meta">
    <time datetime={published}>16 ago 2026</time>
    <a href={url}>Ver no YouTube</a>
  </p>
</article>
```

Notes on the markup, each of which is load-bearing:

- `alt=""` on the poster. The `<summary>` already contains the title; a duplicated alt makes
  screen readers announce the video name twice. The image is decorative *in this context*.
- `<h3>` inside `<summary>` is valid — `summary` accepts heading content as its first-child
  arrangement, and it makes the whole poster+title block one toggle with a ~200×250px hit area.
- `width`/`height` on the img plus `aspect-ratio` in CSS. Thumbnails come from `i.ytimg.com`;
  without intrinsic dimensions, 20 remote images produce 20 layout shifts.
- The meta row sits **outside** `<details>` so date and the YouTube link stay reachable whether
  the player is open or closed.
- **No `autoplay=1`.** The `<details>` toggle is a real user gesture so it would probably be
  permitted, which is precisely the problem: audio starting unbidden is rude, and on a motovlog
  it starts with engine noise. One extra click on the YouTube play button is the better trade.

#### The zero-JS facade, and its one risk

A closed `<details>` renders its contents at zero size, so `loading="lazy"` on the iframe does not
fetch: no YouTube JS, no cookies, no ~600KB player until the user opens a card. Opening makes the
subtree visible and the iframe loads then.

**The risk:** this relies on lazy-loading deferral for hidden subtrees, which is browser behaviour
rather than a guarantee in the spec. Verify once, in Chromium / Firefox / WebKit, that a `/videos`
page with several closed cards issues zero requests to `youtube-nocookie.com` on load. If any
engine loads them eagerly, the bounded fallback is: render `<iframe>` markup for only the newest
12 videos and give older cards a plain link to YouTube. With 2 videos this is theoretical; re-check
when the archive passes ~24.

#### CSS

```css
.v-card { display: flex; flex-direction: column; gap: var(--space-3);
          background: var(--color-surface); border: var(--border-hair);
          border-radius: var(--radius-3); padding: var(--space-3);
          box-shadow: var(--shadow-1); }

.v-card__summary { list-style: none; cursor: pointer; display: grid;
                   gap: var(--space-3); }
.v-card__summary::-webkit-details-marker { display: none; }

.v-card__well { position: relative; display: block; overflow: hidden;
                aspect-ratio: 16 / 9; border-radius: var(--radius-2);
                background: var(--color-surface-2); }
.v-card__poster { width: 100%; height: 100%; object-fit: cover; display: block;
                  transition: transform var(--dur-2) var(--ease-out); }

.v-card__title { font: var(--fw-semibold) var(--fs-600)/var(--lh-snug) var(--font-display);
                 text-wrap: pretty;
                 display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
                 overflow: hidden; }

.v-card__meta { display: flex; flex-wrap: wrap; gap: var(--space-3);
                font-size: var(--fs-200); color: var(--color-text-muted); }
```

#### Handling Shorts

YouTube's `hqdefault.jpg` is **always 480×360**, whatever the source aspect. A Short is delivered
pillarboxed: its real frame is the central `360 × 9/16 = 202.5px` of that 480px width, with black
bars either side. Left alone in a 16:9 well, a Short card shows a small image marooned in black —
the "broken grid" the brief is worried about.

Fix: keep the well at 16:9 so **every card in the grid keeps an identical footprint**, and inside
it place a centred 9:16 frame that crops the bars away:

```css
.v-card[data-format="short"] .v-card__well { display: grid; place-items: center; }
.v-card[data-format="short"] .v-card__poster {
  aspect-ratio: 9 / 16;  height: 100%;  width: auto;  object-fit: cover;
  border-radius: var(--radius-1);
  box-shadow: 0 0 0 1px var(--color-border);   /* a phone-shaped frame */
}
```

The crop is exact, not approximate: `object-fit: cover` on a 4:3 source into a 9:16 box keeps
`0.5625 / 1.333 = 42.19%` of the source width — the same 202.5px the Short actually occupies. And
because that region is *downscaled* into the card (202×360 source → ~110×195 displayed), it stays
sharp rather than being upscaled.

```
 wide (16:9)                         short (9:16)
┌──────────────────────┐            ┌──────────┬────┬──────────┐
│                      │            │ surface-2│ 9  │ surface-2│
│      poster          │            │          │ :  │          │
│                      │            │          │16  │  [Short] │
└──────────────────────┘            └──────────┴────┴──────────┘
   identical card footprint — only the media inside differs
```

Opened, a Short plays in its native shape and the card takes the whole row:

```css
.v-card__player { display: none; }
.v-card__disclosure[open] .v-card__well { display: none; }   /* player replaces poster */
.v-card__disclosure[open] .v-card__player { display: block; }
.v-card__player iframe { width: 100%; aspect-ratio: 16 / 9; border: 0;
                         border-radius: var(--radius-2); display: block; }
.v-card[data-format="short"] .v-card__player iframe {
  aspect-ratio: 9 / 16; max-width: 20rem; margin-inline: auto; }

/* An open card claims the full grid row so the player is never letterbox-thin. */
.cards .v-card:has(.v-card__disclosure[open]) { grid-column: 1 / -1; }
```

`:has()` is the whole interaction — no JS, and it means opening a video on a 3-column grid gives
it a 1088px-wide player instead of a 346px one.

#### The `data-format` gap — needs a decision from the frontend/DevOps pass

**`videos.json` does not say whether a video is a Short.** `scripts/sync-videos.mjs` writes
`id, title, published, url, thumbnail, description`; the RSS feed carries no aspect ratio, and the
thumbnail is 480×360 for everything. There is no way to derive `data-format` from current data.

A title heuristic is not sufficient — the existing entry `"Motovlog01 Short #cfmoto450mt #moto…"`
is a Short whose title contains no `#shorts` tag. Ranked options:

1. **Best — resolve at sync time.** In `sync-videos.mjs`, request
   `https://www.youtube.com/shorts/{id}` and record `format: "short"` when it returns 200 rather
   than redirecting to `/watch`. One HEAD per *new* video, in a script that already does network
   I/O, and it never needs maintaining. (Owner: DevOps / frontend — this spec does not touch that
   file.)
2. **Adequate — a small override map.** `src/data/video-formats.json` = `{ "<id>": "short" }`,
   hand-maintained, merged at build. Separate from the generated file, so the sync cannot
   clobber it.
3. **Fallback — default to `wide`.** A mis-tagged Short shows pillarbars; a mis-tagged wide video
   shows a centre-crop. Both are ugly-but-not-broken, which is the correct failure mode.

Until (1) or (2) exists, `data-format="wide"` for everything is the safe default.

#### Title and description cleanup (presentation layer, not the data file)

Synced titles carry hashtag tails. Displaying them raw looks like spam:

- `cleanTitle()` — strip a **trailing run of two or more** `#tag` tokens, collapse whitespace.
  `"Motovlog01 Short #cfmoto450mt #moto #motorcycle …"` → `"Motovlog01 Short"`. The threshold of
  two preserves meaningful single tags such as `"… | Motovlog #1"`.
- `leadParagraph()` — split `description` on blank lines, take the first block, drop lines
  starting with an emoji-plus-label credit (`🎵 Música:`) and any hashtag-only line. Clamp to 3
  lines in stacked layouts; omit entirely in grid cards.
- Dates: `<time datetime={ISO}>` always. Cards use short PT — `16 ago 2026`; page headers and
  route pages use full PT — `16 de agosto de 2026` (`toLocaleDateString('pt-PT', …)`; PT month
  names are lowercase).

#### States

| State | Treatment |
| --- | --- |
| Rest | `--shadow-1`, `--color-border` |
| Hover / focus-within | `border-color: --color-border-strong`, `--shadow-2`, poster `transform: scale(1.03)` |
| Focus (keyboard) | Ring on the `<summary>` (§9), not on the article |
| Open | Poster replaced by player; card spans the grid row |
| Poster failed to load | Well shows `--color-surface-2`; the title carries the meaning. Do not add a broken-image alt |

### 5.2 Route card

Distance and region are the reason someone clicks, so they outrank the prose.

```html
<article class="r-card">
  <a class="r-card__link" href={`/rotas/${slug}`}>
    <span class="r-card__sketch">…inline SVG track…</span>
    <h3>{title}</h3>
  </a>
  <p class="r-card__meta">
    <span class="tag">{regiao}</span>
    <span class="r-card__num">{distancia} km</span>
    <time datetime={data}>set 2026</time>
  </p>
  <p class="r-card__excerpt">{excerpt}</p>
</article>
```

- **Stretched link**: `.r-card { position: relative }` and
  `.r-card__link::after { content:""; position:absolute; inset:0 }` — the whole card is clickable
  while only the title is in the accessibility tree. Set `.r-card__meta, .r-card__excerpt
  { position: relative }` so text stays selectable above the overlay.
- **The track sketch** — recommended, and the thing that makes this card worth looking at. Render
  the GPX as an inline SVG polyline **at build time**; no map tiles, no JS, no network:
  parse `trkpt` lat/lon → equirectangular project (`x = lon·cos(lat_mid)`, `y = −lat`) → fit to a
  3:2 viewBox with 8% padding → decimate to ≈ 200 points (Ramer–Douglas–Peucker or every *n*th
  point). Draw with `fill: none; stroke: var(--color-accent); stroke-width: 2;
  stroke-linecap: round; vector-effect: non-scaling-stroke` on a `--color-surface-2` field. Every
  route then has a distinctive shape, in theme colours, at ~2KB.
  **Status:** built. `trackToSvgPath()` in `src/lib/gpx.ts` does exactly this — equirectangular
  projection at the track's mid-latitude, uniform fit to the viewBox, Ramer–Douglas–Peucker to
  roughly a pixel of the finished sketch, then a hard cap. It is not yet wired into `RouteCard`,
  which still renders the fallback below.
- Fallback when there is no GPX: drop the sketch entirely and promote the meta row to `--fs-500`.
  Do **not** substitute a grey placeholder box.
- `.r-card__num` uses `--font-mono` with `font-variant-numeric: tabular-nums` so distances align
  down a column.

### 5.3 Gear item

Gear is a reference list, not a shop. No prices, no buy links, no star ratings — the value is
"what he actually uses and why".

```html
<h2 id="cameras">Câmaras</h2>
<div class="cards cards--gear">
  <article class="g-item">
    <h3 class="g-item__name">Insta360 X4</h3>
    <p class="g-item__why">Porque …</p>          <!-- 1–2 sentences, ~140 chars -->
  </article>
</div>
```

- **Category is a heading, not a badge.** Items are grouped under `<h2>` per category
  (Câmaras · Suportes · Capacete · Comunicação · Bagagem), which gives screen-reader users a
  navigable outline and removes the need for filter UI — filtering would need JS for a list this
  short.
- Card: `--color-surface`, hairline, `--radius-2`, `padding: var(--space-4)`, name at `--fs-400`
  `--fw-semibold`, note at `--fs-200` `--color-text-muted` `--lh-prose`.
- Cards in a category stretch to equal height (grid default). Keep notes within ~2 lines of each
  other or the ragged bottom edges show.
- **Photos are optional and all-or-nothing per category.** If images exist, add a 4:3 well above
  the name; if one item in a category lacks a photo, ship that category text-only. A grid with
  three photos and one grey box looks unfinished.
- No link is required. If one exists (a review video, a manufacturer page), it goes on the name
  and gets an external-link cue in text, not an icon.

### 5.4 Map popup (Leaflet)

A pin is a **place**, and a place can carry more than one ride — so the popup has two forms. One
ride, 240px wide:

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  16:9 thumbnail, 240×135, --radius-2 top corners
│ │      thumbnail         │ │
│ └────────────────────────┘ │
│  Serra da Arrábida         │  place name — --fs-300 / --fw-semibold / --font-display
│  16 ago 2026               │  --fs-100 / muted
│  Um Ano de Mota, Zero…     │  video title, clamped to 2 lines, --fs-200
│  Ver o vídeo →  Ver a rota →│ actions row — --color-accent, --fw-medium
└────────────────────────────┘
```

Two or more rides at the same place — compact rows, so the popup stays a popup:

```
┌────────────────────────────┐
│  Évora            2 voltas │  header — place + count, --fs-100 / muted
├────────────────────────────┤
│ ┌────┐ 23 ago 2026         │  72px thumbnail | text, --fs-100 title
│ │thmb│ Volta pelos arredo…  │
│ └────┘ Ver o vídeo → Ver a rota →│
├────────────────────────────┤
│ ┌────┐ 16 ago 2026         │
│ │thmb│ Um Ano de Mota, Ze…  │
│ └────┘ Ver o vídeo →        │  no route write-up for this one
└────────────────────────────┘
```

Newest first. A ride whose video has not reached `videos.json` yet sorts to the top and renders
with **no thumbnail at all** — the id gives a working watch URL, but the thumbnail would 404, and
a broken image in a compact row reads worse than none.

**The popup is a container with a row of links, not a single `<a>`.** An earlier version of this
spec made the whole popup one anchor to the video. It cannot stay that way now the popup offers
the route write-up as well: an anchor inside an anchor is not valid HTML, and a stretched link
over the card would swallow the second action. The thumbnail still carries `alt=""` — the title
sits next to it.

Where a popup lists several rides, the action links repeat, and `Ver o vídeo` × 3 in a screen
reader's link list is useless. Append the video or route title in a `.visually-hidden` span, and
keep the visible words as the prefix so the visible label remains a subsequence of the accessible
name (2.5.3).

Cap the list at `max-block-size: 16rem` with `overflow-y: auto` and `overscroll-behavior:
contain`. A popup that grows past the top of the map takes its close button out of reach. Do not
add `tabindex` to that scroll container: every row contains links, so it is already reachable, and
a `tabindex="0"` would only add a tab stop with no accessible name.

```css
.leaflet-popup-content-wrapper { background: var(--color-surface); color: var(--color-text);
  border: var(--border-hair); border-radius: var(--radius-2); box-shadow: var(--shadow-2);
  padding: 0; overflow: hidden; }
.leaflet-popup-content { margin: 0; font: var(--fs-200)/var(--lh-base) var(--font-body); }
.leaflet-popup-tip { background: var(--color-surface); border: var(--border-hair); }
.leaflet-container { font-family: var(--font-body); background: var(--color-surface-2); }
.leaflet-popup-close-button { width: 2.75rem; height: 2.75rem; color: var(--color-text-muted); }
```

Set the width via the popup **options** (`maxWidth: 260, minWidth: 240`), not CSS — Leaflet writes
an inline width onto `.leaflet-popup-content` and a CSS rule would need `!important` to win.

**Pins.** No icon library: a `divIcon` containing `<span class="pin"></span>`.

```css
.pin { display: block; width: 1.125rem; height: 1.125rem; border-radius: var(--radius-full);
       background: var(--color-accent); border: 2px solid var(--color-bg);
       box-shadow: 0 0 0 1px var(--color-border-strong); }
.pin::after { content: ""; position: absolute; inset: 50% auto auto 50%;
              width: 2.75rem; height: 2.75rem; transform: translate(-50%, -50%); }  /* 44px touch target */
.leaflet-marker-icon:focus-visible .pin { outline: 2px solid var(--color-focus); outline-offset: 3px; }
```

Give every marker an accessible name — `Local: ${nome}`, plus the ride count when it carries more
than one — and keep Leaflet's default `keyboard: true` so pins are tabbable. Active pin:
`scale(1.15)`, `--color-accent-hover` (guarded by reduced-motion).

A pin carrying several rides shows a small count badge. Its colours must be **literal**, like the
pin's own ink stroke: the badge sits in the marker pane, which the dark-mode tile filter never
touches, so a semantic surface token would invert underneath it and leave ink on ink.

**Focus moves cost more than one line.** A `focus()` on a popup that Leaflet is still opening is a
silent no-op, for longer when animations are off, so it has to retry across frames. And whether
focus was inside must be recorded when it lands, not read at `popupclose` — by then Leaflet may
already have detached the container. Verify any change to this in a browser, in **both** motion
modes: the two paths fail in opposite directions.

**Keyboard behaviour has to be implemented, not assumed.** Leaflet binds its document `keydown`
listener on the container's `focus` event and unbinds it on `blur`, and neither event bubbles — so
by the time a user has tabbed to a pin, Escape no longer closes anything. Keep one `keydown`
listener on the map canvas instead. Leaflet also never moves focus, and the popup pane comes after
the marker pane in the DOM, so an opened popup must take focus itself (`role="dialog"`,
`tabindex="-1"`, labelled from the marker) and hand it back to the pin on close. Without that,
tabbing out of a fresh popup skips everything it just revealed and lands on the next pin.

**Dark theme tiles** without a second tile host:

```css
.leaflet-tile-pane { filter: var(--map-tiles); }
:root { --map-tiles: none; }
/* dark */ --map-tiles: invert(1) hue-rotate(180deg) brightness(.92) contrast(.9) saturate(.8);
```

The filter applies to the tile pane only, so attribution, controls and pins keep their real
colours. OSM attribution is required and must remain legible in both themes — style
`.leaflet-control-attribution` with `--color-surface` at 90% opacity and `--fs-100`.

**Panning limits: there are none, deliberately.** `minZoom: 2` reaches a world view, and there is
no `maxBounds` — do not add one. A box around the pins makes the map claim there is nothing past
the places already filmed; a box around the *world* is no better, because seeing the whole world
means the world is smaller than the viewport, which is exactly when Leaflet's `_panInsideMaxBounds`
recentres on `moveend`. `maxBoundsViscosity` does not help: it caps how far a drag travels, never
the spring-back. Panning can therefore run past the edge of the map, which `noWrap: true` on the
tile layer keeps as grey rather than a repeated world. The *opening* view is still `fitBounds` over
the pins and tracks — the world is where you may go, not where you land.

**Never set a track's colour through Leaflet's `color` option.** It is written out as a `stroke`
presentation attribute, freezing whatever the tokens said at load, so switching the OS to dark
afterwards leaves a light casing over inverted tiles. Give the polyline a `className` and set
`stroke` in CSS — a CSS property beats a presentation attribute. The tile pane's inversion filter
does not reach the overlay pane, which is why tracks must follow the theme themselves. Draw every
casing first and every ink second, not casing-then-ink per segment: interleaved, a later casing
paints over an earlier ink and cuts a gap through it wherever two routes cross.

**Overlap.** Rides sharing a place name *and country* are merged into one pin
(`src/lib/locais.ts`), which is
what stops two videos filmed in the same town from stacking one marker on top of another. That
leaves the case of *differently named* places within a few km — "Évora" and "Sé de Évora" — which
still overlap at national zoom and are not worth a clustering plugin for. Mitigate those in the
data: nudge coincident coordinates by ~0.002°, and keep `autoPanPadding: [24, 24]` so popups near
an edge pan into view.

### 5.5 Page header

Every page except `/` and `/mapa`.

```
┌────────────────────────────────────────────┐
│ Vídeos                                     │  h1, --fs-800, --lh-tight, tracking-tight
│ Todos os vídeos do canal, do mais recente  │  lead, --fs-500, muted, max --width-lead
│ para o mais antigo.                        │
│ 2 vídeos                                   │  optional count, --fs-200, muted, mono numerals
├────────────────────────────────────────────┤  1px hairline
```

`padding-block-start: var(--space-7)`, `padding-block-end: var(--space-5)`, then the hairline.
The count line is genuinely useful while the archive is small — it frames "2 vídeos" as a fact
rather than letting the page look truncated.

### 5.6 Footer

```
┌──────────────────────────────────────────────────────────────────────┐
│  SudoRider                    Navegação          Segue               │
│  trocar os ecrãs por um       Início   Rotas     YouTube             │
│  capacete                     Vídeos   Equip.    Instagram           │
│                               Mapa     Sobre     info@sudorider.com  │
│                                        Contacto                      │
├──────────────────────────────────────────────────────────────────────┤
│  © 2026 SudoRider · Código MIT · Conteúdo CC BY-SA 4.0               │
└──────────────────────────────────────────────────────────────────────┘
```

- Three columns at ≥ `--bp-md` (`grid-template-columns: 1.5fr 1fr 1fr`), stacked at mobile with
  the nav mirror in two columns.
- `<nav aria-label="Rodapé">` around the mirror. Same seven links, listed alphabetically-by-column
  as drawn above.
- The licence line is not boilerplate — this repo is deliberately dual-licensed (MIT code,
  CC BY-SA 4.0 content) and the site is the public face of that. Both link out.
- Social icons: hand-authored inline SVG, 24×24 viewBox, `stroke-width: 1.5`, `fill: currentColor`
  or `stroke: currentColor`, `aria-hidden="true"`, always beside a visible text label. No icon
  font, no sprite sheet, no library.
- `border-block-start: var(--border-hair)`, `padding-block: var(--space-8) var(--space-5)`,
  `background: var(--color-surface)` for a soft close.

### 5.7 Buttons, tags, section headers

```css
.btn { display: inline-flex; align-items: center; justify-content: center;
       min-height: 2.75rem; padding: var(--space-3) var(--space-5);
       border-radius: var(--radius-2); font: var(--fw-medium) var(--fs-300) var(--font-display);
       white-space: nowrap; text-decoration: none; border: 1px solid transparent;
       transition: background-color var(--dur-1) var(--ease-out),
                   border-color var(--dur-1) var(--ease-out); }
.btn--primary { background: var(--color-accent); color: var(--color-accent-contrast); }
.btn--primary:hover { background: var(--color-accent-hover); }
.btn--ghost { border-color: var(--color-border-strong); color: var(--color-text); }
.btn--ghost:hover { border-color: var(--color-accent); color: var(--color-accent); }

.tag { display: inline-block; padding: 0.125rem var(--space-2); border-radius: var(--radius-full);
       border: var(--border-hair); font-size: var(--fs-100); font-weight: var(--fw-medium);
       letter-spacing: var(--tracking-wide); text-transform: uppercase;
       color: var(--color-text-muted); }
```

`white-space: nowrap` on `.btn` matters here: *"Ver o mapa das voltas"* is 21 characters and will
wrap inside a fixed-width button if allowed.

**Section header** (homepage sections): `<h2>` at `--fs-700` on the left, a *"Ver todos →"* link
at `--fs-300` `--color-accent` on the right, hairline underneath, `margin-block-end: var(--space-5)`.
Below `--bp-sm` the link drops beneath the heading, left-aligned. The arrow is the character `→`,
inside the link text.

### 5.8 Empty state

```css
.empty { max-width: var(--width-prose); margin-inline: auto; text-align: center;
         padding: var(--space-8) var(--space-5);
         border: 1px dashed var(--color-border-strong); border-radius: var(--radius-3); }
```

Heading `--fs-600`, body `--fs-400` muted with `--lh-prose`, one `.btn--ghost` action. Dashed
border, never a spinner or a grey skeleton: this is a *finished* state, not a loading one.

Copy (European Portuguese, first person, matching the channel's voice):

| Page | Heading | Body | Action |
| --- | --- | --- | --- |
| `/rotas`, 0 routes | **Ainda não há rotas por aqui.** | As rotas vão aparecer à medida que as for escrevendo — com o traçado, a distância e as notas do caminho. Entretanto, o mapa já mostra por onde andei. | Ver o mapa |
| `/videos`, 0 videos | **Ainda não há vídeos publicados.** | O canal está mesmo a começar. O próximo vídeo aparece aqui assim que sair. | Ir ao canal |
| `/mapa`, < 3 pins | *(inline note under the map, not a panel)* O mapa está a começar: por agora são {n} locais. Vai crescendo a cada volta. | — | — |

---

## 6. Page layouts

### 6.1 `/` — Início

**The three-second job.** Someone arriving from a YouTube description has to learn *what this is*,
*who it is*, and *that there is something to watch* before they decide to scroll. So the fold
carries identity plus the latest video, and nothing else competes.

#### Mobile, 390 × 844 (≈ 700px visible after browser chrome)

```
 0   ┌────────────────────────────────────┐
     │  SudoRider                Menu ▾   │  56  header
 56  ├────────────────────────────────────┤
     │                                    │  32  padding
 88  │  SudoRider                         │  41  h1  --fs-900 (36px)
     │  trocar os ecrãs por um capacete   │  24  --fs-500, accent
     │                                    │
     │  Sou o Filipe. Ando numa CFMOTO    │  78  --fs-400, 3 lines
     │  450 MT — a Dora — por Portugal e  │
     │  por onde a estrada levar.         │
     │                                    │
     │  ┌──────────────┐ ┌──────────────┐ │  44  buttons
     │  │ Ver os vídeos│ │ Ver o mapa   │ │
     │  └──────────────┘ └──────────────┘ │
356  ├────────────────────────────────────┤
     │  ÚLTIMO VÍDEO                      │  20  eyebrow --fs-100
     │  ┌──────────────────────────────┐  │
     │  │                              │  │ 201  16:9 poster, 358 wide
     │  │        poster + ▶            │  │
     │  └──────────────────────────────┘  │
     │  Um Ano de Mota, Zero Vídeos…      │  48  title, 2 lines
605  │  16 ago 2026                       │  20
 ─ ─ ─ ─ ─ ─ ─ ─ fold ≈ 700 ─ ─ ─ ─ ─ ─ ─ ─
     │  [ mapa teaser ]                   │
     │  [ mais vídeos ]                   │
     │  [ sobre ]  [ equipamento ]        │
     └────────────────────────────────────┘
```

The entire latest-video card lands at ~605px — inside the fold with 95px to spare. **This is the
budget constraint on the hero: header + hero block ≤ 380px.** If the intro paragraph grows to
four lines or a third button appears, the poster falls below the fold and the page stops working.

#### Desktop, 1440 × 900

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  SudoRider          Início Vídeos Mapa Rotas Equipamento Sobre Contacto      │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   SudoRider                          ┌────────────────────────────────────┐  │
│   trocar os ecrãs por um capacete    │                                    │  │
│                                      │       poster + ▶                   │  │
│   Sou o Filipe. Ando numa CFMOTO     │                                    │  │
│   450 MT — a Dora — por Portugal     └────────────────────────────────────┘  │
│   e por onde a estrada levar.         ÚLTIMO VÍDEO · 16 ago 2026             │
│                                       Um Ano de Mota, Zero Vídeos…           │
│   [Ver os vídeos]  [Ver o mapa]                                              │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  Por onde andei                                              Ver o mapa →    │
│      ┌──────┐                                                                │
│      │  ▓▓  │   Cada pino é um sítio onde filmei. O mapa liga cada sítio    │
│      │ ▓▓▓  │   aos vídeos gravados ali.                                     │
│      │ ▓▓▓  │                                                                │
│      │  ▓▓  │   [ Abrir o mapa ]                                             │
│      └──────┘                                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

Hero grid at ≥ `--bp-md`: `grid-template-columns: minmax(0, 26rem) minmax(0, 1fr)`, gap
`--space-7`, `align-items: center`. The hero is the only place `--fs-900` is used anywhere on the
site.

#### Section order, and the rules that hide sections

Sections render **conditionally**. This is the core defence against day-one emptiness — a
homepage that only shows what exists reads as small-and-focused; one with three stub sections
reads as abandoned.

| # | Section | Condition | Content |
| --- | --- | --- | --- |
| 1 | Hero + latest video | always | As drawn above |
| 2 | **Por onde andei** (map teaser) | ≥ 1 pin in `locais.json` | Static SVG of Portugal + 2 lines + button to `/mapa` |
| 3 | Mais vídeos | `videos.length ≥ 2` | The next 3 after the latest, using §3.3 count rules. At exactly 2 total this is **one** stacked row, not a grid |
| 4 | Sobre | always | Portrait or bike photo + 2 short paragraphs + *"Ler a história completa →"* |
| 5 | Equipamento | ≥ 3 gear items | 3 items, single row, + *"Ver todo o equipamento →"* |
| 6 | Rotas | **≥ 1 route** | Hidden entirely at launch. No teaser, no empty panel |
| — | Contacto | never a section | The footer covers it; a whole homepage block for one email address is padding |

#### The map teaser (why it is not a live map)

Leaflet plus tiles is 40KB+ of JS and a burst of tile requests — on the one page with a
three-second budget, and against OSM's tile usage policy for a page nobody asked to see a map on.
Instead, build a static SVG **once**:

- Outline: mainland Portugal from Natural Earth 1:110m (public domain), simplified, committed as
  `src/components/PortugalOutline.astro`. Islands are out of scope for the teaser; say
  *"Portugal continental"* in the caption if pins ever exist elsewhere.
- Pins: project `locais.json` with the same equirectangular transform used to build the outline,
  so they stay accurate for free —
  `x = (lon + 9.55) · 77.09`, `y = (42.2 − lat) · 100`, over bbox
  `lon −9.55…−6.15`, `lat 36.9…42.2`, mean-latitude scale `cos(39.55°) = 0.7709`, giving
  `viewBox="0 0 262 530"` (roughly 1:2, portrait — matching the country's real proportions).
- Styling: outline `fill: var(--color-surface-2); stroke: var(--color-border-strong)`, pins
  `r="6" fill="var(--color-accent)"`. Theme-aware with no extra assets, ~4KB, zero JS.
- The whole teaser is one link to `/mapa`; the SVG is `aria-hidden="true"` with the text carrying
  the meaning.

### 6.2 `/videos` — Vídeos

```
Page header: h1 "Vídeos" · lead · "2 vídeos"
──────────────────────────────────────────────────────────────
count 0 → .empty panel
count 1–3 → .stack (LAUNCH DAY)          count 5+ → .cards--videos
┌──────────────┬───────────────────────┐  ┌────────┐┌────────┐┌────────┐
│              │ Um Ano de Mota, Zero  │  │ poster ││ poster ││ poster │
│   poster ▶   │ Vídeos… Isto Muda     │  │ título ││ título ││ título │
│   (352px)    │ Agora | Motovlog #1   │  └────────┘└────────┘└────────┘
│              │ 16 ago 2026           │  ┌────────┐┌────────┐┌────────┐
│              │                       │  │        ││        ││        │
│              │ Depois de mais de um  │  └────────┘└────────┘└────────┘
│              │ ano e 14.000km sobre  │
│              │ a CFMOTO 450 MT…      │
│              │ Ver no YouTube        │
└──────────────┴───────────────────────┘
```

At launch this page is two large rows: a 352px poster, the cleaned title at `--fs-600`, the date,
the opening paragraph of the description clamped to 3 lines, and the YouTube link. It looks like
an editorial index that happens to have two entries — not a grid missing 28 items.

No filters, no tabs, no "Shorts only" toggle. All of those need JS, and none of them earn their
keep below ~50 videos. Newest first, always.

### 6.3 `/sobre` — Sobre

Single prose column, `--width-prose` (36rem), left-aligned within the container — **not** centred
on the page at desktop, which would leave the h1 floating in the middle of 1088px. Container
padding plus `.prose` gives a natural left-aligned reading column with the header above it.

```
┌────────────────────────────────────────────────────┐
│  Sobre                                             │  h1
│  Quem conduz, o que conduz, e porquê.              │  lead
│  ──────────────────────────────────────            │
│  ┌───────────────────────────┐                     │
│  │   foto (4:3 ou 3:2)       │                     │  --radius-3, full prose width
│  └───────────────────────────┘                     │
│  Nasci em Évora, vivo em Lisboa…                   │  --fs-400 / --lh-prose
│                                                    │
│  ## A Dora                                         │  h2 --fs-700
│  A CFMOTO 450 MT…                                  │
│                                                    │
│  ## Porquê um canal                                │
│  …                                                 │
│  ┌──────────────────────────────────────────────┐  │
│  │ "trocar os ecrãs por um capacete"            │  │  pull quote:
│  └──────────────────────────────────────────────┘  │  3px accent leading border,
│                                                    │  --fs-500, --font-display
│  [ Ver os vídeos ]  [ Falar comigo ]               │
└────────────────────────────────────────────────────┘
```

Prose rules: `h2` gets `--flow-space: var(--space-7)`, paragraphs `1em`, images
`--flow-space: var(--space-6)`. `hyphens: auto`. Max ~2 pull quotes; the `sudo`/screens-to-helmet
line is the obvious one.

### 6.4 `/equipamento` — Equipamento

```
┌──────────────────────────────────────────────────────────────┐
│  Equipamento                                                 │
│  O que levo comigo e porquê. Sem patrocínios.                │
│  ────────────────────────────────────────────                │
│  Câmaras                                                     │  h2 --fs-700
│  ┌──────────┐┌──────────┐┌──────────┐┌──────────┐            │
│  │ Insta360 ││ GoPro    ││ …        ││ …        │            │  cards--gear
│  │ porque…  ││ porque…  ││          ││          │            │  4 cols @1088
│  └──────────┘└──────────┘└──────────┘└──────────┘            │
│                                                              │
│  Suportes                                                    │
│  ┌──────────┐┌──────────┐                                    │
│  └──────────┘└──────────┘                                    │
│  … Capacete · Comunicação · Bagagem                          │
└──────────────────────────────────────────────────────────────┘
```

Category headings in a fixed order (Câmaras, Suportes, Capacete, Comunicação, Bagagem); a category
with no items is omitted, not shown empty. Two items in a category is fine here — small groups
under a heading read as complete in a way a sparse full-page grid never does.

*"Sem patrocínios"* in the lead is worth keeping: it sets expectations and it is the honest
differentiator for a gear page.

### 6.5 `/mapa` — Mapa

The one full-bleed page. `<main>` gets no `.container`; the map fills the viewport below the
header.

```
┌──────────────────────────────────────────────────────────────┐
│  SudoRider                    Início Vídeos Mapa …           │  --header-h
├──────────────────────────────────────────────────────────────┤
│                                    ╭──────────────────┐      │
│              ●                     │ ┌──────────────┐ │      │
│                     ●              │ │  thumbnail   │ │      │
│         ●                          │ └──────────────┘ │      │
│                  ●                 │ Serra da Arrábida│      │
│                                    │ 16 ago 2026      │      │
│    ●                               │ Ver o vídeo →    │      │
│                                    ╰──────────────────╯      │
│  [+]                                                         │
│  [−]                          © OpenStreetMap contributors   │
└──────────────────────────────────────────────────────────────┘
```

```css
.map { height: calc(100svh - var(--header-h)); min-height: 26rem; }
```

`svh` (small viewport height), not `vh` — on iOS `100vh` sits under the collapsing browser chrome
and pushes the zoom controls off screen.

**Route tracks.** The map draws every published route's GPX as a line under the pins — ink over a
light casing, `interactive: false`, in the overlay pane so markers stay above it. Simplify for the
the deepest zoom the map allows, not the shallowest: **10m**, which holds the line inside ~5px of
the road at maxZoom — inside the lane — and costs ~2.9KB for a 27km track. Choosing the tolerance
for the opening zoom instead gives a line that reads well from far away and lies close up. Tracks
are therefore drawn at **every** zoom; do not reintroduce a cutoff, which only ever compensated for
a tolerance chosen too coarse. Share the point budget across a route's segments rather than
applying it to each — a GPX with recording pauses in it otherwise buys one budget per pause, and a
route that hits the cap is coarsened past 10m and will drift at street level. A linear route is the
case this exists for; a pin alone puts a 130km ride and a 5km loop at the same dot. The initial
`fitBounds` is computed over pins *and* track points, so a route running away from its pin cannot
start off screen. (The pannable box is not: it is the whole world — see §5.4.)

Below the map, **outside** the viewport-height block, a short `.container` strip:

- One line of framing: *"Cada pino é um sítio onde filmei. Carrega num pino para ver as voltas.
  As linhas são as rotas publicadas, listadas em baixo."* — a pin is a place, and a place can carry
  several rides (§5.4), so neither line here nor the teaser on `/` may promise one video per pin.
  The sentence carries an `id` that the map region points at with `aria-describedby`: it is the
  short description that says where the long one lives (WCAG G74), so the map's own `aria-label`
  and this line have to keep describing the same map — routes included.
- **"Locais" comes before "Rotas no mapa".** The locations list is the map's text alternative, and
  a whole section wedged between a widget and its alternative pushes them apart for exactly the
  readers relying on the alternative.
- The near-empty note from §5.8 when there are fewer than 3 pins.
- **A `<noscript>` list of every place** — name, date, link to the video. This is not a nicety:
  it is the only content on this page for users without JS, and it makes the page's information
  crawlable and accessible regardless. Render it always, visually hidden when JS is present? No —
  render it always and *visibly*, as a plain "Locais" list under the map. It is useful to
  everyone, and it is the page's text alternative for a canvas-like widget (WCAG 1.1.1).

Leaflet config for this page: `scrollWheelZoom: true` (it is the page's purpose), `dragging: true`,
initial view fitted to the pins' bounds with `padding: [40, 40]`, `maxZoom: 16`. Keyboard: pins
tabbable, `Esc` closes popups (Leaflet default).

### 6.6 `/rotas` — Rotas (index) and `/rotas/[slug]`

**A route may belong to more than one video.** `video` in the frontmatter takes an id or a list of
them, so a ride split across "Parte 1" and "Parte 2" links back from both. One video keeps the
plain *"Ver o vídeo desta rota"* button; several are numbered — *"Ver o vídeo 1 de 2"* — with the
video's title in a `.visually-hidden` suffix so the buttons are distinguishable in a screen
reader's list while the visible words stay the label's prefix (2.5.3).


**Index at launch (0 routes):** the page header, then the `.empty` panel from §5.8. That is the
whole page. It is short, it is honest, and it tells a visitor what to expect.

**Index with routes:** the count rules from §3.3 — stacked rows at 1–3, `cards--rotas` at 4+.
Sorted newest first. No region filter until there are ~12 routes, and even then prefer grouping by
region under headings over a JS filter.

**Route page:**

```
┌──────────────────────────────────────────────────────────────┐
│  Rotas → Alentejo                                            │  breadcrumb --fs-200
│  Évora – Monsaraz pela margem                                │  h1 --fs-800
│  [ALENTEJO]   128 km   set 2026                              │  meta, mono numerals
│  ────────────────────────────────────────────                │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                 GPX track on map                       │  │  4:3 mobile → 16:9 ≥bp-md
│  └────────────────────────────────────────────────────────┘  │
│  [ Descarregar GPX ]                                         │
│                                                              │
│  Prose … --width-prose … photos at prose width               │
│                                                              │
│  ── Vídeo desta rota ─────────────────────────────           │
│  ┌──────────────┐                                            │
│  │  poster ▶    │  linked video card, if one exists          │
│  └──────────────┘                                            │
└──────────────────────────────────────────────────────────────┘
```

- **The facts are text, not map.** Distance, region and date render as HTML above the map. If
  Leaflet fails or JS is off, the page still says what the route is.
- Route map: `scrollWheelZoom: false` and `dragging: L.Browser.mobile ? false : true`. On a phone,
  a draggable map inside a long article traps the scroll — the standard fix is to disable dragging
  on touch and offer a "Ver no mapa grande" link to `/mapa`.
- Track styling comes from the Cartography pass. `docs/brand.md` resolves this as
  `--sr-map-track` (the ink colour, **not** the accent) at `weight: 4` with a translucent casing,
  deliberately reserving ocre for pins so a long track does not compete with them. Defer to that;
  the earlier draft of this line said accent and was wrong. See §13.
- GPX download is a `.btn--ghost` with the file size in the label — *"Descarregar GPX (42 KB)"*.

### 6.7 `/contacto` — Contacto

The smallest page. **No contact form** — a static site cannot process one without a third-party
service, and that would mean an external script, a spam vector and a privacy notice for something
an email link solves.

```
┌────────────────────────────────────────────────────┐
│  Contacto                                          │
│  Para colaborações, dúvidas ou só para dizer olá.  │
│  ────────────────────────────────────────          │
│  ┌──────────────────────────────────────────────┐  │
│  │  E-mail                                      │  │  card, --color-surface
│  │  info@sudorider.com                    →     │  │  --fs-500, mono
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  [▶] YouTube      @SudoRider          →      │  │
│  ├──────────────────────────────────────────────┤  │
│  │  [◎] Instagram    @sudorider          →      │  │
│  └──────────────────────────────────────────────┘  │
│                                                    │
│  Normalmente respondo em poucos dias.              │  --fs-200, muted
└────────────────────────────────────────────────────┘
```

Max width `--width-prose`. Rows are `min-height: 3.5rem`, full-row links, inline SVG icon +
label + `→`. External links get `rel="me noopener"` (the `me` value also serves verification).
The "responde em poucos dias" line manages expectations and costs one sentence.

---

## 7. Motion

Almost nothing moves. The site has no client JS outside the map, so every effect below is CSS
responding to a real user action — there is no scroll observer, no reveal-on-scroll, no page
transition, no carousel.

| What | Trigger | Property | Duration |
| --- | --- | --- | --- |
| Link / button colour | hover, focus | `color`, `background-color`, `border-color` | `--dur-1` 120ms |
| Card lift | hover, focus-within | `box-shadow`, `border-color` | `--dur-1` |
| Poster zoom | card hover | `transform: scale(1.03)` inside `overflow: hidden` | `--dur-2` 200ms |
| Nav chevron | `details[open]` | `transform: rotate(180deg)` | `--dur-1` |
| Map pin | hover, focus, popup open | `transform: scale(1.15)` | `--dur-1` |
| Focus ring | `:focus-visible` | **none — appears instantly** | 0 |

**No transform on card hover.** Cards change shadow and border only; the poster inside moves. A
translated card nudges its neighbours' perceived alignment and, in a grid of remote-loaded
thumbnails, reads as jitter.

The focus ring is never transitioned. A fading focus indicator is a real accessibility problem for
anyone tabbing quickly.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

The blanket rule is correct here precisely *because* motion is decorative throughout — no state
change depends on a transition finishing, so killing all of them removes nothing but the movement.
The `scale(1.03)` and `scale(1.15)` end states are also suppressed, which is intended: for a
reduced-motion user the border and shadow changes still signal hover.

Explicitly rejected: Astro `<ViewTransitions>` (ships a router, and would preserve the open mobile
menu across navigations), any scroll-linked animation, skeleton loaders, and count-up numbers on
the route distance.

---

## 8. Sparse content — the summary

The most likely way this site fails on day one is looking abandoned. Every mechanism, in one place:

1. **The grid is never used below 4 items** (§3.3). Launch renders 2 videos as 2 large editorial
   rows.
2. **Homepage sections are conditional** (§6.1). Rotas does not appear on `/` until a route
   exists; Equipamento needs 3 items; the map teaser needs 1 pin.
3. **Empty states are written, not generic** (§5.8). Dashed panel, real Portuguese sentence
   explaining what will appear, one action pointing somewhere that *does* have content.
4. **Counts are stated, not hidden.** "2 vídeos" in the page header frames the number as a fact.
   A page that quietly shows two cards invites the question "is this broken?".
5. **Categories over grids for gear.** Two items under *Suportes* looks complete; two items in a
   full-page grid looks broken.
6. **Nothing is a placeholder.** No grey boxes, no "em breve" cards, no dummy route. If it does
   not exist, it is not rendered.

Growth checkpoints — revisit when:

| Threshold | Revisit |
| --- | --- |
| 4 videos | Grid engages; check the 2×2 layout |
| ~24 videos | Verify the lazy-iframe facade still issues zero requests on load (§5.1) |
| ~50 videos | Consider pagination or year headings on `/videos` |
| ~12 routes | Consider grouping `/rotas` by region (headings, not a JS filter) |
| ~30 pins | Pin overlap at national zoom becomes a real problem; revisit clustering |

---

## 9. Accessibility

Target: **WCAG 2.2 AA**. Built in, not audited in afterwards.

**Focus.** One global rule, never removed anywhere:

```css
:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px;
                 border-radius: var(--radius-1); }
```

`--color-focus` must clear 3:1 against `--color-bg` *and* `--color-surface` in both themes
(§1.1). `outline-offset: 2px` keeps the ring off the element's own border so it stays visible on
cards. Interactive elements sitting flush against a container edge get `outline-offset: -2px`
locally rather than losing the ring.

**Targets (WCAG 2.5.8, AA).** 24×24 minimum; this spec uses **44×44** throughout: nav items,
buttons, popup close, map pins (via the transparent `::after`), footer rows. The only elements
below 44px are inline text links inside prose, which are exempt.

**Colour is never the only signal.** Current nav page = accent + underline. Links in prose =
accent + underline (`text-underline-offset: 0.15em`, `text-decoration-thickness: 0.08em`). Short
badge = a text label reading "Short", not a shape or colour.

**Landmarks and structure.**

```html
<html lang="pt-PT">
  <header><nav aria-label="Principal">
  <main id="conteudo" tabindex="-1">
  <footer><nav aria-label="Rodapé">
```

One `<h1>` per page. No skipped heading levels — gear categories are `<h2>`, item names `<h3>`;
video titles inside a section are `<h3>` under the section's `<h2>`.

`lang="pt-PT"` rather than `lang="pt"`: it selects European Portuguese pronunciation in screen
readers and loads the correct hyphenation dictionary. *(The current placeholder
`src/pages/index.astro` has `lang="pt"` — worth changing in the layout pass.)*

**Images.** Photos get descriptive Portuguese `alt`. Video posters get `alt=""` (the title is
adjacent — §5.1). Decorative SVG gets `aria-hidden="true"`. The Portugal teaser is decorative; its
text carries the meaning.

**The map** is the hard case. Requirements: pins tabbable with accessible names
(`title` + `alt` marker options), popups reachable and dismissible with `Esc`, zoom controls with
real labels in Portuguese (`zoomInTitle: 'Aproximar'`, `zoomOutTitle: 'Afastar'`), and the
**visible Locais list under the map** as the text alternative (§6.5). Do not rely on the map alone
to convey any information.

**Reflow (1.4.10).** No horizontal scrolling at 320px width or 400% zoom. Enforced by
`min(100%, …)` in every grid track, `max-width: 100%` on media, and `overflow-wrap: anywhere` on
long tokens like the email address.

**Text spacing (1.4.12).** Nothing has a fixed height that would clip text: cards use
`min-height`, buttons use `min-height` plus padding, the nav panel grows with content. Test by
forcing line-height 1.5, letter-spacing 0.12em, word-spacing 0.16em, paragraph spacing 2em.

**Reduced motion** — §7.

**Not shipped, deliberately:** no ARIA on `<details>` (§4.3), no `role` attributes on semantic
elements, no `tabindex` above 0. The static-first design means almost nothing is dynamic.

The map is the exception, and it needs two things this section originally ruled out. Its popup
takes `role="dialog"` and manages focus (§5.4). And its loading and error states — "A carregar o
mapa…" becoming "Não foi possível carregar o mapa." — currently change with no announcement at
all; that one is a **known gap**, not a decision. The fix is a permanent `role="status"` whose
text content changes, rather than toggling `hidden`, which screen readers announce
inconsistently.

---

## 10. Implementation map

What was actually built. It differs from the file split this spec first sketched — noted where it
matters, so the difference reads as a decision rather than a drift.

```
src/styles/
  tokens.css        §1–2   custom properties, light + dark blocks
  global.css        reset, element defaults, .prose, layout primitives, focus ring,
                    reduced motion, .visually-hidden — the base/layout/components split
                    this spec proposed was more files than the CSS justified

src/layouts/
  Base.astro        html/head/meta/theme-color, header + main + footer, skip link
  Page.astro        Base + page header block (§5.5) + .container

src/components/
  Header.astro              §4    wordmark + the seven links, details/summary
  Footer.astro              §5.6
  VideoCard.astro           §5.1
  VideoList.astro           §3.3  count-aware wrapper (empty / stack / 2×2 / grid)
  RouteCard.astro           §5.2
  GearItem.astro            §5.3
  EmptyState.astro          §5.8
  SectionHeader.astro       §5.7
  PortugalOutline.astro     §6.1  static SVG teaser
  Icon.astro
  RideMap.astro             §5.4  the pin map — Leaflet in a bottom <script>, popups as
                                  <template> elements
  RouteMap.astro            §6.6  one GPX track — parsed at build, coordinates baked in
  format.ts                 dataCurta/dataLonga/mesAno/dataISO, tituloLimpo,
                            paragrafoInicial — this spec called it src/lib/video.ts
  site.ts                   site-wide constants (email, socials)

src/lib/
  types.ts          Video, Local, Equipamento
  videos.ts         the video list every page reads through; Shorts filtered here
  locais.ts         §5.4   map pins grouped by place, shared by the map and its text list
  rotas.ts          routes indexed by video id (so a pin can offer "ver a rota"), the
                    build-time track reader for the overview map, and the shared
                    basename guard for GPX filenames out of frontmatter
  gpx.ts            §5.2   GPX parse, distance, simplify, SVG projection
  url.ts            withBase()
```

Leaflet's stylesheet stays out of the global bundle, but by a simpler route than a `leaflet.css`
of overrides: `RideMap` and `RouteMap` each `import 'leaflet/dist/leaflet.css'` and carry their own
overrides in a scoped `<style>`. Astro then ships it only on the two pages that render a map, so
five of the seven pages carry no map CSS at all — the outcome this spec asked for.

---

## 11. Handoffs

Things this spec depended on that belonged to someone else. Most are now settled; what is left is
listed first.

### Still open

1. **Frontend — wire the GPX sketch into `RouteCard` (§5.2).** `trackToSvgPath()` is built and
   tested. Until the card uses it, the routes index renders the meta-only fallback — correct, but
   it is the sketch that makes the card worth looking at.
2. **Frontend — verify the lazy-iframe facade** issues zero third-party requests with cards
   closed, in all three engines. Bounded fallback documented in §5.1.
3. **Accessibility — the map's loading and error states** change with no announcement (§9). Needs
   a permanent `role="status"` rather than a toggled `hidden`.

### Settled

4. **The token contract (§1.1)** — `src/styles/tokens.css`. Note the map's pin stroke and count
   badge are deliberately **literal** colours, not semantic tokens: they render in the marker
   pane, which the dark-mode tile filter does not touch, so a theme-flipping token would leave
   them invisible in one theme.
5. **Diacritic coverage** — IBM Plex Sans (400/600) and IBM Plex Mono (400), `display=swap`, with
   `preconnect` to both Google Fonts hosts. Two families, three files.
6. **Shorts detection (§5.1)** — resolved at sync time by probing `youtube.com/shorts/<id>`, which
   answers definitively where the feed cannot. The flag lands in `videos.json`; the *filter* lives
   in `src/lib/videos.ts`, so excluding Shorts from the site is one line to undo.
7. **`locais.json` shape** — settled as `{ name, lat, lng, video, note?, country? }`, not the
   `{ id, nome, lat, lon, video, data, regiao }` this spec originally assumed: date and title come
   from `videos.json` via the video id rather than being restated, and there is no region field
   because nothing displays one. `country` is omitted at home and carries the country otherwise;
   it is part of the grouping key, not just a label, so two places sharing a name across a border
   stay two pins. Validation happens in `src/lib/locais.ts` and fails the build loudly, as asked.
8. **GPX → SVG sketch** — built (`src/lib/gpx.ts`), pending the wiring in item 1.
9. **Track and tile styling** — done, with one deviation worth knowing: the route track is drawn
   in **ink over a light casing**, not in the accent. The accent belongs to pins, and a track
   competing with a pin is what §5 rules out.
10. **The homepage hero sentence** — shipped as drafted, 96 characters.

---

## 12. Pre-launch checklist

- [ ] 390px: no horizontal scroll on any of the seven pages
- [ ] 390px: the latest-video poster is fully visible without scrolling on `/`
- [ ] 832px ± 20px: nav switches cleanly; *Equipamento* never wraps
- [ ] 400% zoom on 1280px: content reflows, nothing clipped, nav usable
- [ ] Dark and light: every page, including the map, popups and attribution
- [ ] Keyboard only: skip link → nav → open a video → play → footer, ring always visible
- [ ] JS disabled: all seven pages readable; `/mapa` shows the Locais list
- [ ] `prefers-reduced-motion: reduce`: nothing moves, hover still legible
- [ ] `/videos` on load: zero requests to `youtube-nocookie.com`
- [ ] `/rotas` with zero routes: reads as intentional
- [ ] Screen reader: video card announces title once, nav announces expanded/collapsed
- [ ] Long-title stress test: a 120-character PT title clamps to 2 lines without breaking the card

---

## 13. Reconciliation with `docs/brand.md`

`docs/brand.md` was written in parallel with this document and landed a **different token prefix**
(`--sr-*`) and its own scales. Both are valid; they just need one seam. **The brand spec wins on
every value it defines** — colour, typeface, type steps, spacing, radii, measure. This document
keeps only what the brand spec has no opinion about: layout widths, breakpoints, z-index, motion,
gutters and section rhythm.

Read this section as the translation table. Where a row says *missing*, the brand spec needs one
more token — those are the only four real gaps.

### 13.1 Name mapping

| This spec (§1.1) | `docs/brand.md` | Note |
| --- | --- | --- |
| `--color-bg` | `--sr-bg` | — |
| `--color-surface` | `--sr-bg-surface` | — |
| `--color-surface-2` | **missing** | Recessed media well / map letterbox. Suggest `--sr-bg-well`: `--sr-warm-200` light, `--sr-cool-700` dark. `--sr-bg-hover` is the wrong semantic and `--sr-cool-600` is too light against `--sr-cool-800` cards |
| `--color-border` | `--sr-border` | — |
| `--color-border-strong` | **missing** | Needs **≥ 3:1** (ghost-button borders, empty-state dash, pin ring — WCAG 1.4.11). `--sr-border` (`#DFDBD3` on `#FBFAF8` ≈ 1.3:1) is decorative-only and cannot carry these. `--sr-warm-600` works at 6.7:1 but reads heavy; a mid step is better. Brand Guardian's call |
| `--color-text` | `--sr-fg` | — |
| `--color-text-muted` | `--sr-fg-muted` | — |
| `--color-accent` **as a fill or graphic** | `--sr-accent` | — |
| `--color-accent` **as text** | `--sr-accent-text` | **The brand spec is right and this one was sloppy.** It splits accent-as-graphic from accent-as-text because `#C86A0E` fails as body-size text on light ground. Everywhere §5 says `--color-accent` on a *link*, use `--sr-accent-text` |
| `--color-accent-hover` | **missing** | For a filled button hover, `--sr-ocre-deep` (`#9E5205`) in both themes |
| `--color-accent-contrast` | **missing — see §13.2** | — |
| `--color-focus` | `--sr-focus` | Verified: ocre clears 3:1 on light bg (3.65:1), light surface (3.34:1) and dark bg (4.76:1) |
| `--font-display` / `--font-body` | `--sr-font-sans` | One family for both. IBM Plex Sans covers the required diacritics |
| `--font-mono` | `--sr-font-mono` | — |
| `--shadow-1` / `--shadow-2` | `--sr-shadow` | Brand ships one step, already theme-aware. Collapse §2.3's two steps to one; hover changes `border-color` only |

### 13.2 One contrast bug to avoid

`--color-accent-contrast` (text on an accent fill — `.btn--primary`, §5.7) has no brand equivalent,
and the obvious guess is wrong:

| Text on `--sr-accent` `#C86A0E` | Ratio | AA normal text |
| --- | --- | --- |
| White `#FFFFFF` | **3.80:1** | ❌ fails |
| Ink `#1B1A18` (`--sr-warm-900`) | **4.57:1** | ✅ passes |

**Primary buttons take dark ink on ocre, not white.** White-on-orange is the reflex and it fails.
If the brand later wants white button text, the fill has to darken to `--sr-ocre-deep` `#9E5205`
(white on that = 6.6:1), not the other way round.

### 13.3 Scales — brand wins, with two notes

| Concern | Resolution |
| --- | --- |
| **Type scale** | Use `--sr-text-*`. Discard §2.2's `--fs-*` ramp. The two agree closely anyway (both land on 17px body, 24px h3, ~30px h2) and a fixed ramp is simpler to maintain than nine `clamp()`s. **Note:** only `--sr-text-hero` is fluid, so h1 is a fixed 38px at every width — check it at 390px against a long PT page title (*Equipamento* ≈ 231px, fits) |
| **Spacing** | Use `--sr-space-*`. Its multiplier naming (`--sr-space-8` = 32px) is self-documenting; §2.1's `--space-6` = 32px is not. Same 4px base, same values |
| **Radii** | Use `--sr-radius-*` (2/4/8px). Tighter than §2.3's 4/8/12 — that is a brand decision, take it. It does mean cards read sharper than the wireframes suggest |
| **Measure** | `--sr-measure` (68ch) replaces `--width-prose` (36rem). Equivalent at 17px |
| **Leading / tracking** | `--sr-leading-*`, `--sr-tracking-*`. Brand's `relaxed` is 1.65 vs §2.2's 1.7 — immaterial, take theirs |
| **Map colours** | `--sr-map-*`. Track is the ink colour with a casing, **not** the accent; pins keep the accent. Corrected in §6.6 |

### 13.4 What stays in this document

The brand spec has no equivalent for these, and they are what makes the pages hold together:

`--width-page` · `--gutter` · `--space-section` · `--header-h` · `--z-nav-panel` (the Leaflet
clearance value) · `--dur-*` / `--ease-out` · the three breakpoints · every component structure in
§5 · every page layout in §6 · the count-aware sparse rules in §3.3.

### 13.5 Action for whoever implements

`src/styles/tokens.css` should define the `--sr-*` layer verbatim from `docs/brand.md`, add the
four missing tokens above, then define this document's structural tokens alongside. **Do not build
an alias layer** that re-exports `--sr-bg` as `--color-bg`: two names for one value is how a design
system starts to drift. Search-and-replace the `--color-*` / `--fs-*` / `--space-*` names in this
document to their `--sr-*` equivalents as you implement, using §13.1.

---

*UI Designer · SudoRider · 2026-08-20 · specification only, no implementation*
