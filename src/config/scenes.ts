// ─────────────────────────────────────────────────────────────────────────────
// SCENES
// Each phase has 3+ scenes. Every scene ships as a code-drawn, animated
// illustration (src/components/scenes/compositions.tsx). When you generate an
// AI painting for a scene (see creatives/PROMPTS.md), drop it in creatives/raw
// named after the scene id and run `npm run scenes`. The painting then replaces
// the drawing, and the motion overlays (smoke, flames) are placed using the
// hotspots below.
//
// Hotspots are percentages of the frame: [x%, y%] from the top-left.
// `d` = desktop 16:9 image, `m` = mobile 9:16 image.
// ─────────────────────────────────────────────────────────────────────────────
import type { PhaseId, Slot } from "./tithis";

export type Pct = [number, number];
export type Overlay = "shiuli" | "petals" | "sindoor" | "embers";

export interface Hotspots {
  smoke?: Pct[];
  flame?: Pct[];
}

export interface SceneDef {
  id: string;
  phase: PhaseId;
  /** Time of day this scene belongs to. It shows first during that slot. */
  slot: Slot;
  bn: string;
  en: string;
  overlays: Overlay[];
  hotspots: { d: Hotspots; m: Hotspots };
}

export const SCENES: SceneDef[] = [
  // ── AGOMONI / PANCHAMI ──
  {
    id: "agomoni-kash",
    phase: "agomoni",
    slot: "dupur",
    bn: "কাশবন",
    en: "Kash fields, a train heading home",
    overlays: ["shiuli"],
    hotspots: { d: {}, m: {} },
  },
  {
    id: "agomoni-kumortuli",
    phase: "agomoni",
    slot: "sondhe",
    bn: "কুমোরটুলি",
    en: "Kumortuli at dusk",
    overlays: [],
    hotspots: { d: { smoke: [[86, 66]] }, m: { smoke: [[80, 55]] } },
  },
  {
    id: "agomoni-para",
    phase: "agomoni",
    slot: "raat",
    bn: "পাড়ার প্যান্ডেল তৈরি",
    en: "The para pandal going up",
    overlays: ["shiuli"],
    hotspots: { d: {}, m: {} },
  },

  // ── SHASHTHI ──
  {
    id: "shashthi-bodhon",
    phase: "shashthi",
    slot: "sondhe",
    bn: "বেলতলায় বোধন",
    en: "Bodhon under the bel tree",
    overlays: ["shiuli"],
    hotspots: { d: { smoke: [[44, 69]], flame: [[36, 70], [40, 70], [48, 70]] }, m: { smoke: [[56, 60]], flame: [[40, 61], [64, 61]] } },
  },
  {
    id: "shashthi-dhaki",
    phase: "shashthi",
    slot: "dupur",
    bn: "ঢাকিরা এসে গেছে",
    en: "The dhakis arrive",
    overlays: [],
    hotspots: { d: {}, m: {} },
  },
  {
    id: "shashthi-pandal",
    phase: "shashthi",
    slot: "raat",
    bn: "প্যান্ডেলে প্রথম আলো",
    en: "Opening night at the pandal",
    overlays: ["embers"],
    hotspots: { d: {}, m: {} },
  },

  // ── SAPTAMI ──
  {
    id: "saptami-kolabou",
    phase: "saptami",
    slot: "bhor",
    bn: "কলাবউ স্নান",
    en: "Kola bou snan at the ghat",
    overlays: [],
    hotspots: { d: { smoke: [[30, 65]] }, m: { smoke: [[28, 58]] } },
  },
  {
    id: "saptami-nabapatrika",
    phase: "saptami",
    slot: "dupur",
    bn: "নবপত্রিকা",
    en: "Nabapatrika beside Ganesh",
    overlays: ["petals"],
    hotspots: { d: { smoke: [[18, 68]], flame: [[60, 69], [64, 69]] }, m: { smoke: [[14, 59]], flame: [[66, 60]] } },
  },
  {
    id: "saptami-aarti",
    phase: "saptami",
    slot: "raat",
    bn: "সন্ধ্যারতি",
    en: "Saptami aarti",
    overlays: ["embers"],
    hotspots: { d: { smoke: [[63, 68]] }, m: { smoke: [[70, 59]] } },
  },

  // ── ASHTAMI ──
  {
    id: "ashtami-anjali",
    phase: "ashtami",
    slot: "bhor",
    bn: "অষ্টমীর অঞ্জলি",
    en: "Ashtami pushpanjali",
    overlays: ["petals"],
    hotspots: { d: {}, m: {} },
  },
  {
    id: "ashtami-kumari",
    phase: "ashtami",
    slot: "dupur",
    bn: "কুমারী পুজো",
    en: "Kumari pujo",
    overlays: ["petals"],
    hotspots: { d: { smoke: [[30, 68]] }, m: { smoke: [[20, 59]] } },
  },
  {
    id: "ashtami-sandhi",
    phase: "ashtami",
    slot: "dupur",
    bn: "সন্ধিপুজো",
    en: "Sandhi pujo: 108 lamps, 108 lotuses",
    overlays: ["embers"],
    hotspots: { d: { smoke: [[12, 68], [88, 68]] }, m: { smoke: [[10, 59], [90, 59]] } },
  },
  {
    id: "ashtami-bhog",
    phase: "ashtami",
    slot: "dupur",
    bn: "ভোগ",
    en: "Bhog on sal leaves",
    overlays: [],
    hotspots: { d: {}, m: {} },
  },

  // ── NAVAMI ──
  {
    id: "navami-dhunuchi",
    phase: "navami",
    slot: "raat",
    bn: "ধুনুচি নাচ",
    en: "Dhunuchi naach",
    overlays: ["embers"],
    hotspots: { d: { smoke: [[33, 50], [52, 47], [70, 50]] }, m: { smoke: [[30, 46], [70, 47]] } },
  },
  {
    id: "navami-aarti",
    phase: "navami",
    slot: "sondhe",
    bn: "নবমীর সন্ধ্যারতি",
    en: "Navami evening aarti",
    overlays: ["embers"],
    hotspots: { d: { smoke: [[64, 68]] }, m: { smoke: [[70, 59]] } },
  },
  {
    id: "navami-mela",
    phase: "navami",
    slot: "raat",
    bn: "শেষ রাতের মেলা",
    en: "The last night at the mela",
    overlays: [],
    hotspots: { d: {}, m: {} },
  },

  // ── DASHAMI ──
  {
    id: "dashami-boron",
    phase: "dashami",
    slot: "bhor",
    bn: "দেবীবরণ",
    en: "Debi boron",
    overlays: ["petals"],
    hotspots: { d: { smoke: [[86, 68]] }, m: { smoke: [[86, 59]] } },
  },
  {
    id: "dashami-sindoor",
    phase: "dashami",
    slot: "dupur",
    bn: "সিঁদুর খেলা",
    en: "Sindoor khela",
    overlays: ["sindoor"],
    hotspots: { d: {}, m: {} },
  },
  {
    id: "dashami-bisarjan",
    phase: "dashami",
    slot: "sondhe",
    bn: "বিসর্জন",
    en: "Bisarjan at the ghat",
    overlays: ["sindoor"],
    hotspots: { d: { smoke: [[78, 64]] }, m: { smoke: [[78, 57]] } },
  },

  // ── BIJOYA ──
  {
    id: "bijoya-empty",
    phase: "bijoya",
    slot: "bhor",
    bn: "ফাঁকা মণ্ডপ",
    en: "The empty pandal at dawn",
    overlays: ["shiuli"],
    hotspots: { d: { flame: [[50, 69]] }, m: { flame: [[50, 60]] } },
  },
  {
    id: "bijoya-kash",
    phase: "bijoya",
    slot: "dupur",
    bn: "আসছে বছর",
    en: "Until next year",
    overlays: ["shiuli"],
    hotspots: { d: {}, m: {} },
  },
  {
    id: "bijoya-pronam",
    phase: "bijoya",
    slot: "sondhe",
    bn: "বিজয়ার প্রণাম",
    en: "Bijoya pronam and narkel naru",
    overlays: [],
    hotspots: { d: { flame: [[74, 63]] }, m: { flame: [[78, 54]] } },
  },
];

export const scenesFor = (phase: PhaseId) => SCENES.filter((s) => s.phase === phase);
