---
# Copy this file to <slug>.md — the filename becomes the URL (/rotas/<slug>).
# Files starting with _ are never published.

# Quote the title if it contains a "#". In YAML a space before # starts a
# comment, so `title: Volta a Évora | Motovlog #2` silently becomes
# "Volta a Évora | Motovlog" with no error anywhere.
title: 'Nome da rota'

# The day of the ride, not the day the video goes out.
date: 2026-08-20

region: Alentejo

# Should match the GPX. src/lib/gpx.ts measures the file if you need the number:
# the map's aria-label is generated from the track, this value is what the page
# and the cards show, and nothing warns you when they disagree.
distanceKm: 120

# Filename inside public/gpx/.
gpx: nome-da-rota.gpx

# YouTube id of the ride's video. Leave empty until the video is out. Filling it
# in also makes any map pin for that video offer a link to this route.
#
# A list when one ride was published as several videos — every id links back
# here, so a pin for "Parte 2" offers the route exactly as one for "Parte 1":
#   video: [abc123XYZ_-, def456UVW_-]
video: ''

# One or two sentences. Used on the cards and as the meta description.
summary: Uma ou duas frases sobre a rota.

# true keeps it out of the index, the map and the build.
draft: true
---

Texto sobre a rota.
