//#region node_modules/.nitro/vite/services/ssr/assets/aura-DBGkNbkG.js
var DIM_KEYS = [
	"creative",
	"fandom",
	"nightlife",
	"cozy",
	"cerebral",
	"kinetic",
	"spiritual",
	"culinary"
];
var DIMENSIONS = {
	creative: {
		label: "Creative",
		hue: 18,
		hint: "Making things"
	},
	fandom: {
		label: "Fandom",
		hue: 318,
		hint: "Worlds you keep"
	},
	nightlife: {
		label: "Night",
		hue: 268,
		hint: "After dark"
	},
	cozy: {
		label: "Cozy",
		hue: 32,
		hint: "Soft rooms"
	},
	cerebral: {
		label: "Cerebral",
		hue: 208,
		hint: "Long arguments"
	},
	kinetic: {
		label: "Kinetic",
		hue: 152,
		hint: "Bodies in motion"
	},
	spiritual: {
		label: "Still",
		hue: 248,
		hint: "Quiet attention"
	},
	culinary: {
		label: "Table",
		hue: 8,
		hint: "Feeding people"
	}
};
var UNIVERSES = [
	{
		id: "anime",
		name: "Anime",
		description: "Late-night arcs, opening themes, and the way a still frame can undo you.",
		boost: {
			fandom: 18,
			creative: 10
		}
	},
	{
		id: "music-makers",
		name: "Music Makers",
		description: "People who finish the song. Bedroom producers, choir kids, warehouse DJs.",
		boost: {
			creative: 16,
			nightlife: 10
		}
	},
	{
		id: "black-creatives",
		name: "Black Creatives",
		description: "A room that already understands the reference. Work, lineage, joy.",
		boost: {
			creative: 14,
			spiritual: 10
		}
	},
	{
		id: "book-nook",
		name: "Book Nook",
		description: "Margins, rereads, and the person who asks what you are in the middle of.",
		boost: {
			cerebral: 16,
			cozy: 10
		}
	},
	{
		id: "night-shift",
		name: "Night Shift",
		description: "Last call, load-out, the walk home when the city finally exhales.",
		boost: {
			nightlife: 18,
			spiritual: 6
		}
	},
	{
		id: "food-lab",
		name: "Food Lab",
		description: "Recipes as love letters. The long table. Butter, chile, patience.",
		boost: {
			culinary: 18,
			cozy: 8
		}
	},
	{
		id: "trail-club",
		name: "Trail Club",
		description: "Dawn loops, dirty shoes, the kind of quiet you have to earn.",
		boost: {
			kinetic: 18,
			spiritual: 8
		}
	},
	{
		id: "game-worlds",
		name: "Game Worlds",
		description: "Bosses, lore dumps, the couch campaign that lasted a year.",
		boost: {
			fandom: 16,
			cerebral: 10
		}
	}
];
var NEIGHBORHOODS = [
	"Terrell",
	"Deep Ellum",
	"Bishop Arts",
	"Lower Greenville",
	"Oak Cliff",
	"Uptown",
	"Design District",
	"Lakewood",
	"White Rock",
	"Downtown Dallas",
	"Near Southside",
	"West 7th",
	"Magnolia",
	"Downtown Fort Worth"
];
var HOOD_GEO = {
	Terrell: {
		lat: 32.736,
		lng: -96.275,
		city: "Dallas"
	},
	"Deep Ellum": {
		lat: 32.7841,
		lng: -96.7847,
		city: "Dallas"
	},
	"Bishop Arts": {
		lat: 32.748,
		lng: -96.829,
		city: "Dallas"
	},
	"Lower Greenville": {
		lat: 32.824,
		lng: -96.77,
		city: "Dallas"
	},
	"Oak Cliff": {
		lat: 32.745,
		lng: -96.811,
		city: "Dallas"
	},
	Uptown: {
		lat: 32.801,
		lng: -96.8,
		city: "Dallas"
	},
	"Design District": {
		lat: 32.792,
		lng: -96.827,
		city: "Dallas"
	},
	Lakewood: {
		lat: 32.822,
		lng: -96.75,
		city: "Dallas"
	},
	"White Rock": {
		lat: 32.833,
		lng: -96.715,
		city: "Dallas"
	},
	"Downtown Dallas": {
		lat: 32.777,
		lng: -96.797,
		city: "Dallas"
	},
	"Near Southside": {
		lat: 32.735,
		lng: -97.327,
		city: "Fort Worth"
	},
	"West 7th": {
		lat: 32.751,
		lng: -97.358,
		city: "Fort Worth"
	},
	Magnolia: {
		lat: 32.735,
		lng: -97.343,
		city: "Fort Worth"
	},
	"Downtown Fort Worth": {
		lat: 32.755,
		lng: -97.331,
		city: "Fort Worth"
	}
};
var MAP_BOUNDS = {
	minLat: 32.68,
	maxLat: 32.88,
	minLng: -97.42,
	maxLng: -96.24
};
function projectHood(lat, lng) {
	const x = (lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng) * 100;
	const y = (1 - (lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
	return {
		x: Math.max(4, Math.min(96, x)),
		y: Math.max(6, Math.min(94, y))
	};
}
function hashSalt(value) {
	let h = 2166136261;
	for (let i = 0; i < value.length; i += 1) {
		h ^= value.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function neighborhoodPoint(neighborhood, salt) {
	const geo = HOOD_GEO[neighborhood] ?? HOOD_GEO["Deep Ellum"];
	const h = hashSalt(`${neighborhood}:${salt}`);
	const jitterLat = (h % 97 - 48) * 9e-4;
	const jitterLng = (h / 97 % 97 - 48) * .0011;
	return projectHood(geo.lat + jitterLat, geo.lng + jitterLng);
}
function neighborhoodFromPlace(place) {
	const hit = NEIGHBORHOODS.find((hood) => place.toLowerCase().includes(hood.toLowerCase()));
	if (hit) return hit;
	if (/texas theatre/i.test(place)) return "Oak Cliff";
	if (/white rock/i.test(place)) return "White Rock";
	return "Deep Ellum";
}
var INTENTIONS = [
	{
		id: "dating",
		label: "Dating"
	},
	{
		id: "friends",
		label: "Friends"
	},
	{
		id: "community",
		label: "Community"
	},
	{
		id: "something-slow",
		label: "Something slow"
	},
	{
		id: "not-sure",
		label: "Not sure yet"
	}
];
var RELATIONSHIP_STYLES = [
	{
		id: "exclusive",
		label: "Exclusive"
	},
	{
		id: "slow-burn",
		label: "Slow burn"
	},
	{
		id: "open",
		label: "Open"
	},
	{
		id: "figuring-it-out",
		label: "Figuring it out"
	}
];
var VISIBILITY = [
	{
		id: "open",
		label: "Open",
		hint: "Nearby people can find you"
	},
	{
		id: "mutuals",
		label: "Mutuals",
		hint: "Only people you already match with"
	},
	{
		id: "ghost",
		label: "Ghost",
		hint: "Hidden from discover"
	}
];
var VIBE_REACTIONS = [
	{
		id: "soft",
		label: "Soft"
	},
	{
		id: "electric",
		label: "Electric"
	},
	{
		id: "felt-that",
		label: "Felt that"
	},
	{
		id: "same-freq",
		label: "Same freq"
	},
	{
		id: "hold",
		label: "Hold"
	}
];
var REPORT_REASONS = [
	{
		id: "harassment",
		label: "Harassment or hate"
	},
	{
		id: "spam",
		label: "Spam or scam"
	},
	{
		id: "unsafe",
		label: "Felt unsafe"
	},
	{
		id: "other",
		label: "Something else"
	}
];
var FREQUENCY_QUESTIONS = [
	{
		id: "friday",
		prompt: "A good Friday looks like",
		a: {
			label: "A room with a sound system",
			add: {
				nightlife: 22,
				kinetic: 8
			}
		},
		b: {
			label: "A couch and something long",
			add: {
				cozy: 22,
				culinary: 8
			}
		}
	},
	{
		id: "loud",
		prompt: "You get loud about",
		a: {
			label: "A world someone built",
			add: {
				fandom: 22,
				cerebral: 8
			}
		},
		b: {
			label: "A thing you made with your hands",
			add: {
				creative: 22,
				kinetic: 8
			}
		}
	},
	{
		id: "recover",
		prompt: "How you come back to yourself",
		a: {
			label: "Move until the static clears",
			add: {
				kinetic: 22,
				nightlife: 6
			}
		},
		b: {
			label: "Feed people, or be fed",
			add: {
				culinary: 22,
				cozy: 10
			}
		}
	},
	{
		id: "trust",
		prompt: "You trust someone who can",
		a: {
			label: "Hold a silence with you",
			add: {
				spiritual: 22,
				cozy: 8
			}
		},
		b: {
			label: "Argue an idea to the bone",
			add: {
				cerebral: 22,
				creative: 8
			}
		}
	}
];
var EMOJI_MARKS = [
	"✦",
	"◎",
	"△",
	"◇",
	"✶",
	"○",
	"◻",
	"☽"
];
function emptyDimensions(fill = 42) {
	return {
		creative: fill,
		fandom: fill,
		nightlife: fill,
		cozy: fill,
		cerebral: fill,
		kinetic: fill,
		spiritual: fill,
		culinary: fill
	};
}
function clampDim(n) {
	return Math.max(8, Math.min(96, Math.round(n)));
}
function applyBoost(dims, boost) {
	const next = { ...dims };
	for (const key of DIM_KEYS) {
		const add = boost[key];
		if (add) next[key] = clampDim(next[key] + add);
	}
	return next;
}
function rankDimensions(dims) {
	const ranked = [...DIM_KEYS].sort((a, b) => dims[b] - dims[a]);
	return {
		primary: ranked[0],
		secondary: ranked[1]
	};
}
function computeDna(universes, answers) {
	let dims = emptyDimensions(40);
	for (const id of universes) {
		const u = UNIVERSES.find((x) => x.id === id);
		if (u) dims = applyBoost(dims, u.boost);
	}
	for (const q of FREQUENCY_QUESTIONS) {
		const pick = answers[q.id];
		if (pick === "a") dims = applyBoost(dims, q.a.add);
		if (pick === "b") dims = applyBoost(dims, q.b.add);
	}
	const { primary, secondary } = rankDimensions(dims);
	const top = (dims[primary] + dims[secondary]) / 200;
	return {
		dimensions: dims,
		primary,
		secondary,
		saturation: Number((.28 + top * .42).toFixed(2)),
		brightness: Number((.58 + (dims.cozy + dims.spiritual) / 500).toFixed(2))
	};
}
function vibeColor(input) {
	const p = DIMENSIONS[input.primary];
	const s = DIMENSIONS[input.secondary];
	let h = p.hue * .68 + s.hue * .32;
	if (Math.abs(p.hue - s.hue) > 180) h = p.hue;
	const sat = Math.round(36 + input.saturation * 44);
	const l = Math.round(44 + input.brightness * 20);
	return {
		h: Math.round(h),
		s: sat,
		l,
		css: `hsl(${Math.round(h)} ${sat}% ${l}%)`,
		glow: `hsl(${Math.round(h)} ${sat}% ${l}% / 0.42)`,
		soft: `hsl(${Math.round(h)} ${Math.max(18, sat - 16)}% ${Math.min(78, l + 18)}%)`
	};
}
function compatibilityScore(a, b, sharedUniverses, sameHood) {
	let dot = 0;
	let na = 0;
	let nb = 0;
	for (const key of DIM_KEYS) {
		const x = a[key] / 100;
		const y = b[key] / 100;
		dot += x * y;
		na += x * x;
		nb += y * y;
	}
	const score = dot / (Math.sqrt(na) * Math.sqrt(nb) || 1) * 80 + sharedUniverses * 4.5 + (sameHood ? 5 : 0);
	return Math.round(Math.max(26, Math.min(98, score)));
}
function sharedDimensions(a, b) {
	return DIM_KEYS.filter((key) => a[key] >= 58 && b[key] >= 58 && Math.abs(a[key] - b[key]) <= 24);
}
function styleLabel(id) {
	return RELATIONSHIP_STYLES.find((s) => s.id === id)?.label ?? id;
}
function intentionLabel(id) {
	return INTENTIONS.find((s) => s.id === id)?.label ?? id;
}
function universeName(id) {
	return UNIVERSES.find((u) => u.id === id)?.name ?? id;
}
//#endregion
export { vibeColor as S, projectHood as _, INTENTIONS as a, styleLabel as b, REPORT_REASONS as c, VISIBILITY as d, compatibilityScore as f, neighborhoodPoint as g, neighborhoodFromPlace as h, HOOD_GEO as i, UNIVERSES as l, intentionLabel as m, EMOJI_MARKS as n, NEIGHBORHOODS as o, computeDna as p, FREQUENCY_QUESTIONS as r, RELATIONSHIP_STYLES as s, DIMENSIONS as t, VIBE_REACTIONS as u, rankDimensions as v, universeName as x, sharedDimensions as y };
