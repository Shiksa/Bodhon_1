// ─────────────────────────────────────────────────────────────────────────────
// THE TITHI ENGINE CONFIG
//
// Everything about "which day of pujo is it" lives here. All times are IST
// (Asia/Kolkata). Visitors anywhere in the world see Kolkata's tithi.
//
// Dates follow the 2026 Bisuddha Siddhanta Kolkata calendar:
//   Mahalaya Sat 10 Oct · Maha Shashthi Fri 16 Oct · Saptami tithi begins
//   Sat 17 Oct 5:55 AM · Maha Saptami Sun 18 Oct · Maha Ashtami Mon 19 Oct
//   (Kumari Puja, Sandhi Puja) · Maha Navami Tue 20 Oct · Vijaya Dashami Wed 21 Oct.
// ─────────────────────────────────────────────────────────────────────────────

export type PhaseId =
  | "agomoni"
  | "shashthi"
  | "saptami"
  | "ashtami"
  | "navami"
  | "dashami"
  | "bijoya";

export type Slot = "bhor" | "dupur" | "sondhe" | "raat";

export interface Caption {
  bn: string;
  en: string;
}

export interface Phase {
  id: PhaseId;
  bn: string; // short Bengali name
  bnLong: string; // how it is said on the day
  en: string;
  /** When this phase begins, IST, "YYYY-MM-DDTHH:mm". It lasts until the next phase starts. */
  start: string;
  /** UI accent colours for this phase */
  palette: { accent: string; glow: string; ink: string; wash: string };
  captions: Caption[];
  /** Song tags this phase prefers. Untagged songs play in every phase. */
  songTags: string[];
}

