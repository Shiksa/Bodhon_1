import {
  EVENTS,
  GREETINGS,
  PHASES,
  SLOTS,
  type Greeting,
  type Phase,
  type PhaseId,
  type PujoEvent,
  type Slot,
} from "@/config/tithis";

const IST_OFFSET_MS = 330 * 60 * 1000;

// ── Trusted clock ───────────────────────────────────────────────────────────
// Device clocks are often wrong by seconds or minutes. The shared radio needs
// everyone on the same clock, so we read the Date header from our own host.

let clockOffset = 0;
let lastSync = 0;

export const now = () => Date.now() + clockOffset;

export async function syncClock(): Promise<number> {
  if (typeof window === "undefined") return 0;
  if (Date.now() - lastSync < 25_000) return clockOffset;
  try {
    const t0 = Date.now();
    const res = await fetch(window.location.pathname + `?t=${t0}`, {
      method: "HEAD",
      cache: "no-store",
    });
    const t1 = Date.now();
    const header = res.headers.get("date");
    if (header) {
      const server = Date.parse(header);
      // The Date header has 1 s resolution: add half a second plus half the round trip.
      const estimate = server + 500 + (t1 - t0) / 2;
      const offset = estimate - t1;
      // Ignore sub-second noise, which the header cannot resolve anyway.
      clockOffset = Math.abs(offset) > 1500 ? offset : 0;
      lastSync = t1;
    }
  } catch {
    // Offline or blocked: fall back to the device clock.
  }
  return clockOffset;
}

// ── IST helpers ─────────────────────────────────────────────────────────────

export function istInstant(date: string, time = "00:00") {
  return Date.parse(`${date}T${time}:00+05:30`);
}

export function phaseStart(p: Phase) {
  const [d, t] = p.start.split("T");
  return istInstant(d, t ?? "00:00");
}

export function istHour(ms: number) {
  const d = new Date(ms + IST_OFFSET_MS);
  return d.getUTCHours() + d.getUTCMinutes() / 60;
}

export function istDate(ms: number) {
  return new Date(ms + IST_OFFSET_MS).toISOString().slice(0, 10);
}

export function currentPhase(ms: number, forced?: string | null): Phase {
  if (forced) {
    const f = PHASES.find((p) => p.id === forced);
    if (f) return f;
  }
  let cur = PHASES[0];
  for (const p of PHASES) if (ms >= phaseStart(p)) cur = p;
  return cur;
}

/** The big headline for a moment in time. Previewing a day (?tithi=) shows that day's greeting. */
export function greetingAt(ms: number, forced?: Phase | null): Greeting {
  const at = forced ? phaseStart(forced) : ms;
  let g = GREETINGS[0];
  for (const x of GREETINGS) {
    const [d, t] = x.start.split("T");
    if (at >= istInstant(d, t ?? "00:00")) g = x;
  }
  return g;
}

export function phaseById(id: PhaseId) {
  return PHASES.find((p) => p.id === id)!;
}

export function currentSlot(ms: number): Slot {
  let h = istHour(ms);
  if (h < 4) h += 24;
  return (SLOTS.find((s) => h >= s.from && h < s.to) ?? SLOTS[3]).id;
}

// ── Countdown ───────────────────────────────────────────────────────────────

export interface Upcoming {
  today: PujoEvent[]; // events on today's date with no fixed time, or not yet passed
  next: PujoEvent | null;
  target: number | null; // ms
}

export function upcoming(ms: number): Upcoming {
  const today = istDate(ms);
  const todays = EVENTS.filter(
    (e) =>
      e.date === today && (e.time === null || istInstant(e.date, e.time) > ms),
  );
  const later = EVENTS.filter((e) => {
    const at = istInstant(e.date, e.time ?? "00:00");
    return at > ms && !(e.date === today && e.time === null);
  }).sort(
    (a, b) =>
      istInstant(a.date, a.time ?? "00:00") -
      istInstant(b.date, b.time ?? "00:00"),
  );
  const next = todays.find((e) => e.time) ?? later[0] ?? null;
  return {
    today: todays.filter((e) => e.time === null),
    next,
    target: next ? istInstant(next.date, next.time ?? "00:00") : null,
  };
}

const BN = "০১২৩৪৫৬৭৮৯";
export const bn = (v: number | string) =>
  String(v).replace(/\d/g, (d) => BN[+d]);

export function formatLeft(msLeft: number) {
  const s = Math.max(0, Math.floor(msLeft / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (d > 0) return `${bn(d)} দিন ${bn(h)} ঘণ্টা`;
  if (h > 0) return `${bn(h)} ঘণ্টা ${bn(m)} মিনিট`;
  return `${bn(String(m).padStart(2, "0"))}:${bn(String(sec).padStart(2, "0"))}`;
}

export function formatDateBn(date: string) {
  const [, mo, d] = date.split("-").map(Number);
  const months = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  return `${bn(d)} ${months[mo - 1]}`;
}

export function formatDayEn(date: string) {
  return new Date(`${date}T12:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
}
