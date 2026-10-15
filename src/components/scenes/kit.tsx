// ─────────────────────────────────────────────────────────────────────────────
// SHOLA-CUT SCENE KIT
// A small library of layered, paper-cut style SVG elements. Every scene in
// compositions.tsx is assembled from these. Motion is CSS (see globals.css,
// classes starting with `fx-`), so it pauses automatically under
// prefers-reduced-motion.
// ─────────────────────────────────────────────────────────────────────────────
import type { CSSProperties, ReactNode } from "react";
import type { Slot } from "@/config/tithis";

export type Pt = [number, number];

/** Deterministic random numbers so every visitor sees the same scene. */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Tones {
  sky: [string, string, string, string];
  far: string;
  mid: string;
  near: string;
  ground: string;
  haze: string;
  light: string;
  skin: string;
  cloth: string; // white saree / dhoti, toned for the light
  water: [string, string];
}

export const TONES: Record<Slot, Tones> = {
  bhor: {
    sky: ["#1b2150", "#5e4478", "#e3907a", "#f8d59c"],
    far: "#7a5671",
    mid: "#4b3153",
    near: "#24152b",
    ground: "#2c1a26",
    haze: "#eaa98c",
    light: "#ffd9a0",
    skin: "#3a2230",
    cloth: "#d9c6c0",
    water: ["#c98a86", "#3a2a4a"],
  },
  dupur: {
    sky: ["#3d7cbf", "#79aedc", "#cfe2ee", "#f6ecd3"],
    far: "#a88a82",
    mid: "#74443a",
    near: "#3c1e18",
    ground: "#5c2d1f",
    haze: "#f3e5cb",
    light: "#fff2cc",
    skin: "#4a2a20",
    cloth: "#f2e9da",
    water: ["#a9c9dc", "#4f7187"],
  },
  sondhe: {
    sky: ["#2a1442", "#7a2e52", "#df5e39", "#f7b04b"],
    far: "#7c3249",
    mid: "#4a1931",
    near: "#21091a",
    ground: "#2b0d13",
    haze: "#f08b4c",
    light: "#ffcf7a",
    skin: "#2e0f1c",
    cloth: "#e7c0a6",
    water: ["#e88a50", "#3a1230"],
  },
  raat: {
    sky: ["#04050e", "#0d1231", "#1d1c46", "#3b2a57"],
    far: "#211c3e",
    mid: "#15102a",
    near: "#0a0710",
    ground: "#0d0915",
    haze: "#5b4079",
    light: "#ffd27a",
    skin: "#1c1424",
    cloth: "#5a4a63",
    water: ["#2a2350", "#07060f"],
  },
};

export const RED = "#d42a1e";
export const SINDOOR = "#e3261a";
export const GOLD = "#f2c14e";
export const IVORY = "#fbf1dc";

const sv = (o: Record<string, string | number>) => o as unknown as CSSProperties;

// ── SKY ─────────────────────────────────────────────────────────────────────

export function Sky({ W, H, slot, uid, seed = 1 }: { W: number; H: number; slot: Slot; uid: string; seed?: number }) {
  const t = TONES[slot];
  const r = rng(seed);
  const stars =
    slot === "raat"
      ? Array.from({ length: 90 }, () => [r() * W, r() * H * 0.6, r() * 1.6 + 0.4, r() * 4] as const)
      : [];
  const portrait = H > W;
  return (
    <g>
      <defs>
        <linearGradient id={`sky${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.sky[0]} />
          <stop offset="0.45" stopColor={t.sky[1]} />
          <stop offset="0.78" stopColor={t.sky[2]} />
          <stop offset="1" stopColor={t.sky[3]} />
        </linearGradient>
        <radialGradient id={`orb${uid}`}>
          <stop offset="0" stopColor={slot === "raat" ? "#fff8e6" : "#fff4d6"} stopOpacity="1" />
          <stop offset="0.25" stopColor={slot === "raat" ? "#fff2cc" : "#ffd27a"} stopOpacity="0.55" />
          <stop offset="1" stopColor={t.sky[2]} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#sky${uid})`} />
      {stars.map(([x, y, rr, d], i) => (
        <circle key={i} cx={x} cy={y} r={rr} fill="#fff6e0" className="fx-twinkle" style={{ animationDelay: `${d}s` }} />
      ))}
      {slot === "raat" && (
        <g>
          <circle cx={W * (portrait ? 0.78 : 0.82)} cy={H * 0.16} r={170} fill={`url(#orb${uid})`} opacity="0.5" />
          <circle cx={W * (portrait ? 0.78 : 0.82)} cy={H * 0.16} r={34} fill="#fbf0d4" />
        </g>
      )}
      {slot === "sondhe" && (
        <g>
          <circle cx={W * 0.5} cy={H * 0.62} r={420} fill={`url(#orb${uid})`} opacity="0.75" />
          <circle cx={W * 0.5} cy={H * 0.62} r={70} fill="#ffd98a" opacity="0.9" />
        </g>
      )}
      {slot === "bhor" && (
        <g>
          <circle cx={W * 0.3} cy={H * 0.66} r={380} fill={`url(#orb${uid})`} opacity="0.7" />
          <circle cx={W * 0.3} cy={H * 0.66} r={48} fill="#ffe3b0" opacity="0.95" />
        </g>
      )}
    </g>
  );
}

/** Sharat (autumn) cumulus, the pnenja tulo clouds of pujo season. */
export function Clouds({ W, H, slot, seed = 3, count = 5 }: { W: number; H: number; slot: Slot; seed?: number; count?: number }) {
  const r = rng(seed);
  const fill = slot === "dupur" ? "#fffdf7" : slot === "bhor" ? "#f6c7b3" : slot === "sondhe" ? "#f39a6e" : "#2b2550";
  const shade = slot === "dupur" ? "#dfe7ef" : slot === "bhor" ? "#c9909a" : slot === "sondhe" ? "#b4506a" : "#1a1638";
  return (
    <g opacity={slot === "raat" ? 0.7 : 0.95}>
      {Array.from({ length: count }, (_, i) => {
        const cx = (W / count) * i + r() * (W / count);
        const cy = H * (0.08 + r() * 0.3);
        const s = 0.6 + r() * 0.9;
        const puffs = Array.from({ length: 7 }, () => [(r() - 0.5) * 220 * s, (r() - 0.6) * 50 * s, (36 + r() * 48) * s] as const);
        return (
          <g key={i} className="fx-drift" style={{ animationDelay: `${-r() * 60}s`, animationDuration: `${50 + r() * 40}s` }}>
            <ellipse cx={cx} cy={cy + 30 * s} rx={150 * s} ry={22 * s} fill={shade} />
            {puffs.map(([dx, dy, rr], j) => (
              <circle key={j} cx={cx + dx} cy={cy + dy} r={rr} fill={fill} />
            ))}
            <ellipse cx={cx} cy={cy + 24 * s} rx={140 * s} ry={18 * s} fill={fill} />
          </g>
        );
      })}
    </g>
  );
}

