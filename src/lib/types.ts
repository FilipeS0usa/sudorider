/** A pin on the rides map. */
export interface Local {
	/** Place name as shown in the popup, e.g. "Évora". */
	name: string;
	lat: number;
	lng: number;
	/** YouTube video id filmed here. A pin exists to link a place to a video. */
	video: string;
	/** Optional one-liner for the popup. */
	note?: string;
}

/** An item on the gear page. */
export interface Equipamento {
	name: string;
	/** e.g. "Câmara", "Suporte", "Capacete", "Comunicação", "Bagagem". */
	category: string;
	/** Why this one — the useful part, not a spec sheet. */
	note: string;
	/** Optional manufacturer link. */
	url?: string;
}
