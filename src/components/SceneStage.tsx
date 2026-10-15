"use client";

import { memo, useEffect, useId, useState, useSyncExternalStore } from "react";
import assetsJson from "@/data/scene-assets.json";
import type { SceneDef, Pct } from "@/config/scenes";
import { COMPOSITIONS } from "./scenes/compositions";
import { Flame, Smoke, type Pt } from "./scenes/kit";

interface Variant {
  srcset: { webp: string; avif: string };
  fallback: string;
}
interface SceneAssets {
  d?: Variant;
  m?: Variant;
  video?: string;
  videoM?: string;
}
const ASSETS = assetsJson as Record<string, SceneAssets>;

const query = "(max-aspect-ratio: 1/1)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(query);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
export function usePortrait() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const toPx = (pts: Pct[] | undefined, W: number, H: number): Pt[] => (pts ?? []).map(([x, y]) => [(x / 100) * W, (y / 100) * H]);

/** One scene: an AI painting (if supplied) with motion overlays, or the code-drawn illustration. */
const SceneView = memo(function SceneView({ scene, portrait }: { scene: SceneDef; portrait: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const W = portrait ? 900 : 1600;
  const H = portrait ? 1600 : 900;
  const hs = portrait ? scene.hotspots.m : scene.hotspots.d;
  const smoke = toPx(hs.smoke, W, H);
  const flame = toPx(hs.flame, W, H);
  const a = ASSETS[scene.id];
  const img = a ? (portrait ? (a.m ?? a.d) : (a.d ?? a.m)) : undefined;
  const video = a ? (portrait ? (a.videoM ?? a.video) : a.video) : undefined;
  const [videoOk, setVideoOk] = useState(true);

  if (img) {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <div className="kenburns absolute inset-0">
          <picture>
            <source type="image/avif" srcSet={img.srcset.avif} sizes="100vw" />
            <source type="image/webp" srcSet={img.srcset.webp} sizes="100vw" />
            <img src={img.fallback} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </picture>
          {video && videoOk && (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onError={() => setVideoOk(false)}
            />
          )}
          {/* Motion overlays positioned by the scene's hotspots */}
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
            {smoke.map(([x, y], i) => (
              <Smoke key={`s${i}`} x={x} y={y} s={1.6} seed={i + 1} />
            ))}
            {flame.map(([x, y], i) => (
              <Flame key={`f${i}`} x={x} y={y} s={1.4} d={i * 0.3} />
            ))}
          </svg>
        </div>
      </div>
    );
  }

  const Comp = COMPOSITIONS[scene.id];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        className="kenburns absolute inset-0 h-full w-full"
        role="img"
        aria-label={scene.en}
      >
        {Comp ? <Comp W={W} H={H} uid={uid} P={portrait} smoke={smoke} flame={flame} /> : null}
      </svg>
    </div>
  );
});

/** Crossfades between scenes. Only the current and the outgoing scene are mounted. */
export const SceneStage = memo(function SceneStage({ scene }: { scene: SceneDef }) {
  const portrait = usePortrait();
  const [layers, setLayers] = useState<{ scene: SceneDef; on: boolean }[]>([{ scene, on: true }]);
  const [shown, setShown] = useState(scene.id);

  if (shown !== scene.id) {
    setShown(scene.id);
    setLayers((ls) => [...ls.filter((l) => l.scene.id !== scene.id).slice(-1), { scene, on: false }]);
  }

  useEffect(() => {
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setLayers((ls) => ls.map((l) => (l.scene.id === shown ? { ...l, on: true } : l)))),
    );
    const t = window.setTimeout(() => setLayers((ls) => ls.filter((l) => l.scene.id === shown)), 2000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [shown]);

  return (
    <div className="absolute inset-0" aria-hidden={false}>
      {layers.map((l) => (
        <div
          key={l.scene.id}
          className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out"
          style={{ opacity: l.on ? 1 : 0, zIndex: l.scene.id === shown ? 2 : 1 }}
        >
          <SceneView scene={l.scene} portrait={portrait} />
        </div>
      ))}
    </div>
  );
});
