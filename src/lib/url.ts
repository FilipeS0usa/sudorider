/**
 * Build a URL that respects the configured `base`.
 *
 * The site runs on the custom domain sudorider.com, served from the root, so
 * `base` is empty and this is currently a passthrough.
 *
 * It is kept deliberately. If the site ever falls back to the GitHub Pages
 * project path (github.io/sudorider) — while the domain is being set up, or if
 * it lapses — every path here starts resolving correctly again with a one-line
 * config change, instead of needing a hunt through every template.
 *
 * `import.meta.env.BASE_URL` is not guaranteed to carry a trailing slash, so
 * normalise both sides rather than concatenating and hoping.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function withBase(path: string): string {
	return `${BASE}/${path.replace(/^\/+/, '')}`;
}
