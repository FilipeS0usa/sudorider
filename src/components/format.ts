/**
 * Presentation-layer helpers for the generated video data.
 *
 * These live beside the components rather than in `src/lib/` because the data
 * file they read is generated and must not be reshaped: the cleanup belongs to
 * how a video is *presented*, not to what the sync writes (see CLAUDE.md).
 *
 * All dates are formatted from UTC parts. `toLocaleDateString('pt-PT', …)`
 * varies between ICU builds — it yields "16 de ago. de 2026" on some and
 * "16/08/2026" on others — so the two forms the design system asks for are
 * assembled by hand and are identical on every machine that builds the site.
 */

const MESES = [
	'janeiro',
	'fevereiro',
	'março',
	'abril',
	'maio',
	'junho',
	'julho',
	'agosto',
	'setembro',
	'outubro',
	'novembro',
	'dezembro',
];

const MESES_CURTOS = [
	'jan',
	'fev',
	'mar',
	'abr',
	'mai',
	'jun',
	'jul',
	'ago',
	'set',
	'out',
	'nov',
	'dez',
];

function parts(input: string | Date): { d: number; m: number; y: number } {
	const date = input instanceof Date ? input : new Date(input);
	return { d: date.getUTCDate(), m: date.getUTCMonth(), y: date.getUTCFullYear() };
}

/** Card and meta rows: `16 ago 2026`. */
export function dataCurta(input: string | Date): string {
	const { d, m, y } = parts(input);
	return `${d} ${MESES_CURTOS[m]} ${y}`;
}

/** Page headers and route pages: `16 de agosto de 2026` (month lowercase). */
export function dataLonga(input: string | Date): string {
	const { d, m, y } = parts(input);
	return `${d} de ${MESES[m]} de ${y}`;
}

/** Route card meta: `set 2026`. */
export function mesAno(input: string | Date): string {
	const { m, y } = parts(input);
	return `${MESES_CURTOS[m]} ${y}`;
}

/** `2026-08-16` — the machine-readable half of every `<time>`. */
export function dataISO(input: string | Date): string {
	const { d, m, y } = parts(input);
	return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/**
 * Strip a trailing run of **two or more** hashtags from a synced title.
 *
 * The threshold of two is deliberate: it kills the spam tail
 * `"Motovlog01 Short #cfmoto450mt #moto #motorcycle …"` → `"Motovlog01 Short"`
 * while preserving a meaningful single tag such as `"… | Motovlog #1"`.
 */
export function tituloLimpo(title: string): string {
	return title
		.replace(/(?:\s+#[^\s#]+){2,}\s*$/u, '')
		.replace(/\s+/g, ' ')
		.trim();
}

const LINHA_CREDITO = /^\s*\p{Extended_Pictographic}/u;
const LINHA_HASHTAGS = /^\s*(?:#[^\s#]+\s*)+$/u;

/**
 * First real paragraph of a description, for the stacked video rows.
 *
 * Blocks are separated by blank lines; descriptions are hard-wrapped, so the
 * single newlines inside a block collapse to spaces. Music credits
 * (`🎵 Música: …`) and hashtag-only lines are dropped, and if that empties a
 * block the next one is tried.
 */
export function paragrafoInicial(description: string): string {
	if (!description) return '';

	for (const bloco of description.split(/\n\s*\n/)) {
		const texto = bloco
			.split('\n')
			.filter((linha) => linha.trim() && !LINHA_CREDITO.test(linha) && !LINHA_HASHTAGS.test(linha))
			.join(' ')
			.replace(/\s+/g, ' ')
			.trim();

		if (texto) return texto;
	}

	return '';
}
