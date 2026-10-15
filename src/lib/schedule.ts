// ─────────────────────────────────────────────────────────────────────────────
// SHARED RADIO SCHEDULE
// No server: every visitor computes the same answer from the same inputs.
// Within a phase, the playlist starts at the phase's start time and loops, so
//   position = (now - phaseStart) mod totalDuration
// tells everyone which song is on and how far into it we are.
// ─────────────────────────────────────────────────────────────────────────────
import songsJson from "@/data/songs.json";
import type { Phase } from "@/config/tithis";
import { phaseStart } from "./time";

export interface Song {
  id: string; // YouTube video id
  title?: string;
  artist?: string;
  duration: number; // seconds
  tags?: string[];
}

interface RawSong {
  url?: string;
  id?: string;
  title?: string;
  artist?: string;
  duration?: number | string;
  tags?: string[];
}

export function videoIdFrom(input: string): string | null {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1, 12) || null;
    const v = u.searchParams.get("v");
    if (v) return v.slice(0, 11);
    const m = u.pathname.match(/\/(embed|shorts|live)\/([\w-]{11})/);
    if (m) return m[2];
  } catch {
    /* not a URL */
  }
  return null;
}

export function parseDuration(d: number | string | undefined): number {
  if (typeof d === "number") return d;
  if (!d) return 0;
  const parts = d.split(":").map(Number);
  return parts.reduce((acc, p) => acc * 60 + (p || 0), 0);
}

export const SONGS: Song[] = (songsJson as { songs: RawSong[] }).songs
  .map((r) => ({
    id: r.id ?? videoIdFrom(r.url ?? "") ?? "",
    title: r.title,
    artist: r.artist,
    duration: parseDuration(r.duration),
    tags: r.tags,
  }))
  .filter((s) => s.id && s.duration > 0);

export function playlistFor(phase: Phase, bad: Set<string>): Song[] {
  const ok = SONGS.filter((s) => !bad.has(s.id));
  const tagged = ok.filter((s) => !s.tags?.length || s.tags.some((t) => phase.songTags.includes(t)));
  return tagged.length ? tagged : ok;
}

export interface Slot {
  song: Song;
  index: number;
  offset: number; // seconds into the song
  endsAt: number; // ms
  next: Song;
}

export function scheduleAt(ms: number, phase: Phase, list: Song[]): Slot | null {
  if (!list.length) return null;
  const total = list.reduce((a, s) => a + s.duration, 0) * 1000;
  let pos = (ms - phaseStart(phase)) % total;
  if (pos < 0) pos += total;
  for (let i = 0; i < list.length; i++) {
    const d = list[i].duration * 1000;
    if (pos < d) {
      return { song: list[i], index: i, offset: pos / 1000, endsAt: ms + (d - pos), next: list[(i + 1) % list.length] };
    }
    pos -= d;
  }
  return { song: list[0], index: 0, offset: 0, endsAt: ms + list[0].duration * 1000, next: list[1 % list.length] };
}
