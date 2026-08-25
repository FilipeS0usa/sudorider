import type { Local, Video } from './types';
import { videos } from './videos';
import { rotasPorVideo, type RotaLigada } from './rotas';
import { distanceMetres } from './gpx';
import { SITE } from '../components/site';

/**
 * Map pins, grouped by place.
 *
 * The map draws one pin per place and the "Locais" list under it describes the
 * same pins in text — it is the map's alternative for anyone without JavaScript
 * or using a screen reader (WCAG 1.1.1). That only holds if both are built from
 * the same grouping, so the policy lives here rather than being written twice:
 * what the key is, how whitespace and accents are treated, what order the rides
 * come out in, and where the pin sits.
 *
 * Callers get `{ local, video, rota }` and render it their own way — a popup
 * with thumbnails, or a list with links. Presentation is the part that is
 * legitimately different between them.
 */

/** One ride filmed at a place. */
export interface Volta {
	local: Local;
	/** Undefined until the daily sync has delivered this video into videos.json. */
	video: Video | undefined;
	/** The route write-up, when one points at this video. */
	rota: RotaLigada | undefined;
}

/** A pin. More than one ride can share it. */
export interface LocalAgrupado {
	/** Place name on its own, e.g. "Sagres". */
	name: string;
	/** Set only when the country is not SITE.paisPredefinido. */
	country?: string;
	/** What to show and announce: "Évora" at home, "Sagres, Espanha" abroad. */
	label: string;
	lat: number;
	lng: number;
	voltas: Volta[];
}

/**
 * Two entries share a pin when their names match after this.
 *
 * Accents are folded, so "Évora" and "Evora" group instead of producing two
 * pins thirty metres apart — which is the overlap this whole module exists to
 * prevent. Folding costs something, though: the pin has to be labelled with one
 * of the spellings, so a typo could end up as the label on a Portuguese site.
 * `agruparLocais` therefore warns when spellings disagree, rather than picking
 * one quietly.
 */
function dobrar(texto: string): string {
	return texto
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase();
}

/**
 * The key includes the country, so "Faro, Portugal" and a Faro somewhere else
 * are two pins rather than one pin averaged across a border. A pin with no
 * country counts as the default one, so leaving the field out at home does not
 * split a place in two.
 */
function chave(name: string, country: string): string {
	return `${dobrar(name)}|${dobrar(country)}`;
}

/** Sort key. Newest first; a ride whose video has not synced yet sorts to the top. */
function quando(volta: Volta): number {
	const iso = volta.video?.published;
	if (!iso) return Number.MAX_SAFE_INTEGER;
	const ms = Date.parse(iso);
	// Not localeCompare on the ISO string: that compares correctly only while
	// every timestamp shares one offset, and videos.json is generated from
	// YouTube's feed, which makes no such promise. MAX_SAFE_INTEGER rather than
	// Infinity, so two undated rides subtract to 0 instead of NaN.
	return Number.isNaN(ms) ? Number.MAX_SAFE_INTEGER : ms;
}

/**
 * Entries sharing a name that are further apart than this are two places, not
 * one — "Serra da Estrela" filmed in Seia and in Manteigas is 35 km. Generous
 * enough that two rides across one city never trip it.
 */
const DISPERSAO_MAX_KM = 20;

/*
 * The map page calls this, and then renders RideMap, which calls it again with
 * the same array. Without a cache the work — and every warning it prints —
 * happens twice per build of that page. Keyed on the array identity, so a
 * different set of pins is a different entry, and weak so nothing is pinned in
 * memory across a long dev session.
 */
const cache = new WeakMap<Local[], Promise<LocalAgrupado[]>>();

export function agruparLocais(locais: Local[]): Promise<LocalAgrupado[]> {
	const pronto = cache.get(locais);
	if (pronto) return pronto;
	const promessa = agrupar(locais);
	cache.set(locais, promessa);
	return promessa;
}

