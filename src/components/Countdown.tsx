"use client";

import { useEffect, useState } from "react";
import { EVENTS, PHASES } from "@/config/tithis";
import { bn, formatDateBn, formatLeft, istInstant, now, phaseStart, upcoming } from "@/lib/time";
import { CalendarIcon } from "./Icons";

/** The chip under the title: what's next in the pujo calendar, and the full schedule on tap. */
export function Countdown() {
  const [t, setT] = useState(() => now());
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const id = window.setInterval(() => setT(now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const u = upcoming(t);
  let label: React.ReactNode = null;
  if (u.today.length) {
    label = (
      <>
        <span className="opacity-80">আজ</span> {u.today.map((e) => e.bn).join(" · ")}
      </>
    );
  } else if (u.next && u.target) {
    label = (
      <>
        {u.next.bn} <span className="opacity-70">আর</span> <span className="tabular-nums">{formatLeft(u.target - t)}</span>
      </>
    );
  } else {
    const nextYear = PHASES[PHASES.length - 1];
    label = <>{nextYear.captions[0].bn}</>;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-[color:var(--accent)]/50 bg-black/35 px-3.5 py-1.5 font-serif text-[15px] text-ivory backdrop-blur-md transition hover:bg-black/50"
        aria-expanded={open}
      >
        <CalendarIcon width={16} height={16} className="text-[color:var(--accent)]" />
        <span>{label}</span>
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-30 mt-2 w-[min(92vw,360px)] -translate-x-1/2 rounded-2xl border border-[color:var(--accent)]/40 bg-[#1a0b06]/90 p-4 text-left shadow-2xl backdrop-blur-xl">
          <p className="mb-2 font-serif text-sm text-[color:var(--accent)]">পুজোর নির্ঘণ্ট · Pujo schedule (IST)</p>
          <ul className="space-y-1.5 text-sm">
            {PHASES.slice(1, 6).map((p) => {
              const evs = EVENTS.filter((e) => istInstant(e.date) >= phaseStart(p) && istInstant(e.date) < phaseStart(p) + 86_400_000);
              const date = new Date(phaseStart(p) + 330 * 60_000).toISOString().slice(0, 10);
              const isToday = t >= phaseStart(p) && t < phaseStart(p) + 86_400_000;
              return (
                <li key={p.id} className={`flex justify-between gap-3 rounded-lg px-2 py-1 ${isToday ? "bg-[color:var(--accent)]/15" : ""}`}>
                  <span className="font-serif">
                    {p.bnLong}
                    {evs.length > 0 && <span className="block text-xs opacity-70">{evs.map((e) => (e.time ? `${e.bn} ${bn(e.time)}` : e.bn)).join(" · ")}</span>}
                  </span>
                  <span className="shrink-0 opacity-80">{formatDateBn(date)}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-[11px] leading-snug opacity-60">কলকাতার পঞ্জিকা অনুযায়ী। নির্দিষ্ট সময় আপনার মণ্ডপে জেনে নিন। · Kolkata calendar; confirm exact times at your pandal.</p>
        </div>
      )}
    </div>
  );
}
