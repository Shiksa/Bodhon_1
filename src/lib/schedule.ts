// ─────────────────────────────────────────────────────────────────────────────
// RADIO SCHEDULE
// Reads config/songs.ts and decides how the radio runs. No server needed.
//
// synced   : every song has a length. Each phase's playlist starts at the
//            phase's start time and loops, so position = (now - start) mod total,
//            and every visitor hears the same second of the same song.
// loop     : song links without lengths. Endless loop; visitors who tune in
//            around the same time start on the same song.
// playlist : one YouTube playlist. Same endless loop, songs managed on YouTube.
// ─────────────────────────────────────────────────────────────────────────────
import { SONG_LINKS, YOUTUBE_PLAYLIST } from "@/config/songs";
import type { Phase } from "@/config/tithis";
import { phaseStart } from "./time";

export interface Song {
  id: string; // YouTube video id
  title?: string;
  artist?: string;
  duration: number; // seconds, 0 if unknown
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

export function playlistIdFrom(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  if (/^(PL|OL|UU|RD|FL)[\w-]{10,}$/.test(s)) return s;
  try {
    return new URL(s).searchParams.get("list");
  } catch {
    return null;
  }
}

export function parseDuration(d: number | string | undefined): number {
  if (typeof d === "number") return d;
  if (!d) return 0;
  return d.split(":").map(Number).reduce((acc, p) => acc * 60 + (p || 0), 0);
}

/** Parses lines like "link | 4:32 | ashtami navami" (the extras are optional). */
export function parseSongLines(text: string): Song[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("//") && !l.startsWith("#"))
    .map((line) => {
      const [link, ...rest] = line.split("|").map((p) => p.trim());
      let duration = 0;
      const tags: string[] = [];
      for (const part of rest) {
        for (const word of part.split(/[\s,]+/).filter(Boolean)) {
          if (/^\d+(:\d{1,2}){1,2}$/.test(word)) duration = parseDuration(word);
          else tags.push(word.toLowerCase());
        }
      }
      return { id: videoIdFrom(link) ?? "", duration, tags };
    })
    .filter((s) => s.id);
}

export type Source =
  | { kind: "synced"; songs: Song[] }
  | { kind: "loop"; songs: Song[] }
  | { kind: "playlist"; listId: string }
  | { kind: "none" };

const LINES = parseSongLines(SONG_LINKS);
const LIST_ID = playlistIdFrom(YOUTUBE_PLAYLIST);

export const SOURCE: Source = LINES.length
  ? LINES.every((s) => s.duration > 0)
    ? { kind: "synced", songs: LINES }
    : { kind: "loop", songs: LINES }
  : LIST_ID
    ? { kind: "playlist", listId: LIST_ID }
    : { kind: "none" };

const SONGS: Song[] = SOURCE.kind === "synced" || SOURCE.kind === "loop" ? SOURCE.songs : [];

/** Songs for this phase: tagged for the day plus untagged ones; everything if none match. */
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

/** Synced mode: which song is on right now, and how far in. */
export function scheduleAt(ms: number, phase: Phase, list: Song[]): Slot | null {
  if (!list.length) return null;
  const total = list.reduce((a, s) => a + s.duration, 0) * 1000;
  if (!total) return null;
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

/**
 * Loop mode start point. Song lengths are unknown, so the clock is cut into
 * 4-minute steps: visitors who tune in around the same time start on the same
 * song at the same point, then the endless loop carries on from there.
 */
export const LOOP_STEP_MS = 4 * 60 * 1000;
export function loopStart(ms: number, phase: Phase, count: number) {
  const n = Math.max(1, count);
  const cycle = LOOP_STEP_MS * n;
  const e = (((ms - phaseStart(phase)) % cycle) + cycle) % cycle;
  return { index: Math.floor(e / LOOP_STEP_MS) % n, offset: (e % LOOP_STEP_MS) / 1000 };
}