/** A soft horizontal band of atmosphere between depth layers. */
export function Haze({ W, y, h, color, opacity = 0.45, uid }: { W: number; y: number; h: number; color: string; opacity?: number; uid: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`hz${uid}${Math.round(y)}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0" />
          <stop offset="1" stopColor={color} stopOpacity={opacity} />
        </linearGradient>
      </defs>
      <rect x={0} y={y - h} width={W} height={h} fill={`url(#hz${uid}${Math.round(y)})`} />
    </g>
  );
}

// ── ARCHITECTURE ────────────────────────────────────────────────────────────

/** Curved Bengali chala roof, the signature of terracotta temples. */
export function chala(x: number, y: number, w: number, h: number) {
  return `M${x - w * 0.04},${y} Q${x + w / 2},${y - h * 0.32} ${x + w * 1.04},${y} L${x + w * 0.86},${y - h * 0.62} Q${x + w / 2},${y - h * 1.02} ${x + w * 0.14},${y - h * 0.62} Z`;
}

export function Aatchala({ x, y, s = 1, c, lit }: { x: number; y: number; s?: number; c: string; lit?: string }) {
  const w = 120 * s;
  return (
    <g fill={c}>
      <rect x={x} y={y - 70 * s} width={w} height={70 * s} />
      <path d={chala(x, y - 70 * s, w, 70 * s)} />
      <rect x={x + w * 0.28} y={y - 158 * s} width={w * 0.44} height={34 * s} />
      <path d={chala(x + w * 0.24, y - 124 * s, w * 0.52, 44 * s)} />
      <path d={chala(x + w * 0.24, y - 158 * s, w * 0.52, 40 * s)} />
      <rect x={x + w * 0.485} y={y - 205 * s} width={w * 0.03} height={30 * s} />
      <circle cx={x + w / 2} cy={y - 205 * s} r={4 * s} />
      {lit &&
        [0.2, 0.5, 0.8].map((f) => (
          <path key={f} d={`M${x + w * f - 8 * s},${y} v${-26 * s} a${8 * s},${8 * s} 0 0 1 ${16 * s},0 v${26 * s} z`} fill={lit} opacity="0.85" />
        ))}
    </g>
  );
}

/** Row of old north-Kolkata houses: balconies, shutters, water tanks, a temple, palms. */
export function Skyline({ W, y, c, seed = 7, lit, temple = true, density = 1, maxH = 1 }: { W: number; y: number; c: string; seed?: number; lit?: string; temple?: boolean; density?: number; maxH?: number }) {
  const r = rng(seed);
  const items: ReactNode[] = [];
  let x = -20;
  let i = 0;
  const templeAt = W * (0.15 + r() * 0.6);
  let templeDone = !temple;
  while (x < W + 20) {
    i++;
    if (!templeDone && x > templeAt) {
      items.push(<Aatchala key={`t${i}`} x={x} y={y} s={0.9} c={c} lit={lit} />);
      x += 120 * 0.9 + 10;
      templeDone = true;
      continue;
    }
    if (r() < 0.16) {
      // coconut palm
      const ph = (130 + r() * 90) * maxH;
      const lean = (r() - 0.5) * 30;
      items.push(
        <g key={`p${i}`} stroke={c} fill={c}>
          <path d={`M${x},${y} Q${x + lean * 0.4},${y - ph * 0.6} ${x + lean},${y - ph}`} strokeWidth="6" fill="none" />
          {[-150, -115, -70, -35, 0, 35, 70, 110, 150].map((a) => {
            const rad = ((a - 90) * Math.PI) / 180;
            const L = 46 + (Math.abs(a) > 100 ? 8 : 0);
            const ex = x + lean + Math.cos(rad) * L;
            const ey = y - ph + Math.sin(rad) * L * 0.55 + (Math.abs(a) > 60 ? 18 : 0);
            return <path key={a} d={`M${x + lean},${y - ph} Q${(x + lean + ex) / 2},${y - ph - 14} ${ex},${ey}`} strokeWidth="5" fill="none" strokeLinecap="round" />;
          })}
        </g>,
      );
      x += 40 / density;
      continue;
    }
    const w = 70 + r() * 90;
    const h = (60 + r() * 130) * maxH;
    const floors = Math.max(1, Math.floor(h / 48));
    items.push(
      <g key={`h${i}`}>
        <rect x={x} y={y - h} width={w} height={h} fill={c} />
        <rect x={x - 4} y={y - h - 6} width={w + 8} height={8} fill={c} />
        {r() < 0.4 && <rect x={x + w * 0.6} y={y - h - 30} width={26} height={24} rx={3} fill={c} />}
        {Array.from({ length: floors }, (_, f) => {
          const fy = y - h + 14 + f * 48;
          return (
            <g key={f}>
              {r() < 0.6 && <rect x={x - 6} y={fy + 26} width={w + 12} height={4} fill={c} />}
              {lit &&
                Array.from({ length: Math.floor(w / 30) }, (_, k) =>
                  r() < 0.55 ? (
                    <path
                      key={k}
                      d={`M${x + 10 + k * 30},${fy + 24} v-14 a6,6 0 0 1 12,0 v14 z`}
                      fill={lit}
                      opacity={0.5 + r() * 0.5}
                      className={r() < 0.12 ? "fx-twinkle" : undefined}
                    />
                  ) : null,
                )}
            </g>
          );
        })}
      </g>,
    );
    x += w + (r() < 0.3 ? 8 : 0) / density;
  }
  return <g>{items}</g>;
}

/** Howrah Bridge, the cantilever silhouette over the Hooghly. */
export function HowrahBridge({ x, y, w, c }: { x: number; y: number; w: number; c: string }) {
  const h = w * 0.3;
  const t1 = x + w * 0.27;
  const t2 = x + w * 0.73;
  const chord = `M${x},${y - h * 0.22} L${t1},${y - h} L${x + w * 0.42},${y - h * 0.62} L${x + w * 0.5},${y - h * 0.5} L${x + w * 0.58},${y - h * 0.62} L${t2},${y - h} L${x + w},${y - h * 0.22}`;
  const webs: string[] = [];
  const N = 22;
  for (let k = 0; k <= N; k++) {
    const fx = x + (w * k) / N;
    webs.push(`M${fx},${y} L${fx + (k % 2 ? 1 : -1) * (w / N) * 0.5},${y - h * 0.2}`);
  }
  return (
    <g stroke={c} fill="none" strokeLinejoin="round">
      <path d={chord} strokeWidth={w * 0.012} />
      <path d={`M${x},${y} L${x + w},${y}`} strokeWidth={w * 0.014} />
      {webs.map((d, i) => (
        <path key={i} d={d} strokeWidth={w * 0.004} />
      ))}
      {[t1, t2].map((tx) => (
        <path key={tx} d={`M${tx - w * 0.02},${y + h * 0.15} L${tx - w * 0.008},${y - h} L${tx + w * 0.008},${y - h} L${tx + w * 0.02},${y + h * 0.15} Z`} fill={c} />
      ))}
      {Array.from({ length: 12 }, (_, k) => {
        const fx = x + (w * (k + 0.5)) / 12;
        return <path key={`v${k}`} d={`M${fx},${y} L${fx},${y - h * 0.18}`} strokeWidth={w * 0.004} />;
      })}
    </g>
  );
}

/** River with shimmering light streaks. */
export function River({ W, y, H, slot, uid, reflectX }: { W: number; y: number; H: number; slot: Slot; uid: string; reflectX?: number }) {
  const t = TONES[slot];
  const r = rng(11);
  return (
    <g>
      <defs>
        <linearGradient id={`rv${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.water[0]} />
          <stop offset="1" stopColor={t.water[1]} />
        </linearGradient>
      </defs>
      <rect x={0} y={y} width={W} height={H - y} fill={`url(#rv${uid})`} />
      {Array.from({ length: 46 }, (_, i) => {
        const yy = y + 6 + Math.pow(r(), 1.6) * (H - y);
        const near = reflectX !== undefined && r() < 0.5;
        const xx = near ? reflectX + (r() - 0.5) * 140 : r() * W;
        const len = 20 + r() * 90;
        return (
          <rect
            key={i}
            x={xx}
            y={yy}
            width={len}
            height={2}
            rx={1}
            fill={slot === "dupur" ? "#ffffff" : t.light}
            opacity={0.35}
            className="fx-shimmer"
            style={{ animationDelay: `${r() * 3}s` }}
          />
        );
      })}
    </g>
  );
}

/** Ghat steps with a small pillared chandni pavilion. */
export function Ghat({ x, y, w, c, steps = 6, pavilion = true, stepH = 14 }: { x: number; y: number; w: number; c: string; steps?: number; pavilion?: boolean; stepH?: number }) {
  return (
    <g fill={c}>
      {Array.from({ length: steps }, (_, i) => (
        <rect key={i} x={x - i * 6} y={y + i * stepH} width={w + i * 12} height={stepH + 1} opacity={1 - i * 0.04} />
      ))}
      {pavilion && (
        <g>
          <rect x={x + w * 0.2} y={y - 18} width={w * 0.6} height={18} />
          <path d={chala(x + w * 0.18, y - 120, w * 0.64, 60)} />
          <rect x={x + w * 0.2} y={y - 126} width={w * 0.6} height={10} />
          {[0, 1, 2, 3].map((k) => (
            <rect key={k} x={x + w * 0.22 + k * (w * 0.18)} y={y - 118} width={10} height={100} />
          ))}
        </g>
      )}
    </g>
  );
}

// ── PLANTS ──────────────────────────────────────────────────────────────────

/** One kash phool stalk: a thin reed topped by a silky, drooping plume. Sways from its base. */
export function KashStalk({ x, y, h, c, plume, d = 0, lean = 0 }: { x: number; y: number; h: number; c: string; plume: string; d?: number; lean?: number }) {
  const tx = x + lean;
  const ty = y - h;
  const L = h * 0.34; // plume length
  const dir = lean >= 0 ? 1 : -1;
  return (
    <g className="fx-sway" style={sv({ transformOrigin: `${x}px ${y}px`, animationDelay: `${-d}s`, "--sw": `${1.6 + (d % 2)}deg` })}>
      <path d={`M${x},${y} Q${x + lean * 0.2},${y - h * 0.5} ${tx},${ty}`} stroke={c} strokeWidth={1.8} fill="none" />
      <path d={`M${x},${y - h * 0.25} q${-dir * 22},-30 ${-dir * 34},-36`} stroke={c} strokeWidth={1.6} fill="none" opacity="0.8" />
      {/* the plume: a silky tuft that rises and droops over to one side */}
      <path
        d={`M${tx - 2},${ty} C${tx - 3},${ty - L * 0.6} ${tx + dir * L * 0.25},${ty - L * 1.05} ${tx + dir * L * 0.55},${ty - L * 0.75} C${tx + dir * L * 0.3},${ty - L * 0.62} ${tx + dir * 6},${ty - L * 0.3} ${tx + 2},${ty} Z`}
        fill={plume}
        opacity="0.5"
      />
      {[0, 0.18, 0.36, 0.54, 0.72, 0.9].map((k, i) => (
        <path
          key={i}
          d={`M${tx},${ty} C${tx + dir * k * 4},${ty - L * (0.55 + k * 0.1)} ${tx + dir * L * (0.12 + k * 0.18)},${ty - L * (1.0 - k * 0.12)} ${tx + dir * L * (0.32 + k * 0.32)},${ty - L * (0.82 - k * 0.42)}`}
          stroke={plume}
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
          opacity={0.9 - k * 0.45}
        />
      ))}
    </g>
  );
}

export function KashField({ x0, x1, y, count, seed = 5, c, plume, hMin = 90, hMax = 190 }: { x0: number; x1: number; y: number; count: number; seed?: number; c: string; plume: string; hMin?: number; hMax?: number }) {
  const r = rng(seed);
  const items = Array.from({ length: count }, () => ({
    x: x0 + r() * (x1 - x0),
    h: hMin + r() * (hMax - hMin),
    d: r() * 6,
    lean: (r() - 0.5) * 40,
    dy: r() * 26,
  })).sort((a, b) => a.dy - b.dy);
  return (
    <g>
      {items.map((it, i) => (
        <KashStalk key={i} x={it.x} y={y + it.dy} h={it.h} c={c} plume={plume} d={it.d} lean={it.lean} />
      ))}
    </g>
  );
}

export function BelTree({ x, y, s = 1, c, leaf }: { x: number; y: number; s?: number; c: string; leaf?: string }) {
  const r = rng(21);
  const L = leaf ?? c;
  return (
    <g>
      <path
        d={`M${x - 18 * s},${y} Q${x - 10 * s},${y - 120 * s} ${x - 30 * s},${y - 220 * s} M${x + 16 * s},${y} Q${x + 6 * s},${y - 140 * s} ${x + 40 * s},${y - 240 * s} M${x},${y - 120 * s} Q${x + 60 * s},${y - 170 * s} ${x + 120 * s},${y - 200 * s} M${x - 6 * s},${y - 100 * s} Q${x - 70 * s},${y - 150 * s} ${x - 120 * s},${y - 170 * s}`}
        stroke={c}
        strokeWidth={16 * s}
        fill="none"
        strokeLinecap="round"
      />
      <rect x={x - 20 * s} y={y - 110 * s} width={40 * s} height={110 * s} rx={10 * s} fill={c} />
      <g className="fx-sway" style={sv({ transformOrigin: `${x}px ${y}px`, "--sw": "0.8deg", animationDuration: "9s" })}>
        {Array.from({ length: 34 }, (_, i) => {
          const a = r() * Math.PI;
          const rad = (60 + r() * 120) * s;
          return <circle key={i} cx={x + Math.cos(a) * rad * 1.3} cy={y - 230 * s - Math.sin(a) * rad * 0.7} r={(38 + r() * 36) * s} fill={L} />;
        })}
      </g>
    </g>
  );
}

/** Kola bou (Nabapatrika): a banana plant dressed as a bride in a red-bordered white saree and veil. */
export function KolaBou({ x, y, s = 1, leaf, cloth, border = RED }: { x: number; y: number; s?: number; leaf: string; cloth: string; border?: string }) {
  const leaves: [number, number, number][] = [
    [-1, 1.0, 300],
    [1, 1.05, 310],
    [-1, 0.75, 250],
    [1, 0.8, 262],
    [-0.35, 0.6, 330],
    [0.4, 0.55, 322],
  ];
  return (
    <g>
      <g className="fx-sway" style={sv({ transformOrigin: `${x}px ${y - 170 * s}px`, "--sw": "1.4deg", animationDuration: "7s" })}>
        {leaves.map(([dir, k, top], i) => {
          const tipX = x + dir * 150 * k * s;
          const tipY = y - (top - 40 * Math.abs(dir)) * s;
          return (
            <g key={i}>
              <path
                d={`M${x},${y - 170 * s} Q${x + dir * 30 * s},${y - (top + 10) * s} ${tipX},${tipY} Q${x + dir * 70 * k * s},${y - (top - 70) * s} ${x},${y - 180 * s} Z`}
                fill={leaf}
              />
              <path d={`M${x},${y - 175 * s} Q${x + dir * 40 * s},${y - (top - 20) * s} ${tipX},${tipY}`} stroke="#9fc97a" strokeOpacity={0.45} strokeWidth={1.6 * s} fill="none" />
            </g>
          );
        })}
      </g>
      {/* body wrapped in the saree */}
      <path d={`M${x - 24 * s},${y - 150 * s} Q${x - 40 * s},${y - 70 * s} ${x - 38 * s},${y} L${x + 38 * s},${y} Q${x + 40 * s},${y - 70 * s} ${x + 24 * s},${y - 150 * s} Z`} fill={cloth} />
      {[-14, 0, 14].map((dx) => (
        <path key={dx} d={`M${x + dx * s},${y - 60 * s} L${x + dx * 1.2 * s},${y - 4 * s}`} stroke="#000" strokeOpacity={0.08} strokeWidth={2 * s} />
      ))}
      <rect x={x - 38 * s} y={y - 9 * s} width={76 * s} height={9 * s} fill={border} />
      {/* anchal across the body with its red border */}
      <path d={`M${x - 30 * s},${y - 118 * s} L${x + 36 * s},${y - 50 * s} L${x + 37 * s},${y - 34 * s} L${x - 33 * s},${y - 100 * s} Z`} fill={cloth} />
      <path d={`M${x - 33 * s},${y - 100 * s} L${x + 37 * s},${y - 34 * s}`} stroke={border} strokeWidth={6 * s} />
      {/* ghomta: the bride's veil, leaves rising above it */}
      <path d={`M${x - 36 * s},${y - 104 * s} Q${x - 40 * s},${y - 176 * s} ${x},${y - 186 * s} Q${x + 40 * s},${y - 176 * s} ${x + 36 * s},${y - 104 * s} Q${x},${y - 122 * s} ${x - 36 * s},${y - 104 * s} Z`} fill={cloth} />
      <path d={`M${x - 36 * s},${y - 104 * s} Q${x - 40 * s},${y - 176 * s} ${x},${y - 186 * s} Q${x + 40 * s},${y - 176 * s} ${x + 36 * s},${y - 104 * s}`} stroke={border} strokeWidth={6 * s} fill="none" />
      <circle cx={x} cy={y - 150 * s} r={5 * s} fill={SINDOOR} />
      <path d={`M${x},${y - 186 * s} L${x},${y - 166 * s}`} stroke={SINDOOR} strokeWidth={3 * s} />
    </g>
  );
}

// ── PANDAL + PROTIMA ────────────────────────────────────────────────────────

/**
 * Chalchitra: the arched backdrop of an ek-chala protima. The five deities are
 * shown as reverent, featureless silhouettes with crowns against the glowing arch.
 */
export function Chalchitra({ cx, y, r, uid, silhouette = "#2a0f08", glow = true }: { cx: number; y: number; r: number; uid: string; silhouette?: string; glow?: boolean }) {
  const h = r * 1.15;
  const arch = `M${cx - r},${y} L${cx - r},${y - h + r} A${r},${r} 0 0 1 ${cx + r},${y - h + r} L${cx + r},${y} Z`;
  const figs: [number, number, number][] = [
    [-0.78, 0.5, 0.82],
    [-0.42, 0.6, 0.9],
    [0, 0.82, 1],
    [0.42, 0.6, 0.9],
    [0.78, 0.5, 0.82],
  ];
  return (
    <g>
      <defs>
        <radialGradient id={`cc${uid}`} cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#fff3c4" />
          <stop offset="0.45" stopColor="#f2c14e" />
          <stop offset="1" stopColor="#b8741a" />
        </radialGradient>
        <radialGradient id={`ccg${uid}`}>
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
      </defs>
      {glow && <circle cx={cx} cy={y - h * 0.55} r={r * 2.1} fill={`url(#ccg${uid})`} className="fx-breathe" />}
      <path d={arch} fill={`url(#cc${uid})`} />
      {[0.92, 0.8, 0.66].map((k) => (
        <path
          key={k}
          d={`M${cx - r * k},${y} L${cx - r * k},${y - h + r} A${r * k},${r * k} 0 0 1 ${cx + r * k},${y - h + r} L${cx + r * k},${y}`}
          fill="none"
          stroke="#9a5a12"
          strokeWidth={r * 0.012}
          strokeDasharray={k === 0.8 ? `${r * 0.02} ${r * 0.03}` : undefined}
          opacity="0.75"
        />
      ))}
      {Array.from({ length: 19 }, (_, i) => {
        const a = Math.PI + (Math.PI * i) / 18;
        const ox = cx + Math.cos(a) * r * 0.66;
        const oy = y - h + r + Math.sin(a) * r * 0.66;
        const ex = cx + Math.cos(a) * r * 0.92;
        const ey = y - h + r + Math.sin(a) * r * 0.92;
        return (
          <g key={i}>
            <path d={`M${ox},${oy} L${ex},${ey}`} stroke="#9a5a12" strokeWidth={r * 0.01} opacity="0.6" />
            <circle cx={ex} cy={ey} r={r * 0.025} fill="#fff1c0" />
          </g>
        );
      })}
      {/* deities as silhouettes */}
      {figs.map(([fx, fh, fw], i) => {
        const bx = cx + fx * r;
        const H = h * fh;
        const W2 = r * 0.16 * fw;
        const headY = y - H + W2 * 1.2;
        const main = i === 2;
        return (
          <g key={i} fill={silhouette}>
            {main &&
              Array.from({ length: 10 }, (_, k) => {
                const a = Math.PI * (0.08 + (0.84 * k) / 9);
                const len = r * 0.42;
                const sx = bx;
                const sy = headY + W2 * 1.6;
                return (
                  <path
                    key={k}
                    d={`M${sx},${sy} L${sx - Math.cos(a) * len},${sy - Math.sin(a) * len * 0.75}`}
                    stroke={silhouette}
                    strokeWidth={r * 0.028}
                    strokeLinecap="round"
                  />
                );
              })}
            <path d={`M${bx - W2 * 1.6},${y} Q${bx - W2 * 1.3},${headY + W2 * 2} ${bx - W2 * 0.7},${headY + W2 * 1.3} L${bx + W2 * 0.7},${headY + W2 * 1.3} Q${bx + W2 * 1.3},${headY + W2 * 2} ${bx + W2 * 1.6},${y} Z`} />
            <circle cx={bx} cy={headY + W2 * 0.4} r={W2 * 0.62} />
            {/* mukut (crown) */}
            <path d={`M${bx - W2 * 0.75},${headY} L${bx - W2 * 0.5},${headY - W2 * 1.5} L${bx - W2 * 0.18},${headY - W2 * 0.7} L${bx},${headY - W2 * (main ? 2.6 : 1.9)} L${bx + W2 * 0.18},${headY - W2 * 0.7} L${bx + W2 * 0.5},${headY - W2 * 1.5} L${bx + W2 * 0.75},${headY} Z`} />
            <path
              d={`M${bx - W2 * 0.75},${headY} L${bx - W2 * 0.5},${headY - W2 * 1.5} L${bx - W2 * 0.18},${headY - W2 * 0.7} L${bx},${headY - W2 * (main ? 2.6 : 1.9)} L${bx + W2 * 0.18},${headY - W2 * 0.7} L${bx + W2 * 0.5},${headY - W2 * 1.5} L${bx + W2 * 0.75},${headY}`}
              fill="none"
              stroke="#ffe39a"
              strokeWidth={r * 0.008}
              opacity="0.9"
            />
            {main && <circle cx={bx} cy={headY + W2 * 0.25} r={W2 * 0.12} fill={SINDOOR} />}
          </g>
        );
      })}
    </g>
  );
}

/** A bamboo-and-cloth pandal facade with a chala crest and arched entrance. */
export function Pandal({ cx, y, w, h, c, trim, uid, lit = true, open = true, silhouette }: { cx: number; y: number; w: number; h: number; c: string; trim: string; uid: string; lit?: boolean; open?: boolean; silhouette?: string }) {
  const x = cx - w / 2;
  const aw = w * 0.46;
  const ah = h * 0.66;
  const archPath = `M${cx - aw / 2},${y} L${cx - aw / 2},${y - ah + aw / 2} A${aw / 2},${aw / 2} 0 0 1 ${cx + aw / 2},${y - ah + aw / 2} L${cx + aw / 2},${y} Z`;
  const r = rng(31);
  return (
    <g>
      <defs>
        <radialGradient id={`pin${uid}`} cx="0.5" cy="0.7" r="0.8">
          <stop offset="0" stopColor={lit ? "#ffcf73" : "#3a2a24"} />
          <stop offset="1" stopColor={lit ? "#a8451a" : "#120c0c"} />
        </radialGradient>
      </defs>
      {/* interior glow */}
      <path d={archPath} fill={`url(#pin${uid})`} />
      {open && <Chalchitra cx={cx} y={y - 6} r={aw * 0.4} uid={uid} glow={lit} silhouette={silhouette} />}
      {/* facade with arch cut-out */}
      <path
        fillRule="evenodd"
        fill={c}
        d={`M${x},${y} L${x},${y - h} L${x + w},${y - h} L${x + w},${y} Z ${archPath}`}
      />
      {/* cloth pleats and a scalloped frieze, like a shola-and-cloth pandal front */}
      {Array.from({ length: Math.round(w / 26) }, (_, i) => (
        <rect key={`pl${i}`} x={x + i * 26 + 6} y={y - h} width={8} height={h} fill="#ffffff" opacity="0.035" />
      ))}
      <rect x={x} y={y - h * 0.84} width={w} height={h * 0.07} fill={trim} opacity="0.85" />
      {Array.from({ length: Math.round(w / 40) }, (_, i) => (
        <path key={`sc${i}`} d={`M${x + i * 40},${y - h * 0.77} a20,20 0 0 0 40,0`} fill={trim} opacity="0.55" />
      ))}
      {Array.from({ length: Math.round(w / 40) }, (_, i) => (
        <circle key={`sd${i}`} cx={x + i * 40 + 20} cy={y - h * 0.805} r={4} fill={c} />
      ))}
      {[0.16, 0.84].map((f) => (
        <g key={f}>
          <circle cx={x + w * f} cy={y - h * 0.5} r={h * 0.11} fill="none" stroke={trim} strokeWidth={4} opacity="0.6" />
          <circle cx={x + w * f} cy={y - h * 0.5} r={h * 0.06} fill={trim} opacity="0.35" />
          {Array.from({ length: 12 }, (_, k) => {
            const a = (Math.PI * 2 * k) / 12;
            return <circle key={k} cx={x + w * f + Math.cos(a) * h * 0.11} cy={y - h * 0.5 + Math.sin(a) * h * 0.11} r={3} fill={trim} />;
          })}
        </g>
      ))}
      {/* crest */}
      <path d={chala(x + w * 0.12, y - h, w * 0.76, h * 0.42)} fill={c} />
      <path d={chala(x + w * 0.36, y - h - h * 0.3, w * 0.28, h * 0.22)} fill={c} />
      <rect x={x + w * 0.38} y={y - h - h * 0.3} width={w * 0.24} height={h * 0.3} fill={c} />
      {/* side towers */}
      {[x - w * 0.06, x + w * 0.96].map((tx) => (
        <g key={tx} fill={c}>
          <rect x={tx} y={y - h * 1.12} width={w * 0.1} height={h * 1.12} />
          <path d={chala(tx - w * 0.01, y - h * 1.12, w * 0.12, h * 0.16)} />
        </g>
      ))}
      {/* trims: shola-like borders */}
      <path d={`M${x},${y - h} L${x + w},${y - h}`} stroke={trim} strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" />
      <path
        d={`M${cx - aw / 2 - 14},${y} L${cx - aw / 2 - 14},${y - ah + aw / 2} A${aw / 2 + 14},${aw / 2 + 14} 0 0 1 ${cx + aw / 2 + 14},${y - ah + aw / 2} L${cx + aw / 2 + 14},${y}`}
        stroke={trim}
        strokeWidth={5}
        fill="none"
        strokeDasharray="3 9"
        strokeLinecap="round"
      />
      {/* fairy lights on the facade */}
      {lit &&
        Array.from({ length: 70 }, (_, i) => {
          const px = x + r() * w;
          const py = y - h + r() * (h * 0.32);
          return <circle key={i} cx={px} cy={py} r={2.4} fill={["#ffd27a", "#ff7a59", "#fff1c4", "#7fd1ff"][i % 4]} className="fx-twinkle" style={{ animationDelay: `${r() * 3}s` }} />;
        })}
      {lit &&
        Array.from({ length: 16 }, (_, i) => {
          const a = Math.PI + (Math.PI * i) / 15;
          const R = aw / 2 + 14;
          return (
            <circle
              key={`a${i}`}
              cx={cx + Math.cos(a) * R}
              cy={y - ah + aw / 2 + Math.sin(a) * R}
              r={3.4}
              fill="#fff1c4"
              className="fx-chase"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          );
        })}
    </g>
  );
}

/** Bamboo scaffolding: a pandal being built, or one being taken down. */
export function Bamboo({ x, y, w, h, c, cols = 6, rows = 5 }: { x: number; y: number; w: number; h: number; c: string; cols?: number; rows?: number }) {
  return (
    <g stroke={c} strokeLinecap="round">
      {Array.from({ length: cols + 1 }, (_, i) => (
        <path key={`c${i}`} d={`M${x + (w * i) / cols},${y} L${x + (w * i) / cols + (i % 2 ? 3 : -3)},${y - h - (i === cols / 2 ? 60 : 0)}`} strokeWidth={6} />
      ))}
      {Array.from({ length: rows }, (_, j) => (
        <path key={`r${j}`} d={`M${x - 10},${y - (h * (j + 1)) / rows} L${x + w + 10},${y - (h * (j + 1)) / rows + (j % 2 ? 4 : -4)}`} strokeWidth={5} />
      ))}
      <path d={`M${x},${y - h} L${x + w / 2},${y - h - 60} L${x + w},${y - h}`} strokeWidth={5} fill="none" />
      {Array.from({ length: cols }, (_, i) => (
        <path key={`d${i}`} d={`M${x + (w * i) / cols},${y - h * 0.2} L${x + (w * (i + 1)) / cols},${y - h * 0.6}`} strokeWidth={3} opacity="0.7" />
      ))}
    </g>
  );
}

/** A string of bulbs hanging in a catenary between two points. */
export function StringLights({ a, b, sag = 40, n = 18, colors = ["#ffd27a", "#ff6b4a", "#fff3c9", "#6fd0ff", "#9cff8a"], wire = "#1a1010", seed = 9, on = 1 }: { a: Pt; b: Pt; sag?: number; n?: number; colors?: string[]; wire?: string; seed?: number; on?: number }) {
  const r = rng(seed);
  const pts = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + sag * 4 * t * (1 - t)] as Pt;
  });
  return (
    <g>
      <path d={`M${a[0]},${a[1]} Q${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2 + sag * 2} ${b[0]},${b[1]}`} stroke={wire} strokeWidth={1.6} fill="none" />
      {pts.map(([px, py], i) =>
        i / n <= on ? (
          <g key={i}>
            <circle cx={px} cy={py + 5} r={9} fill={colors[i % colors.length]} opacity="0.22" />
            <circle cx={px} cy={py + 5} r={3.6} fill={colors[i % colors.length]} className="fx-twinkle" style={{ animationDelay: `${r() * 2.5}s` }} />
          </g>
        ) : (
          <circle key={i} cx={px} cy={py + 5} r={3} fill="#3a2c2c" />
        ),
      )}
    </g>
  );
}

