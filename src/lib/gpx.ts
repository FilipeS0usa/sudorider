/**
 * GPX reading, without a dependency.
 *
 * A GPX track is a list of `<trkpt lat="" lon="">` elements grouped into
 * `<trkseg>` blocks. That is small enough that a focused reader beats pulling
 * in an XML or GPX library: it is a couple of hundred lines, it has no DOM
 * dependency — so the same code runs in the browser and at build time in Node —
 * and it cannot drag a transitive dependency into a site whose whole point is
 * shipping almost no JavaScript.
 *
 * It is deliberately lenient. GPX in the wild comes out of phones, Garmins,
 * Strava exports and hand-edited files: attribute order varies, quotes may be
 * single, elements may be self-closing, and namespace prefixes (`gpx:trkpt`)
 * turn up. None of that changes where the coordinates are.
 *
 * Anything that is not a finite coordinate inside the valid range is dropped
 * rather than thrown, because one corrupt point in ten thousand should not
 * cost the reader the whole track.
 */

export interface GpxPoint {
	lat: number;
	lon: number;
	/** Metres, when the file carries `<ele>`. */
	ele?: number;
}

export interface GpxBounds {
	south: number;
	west: number;
	north: number;
	east: number;
}

export interface GpxTrack {
	/** `<trk><name>`, when present. */
	name: string | null;
	/** One entry per `<trkseg>`. Segments are pen-up gaps: never join them. */
	segments: GpxPoint[][];
	/** Every point, in file order, flattened. */
	points: GpxPoint[];
	bounds: GpxBounds | null;
	/** Great-circle length, summed inside segments only. */
	distanceKm: number;
}

const EARTH_RADIUS_M = 6_371_008.8;
const M_PER_DEG_LAT = 111_320;

/** Matches a track point, route point or waypoint, self-closing or not. */
const POINT_RE = /<(?:\w+:)?(?:trkpt|rtept|wpt)\b([^>]*)>/gi;
const SEGMENT_RE = /<(?:\w+:)?trkseg\b[^>]*>([\s\S]*?)<\/(?:\w+:)?trkseg\s*>/gi;
const ELEVATION_RE = /<(?:\w+:)?ele\b[^>]*>\s*([-+0-9.eE]+)\s*<\/(?:\w+:)?ele\s*>/i;

function attribute(source: string, name: string): number | null {
	const match = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i').exec(source);
	if (!match) return null;
	const value = Number.parseFloat(match[1] ?? match[2] ?? '');
	return Number.isFinite(value) ? value : null;
}

function decodeEntities(value: string): string {
	return value
		.replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(Number.parseInt(hex, 16)))
		.replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number.parseInt(dec, 10)))
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&amp;/g, '&');
}

/**
 * Read every point in a chunk of GPX. The chunk may be a whole document or a
 * single `<trkseg>` body; the point elements are identical either way.
 */
function readPoints(chunk: string): GpxPoint[] {
	const points: GpxPoint[] = [];
	POINT_RE.lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = POINT_RE.exec(chunk)) !== null) {
		const attributes = match[1] ?? '';
		const lat = attribute(attributes, 'lat');
		const lon = attribute(attributes, 'lon');
		if (lat === null || lon === null) continue;
		if (lat < -90 || lat > 90 || lon < -180 || lon > 180) continue;

		const point: GpxPoint = { lat, lon };

		// Elevation lives between this point's tag and the next one. Bound the
		// slice so a self-closing point cannot swallow the rest of the file.
		const tail = chunk.slice(POINT_RE.lastIndex, POINT_RE.lastIndex + 200);
		const ele = ELEVATION_RE.exec(tail);
		if (ele) {
			const metres = Number.parseFloat(ele[1] ?? '');
			if (Number.isFinite(metres)) point.ele = metres;
		}

		points.push(point);
	}

	return points;
}

