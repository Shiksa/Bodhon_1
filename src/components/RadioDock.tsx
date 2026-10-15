"use client";

import { useState } from "react";
import type { Phase } from "@/config/tithis";
import { useRadio } from "@/hooks/useRadio";
import { bn } from "@/lib/time";
import { PauseIcon, PlayIcon, ShareIcon, VolumeIcon } from "./Icons";

const mmss = (s: number) =>
  `${bn(Math.floor(s / 60))}:${bn(String(Math.floor(s % 60)).padStart(2, "0"))}`;

/**
 * Audio-only face for the radio: a spinning record whose label is the current
 * song's YouTube cover. The YouTube player sits underneath it, hidden.
 */
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
  const [muted, setMuted] = useState(false);
  const np = r.np;
  const pct = np.dur > 0 ? Math.min(100, (np.pos / np.dur) * 100) : 0;
  const left = Math.max(0, np.dur - np.pos);

  const toggleMute = () => {
    const m = !muted;
    setMuted(m);
    r.setVolume(m ? 0 : Math.max(r.volume, 60));
  };

  const statusText =
    r.status === "connecting"
      ? "যুক্ত হচ্ছে…"
      : r.status === "buffering"
        ? "বাজছে…"
        : r.status === "offline"
          ? "ইউটিউব পাওয়া যাচ্ছে না"
          : r.listening
            ? "সরাসরি বাজছে"
            : r.synced
              ? "সরাসরি · সবাই একসাথে"
              : "পুজোর গান · বিরামহীন";

  return (
    <section
      aria-label="Bodhan live radio"
      className="dock relative mx-auto grid w-full max-w-[680px] gap-x-4 gap-y-3 rounded-[22px] border border-[color:var(--accent)]/45 bg-[#1a0906]/70 p-3 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)] backdrop-blur-xl [grid-template-areas:'frame_info''ctrl_ctrl'] [grid-template-columns:104px_1fr] sm:[grid-template-columns:132px_1fr] sm:[grid-template-areas:'frame_info''frame_ctrl']"
    >
      {/* corner ornaments */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[7px] left-1/2 h-3.5 w-24 -translate-x-1/2 rounded-full bg-[color:var(--accent)]/90 [mask:radial-gradient(circle_at_50%_100%,transparent_5px,#000_6px)]"
      />

      {/* Audio only: the YouTube player plays underneath, covered by the record. */}
      <div className="relative h-[104px] w-[104px] self-center sm:h-[132px] sm:w-[132px] [grid-area:frame]">
        <div
          ref={hostRef}
          aria-hidden
          className="pointer-events-none absolute inset-2 overflow-hidden rounded-full [&>iframe]:h-full [&>iframe]:w-full"
        />
        <div className="absolute inset-0 z-10">
          <Record
            id={r.hasSongs ? np.id : undefined}
            spinning={r.status === "live"}
          />
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center [grid-area:info]">
        <div className="mb-1.5 flex items-center gap-2 text-[12px] font-medium tracking-wide text-ivory/85">
          <span
            className={`inline-block h-2 w-2 rounded-full bg-[#ff4b2b] ${r.listening ? "live-dot" : ""}`}
          />
          <span>{r.hasSongs ? statusText : "শিগগিরই"}</span>
        </div>
        {r.hasSongs ? (
          <>
            <h2 className="line-clamp-2 font-serif text-[17px] leading-snug text-ivory sm:text-[19px]">
              {np.title ?? "পুজোর গান"}
            </h2>
            <p className="mt-0.5 truncate text-[13px] text-ivory/65">
              {np.artist ?? (r.synced ? " " : "নন-স্টপ · Non-stop")}
            </p>
            {np.dur > 0 && (
              <>
                <div
                  className="mt-3 h-1 w-full overflow-hidden rounded-full bg-ivory/15"
                  aria-hidden
                >
                  <div
                    className="h-full rounded-full bg-[color:var(--accent)] transition-[width] duration-1000 ease-linear"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between text-[11px] tabular-nums text-ivory/55">
                  <span>{mmss(np.pos)}</span>
                  <span>-{mmss(left)}</span>
                </div>
              </>
            )}
            {np.next && (
              <p className="mt-1.5 truncate text-[12px] text-ivory/60">
                <span className="text-[color:var(--accent)]">এর পরে</span> ·{" "}
                {np.next}
              </p>
            )}
          </>
        ) : (
          <>
            <h2 className="font-serif text-[18px] leading-snug text-ivory">
              গানের তালিকা তৈরি হচ্ছে
            </h2>
            <p className="mt-1 text-[13px] text-ivory/65">
              Songs are being added. The radio goes live soon.
            </p>
          </>
        )}
      </div>

      <div className="flex items-center gap-2.5 [grid-area:ctrl] sm:self-end">
        {r.listening ? (
          <button
            type="button"
            onClick={r.pause}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-ivory/25 bg-ivory/10 font-medium text-ivory transition hover:bg-ivory/15"
          >
            <PauseIcon /> <span>থামান</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={r.join}
            disabled={!r.hasSongs}
            className="dhak-beat flex h-12 flex-1 items-center justify-center gap-2.5 rounded-full bg-[color:var(--accent)] px-4 font-serif text-[17px] text-[#2a1205] shadow-[0_0_30px_-4px_var(--accent)] transition hover:brightness-110 disabled:animate-none disabled:opacity-50"
          >
            <PlayIcon />
            <span className="leading-none">
              {r.status === "paused" ? "আবার শুনুন" : "ঢাকে কাঠি পড়ুক"}
              <span className="ml-2 hidden font-ui text-[12px] opacity-75 sm:inline">
                {r.status === "paused" ? "Rejoin live" : "Tap to listen"}
              </span>
            </span>
          </button>
        )}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Unmute" : "Mute"}
          className="grid h-12 w-12 place-items-center rounded-full border border-ivory/20 bg-ivory/5 text-ivory transition hover:bg-ivory/15 sm:hidden"
        >
          <VolumeIcon muted={muted} />
        </button>
        <label className="hidden items-center gap-2 text-ivory/80 sm:flex">
          <VolumeIcon muted={r.volume === 0} />
          <input
            type="range"
            min={0}
            max={100}
            value={r.volume}
            onChange={(e) => r.setVolume(Number(e.target.value))}
            className="vol w-24"
            style={{ ["--v" as string]: `${r.volume}%` }}
            aria-label="Volume"
          />
        </label>
        <button
          type="button"
          onClick={onShare}
          aria-label="Share"
          title={shareText}
          className="grid h-12 w-12 place-items-center rounded-full border border-ivory/20 bg-ivory/5 text-ivory transition hover:bg-ivory/15"
        >
          <ShareIcon />
        </button>
      </div>
    </section>
  );
}