/** Bunting of triangular paper flags. */
export function Bunting({ a, b, n = 16, sag = 30, colors = [RED, GOLD, IVORY, "#2f8f6b", "#e36a2e"] }: { a: Pt; b: Pt; n?: number; sag?: number; colors?: string[] }) {
  return (
    <g>
      <path d={`M${a[0]},${a[1]} Q${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2 + sag * 2} ${b[0]},${b[1]}`} stroke="#2a1a14" strokeWidth={1.4} fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n;
        const px = a[0] + (b[0] - a[0]) * t;
        const py = a[1] + (b[1] - a[1]) * t + sag * 4 * t * (1 - t);
        return (
          <path
            key={i}
            d={`M${px - 12},${py} L${px + 12},${py} L${px},${py + 26} Z`}
            fill={colors[i % colors.length]}
            className="fx-flag"
            style={sv({ transformOrigin: `${px}px ${py}px`, animationDelay: `${i * 0.21}s` })}
          />
        );
      })}
    </g>
  );
}

// ── FIRE, SMOKE, LIGHT ──────────────────────────────────────────────────────

export function Flame({ x, y, s = 1, d = 0, halo = true }: { x: number; y: number; s?: number; d?: number; halo?: boolean }) {
  return (
    <g>
      {halo && <circle cx={x} cy={y - 9 * s} r={18 * s} fill="#ffb347" fillOpacity={0.22} className="fx-breathe" style={{ animationDelay: `${d}s` }} />}
      <path
        className="fx-flicker"
        style={{ animationDelay: `${d}s` }}
        d={`M${x},${y} c${-6 * s},0 ${-7 * s},${-8 * s} ${-4 * s},${-13 * s} c${2 * s},${-4 * s} ${4 * s},${-7 * s} ${4 * s},${-11 * s} c${2 * s},${4 * s} ${6 * s},${7 * s} ${6 * s},${12 * s} c0,${7 * s} ${-2 * s},${12 * s} ${-6 * s},${12 * s} z`}
        fill="#ffd36b"
      />
      <path d={`M${x},${y} c${-2.5 * s},0 ${-3 * s},${-4 * s} ${-1 * s},${-7 * s} c${1 * s},${2 * s} ${3 * s},${3 * s} ${3 * s},${5 * s} c0,${1 * s} ${-1 * s},${2 * s} ${-2 * s},${2 * s} z`} fill="#fff6dc" />
    </g>
  );
}

