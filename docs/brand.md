# SudoRider — Brand Identity

**Status:** specification. Nothing here is implemented yet.
**Scope:** this document defines the brand. It does not change any code. Implementation — the
stylesheet, the layout, the favicon, the wordmark markup — happens separately, against this spec.

This file is written in English, following the repository rule that developer documentation stays
English while all user-facing site content is Portuguese (pt-PT). Every piece of example copy
below is quoted in the Portuguese it should ship in.

---

## 1. Positioning

> **SudoRider is a first-person riding diary from Portugal — one person, one 450, and the roads he
> actually took — published with the route attached so someone else can ride it.**

### What it is not

It is not a review channel, not a gear channel, not a speed or stunt channel, not a
travel-influencer channel, and not a tech channel. It is not "Europe by motorcycle" made in English
for an international audience. It is not an expedition brand.

### What differentiates it

Four things, in order of strength:

1. **The route is the deliverable.** Almost every motovlog ends at the upload. SudoRider ships the
   GPX track, the write-up, the distance and the map pin alongside the video. That is the part that
   stays useful after the video stops being recommended, and it is the reason the site exists at all
   rather than being a link tree. *This is the single strongest differentiator and the site should be
   built around it.*
2. **Portugal at ground level, in European Portuguese.** Not a country being "covered" — a country
   being lived in. Évora and the Alentejo are specific, under-filmed, and his. pt-PT is not a
   limitation to apologise for; it is the audience definition.
3. **An accessible bike, honestly ridden.** A CFMOTO 450 MT with 14.000 km on it is a bike a viewer
   could plausibly buy. The position is deliberately anti-aspirational: this is a Saturday you could
   actually have, not a Dakar you never will.
4. **The tech seam, held lightly.** The audience is people sitting at screens. `sudo` gives that
   feeling a word. It is who he is, not a bit he does — and it must be expressed through structure
   and restraint, never through hacker imagery.

### Positioning statement

> For people who spend the week in front of a screen and want a reason to get out at the weekend,
> SudoRider is a Portuguese motovlog that documents real rides on an ordinary bike and publishes
> the route so you can ride it too — unhurried, specific, and in your own language.

---

## 2. Brand foundation

**Purpose.** To give the week's screen time somewhere to end — and to leave behind a usable record
of where the road went, so the ride is repeatable by someone else.

**Promise.** Whatever you find here is real: the road was ridden, the gear was paid for, the number
is the number.

### Pillars

| Pillar | Meaning | How it shows up |
| --- | --- | --- |
| **Estrada** | The ride itself, at ground level. Named roads, named towns, real weather. | Video, map pins, place names in copy |
| **Registo** | The record. Everything is written down and given away. | Route write-ups, GPX files, gear list, the map |
| **Sossego** | Unhurried. No hype, no countdown, no urgency. | Pacing, typography, empty states, absence of CTAs |

### Values

- **Honesto** — say the real number. Two videos is two videos. 14.000 km is 14.000 km.
- **Específico** — name the road, the town, the price, the bike. Specificity is the whole voice.
- **Sem pressa** — he rode for over a year before filming anything. That patience is the brand.
- **Útil** — every page should leave the reader with something they can use.

### Personality

Five traits, in the order they should be felt:

- **Understated** — states things plainly and then stops. Does not sell.
- **Precise** — engineer's habit. Exact distances, exact names, no rounding up for effect.
- **Dry** — humour exists but arrives once, quietly, and never explains itself.
- **Generous** — gives the route away for free, with no gate and no email capture.
- **Curious** — "sempre à procura do próximo motivo para arrancar" is the operating mood.

**What the personality rules out:** enthusiasm as a performance, motivational framing, mystique,
authority-claiming, and any sentence that exists only to make the reader feel behind.

---

## 3. The name

`sudo` is the Unix command that grants elevated permission — the thing you type when you need to be
allowed to do something. `sudo` + `rider`. The name is not a pun on riding; it is a statement that
the ride is the permission escalation. His own tagline says the same thing in Portuguese, and his
own description says it a third time: *"sempre à procura do próximo motivo para arrancar."*

That gives the brand one idea, said three ways. Do not add a fourth.

### Capitalisation rules

| Context | Form | Example |
| --- | --- | --- |
| Running prose, page titles, social handles, `<title>` | `SudoRider` | "Bem-vindo ao SudoRider" |
| Wordmark / logo / avatar | `sudorider` (lowercase) | the mark itself |
| Domain, URLs, filenames, repo, code | `sudorider` (lowercase) | `sudorider.com` |

**Never:** `Sudo Rider` (two words), `SUDORIDER`, `sudoRider`, `Sudo-Rider`, or `SudoRider` with a
trademark symbol.

**Never** set the word `sudo` in a `<code>` element in running prose. Explaining the joke is what
kills it.

### The tagline

```
trocar os ecrãs por um capacete
```

His words. Rules:

- Always lowercase. Never a full stop at the end.
- Never translated on the site. (The English gloss is fine in `README.md`, which is developer
  documentation, and in YouTube metadata aimed at non-Portuguese viewers.)
- Never reworded, shortened or "improved". If a shorter line is needed, use nothing.
- It is a subtitle, not a headline: it always sits below the wordmark, never above and never alone.

---

## 4. Voice and tone (pt-PT)

**Register:** first person singular, present tense, European Portuguese. Informal `tu` when
addressing the reader; never `você`. Sentences short. Paragraphs short. No exclamation marks except
where genuine surprise is being reported.

A confidence note: the Portuguese below follows pt-PT conventions carefully (progressive with
`estar a` + infinitive, enclitic pronouns, `subscrever`, `ecrã`, `contacto`, `quilómetro`,
post-AO90 spelling). Filipe is a native speaker — he should read every line before it ships and
overrule anything that sounds off. Where a line felt least certain to me I have marked it 🔸.

