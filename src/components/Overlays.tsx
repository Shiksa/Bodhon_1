"use client";

import { memo, type CSSProperties } from "react";
import type { Overlay } from "@/config/scenes";
import { rng } from "./scenes/kit";

const v = (o: Record<string, string | number>) => o as unknown as CSSProperties;

function Shiuli({ size }: { size: number }) {
  // Night jasmine: white petals, saffron tube.
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 20 30" aria-hidden>
      <path d="M10,12 L10,29" stroke="#f08a1c" strokeWidth="2.6" strokeLinecap="round" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="10" cy="5.5" rx="3.1" ry="5.6" fill="#fffaf1" transform={`rotate(${a} 10 11)`} />
      ))}
      <circle cx="10" cy="11" r="2.2" fill="#f5a02a" />
    </svg>
  );
}

function Petal({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden>
      <path d="M10,1 C16,5 16,14 10,19 C4,14 4,5 10,1 Z" fill={color} />
    </svg>
  );
}

export const Overlays = memo(function Overlays({ kinds }: { kinds: Overlay[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {kinds.includes("shiuli") &&
        (() => {
          const r = rng(5);
          return Array.from({ length: 14 }, (_, i) => (
            <div
              key={`sh${i}`}
              className="fall"
              style={v({ left: `${r() * 100}%`, "--t": `${12 + r() * 10}s`, "--delay": `${-r() * 20}s`, "--sx": `${(r() - 0.5) * 160}px` })}
            >
              <Shiuli size={10 + r() * 8} />
            </div>
          ));
        })()}
      {kinds.includes("petals") &&
        (() => {
          const r = rng(9);
          const colors = ["#ff9f1c", "#ffbf3a", "#e3261a", "#ff7a2e", "#fff3d6"];
          return Array.from({ length: 18 }, (_, i) => (
            <div
              key={`pe${i}`}
              className="fall"
              style={v({ left: `${r() * 100}%`, "--t": `${10 + r() * 9}s`, "--delay": `${-r() * 18}s`, "--sx": `${(r() - 0.5) * 200}px` })}
            >
              <Petal size={9 + r() * 9} color={colors[i % colors.length]} />
            </div>
          ));
        })()}
      {kinds.includes("embers") &&
        (() => {
          const r = rng(13);
          return Array.from({ length: 22 }, (_, i) => {
            const s = 2 + r() * 3;
            return (
              <span
                key={`em${i}`}
                className="rise"
                style={v({
                  left: `${10 + r() * 80}%`,
                  width: s,
                  height: s,
                  background: i % 3 ? "#ffb347" : "#ffe08a",
                  boxShadow: "0 0 8px 2px rgba(255,150,60,.55)",
                  "--t": `${6 + r() * 6}s`,
                  "--delay": `${-r() * 10}s`,
                  "--sx": `${(r() - 0.5) * 120}px`,
                })}
              />
            );
          });
        })()}
      {kinds.includes("sindoor") &&
        (() => {
          const r = rng(21);
          return Array.from({ length: 26 }, (_, i) => {
            const s = 3 + r() * 7;
            return (
              <span
                key={`sd${i}`}
                className="rise"
                style={v({
                  left: `${r() * 100}%`,
                  width: s,
                  height: s,
                  background: "radial-gradient(circle, rgba(255,60,40,.95), rgba(227,38,26,0) 70%)",
                  "--t": `${9 + r() * 8}s`,
                  "--delay": `${-r() * 16}s`,
                  "--sx": `${(r() - 0.5) * 200}px`,
                })}
              />
            );
          });
        })()}
    </div>
  );
});
