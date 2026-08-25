/**
 * Site-wide constants that appear on more than one page.
 *
 * `email` is the real address; change it here and it changes on /contacto and
 * in the footer.
 */
export const SITE = {
	name: 'SudoRider',
	tagline: 'trocar os ecrãs por um capacete',
	email: 'info@sudorider.com',
	youtube: 'https://www.youtube.com/@SudoRider',
	youtubeHandle: '@SudoRider',
	instagram: 'https://www.instagram.com/sudo.rider/',
	instagramHandle: '@sudo.rider',
	description:
		'SudoRider — motovlog de Filipe numa CFMOTO 450 MT, a Dora, por Portugal e por onde a estrada levar.',
	/**
	 * Where the riding normally happens. Map pins carry a country only when it
	 * differs from this, so a Portuguese pin stays "Évora" while a ride abroad
	 * reads "Sagres, Espanha" — the country earns its space by being news.
	 */
	paisPredefinido: 'Portugal',
} as const;
