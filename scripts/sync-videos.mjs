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

const res = await fetch(FEED, { headers: { 'user-agent': 'sudorider-site-sync' } });
if (!res.ok) {
	console.error(`Feed request failed: ${res.status} ${res.statusText}`);
	process.exit(1);
}

const fetched = parseFeed(await res.text());
if (fetched.length === 0) {
	// A structural change to the feed would otherwise wipe the file.
	console.error('Feed parsed to zero entries — refusing to write.');
	process.exit(1);
}

const existing = await readExisting();
const byId = new Map(existing.map((v) => [v.id, v]));
for (const v of fetched) byId.set(v.id, { ...byId.get(v.id), ...v });

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