export function parseGpx(xml: string): GpxTrack {
	// Comments first: a commented-out block of points is not part of the track.
	const source = xml.replace(/<!--[\s\S]*?-->/g, '');

	const segments: GpxPoint[][] = [];
	SEGMENT_RE.lastIndex = 0;
	let match: RegExpExecArray | null;
	while ((match = SEGMENT_RE.exec(source)) !== null) {
		const points = readPoints(match[1] ?? '');
		if (points.length > 0) segments.push(points);
	}

	// No `<trkseg>` at all: a route- or waypoint-only file. Read the document
	// as one segment rather than reporting an empty track.
	if (segments.length === 0) {
		const points = readPoints(source);
		if (points.length > 0) segments.push(points);
	}

	const nameMatch = /<(?:\w+:)?(?:trk|metadata|rte)\b[\s\S]*?<(?:\w+:)?name\b[^>]*>([\s\S]*?)<\/(?:\w+:)?name\s*>/i.exec(source);
	const name = nameMatch ? decodeEntities((nameMatch[1] ?? '').trim()) || null : null;

	const points = segments.flat();

	return {
		name,
		segments,
		points,
		bounds: boundsOf(points),
		distanceKm: trackLengthKm(segments),
	};
}

export function boundsOf(points: GpxPoint[]): GpxBounds | null {
	if (points.length === 0) return null;

	let south = Infinity;
	let west = Infinity;
	let north = -Infinity;
	let east = -Infinity;

	for (const point of points) {
		if (point.lat < south) south = point.lat;
		if (point.lat > north) north = point.lat;
		if (point.lon < west) west = point.lon;
		if (point.lon > east) east = point.lon;
	}

	return { south, west, north, east };
}

