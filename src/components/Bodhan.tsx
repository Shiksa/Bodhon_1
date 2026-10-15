"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import { site } from "@/config/site";
import { scenesFor } from "@/config/scenes";
import { SCENE_ROTATE_MS } from "@/config/tithis";
import {
  bn,
  currentPhase,
  currentSlot,
  greetingAt,
  now,
  syncClock,
} from "@/lib/time";
import { Countdown } from "./Countdown";
import { ChevronIcon } from "./Icons";
import { Overlays } from "./Overlays";
import { RadioDock } from "./RadioDock";
import { SceneStage } from "./SceneStage";

interface Params {
  tithi?: string | null;
  scene?: string | null;
  og?: string | null; // "1" = share card for this tithi, "default" = generic card
}

/** Keeps the greeting on one line, shrinking it to fit narrow screens. */
function FitLine({
  children,
  max,
  className,
}: {
  children: ReactNode;
  max: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    const fit = () => {
      el.style.fontSize = `${max}px`;
      const avail = parent.clientWidth * 0.96;
      el.style.fontSize = `${Math.max(30, Math.min(max, (max * avail) / Math.max(1, el.scrollWidth)))}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    void document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [children, max]);
  return (
    <span
      ref={ref}
      className={`inline-block whitespace-nowrap ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

function BrandPlaque({ side }: { side: "left" | "right" }) {
  const b = site.brands[side];
  return (
    <a
      href={b.href}
      target="_blank"
      rel="noopener"
      aria-label={b.name}
      className="shola block rounded-xl px-2.5 py-1.5 shadow-[0_6px_20px_-6px_rgba(0,0,0,0.6)] transition hover:-translate-y-0.5"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={b.logo} alt={b.name} className="h-7 w-auto sm:h-9" />
    </a>
  );
}

const noop = () => () => {};

export default function Bodhan() {
  // false during the static render and hydration, true once running in the browser
  const hydrated = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const search = useSyncExternalStore(
    noop,
    () => window.location.search,
    () => "",
  );
  const params = useMemo<Params | null>(() => {
    if (!hydrated) return null;
    const q = new URLSearchParams(search);
    return { tithi: q.get("tithi"), scene: q.get("scene"), og: q.get("og") };
  }, [hydrated, search]);
  const [t, setT] = useState(() => Date.now());
  // Scene and caption counters are tied to the phase they were counted in, so they reset on a new phase.
  const [sceneState, setSceneState] = useState({ phase: "", n: 0 });
  const [captionState, setCaptionState] = useState({ phase: "", n: 0 });
  const [toast, setToast] = useState<string | null>(null);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );
  const rotateTimer = useRef<number | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  // Preview params: ?tithi=ashtami&scene=ashtami-sandhi&og=1
  useEffect(() => {
    syncClock().then(() => setT(now()));
    const id = window.setInterval(() => setT(now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const phase = currentPhase(t, params?.tithi);
  const greeting = greetingAt(t, params?.tithi ? phase : null);
  if (sceneState.phase !== phase.id) setSceneState({ phase: phase.id, n: 0 });
  if (captionState.phase !== phase.id)
    setCaptionState({ phase: phase.id, n: 0 });
  const sceneStep = sceneState.n;
  const captionIdx = captionState.n;
  const setSceneStep = useCallback(
    (f: (n: number) => number) =>
      setSceneState((st) => ({ ...st, n: f(st.n) })),
    [],
  );
  const scenes = useMemo(() => scenesFor(phase.id), [phase.id]);
  const slot = currentSlot(t);
  const firstIdx = Math.max(
    0,
    scenes.findIndex((s) => s.slot === slot),
  );
  const forced = params?.scene
    ? scenes.findIndex((s) => s.id === params.scene)
    : -1;
  const idx =
    forced >= 0
      ? forced
      : (((firstIdx + sceneStep) % scenes.length) + scenes.length) %
        scenes.length;
  const scene = scenes[idx];

  const armRotation = useCallback(() => {
    if (rotateTimer.current) window.clearInterval(rotateTimer.current);
    rotateTimer.current = window.setInterval(
      () => setSceneStep((n) => n + 1),
      SCENE_ROTATE_MS,
    );
  }, [setSceneStep]);
  useEffect(() => {
    armRotation();
    return () => {
      if (rotateTimer.current) window.clearInterval(rotateTimer.current);
    };
  }, [armRotation]);

  useEffect(() => {
    const id = window.setInterval(
      () => setCaptionState((st) => ({ ...st, n: st.n + 1 })),
      9000,
    );
    return () => window.clearInterval(id);
  }, []);
  const caption = phase.captions[captionIdx % phase.captions.length];

  const step = useCallback(
    (d: number) => {
      setSceneStep((n) => n + d);
      armRotation();
    },
    [armRotation, setSceneStep],
  );

  const shareUrl = `${site.url}/t/${phase.id}/`;
  const shareText = `${greeting.bn} · ${site.nameBn}\n${caption.bn}\nপুজোর গান, নন-স্টপ। তুমিও শোনো:`;
  const onShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${greeting.bn} · ${site.nameBn}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      }
    } catch {
      return; // user cancelled
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setToast("লিংক কপি হয়েছে · Link copied");
    } catch {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
        "_blank",
        "noopener",
      );
    }
    window.setTimeout(() => setToast(null), 2200);
  }, [greeting.bn, shareText, shareUrl]);

  // Dashami: tap anywhere on the scene for a puff of sindoor.
  const onSceneTap = (e: React.PointerEvent) => {
    if (phase.id !== "dashami") return;
    if ((e.target as HTMLElement).closest("button,a,section,input")) return;
    const id = Date.now() + Math.random();
    setBursts((b) => [...b.slice(-4), { id, x: e.clientX, y: e.clientY }]);
    window.setTimeout(
      () => setBursts((b) => b.filter((x) => x.id !== id)),
      1600,
    );
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0].clientX - touch.current.x;
    const dy = e.changedTouches[0].clientY - touch.current.y;
    touch.current = null;
    if ((e.target as HTMLElement).closest("section")) return;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4)
      step(dx < 0 ? 1 : -1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const vars = {
    "--accent": phase.palette.accent,
    "--glow": phase.palette.glow,
  } as CSSProperties;

  // Before mount we don't know the visitor's tithi or screen shape: show a calm splash.
  if (!params) {
    return (
      <main
        className="grid h-[100svh] place-items-center bg-[#120806]"
        style={vars}
      >
        <h1 className="title-glow font-display text-7xl text-ivory/90">
          {site.nameBn}
        </h1>
      </main>
    );
  }

  const og = !!params.og;
  const ogDefault = params.og === "default";

  return (
    <main
      className="relative h-[100svh] w-full select-none overflow-hidden bg-[#120806] text-ivory"
      style={vars}
      onPointerDown={onSceneTap}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <SceneStage scene={scene} />
      {!og && <Overlays kinds={scene.overlays} />}
      <div className="scrim-top pointer-events-none absolute inset-x-0 top-0 h-[42%]" />
      <div className="scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 h-[46%]" />

      {bursts.map((b) => (
        <div
          key={b.id}
          className="pointer-events-none absolute z-40"
          style={{ left: b.x, top: b.y }}
        >
          {Array.from({ length: 26 }, (_, i) => {
            const a = (i / 26) * Math.PI * 2;
            const d = 60 + ((i * 37) % 70);
            return (
              <span
                key={i}
                className="burst"
                style={
                  {
                    ["--dx" as string]: `${Math.cos(a) * d}px`,
                    ["--dy" as string]: `${Math.sin(a) * d - 30}px`,
                    ["--s" as string]: `${2 + (i % 3)}`,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col px-3 pb-3 pt-3 sm:px-6 sm:pb-5 sm:pt-5">
        {/* Brand row: RSC left, Saltbuzz right */}
        <header className="flex items-start justify-between">
          <BrandPlaque side="left" />
          <BrandPlaque side="right" />
        </header>

        {/* Title block, on a soft dark halo so it reads over bright daytime skies */}
        <div className="relative mt-1 flex flex-col items-center text-center sm:-mt-8">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-10 -inset-y-6 -z-10 bg-[radial-gradient(closest-side,rgba(18,7,3,0.62),rgba(18,7,3,0.3)_60%,transparent)] sm:-inset-x-24"
          />
          {/* small: the site name, in Bengali and English */}
          <div className="flex items-center gap-2.5 text-ivory/85">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[color:var(--accent)] sm:w-12" />
            <span
              className={`font-display leading-none text-ivory ${og ? "text-[40px]" : "text-[24px] sm:text-[30px]"}`}
            >
              {site.nameBn}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.34em] text-ivory/65 sm:text-[11px]">
              {site.name}
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[color:var(--accent)] sm:w-12" />
          </div>
          {/* big: the greeting for the day, on one line */}
          <h1 className="w-full max-w-[1100px] px-1">
            <FitLine
              max={og ? 140 : 112}
              className="title-glow font-display leading-[1.15] text-ivory"
            >
              {ogDefault ? site.nameBn : greeting.bn}
            </FitLine>
          </h1>
          <p
            className={`-mt-1 font-semibold uppercase tracking-[0.3em] text-[color:var(--accent)] ${og ? "text-lg" : "text-[11px] sm:text-[12.5px]"}`}
          >
            {ogDefault ? site.taglineEn : greeting.en}
          </p>
          <div
            key={`${phase.id}-${captionIdx}`}
            className={`caption-in mt-1 px-2 ${og ? "max-w-[60ch]" : "max-w-[34ch]"}`}
          >
            <p
              className={`font-serif leading-snug text-ivory ${og ? "text-[30px]" : "text-[17px] sm:text-[21px]"}`}
            >
              {ogDefault ? site.taglineBn : caption.bn}
            </p>
            <p
              className={`mt-0.5 italic text-ivory/65 ${og ? "text-xl" : "text-[12.5px] sm:text-sm"}`}
            >
              {ogDefault ? site.taglineEn : caption.en}
            </p>
          </div>
          {!og && (
            <div className="mt-3">
              <Countdown />
            </div>
          )}
        </div>

        <div className="flex-1" />

        {!og && (
          <>
            {/* Scene switcher */}
            <div className="pointer-events-none absolute inset-x-1 top-[44%] flex items-center justify-between text-[12.5px] text-ivory/80 sm:pointer-events-auto sm:static sm:mb-2 sm:justify-center sm:gap-2">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous scene"
                className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full bg-black/30 backdrop-blur hover:bg-black/50"
              >
                <ChevronIcon dir="left" width={16} height={16} />
              </button>
              <span className="hidden min-w-[9.5rem] rounded-full bg-black/30 px-3 py-1 text-center font-serif backdrop-blur sm:inline">
                {scene.bn}{" "}
                <span className="opacity-60">
                  · {bn(idx + 1)}/{bn(scenes.length)}
                </span>
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next scene"
                className="pointer-events-auto grid h-8 w-8 place-items-center rounded-full bg-black/30 backdrop-blur hover:bg-black/50"
              >
                <ChevronIcon width={16} height={16} />
              </button>
            </div>

            <RadioDock phase={phase} shareText={shareText} onShare={onShare} />

            <footer className="mt-2 text-center text-[10.5px] leading-relaxed text-ivory/45">
              গান বাজে ইউটিউবের নিজস্ব প্লেয়ারে, এখানে কোনো অডিও রাখা নেই ·{" "}
              {site.credit.text}
              {site.credit.instagram && (
                <>
                  {" · "}
                  <a
                    href={site.credit.instagram}
                    target="_blank"
                    rel="noopener"
                    className="underline-offset-2 hover:underline"
                  >
                    Instagram
                  </a>
                </>
              )}
            </footer>
          </>
        )}
      </div>

      {toast && (
        <div className="absolute bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-sm text-ivory backdrop-blur">
          {toast}
        </div>
      )}
    </main>
  );
}
