// ─────────────────────────────────────────────────────────────────────────────
// The 21 code-drawn scenes. Landscape is drawn on a 1600x900 canvas and
// portrait on 900x1600, so phones get a composition made for them rather than
// a crop. Smoke sources come from the hotspots in config/scenes.ts, so they
// line up with the AI paintings that can later replace these drawings.
// ─────────────────────────────────────────────────────────────────────────────
import type { ReactNode } from "react";
import type { Pt } from "./kit";
import {
  Alpana,
  Bamboo,
  BelTree,
  Boat,
  Bulb,
  Bunting,
  Chalchitra,
  ClayIdol,
  Clouds,
  Crowd,
  Dhak,
  Dhunuchi,
  Diya,
  FerrisWheel,
  Ghat,
  Ground,
  Haze,
  HowrahBridge,
  IVORY,
  KashField,
  KolaBou,
  Ladder,
  Lotus,
  Pandal,
  Person,
  Plate,
  ProdipStand,
  RED,
  River,
  Skyline,
  Sky,
  Smoke,
  StringLights,
  Tarp,
  TONES,
  Train,
} from "./kit";

export interface CompProps {
  W: number;
  H: number;
  uid: string;
  P: boolean; // portrait
  smoke: Pt[];
  flame: Pt[];
}

const SAREES = ["#f4ead8", "#f4ead8", "#ffd34d", "#e8463a", "#f29bb0", "#7fc4a8", "#f6b24a"];
const NIGHT_CLOTH = ["#4b3d58", "#5a3a48", "#3d4560", "#614a3a"];