### Principle 1 — State the fact, then stop

The sentence after the fact is almost always the one that cheapens it.

- ✅ `Passei mais de um ano e 14.000 km em cima da Dora antes de filmar seja o que for.`
- ❌ `Passei mais de um ano e incríveis 14.000 km em cima da Dora antes de finalmente ter a coragem de filmar!`

### Principle 2 — Be specific instead of being enthusiastic

Enthusiasm is generic; detail is not. A place name does more work than an adjective.

- ✅ `Saímos de Évora pela EN18 com 9 graus e névoa até Estremoz.`
- ❌ `Que manhã espetacular no Alentejo! Paisagens de sonho!`

### Principle 3 — Admit the state of things

The channel is new and has no fixed format. Saying so is on-brand; pretending otherwise is not.

- ✅ (Vídeos, with two videos) `Por enquanto são dois. Vão ser mais.`
- ✅ (Rotas, empty) `Ainda não há rotas publicadas. A primeira está a ser escrita.` 🔸
- ✅ (Mapa, few pins) `De momento há poucos pontos no mapa. Vão aparecendo à medida que os vídeos saem.`
- ❌ `Junta-te à comunidade SudoRider!` — there is no community yet. Do not invent one.
- ❌ `Novos vídeos todas as semanas!` — do not promise a schedule he has not committed to.

### Principle 4 — Never sell

No urgency, no scarcity, no growth-hacking imperatives. Invitations, not calls to action.

- ✅ `Se quiseres falar sobre uma rota, uma dúvida ou uma volta, escreve.`
- ✅ `Respondo quando consigo.`
- ✅ `Ver no YouTube` / `Subscrever o canal`
- ❌ `NÃO PERCAS!` / `Clica já` / `Subscreve AGORA e ativa o sininho`

### Principle 5 — The gear page is a disclosure, not a shop

- ✅ `Nada aqui é patrocinado. É só o que levo comigo.`
- ✅ `Comprei por ser o que cabia no orçamento, não por ser o melhor.`
- ❌ `O melhor equipamento para motard em 2026 — a minha seleção!`

If affiliate links ever appear, disclose them in the first line of the page in plain Portuguese, not
in a footnote.

### Principle 6 — Dora is a name, not a character

The bike is called "a Dora" and is referred to as `ela`. `por onde a estrada nos levar` — the `nos`
is him and the bike, and that plural is a lovely, real piece of his voice. Keep it.

- ✅ `A Dora levou com chuva desde Sines até Lisboa e não se queixou.`
- ❌ Any copy that gives Dora dialogue, opinions, an emoji face, or an illustrated mascot form.

### Principle 7 — One shell reference, maximum, per surface

The tech seam is carried by the name, the typography and the restraint. It does not need jokes. The
single sanctioned exception is the 404 page, where exactly one is allowed:

```
Esta página não existe. Nem com sudo.
```

That is the whole allowance. If a second shell gag appears anywhere on the site, remove one.

### Tone shifts by surface

| Surface | Tone | Note |
| --- | --- | --- |
| Início | Warm, brief | Three sentences and a video. Do not over-explain. |
| Sobre | Reflective, personal | The only place the tech-vs-road tension is stated outright — once. |
| Vídeos | Neutral | Titles and dates. The copy should get out of the way. |
| Equipamento | Practical, disclosing | Why it was bought, what is wrong with it. |
| Mapa / Rotas | Instructional, exact | Numbers, surfaces, distances. Closest the voice gets to a manual. |
| Contacto | Plain, human | No form-speak. |
| 404 | Dry | The one joke. |

### Formatting conventions (pt-PT)

- **Thousands separator** is a dot, **decimal separator** a comma: `14.000 km`, `3,5 l/100 km`.
- **Units** take a space and stay lowercase: `148 km`, `9 °C`, `3 h 20`. Durations may compress to
  `3h20` in stat blocks.
- **Dates**: `16 de agosto de 2026` (month lowercase). Short form `16/08/2026`.
- **Roads**: `EN2`, `EN18`, `IP2`, `A6` — uppercase, no space before the number.
- **Currency**: `€` after the number with a space — `250 €` — or `250€` in tight stat blocks.

### pt-BR leaks to reject

These are the tells that most commonly slip in from generated or scraped copy. Any of them is a bug.

| Reject (pt-BR) | Use (pt-PT) |
| --- | --- |
| `estou fazendo`, `está sendo escrito` | `estou a fazer`, `está a ser escrito` |
| `você`, `se inscreva` | `tu`, `subscreve` |
| `me diz`, `te conto` | `diz-me`, `conto-te` |
| `tela` | `ecrã` |
| `celular` | `telemóvel` |
| `quilômetro` | `quilómetro` |
| `contato`, `fato` (fact), `registro` | `contacto`, `facto`, `registo` |
| `usuário`, `arquivo` | `utilizador`, `ficheiro` |
| `planejar`, `gerenciar` | `planear`, `gerir` |
| `pegar a estrada` | `meter-me à estrada`, `pôr-me a caminho` |
| `a gente vai` | `vamos` |
| `legal` (= cool) | `fixe` |
| `pedágio` | `portagem` |

---

## 5. Colour

### The governing rule

**Colour comes from the land. Structure comes from the code.** The palette carries zero tech signal
— no terminal green, no electric cyan, no neon. The tech half of the identity is expressed entirely
through typography, precision and restraint. This split is what stops the brand becoming a costume,
and every colour decision below follows from it.

Two hues. That is all. One neutral family per theme, and one accent.

### The accent: Ocre `#C86A0E`

A burnt ochre. It reads three ways at once, all of them true to the facts:

- the painted `barra` at the foot of a whitewashed Alentejo house and the fired clay of Évora's roof
  tiles — his birthplace, not a generic Mediterranean reference;
