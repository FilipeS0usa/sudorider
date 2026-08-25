import { getCollection } from 'astro:content';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseGpx, simplifyTrack, decimate, trackLengthKm } from './gpx';

/**
 * The route write-ups, indexed by the video they belong to.
 *
 * A route already carries the YouTube id in its frontmatter, so the link from
 * a map pin to its route is derived rather than stored a second time in
 * locais.json — one id to keep correct instead of two.
 *
 * Drafts are excluded: linking to a page that getStaticPaths does not emit
 * would ship a 404 from the map.
 */

/** What a pin needs to link to a route. */
/**
 * The video ids a route belongs to, as a list, whatever shape the frontmatter
 * used. One ride can be published as several videos, so `video:` accepts a
 * single id or an array — normalised here so nothing downstream has to care,
 * and so the two shapes can never be read differently in two places.
 */
export function idsDeVideo(video: string | string[] | undefined): string[] {
	if (!video) return [];
	return (Array.isArray(video) ? video : [video]).map((id) => id.trim()).filter(Boolean);
}

export interface RotaLigada {
	/** Route slug, i.e. the collection entry id — the `/rotas/<slug>` segment. */
	slug: string;
	title: string;
	distanceKm: number;
}

/**
 * Video id → route. Built once per page that needs it; the collection is read
 * at build time, so this costs nothing in the browser.
 *
 * Two published routes pointing at the same video is an authoring mistake with
 * no right answer, so the first one wins and the second is reported. It stays
 * a warning rather than a throw: a wrong link on one pin should not take the
 * whole site down.
 */