/** Interior backdrop: draped pandal cloth with gold trim. */
function Drapes({ W, H, c1, c2, trim }: { W: number; H: number; c1: string; c2: string; trim: string }) {
  const n = Math.ceil(W / 70);
  return (
    <g>
      <rect width={W} height={H} fill={c1} />
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${i * 70},0 Q${i * 70 + 35},${H * 0.5} ${i * 70},${H} L${i * 70 + 22},${H} Q${i * 70 + 50},${H * 0.5} ${i * 70 + 22},0 Z`} fill={c2} opacity="0.55" />
      ))}
      {Array.from({ length: Math.ceil(W / 110) }, (_, i) => (
        <path key={`sw${i}`} d={`M${i * 110},40 Q${i * 110 + 55},110 ${i * 110 + 110},40`} stroke={trim} strokeWidth={6} fill="none" />
      ))}
      <rect x={0} y={0} width={W} height={42} fill={c2} />
      <rect x={0} y={38} width={W} height={5} fill={trim} />
    </g>
  );
}

function Vignette({ W, H, uid, strength = 0.55 }: { W: number; H: number; uid: string; strength?: number }) {
  return (
    <g pointerEvents="none">
      <defs>
        <radialGradient id={`vg${uid}`} cx="0.5" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity={strength} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill={`url(#vg${uid})`} />
    </g>
  );
}

// Ground line sits just above the radio dock so the focal point stays visible.
const lay = (W: number, H: number, P: boolean) => ({ gy: P ? H * 0.6 : H * 0.7, cx: W / 2, s: P ? 1.1 : 1 });

// ── AGOMONI ─────────────────────────────────────────────────────────────────

function AgomoniKash({ W, H, uid, P }: CompProps) {
  const t = TONES.dupur;
  const { gy } = lay(W, H, P);
  const hz = gy - (P ? 300 : 170);
  return (
    <g>
      <Sky W={W} H={H} slot="dupur" uid={uid} />
      <Clouds W={W} H={H} slot="dupur" count={P ? 4 : 6} />
      <Skyline W={W} y={hz} c="#8fa0a6" seed={2} maxH={0.5} temple />
      <Haze W={W} y={hz} h={80} color={t.haze} uid={uid} opacity={0.6} />
      <rect x={0} y={hz} width={W} height={18} fill="#6d6a4a" />
      <Train W={W} y={hz + 2} c="#3f6b4f" />
      <rect x={0} y={hz + 18} width={W} height={H} fill="#9a9a5c" />
      <River W={W} y={hz + 40} H={hz + 90} slot="dupur" uid={uid} />
      <rect x={0} y={hz + 90} width={W} height={H} fill="#8c8a4e" />
      <KashField x0={-40} x1={W + 40} y={hz + 100} count={P ? 46 : 80} seed={4} c="#7e7a4a" plume="#f7f2e4" hMin={50} hMax={110} />
      <Ground W={W} y={gy} H={H} c="#6f6b3a" />
      <KashField x0={-60} x1={W * 0.36} y={gy} count={P ? 22 : 32} seed={8} c="#5e5a32" plume="#fffaf0" hMin={180} hMax={340} />
      <KashField x0={W * 0.64} x1={W + 60} y={gy} count={P ? 22 : 32} seed={9} c="#5e5a32" plume="#fffaf0" hMin={180} hMax={340} />
      <Person x={W * (P ? 0.5 : 0.52)} y={gy - 6} h={P ? 150 : 120} pose="child" c="#3a2418" cloth="#f2c14e" />
      <Person x={W * (P ? 0.6 : 0.56)} y={gy - 8} h={P ? 130 : 104} pose="woman" c="#3a2418" cloth="#f4ead8" flip />
    </g>
  );
}

function AgomoniKumortuli({ W, H, uid, P, smoke }: CompProps) {
  const t = TONES.sondhe;
  const { gy } = lay(W, H, P);
  const idols = P ? [0.18, 0.42, 0.66, 0.88] : [0.1, 0.24, 0.38, 0.62, 0.76, 0.9];
  return (
    <g>
      <Sky W={W} H={H} slot="sondhe" uid={uid} />
      <Skyline W={W} y={gy - (P ? 380 : 220)} c={t.far} seed={5} lit={t.light} />
      <Haze W={W} y={gy - (P ? 380 : 220)} h={120} color={t.haze} uid={uid} />
      <Skyline W={W} y={gy - (P ? 250 : 160)} c={t.mid} seed={12} lit={t.light} temple={false} maxH={1.2} />
      <Ground W={W} y={gy - 30} H={H} c="#3a1a12" />
      <Tarp x={-20} y={gy - (P ? 470 : 380)} w={W * 0.46} h={P ? 300 : 240} c="#2c5a73" />
      <Tarp x={W * 0.54} y={gy - (P ? 470 : 380)} w={W * 0.48} h={P ? 300 : 240} c="#7a2e2a" />
      {[0.12, 0.3, 0.7, 0.88].map((f, i) => (
        <Bulb key={f} x={W * f} y={gy - (P ? 450 : 360)} len={P ? 60 : 40} d={i * 0.7} />
      ))}
      {idols.map((f, i) => (
        <ClayIdol key={f} x={W * f} y={gy} s={P ? 1.05 : 0.95} stage={(i % 3) / 2} clay={i % 2 ? "#b58a62" : "#9c7050"} />
      ))}
      <Person x={W * (P ? 0.62 : 0.5)} y={gy + 10} h={P ? 150 : 130} pose="artisan" c="#1a0a0c" cloth="#e8d8b8" />
      {smoke.map(([x, y], i) => (
        <Smoke key={i} x={x} y={y} s={1.2} seed={i + 3} tint="#f0d8c0" />
      ))}
      <Vignette W={W} H={H} uid={uid} />
    </g>
  );
}

function AgomoniPara({ W, H, uid, P }: CompProps) {
  const t = TONES.raat;
  const { gy, cx } = lay(W, H, P);
  const bw = P ? 520 : 620;
  return (
    <g>
      <Sky W={W} H={H} slot="raat" uid={uid} seed={4} />
      <Skyline W={W} y={gy - (P ? 120 : 60)} c={t.far} seed={22} lit="#ffcf73" maxH={P ? 1.9 : 1.5} />
      <Ground W={W} y={gy - 10} H={H} c="#120c18" />
      <Bamboo x={cx - bw / 2} y={gy} w={bw} h={P ? 420 : 340} c="#b0894f" />
      <StringLights a={[-20, gy - (P ? 560 : 420)]} b={[cx - bw / 2, gy - (P ? 420 : 340)]} sag={20} n={12} on={1} seed={2} />
      <StringLights a={[cx - bw / 2, gy - (P ? 420 : 340)]} b={[cx + bw / 2, gy - (P ? 420 : 340)]} sag={36} n={20} on={0.55} seed={3} />
      <Ladder x={cx + bw * 0.18} y={gy} h={P ? 300 : 250} c="#a07a44" />
      <Person x={cx + bw * 0.2} y={gy - (P ? 210 : 175)} h={P ? 120 : 100} pose="man" c="#0a0610" cloth="#3d4560" />
      <Person x={cx - bw * 0.3} y={gy + 4} h={P ? 150 : 120} pose="man" c="#0a0610" cloth="#5a3a48" flip />
      <Person x={cx - bw * 0.42} y={gy + 6} h={P ? 140 : 110} pose="man" c="#0a0610" cloth="#614a3a" />
      <Bunting a={[0, gy - (P ? 640 : 520)]} b={[W, gy - (P ? 600 : 500)]} n={P ? 12 : 22} />
      <Vignette W={W} H={H} uid={uid} />
    </g>
  );
}

// ── SHASHTHI ────────────────────────────────────────────────────────────────

function ShashthiBodhon({ W, H, uid, P, smoke, flame }: CompProps) {
  const t = TONES.sondhe;
  const { gy } = lay(W, H, P);
  return (
    <g>
      <Sky W={W} H={H} slot="sondhe" uid={uid} />
      <Clouds W={W} H={H} slot="sondhe" count={4} seed={9} />
      <Skyline W={W} y={gy - (P ? 160 : 90)} c={t.far} seed={31} lit={t.light} maxH={0.8} />
      <Haze W={W} y={gy - (P ? 160 : 90)} h={120} color={t.haze} uid={uid} />
      <Ground W={W} y={gy - 20} H={H} c={t.ground} />
      <BelTree x={W * (P ? 0.36 : 0.3)} y={gy} s={P ? 1.5 : 1.25} c={t.near} leaf="#2c1020" />
      {/* ghot with mango leaves */}
      <g>
        <path d={`M${W * (P ? 0.52 : 0.4)},${gy} q-26,0 -26,-30 q0,-24 26,-26 q26,2 26,26 q0,30 -26,30 z`} fill="#a8471f" />
        {[-14, -5, 5, 14].map((dx) => (
          <path key={dx} d={`M${W * (P ? 0.52 : 0.4)},${gy - 56} q${dx},-24 ${dx * 2},-30`} stroke="#3b6b2a" strokeWidth={7} strokeLinecap="round" fill="none" />
        ))}
      </g>
      {flame.map(([x, y], i) => (
        <Diya key={i} x={x} y={y} s={1.6} d={i * 0.3} />
      ))}
      {smoke.map(([x, y], i) => (
        <Dhunuchi key={i} x={x} y={y} s={1.5} seed={i + 1} />
      ))}
      <Person x={W * (P ? 0.66 : 0.56)} y={gy + 6} h={P ? 190 : 170} pose="priest" c={t.near} cloth={t.cloth} d={0.2} />
      <Person x={W * (P ? 0.86 : 0.74)} y={gy + 8} h={P ? 180 : 160} pose="dhaki" c={t.near} cloth="#3a1a24" />
      {!P && <Crowd x0={W * 0.8} x1={W * 1.02} y={gy + 10} h={150} c={t.near} cloths={["#e7c0a6", "#c23a2a", "#f2c14e"]} n={3} seed={5} />}
      <Vignette W={W} H={H} uid={uid} />
    </g>
  );
}

function ShashthiDhaki({ W, H, uid, P }: CompProps) {
  const { gy } = lay(W, H, P);
  const xs = P ? [0.3, 0.58, 0.86] : [0.24, 0.4, 0.56];
  return (
    <g>
      <Sky W={W} H={H} slot="dupur" uid={uid} />
      <Clouds W={W} H={H} slot="dupur" count={P ? 3 : 5} seed={14} />
      <Skyline W={W} y={gy - 10} c="#a65a3e" seed={41} maxH={P ? 2.4 : 1.8} />
      <Skyline W={W} y={gy + 20} c="#7a3a26" seed={43} maxH={P ? 1.4 : 1.1} temple={false} />
      <Ground W={W} y={gy} H={H} c="#5a4a40" />
      <rect x={0} y={gy} width={W} height={6} fill="#3a2a22" />
      <Bunting a={[0, gy - (P ? 520 : 400)]} b={[W, gy - (P ? 480 : 380)]} n={P ? 12 : 24} />
      <Bunting a={[0, gy - (P ? 360 : 300)]} b={[W, gy - (P ? 400 : 320)]} n={P ? 10 : 20} sag={20} />
      {xs.map((f, i) => (
        <Person key={f} x={W * f} y={gy + 40} h={P ? 230 : 210} pose="dhaki" c="#2a160e" cloth={["#f2e9da", "#e9b949", "#d84a2a"][i]} d={i * 0.15} />
      ))}
      <Person x={W * (P ? 0.12 : 0.72)} y={gy + 50} h={P ? 120 : 110} pose="child" c="#2a160e" cloth="#7fc4a8" flip />
      {!P && <Person x={W * 0.8} y={gy + 46} h={120} pose="child" c="#2a160e" cloth="#f29bb0" flip />}
      {!P && <Dhak x={W * 0.9} y={gy + 50} s={1.1} />}
    </g>
  );
}

function ShashthiPandal({ W, H, uid, P }: CompProps) {
  const t = TONES.raat;
  const { gy, cx } = lay(W, H, P);
  const pw = P ? 700 : 760;
  const ph = P ? 520 : 380;
  return (
    <g>
      <Sky W={W} H={H} slot="raat" uid={uid} seed={6} />
      <Skyline W={W} y={gy - 20} c={t.far} seed={51} lit="#ffcf73" maxH={P ? 2 : 1.4} />
      <StringLights a={[0, gy - ph * 0.9]} b={[cx - pw / 2, gy - ph]} sag={30} n={14} seed={6} />
      <StringLights a={[cx + pw / 2, gy - ph]} b={[W, gy - ph * 0.9]} sag={30} n={14} seed={8} />
      <Pandal cx={cx} y={gy} w={pw} h={ph} c="#2a1438" trim="#f2c14e" uid={uid} />
      <Alpana W={W} y={gy} H={H} base="#1d0a10" ink="#e8d8c0" uid={uid} />
      <Crowd x0={-40} x1={W + 40} y={gy + (P ? 220 : 150)} h={P ? 200 : 170} c="#07040a" cloths={NIGHT_CLOTH} n={P ? 7 : 14} seed={7} />
      <Vignette W={W} H={H} uid={uid} />
    </g>
  );
}

// ── SAPTAMI ─────────────────────────────────────────────────────────────────

function SaptamiKolabou({ W, H, uid, P, smoke }: CompProps) {
  const t = TONES.bhor;
  const { gy } = lay(W, H, P);
  const wy = gy - (P ? 160 : 90);
  return (
    <g>
      <Sky W={W} H={H} slot="bhor" uid={uid} />
      <Clouds W={W} H={H} slot="bhor" count={4} seed={21} />
      <HowrahBridge x={W * (P ? 0.35 : 0.52)} y={wy - 6} w={P ? 620 : 640} c={t.far} />
      <Skyline W={W} y={wy - 2} c={t.far} seed={61} maxH={0.35} temple={false} />
      <River W={W} y={wy} H={H} slot="bhor" uid={uid} reflectX={W * 0.3} />
      <Ghat x={-40} y={gy - 30} w={W * (P ? 0.62 : 0.42)} c={t.mid} steps={9} stepH={P ? 26 : 18} />
      <KolaBou x={W * (P ? 0.44 : 0.3)} y={gy + 10} s={P ? 1.4 : 1.15} leaf="#1e3a22" cloth={t.cloth} />
      <Person x={W * (P ? 0.18 : 0.18)} y={gy + 14} h={P ? 190 : 160} pose="priest" c={t.near} cloth={t.cloth} />
      {smoke.map(([x, y], i) => (
        <Dhunuchi key={i} x={x} y={y} s={1.4} seed={i + 7} />
      ))}
      <Person x={W * (P ? 0.12 : 0.38)} y={gy + (P ? 64 : 40)} h={P ? 180 : 150} pose="dhaki" c={t.near} cloth="#5a2a3a" flip={!P} />
      <Vignette W={W} H={H} uid={uid} strength={0.4} />
    </g>
  );
}

function SaptamiNabapatrika({ W, H, uid, P, smoke, flame }: CompProps) {
  const { gy, cx } = lay(W, H, P);
  const r = P ? 330 : 300;
  const ccx = cx + (P ? 90 : 120);
  return (
    <g>
      <Drapes W={W} H={H} c1="#5a0f12" c2="#8a1a1a" trim="#e9b949" />
      <Chalchitra cx={ccx} y={gy} r={r} uid={uid} silhouette="#3a0d0a" />
      <Alpana W={W} y={gy} H={H} base="#7a1d12" uid={uid} />
      <KolaBou x={ccx - r * 1.35} y={gy + 6} s={P ? 1.6 : 1.5} leaf="#1f4a24" cloth="#f6efe2" />
      {flame.map(([x, y], i) => (
        <Diya key={i} x={x} y={y} s={1.6} d={i * 0.4} />
      ))}
      {smoke.map(([x, y], i) => (
        <Dhunuchi key={i} x={x} y={y} s={1.5} seed={i + 11} />
      ))}
      {[0.38, 0.46, 0.54].map((f) => (
        <Lotus key={f} x={W * f + (P ? 120 : 60)} y={gy + 40} s={1.4} />
      ))}
      <Vignette W={W} H={H} uid={uid} strength={0.5} />
    </g>
  );
}

function SaptamiAarti({ W, H, uid, P, smoke }: CompProps) {
  const t = TONES.raat;
  const { gy, cx } = lay(W, H, P);
  const pw = P ? 820 : 900;
  const ph = P ? 620 : 470;
  return (
    <g>
      <Sky W={W} H={H} slot="raat" uid={uid} seed={8} />
      <Skyline W={W} y={gy - 40} c={t.far} seed={71} lit="#ffcf73" maxH={1.6} />
      <Pandal cx={cx} y={gy} w={pw} h={ph} c="#3a0f1a" trim="#f2c14e" uid={uid} />
      <Alpana W={W} y={gy} H={H} base="#24080c" ink="#e8d8c0" uid={uid} />
      <Person x={cx + (P ? 80 : 60)} y={gy + 70} h={P ? 260 : 220} pose="priest" c="#0a0508" cloth="#cbb9a0" />
      {smoke.map(([x, y], i) => (
        <Dhunuchi key={i} x={x} y={y} s={1.6} seed={i + 13} />
      ))}
      <Person x={cx - (P ? 300 : 360)} y={gy + 80} h={P ? 230 : 200} pose="dhaki" c="#0a0508" cloth="#3d2030" />
      <Crowd x0={-40} x1={W + 40} y={gy + (P ? 300 : 210)} h={P ? 200 : 180} c="#040205" cloths={NIGHT_CLOTH} n={P ? 6 : 12} seed={17} />
      <Vignette W={W} H={H} uid={uid} />
    </g>
  );
}

// ── ASHTAMI ─────────────────────────────────────────────────────────────────

function AshtamiAnjali({ W, H, uid, P }: CompProps) {
  const t = TONES.bhor;
  const { gy, cx } = lay(W, H, P);
  return (
    <g>
      <Sky W={W} H={H} slot="bhor" uid={uid} seed={2} />
      <Skyline W={W} y={gy - 60} c={t.far} seed={81} maxH={1.3} />
      <Pandal cx={cx} y={gy} w={P ? 720 : 760} h={P ? 520 : 380} c="#5a2a3a" trim="#f2c14e" uid={uid} />
      <Alpana W={W} y={gy} H={H} base="#7a1d12" uid={uid} />
      <Crowd x0={-30} x1={W + 30} y={gy + (P ? 150 : 110)} h={P ? 190 : 160} c="#2a1018" cloths={SAREES} poses={["anjali"]} n={P ? 6 : 12} seed={23} married />
      <Crowd x0={-30} x1={W + 30} y={gy + (P ? 330 : 220)} h={P ? 220 : 190} c="#1d0a10" cloths={SAREES} poses={["anjali"]} n={P ? 5 : 10} seed={29} married />
      <Vignette W={W} H={H} uid={uid} strength={0.4} />
    </g>
  );
}

function AshtamiKumari({ W, H, uid, P, smoke }: CompProps) {
  const { gy, cx } = lay(W, H, P);
  return (
    <g>
      <Drapes W={W} H={H} c1="#4a0c18" c2="#7a1830" trim="#f2c14e" />
      {/* jaali arch window behind */}
      <path d={`M${cx - 200},${gy} L${cx - 200},${gy - 300} A200,200 0 0 1 ${cx + 200},${gy - 300} L${cx + 200},${gy} Z`} fill="#f2c14e" opacity="0.18" />
      <Alpana W={W} y={gy} H={H} base="#7a1d12" uid={uid} />
      <rect x={cx - 90} y={gy - 30} width={180} height={30} rx={6} fill="#6b3a1a" />
      <Person x={cx} y={gy - 28} h={P ? 230 : 200} pose="seated" c="#2a0d0a" cloth="#d42a1e" border={IVORY} />
      {[-150, -110, 110, 150].map((dx, i) => (
        <Diya key={dx} x={cx + dx} y={gy + 30} s={1.6} d={i * 0.3} />
      ))}
      {[-60, 0, 60].map((dx) => (
        <Lotus key={dx} x={cx + dx} y={gy + 50} s={1.3} />
      ))}
      {smoke.map(([x, y], i) => (
        <Dhunuchi key={i} x={x} y={y} s={1.5} seed={i + 21} />
      ))}
      <Person x={cx + (P ? 260 : 330)} y={gy + 40} h={P ? 250 : 230} pose="priest" c="#2a0d0a" cloth="#f2e9da" flip />
      {!P && <Crowd x0={-20} x1={W * 0.22} y={gy + 60} h={210} c="#2a0d0a" cloths={SAREES} n={3} seed={33} married />}
      <Vignette W={W} H={H} uid={uid} />
    </g>
  );
}

function AshtamiSandhi({ W, H, uid, P, smoke }: CompProps) {
  const { gy, cx } = lay(W, H, P);
  return (
    <g>
      <Drapes W={W} H={H} c1="#1c0608" c2="#3a0c10" trim="#a8741a" />
      <Chalchitra cx={cx} y={gy - (P ? 280 : 190)} r={P ? 160 : 170} uid={uid} silhouette="#2a0806" />
      <rect x={0} y={gy - (P ? 280 : 190)} width={W} height={(P ? 280 : 190) + 10} fill="#140405" />
      <ProdipStand cx={cx} y={gy - 10} w={P ? 700 : 900} rows={P ? 9 : 6} cols={P ? 12 : 18} />
      <Alpana W={W} y={gy} H={H} base="#2a0808" ink="#d8c0a0" uid={uid} />
      {Array.from({ length: P ? 9 : 15 }, (_, i) => (
        <Lotus key={i} x={cx - (P ? 380 : 620) + i * (P ? 95 : 88)} y={gy + 50} s={1.3} />
      ))}
      {smoke.map(([x, y], i) => (
        <Dhunuchi key={i} x={x} y={y} s={1.6} seed={i + 31} />
      ))}
      <Vignette W={W} H={H} uid={uid} strength={0.65} />
    </g>
  );
}

function AshtamiBhog({ W, H, uid, P }: CompProps) {
  const { gy, cx } = lay(W, H, P);
  const rows = P ? [gy - 120, gy - 40, gy + 50, gy + 150] : [gy - 90, gy - 30, gy + 40, gy + 120];
  return (
    <g>
      <rect width={W} height={H} fill="#f3e1bf" />
      {/* striped shamiana canopy */}
      {Array.from({ length: Math.ceil(W / 80) }, (_, i) => (
        <path key={i} d={`M${i * 80},0 L${i * 80 + 80},0 L${cx + (i * 80 + 40 - cx) * 0.4 + 30},${gy - 260} L${cx + (i * 80 + 40 - cx) * 0.4 - 30},${gy - 260} Z`} fill={i % 2 ? "#c2241a" : "#f6e8cc"} />
      ))}
      <rect x={0} y={gy - 270} width={W} height={20} fill="#e9b949" />
      <rect x={0} y={gy - 250} width={W} height={H} fill="#c9a36a" />
      {rows.map((ry, j) => {
        const n = P ? 4 + j : 7 + j * 2;
        const spread = (P ? 0.7 : 0.55) + j * 0.12;
        return (
          <g key={j}>
            <rect x={cx - (W * spread) / 2 - 30} y={ry + 6} width={W * spread + 60} height={10 + j * 3} fill="#8a5a2a" opacity="0.4" />
            {Array.from({ length: n }, (_, i) => (
              <Plate key={i} x={cx - (W * spread) / 2 + ((W * spread) / (n - 1)) * i} y={ry} s={1.1 + j * 0.3} kind="bhog" />
            ))}
          </g>
        );
      })}
      <Person x={W * (P ? 0.12 : 0.1)} y={gy + 200} h={P ? 300 : 260} pose="man" c="#3a1a10" cloth="#f2e9da" />
      <Person x={W * (P ? 0.9 : 0.92)} y={gy + 200} h={P ? 300 : 260} pose="woman" c="#3a1a10" cloth="#ffd34d" flip married />
      <Vignette W={W} H={H} uid={uid} strength={0.35} />
    </g>
  );
}

// ── NAVAMI ──────────────────────────────────────────────────────────────────

function NavamiDhunuchi({ W, H, uid, P, smoke }: CompProps) {
  const { gy, cx } = lay(W, H, P);
  return (
    <g>
      <Sky W={W} H={H} slot="raat" uid={uid} seed={10} />
      <Pandal cx={cx} y={gy - (P ? 120 : 80)} w={P ? 860 : 1000} h={P ? 600 : 460} c="#1e0a2a" trim="#e9a23b" uid={uid} />
      <Alpana W={W} y={gy - (P ? 120 : 80)} H={H} base="#14060e" ink="#cbb8d8" uid={uid} />
      {smoke.map(([x, y], i) => {
        // The dhunuchi is held at local (16, -108): place each dancer so the pot sits on its hotspot.
        const h = P ? 230 : 200;
        const flip = i % 2 === 1;
        return <Person key={i} x={x - (flip ? -1 : 1) * 0.16 * h} y={y + 1.08 * h} h={h} pose="dancer" c="#08040c" cloth={["#f4ead8", "#e8463a", "#ffd34d"][i % 3]} d={i * 0.4} flip={flip} married />;
      })}
      <Person x={W * 0.06} y={gy + 120} h={P ? 230 : 200} pose="dhaki" c="#08040c" cloth="#3d2030" />
      <Person x={W * 0.94} y={gy + 120} h={P ? 230 : 200} pose="dhaki" c="#08040c" cloth="#2a3050" flip d={0.3} />
      <Crowd x0={-40} x1={W + 40} y={gy + (P ? 380 : 260)} h={P ? 190 : 170} c="#030105" cloths={NIGHT_CLOTH} n={P ? 6 : 12} seed={41} />
      <Vignette W={W} H={H} uid={uid} strength={0.6} />
    </g>
  );
}

function NavamiAarti({ W, H, uid, P, smoke }: CompProps) {
  const t = TONES.sondhe;
  const { gy, cx } = lay(W, H, P);
  return (
    <g>
      <Sky W={W} H={H} slot="sondhe" uid={uid} seed={12} />
      <Skyline W={W} y={gy - 30} c={t.far} seed={91} lit={t.light} maxH={1.4} />
      <Pandal cx={cx} y={gy} w={P ? 780 : 860} h={P ? 560 : 430} c="#3a1028" trim="#f2c14e" uid={uid} />
      <Alpana W={W} y={gy} H={H} base="#2b0d13" uid={uid} />
      <Person x={cx + (P ? 90 : 70)} y={gy + 70} h={P ? 250 : 220} pose="priest" c="#1a0610" cloth="#e7c0a6" />
      {smoke.map(([x, y], i) => (
        <Dhunuchi key={i} x={x} y={y} s={1.6} seed={i + 41} />
      ))}
      <Person x={cx - (P ? 290 : 380)} y={gy + 90} h={P ? 230 : 200} pose="dhaki" c="#1a0610" cloth="#4a1931" />
      <Crowd x0={-40} x1={W + 40} y={gy + (P ? 300 : 210)} h={P ? 200 : 180} c="#12030a" cloths={SAREES} n={P ? 6 : 12} seed={43} married />
      <Vignette W={W} H={H} uid={uid} />
    </g>
  );
}

function NavamiMela({ W, H, uid, P }: CompProps) {
  const t = TONES.raat;
  const { gy } = lay(W, H, P);
  return (
    <g>
      <Sky W={W} H={H} slot="raat" uid={uid} seed={14} />
      <Skyline W={W} y={gy - 40} c={t.far} seed={101} lit="#ffcf73" maxH={1.2} />
      <FerrisWheel cx={W * (P ? 0.4 : 0.28)} cy={gy - (P ? 420 : 300)} R={P ? 290 : 230} c="#6a5a8a" />
      <Tarp x={W * (P ? 0.56 : 0.58)} y={gy - 200} w={W * 0.22} h={200} c="#9a2a3a" />
      <Tarp x={W * 0.8} y={gy - 210} w={W * 0.22} h={210} c="#2a6a5a" />
      {[0.64, 0.74, 0.86, 0.96].map((f, i) => (
        <Bulb key={f} x={W * f} y={gy - 190} len={20} d={i * 0.5} />
      ))}
      <StringLights a={[0, gy - (P ? 760 : 560)]} b={[W, gy - (P ? 700 : 520)]} sag={40} n={P ? 16 : 30} seed={12} />
      <Ground W={W} y={gy} H={H} c="#0d0915" />
      <Crowd x0={-30} x1={W + 30} y={gy + (P ? 120 : 80)} h={P ? 210 : 180} c="#06040a" cloths={NIGHT_CLOTH.concat(["#7a2a3a"])} poses={["woman", "man", "child"]} n={P ? 7 : 14} seed={47} />
      <Vignette W={W} H={H} uid={uid} />
    </g>
  );
}

// ── DASHAMI ─────────────────────────────────────────────────────────────────

function DashamiBoron({ W, H, uid, P, smoke }: CompProps) {
  const { gy, cx } = lay(W, H, P);
  const ccx = cx + (P ? 120 : 220);
  return (
    <g>
      <Drapes W={W} H={H} c1="#3a0a10" c2="#6a1018" trim="#f2c14e" />
      <Chalchitra cx={ccx} y={gy} r={P ? 300 : 280} uid={uid} silhouette="#2a0806" />
      <Alpana W={W} y={gy} H={H} base="#6a1610" uid={uid} />
      {(P ? [0.14, 0.34] : [0.08, 0.2, 0.32, 0.44]).map((f, i) => (
        <Person key={f} x={W * f} y={gy + 60 + (i % 2) * 20} h={P ? 250 : 230} pose="boron" c="#2a0806" cloth="#f6efe2" married d={i * 0.3} />
      ))}
      {smoke.map(([x, y], i) => (
        <Dhunuchi key={i} x={x} y={y} s={1.5} seed={i + 51} />
      ))}
      <Vignette W={W} H={H} uid={uid} />
    </g>
  );
}

function DashamiSindoor({ W, H, uid, P }: CompProps) {
  const t = TONES.dupur;
  const { gy, cx } = lay(W, H, P);
  const pairs = P ? [0.3, 0.72] : [0.18, 0.42, 0.66, 0.88];
  return (
    <g>
      <Sky W={W} H={H} slot="dupur" uid={uid} seed={5} />
      <Skyline W={W} y={gy - 60} c="#b06a4e" seed={111} maxH={1.6} />
      <Pandal cx={cx} y={gy - 20} w={P ? 640 : 700} h={P ? 440 : 320} c="#8a2a1a" trim="#f2c14e" uid={uid} lit={false} />
      <Ground W={W} y={gy - 20} H={H} c="#b23a24" />
      {Array.from({ length: P ? 6 : 10 }, (_, i) => (
        <Smoke key={i} x={W * ((i + 0.5) / (P ? 6 : 10))} y={gy + 100} s={2.2} puffs={5} seed={i + 61} tint="#ff3b22" spread={2} />
      ))}
      {pairs.map((f, i) => (
        <g key={f}>
          <Person x={W * f - 50} y={gy + 130 + (i % 2) * 40} h={P ? 260 : 220} pose="sindoor" c="#3a1410" cloth="#f8f0e2" married />
          <Person x={W * f + 50} y={gy + 130 + (i % 2) * 40} h={P ? 255 : 215} pose="woman" c="#3a1410" cloth="#f8f0e2" married flip />
        </g>
      ))}
      <Person x={W * 0.04} y={gy + 220} h={P ? 240 : 210} pose="dhaki" c="#3a1410" cloth={t.cloth} />
    </g>
  );
}

function DashamiBisarjan({ W, H, uid, P, smoke }: CompProps) {
  const t = TONES.sondhe;
  const { gy } = lay(W, H, P);
  const wy = gy - (P ? 200 : 120);
  const bx = W * (P ? 0.42 : 0.4);
  return (
    <g>
      <Sky W={W} H={H} slot="sondhe" uid={uid} seed={16} />
      <Clouds W={W} H={H} slot="sondhe" count={4} seed={33} />
      <HowrahBridge x={W * (P ? -0.1 : 0.06)} y={wy - 4} w={P ? 620 : 600} c={t.far} />
      <River W={W} y={wy} H={H} slot="sondhe" uid={uid} reflectX={bx} />
      <Boat
        x={bx}
        y={wy + (P ? 190 : 130)}
        s={P ? 1.4 : 1.3}
        c="#1a0610"
        cargo={<Chalchitra cx={bx} y={wy + (P ? 170 : 112)} r={P ? 110 : 96} uid={`${uid}b`} silhouette="#2a0a08" />}
      />
      <Person x={bx - (P ? 130 : 120)} y={wy + (P ? 175 : 116)} h={P ? 120 : 100} pose="man" c="#1a0610" cloth="#5a2a3a" />
      <Person x={bx + (P ? 140 : 130)} y={wy + (P ? 175 : 116)} h={P ? 120 : 100} pose="dhaki" c="#1a0610" cloth="#3a1a24" />
      <Ghat x={W * (P ? 0.55 : 0.66)} y={gy - 40} w={W * (P ? 0.6 : 0.4)} c={t.mid} steps={8} stepH={P ? 30 : 20} pavilion={!P} />
      {smoke.map(([x, y], i) => (
        <Dhunuchi key={i} x={x} y={y} s={1.5} seed={i + 71} />
      ))}
      <Crowd x0={W * (P ? 0.58 : 0.68)} x1={W + 20} y={gy + (P ? 170 : 110)} h={P ? 210 : 180} c={t.near} cloths={["#f4ead8", RED, "#ffd34d"]} n={P ? 4 : 6} seed={53} married />
      <Vignette W={W} H={H} uid={uid} strength={0.45} />
    </g>
  );
}

// ── BIJOYA ──────────────────────────────────────────────────────────────────

function BijoyaEmpty({ W, H, uid, P, flame }: CompProps) {
  const t = TONES.bhor;
  const { gy, cx } = lay(W, H, P);
  const bw = P ? 600 : 720;
  return (
    <g>
      <Sky W={W} H={H} slot="bhor" uid={uid} seed={20} />
      <Clouds W={W} H={H} slot="bhor" count={3} seed={44} />
      <Skyline W={W} y={gy - 80} c={t.far} seed={121} maxH={1} />
      <Haze W={W} y={gy - 80} h={140} color={t.haze} uid={uid} opacity={0.6} />
      <Ground W={W} y={gy} H={H} c="#3a2430" />
      <Bamboo x={cx - bw / 2} y={gy} w={bw} h={P ? 440 : 360} c="#6a4a4a" />
      <StringLights a={[cx - bw / 2, gy - (P ? 440 : 360)]} b={[cx + bw / 2, gy - (P ? 440 : 360)]} sag={50} n={16} on={0} seed={4} />
      {flame.map(([x, y], i) => (
        <Diya key={i} x={x} y={y} s={2} d={i} />
      ))}
      <KashField x0={-60} x1={W * 0.3} y={gy + 40} count={P ? 16 : 24} seed={13} c="#4a3048" plume="#f6e6e0" hMin={160} hMax={300} />
      <KashField x0={W * 0.7} x1={W + 60} y={gy + 40} count={P ? 16 : 24} seed={15} c="#4a3048" plume="#f6e6e0" hMin={160} hMax={300} />
      <Vignette W={W} H={H} uid={uid} strength={0.4} />
    </g>
  );
}

function BijoyaKash({ W, H, uid, P }: CompProps) {
  const t = TONES.dupur;
  const { gy } = lay(W, H, P);
  const hz = gy - (P ? 320 : 180);
  return (
    <g>
      <Sky W={W} H={H} slot="dupur" uid={uid} seed={22} />
      <Clouds W={W} H={H} slot="dupur" count={P ? 4 : 7} seed={55} />
      <River W={W} y={hz} H={gy} slot="dupur" uid={uid} reflectX={W * 0.6} />
      <Boat x={W * 0.62} y={hz + 50} s={0.5} c="#3a2a22" />
      <Haze W={W} y={hz + 6} h={40} color={t.haze} uid={uid} opacity={0.5} />
      <Ground W={W} y={gy - 60} H={H} c="#8c8a4e" />
      <KashField x0={-40} x1={W + 40} y={gy - 50} count={P ? 30 : 60} seed={17} c="#7e7a4a" plume="#f7f2e4" hMin={70} hMax={150} />
      <Ground W={W} y={gy} H={H} c="#6f6b3a" />
      <KashField x0={-60} x1={W + 60} y={gy} count={P ? 26 : 46} seed={19} c="#5e5a32" plume="#fffaf0" hMin={200} hMax={360} />
    </g>
  );
}

function BijoyaPronam({ W, H, uid, P, flame }: CompProps) {
  const { gy, cx } = lay(W, H, P);
  const ww = P ? 380 : 420;
  const wh = P ? 330 : 280;
  const wx = cx - ww / 2 - (P ? 0 : 120);
  const wy = gy - wh - (P ? 90 : 60);
  return (
    <g>
      <rect width={W} height={H} fill="#3a1e1a" />
      {/* lime-washed wall texture */}
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={0} y={i * (H / 10)} width={W} height={2} fill="#000" opacity="0.08" />
      ))}
      {/* arched jaali window glowing with dusk light */}
      <g>
        <path d={`M${wx},${wy + wh} L${wx},${wy + ww / 2} A${ww / 2},${ww / 2} 0 0 1 ${wx + ww},${wy + ww / 2} L${wx + ww},${wy + wh} Z`} fill="#f08b4c" opacity="0.75" />
        <clipPath id={`jw${uid}`}>
          <path d={`M${wx},${wy + wh} L${wx},${wy + ww / 2} A${ww / 2},${ww / 2} 0 0 1 ${wx + ww},${wy + ww / 2} L${wx + ww},${wy + wh} Z`} />
        </clipPath>
        <g clipPath={`url(#jw${uid})`}>
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={`v${i}`} x={wx + i * 30 - 4} y={wy - 40} width={7} height={wh + 80} fill="#3a1e1a" />
          ))}
          {Array.from({ length: 16 }, (_, i) => (
            <rect key={`h${i}`} x={wx} y={wy - 40 + i * 30} width={ww} height={7} fill="#3a1e1a" />
          ))}
        </g>
        <path d={`M${wx - 14},${wy + wh} L${wx - 14},${wy + ww / 2} A${ww / 2 + 14},${ww / 2 + 14} 0 0 1 ${wx + ww + 14},${wy + ww / 2} L${wx + ww + 14},${wy + wh}`} stroke="#c88a3a" strokeWidth={8} fill="none" />
      </g>
      <Ground W={W} y={gy} H={H} c="#5a2a1e" />
      <rect x={0} y={gy} width={W} height={6} fill="#2a1410" />
      <rect x={cx + (P ? 40 : 140)} y={gy - 60} width={180} height={60} rx={6} fill="#6b3a1a" />
      <Plate x={cx + (P ? 130 : 230)} y={gy - 64} s={1.5} kind="naru" />
      {flame.map(([x, y], i) => (
        <Diya key={i} x={x} y={y} s={1.8} d={i} />
      ))}
      <Person x={cx - (P ? 210 : 250)} y={gy + 30} h={P ? 300 : 270} pose="woman" c="#1a0a08" cloth="#f6efe2" married flip />
      <Person x={cx - (P ? 60 : 80)} y={gy + 30} h={P ? 290 : 260} pose="pronam" c="#1a0a08" cloth="#e9b949" />
      <Vignette W={W} H={H} uid={uid} strength={0.6} />
    </g>
  );
}

export const COMPOSITIONS: Record<string, (p: CompProps) => ReactNode> = {
  "agomoni-kash": AgomoniKash,
  "agomoni-kumortuli": AgomoniKumortuli,
  "agomoni-para": AgomoniPara,
  "shashthi-bodhon": ShashthiBodhon,
  "shashthi-dhaki": ShashthiDhaki,
  "shashthi-pandal": ShashthiPandal,
  "saptami-kolabou": SaptamiKolabou,
  "saptami-nabapatrika": SaptamiNabapatrika,
  "saptami-aarti": SaptamiAarti,
  "ashtami-anjali": AshtamiAnjali,
  "ashtami-kumari": AshtamiKumari,
  "ashtami-sandhi": AshtamiSandhi,
  "ashtami-bhog": AshtamiBhog,
  "navami-dhunuchi": NavamiDhunuchi,
  "navami-aarti": NavamiAarti,
  "navami-mela": NavamiMela,
  "dashami-boron": DashamiBoron,
  "dashami-sindoor": DashamiSindoor,
  "dashami-bisarjan": DashamiBisarjan,
  "bijoya-empty": BijoyaEmpty,
  "bijoya-kash": BijoyaKash,
  "bijoya-pronam": BijoyaPronam,
};