- low sun on the plain, which is the light most of this footage will be shot in;
- an indicator lamp — the only honest motorcycle colour reference, and a functional one.

It is deliberately **not** KTM orange (`#FF6600`, a 1.29:1 relation — visibly a different colour).
Bright competition orange is the exact ADV-brand cliché this brand should stay away from; ochre is
earth, which is the register the rest of the identity is in.

The single most important property of `#C86A0E` is that **one hex works in both themes**: it clears
3:1 against the light ground (3.64:1) and 4.5:1 against the dark ground (4.76:1), and carries the
dark ink as body text on top of it (4.57:1). There is no light-mode accent and dark-mode accent to
keep in sync. That is the "simple and clean" brief honoured at the token level.

### The neutrals

Two families, because a single neutral ramp cannot be right in both themes:

- **Warm (`--sr-warm-*`)** — the light theme. A limewashed off-white, not `#FFFFFF`. Whitewash and
  daylight. Its darkest step `#1B1A18` is a warm near-black, which sits better on paper-toned ground
  than a cool black does.
- **Cool (`--sr-cool-*`)** — the dark theme. `#14161A` is asphalt at night, a blue-black rather than
  a neutral one. Never `#000000`: pure black is a screen colour, not a road colour, and it makes
  ochre look like a warning label.

### Drop-in tokens

```css
:root {
  /* ---------------------------------------------------------------
     Raw palette. Never reference these directly in components —
     use the semantic tokens below.
     --------------------------------------------------------------- */

  /* Neutrals, warm — "cal" (whitewash). Light theme surfaces + inks. */
  --sr-warm-50:   #FBFAF8;   /* page ground */
  --sr-warm-100:  #F2F0EC;   /* cards, code blocks, table stripes */
  --sr-warm-200:  #E7E3DB;   /* hover surface, hairline on cards */
  --sr-warm-300:  #DFDBD3;   /* borders, dividers */
  --sr-warm-600:  #5C5952;   /* secondary text */
  --sr-warm-900:  #1B1A18;   /* body text */

  /* Neutrals, cool — "asfalto". Dark theme surfaces + inks. */
  --sr-cool-900:  #14161A;   /* page ground */
  --sr-cool-800:  #1C1F24;   /* cards */
  --sr-cool-700:  #2E333B;   /* borders, dividers */
  --sr-cool-600:  #444A54;   /* hover surface / disabled */
  --sr-cool-400:  #A0A5AD;   /* secondary text */
  --sr-cool-200:  #E9EAEC;   /* body text */

  /* Accent — "ocre". One hue, three steps. */
  --sr-ocre:      #C86A0E;   /* THE brand colour. Graphics, rules, fills. Both themes. */
  --sr-ocre-deep: #9E5205;   /* accent as text on light ground only */
  --sr-ocre-lit:  #E89B3D;   /* accent as text on dark ground only */
  --sr-ocre-wash: #F6EBDF;   /* tinted callout ground, light theme */
  --sr-ocre-dim:  #241A10;   /* tinted callout ground, dark theme */

  /* ---------------------------------------------------------------
     Semantic tokens. Light is the base definition — every token is
     given a value here, so nothing depends on a media query firing.
     --------------------------------------------------------------- */
  --sr-bg:            var(--sr-warm-50);
  --sr-bg-surface:    var(--sr-warm-100);
  --sr-bg-hover:      var(--sr-warm-200);
  --sr-bg-callout:    var(--sr-ocre-wash);
  --sr-border:        var(--sr-warm-300);
  --sr-fg:            var(--sr-warm-900);
  --sr-fg-muted:      var(--sr-warm-600);
  --sr-accent:        var(--sr-ocre);        /* rules, underlines, pins, focus */
  --sr-accent-text:   var(--sr-ocre-deep);   /* accent used AS text */
  --sr-focus:         var(--sr-ocre);
  --sr-shadow:        0 1px 2px rgb(27 26 24 / 0.06), 0 4px 12px rgb(27 26 24 / 0.06);
  color-scheme: light dark;
}

/* System preference = dark, unless the reader has explicitly chosen light. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --sr-bg:          var(--sr-cool-900);
    --sr-bg-surface:  var(--sr-cool-800);
    --sr-bg-hover:    var(--sr-cool-600);
    --sr-bg-callout:  var(--sr-ocre-dim);
    --sr-border:      var(--sr-cool-700);
    --sr-fg:          var(--sr-cool-200);
    --sr-fg-muted:    var(--sr-cool-400);
    --sr-accent-text: var(--sr-ocre-lit);
    --sr-shadow:      0 1px 2px rgb(0 0 0 / 0.4), 0 4px 12px rgb(0 0 0 / 0.3);
  }
}

/* Explicit choice wins in both directions. */
:root[data-theme="dark"] {
  --sr-bg:          var(--sr-cool-900);
  --sr-bg-surface:  var(--sr-cool-800);
  --sr-bg-hover:    var(--sr-cool-600);
  --sr-bg-callout:  var(--sr-ocre-dim);
  --sr-border:      var(--sr-cool-700);
  --sr-fg:          var(--sr-cool-200);
  --sr-fg-muted:    var(--sr-cool-400);
  --sr-accent-text: var(--sr-ocre-lit);
  --sr-shadow:      0 1px 2px rgb(0 0 0 / 0.4), 0 4px 12px rgb(0 0 0 / 0.3);
}

body { background: var(--sr-bg); color: var(--sr-fg); }
```

> **Note for whoever implements this:** `--sr-accent` is intentionally *not* redefined in the dark
> block. `#C86A0E` is the brand colour in both themes; if you find yourself wanting to brighten it
> for dark mode, you want `--sr-accent-text`, which already exists.

### Verified contrast

All ratios computed against the sRGB relative-luminance formula. Body-text pairings must meet
**4.5:1**; graphics, borders that carry meaning, and focus indicators must meet **3:1**.

**Light theme**