export function Diya({ x, y, s = 1, d = 0, c = "#8a3a1a" }: { x: number; y: number; s?: number; d?: number; c?: string }) {
  return (
    <g>
      <Flame x={x + 4 * s} y={y - 6 * s} s={s} d={d} />
      <path d={`M${x - 12 * s},${y - 6 * s} Q${x},${y + 6 * s} ${x + 14 * s},${y - 7 * s} L${x + 8 * s},${y - 6 * s} Z`} fill={c} />
      <path d={`M${x - 12 * s},${y - 6 * s} Q${x},${y + 6 * s} ${x + 12 * s},${y - 6 * s} Z`} fill={c} />
    </g>
  );
}

/** Rising dhuno smoke: soft puffs that rise, widen and fade. */
export function Smoke({ x, y, s = 1, puffs = 7, seed = 2, tint = "#f5ece4", spread = 1 }: { x: number; y: number; s?: number; puffs?: number; seed?: number; tint?: string; spread?: number }) {
  const r = rng(seed + Math.round(x));
  const id = `sm${seed}${Math.round(x)}${Math.round(y)}`;
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor={tint} stopOpacity="0.85" />
          <stop offset="0.6" stopColor={tint} stopOpacity="0.25" />
          <stop offset="1" stopColor={tint} stopOpacity="0" />
        </radialGradient>
      </defs>
      {Array.from({ length: puffs }, (_, i) => {
        const dur = 6 + r() * 4;
        return (
          <circle
            key={i}
            cx={x}
            cy={y - 8 * s}
            r={16 * s}
            fill={`url(#${id})`}
            className="fx-smoke"
            style={sv({
              animationDuration: `${dur}s`,
              animationDelay: `${-(dur * i) / puffs}s`,
              "--dx": `${(r() - 0.4) * 120 * s * spread}px`,
              "--dy": `${-(220 + r() * 160) * s}px`,
            })}
          />
        );
      })}
    </g>
  );
}