export const PHASES: Phase[] = [
  {
    id: "agomoni",
    bn: "আগমনী",
    bnLong: "মা আসছেন",
    en: "Agomoni",
    start: "2026-10-10T00:00", // Mahalaya
    palette: {
      accent: "#f2c14e",
      glow: "#ffe3a3",
      ink: "#2a1608",
      wash: "#7aa6c9",
    },
    songTags: ["agomoni"],
    captions: [
      {
        bn: "আকাশে পেঁজা তুলোর মেঘ, মাঠে কাশফুল। মা আসছেন।",
        en: "Cotton clouds above, kash in the fields. Ma is on her way.",
      },
      {
        bn: "কুমোরটুলিতে শেষ তুলির টান পড়ছে।",
        en: "The last brushstrokes are landing in Kumortuli.",
      },
      {
        bn: "বাঁশের কাঠামো উঠছে, পাড়ার ছেলেরা রাত জাগছে।",
        en: "Bamboo frames are rising, and the para boys stay up all night.",
      },
      {
        bn: "ট্রেনের টিকিট কাটা হয়ে গেছে? বাড়ি ফেরার পালা।",
        en: "Train tickets booked? Time to go home.",
      },
      { bn: "শিউলির গন্ধে ভোর হচ্ছে।", en: "Mornings smell of shiuli now." },
      {
        bn: "নতুন জামার ভাঁজ এখনও খোলা হয়নি।",
        en: "The new clothes are still folded, waiting.",
      },
    ],
  },
  {
    id: "shashthi",
    bn: "ষষ্ঠী",
    bnLong: "মহাষষ্ঠী",
    en: "Maha Shashthi",
    start: "2026-10-16T00:00",
    palette: {
      accent: "#f59e3b",
      glow: "#ffd28a",
      ink: "#2b1205",
      wash: "#c96a3b",
    },
    songTags: ["shashthi"],
    captions: [
      {
        bn: "বেলতলায় বোধন, ঘুম ভাঙছে মায়ের।",
        en: "Bodhon under the bel tree. Ma awakens.",
      },
      {
        bn: "ঢাকিরা এসে গেছে, পালক দোলানো ঢাক নিয়ে।",
        en: "The dhakis are here, plumes swaying on their dhaks.",
      },
      {
        bn: "আজ প্যান্ডেলের আলো জ্বলল প্রথমবার।",
        en: "Tonight the pandal lights came on for the first time.",
      },
      {
        bn: "ষষ্ঠীর সন্ধে মানেই শুরুর শুরু।",
        en: "Shashthi evening: the beginning of the beginning.",
      },
      {
        bn: "পাড়ার মোড়ে ফুচকার লাইন লম্বা হচ্ছে।",
        en: "The fuchka line at the corner keeps getting longer.",
      },
    ],
  },
  {
    id: "saptami",
    bn: "সপ্তমী",
    bnLong: "মহাসপ্তমী",
    en: "Maha Saptami",
    start: "2026-10-17T05:55", // Saptami tithi begins; main Saptami is Sun 18 Oct
    palette: {
      accent: "#f4d06f",
      glow: "#fff0c2",
      ink: "#0f1a2a",
      wash: "#6f8fb8",
    },
    songTags: ["saptami"],
    captions: [
      {
        bn: "ভোরের গঙ্গায় কলাবউ স্নান।",
        en: "Kola bou's bath in the dawn Ganga.",
      },
      {
        bn: "লালপাড় শাড়িতে নবপত্রিকা এলেন গণেশের পাশে।",
        en: "In a red-bordered saree, Nabapatrika takes her place beside Ganesh.",
      },
      {
        bn: "ঢাকের বোলে পাড়া জেগে উঠল।",
        en: "The para wakes to the beat of the dhak.",
      },
      {
        bn: "সপ্তমীর সন্ধ্যারতি, ধুনোর গন্ধে ভরা মণ্ডপ।",
        en: "Saptami aarti, the mandap thick with the scent of dhuno.",
      },
      {
        bn: "আজ থেকে চারদিন, ঘড়ি দেখা বারণ।",
        en: "For four days now, nobody checks the clock.",
      },
    ],
  },
  {
    id: "ashtami",
    bn: "অষ্টমী",
    bnLong: "মহাষ্টমী",
    en: "Maha Ashtami",
    start: "2026-10-19T00:00",
    palette: {
      accent: "#ffcf3f",
      glow: "#fff1b0",
      ink: "#2a0d05",
      wash: "#e0a030",
    },
    songTags: ["ashtami"],
    captions: [
      {
        bn: "অষ্টমীর অঞ্জলি, হাতে ফুল, মুখে মন্ত্র।",
        en: "Ashtami anjali: flowers in hand, mantra on the lips.",
      },
      {
        bn: "নতুন শাড়ি, নতুন পাঞ্জাবি, পুরোনো বন্ধুরা।",
        en: "New sarees, new panjabis, old friends.",
      },
      {
        bn: "কুমারী পুজোয় ছোট্ট মেয়েটির মধ্যেই মাকে দেখা।",
        en: "At Kumari pujo, we see Ma in a little girl.",
      },
      {
        bn: "একশো আটটা প্রদীপ, একশো আটটা পদ্ম। সন্ধিক্ষণ।",
        en: "108 lamps, 108 lotuses. The sacred junction.",
      },
      {
        bn: "শালপাতায় ভোগের খিচুড়ি, লাবড়া, চাটনি।",
        en: "Bhog khichuri, labra and chutney on sal leaves.",
      },
    ],
  },
  {
    id: "navami",
    bn: "নবমী",
    bnLong: "মহানবমী",
    en: "Maha Navami",
    start: "2026-10-20T00:00",
    palette: {
      accent: "#e9a23b",
      glow: "#ffc977",
      ink: "#120618",
      wash: "#5b2a6e",
    },
    songTags: ["navami"],
    captions: [
      {
        bn: "ধুনুচি হাতে নাচ, ঢাকের তালে তালে।",
        en: "Dhunuchi in hand, dancing to the dhak.",
      },
      {
        bn: "যেও না, নবমী নিশি, যেও না।",
        en: "Don't go, Navami night, don't go.",
      },
      {
        bn: "নাগরদোলায় শেষ পাক, হাতে কাঠি আইসক্রিম।",
        en: "One last ride on the nagordola, an ice lolly in hand.",
      },
      {
        bn: "নবমীর রাত, ফুরিয়ে আসছে সময়।",
        en: "Navami night. Time is running out.",
      },
      {
        bn: "রাত জেগে ঠাকুর দেখা: পায়ে ব্যথা, মনে আনন্দ।",
        en: "All-night pandal hopping: sore feet, full heart.",
      },
    ],
  },
  {
    id: "dashami",
    bn: "দশমী",
    bnLong: "বিজয়া দশমী",
    en: "Bijoya Dashami",
    start: "2026-10-21T00:00",
    palette: {
      accent: "#ff4b2b",
      glow: "#ffb199",
      ink: "#2a0505",
      wash: "#c2241a",
    },
    songTags: ["dashami"],
    captions: [
      {
        bn: "দেবীবরণ, চোখের কোণে জল।",
        en: "Debi boron, and a tear in the corner of the eye.",
      },
      {
        bn: "সিঁদুরে রাঙা মুখ, সিঁদুর খেলা।",
        en: "Faces painted red. Sindoor khela.",
      },
      {
        bn: "মায়ের কানে কানে বলা: আবার এসো মা।",
        en: "Whispered in her ear: come again, Ma.",
      },
      {
        bn: "ঘাটে ঢাক বাজছে, শেষবারের মতো।",
        en: "The dhak plays at the ghat, one last time.",
      },
      { bn: "বলো দুগ্গা মাইকি, জয়!", en: "Bolo Dugga Maiki, joy!" },
    ],
  },
  {
    id: "bijoya",
    bn: "বিজয়া",
    bnLong: "শুভ বিজয়া",
    en: "Shubho Bijoya",
    start: "2026-10-22T00:00",
    palette: {
      accent: "#f0c987",
      glow: "#ffe8c4",
      ink: "#1a1410",
      wash: "#9aa7b3",
    },
    songTags: ["bijoya", "dashami"],
    captions: [
      { bn: "শুভ বিজয়া। প্রণাম নিও।", en: "Shubho Bijoya. Accept my pronam." },
      {
        bn: "নারকেল নাড়ু আর নিমকি, বিজয়ার মিষ্টিমুখ।",
        en: "Narkel naru and nimki: the sweetness of Bijoya.",
      },
      {
        bn: "প্যান্ডেল খুলছে, বাঁশ নামছে, মন খারাপ।",
        en: "Pandals are coming down, and so are our spirits.",
      },
      {
        bn: "আবার এক বছরের অপেক্ষা শুরু।",
        en: "Another year of waiting begins.",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// RITUAL MOMENTS for the countdown chip.
// `time: null` means "time not set yet": the site counts down to the day and
// never shows a made-up clock time. Fill in exact times from your panjika,
// e.g. time: "10:51".
// ─────────────────────────────────────────────────────────────────────────────

export interface PujoEvent {
  id: string;
  bn: string;
  en: string;
  date: string; // YYYY-MM-DD, IST
  time: string | null; // HH:mm IST, or null when it depends on the pandal
}

export const EVENTS: PujoEvent[] = [
  {
    id: "mahalaya",
    bn: "মহালয়া",
    en: "Mahalaya",
    date: "2026-10-10",
    time: null,
  },
  { id: "bodhon", bn: "বোধন", en: "Bodhon", date: "2026-10-16", time: null },
  {
    id: "nabapatrika",
    bn: "নবপত্রিকা স্নান",
    en: "Nabapatrika snan",
    date: "2026-10-18",
    time: null,
  },
  // Sandhi Puja: 7:26 to 8:14 AM (Traditional Panjika) or 10:28 to 11:16 AM (Bisuddha Siddhanta).
  // The countdown uses the earlier window; the schedule shows both.
  {
    id: "sandhi",
    bn: "সন্ধিপুজো",
    en: "Sandhi Puja",
    date: "2026-10-19",
    time: "07:26",
  },
  {
    id: "anjali",
    bn: "অষ্টমীর অঞ্জলি",
    en: "Ashtami anjali",
    date: "2026-10-19",
    time: null,
  },
  {
    id: "kumari",
    bn: "কুমারী পুজো",
    en: "Kumari Puja",
    date: "2026-10-19",
    time: null,
  },
  {
    id: "navami",
    bn: "মহানবমী",
    en: "Maha Navami",
    date: "2026-10-20",
    time: null,
  },
  {
    id: "sindoor",
    bn: "সিঁদুর খেলা",
    en: "Sindoor khela",
    date: "2026-10-21",
    time: null,
  },
  {
    id: "bisarjan",
    bn: "বিসর্জন",
    en: "Visarjan",
    date: "2026-10-21",
    time: null,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULE: what the "Pujo schedule" panel shows (tap the countdown chip).
// From the 2026 Bisuddha Siddhanta Kolkata calendar. All times IST.
// ─────────────────────────────────────────────────────────────────────────────
export interface ScheduleDay {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  nameBn: string;
  bengaliDate: string;
  rituals: string[];
  tithi?: string;
  times?: { label: string; value: string }[];
  note?: string;
}

export const SCHEDULE: ScheduleDay[] = [
  {
    id: "mahalaya",
    date: "2026-10-10",
    name: "Mahalaya",
    nameBn: "মহালয়া",
    bengaliDate: "23 Ashwin 1433",
    rituals: ["Tarpan", "Mahishasuramardini", "Devipaksha begins"],
    tithi: "Amavasya 9:37 PM (9 Oct) to 9:20 PM (10 Oct)",
  },
  {
    id: "shashthi",
    date: "2026-10-16",
    name: "Maha Shashthi",
    nameBn: "মহাষষ্ঠী",
    bengaliDate: "29 Ashwin 1433",
    rituals: ["Kalparambha", "Bodhan", "Amantran", "Adhibas"],
    tithi: "Shashthi 3:25 AM (16 Oct) to 5:55 AM (17 Oct)",
  },
  {
    id: "saptami",
    date: "2026-10-18",
    name: "Maha Saptami",
    nameBn: "মহাসপ্তমী",
    bengaliDate: "1 Kartik 1433",
    rituals: [
      "Nabapatrika Snan",
      "Prana Pratishtha",
      "Saptami Puja",
      "Pushpanjali",
      "Bhog",
      "Aarti",
    ],
    tithi: "Saptami 5:55 AM (17 Oct) to 8:29 AM (18 Oct)",
    note: "Saptami tithi spans two days this year. The main Saptami is Sunday 18 Oct.",
  },
  {
    id: "ashtami",
    date: "2026-10-19",
    name: "Maha Ashtami",
    nameBn: "মহাষ্টমী",
    bengaliDate: "2 Kartik 1433",
    rituals: ["Ashtami Puja", "Pushpanjali", "Kumari Puja", "Sandhi Puja"],
    tithi: "Ashtami 8:29 AM (18 Oct) to 10:52 AM (19 Oct)",
    times: [
      { label: "Sandhi Puja · Traditional Panjika", value: "7:26 to 8:14 AM" },
      { label: "Sandhi Puja · Bisuddha Siddhanta", value: "10:28 to 11:16 AM" },
    ],
    note: "Follow the Sandhi Puja time announced by your pandal.",
  },
  {
    id: "navami",
    date: "2026-10-20",
    name: "Maha Navami",
    nameBn: "মহানবমী",
    bengaliDate: "3 Kartik 1433",
    rituals: ["Navami Puja", "Pushpanjali", "Homa", "Aarti"],
    tithi: "Navami 10:52 AM (19 Oct) to 12:51 PM (20 Oct)",
  },
  {
    id: "dashami",
    date: "2026-10-21",
    name: "Vijaya Dashami",
    nameBn: "বিজয়া দশমী",
    bengaliDate: "4 Kartik 1433",
    rituals: [
      "Darpan Bisarjan",
      "Debi Baran",
      "Sindoor Khela",
      "Aparajita Puja",
      "Visarjan",
    ],
    tithi: "Dashami 12:51 PM (20 Oct) to 2:12 PM (21 Oct)",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// GREETINGS: the big headline. Each one shows from its start time (IST)
// until the next one starts.
// ─────────────────────────────────────────────────────────────────────────────
export interface Greeting {
  start: string; // IST "YYYY-MM-DDTHH:mm"
  bn: string;
  en: string;
}

export const GREETINGS: Greeting[] = [
  { start: "2026-08-01T00:00", bn: "শুভ শারদীয়া", en: "Shubho Sharodiya" },
  { start: "2026-10-10T00:00", bn: "শুভ মহালয়া", en: "Shubho Mahalaya" },
  { start: "2026-10-11T00:00", bn: "মা আসছেন", en: "Maa is on her way" },
  {
    start: "2026-10-15T00:00",
    bn: "শুভ মহাপঞ্চমী",
    en: "Shubho Maha Panchami",
  },
  { start: "2026-10-16T00:00", bn: "শুভ মহাষষ্ঠী", en: "Shubho Maha Shashthi" },
  { start: "2026-10-17T05:55", bn: "শুভ মহাসপ্তমী", en: "Shubho Maha Saptami" },
  { start: "2026-10-19T00:00", bn: "শুভ মহাষ্টমী", en: "Shubho Maha Ashtami" },
  { start: "2026-10-20T00:00", bn: "শুভ মহানবমী", en: "Shubho Maha Navami" },
  {
    start: "2026-10-21T00:00",
    bn: "শুভ বিজয়া দশমী",
    en: "Shubho Bijoya Dashami",
  },
  {
    start: "2026-10-22T00:00",
    bn: "আসছে বছর আবার হবে",
    en: "Asche bochor abar hobe",
  },
];

/** Time-of-day slots, IST hours. Used to pick which of today's scenes shows first. */
export const SLOTS: { id: Slot; from: number; to: number; bn: string }[] = [
  { id: "bhor", from: 4, to: 10, bn: "ভোর" },
  { id: "dupur", from: 10, to: 16, bn: "দুপুর" },
  { id: "sondhe", from: 16, to: 19.5, bn: "সন্ধে" },
  { id: "raat", from: 19.5, to: 28, bn: "রাত" }, // 28 = 4 AM next day
];

/** How long each scene stays before crossfading to the next (ms). */
export const SCENE_ROTATE_MS = 75_000;
