"use client";

import { useSettings } from "@/context/settings-context";
import { useNow } from "@/hooks/useNow";

export function BigDigitalClock() {
  const now = useNow(1000);
  const { settings } = useSettings();
  const fontClass = settings.isDigitalFont ? "font-lcd" : "font-sans";

  return (
    <div className="rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-100/90 to-zinc-50 px-8 py-12 shadow-[inset_0_1px_0_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:from-zinc-900/80 dark:to-zinc-950 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <p
        className={`${fontClass} clock-scale-home text-center tabular-nums tracking-[0.2em] text-clock-primary drop-shadow-clock`}
      >
        {now.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: settings.is12Hour,
        })}
      </p>
      {settings.showDate ? (
        <p className="mt-4 text-center text-sm uppercase tracking-[0.35em] text-zinc-500 dark:text-zinc-500">
          {now.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      ) : null}
    </div>
  );
}