| Foreground | Background | Ratio | Requirement | |
| --- | --- | ---: | --- | --- |
| `--sr-fg` `#1B1A18` | `--sr-bg` `#FBFAF8` | **16.67:1** | 4.5 body | ✅ |
| `--sr-fg` `#1B1A18` | `--sr-bg-surface` `#F2F0EC` | **15.28:1** | 4.5 body | ✅ |
| `--sr-fg-muted` `#5C5952` | `--sr-bg` `#FBFAF8` | **6.70:1** | 4.5 body | ✅ |
| `--sr-fg-muted` `#5C5952` | `--sr-bg-surface` `#F2F0EC` | **6.14:1** | 4.5 body | ✅ |
| `--sr-accent-text` `#9E5205` | `--sr-bg` `#FBFAF8` | **5.50:1** | 4.5 body | ✅ |
| `--sr-accent-text` `#9E5205` | `--sr-bg-surface` `#F2F0EC` | **5.04:1** | 4.5 body | ✅ |
| `--sr-accent` `#C86A0E` | `--sr-bg` `#FBFAF8` | **3.64:1** | 3.0 graphic | ✅ |
| `--sr-accent` `#C86A0E` | `--sr-bg-surface` `#F2F0EC` | **3.34:1** | 3.0 graphic | ✅ |
| `#1B1A18` | `--sr-accent` fill `#C86A0E` | **4.57:1** | 4.5 body | ✅ |
| `--sr-fg` `#1B1A18` | `--sr-bg-callout` `#F6EBDF` | **14.80:1** | 4.5 body | ✅ |
| `--sr-fg-muted` `#5C5952` | `--sr-bg-callout` `#F6EBDF` | **5.94:1** | 4.5 body | ✅ |

**Dark theme**

| Foreground | Background | Ratio | Requirement | |
| --- | --- | ---: | --- | --- |
| `--sr-fg` `#E9EAEC` | `--sr-bg` `#14161A` | **15.05:1** | 4.5 body | ✅ |
| `--sr-fg` `#E9EAEC` | `--sr-bg-surface` `#1C1F24` | **13.73:1** | 4.5 body | ✅ |
| `--sr-fg-muted` `#A0A5AD` | `--sr-bg` `#14161A` | **7.31:1** | 4.5 body | ✅ |
| `--sr-fg-muted` `#A0A5AD` | `--sr-bg-surface` `#1C1F24` | **6.67:1** | 4.5 body | ✅ |
| `--sr-accent-text` `#E89B3D` | `--sr-bg` `#14161A` | **7.92:1** | 4.5 body | ✅ |
| `--sr-accent-text` `#E89B3D` | `--sr-bg-surface` `#1C1F24` | **7.23:1** | 4.5 body | ✅ |
| `--sr-accent` `#C86A0E` | `--sr-bg` `#14161A` | **4.76:1** | 3.0 graphic | ✅ |
| `--sr-accent` `#C86A0E` | `--sr-bg-surface` `#1C1F24` | **4.35:1** | 3.0 graphic | ✅ |
| `--sr-fg` `#E9EAEC` | `--sr-bg-callout` `#241A10` | **14.18:1** | 4.5 body | ✅ |
| `--sr-fg-muted` `#A0A5AD` | `--sr-bg-callout` `#241A10` | **6.89:1** | 4.5 body | ✅ |

Borders are decorative and sit around 1.3–1.4:1 against their ground by design — that is the point
of a hairline. Any border that carries meaning on its own (a selected state, a validation error)
must use `--sr-accent` or `--sr-fg`, not `--sr-border`.

### Where the accent is allowed

The ochre is a **gesture, not a surface**. It is the same shape everywhere: a short horizontal rule.
That single device is the entire visual identity, and it recurs as:

1. the rule under `sudo` in the wordmark;
2. the underline on links;
3. the marker on the active nav item;
4. the rule above a section heading;
5. the map pin fill;
6. the focus ring;
7. the bottom bar on YouTube thumbnails.

**Sanctioned uses beyond that: none.** No ochre buttons, no ochre panels, no ochre headings, no
ochre body text, no ochre backgrounds outside `--sr-bg-callout`. If more than roughly 3% of the
pixels on a page are ochre, it has stopped being an accent.

### Links

Links are `--sr-fg` with an ochre underline, not ochre text. This is deliberate on three counts: it
keeps the accent doing its one job, it makes the link underline literally the same mark as the
wordmark's underscore, and it sidesteps the accessibility trap of coloured link text (colour alone
must never be the only link signal).

```css
a {
  color: var(--sr-fg);
  text-decoration: underline;
  text-decoration-color: var(--sr-accent);
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.16em;
  text-decoration-skip-ink: none;   /* the underscore is a rule, not a swash */
}
a:hover { color: var(--sr-accent-text); text-decoration-thickness: 0.12em; }
a:focus-visible {
  outline: 2px solid var(--sr-focus);
  outline-offset: 2px;
  border-radius: 2px;
}
```

`text-decoration-skip-ink: none` matters here beyond aesthetics. Portuguese is dense in descenders
— `ç` alone appears in a large share of common words, plus `g`, `j`, `p`, `q` — and the default
skip-ink behaviour breaks the underline into fragments around every one of them. On a phrase like
`a próxima viagem` the line becomes four dashes. The rule has to stay unbroken, because it is not
decoration: it is the wordmark's underscore doing a second job.

### Map colours

The map is the one place the palette meets a third-party surface (OpenStreetMap raster tiles, which
are beige, green and pale blue). Two rules keep it inside the system:

```css
--sr-map-track:        var(--sr-fg);       /* GPX line: #1B1A18 */
--sr-map-track-casing: rgb(255 255 255 / 0.75);
--sr-map-pin-fill:     var(--sr-accent);   /* #C86A0E */
--sr-map-pin-stroke:   #1B1A18;
```