export function Dhunuchi({ x, y, s = 1, smoke = true, seed = 4 }: { x: number; y: number; s?: number; smoke?: boolean; seed?: number }) {
  return (
    <g>
      {smoke && <Smoke x={x} y={y - 18 * s} s={s} seed={seed} />}
      <ellipse cx={x} cy={y - 18 * s} rx={15 * s} ry={4 * s} fill="#ff7a2e" className="fx-breathe" />
      <path d={`M${x - 16 * s},${y - 18 * s} Q${x},${y + 2 * s} ${x + 16 * s},${y - 18 * s} Z`} fill="#7a2f14" />
      <path d={`M${x - 4 * s},${y - 9 * s} L${x - 6 * s},${y + 10 * s} L${x + 6 * s},${y + 10 * s} L${x + 4 * s},${y - 9 * s} Z`} fill="#6a2810" />
    </g>
  );
}

/** 108 prodip on a stepped brass stand, for Sandhi pujo. */
export function ProdipStand({ cx, y, w, rows = 9, cols = 12, c = "#8a5a1a" }: { cx: number; y: number; w: number; rows?: number; cols?: number; c?: string }) {
  const r = rng(108);
  const gap = w / cols;
  return (
    <g>
      <ellipse cx={cx} cy={y - rows * gap * 0.3} rx={w * 0.6} ry={rows * gap * 0.45} fill="#ffb347" fillOpacity={0.16} className="fx-breathe" />
      {Array.from({ length: rows }, (_, j) => {
        const ry = y - j * gap * 0.62;
        const rw = w * (1 - j * 0.045);
        return (
          <g key={j}>
            <rect x={cx - rw / 2} y={ry} width={rw} height={gap * 0.14} fill={c} />
            <g className="fx-flickerRow" style={{ animationDelay: `${r() * 2}s` }}>
              {Array.from({ length: cols }, (_, i) => (
                <Flame key={i} x={cx - rw / 2 + (rw / cols) * (i + 0.5)} y={ry} s={gap * 0.024} d={r() * 2} halo={false} />
              ))}
            </g>
          </g>
        );
      })}
    </g>
  );
}

