"use client";

// Optional helper: paste YouTube links, get them back with their lengths for config/songs.ts. Runs in your browser using
// YouTube's own player, so it needs no API key. It reads each video's real
// title, channel and length, and flags videos whose owners block embedding.

import { useRef, useState } from "react";
import { videoIdFrom } from "@/lib/schedule";
import { loadYouTube, type YTPlayer } from "@/lib/youtube";
import { PHASES } from "@/config/tithis";

interface Row {
  input: string;
  id: string | null;
  tags: string[];
  status: "waiting" | "reading" | "ok" | "blocked" | "invalid";
  title?: string;
  artist?: string;
  duration?: number;
}

const TAGS = PHASES.map((p) => p.id) as string[];


function parse(text: string): Row[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, ...rest] = line.split(/[\s,]+/);
      const tags = rest.map((t) => t.toLowerCase()).filter((t) => TAGS.includes(t));
      const id = videoIdFrom(url);
      return { input: line, id, tags, status: id ? "waiting" : "invalid" } as Row;
    });
}

export default function PlaylistBuilder() {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const handlers = useRef<{ state?: (s: number) => void; error?: (c: number) => void }>({});

  async function ensurePlayer() {
    if (playerRef.current) return playerRef.current;
    const YT = await loadYouTube();
    const mount = document.createElement("div");
    hostRef.current!.appendChild(mount);
    return new Promise<YTPlayer>((resolve) => {
      const p = new YT.Player(mount, {
        width: "100%",
        height: "100%",
        host: "https://www.youtube-nocookie.com",
        playerVars: { playsinline: 1, controls: 1, rel: 0 },
        events: {
          onReady: () => {
            playerRef.current = p;
            resolve(p);
          },
          onStateChange: (e) => handlers.current.state?.(e.data),
          onError: (e) => handlers.current.error?.(e.data),
        },
      });
    });
  }

  function readOne(p: YTPlayer, id: string): Promise<Partial<Row>> {
    return new Promise((resolve) => {
      let done = false;
      const finish = (r: Partial<Row>) => {
        if (done) return;
        done = true;
        handlers.current = {};
        try {
          p.pauseVideo();
        } catch {
          /* ignore */
        }
        resolve(r);
      };
      const tryRead = () => {
        const d = p.getDuration();
        if (d > 0) {
          const v = p.getVideoData();
          finish({ status: "ok", duration: Math.round(d), title: v.title, artist: v.author });
          return true;
        }
        return false;
      };
      handlers.current = {
        state: (s) => {
          if (s === 5 || s === 1 || s === 2 || s === 3) tryRead();
        },
        error: () => finish({ status: "blocked" }),
      };
      p.mute();
      p.loadVideoById({ videoId: id, startSeconds: 0 });
      const poll = window.setInterval(() => {
        if (done || tryRead()) window.clearInterval(poll);
      }, 400);
      window.setTimeout(() => {
        window.clearInterval(poll);
        finish({ status: "blocked" });
      }, 15000);
    });
  }

  async function run() {
    const parsed = parse(text);
    setRows(parsed);
    if (!parsed.some((r) => r.id)) return;
    setBusy(true);
    const p = await ensurePlayer();
    const out = [...parsed];
    for (let i = 0; i < out.length; i++) {
      if (!out[i].id) continue;
      out[i] = { ...out[i], status: "reading" };
      setRows([...out]);
      const res = await readOne(p, out[i].id!);
      out[i] = { ...out[i], ...res };
      setRows([...out]);
    }
    try {
      p.stopVideo();
    } catch {
      /* ignore */
    }
    setBusy(false);
  }

  const good = rows.filter((r) => r.status === "ok");
  const mmss = (d = 0) => `${Math.floor(d / 60)}:${String(d % 60).padStart(2, "0")}`;
  const lines = good.map((r) => `https://youtu.be/${r.id} | ${mmss(r.duration)}${r.tags.length ? ` | ${r.tags.join(" ")}` : ""}   // ${(r.title ?? "").replace(/`/g, "'")}`).join("\n");
  const json = `export const SONG_LINKS = \`\n${lines}\n\`;`;

  const download = () => {
    const blob = new Blob([json + "\n"], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "song-links.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <main className="min-h-screen bg-[#140906] px-4 py-8 text-ivory">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-5xl text-gold">বোধন</h1>
        <p className="mt-1 font-serif text-xl">Song lengths tool (optional)</p>
        <p className="mt-2 text-sm text-ivory/70">You don&apos;t need this for the radio to work. It adds each song&apos;s length to your list, which makes every visitor hear exactly the same second of the same song.</p>
        <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-ivory/75">
          <li>Paste one YouTube link per line. Optionally add tithi tags after it, e.g. <code className="text-gold">https://youtu.be/abc123xyz00 ashtami navami</code></li>
          <li>Press &ldquo;Read videos&rdquo;. Each video is loaded (muted) to read its real title and length.</li>
          <li>Copy the result and paste it over the <code className="text-gold">SONG_LINKS</code> block in <code className="text-gold">src/config/songs.ts</code>, then redeploy.</li>
        </ol>
        <p className="mt-2 text-xs text-ivory/55">Tags: {TAGS.join(", ")}. Videos marked &ldquo;blocked&rdquo; don&apos;t allow embedding; find another upload of that song.</p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={"https://www.youtube.com/watch?v=...\nhttps://youtu.be/... ashtami"}
          className="mt-5 w-full rounded-xl border border-gold/30 bg-black/40 p-3 font-mono text-sm outline-none focus:border-gold"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" onClick={run} disabled={busy || !text.trim()} className="rounded-full bg-gold px-5 py-2.5 font-medium text-[#2a1205] disabled:opacity-50">
            {busy ? "Reading…" : "Read videos"}
          </button>
          {good.length > 0 && !busy && (
            <>
              <button type="button" onClick={download} className="rounded-full border border-gold/50 px-5 py-2.5">
                Download as text
              </button>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(json);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1500);
                }}
                className="rounded-full border border-ivory/30 px-5 py-2.5"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </>
          )}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-[220px_1fr]">
          <div ref={hostRef} className="h-[200px] w-[220px] overflow-hidden rounded-xl bg-black [&>iframe]:h-full [&>iframe]:w-full" />
          <ul className="space-y-1.5 text-sm">
            {rows.map((r, i) => (
              <li key={i} className="flex items-start gap-2 rounded-lg bg-black/30 px-3 py-2">
                <span
                  className={`mt-0.5 shrink-0 rounded px-1.5 text-[11px] uppercase ${
                    r.status === "ok" ? "bg-emerald-700" : r.status === "blocked" || r.status === "invalid" ? "bg-red-800" : "bg-ivory/20"
                  }`}
                >
                  {r.status}
                </span>
                <span className="min-w-0">
                  <span className="block truncate">{r.title ?? r.input}</span>
                  {r.status === "ok" && (
                    <span className="text-xs text-ivory/60">
                      {r.artist} · {Math.floor((r.duration ?? 0) / 60)}:{String((r.duration ?? 0) % 60).padStart(2, "0")}
                      {r.tags.length > 0 && ` · ${r.tags.join(", ")}`}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {good.length > 0 && <pre className="mt-6 max-h-80 overflow-auto rounded-xl bg-black/50 p-3 text-xs">{json}</pre>}
      </div>
    </main>
  );
}
