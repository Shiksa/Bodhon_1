"use client";

import { useEffect, useState } from "react";
import { PHASES, SCHEDULE } from "@/config/tithis";
import { formatDayEn, formatLeft, istDate, now, upcoming } from "@/lib/time";
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
  const today = istDate(t);
  let label: React.ReactNode = null;
  if (u.today.length) {
    label = (
      <>
        <span className="opacity-80">আজ</span>{" "}
        {u.today.map((e) => e.bn).join(" · ")}
      </>
    );
  } else if (u.next && u.target) {
    label = (
      <>
        {u.next.bn} <span className="opacity-70">আর</span>{" "}
        <span className="tabular-nums">{formatLeft(u.target - t)}</span>
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
        <CalendarIcon
          width={16}
          height={16}
          className="text-[color:var(--accent)]"
        />
        <span>{label}</span>
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-30 mt-2 flex max-h-[min(70svh,560px)] w-[min(92vw,420px)] -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-[color:var(--accent)]/40 bg-[#1a0b06]/95 text-left shadow-2xl backdrop-blur-xl">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-[14px] font-semibold text-ivory">
              Durga Puja 2026 ·{" "}
              <span className="font-serif font-normal text-[color:var(--accent)]">
                পুজোর নির্ঘণ্ট
              </span>
            </p>
            <p className="text-[11px] text-ivory/50">Kolkata calendar, IST</p>
          </div>
          <ol className="space-y-2 overflow-y-auto overscroll-contain p-3">
            {SCHEDULE.map((d) => {
              const isToday = d.date === today;
              return (
                <li
                  key={d.id}
                  className={`rounded-xl border p-3 ${isToday ? "border-[color:var(--accent)]/70 bg-[color:var(--accent)]/10" : "border-white/10 bg-white/[0.03]"}`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[14px] font-semibold text-ivory">
                        {d.name}
                      </span>
                      <span className="ml-1.5 font-serif text-[14px] text-[color:var(--accent)]">
                        {d.nameBn}
                      </span>
                      {isToday && (
                        <span className="ml-2 rounded-full bg-[color:var(--accent)] px-1.5 py-px text-[9.5px] font-bold uppercase tracking-wider text-[#2a1205]">
                          Today
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-[12px] text-ivory/70">
                      {formatDayEn(d.date)}
                    </span>
                  </div>
                  <div className="text-[11px] text-ivory/45">
                    {d.bengaliDate}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {d.rituals.map((r) => (
                      <span
                        key={r}
                        className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[11px] text-ivory/85"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                  {d.tithi && (
                    <div className="mt-1.5 text-[11.5px] text-ivory/60">
                      Tithi: {d.tithi}
                    </div>
                  )}
                  {d.times?.map((x) => (
                    <div
                      key={x.label}
                      className="mt-1 flex justify-between gap-3 text-[12px]"
                    >
                      <span className="text-ivory/75">{x.label}</span>
                      <span className="shrink-0 font-semibold tabular-nums text-[color:var(--accent)]">
                        {x.value}
                      </span>
                    </div>
                  ))}
                  {d.note && (
                    <div className="mt-1.5 text-[11px] italic text-ivory/50">
                      {d.note}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="border-t border-white/10 px-4 py-2.5 text-[11px] leading-snug text-ivory/50">
            Ritual times can differ by panjika. Follow the times announced by
            your pandal.
          </p>
        </div>
      )}
    </div>
  );
}