- **Track:** ink `#1B1A18`, 4 px, over a 8 px white casing at 75% opacity. Ink on the OSM base beige
  is **15.15:1** — it reads over every tile colour, including forest and water, without inventing a
  hue.
- **Pins:** ochre fill with a **mandatory 2 px ink stroke**. The fill alone is 3.31:1 over the OSM
  base beige (fine) but only 2.68:1 over forest green and 2.37:1 over water (fails). The ink stroke
  is what guarantees the pin separates from any tile, and it is also what makes the pin legible at
  12 px. It is not decoration — do not remove it.

**A second hue for the map was considered and rejected.** A deep blue track would have read
beautifully over OSM tiles and would have been colour-blind-safe against the ochre pins. It was
dropped because it would have made the palette three hues for the benefit of one page, and because
ink-versus-ochre separates by *luminance* (4.57:1), which is safe under every form of colour
vision deficiency — a stronger guarantee than a hue pair.

If a dark tile layer is ever added (CARTO `dark_all` is free and keyless, if a dark map is wanted),
flip `--sr-map-track` to `--sr-warm-50` and the casing to `rgb(0 0 0 / 0.6)`. The pins do not change.

---

## 6. Typography

### The recommendation

| Role | Family | Weights | Source |
| --- | --- | --- | --- |
| Headings, body, UI — everything | **IBM Plex Sans** | 400, 600 | Google Fonts |
| Data and the wordmark's context only | **IBM Plex Mono** | 400 | Google Fonts |

Three font files. That is the whole typographic system.

### Why IBM Plex Sans

- **It carries the tech seam without a costume.** Plex was commissioned by IBM as a corporate
  typeface for an engineering company and drawn as a superfamily with a mono sibling. The
  engineering association is *inherited*, not performed — which is exactly the register the brief
  asks for. Nothing about it says "hacker".
- **It is humanist, not geometric.** The flared stem terminals, the true italic, the slightly
  squared bowls and the single-storey `a` in italics give it warmth that Inter, Roboto and the
  geometric grotesques do not have. It does not feel like a dashboard.
- **Sans and Mono share a skeleton.** Switching to the mono for a stat block reads as a change of
  register within one voice, not as a second brand arriving. A Space Grotesk / JetBrains Mono pair
  would read as two decisions; Plex reads as one.
- **Portuguese is fully covered by the `latin` subset alone.** Every diacritic the site needs — ã õ
  ç á é í ó ú à â ê ô and their capitals — lives in U+00C0–U+00FF, inside Google's base `latin`
  range. No `latin-ext` request is needed, which keeps the font payload minimal. *(Verified against
  the live Google Fonts CSS2 response for both families.)*

**Faces deliberately rejected:** Space Grotesk and JetBrains Mono (the default "developer brand"
choice — too obviously the move); Inter (correct but characterless, and now the visual default of
the web); Bricolage Grotesque and Fraunces (too much personality for a "simple and clean" brief);
anything condensed or squared (reads as motorsport livery).

