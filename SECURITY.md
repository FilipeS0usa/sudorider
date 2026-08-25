# Security

Issues are disabled on this repository, so this file is the way to reach me.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting:
**[Report a vulnerability](https://github.com/FilipeS0usa/sudorider/security/advisories/new)**.
The report stays private between you and me until there is a fix. Please do not
open a public pull request that demonstrates the problem.

I'll acknowledge within a few days. This is a personal project, not a product
with an on-call rotation — expect a hobbyist's timeline, and say so in the
report if something is time-critical.

## Scope

This repository builds a static site published to GitHub Pages at
<https://sudorider.com>. There is no server, no database and no user account,
so the interesting surface is narrower than it looks:

- **In scope** — anything that could change what the site serves or how it is
  built: the GitHub Actions workflows, `scripts/sync-videos.mjs` and the data it
  writes, the build-time GPX parsing in `src/lib/gpx.ts`, and injection into the
  rendered pages via content or map data.
- **Out of scope** — the absence of security headers that GitHub Pages does not
  let a static site set, findings from automated scanners with no demonstrated
  impact, and anything on YouTube or OpenStreetMap rather than here.

The site holds no secrets and asks visitors for nothing. If you have found a way
to make it do either, that is very much in scope.

## Non-security problems

A broken map pin, a wrong route, a bad link: those are not security reports.
Say hello on the [YouTube channel](https://www.youtube.com/@SudoRider) instead.