export function Lotus({ x, y, s = 1, c = "#f08aa0", d = "#c2456a" }: { x: number; y: number; s?: number; c?: string; d?: string }) {
  return (
    <g>
      {[-60, -30, 0, 30, 60].map((a) => (
        <path
          key={a}
          transform={`rotate(${a} ${x} ${y})`}
          d={`M${x},${y} Q${x - 9 * s},${y - 16 * s} ${x},${y - 30 * s} Q${x + 9 * s},${y - 16 * s} ${x},${y} Z`}
          fill={Math.abs(a) === 30 ? d : c}
        />
      ))}
    </g>
  );
}

// ── PEOPLE ──────────────────────────────────────────────────────────────────

export type Pose =
  | "woman"
  | "man"
  | "dhaki"
  | "dancer"
  | "priest"
  | "anjali"
  | "boron"
  | "sindoor"
  | "pronam"
  | "seated"
  | "child"
  | "artisan";

interface PersonProps {
  x: number;
  y: number;
  h: number;
  pose: Pose;
  c: string; // silhouette / skin
  cloth?: string;
  border?: string;
  flip?: boolean;
  d?: number;
  married?: boolean;
  smoke?: boolean;
}

/** Paper-cut people. Local units: 100 tall, feet at 0. */
export function Person({ x, y, h, pose, c, cloth = "#efe4d0", border = RED, flip, d = 0, married, smoke = true }: PersonProps) {
  const k = h / 100;
  const tf = `translate(${x} ${y}) scale(${flip ? -k : k} ${k})`;
  const head = (cy = -90) => (
    <g>
      <rect x={-3} y={cy + 4} width={6} height={10} fill={c} />
      <circle cx={0} cy={cy} r={7.5} fill={c} />
      {married && <path d={`M0,${cy - 7.5} L0,${cy - 2}`} stroke={SINDOOR} strokeWidth={1.8} />}
    </g>
  );
  const saree = (
    <g>
      <path d="M-9,-58 C-12,-40 -15,-20 -17,0 L17,0 C15,-20 12,-40 9,-58 Z" fill={cloth} />
      <path d="M-17,0 L17,0 L16.5,-4.5 L-16.5,-4.5 Z" fill={border} />
      <path d="M-9,-58 L-10,-79 Q0,-84 10,-79 L9,-58 Z" fill={c} />
      <path d="M-10,-80 Q3,-70 11,-55 L14,-53 Q5,-73 -5,-83 Z" fill={cloth} />
      <path d="M-5,-83 Q5,-73 14,-53" stroke={border} strokeWidth={2.2} fill="none" />
      <path d="M-10,-80 L-15,-48 L-9,-50 Z" fill={cloth} />
    </g>
  );
  const kurta = (
    <g>
      <path d="M-7,-40 L-8,0 L-2,0 L-1,-40 Z M1,-40 L2,0 L8,0 L7,-40 Z" fill={c} />
      <path d="M-11,-79 Q0,-83 11,-79 L13,-34 L-13,-34 Z" fill={cloth} />
      <path d="M0,-80 L0,-60" stroke={c} strokeWidth={0.8} opacity="0.5" />
    </g>
  );
  const dhoti = (
    <g>
      <path d="M-11,-44 L-14,0 L14,0 L11,-44 Z" fill={cloth} />
      <path d="M-14,0 L14,0 L13.6,-3 L-13.6,-3 Z" fill={border} />
      <path d="M-10,-44 L-11,-79 Q0,-83 11,-79 L10,-44 Z" fill={c} />
      <path d="M-9,-80 L9,-46" stroke={cloth} strokeWidth={1} />
    </g>
  );
  const arm = (dPath: string, sleeve = c) => <path d={dPath} stroke={sleeve} strokeWidth={5} fill="none" strokeLinecap="round" />;

  let body: ReactNode = null;
  switch (pose) {
    case "woman":
      body = (
        <g>
          {saree}
          {arm("M-10,-76 Q-15,-64 -13,-52")}
          {arm("M10,-76 Q15,-64 13,-52")}
          {head()}
        </g>
      );
      break;
    case "man":
    case "child":
      body = (
        <g>
          {kurta}
          {arm("M-11,-76 Q-15,-62 -14,-50", cloth)}
          {arm("M11,-76 Q15,-62 14,-50", cloth)}
          {head(-89)}
        </g>
      );
      break;
    case "artisan":
      body = (
        <g>
          <path d="M-14,0 L-12,-28 L12,-28 L16,0 Z" fill={cloth} />
          <path d="M-10,-28 L-12,-62 Q0,-66 10,-62 L10,-28 Z" fill={c} />
          {arm("M8,-58 Q22,-52 30,-64")}
          <path d="M30,-64 L40,-76" stroke="#d9b07a" strokeWidth={1.6} />
          {arm("M-9,-58 Q-14,-44 -6,-36")}
          {head(-72)}
        </g>
      );
      break;
    case "dhaki":
      body = (
        <g>
          {kurta}
          <path d="M10,-78 L-22,-50" stroke="#2a1a10" strokeWidth={1.4} />
          {/* plume */}
          <g className="fx-sway" style={sv({ transformOrigin: `-26px -54px`, "--sw": "4deg", animationDuration: "1.3s" })}>
            {[-46, -36, -26, -16, -8].map((ex, i) => (
              <path key={i} d={`M-26,-54 Q${ex - 4},-90 ${ex},-${118 + (i % 2) * 8}`} stroke="#fbf6ec" strokeWidth={3.4} fill="none" strokeLinecap="round" />
            ))}
          </g>
          <rect x={-34} y={-56} width={30} height={20} rx={6} fill="#6b2a12" />
          <ellipse cx={-34} cy={-46} rx={3} ry={10} fill="#e9d6b8" />
          <ellipse cx={-4} cy={-46} rx={3} ry={10} fill="#e9d6b8" />
          <g className="fx-drum" style={sv({ transformOrigin: "11px -76px", animationDelay: `${d}s` })}>
            {arm("M11,-76 Q8,-60 -2,-58", cloth)}
            <path d="M-2,-58 L-12,-44" stroke="#c8a070" strokeWidth={1.8} />
          </g>
          <g className="fx-drum" style={sv({ transformOrigin: "-11px -76px", animationDelay: `${d + 0.21}s` })}>
            {arm("M-11,-76 Q-20,-70 -30,-64", cloth)}
            <path d="M-30,-64 L-40,-52" stroke="#c8a070" strokeWidth={1.8} />
          </g>
          {head(-89)}
        </g>
      );
      break;
    case "dancer":
      body = (
        <g className="fx-dance" style={sv({ transformOrigin: "0px 0px", animationDelay: `${d}s` })}>
          {saree}
          {arm("M10,-77 Q22,-92 16,-108")}
          {arm("M-10,-77 Q-22,-86 -30,-96")}
          {head()}
          <Dhunuchi x={16} y={-108} s={0.9} smoke={smoke} seed={Math.round(x)} />
        </g>
      );
      break;
    case "priest":
      body = (
        <g>
          {dhoti}
          {arm("M-11,-76 Q-16,-62 -12,-52")}
          <g className="fx-aarti" style={sv({ transformOrigin: "11px -76px", animationDelay: `${d}s` })}>
            {arm("M11,-76 Q24,-86 26,-100")}
            {[-8, -4, 0, 4, 8].map((dx, i) => (
              <Flame key={i} x={26 + dx} y={-102 - (i % 2) * 3} s={0.42} d={i * 0.2} />
            ))}
            <rect x={18} y={-102} width={16} height={3} fill="#c8a040" />
          </g>
          {head(-89)}
        </g>
      );
      break;
    case "anjali":
      body = (
        <g>
          {cloth === "#efe4d0" || border === RED ? saree : kurta}
          {arm("M-10,-76 Q-12,-84 -2,-92")}
          {arm("M10,-76 Q12,-84 2,-92")}
          {head()}
          <circle cx={-1} cy={-95} r={2.4} fill="#ffb31a" />
          <circle cx={2} cy={-96} r={2} fill={SINDOOR} />
        </g>
      );
      break;
    case "boron":
      body = (
        <g>
          {saree}
          {arm("M10,-76 Q24,-74 28,-82")}
          {arm("M-10,-76 Q10,-70 22,-80")}
          <ellipse cx={30} cy={-84} rx={16} ry={4} fill="#c8a040" />
          <Flame x={30} y={-86} s={0.5} d={d} />
          <circle cx={22} cy={-87} r={2} fill={SINDOOR} />
          <circle cx={38} cy={-87} r={2} fill="#ffb31a" />
          {head()}
        </g>
      );
      break;
    case "sindoor":
      body = (
        <g>
          {saree}
          {arm("M10,-76 Q24,-80 30,-92")}
          {arm("M-10,-76 Q-15,-64 -12,-52")}
          {head()}
          <circle cx={4} cy={-89} r={4} fill={SINDOOR} opacity="0.85" />
          <circle cx={-5} cy={-93} r={3} fill={SINDOOR} opacity="0.7" />
          <circle cx={31} cy={-94} r={2.6} fill={SINDOOR} />
        </g>
      );
      break;
    case "pronam":
      body = (
        <g>
          <path d="M-7,-42 L-8,0 L-2,0 L-1,-42 Z M1,-42 L2,0 L8,0 L7,-42 Z" fill={c} />
          <g transform="rotate(-72 0 -42)">
            <path d="M-11,-79 Q0,-83 11,-79 L12,-40 L-12,-40 Z" fill={cloth} />
            {head(-89)}
          </g>
          {arm("M28,-60 Q40,-40 42,-6", cloth)}
        </g>
      );
      break;
    case "seated":
      body = (
        <g>
          <path d="M-26,0 Q-24,-14 -10,-18 L10,-18 Q24,-14 26,0 Z" fill={cloth} />
          <path d="M-26,0 L26,0 L25,-3.5 L-25,-3.5 Z" fill={border} />
          <path d="M-10,-18 L-10,-48 Q0,-52 10,-48 L10,-18 Z" fill={cloth} />
          {arm("M-9,-44 Q-14,-30 -4,-26")}
          {arm("M9,-44 Q14,-30 4,-26")}
          <rect x={-3} y={-56} width={6} height={9} fill={c} />
          <circle cx={0} cy={-62} r={7.5} fill={c} />
          <path d="M-8,-66 L-6,-78 L-3,-70 L0,-84 L3,-70 L6,-78 L8,-66 Z" fill={GOLD} />
          <circle cx={0} cy={-62} r={1.4} fill={SINDOOR} />
        </g>
      );
      break;
  }
  return <g transform={tf}>{body}</g>;
}