### The `<link>`

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400&family=IBM+Plex+Sans:wght@400;600&display=swap" />
```

IBM Plex is OFL-licensed. If the external dependency is ever unwanted — for privacy, for a strict
CSP, or simply to drop two DNS lookups from a static site — both families can be self-hosted from
`public/fonts/` with no change to any decision in this document. That is a hosting question, not a
brand one.

### Should mono be used at all?

The brief asks for the argument rather than the assumption, so here it is on both sides.

**Against.** Monospace is the single most over-used shortcut to "this person is technical", and it
is precisely the costume the brief bans. It costs a font file on a site whose entire argument is
lightness. At paragraph length it slows reading and makes prose look like a code listing — the wrong
frame for a riding diary. And there is a real risk of inverting the brief: he is a rider first, and
mono is loud enough to make the tech half dominate.

**For.** The palette carries *zero* tech signal by design — that was the governing decision in §5. If
the seam is not expressed typographically, it is not expressed at all, and the name degrades into a
private joke that new viewers never decode. Mono also does genuine, non-decorative work on this
specific site: route stats, distances, coordinates, durations and dates all benefit from tabular
figures that actually align in a column; proportional figures do not. And because Plex Mono is the
sibling of the body face, the cost of introducing it is unusually low.

**Verdict: yes, but capped by an enumerable rule.** Mono appears in exactly four places:

1. **Route stat blocks** — the `Distância / Duração / Região / Piso` labels and values.
2. **Video and route dates**, and the odometer figure where it appears.
3. **Coordinates**, wherever a place is given a lat/long.
4. **The 404 line.** Nothing else on that page.

Mono **never** appears in: running prose, headings, navigation, buttons, the tagline, or the
wordmark. **The wordmark in particular is set in Plex Sans, not Plex Mono** — `sudorider` in a
monospace face is a screenshot of a terminal, which is the failure mode this brand is defined
against.

The checkable version of the rule: **if monospace is more than about 2% of the visible glyphs on a
page, it has slipped into costume.** Fix it by removing mono, not by adding more sans.

### Type scale

Base is **17px** (`1.0625rem`), not 16px. Long-form route write-ups are the reading-heavy part of
this site and 17px measurably reduces effort at a 68ch measure without looking oversized in UI.

```css
:root {
  --sr-font-sans: 'IBM Plex Sans', ui-sans-serif, system-ui, -apple-system,
                  'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --sr-font-mono: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo,
                  Consolas, 'Liberation Mono', monospace;

  /* Type scale — see rationale below */
  --sr-text-2xs:  0.75rem;    /* 12px  legal, image credits */
  --sr-text-xs:   0.8125rem;  /* 13px  stat labels (mono), meta */
  --sr-text-sm:   0.9375rem;  /* 15px  nav, card meta, captions */
  --sr-text-md:   1.0625rem;  /* 17px  BODY */
  --sr-text-lg:   1.25rem;    /* 20px  lead paragraph, pull quote */
  --sr-text-xl:   1.5rem;     /* 24px  h3 */
  --sr-text-2xl:  1.875rem;   /* 30px  h2 */
  --sr-text-3xl:  2.375rem;   /* 38px  h1 */
  --sr-text-hero: clamp(2.375rem, 7vw, 3.75rem);  /* 38→60px, homepage wordmark only */

  --sr-leading-tight:   1.15;  /* hero, h1 */
  --sr-leading-snug:    1.25;  /* h2, h3 */
  --sr-leading-normal:  1.5;   /* UI, cards, nav */
  --sr-leading-relaxed: 1.65;  /* body prose */

  --sr-tracking-tight:  -0.02em;  /* hero, h1 at 600 */
  --sr-tracking-snug:   -0.015em; /* h2 */
  --sr-tracking-normal: 0;        /* body */
  --sr-tracking-wide:   0.06em;   /* uppercase mono stat labels */

  --sr-measure: 68ch;   /* max line length for prose */

  /* Spacing — 4px base, doubling with one intermediate step */
  --sr-space-1: 0.25rem;  --sr-space-2: 0.5rem;   --sr-space-3: 0.75rem;
  --sr-space-4: 1rem;     --sr-space-6: 1.5rem;   --sr-space-8: 2rem;
  --sr-space-12: 3rem;    --sr-space-16: 4rem;    --sr-space-24: 6rem;

  --sr-radius-sm: 2px;    /* inputs, chips */
  --sr-radius-md: 4px;    /* cards, video thumbnails */
  --sr-radius-lg: 8px;    /* the map container, the avatar square */
}
```

**Scale rationale.** The ratio is not constant, and that is intentional. A strict geometric scale
(1.25 throughout) forces a choice between small sizes that are indistinguishable from one another
and a heading size that is absurd on a phone. So the scale is **compressed at the bottom and
expands toward the top**: roughly 1.08→1.15→1.13→1.18 through the UI sizes, then 1.20→1.25→1.27
through the headings. The practical effect is that 13/15/17px stay clearly differentiated as
*roles* without wasting vertical rhythm, while 24/30/38px get enough separation to build hierarchy
without a fourth heading level.

Only one size uses `clamp()` — the homepage hero. Everything else is fixed, because fluid type
across an eight-step scale creates sizes that were never designed and undermines the point of
having a scale.

**Weights.** 400 for everything except headings and the wordmark, which are 600. There is no 500 and
no 700. If the jump from 400 to 600 ever feels harsh in the navigation, add 500 *for nav only* and
accept the fourth font file — do not solve it by weakening the headings.

**Headings.** All sentence case, never title case (Portuguese does not title-case headings) and never
uppercase. `h1` and `h2` get negative tracking; `h3` and below get none.

**Prose.** `max-width: var(--sr-measure)`, `line-height: var(--sr-leading-relaxed)`, paragraph
spacing `var(--sr-space-6)`, no first-line indent, no justification. Portuguese has long words and
justified text on a 68ch measure produces rivers.

---

## 7. Wordmark and mark

### The idea

**The underscore is the whole logo.**

An underscore is the character a programmer uses to join two words. It is also, drawn long and low
and in earth colour, a road. It is the one mark that holds both halves of this brand at once without
depicting a single motorcycle, wheel, wing, shield, mountain or compass rose — and without a
terminal prompt in sight.

It also does semantic work. Underlining `sudo` marks it as the *modifier*: the name reads as
"rider, elevated" rather than as a portmanteau the viewer has to unpick.

### Primary wordmark

```
sudorider
────
```

Specification:

| Property | Value |
| --- | --- |
| Text | `sudorider` — one word, all lowercase, no space |
| Face | IBM Plex Sans, weight **600** |
| Tracking | `-0.02em` |
| Colour | `--sr-fg` |
| Rule colour | `--sr-accent` `#C86A0E` |
| Rule span | exactly the four letters `s u d o` — from the left sidebearing of the `s` to the right sidebearing of the `o` |
| Rule thickness | `0.08em` of the wordmark's font-size (matches the stem width of the lowercase `d`) |
| Rule offset | top edge `0.16em` below the alphabetic baseline |
| Rule terminals | **square**. No radius. An underscore has flat ends; rounding it turns it into a highlighter stroke |

Because the rule is exactly an underline, **the web wordmark needs no SVG at all**:

```html
<span class="wordmark"><span class="wordmark__sudo">sudo</span>rider</span>
```

```css
.wordmark {
  font-family: var(--sr-font-sans);
  font-weight: 600;
  letter-spacing: var(--sr-tracking-tight);
  color: var(--sr-fg);
}
.wordmark__sudo {
  text-decoration: underline;
  text-decoration-color: var(--sr-accent);
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.16em;
  text-decoration-skip-ink: none;
}
```

That is the entire logo. It inherits the theme, scales to any size, needs no asset pipeline, and
weighs nothing. For print, YouTube art and the favicon, convert to outlines in SVG using the same
geometry.

Note for the implementer: keep `sudorider` a single unbroken text node for accessibility and for
copy-paste — do not put the two halves in separate block elements, and do not add `aria-label`
text that says anything other than `SudoRider`.

### Lockups

1. **Primary (horizontal).** As above. The default everywhere.
2. **Stacked.** `sudo` / `rider` on two lines, left-aligned, `line-height: 0.95`, rule under `sudo`
   as normal. For square or near-square crops only.
3. **Tagline lockup.** Wordmark with `trocar os ecrãs por um capacete` beneath it: IBM Plex Sans
   400, size `0.28×` the wordmark font-size, colour `--sr-fg-muted`, tracking 0, left edges aligned,
   gap `0.5×` the wordmark font-size. Site header, YouTube banner, and nowhere else.

### Clear space and minimum size

