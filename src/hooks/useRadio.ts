"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Phase } from "@/config/tithis";
import { site } from "@/config/site";
import { loopStart, playlistFor, scheduleAt, SOURCE, type Slot } from "@/lib/schedule";
import { now, syncClock } from "@/lib/time";
import { FATAL_ERRORS, loadYouTube, thumb, type YTPlayer } from "@/lib/youtube";

export type RadioStatus = "idle" | "connecting" | "live" | "buffering" | "paused" | "offline";

export interface NowPlaying {
  id?: string;
  title?: string;
  artist?: string;
  pos: number; // seconds
  dur: number; // seconds, 0 if unknown
  next?: string; // next song's title, when known
}

const DRIFT_LIMIT = 2; // seconds
const DRIFT_CHECK_MS = 30_000;
const SYNCED = SOURCE.kind === "synced";
const LOOPING = SOURCE.kind === "loop" || SOURCE.kind === "playlist";

export function useRadio(phase: Phase) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const loadedId = useRef<string | null>(null);
  const joined = useRef(false);
  const pendingJoin = useRef(false);
  const lastDrift = useRef(0);
  const clampRef = useRef<{ id: string; offset: number } | null>(null);

  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<RadioStatus>("idle");
  const [bad, setBad] = useState<Set<string>>(() => new Set());
  const [slot, setSlot] = useState<Slot | null>(null);
  const [playlistIds, setPlaylistIds] = useState<string[]>([]);
  const [meta, setMeta] = useState<{ id?: string; title?: string; author?: string }>({});
  const [progress, setProgress] = useState({ pos: 0, dur: 0 });
  const [volume, setVolumeState] = useState(85);

  // The songs for today. In playlist mode they come from YouTube once the player loads.
  const list = useMemo(() => playlistFor(phase, bad), [phase, bad]);
  const loopIds = useMemo(() => (SOURCE.kind === "playlist" ? playlistIds : list.map((s) => s.id)), [list, playlistIds]);

  const listRef = useRef(list);
  const loopIdsRef = useRef(loopIds);
  const phaseRef = useRef(phase);
  const volRef = useRef(volume);
  useEffect(() => {
    listRef.current = list;
    loopIdsRef.current = loopIds;
    phaseRef.current = phase;
    volRef.current = volume;
  }, [list, loopIds, phase, volume]);

  const live = useCallback(() => scheduleAt(now(), phaseRef.current, listRef.current), []);

  const readMeta = useCallback((p: YTPlayer) => {
    const d = p.getVideoData();
    if (d?.video_id) setMeta((m) => (m.id === d.video_id && m.title === d.title ? m : { id: d.video_id, title: d.title, author: d.author }));
  }, []);

  /** Start (or rejoin) playback at the live position. */
  const playLive = useCallback(() => {
    const p = playerRef.current;
    if (!p) return;
    if (SYNCED) {
      const s = live();
      if (!s) return;
      loadedId.current = s.song.id;
      p.loadVideoById({ videoId: s.song.id, startSeconds: s.offset });
    } else {
      const ids = loopIdsRef.current;
      if (!ids.length) return;
      const { index, offset } = loopStart(now(), phaseRef.current, ids.length);
      clampRef.current = { id: ids[index], offset };
      p.loadPlaylist(ids, index, offset);
      p.setLoop(true); // endless: after the last song it starts again from the first
    }
    p.unMute();
    p.setVolume(volRef.current);
    p.playVideo();
  }, [live]);

  // Create the YouTube player.
  const hasSource = SOURCE.kind !== "none";
  useEffect(() => {
    if (!hasSource || !hostRef.current) return;
    let cancelled = false;
    let poll = 0;
    const mount = document.createElement("div");
    hostRef.current.appendChild(mount);
    syncClock();
    loadYouTube()
      .then((YT) => {
        if (cancelled) return;
        const s = SYNCED ? live() : null;
        playerRef.current = new YT.Player(mount, {
          width: "100%",
          height: "100%",
          videoId: s?.song.id,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            playsinline: 1,
            controls: 0,
            rel: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            ...(s ? { start: Math.floor(s.offset) } : {}),
            origin: window.location.origin,
          },
          events: {
            onReady: (e) => {
              const p = e.target;
              const becomeReady = () => {
                setReady(true);
                if (pendingJoin.current) {
                  pendingJoin.current = false;
                  joined.current = true;
                  playLive();
                }
              };
              if (SYNCED) {
                loadedId.current = s?.song.id ?? null;
                becomeReady();
              } else if (SOURCE.kind === "loop") {
                const ids = loopIdsRef.current;
                const { index, offset } = loopStart(now(), phaseRef.current, ids.length);
                p.cuePlaylist(ids, index, offset);
                becomeReady();
              } else if (SOURCE.kind === "playlist") {
                // Ask YouTube for the playlist, then read its song list.
                p.cuePlaylist({ list: SOURCE.listId, listType: "playlist" });
                let tries = 0;
                poll = window.setInterval(() => {
                  const ids = p.getPlaylist();
                  if (ids?.length) {
                    window.clearInterval(poll);
                    loopIdsRef.current = ids;
                    setPlaylistIds(ids);
                    const { index, offset } = loopStart(now(), phaseRef.current, ids.length);
                    p.cuePlaylist(ids, index, offset);
                    becomeReady();
                  } else if (++tries > 40) {
                    window.clearInterval(poll);
                    setStatus("offline");
                  }
                }, 250);
              }
            },
            onStateChange: (e) => {
              const p = e.target;
              if (e.data === 1) {
                // Pressing play inside the YouTube frame itself also counts as joining.
                if (!joined.current) {
                  joined.current = true;
                  if (SYNCED) {
                    const cur = live();
                    if (cur && cur.song.id === loadedId.current) p.seekTo(cur.offset, true);
                  } else {
                    p.setLoop(true);
                  }
                }
                // Loop mode: if the clock put us past the end of a short song, wrap inside it.
                const c = clampRef.current;
                const d = p.getVideoData();
                if (c && d?.video_id === c.id) {
                  const dur = p.getDuration();
                  if (dur > 0) {
                    if (c.offset > dur - 20) p.seekTo(c.offset % Math.max(dur - 20, 1), true);
                    clampRef.current = null;
                  }
                }
                setStatus("live");
                readMeta(p);
              } else if (e.data === 5) {
                readMeta(p);
              } else if (e.data === 3) {
                if (joined.current) setStatus("buffering");
              } else if (e.data === 2) {
                if (joined.current) {
                  joined.current = false;
                  setStatus("paused");
                }
              } else if (e.data === 0) {
                if (SYNCED) {
                  // If the schedule moved on, follow it; if this video ran short, wait for the next slot.
                  const c2 = live();
                  if (joined.current && c2 && c2.song.id !== loadedId.current) playLive();
                } else if (joined.current) {
                  p.nextVideo();
                }
              }
            },
            onError: (e) => {
              if (!FATAL_ERRORS.has(e.data)) return;
              if (SYNCED && loadedId.current) {
                const id = loadedId.current;
                // Everyone hits the same error, so everyone drops the same song and stays in sync.
                setBad((b) => new Set(b).add(id));
              } else {
                // This video can't be embedded: skip to the next one in the loop.
                e.target.nextVideo();
              }
            },
          },
        });
      })
      .catch(() => setStatus("offline"));
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
  }, [hasSource, live, playLive, readMeta]);

  // Heartbeat: follow the schedule (synced), track progress (loop), keep the UI moving.
  useEffect(() => {
    const tick = () => {
      const p = playerRef.current;
      if (!SYNCED) {
        if (p && ready && joined.current) {
          try {
            setProgress({ pos: p.getCurrentTime(), dur: p.getDuration() });
            readMeta(p);
          } catch {
            /* player not ready */
          }
        }
        return;
      }
      const s = live();
      setSlot(s);
      if (!p || !s || !ready) return;
      if (joined.current && s.song.id !== loadedId.current) {
        playLive();
        return;
      }
      if (joined.current && Date.now() - lastDrift.current > DRIFT_CHECK_MS) {
        lastDrift.current = Date.now();
        syncClock().then(() => {
          const c = live();
          if (!c || c.song.id !== loadedId.current) return;
          const drift = p.getCurrentTime() - c.offset;
          if (Math.abs(drift) > DRIFT_LIMIT && c.offset < c.song.duration - 3) p.seekTo(c.offset, true);
        });
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    const onVis = () => {
      if (document.visibilityState === "visible") {
        lastDrift.current = 0;
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [live, playLive, readMeta, ready, list]);

  const hasSongs = SYNCED ? list.length > 0 : SOURCE.kind === "loop" ? loopIds.length > 0 : SOURCE.kind === "playlist";

  const join = useCallback(() => {
    if (!hasSongs) return;
    setStatus("connecting");
    if (!ready || !playerRef.current) {
      pendingJoin.current = true;
      return;
    }
    joined.current = true;
    lastDrift.current = Date.now();
    playLive();
  }, [hasSongs, ready, playLive]);

  const pause = useCallback(() => {
    joined.current = false;
    playerRef.current?.pauseVideo();
    setStatus("paused");
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    const p = playerRef.current;
    if (!p) return;
    p.setVolume(v);
    if (v > 0) p.unMute();
    else p.mute();
  }, []);

  // What the dock shows
  let np: NowPlaying;
  if (SYNCED) {
    const song = slot?.song;
    np = {
      id: song?.id,
      title: song?.title || (meta.id === song?.id ? meta.title : undefined),
      artist: song?.artist || (meta.id === song?.id ? meta.author : undefined),
      pos: slot ? Math.min(slot.song.duration, slot.offset) : 0,
      dur: song?.duration ?? 0,
      next: slot && slot.next.id !== slot.song.id ? (slot.next.title ?? "পরের গান") : undefined,
    };
  } else {
    np = { id: meta.id, title: meta.title, artist: meta.author, pos: progress.pos, dur: status === "live" || status === "buffering" || status === "paused" ? progress.dur : 0 };
  }

  // Lock-screen / notification metadata
  const npId = np.id;
  const npTitle = np.title;
  const npArtist = np.artist;
  useEffect(() => {
    if (!("mediaSession" in navigator) || !npId || status !== "live") return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: npTitle ?? "পুজোর গান",
      artist: npArtist ?? site.name,
      album: `${site.nameBn} · ${phase.bnLong}`,
      artwork: [{ src: thumb(npId), sizes: "480x360", type: "image/jpeg" }],
    });
    navigator.mediaSession.setActionHandler("play", () => join());
    navigator.mediaSession.setActionHandler("pause", () => pause());
  }, [npId, npTitle, npArtist, status, phase.bnLong, join, pause]);

  return {
    hostRef,
    ready,
    status,
    hasSongs,
    synced: SYNCED,
    looping: LOOPING,
    np,
    volume,
    setVolume,
    join,
    pause,
    listening: status === "live" || status === "buffering" || status === "connecting",
  };
}