/** Great-circle distance between two points, in metres. */
export function distanceMetres(a: GpxPoint, b: GpxPoint): number {
	const toRad = Math.PI / 180;
	const dLat = (b.lat - a.lat) * toRad;
	const dLon = (b.lon - a.lon) * toRad;
	const lat1 = a.lat * toRad;
	const lat2 = b.lat * toRad;
	const h =
		Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
	return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Summed inside each segment. A gap between segments is not distance ridden. */
export function trackLengthKm(segments: GpxPoint[][]): number {
	let metres = 0;
	for (const segment of segments) {
		for (let i = 1; i < segment.length; i++) {
			const previous = segment[i - 1];
			const current = segment[i];
			if (previous && current) metres += distanceMetres(previous, current);
		}
	}
	return metres / 1000;
}

/**
 * Ramer–Douglas–Peucker, iterative so a 50k-point track cannot blow the stack.
 *
 * The tolerance is in metres and the projection is a local equirectangular one
 * — good to a fraction of a percent over the span of any one ride, and much
 * cheaper than a haversine per candidate point.
 */
export function simplifyTrack(points: GpxPoint[], toleranceMetres = 8): GpxPoint[] {
	const total = points.length;
	if (total < 3 || toleranceMetres <= 0) return points.slice();

	const first = points[0];
	if (!first) return points.slice();
	const metresPerDegLon = M_PER_DEG_LAT * Math.cos((first.lat * Math.PI) / 180);
	const x = (p: GpxPoint) => p.lon * metresPerDegLon;
	const y = (p: GpxPoint) => p.lat * M_PER_DEG_LAT;

	const keep = new Uint8Array(total);
	keep[0] = 1;
	keep[total - 1] = 1;

	const stack: number[] = [0, total - 1];
	while (stack.length > 0) {
		const end = stack.pop() as number;
		const start = stack.pop() as number;
		const a = points[start];
		const b = points[end];
		if (!a || !b) continue;

		const ax = x(a);
		const ay = y(a);
		const dx = x(b) - ax;
		const dy = y(b) - ay;
		const lengthSquared = dx * dx + dy * dy;

		let worst = -1;
		let worstDistance = toleranceMetres;

		for (let i = start + 1; i < end; i++) {
			const p = points[i];
			if (!p) continue;
			const px = x(p) - ax;
			const py = y(p) - ay;
			let distance: number;
			if (lengthSquared === 0) {
				distance = Math.hypot(px, py);
			} else {
				const t = Math.max(0, Math.min(1, (px * dx + py * dy) / lengthSquared));
				distance = Math.hypot(px - t * dx, py - t * dy);
			}
			if (distance > worstDistance) {
				worstDistance = distance;
				worst = i;
			}
		}

		if (worst !== -1) {
			keep[worst] = 1;
			stack.push(start, worst, worst, end);
		}
	}

	return points.filter((_, index) => keep[index] === 1);
}

/** Hard cap on point count, applied after simplification. */
export function decimate<T>(items: T[], max: number): T[] {
	if (max < 2 || items.length <= max) return items.slice();
	const step = (items.length - 1) / (max - 1);
	const out: T[] = [];
	for (let i = 0; i < max; i++) {
		const item = items[Math.round(i * step)];
		if (item) out.push(item);
	}
	return out;
}

export interface SketchOptions {
	width?: number;
	height?: number;
	/** Fraction of the shorter side kept clear on every edge. */
	padding?: number;
	/** Points kept across all segments together. */
	maxPoints?: number;
}

export interface Sketch {
	d: string;
	viewBox: string;
	width: number;
	height: number;
}

/**
 * A GPX track as an inline SVG path — no tiles, no JS, no network.
 *
 * Equirectangular with the track's mid-latitude as the standard parallel, so
 * a 128km ride is not stretched east–west, then fitted to the box at a single
 * uniform scale so the shape stays the shape.
 *
 * Intended for route cards (docs/design-system.md §5.2), which run this at
 * build time. Returns null for an empty track: the card is specified to drop
 * the sketch entirely rather than show a placeholder.
 */
export function trackToSvgPath(
	input: GpxPoint[][] | GpxPoint[],
	options: SketchOptions = {},
): Sketch | null {
	const { width = 300, height = 200, padding = 0.08, maxPoints = 200 } = options;

	const rawSegments: GpxPoint[][] = Array.isArray(input[0]) ? (input as GpxPoint[][]) : [input as GpxPoint[]];
	const segments = rawSegments.filter((segment) => segment.length > 0);
	const all = segments.flat();
	const bounds = boundsOf(all);
	if (!bounds || all.length < 2) return null;

	const midLat = (bounds.north + bounds.south) / 2;
	const cos = Math.cos((midLat * Math.PI) / 180);
	const projectX = (lon: number) => lon * cos;
	const projectY = (lat: number) => -lat;

	const spanX = Math.max(projectX(bounds.east) - projectX(bounds.west), 1e-9);
	const spanY = Math.max(projectY(bounds.south) - projectY(bounds.north), 1e-9);

	const inset = Math.min(width, height) * padding;
	const scale = Math.min((width - 2 * inset) / spanX, (height - 2 * inset) / spanY);
	const offsetX = (width - spanX * scale) / 2 - projectX(bounds.west) * scale;
	const offsetY = (height - spanY * scale) / 2 - projectY(bounds.north) * scale;

	// Simplify to roughly a pixel of the finished sketch, then hard-cap.
	const toleranceMetres = Math.max(1, ((spanY * M_PER_DEG_LAT) / Math.max(height, 1)) * 0.75);
	const budget = Math.max(2, Math.floor(maxPoints / segments.length));

	const round = (value: number) => Math.round(value * 100) / 100;
	const parts: string[] = [];

	for (const segment of segments) {
		const kept = decimate(simplifyTrack(segment, toleranceMetres), budget);
		if (kept.length < 2) continue;
		const coordinates = kept.map(
			(point) => `${round(projectX(point.lon) * scale + offsetX)} ${round(projectY(point.lat) * scale + offsetY)}`,
		);
		parts.push(`M${coordinates.join('L')}`);
	}

	if (parts.length === 0) return null;

	return { d: parts.join(''), viewBox: `0 0 ${width} ${height}`, width, height };
}