- **Clear space:** on all four sides, equal to the **x-height** of the wordmark at its rendered size.
  Nothing enters that box — not the nav, not an edge, not an image.
- **Minimum size:** `16px` font-size horizontal, `14px` stacked. Below `16px` the rule drops under
  1.3px and either disappears or snaps to a full pixel and looks heavy.

### The mark (favicon, avatar)

A monogram is needed where the full wordmark cannot fit: browser tab, YouTube avatar, social
profiles.

| Property | Value |
| --- | --- |
| Container | square, `--sr-cool-900` `#14161A` ground, corner radius **22%** of the side — or a full circle for YouTube and social avatars, same ground |
| Glyph | lowercase `s`, IBM Plex Sans 600, `--sr-warm-50` `#FBFAF8` |
| Glyph size | set so the `s` x-height is **40%** of the container height |
| Glyph position | horizontally centred; baseline at **58%** of container height |
| Rule | `--sr-accent` `#C86A0E` rectangle, **44%** of container width, **7%** of container height, horizontally centred, top edge at **70%** of container height, square corners |

Ink ground rather than a themed one, because avatars appear on surfaces this brand does not control
(YouTube light and dark, Instagram, a Google search result). A fixed dark ground is the only version
that is always correct.

**At 16px the `s` is marginal.** Do not downscale the SVG into `favicon.ico` — hand-draw the 16×16
and 32×32 bitmaps with the `s` stem thickened by a pixel and the rule set to a full 2px. This is
normal favicon practice and it is the difference between a recognisable mark and a smudge.

**Currently `public/favicon.svg` and `public/favicon.ico` are the Astro starter's logo.** Both need
replacing. Flagged, not changed — that is an implementation task.

### Wordmark don'ts

Do not: set the wordmark in monospace; capitalise it; add a space; stretch, skew, rotate or arc it;
outline it; add a drop shadow, bevel, gradient or glow; recolour the rule to anything but
`--sr-accent`; extend the rule under `rider` as well; round the rule's ends; place the wordmark on a
photograph without a solid backing; put a helmet, wheel, chevron or motorcycle silhouette next to it;
or lock it up with a slogan other than the tagline.

---

## 8. Imagery and thumbnails

**Every image is his.** Not a stylistic preference — the site's content is licensed CC BY-SA 4.0,
and stock or scraped imagery cannot be relicensed that way. It also happens to be the whole point: a
brand built on "the road was actually ridden" cannot illustrate itself with someone else's road.

**Photographic register:** available light, real weather, horizon roughly level, the bike in
context rather than posed. Wide enough to show where you are. Grade neutral — do not push a teal-and-
orange LUT to match the palette; ochre is a brand colour, not a colour cast.

### Thumbnails

The highest-leverage brand surface, because it is where the channel is seen most and where the site
is not.

- **The persistent element: a solid `--sr-accent` bar along the bottom edge of every thumbnail**,
  20px tall at 1280×720. That is the wordmark's rule, applied at channel scale. It costs nothing,
  survives down to the 168px-wide subscription feed as a visible ochre line, and makes a row of
  SudoRider videos identifiable before any text is read. Consistency here is worth more than any
  individual thumbnail.
- **Text:** IBM Plex Sans 600, **maximum four words**, `#FBFAF8`, with a hard dark shadow — never a
  stroke or outline. Positioned in the upper third, never over the bar.
- **No** red arrows, no circled faces, no shocked expressions, no numbered "TOP 5" badges, no
  before/after splits. He waited a year to post his first video; the thumbnails should not scream.

---

## 9. Applying it

| Surface | Brand notes |
| --- | --- |
| **Header** | Wordmark left, nav right. Active item gets an ochre rule beneath it — the same 0.08em rule, so the nav marker and the logo are visibly one system. No logo-plus-nav border. |
| **Início** | Wordmark at `--sr-text-hero`, tagline beneath, three sentences of introduction, the latest video, and links onward. Nothing else. Resist adding a hero image behind the wordmark. |
| **Sobre** | The only page that states the tech/road tension outright. Once, in his own words. |
| **Vídeos** | Cards on `--sr-bg-surface`, `--sr-radius-md`, title at `--sr-text-md`/600, date in mono at `--sr-text-xs` in `--sr-fg-muted`. |
| **Equipamento** | Plain list, not a grid of product shots. Each item: what it is, why it was bought, what is wrong with it. Disclosure line first. |
| **Mapa** | Map colours per §5. Pins are ochre dots with ink strokes — no custom helmet or motorcycle icons. Popup carries place name, date, and a link to the video. |
| **Rotas** | Stat block in mono at the top (`Distância · Duração · Região · Piso`), prose at `--sr-measure`, GPX download as a plain link, related video embedded at the end. |
| **Contacto** | Text and a link. If the form question in the README resolves to a third-party service, style it with the same tokens and do not let the vendor's chrome through. |
| **404** | The one joke. Ochre rule, the line, a link home. |
| **YouTube avatar** | The circular mark from §7. |
| **YouTube banner** | Tagline lockup on `--sr-cool-900`, safe-area-centred. No photograph behind it — banners crop unpredictably across devices and a photo will be cropped into nonsense. |
| **YouTube description boilerplate** | Standard block: one line of what the video is, the tagline, the site link, then hashtags. Existing tags `#motovlog #motovlogportugal #sudorider #cfmoto450mt` are good — keep them stable. |

---

## 10. What to avoid

### The tech costume — the highest risk to this brand

- Matrix green (`#00FF41`), electric cyan, neon on black.
- Glitch effects, scanlines, CRT curvature, chromatic aberration, "text scramble" animations.
- Blinking cursors as decoration, ASCII art headers, boxes drawn with `╔═╗`.
- Terminal-window chrome (three coloured dots, a title bar) framing non-code content.
- Monospace body copy, or a monospace wordmark.
- `$` or `>` prompts anywhere in the interface.
- Copy that turns the joke into a system: `> ./iniciar_viagem.sh`, `sudo make me a sandwich`,
  `git commit -m "nova rota"` as a heading. One shell reference per surface, maximum, and the 404
  already spends it.
