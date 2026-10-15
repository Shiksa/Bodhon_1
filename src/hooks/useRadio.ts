"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Phase } from "@/config/tithis";
import { site } from "@/config/site";
import { playlistFor, scheduleAt, type Slot } from "@/lib/schedule";
import { now, syncClock } from "@/lib/time";
import { FATAL_ERRORS, loadYouTube, thumb, type YTPlayer } from "@/lib/youtube";

export type RadioStatus = "idle" | "connecting" | "live" | "buffering" | "paused" | "offline";

const DRIFT_LIMIT = 2; // seconds
const DRIFT_CHECK_MS = 30_000;

export function useRadio(phase: Phase) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const loadedId = useRef<string | null>(null);
  const joined = useRef(false);
  const pendingJoin = useRef(false);
  const lastDrift = useRef(0);

  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState<RadioStatus>("idle");
  const [bad, setBad] = useState<Set<string>>(() => new Set());
  const [slot, setSlot] = useState<Slot | null>(null);
  const [videoMeta, setVideoMeta] = useState<{ id?: string; title?: string; author?: string }>({});
  const [volume, setVolumeState] = useState(85);

  const list = useMemo(() => playlistFor(phase, bad), [phase, bad]);
  const listRef = useRef(list);
  const phaseRef = useRef(phase);
  const volRef = useRef(volume);
  useEffect(() => {
    listRef.current = list;
    phaseRef.current = phase;
    volRef.current = volume;
  }, [list, phase, volume]);

  const live = useCallback(() => scheduleAt(now(), phaseRef.current, listRef.current), []);

  const playLive = useCallback(() => {
    const p = playerRef.current;
    const s = live();
    if (!p || !s) return;
    loadedId.current = s.song.id;
    p.loadVideoById({ videoId: s.song.id, startSeconds: s.offset });
    p.unMute();
    p.setVolume(volRef.current);
    p.playVideo();
  }, [live]);

  // Create the YouTube player once there is something to play.
  const hasSongs = list.length > 0;
  useEffect(() => {
    if (!hasSongs || !hostRef.current) return;
    let cancelled = false;
    const mount = document.createElement("div");
    hostRef.current.appendChild(mount);
    syncClock();
    loadYouTube()
      .then((YT) => {
        if (cancelled) return;
        const s = live();
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
            start: Math.floor(s?.offset ?? 0),
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              loadedId.current = s?.song.id ?? null;
              setReady(true);
              if (pendingJoin.current) {
                pendingJoin.current = false;
                joined.current = true;
                playLive();
              }
            },
            onStateChange: (e) => {
              const p = e.target;
              if (e.data === 1) {
                // Someone may have pressed play inside the YouTube frame itself: treat as joining.
                if (!joined.current) {
                  joined.current = true;
                  const cur = live();
                  if (cur && cur.song.id === loadedId.current) p.seekTo(cur.offset, true);
                }
                setStatus("live");
                const d = p.getVideoData();
                setVideoMeta({ id: d.video_id, title: d.title, author: d.author });
              } else if (e.data === 3) {
                if (joined.current) setStatus("buffering");
              } else if (e.data === 2) {
                if (joined.current) {
                  joined.current = false;
                  setStatus("paused");
                }
              } else if (e.data === 0) {
                // Video ended. If the schedule already moved on, follow it; if the video was
                // shorter than its listed duration, wait quietly for the next slot.
                const c = live();
                if (joined.current && c && c.song.id !== loadedId.current) playLive();
              }
            },
            onError: (e) => {
              if (FATAL_ERRORS.has(e.data) && loadedId.current) {
                const id = loadedId.current;
                // Everyone hits the same error, so everyone drops the same song and stays in sync.
                setBad((b) => new Set(b).add(id));
              }
            },
          },
        });
      })
      .catch(() => setStatus("offline"));
    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
      setReady(false);
      mount.remove();
    };
  }, [hasSongs, live, playLive]);

  // Heartbeat: follow the schedule, correct drift, keep the UI clock moving.
  useEffect(() => {
    const tick = () => {
      const s = live();
      setSlot(s);
      const p = playerRef.current;
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
  }, [live, playLive, ready, list]);

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

  const song = slot?.song;
  const title = song?.title || (videoMeta.id === song?.id ? videoMeta.title : undefined);
  const artist = song?.artist || (videoMeta.id === song?.id ? videoMeta.author : undefined);

  // Lock-screen / notification metadata
  useEffect(() => {
    if (!("mediaSession" in navigator) || !song || status !== "live") return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: title ?? "পুজোর গান",
      artist: artist ?? site.name,
      album: `${site.nameBn} · ${phase.bnLong}`,
      artwork: [{ src: thumb(song.id), sizes: "480x360", type: "image/jpeg" }],
    });
    navigator.mediaSession.setActionHandler("play", () => join());
    navigator.mediaSession.setActionHandler("pause", () => pause());
  }, [song, title, artist, status, phase.bnLong, join, pause]);

  return {
    hostRef,
    ready,
    status,
    hasSongs,
    slot,
    title,
    artist,
    volume,
    setVolume,
    join,
    pause,
    listening: status === "live" || status === "buffering" || status === "connecting",
  };
}
