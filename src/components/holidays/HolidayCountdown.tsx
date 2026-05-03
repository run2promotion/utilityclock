"use client";

import { useSettings } from "@/context/settings-context";
import type { HolidayDefinition } from "@/data/holidays";
import { buildHolidaySeoArticle, getNextHolidayOccurrence } from "@/data/holidays";
import { useEffect, useMemo, useState } from "react";

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function splitRemaining(ms: number) {
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const sec = Math.floor(ms / 1000);
  const days = Math.floor(sec / 86_400);
  let rest = sec % 86_400;
  const hours = Math.floor(rest / 3600);
  rest %= 3600;
  const minutes = Math.floor(rest / 60);
  const seconds = rest % 60;
  return { days, hours, minutes, seconds };
}

function Starfield() {
  const stars = useMemo(() => {
    return Array.from({ length: 96 }, (_, i) => {
      const left = ((i * 37) % 100) + (i % 7) * 0.3;
      const top = ((i * 53) % 100) + (i % 5) * 0.2;
      const size = 1 + (i % 3);
      const hue = [45, 180, 280, 320, 200, 30][i % 6];
      const delay = (i % 10) * 0.35;
      return { left, top, size, hue, delay };
    });
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full opacity-70 motion-safe:animate-pulse"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            background: `hsla(${s.hue}, 90%, 72%, 0.95)`,
            boxShadow: `0 0 ${4 + (i % 4)}px hsla(${s.hue}, 100%, 70%, 0.9), 0 0 ${12 + (i % 8)}px hsla(${s.hue}, 90%, 50%, 0.35)`,
            animationDuration: `${2.5 + (i % 5) * 0.4}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.2)_0%,rgba(2,6,23,0.95)_70%)]" />
    </div>
  );
}

export type HolidayCountdownProps = {
  holiday: HolidayDefinition;
};

export function HolidayCountdown({ holiday }: HolidayCountdownProps) {
  const { settings } = useSettings();
  const fontClass = settings.isDigitalFont ? "font-lcd" : "font-sans";

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const target = useMemo(() => {
    const d = new Date(now);
    return getNextHolidayOccurrence(holiday, d);
  }, [holiday, now]);

  const targetTs = target.getTime();
  const remainingMs = targetTs - now;

  const parts = splitRemaining(remainingMs);
  const year = target.getFullYear();
  const article = buildHolidaySeoArticle(holiday, year, target);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-700/80 bg-zinc-950 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-zinc-950 to-black" />
      <Starfield />

      <div className="relative z-10 space-y-10 px-4 py-12 sm:px-8 sm:py-16">
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">
            {holiday.countryLabel}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
            {holiday.name}{" "}
            <span className="text-zinc-500">{year}</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400">
            Next observance:{" "}
            <time dateTime={target.toISOString()}>
              {target.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
          </p>
        </header>

        <div className="mx-auto max-w-4xl">
          <p
            className={`${fontClass} flex flex-wrap items-center justify-center gap-2 text-center text-4xl tabular-nums tracking-widest text-clock-primary drop-shadow-clock sm:gap-3 sm:text-5xl md:text-6xl lg:text-7xl`}
            style={{
              fontSize: `clamp(1.75rem, 5vw, 4.5rem)`,
            }}
          >
            <span className="inline-flex min-w-[4.5ch] flex-col items-center rounded-2xl border border-white/10 bg-black/30 px-3 py-2 sm:px-4">
              <span className="text-[0.45em] font-sans font-medium uppercase tracking-widest text-zinc-500">
                Days
              </span>
              {parts.days}
            </span>
            <span className="text-zinc-600" aria-hidden>
              :
            </span>
            <span className="inline-flex min-w-[3ch] flex-col items-center rounded-2xl border border-white/10 bg-black/30 px-3 py-2 sm:px-4">
              <span className="text-[0.45em] font-sans font-medium uppercase tracking-widest text-zinc-500">
                Hr
              </span>
              {pad2(parts.hours)}
            </span>
            <span className="text-zinc-600" aria-hidden>
              :
            </span>
            <span className="inline-flex min-w-[3ch] flex-col items-center rounded-2xl border border-white/10 bg-black/30 px-3 py-2 sm:px-4">
              <span className="text-[0.45em] font-sans font-medium uppercase tracking-widest text-zinc-500">
                Min
              </span>
              {pad2(parts.minutes)}
            </span>
            <span className="text-zinc-600" aria-hidden>
              :
            </span>
            <span className="inline-flex min-w-[3ch] flex-col items-center rounded-2xl border border-white/10 bg-black/30 px-3 py-2 sm:px-4">
              <span className="text-[0.45em] font-sans font-medium uppercase tracking-widest text-zinc-500">
                Sec
              </span>
              {pad2(parts.seconds)}
            </span>
          </p>
        </div>

        <article className="mx-auto max-w-3xl px-1">
          <p className="text-base leading-relaxed text-zinc-300 sm:text-[17px]">
            {article}
          </p>
        </article>
      </div>
    </div>
  );
}