- The one-line test: **would this still make sense to a viewer who has never used a terminal?** If
  the answer is no, cut it. Most of the audience are riders, not developers.

### Motorcycle-brand clichés

- Competition orange and black race livery. The ochre is close enough to KTM's territory that the
  temptation will exist — resist it. Ochre is earth; `#FF6600` is a sponsorship deck.
- "READY TO RACE"-energy copy, expedition-outfitter styling, globe-crossing imagery. He rides a 450
  around Portugal at weekends.
- Skulls, flames, tribal graphics, distressed grunge textures, chrome bevels, gothic blackletter,
  "ride or die", "live to ride".
- Speedometer, tyre-tread, chain-link, wing, shield or piston motifs in the mark.
- Anonymous stock riders. Anonymous stock roads.

### Voice failures

- Motivational-poster framing: "a vida começa onde acaba a zona de conforto". He explicitly did not
  frame it that way — "sem grandes pretensões" is the register.
- Guru posture. He has been filming for four days.
- Manufactured scale: "a comunidade", "milhares de quilómetros de conteúdo", "todas as semanas".
- Brazilian Portuguese leaking in (§4 table). This is the single most likely quality failure in any
  generated copy.
- Emoji in site chrome, navigation or headings. Sparingly in YouTube descriptions is fine — the
  existing 🏍️ is not a problem there.
- Translating the tagline into English on the site.

### Structural failures

- Newsletter popups, cookie walls, exit-intent modals, subscribe-gates on the routes. The routes
  are given away; that is the differentiator, and gating them destroys it.
- Undisclosed affiliate links on the gear page.
- Turning Dora into an illustrated mascot with a face.
- Client-side JavaScript beyond the map. The lightness is part of the brand, not just the stack.
- Adding a second accent colour "just for this one component".

---

## 11. Protection

Proportionate to a channel that is three weeks old. The point is to avoid cheap, irreversible
mistakes, not to build a trademark programme.

**Names and handles.** `sudorider.com` is held and the YouTube handle is `@SudoRider`. Claim the same
handle on Instagram, TikTok, and anywhere else riding content circulates in Portugal, even if unused
— handle squatting on a growing channel name is the common, avoidable loss. Register it identically:
`sudorider`, one word.

**Trademark.** `sudo` is a generic Unix command and cannot be owned; the protectable asset is
`SudoRider` as a composite for entertainment/broadcasting services (Nice class 41), potentially with
class 25 if merchandise ever appears. Filing at INPI (Portugal) or EUIPO is a real option once the
channel has meaningful reach and revenue; it is not worth the fee today. Meanwhile, use the name
consistently and publicly — consistent prior use is what any future claim would rest on. *(This is
brand guidance, not legal advice.)*

**Licence boundary — worth fixing before the site ships.** The repository dual-licenses code as MIT
and site content as CC BY-SA 4.0. Trademarks and brand marks are conventionally excluded from
Creative Commons grants, and CC's own licences state they do not grant trademark rights — but a
reader of `LICENSE-CONTENT.md` could reasonably conclude that the wordmark, the ochre mark and the
channel name are CC BY-SA content they may reuse and modify. **Recommendation:** add an explicit
exclusion line to `LICENSE-CONTENT.md` and to the README's licence section, to the effect that the
SudoRider name, wordmark and logo are excluded from the CC BY-SA grant and remain reserved. Flagged
here, not implemented.

**Attribution.** CC BY-SA means reuse is expected. Publish the attribution string you want back —
something like `Foto: SudoRider (sudorider.com), CC BY-SA 4.0` — on the site, so people reusing
material credit it in a form that sends traffic home.

**Consistency check.** Once a quarter, or before any push: wordmark rendered identically on site,
YouTube avatar and banner; the ochre bar present on every thumbnail; no pt-BR in any user-facing
string; no second accent colour introduced; `favicon` matching the mark; the tagline spelled and
cased identically everywhere.

---

## 12. Implementation to-dos flagged, not done

This document changed no code. The following need doing by whoever builds the site:

1. Replace `public/favicon.svg` and `public/favicon.ico` — they are still the Astro starter's logo.
   Hand-draw the 16px and 32px bitmaps per §7.
2. Add the token sheets from §5 and §6 to `src/styles/`.
3. Add the Google Fonts `<link>` from §6 to the shared layout, with both `preconnect` hints.
4. `src/pages/index.astro` currently has `lang="pt"`. Consider `lang="pt-PT"` — the distinction is
   what tells a screen reader to use European rather than Brazilian pronunciation, which for a
   wholly pt-PT site is worth the four characters.
5. Add the trademark exclusion line to `LICENSE-CONTENT.md` and the README licence section (§11).
6. Have Filipe read every Portuguese string in §4 before any of it ships.

---

## 13. Is it working?

Realistic measures for a channel with two videos. Not brand-equity tracking.

- **The one-sentence test.** After watching one video, can a stranger say what the channel is? The
  target answer is close to "a guy riding around Portugal who publishes the routes."
- **The handoff test.** Does moving from YouTube to `sudorider.com` feel like the same thing? Same
  mark, same ochre, same voice, no seam.
- **Routes actually used.** GPX downloads and `/rotas` time-on-page are the honest signal that the
  differentiator in §1 is real rather than asserted.
- **Consistency audit.** The §11 checklist, passing.
- **The negative test.** Nothing on the site or channel appears on the §10 avoid list.

---

**Prepared:** 20 August 2026
**Applies to:** `sudorider.com`, `@SudoRider`, and every surface either one touches
**Status:** specification — ready to implement, nothing implemented