export async function rotasPorVideo(): Promise<Map<string, RotaLigada>> {
	// Newest first, matching every other route listing on the site. Also makes
	// the "first one wins" tie-break below deterministic: getCollection's order
	// is not contractual, so without this *which* route won could change with an
	// Astro upgrade.
	const rotas = (await getCollection('rotas', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);
	const porVideo = new Map<string, RotaLigada>();

	for (const rota of rotas) {
		// Every id the route claims points back at the same route, so a pin for
		// "Parte 2" offers the write-up exactly as the one for "Parte 1" does.
		for (const videoId of idsDeVideo(rota.data.video)) {
			const existente = porVideo.get(videoId);
			if (existente) {
				console.warn(
					`[rotas] "${rota.id}" and "${existente.slug}" both point at video "${videoId}". ` +
						`Keeping "${existente.slug}" — give one of them a different video id.`,
				);
				continue;
			}

			porVideo.set(videoId, {
				slug: rota.id,
				title: rota.data.title,
				distanceKm: rota.data.distanceKm,
			});
		}
	}

	return porVideo;
}

/**
 * Route tracks for the overview map.
 *
 * The `/mapa` page draws every published route as a line, so a linear ride —
 * Sagres to Porto Covo — reads as the road it was rather than as a dot at one
 * end. The same GPX files the route pages use, simplified far harder: at
 * national zoom a point every 100 m is already finer than a pixel, and the
 * whole point is that this is cheap enough to ship on a page that also carries
 * pins. Measured at ~3KB for a 130km route.
 */
/**
 * Metres. Overview only — route pages parse the same file at 10m.
 *
 * Chosen from point *spacing*, not from the deviation error: what makes a
 * simplified line look crude is the gap between vertices, and at 100m this
 * route's points land 23px apart at zoom 12 — which is exactly where the map
 * opens — so the ride read as a polygon. 40m puts them ~16px apart for about
 * 45% more bytes, and MAX_PONTOS still bounds the worst case for a long route.
 */
const TOLERANCIA_VISTA_GERAL = 40;
/**
 * Hard cap per route, after simplification — shared out across that route's
 * segments, the way trackToSvgPath() does it. Applying it per segment instead
 * looks the same until a GPX arrives with recording pauses in it: twelve
 * segments then buy twelve times the budget, and a single route lands at ~17KB
 * rather than the ~3KB this is sized for.
 */
const MAX_PONTOS = 400;

/**
 * Resolve a frontmatter GPX filename to a path inside public/gpx, or null if
 * the name is not one.
 *
 * Frontmatter is authored by hand, so the filename is untrusted: take the
 * basename only. Without this, `gpx: "../../../etc/passwd"` reads outside
 * public/gpx at build time. Shared with RouteMap.astro so there is one place
 * where this is got right.
 */
export function caminhoGpx(nome: string): string | null {
	// [\s\S] rather than `.` — `.` does not match a newline, so a name like
	// "foo\n/../../../etc/passwd.gpx" matched nothing at all, the basename was
	// never taken, and resolve() then honoured every "..". Verified: that input
	// escaped public/gpx before this changed.
	const base = nome.replace(/^[\s\S]*[\\/]/, '');
	// An explicit charset instead of endsWith: whatever survives the strip has to
	// look like a filename, not merely end in the right four characters.
	if (!/^[\w.-]+\.gpx$/.test(base)) return null;
	return resolve(process.cwd(), 'public/gpx', base);
}

export interface TracadoRota {
	slug: string;
	title: string;
	distanceKm: number;
	/** [lat, lng] pairs, one array per GPX segment. Segments are pen-up gaps. */
	segments: [number, number][][];
}

export async function tracadosDasRotas(): Promise<TracadoRota[]> {
	// Newest first, matching every other route listing on the site. Also makes
	// the "first one wins" tie-break below deterministic: getCollection's order
	// is not contractual, so without this *which* route won could change with an
	// Astro upgrade.
	const rotas = (await getCollection('rotas', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
	);
	const tracados: TracadoRota[] = [];

	for (const rota of rotas) {
		const caminho = caminhoGpx(rota.data.gpx);
		if (!caminho) {
			console.warn(`[rotas] "${rota.id}" has an invalid gpx filename: ${rota.data.gpx}`);
			continue;
		}

		let xml: string;
		try {
			xml = readFileSync(caminho, 'utf8');
		} catch {
			// The route page already degrades to "Traçado indisponível." for this;
			// the overview map simply draws one line fewer.
			console.warn(`[rotas] "${rota.id}" references ${rota.data.gpx}, which is not in public/gpx.`);
			continue;
		}

		const track = parseGpx(xml);

		// Share the budget by length, not equally. A GPX with one 700km leg and
		// eleven 200m pause artefacts would otherwise give the leg the same 33
		// points as each artefact.
		const totalPontos = track.segments.reduce((n, seg) => n + seg.length, 0) || 1;

		const segments = track.segments
			.map((segment) => {
				const orcamento = Math.max(2, Math.round((MAX_PONTOS * segment.length) / totalPontos));

				/*
				 * Reach the budget by coarsening the tolerance, and keep decimate as a
				 * net rather than the mechanism. Ramer–Douglas–Peucker keeps a point
				 * *because* it is a corner; decimate samples by index, so on a long
				 * route it throws away precisely those and leaves the coast and the
				 * hairpins visibly straightened.
				 */
				let tolerancia = TOLERANCIA_VISTA_GERAL;
				let pontos = simplifyTrack(segment, tolerancia);
				while (pontos.length > orcamento && tolerancia < 5_000) {
					tolerancia *= 2;
					pontos = simplifyTrack(segment, tolerancia);
				}
				return decimate(pontos, orcamento);
			})
			.filter((segment) => segment.length >= 2)
			// Five decimals is ~1.1m, two orders of magnitude finer than a 100m
			// simplification and a tenth of the attribute's weight for free.
			.map((segment) =>
				segment.map((p): [number, number] => [
					Math.round(p.lat * 1e5) / 1e5,
					Math.round(p.lon * 1e5) / 1e5,
				]),
			);

		// distanceKm is authored by hand and nothing else checks it. The file is
		// already parsed here, so the check is free — and a route whose stated
		// distance is wrong is wrong on the cards, the route page and this map.
		const medida = trackLengthKm(track.segments);
		const desvio = Math.abs(medida - rota.data.distanceKm);
		if (medida > 0 && desvio > Math.max(1, medida * 0.05)) {
			console.warn(
				`[rotas] "${rota.id}" says distanceKm: ${rota.data.distanceKm}, but ${rota.data.gpx} ` +
					`measures ${medida.toFixed(1)} km.`,
			);
		}

		if (segments.length > 0) {
			tracados.push({
				slug: rota.id,
				title: rota.data.title,
				distanceKm: rota.data.distanceKm,
				segments,
			});
		}
	}

	return tracados;
}
