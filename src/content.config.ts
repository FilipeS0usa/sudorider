import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Route write-ups. Publishing one is a Markdown file here plus a GPX track in
 * `public/gpx/` — the route page, the routes index and the map all derive from
 * this collection.
 *
 * Frontmatter keys are English (project convention); the values are Portuguese.
 * Files beginning with `_` are templates and are deliberately not published.
 */
const rotas = defineCollection({
	loader: glob({ pattern: '**/[^_]*.md', base: './src/content/rotas' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		/** Free text, e.g. "Alentejo", "Serra da Estrela". */
		region: z.string(),
		distanceKm: z.number().positive(),
		/** Filename inside public/gpx/, e.g. "evora-monsaraz.gpx". */
		gpx: z.string().endsWith('.gpx'),
		/**
		 * YouTube video id(s) for the ride. A list when one ride was published as
		 * several videos ("Parte 1", "Parte 2") — every one of them then links
		 * back to this route, and a map pin for any of them offers it.
		 */
		video: z.union([z.string(), z.array(z.string())]).optional(),
		/** One or two sentences, used on cards and in meta description. */
		summary: z.string(),
		/** Hide from the index without deleting the file. */
		draft: z.boolean().default(false),
	}),
});

export const collections = { rotas };