/** A crowd row: varied people across a span, deterministic. */
export function Crowd({ x0, x1, y, h, c, cloths, seed = 13, n = 14, poses = ["woman", "man"], married, jitter = 10 }: { x0: number; x1: number; y: number; h: number; c: string; cloths: string[]; seed?: number; n?: number; poses?: Pose[]; married?: boolean; jitter?: number }) {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const pose = poses[Math.floor(r() * poses.length)];
        const px = x0 + ((x1 - x0) * (i + 0.5)) / n + (r() - 0.5) * 30;
        const ph = h * (0.86 + r() * 0.2) * (r() < 0.12 ? 0.62 : 1);
        return (
          <Person
            key={i}
            x={px}
            y={y + r() * jitter}
            h={ph}
            pose={pose}
            c={c}
            cloth={cloths[Math.floor(r() * cloths.length)]}
            flip={r() < 0.5}
            d={r() * 2}
            married={married}
          />
        );
      })}
    </g>
  );
}

// ── PROPS ───────────────────────────────────────────────────────────────────

export function Dhak({ x, y, s = 1, c = "#6b2a12" }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g>
      <g className="fx-sway" style={sv({ transformOrigin: `${x - 30 * s}px ${y - 40 * s}px`, "--sw": "3deg", animationDuration: "2.2s" })}>
        {[-60, -46, -32, -18, -6].map((ex, i) => (
          <path key={i} d={`M${x - 30 * s},${y - 40 * s} Q${x + (ex - 6) * s},${y - 100 * s} ${x + ex * s},${y - (140 + (i % 2) * 12) * s}`} stroke="#fbf6ec" strokeWidth={4 * s} fill="none" strokeLinecap="round" />
        ))}
      </g>
      <rect x={x - 40 * s} y={y - 42 * s} width={80 * s} height={42 * s} rx={12 * s} fill={c} />
      <ellipse cx={x - 40 * s} cy={y - 21 * s} rx={7 * s} ry={21 * s} fill="#ead9bb" />
      <ellipse cx={x + 40 * s} cy={y - 21 * s} rx={7 * s} ry={21 * s} fill="#ead9bb" />
      {[-24, -8, 8, 24].map((dx) => (
        <path key={dx} d={`M${x + dx * s},${y - 42 * s} L${x + (dx + 8) * s},${y}`} stroke="#3a1608" strokeWidth={1.6 * s} />
      ))}
    </g>
  );
}

export function Boat({ x, y, s = 1, c, cargo }: { x: number; y: number; s?: number; c: string; cargo?: ReactNode }) {
  return (
    <g>
      {cargo}
      <path d={`M${x - 120 * s},${y - 20 * s} Q${x},${y + 30 * s} ${x + 120 * s},${y - 20 * s} L${x + 100 * s},${y - 8 * s} Q${x},${y + 14 * s} ${x - 100 * s},${y - 8 * s} Z`} fill={c} />
      <path d={`M${x - 130 * s},${y - 26 * s} Q${x},${y + 30 * s} ${x + 130 * s},${y - 26 * s} L${x + 120 * s},${y - 10 * s} Q${x},${y + 40 * s} ${x - 120 * s},${y - 10 * s} Z`} fill={c} />
    </g>
  );
}

export function Plate({ x, y, s = 1, kind }: { x: number; y: number; s?: number; kind: "naru" | "bhog" | "boron" }) {
  const r = rng(77);
  return (
    <g>
      {kind === "bhog" ? (
        <g>
          <ellipse cx={x} cy={y} rx={40 * s} ry={11 * s} fill="#4d7a3a" />
          <ellipse cx={x} cy={y - 2 * s} rx={30 * s} ry={7 * s} fill="#e9b949" />
          <ellipse cx={x + 16 * s} cy={y - 2 * s} rx={8 * s} ry={3 * s} fill="#b8461c" />
          <Smoke x={x} y={y - 4 * s} s={0.4 * s} puffs={4} seed={Math.round(x)} />
        </g>
      ) : (
        <g>
          <ellipse cx={x} cy={y} rx={46 * s} ry={12 * s} fill="#c8a040" />
          <ellipse cx={x} cy={y - 2 * s} rx={38 * s} ry={9 * s} fill="#e7c26a" />
          {kind === "naru" &&
            Array.from({ length: 11 }, (_, i) => (
              <circle key={i} cx={x + (r() - 0.5) * 50 * s} cy={y - 6 * s - r() * 8 * s} r={6 * s} fill={i % 3 ? "#f3e6c8" : "#d6a55a"} />
            ))}
          {kind === "boron" && (
            <g>
              <Flame x={x} y={y - 6 * s} s={0.8 * s} />
              <circle cx={x - 18 * s} cy={y - 6 * s} r={4 * s} fill={SINDOOR} />
              <circle cx={x + 18 * s} cy={y - 6 * s} r={4 * s} fill="#fff4d6" />
            </g>
          )}
        </g>
      )}
    </g>
  );
}

