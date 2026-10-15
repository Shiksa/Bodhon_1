"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Phase } from "@/config/tithis";
import { useRadio } from "@/hooks/useRadio";
import { thumb } from "@/lib/youtube";
import {
  CloseIcon,
  ListIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  ShareIcon,
  ShuffleIcon,
  VolumeIcon,
  YouTubeIcon,
} from "./Icons";

const mmss = (secs: number) => {
  const s = Math.max(0, Math.floor(secs || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const p = (n: number) => String(n).padStart(2, "0");
  return h ? `${h}:${p(m)}:${p(s % 60)}` : `${m}:${p(s % 60)}`;
};

type Radio = Omit<ReturnType<typeof useRadio>, "hostRef">;

/** Bottom sheet on phones, centred card on desktop. */
function Sheet({
  title,
  onClose,
  children,
}: {
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="sheet-in relative flex max-h-[75svh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-3xl border border-white/10 bg-[#1f0c07]/95 shadow-2xl backdrop-blur-xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="text-[15px] font-semibold tracking-wide text-ivory">
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-ivory hover:bg-white/10"
          >
            <CloseIcon width={18} height={18} />
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}

function PlaylistSheet({ r, onClose }: { r: Radio; onClose: () => void }) {
  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => activeRef.current?.scrollIntoView({ block: "center" }), []);
  return (
    <Sheet
      title={
        <span className="flex items-center gap-2">
          <ListIcon width={18} height={18} /> Playlist{" "}
          <span className="font-serif font-normal text-[color:var(--accent)]">
            · পুজোর গান
          </span>
        </span>
      }
      onClose={onClose}
    >
      <ul className="p-2 pb-4">
        {r.tracks.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-ivory/60">
            Loading songs…
          </li>
        )}
        {r.tracks.map((t, i) => {
          const active = !!r.track && i === r.current;
          return (
            <li key={`${t.id}-${i}`}>
              <button
                ref={active ? activeRef : undefined}
                type="button"
                onClick={() => r.playAt(i)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition ${active ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <span className="w-5 shrink-0 text-center text-xs tabular-nums text-ivory/45">
                  {active && r.playing ? (
                    <span className="eq inline-flex h-3.5 items-end gap-[2px]">
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    i + 1
                  )}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb(t.id).replace("hqdefault", "mqdefault")}
                  alt=""
                  loading="lazy"
                  className="h-11 w-16 shrink-0 rounded-lg object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span
                    className={`line-clamp-2 text-[13.5px] leading-snug ${active ? "text-[color:var(--accent)]" : "text-ivory"}`}
                  >
                    {t.title ?? "Loading title…"}
                  </span>
                  {t.author && (
                    <span className="block truncate text-[11.5px] text-ivory/50">
                      {t.author}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}

/** The spinning record (CD look): the current song's cover is the label, a brass tonearm drops on while playing. */
function Record({ id, spinning }: { id?: string; spinning: boolean }) {
  return (
    <div className="relative h-full w-full">
      <div
        className={`record absolute inset-0 ${spinning ? "" : "record-paused"}`}
      >
        <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
          <defs>
            <radialGradient id="vinyl" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.35" stopColor="#1f100b" />
              <stop offset="1" stopColor="#0b0504" />
            </radialGradient>
            <clipPath id="label">
              <circle cx="100" cy="100" r="38" />
            </clipPath>
          </defs>
          <circle cx="100" cy="100" r="98" fill="url(#vinyl)" />
          {Array.from({ length: 11 }, (_, i) => (
            <circle
              key={i}
              cx="100"
              cy="100"
              r={44 + i * 5}
              fill="none"
              stroke="#ffffff"
              strokeOpacity={i % 3 ? 0.05 : 0.09}
              strokeWidth="1"
            />
          ))}
          <circle
            cx="100"
            cy="100"
            r="98"
            fill="none"
            stroke="#f2c14e"
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
          {id ? (
            <image
              href={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`}
              x="52"
              y="62"
              width="96"
              height="76"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#label)"
            />
          ) : (
            <g>
              <circle cx="100" cy="100" r="38" fill="#c2241a" />
              <text
                x="100"
                y="108"
                textAnchor="middle"
                fontSize="22"
                fill="#fbf1dc"
                fontFamily="Galada, serif"
              >
                বোধন
              </text>
            </g>
          )}
          <circle
            cx="100"
            cy="100"
            r="38"
            fill="none"
            stroke="#f2c14e"
            strokeWidth="2.5"
          />
          <circle cx="100" cy="100" r="4" fill="#f6e7c8" />
        </svg>
      </div>
      {/* fixed sheen so the record reads as glossy while it spins */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,transparent_0deg,rgba(255,255,255,0.10)_25deg,transparent_60deg,transparent_180deg,rgba(255,255,255,0.07)_210deg,transparent_240deg)]"
      />
      {/* brass tonearm drops onto the record while it plays */}
      <svg
        viewBox="0 0 60 100"
        aria-hidden
        className="pointer-events-none absolute -right-2 -top-2 h-[62%] w-[38%] transition-transform duration-700 ease-out"
        style={{
          transformOrigin: "78% 12%",
          transform: `rotate(${spinning ? 24 : 0}deg)`,
        }}
      >
        <circle cx="47" cy="12" r="8" fill="#a8741a" />
        <circle cx="47" cy="12" r="3.5" fill="#f2c14e" />
        <path
          d="M47,12 L30,82"
          stroke="#f2c14e"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <rect
          x="23"
          y="78"
          width="12"
          height="16"
          rx="2"
          transform="rotate(14 29 86)"
          fill="#e9d6b8"
        />
      </svg>
    </div>
  );
}

export function RadioDock({
  phase,
  shareText,
  onShare,
}: {
  phase: Phase;
  shareText: string;
  onShare: () => void;
}) {
  const { hostRef, ...r } = useRadio(phase);
  const [showList, setShowList] = useState(false);

  const t = r.track;
  const pct =
    r.time.dur > 0 ? Math.min(100, (r.time.pos / r.time.dur) * 100) : 0;
  const title = t?.title ?? "Durga Pujo songs";
  const long = !!t?.title && t.title.length > 34;
  const sub =
    r.status === "offline"
      ? "YouTube isn't reachable right now"
      : r.status === "loading" && t
        ? "Loading…"
        : t
          ? (t.author ?? "Durga Pujo songs")
          : "Tap play · non-stop Pujo songs";

  const iconBtn =
    "grid h-11 w-11 shrink-0 place-items-center rounded-full text-ivory/80 transition hover:bg-white/10 hover:text-ivory";
  const vol = r.muted ? 0 : r.volume;

  const cover = (size: string) => (
    <div className={`relative shrink-0 ${size}`}>
      <Record id={t?.id} spinning={r.playing} />
    </div>
  );

  const titleLine = (
    <div className="min-w-0 flex-1 overflow-hidden">
      <div
        className={`whitespace-nowrap text-[16.5px] font-semibold text-ivory lg:text-[18px] ${long ? "marquee" : "truncate"}`}
      >
        {title}
        {long && <span className="pl-12">{title}</span>}
      </div>
    </div>
  );

  const playlistBtn = (
    <button
      type="button"
      onClick={() => setShowList(true)}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-[color:var(--accent)]/60 bg-[color:var(--accent)]/10 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[color:var(--accent)] transition hover:bg-[color:var(--accent)]/20"
    >
      <ListIcon width={13} height={13} /> Playlist
    </button>
  );

  const seekBar = (
    <input
      type="range"
      min={0}
      max={Math.max(1, Math.floor(r.time.dur))}
      value={Math.floor(r.time.pos)}
      onChange={(e) => r.seek(Number(e.target.value))}
      disabled={!t}
      className="seek min-w-0 flex-1"
      style={{ ["--v" as string]: `${pct}%` }}
      aria-label="Seek"
    />
  );

  const controls = (
    <>
      <button
        type="button"
        onClick={r.toggleShuffle}
        aria-pressed={r.shuffle}
        aria-label="Shuffle"
        title={r.shuffle ? "Shuffle on" : "Shuffle off"}
        className={`${iconBtn} ${r.shuffle ? "text-[color:var(--accent)]" : ""}`}
      >
        <ShuffleIcon width={19} height={19} />
      </button>
      <button
        type="button"
        onClick={r.prev}
        aria-label="Previous"
        title="Previous"
        className={iconBtn}
      >
        <PrevIcon width={19} height={19} />
      </button>
      <button
        type="button"
        onClick={r.toggle}
        disabled={!r.hasSongs}
        aria-label={r.playing ? "Pause" : "Play"}
        className={`mx-1.5 grid h-[60px] w-[60px] shrink-0 place-items-center rounded-full bg-ivory text-[#2a0f08] shadow-[0_0_0_5px_rgba(255,255,255,0.08),0_0_26px_-6px_rgba(255,220,150,0.9)] transition hover:scale-105 disabled:opacity-50 ${!r.playing ? "play-glow" : ""}`}
      >
        {r.playing ? (
          <PauseIcon width={24} height={24} />
        ) : (
          <PlayIcon width={24} height={24} className="ml-1" />
        )}
      </button>
      <button
        type="button"
        onClick={r.next}
        aria-label="Next"
        title="Next"
        className={iconBtn}
      >
        <NextIcon width={19} height={19} />
      </button>
      <button
        type="button"
        onClick={r.toggleRepeat}
        aria-label={r.repeat === "one" ? "Repeat one" : "Repeat all"}
        title={r.repeat === "one" ? "Repeat this song" : "Repeat playlist"}
        className={`${iconBtn} text-[color:var(--accent)]`}
      >
        <RepeatIcon width={19} height={19} one={r.repeat === "one"} />
      </button>
    </>
  );

  const chip =
    "flex items-center gap-1.5 rounded-full border border-white/12 bg-black/25 px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-ivory transition hover:bg-black/40";

  return (
    <section
      aria-label="Music player"
      className="relative mx-auto w-full max-w-[560px] rounded-[22px] border border-white/12 bg-[linear-gradient(135deg,rgba(64,24,14,0.9),rgba(28,10,6,0.9))] p-4 shadow-[0_24px_60px_-14px_rgba(0,0,0,0.8)] backdrop-blur-2xl lg:max-w-[860px] lg:px-5 lg:py-5"
    >
      {/* the YouTube player plays here, hidden */}
      <div
        ref={hostRef}
        aria-hidden
        className="pointer-events-none absolute left-4 top-4 h-14 w-14 overflow-hidden rounded-2xl opacity-[0.01] [&>iframe]:h-full [&>iframe]:w-full"
      />

      {/* Desktop: one row */}
      <div className="hidden items-center gap-4 lg:flex">
        {cover("h-[92px] w-[92px]")}
        <div className="grid min-w-[300px] flex-1 gap-1.5">
          <div className="flex min-w-0 items-center gap-2">
            {titleLine}
            <YouTubeIcon className="shrink-0" />
            {playlistBtn}
          </div>
          <div className="truncate text-[13.5px] text-ivory/60">{sub}</div>
          <div className="flex items-center gap-2 text-[11.5px] tabular-nums text-ivory/55">
            <span className="w-9 text-right">{mmss(r.time.pos)}</span>
            {seekBar}
            <span className="w-9">{mmss(r.time.dur)}</span>
          </div>
        </div>
        <div className="flex items-center">
          {controls}
          <button
            type="button"
            onClick={r.toggleMute}
            aria-label={r.muted ? "Unmute" : "Mute"}
            title={r.muted ? "Unmute" : "Mute"}
            className={`${iconBtn} ml-1`}
          >
            <VolumeIcon
              width={19}
              height={19}
              muted={r.muted || r.volume === 0}
            />
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={vol}
            onChange={(e) => r.setVolume(Number(e.target.value))}
            className="seek w-16"
            style={{ ["--v" as string]: `${vol}%` }}
            aria-label="Volume"
          />
          <button
            type="button"
            onClick={onShare}
            aria-label="Share"
            title={shareText}
            className={`${iconBtn} ml-1`}
          >
            <ShareIcon width={18} height={18} />
          </button>
        </div>
      </div>

      {/* Phone and tablet: stacked */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-3.5 lg:hidden">
        <div className="flex min-w-0 items-center gap-3">
          {cover("h-[76px] w-[76px]")}
          <div className="min-w-0 flex-1">
            {titleLine}
            <div className="mt-1 truncate text-[13px] text-ivory/60">{sub}</div>
          </div>
          {playlistBtn}
        </div>
        <div className="flex items-center gap-2 text-[11.5px] tabular-nums text-ivory/55">
          <span className="w-9 text-right">{mmss(r.time.pos)}</span>
          {seekBar}
          <span className="w-9">{mmss(r.time.dur)}</span>
        </div>
        <div className="flex items-center justify-between px-1">{controls}</div>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={r.toggleMute}
            aria-pressed={r.muted}
            className={`${chip} ${r.muted ? "border-[color:var(--accent)] text-[color:var(--accent)]" : ""}`}
          >
            <VolumeIcon width={14} height={14} muted={r.muted} />{" "}
            {r.muted ? "Muted" : "Sound"}
          </button>
          <button type="button" onClick={onShare} className={chip}>
            <ShareIcon width={14} height={14} /> Share
          </button>
        </div>
      </div>

      {showList && <PlaylistSheet r={r} onClose={() => setShowList(false)} />}
    </section>
  );
}
