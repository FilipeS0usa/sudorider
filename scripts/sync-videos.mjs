#!/usr/bin/env node
/**
 * Refresh src/data/videos.json from the channel's public RSS feed.
 *
 * No API key: the feed is public and unauthenticated, unlike the YouTube Data
 * API which would need a key that a static site cannot keep secret.
 *
 * IMPORTANT — the feed only ever returns the most recent 15 entries. Newly
 * published videos therefore push older ones off the end of it. This script
 * MERGES into the existing file rather than replacing it, so the archive keeps
 * growing past 15. Replacing would silently delete the back catalogue.
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CHANNEL_ID = 'UCLFnLwTJIcE_dL1N7D5epaA';
const FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

/**
 * Consent cookie. From an EU IP, YouTube 302s every request to a consent
 * interstitial, which would make every Shorts probe look like "not a Short".
 * CI runners are usually outside the EU, but the cookie makes the result
 * independent of where this runs.
 */
const CONSENT = 'SOCS=CAESEwgDEgk0ODE3Nzk3MjQaAmVuIAEaBgiA_LyaBg';

/**
 * Is this a Short? The RSS feed carries no aspect ratio and every thumbnail is
 * 480x360, so the feed alone cannot tell — and a title heuristic fails on real
 * data (the channel's Short has "Short" in the title but no #shorts tag).
 *
 * youtube.com/shorts/<id> answers definitively: it serves 200 for a Short and
 * redirects to /watch for anything else.
 *
 * Returns undefined if the probe fails, so a network blip degrades to "unknown"
 * rather than mislabelling a video.
 */
async function probeIsShort(id) {
	try {
		const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
			redirect: 'manual',
			headers: { cookie: CONSENT, 'user-agent': 'Mozilla/5.0 (compatible; sudorider-site-sync)' },
		});
		if (res.status === 200) return true;
		if (res.status >= 300 && res.status < 400) return false;
		return undefined;
	} catch {
		return undefined;
	}
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(ROOT, 'src/data/videos.json');

/** Decode the handful of XML entities YouTube actually emits in titles. */
function decode(s) {
	return s
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&apos;/g, "'")
		.replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
		.replace(/&amp;/g, '&'); // last, so we don't double-decode
}

function tag(entry, name) {
	const m = entry.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
	return m ? decode(m[1].trim()) : '';
}

function parseFeed(xml) {
	return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, entry]) => {
		const id = tag(entry, 'yt:videoId');
		const thumb = entry.match(/<media:thumbnail[^>]*url="([^"]+)"/);
		return {
			id,
			title: tag(entry, 'title'),
			published: tag(entry, 'published'),
			url: `https://www.youtube.com/watch?v=${id}`,
			thumbnail: thumb ? thumb[1] : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
			description: tag(entry, 'media:description'),
		};
	});
}

async function readExisting() {
	try {
		return JSON.parse(await readFile(OUT, 'utf8'));
	} catch {
		return [];
	}
}

/**
 * A browser user-agent, and retries.
 *
 * Observed in CI: YouTube intermittently answers this feed with 404 from
 * datacenter IPs — the same request succeeds minutes later and always succeeds
 * from a home connection. A single attempt therefore fails the workflow at
 * random, and on a morning when a video *had* been published it would silently
 * skip that video until the next day's run.
 *
 * The retries are spread over a minute rather than fourteen seconds, because
 * the refusal is per-IP and outlasts a tight loop from the same runner. When
 * even that fails, the answer is not to fail the workflow — see below.
 */
const UA =
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

/** Null when the feed refused every attempt — the caller decides what that means. */
async function fetchFeed(attempts = 5) {
	let lastError = '';
	for (let attempt = 1; attempt <= attempts; attempt++) {
		try {
			const res = await fetch(FEED, { headers: { 'user-agent': UA, cookie: CONSENT } });
			if (res.ok) return await res.text();
			lastError = `${res.status} ${res.statusText}`;
		} catch (error) {
			lastError = error instanceof Error ? error.message : String(error);
		}
		if (attempt < attempts) {
			const waitMs = 5000 * 2 ** (attempt - 1); // 5s, 10s, 20s, 40s
			console.warn(`Feed attempt ${attempt}/${attempts} failed (${lastError}); retrying in ${waitMs / 1000}s.`);
			await new Promise((resolve) => setTimeout(resolve, waitMs));
		}
	}
	console.warn(`Feed request failed after ${attempts} attempts: ${lastError}`);
	return null;
}

const xml = await fetchFeed();

/*
 * An unreachable feed is not a broken build.
 *
 * YouTube refusing a datacenter IP is weather, not a bug: nothing in the repo
 * is wrong, nothing needs fixing, and the next scheduled run picks the video up
 * by itself. Exiting non-zero here mailed a red workflow every morning for
 * something that self-heals, which is the fastest way to teach someone to
 * ignore this workflow's mail — and then to miss a failure that does matter.
 *
 * So: warn, report nothing changed, exit clean. A genuine breakage still fails
 * loudly further down, where a feed that answers but no longer parses refuses
 * to overwrite the file. If videos stop appearing on the site for days, run
 * `npm run sync:videos` from a home connection: a 404 there means the channel
 * id or the feed URL really has changed.
 */
if (xml === null) {
	// A GitHub Actions warning annotation: visible in the run, no e-mail.
	console.log('::warning::Feed unavailable from this runner; leaving videos.json untouched.');
	if (process.env.GITHUB_OUTPUT) {
		await writeFile(process.env.GITHUB_OUTPUT, 'changed=false\n', { flag: 'a' });
	}
	process.exit(0);
}

const fetched = parseFeed(xml);
if (fetched.length === 0) {
	// A structural change to the feed would otherwise wipe the file.
	console.error('Feed parsed to zero entries — refusing to write.');
	process.exit(1);
}

const existing = await readExisting();
const byId = new Map(existing.map((v) => [v.id, v]));

for (const v of fetched) {
	const prev = byId.get(v.id);
	// A video's type never changes, so probe once and keep the answer.
	const isShort =
		typeof prev?.isShort === 'boolean' ? prev.isShort : await probeIsShort(v.id);
	byId.set(v.id, {
		...prev,
		...v,
		...(typeof isShort === 'boolean' ? { isShort } : {}),
	});
}

const merged = [...byId.values()].sort(
	(a, b) => new Date(b.published) - new Date(a.published),
);

const before = JSON.stringify(existing);
const after = JSON.stringify(merged, null, 2) + '\n';
const changed = before !== JSON.stringify(merged);

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, after);

console.log(
	`${fetched.length} in feed, ${merged.length} total (${merged.length - existing.length} new).`,
);
console.log(`changed=${changed}`);

// Consumed by the workflow to decide whether a deploy is needed.
if (process.env.GITHUB_OUTPUT) {
	await writeFile(process.env.GITHUB_OUTPUT, `changed=${changed}\n`, { flag: 'a' });
}