/** Nagordola, the fairground wheel. Spins slowly. */
export function FerrisWheel({ cx, cy, R, c }: { cx: number; cy: number; R: number; c: string }) {
  const n = 12;
  return (
    <g>
      <path d={`M${cx - R * 0.5},${cy + R * 1.15} L${cx},${cy} L${cx + R * 0.5},${cy + R * 1.15}`} stroke={c} strokeWidth={8} fill="none" />
      <g className="fx-spin" style={sv({ transformOrigin: `${cx}px ${cy}px` })}>
        <circle cx={cx} cy={cy} r={R} stroke={c} strokeWidth={5} fill="none" />
        <circle cx={cx} cy={cy} r={R * 0.92} stroke={c} strokeWidth={2} fill="none" />
        {Array.from({ length: n }, (_, i) => {
          const a = (Math.PI * 2 * i) / n;
          return (
            <g key={i}>
              <path d={`M${cx},${cy} L${cx + Math.cos(a) * R},${cy + Math.sin(a) * R}`} stroke={c} strokeWidth={2.4} />
              <rect x={cx + Math.cos(a) * R - 10} y={cy + Math.sin(a) * R} width={20} height={16} rx={3} fill={c} />
            </g>
          );
        })}
        {Array.from({ length: 36 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 36;
          return <circle key={`l${i}`} cx={cx + Math.cos(a) * R} cy={cy + Math.sin(a) * R} r={3} fill={["#ffd27a", "#ff6b4a", "#7fd1ff"][i % 3]} className="fx-chase" style={{ animationDelay: `${(i % 12) * 0.1}s` }} />;
        })}
      </g>
      <circle cx={cx} cy={cy} r={10} fill={c} />
    </g>
  );
}

/** Local train crossing the far plain: the journey home for pujo. */
export function Train({ W, y, c, lit }: { W: number; y: number; c: string; lit?: string }) {
  const cars = 7;
  const cw = 130;
  return (
    <g className="fx-train" style={sv({ "--tw": `${W + cars * cw * 1.1}px`, animationDelay: "-20s" })}>
      {Array.from({ length: cars }, (_, i) => {
        const x = -cars * cw * 1.06 + i * cw * 1.06;
        return (
          <g key={i}>
            <rect x={x} y={y - 34} width={cw} height={30} rx={i === cars - 1 ? 14 : 4} fill={c} />
            {Array.from({ length: 6 }, (_, k) => (
              <rect key={k} x={x + 10 + k * 20} y={y - 28} width={11} height={9} rx={1} fill={lit ?? "#e9d8a6"} opacity={lit ? 0.9 : 0.55} />
            ))}
          </g>
        );
      })}
    </g>
  );
}

/** Kumortuli: unfinished clay idols on straw armatures under tarpaulin. */
export function ClayIdol({ x, y, s = 1, clay = "#a87a55", straw = "#d8b878", stage = 0.5 }: { x: number; y: number; s?: number; clay?: string; straw?: string; stage?: number }) {
  const H = 260 * s;
  return (
    <g>
      {/* straw armature */}
      <g stroke={straw} strokeWidth={6 * s} strokeLinecap="round" fill="none">
        <path d={`M${x},${y} L${x},${y - H}`} />
        <path d={`M${x - 50 * s},${y - H * 0.62} Q${x},${y - H * 0.72} ${x + 50 * s},${y - H * 0.62}`} />
        {[0.18, 0.35, 0.65, 0.82].map((f, i) => {
          const a = Math.PI * f;
          return <path key={i} d={`M${x},${y - H * 0.6} L${x - Math.cos(a) * 62 * s},${y - H * 0.6 - Math.sin(a) * 46 * s}`} strokeWidth={4 * s} />;
        })}
        <path d={`M${x - 30 * s},${y - H * 0.95} Q${x},${y - H * 1.08} ${x + 30 * s},${y - H * 0.95}`} strokeWidth={4 * s} />
      </g>
      {/* clay body, partially done */}
      <path d={`M${x - 46 * s},${y} Q${x - 40 * s},${y - H * 0.4} ${x - 22 * s},${y - H * 0.66} L${x + 22 * s},${y - H * 0.66} Q${x + 40 * s},${y - H * 0.4} ${x + 46 * s},${y} Z`} fill={clay} opacity={0.5 + stage * 0.5} />
      <ellipse cx={x} cy={y - H * 0.78} rx={18 * s} ry={22 * s} fill={stage > 0.4 ? clay : straw} />
      <rect x={x - 44 * s} y={y - 14 * s} width={88 * s} height={14 * s} fill="#5a3b26" />
    </g>
  );
}

/** A floor of white alpana on red earth. */
export function Alpana({ W, y, H, base = "#7a1d12", ink = "#f6efe2", uid }: { W: number; y: number; H: number; base?: string; ink?: string; uid: string }) {
  return (
    <g>
      <defs>
        <pattern id={`alp${uid}`} x="0" y={y} width="120" height="60" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" opacity="0.85">
            <path d="M60,30 m-18,0 q18,-26 36,0 q-18,26 -36,0 z" />
            <circle cx="60" cy="30" r="4" fill={ink} />
            <path d="M18,30 q-8,-10 0,-18 q8,8 0,18 z M102,30 q8,-10 0,-18 q-8,8 0,18 z" />
            <path d="M0,54 q15,-12 30,0 q15,12 30,0 q15,-12 30,0 q15,12 30,0" />
            <circle cx="30" cy="8" r="2" fill={ink} />
            <circle cx="90" cy="8" r="2" fill={ink} />
          </g>
        </pattern>
      </defs>
      <rect x={0} y={y} width={W} height={H - y} fill={base} />
      <rect x={0} y={y} width={W} height={H - y} fill={`url(#alp${uid})`} />
      <rect x={0} y={y} width={W} height={4} fill={ink} opacity="0.7" />
    </g>
  );
}

export function Ground({ W, y, H, c }: { W: number; y: number; H: number; c: string }) {
  return <rect x={0} y={y} width={W} height={H - y} fill={c} />;
}

export function Tarp({ x, y, w, h, c = "#2f5d7a" }: { x: number; y: number; w: number; h: number; c?: string }) {
  return (
    <g>
      <path d={`M${x},${y} L${x + w},${y - h * 0.3} L${x + w},${y - h * 0.18} Q${x + w / 2},${y - h * 0.1} ${x},${y + h * 0.12} Z`} fill={c} />
      <path d={`M${x + 10},${y + 6} L${x + 10},${y + h}`} stroke="#3a2a18" strokeWidth={6} />
      <path d={`M${x + w - 10},${y - h * 0.26} L${x + w - 10},${y + h}`} stroke="#3a2a18" strokeWidth={6} />
    </g>
  );
}

export function Bulb({ x, y, len = 40, d = 0 }: { x: number; y: number; len?: number; d?: number }) {
  return (
    <g>
      <path d={`M${x},${y} L${x},${y + len}`} stroke="#1a1010" strokeWidth={1.4} />
      <circle cx={x} cy={y + len + 6} r={34} fill="#ffcf6b" fillOpacity={0.18} className="fx-breathe" style={{ animationDelay: `${d}s` }} />
      <circle cx={x} cy={y + len + 6} r={6} fill="#fff1c0" className="fx-twinkle" style={{ animationDelay: `${d}s`, animationDuration: "5s" }} />
    </g>
  );
}

export function Ladder({ x, y, h, c }: { x: number; y: number; h: number; c: string }) {
  return (
    <g stroke={c} strokeWidth={5} strokeLinecap="round">
      <path d={`M${x - 26},${y} L${x - 6},${y - h} M${x + 14},${y} L${x + 6},${y - h} M${x + 40},${y} L${x + 6},${y - h}`} />
      {Array.from({ length: 7 }, (_, i) => {
        const t = (i + 1) / 8;
        return <path key={i} d={`M${x - 26 + 20 * t},${y - h * t} L${x + 14 - 8 * t},${y - h * t}`} strokeWidth={3} />;
      })}
    </g>
  );
}
