"use client";

// The music player. Songs come from config/songs.ts (a list of links, or one
// YouTube playlist) and play audio-only through a hidden YouTube player.
// Play/pause, previous/next, shuffle, repeat, seek and a song list.
// The first play starts on the same song as everyone tuning in around then;
// after that the listener is free to skip around. Everything loops endlessly.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Phase } from "@/config/tithis";
import { site } from "@/config/site";
import { loopStart, playlistFor, SOURCE } from "@/lib/schedule";
import { now, syncClock } from "@/lib/time";
import { FATAL_ERRORS, loadYouTube, thumb, type YTPlayer } from "@/lib/youtube";

export type PlayerStatus =
  | "loading"
  | "ready"
  | "playing"
  | "paused"
  | "buffering"
  | "offline";
export type Repeat = "all" | "one";

export interface Track {
  id: string;
  title?: string;
  author?: string;
}

const META_KEY = "bodhan:meta:";
function readCache(id: string): { t?: string; a?: string } | null {
  try {
    const raw = localStorage.getItem(META_KEY + id);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function writeCache(id: string, t?: string, a?: string) {
  try {
    localStorage.setItem(META_KEY + id, JSON.stringify({ t, a }));
  } catch {
    /* storage unavailable */
  }
}

function shuffledOrder(n: number, first: number) {
  const rest = Array.from({ length: n }, (_, i) => i).filter(
    (i) => i !== first,
  );
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [first, ...rest];
}

export function useRadio(phase: Phase) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const bad = useRef<Set<string>>(new Set());
  const pendingPlay = useRef(false);
  const failed = useRef(false);
  const started = useRef(false);

  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<PlayerStatus>("loading");
  const [playlistIds, setPlaylistIds] = useState<string[]>([]);
  const [meta, setMeta] = useState<Record<string, { t?: string; a?: string }>>(
    {},
  );
  const [current, setCurrent] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [order, setOrder] = useState<number[]>([]);
  const [repeat, setRepeat] = useState<Repeat>("all");
  const [time, setTime] = useState({ pos: 0, dur: 0 });
  const [hasStarted, setHasStarted] = useState(false);
  const [volume, setVolumeState] = useState(85);
  const [muted, setMuted] = useState(false);

  // Today's songs: a link list (filtered by day tags) or a YouTube playlist.
  const linkIds = useMemo(
    () => playlistFor(phase, new Set()).map((s) => s.id),
    [phase],
  );
  const ids = SOURCE.kind === "playlist" ? playlistIds : linkIds;

  // Live copies for the YouTube event handlers
  const st = useRef({ ids, current, order, repeat, phase, volume, muted });
  useEffect(() => {
    st.current = { ids, current, order, repeat, phase, volume, muted };
  }, [ids, current, order, repeat, phase, volume, muted]);

  const playIndex = useCallback((i: number, startSeconds = 0) => {
    const p = playerRef.current;
    const list = st.current.ids;
    if (!p || !list.length) return;
    const idx = ((i % list.length) + list.length) % list.length;
    st.current.current = idx;
    setCurrent(idx);
    setTime({ pos: startSeconds, dur: 0 });
    started.current = true;
    setHasStarted(true);
    p.loadVideoById({ videoId: list[idx], startSeconds });
    p.setVolume(st.current.volume);
    if (st.current.muted) p.mute();
    else p.unMute();
    p.playVideo();
  }, []);

  /** Move through the play order (shuffle-aware), skipping songs that can't play. */
  const step = useCallback(
    (dir: 1 | -1) => {
      const { ids: list, current: cur, order: ord } = st.current;
      if (!list.length) return;
      const o = ord.length === list.length ? ord : list.map((_, i) => i);
      let pos = o.indexOf(cur);
      for (let k = 0; k < o.length; k++) {
        pos = (pos + dir + o.length) % o.length;
        if (!bad.current.has(list[o[pos]])) break;
      }
      playIndex(o[pos]);
    },
    [playIndex],
  );

  // Player events call the latest handlers through this ref.
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // Create the hidden YouTube player.
  useEffect(() => {
    if (SOURCE.kind === "none" || !hostRef.current) return;
    let cancelled = false;
    let poll = 0;
    const mount = document.createElement("div");
    hostRef.current.appendChild(mount);
    syncClock();
    loadYouTube()
      .then((YT) => {
        if (cancelled) return;
        playerRef.current = new YT.Player(mount, {
          width: "100%",
          height: "100%",
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            playsinline: 1,
            controls: 0,
            rel: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              const p = e.target;
              const becomeReady = () => {
                setReady(true);
                setStatus("ready");
                if (pendingPlay.current) {
                  pendingPlay.current = false;
                  const list = st.current.ids;
                  const s = loopStart(now(), st.current.phase, list.length);
                  playIndex(s.index, s.offset);
                }
              };
              if (SOURCE.kind === "playlist") {
                p.cuePlaylist({ list: SOURCE.listId, listType: "playlist" });
                let tries = 0;
                poll = window.setInterval(() => {
                  const got = p.getPlaylist();
                  if (got?.length) {
                    window.clearInterval(poll);
                    st.current.ids = got;
                    setPlaylistIds(got);
                    becomeReady();
                  } else if (++tries > 48) {
                    window.clearInterval(poll);
                    failed.current = true;
                    setStatus("offline");
                  }
                }, 250);
              } else becomeReady();
            },
            onStateChange: (e) => {
              const p = e.target;
              if (e.data === 1) {
                setStatus("playing");
                const d = p.getVideoData();
                if (d?.video_id && d.title) {
                  const vid = d.video_id;
                  setMeta((m) =>
                    m[vid]?.t
                      ? m
                      : { ...m, [vid]: { t: d.title, a: d.author } },
                  );
                }
              } else if (e.data === 2) setStatus("paused");
              else if (e.data === 3) setStatus("buffering");
              else if (e.data === 0) {
                if (st.current.repeat === "one") {
                  p.seekTo(0, true);
                  p.playVideo();
                } else stepRef.current(1);
              }
            },
            onError: (e) => {
              if (!FATAL_ERRORS.has(e.data)) return;
              const id = st.current.ids[st.current.current];
              if (id) bad.current.add(id);
              stepRef.current(1); // this video can't be embedded: skip it
            },
          },
        });
      })
      .catch(() => {
        failed.current = true;
        setStatus("offline");
      });
    return () => {
      cancelled = true;
      window.clearInterval(poll);
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      setReady(false);
      mount.remove();
    };
  }, [playIndex]);

  // Progress
  useEffect(() => {
    if (status !== "playing" && status !== "buffering") return;
    const t = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        setTime({ pos: p.getCurrentTime(), dur: p.getDuration() });
      } catch {
        /* not ready */
      }
    }, 500);
    return () => window.clearInterval(t);
  }, [status]);

  // Song titles and channels from YouTube (cached in the browser).
  useEffect(() => {
    if (!ids.length) return;
    let alive = true;
    (async () => {
      await Promise.resolve();
      const cached: Record<string, { t?: string; a?: string }> = {};
      const toFetch: string[] = [];
      for (const id of ids) {
        const c = readCache(id);
        if (c?.t) cached[id] = c;
        else toFetch.push(id);
      }
      if (alive && Object.keys(cached).length)
        setMeta((m) => ({ ...cached, ...m }));
      const queue = [...toFetch];
      const worker = async () => {
        while (alive && queue.length) {
          const id = queue.shift()!;
          try {
            const r = await fetch(
              `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`,
            );
            if (!r.ok) continue;
            const j = (await r.json()) as {
              title?: string;
              author_name?: string;
            };
            writeCache(id, j.title, j.author_name);
            if (alive)
              setMeta((m) => ({
                ...m,
                [id]: { t: j.title, a: j.author_name },
              }));
          } catch {
            /* offline */
          }
        }
      };
      await Promise.all([worker(), worker(), worker(), worker()]);
    })();
    return () => {
      alive = false;
    };
  }, [ids]);

  // ── Controls ──
  const play = useCallback(() => {
    if (failed.current) {
      setStatus("offline");
      return;
    }
    const p = playerRef.current;
    if (!ready || !p || !st.current.ids.length) {
      pendingPlay.current = true;
      setStatus("loading");
      window.setTimeout(() => {
        if (pendingPlay.current) {
          pendingPlay.current = false;
          setStatus("offline");
        }
      }, 15000);
      return;
    }
    if (started.current) {
      p.playVideo();
      return;
    }
    // First play: join the song everyone else tuning in now is hearing.
    const s = loopStart(now(), st.current.phase, st.current.ids.length);
    playIndex(s.index, s.offset);
  }, [playIndex, ready]);

  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const playing = status === "playing" || status === "buffering";
  const toggle = useCallback(
    () => (playing ? pause() : play()),
    [pause, play, playing],
  );

  const next = useCallback(() => step(1), [step]);
  const prev = useCallback(() => {
    const p = playerRef.current;
    if (p && started.current && p.getCurrentTime() > 5) p.seekTo(0, true);
    else step(-1);
  }, [step]);
  const playAt = useCallback((i: number) => playIndex(i), [playIndex]);
  const seek = useCallback((sec: number) => {
    playerRef.current?.seekTo(sec, true);
    setTime((t) => ({ ...t, pos: sec }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((on) => {
      const n = st.current.ids.length;
      const o = !on
        ? shuffledOrder(n, st.current.current)
        : Array.from({ length: n }, (_, i) => i);
      st.current.order = o;
      setOrder(o);
      return !on;
    });
  }, []);
  const toggleRepeat = useCallback(
    () => setRepeat((r) => (r === "all" ? "one" : "all")),
    [],
  );

  const setVolume = useCallback((v: number) => {
    const m = v === 0;
    setVolumeState(v);
    setMuted(m);
    st.current.volume = v;
    st.current.muted = m;
    const p = playerRef.current;
    if (!p) return;
    p.setVolume(v);
    if (m) p.mute();
    else p.unMute();
  }, []);
  const toggleMute = useCallback(() => {
    const m = !st.current.muted;
    st.current.muted = m;
    setMuted(m);
    const p = playerRef.current;
    if (!m && st.current.volume === 0) {
      st.current.volume = 60;
      setVolumeState(60);
      p?.setVolume(60);
    }
    if (!p) return;
    if (m) p.mute();
    else p.unMute();
  }, []);

  const tracks: Track[] = useMemo(
    () => ids.map((id) => ({ id, title: meta[id]?.t, author: meta[id]?.a })),
    [ids, meta],
  );
  const track = hasStarted ? tracks[current] : undefined;

  // Lock-screen controls
  useEffect(() => {
    if (!("mediaSession" in navigator) || !track || !playing) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title ?? "Durga Pujo song",
      artist: track.author ?? site.name,
      album: `${site.nameBn} · ${site.name}`,
      artwork: [{ src: thumb(track.id), sizes: "480x360", type: "image/jpeg" }],
    });
    navigator.mediaSession.setActionHandler("play", () => play());
    navigator.mediaSession.setActionHandler("pause", () => pause());
    navigator.mediaSession.setActionHandler("nexttrack", () => next());
    navigator.mediaSession.setActionHandler("previoustrack", () => prev());
  }, [track, playing, play, pause, next, prev]);

  return {
    hostRef,
    status,
    playing,
    hasSongs: SOURCE.kind !== "none",
    tracks,
    current,
    track,
    time,
    shuffle,
    repeat,
    toggle,
    next,
    prev,
    playAt,
    seek,
    toggleShuffle,
    toggleRepeat,
    volume,
    muted,
    setVolume,
    toggleMute,
  };
}