async function agrupar(locais: Local[]): Promise<LocalAgrupado[]> {
	const rotas = await rotasPorVideo();
	const porId = new Map(videos.map((video) => [video.id, video]));

	const grupos: LocalAgrupado[] = [];
	const porChave = new Map<string, LocalAgrupado>();
	/** First spelling seen for each key, to report disagreements. */
	const grafias = new Map<string, string>();

	for (const local of locais) {
		// A pin exists to link a place to a video (CLAUDE.md), so a pin without an
		// id is a bug and should stop the build rather than ship a dead popup.
		if (!local.video || !local.video.trim()) {
			throw new Error(
				`locais.json: the pin "${local.name}" has no video id. ` +
					'A pin exists to link a place to the video filmed there.',
			);
		}

		// Coordinates are cast, not parsed, when locais.json is imported, so a
		// quoted number or a typo reaches here as something that is not a usable
		// latitude. Stop now: further down it becomes NaN inside Leaflet's bounds
		// and the map silently fails to fit.
		if (!Number.isFinite(local.lat) || !Number.isFinite(local.lng)) {
			throw new Error(
				`locais.json: the pin "${local.name}" has coordinates that are not finite numbers ` +
					`(lat: ${JSON.stringify(local.lat)}, lng: ${JSON.stringify(local.lng)}).`,
			);
		}

		const nome = local.name.replace(/\s+/g, ' ').trim();
		const pais = (local.country ?? SITE.paisPredefinido).replace(/\s+/g, ' ').trim();
		const k = chave(nome, pais);

		const grafia = grafias.get(k);
		if (grafia === undefined) {
			grafias.set(k, nome);
		} else if (grafia !== nome) {
			console.warn(
				`[locais] "${grafia}" and "${nome}" group into one pin, which will be labelled ` +
					`"${grafia}". Spell them the same way in src/data/locais.json.`,
			);
		}

		const volta: Volta = {
			local,
			video: porId.get(local.video),
			rota: rotas.get(local.video),
		};

		const existente = porChave.get(k);
		if (existente) {
			existente.voltas.push(volta);
		} else {
			// The country is carried only when it is news; at home the label is
			// just the place, which is how every pin has read until now.
			const estrangeiro = dobrar(pais) !== dobrar(SITE.paisPredefinido);
			const grupo: LocalAgrupado = {
				name: nome,
				country: estrangeiro ? pais : undefined,
				label: estrangeiro ? `${nome}, ${pais}` : nome,
				lat: local.lat,
				lng: local.lng,
				voltas: [volta],
			};
			porChave.set(k, grupo);
			grupos.push(grupo);
		}
	}

	for (const grupo of grupos) {
		grupo.voltas.sort((a, b) => quando(b) - quando(a));

		// The pin takes the most recent ride's own coordinate rather than the mean
		// of the group. A mean of two real coordinates is not a real coordinate —
		// two places 30 km apart would put the pin in a field between them — and
		// it also matches the entry that shows first in the popup.
		const recente = grupo.voltas[0];
		if (recente) {
			grupo.lat = recente.local.lat;
			grupo.lng = recente.local.lng;
		}

		// Same name, far apart: two places, and one of them now has no pin.
		for (const volta of grupo.voltas) {
			const km =
				distanceMetres(
					{ lat: grupo.lat, lon: grupo.lng },
					{ lat: volta.local.lat, lon: volta.local.lng },
				) / 1000;
			if (km > DISPERSAO_MAX_KM) {
				throw new Error(
					`locais.json: the pins named "${grupo.label}" are ${km.toFixed(0)} km apart. ` +
						'Entries sharing a name share one pin, so one of these places would not get ' +
						'one. Give them distinct names, e.g. "Serra da Estrela (Seia)".',
				);
			}
		}

		// Two entries at one place pointing at the same video render the same ride
		// twice in the popup. A warning, not a throw: the page still works.
		const vistos = new Set<string>();
		for (const volta of grupo.voltas) {
			if (vistos.has(volta.local.video)) {
				console.warn(
					`[locais] "${grupo.label}" lists video "${volta.local.video}" more than once. ` +
						'The popup will show the same ride twice.',
				);
			}
			vistos.add(volta.local.video);
		}

		// videos.json is generated from the channel feed and may legitimately lag
		// behind a pin added the day a video goes out, so this is a warning: the
		// popup still links out, it just shows no title, date or thumbnail.
		for (const volta of grupo.voltas) {
			if (!volta.video) {
				console.warn(
					`[locais] pin "${grupo.label}" references video "${volta.local.video}", which is not ` +
						'in src/data/videos.json. Run `npm run sync:videos` if the video is newer.',
				);
			}
		}
	}

	return grupos;
}
