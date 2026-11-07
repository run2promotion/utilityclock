"use client";

import { useSettings } from "@/context/settings-context";
import { useI18n } from "@/context/locale-context";
import { useNow } from "@/hooks/useNow";
import { AnalogClock } from "@/components/clock/AnalogClock";
import { Clock, Globe } from "lucide-react";
import { formatInTimeZone } from "date-fns-tz";
import { useMemo, useState } from "react";

const QUICK_TIMEZONES = [
  { id: "local", label: "Local Time" },
  { id: "UTC", label: "UTC / GMT" },
  { id: "America/New_York", label: "New York (EST/EDT)" },
  { id: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
  { id: "Europe/London", label: "London (GMT/BST)" },
  { id: "Europe/Paris", label: "Paris (CET/CEST)" },
  { id: "Asia/Dubai", label: "Dubai (GST)" },
  { id: "Asia/Kolkata", label: "India (IST)" },
  { id: "Asia/Singapore", label: "Singapore (SGT)" },
  { id: "Asia/Tokyo", label: "Tokyo (JST)" },
  { id: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
];

export function BigDigitalClock() {
  const now = useNow(500);
  const { settings } = useSettings();
  const { locale } = useI18n();
  const [viewMode, setViewMode] = useState<"digital" | "analog" | "both">("digital");
  const [showSeconds, setShowSeconds] = useState(true);
  const [selectedTz, setSelectedTz] = useState("local");

  const fontClass = settings.isDigitalFont ? "font-lcd" : "font-sans";

  const { timeString, dateString, tzLabel } = useMemo(() => {
    const isLocal = selectedTz === "local";
    let tStr = "";
    let dStr = "";
    let label = "";

    if (isLocal) {
      tStr = now.toLocaleTimeString(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: showSeconds ? "2-digit" : undefined,
        hour12: settings.is12Hour,
      });
      dStr = now.toLocaleDateString(locale, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      label = "Local System Time";
    } else {
      const pattern = settings.is12Hour
        ? showSeconds
          ? "hh:mm:ss a"
          : "hh:mm a"
        : showSeconds
          ? "HH:mm:ss"
          : "HH:mm";
      tStr = formatInTimeZone(now, selectedTz, pattern);
      dStr = formatInTimeZone(now, selectedTz, "EEEE, MMMM d, yyyy");
      const matched = QUICK_TIMEZONES.find((z) => z.id === selectedTz);
      label = matched ? matched.label : selectedTz;
    }

    return { timeString: tStr, dateString: dStr, tzLabel: label };
  }, [now, selectedTz, showSeconds, settings.is12Hour, locale]);

  return (
    <section
      aria-label="Clock display"
      className="space-y-3 rounded-3xl border border-zinc-200 bg-gradient-to-b from-zinc-100/90 to-zinc-50 p-6 shadow-[inset_0_1px_0_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:from-zinc-900/80 dark:to-zinc-950 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/60 pb-3 text-xs text-zinc-600 dark:border-zinc-800/80 dark:text-zinc-400">
        <div className="flex items-center gap-1.5 font-medium">
          <Globe className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
          <label htmlFor="tz-select" className="sr-only">
            Select time zone
          </label>
          <select
            id="tz-select"
            value={selectedTz}
            onChange={(e) => setSelectedTz(e.target.value)}
            className="cursor-pointer rounded-md border border-zinc-300 bg-white/80 px-2 py-1 text-xs text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
          >
            {QUICK_TIMEZONES.map((tz) => (
              <option key={tz.id} value={tz.id}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowSeconds((s) => !s)}
            className={`rounded-md border px-2 py-1 text-xs transition ${
              showSeconds
                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-zinc-300 bg-white/60 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
            }`}
            title="Toggle seconds"
            aria-pressed={showSeconds}
          >
            Seconds
          </button>
          <button
            type="button"
            onClick={() =>
              setViewMode((m) =>
                m === "digital" ? "analog" : m === "analog" ? "both" : "digital",
              )
            }
            className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white/60 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            title="Switch between Digital, Analog, or Dual views"
          >
            <Clock className="h-3 w-3" aria-hidden />
            <span className="capitalize">{viewMode}</span>
          </button>
        </div>
      </div>

      <div
        className={`flex flex-col items-center justify-center gap-6 py-6 ${
          viewMode === "both" ? "lg:flex-row lg:gap-12" : ""
        }`}
      >
        {(viewMode === "analog" || viewMode === "both") && (
          <div className="flex justify-center py-2">
            <AnalogClock date={now} size={240} showSeconds={showSeconds} />
          </div>
        )}

        {(viewMode === "digital" || viewMode === "both") && (
          <div className="text-center">
            <p
              suppressHydrationWarning
              className={`${fontClass} clock-scale-home text-center tabular-nums tracking-[0.2em] text-clock-primary drop-shadow-clock`}
            >
              {timeString}
            </p>
            {settings.showDate && (
              <p
                suppressHydrationWarning
                className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400 sm:text-sm"
              >
                {dateString}
              </p>
            )}
            <p className="mt-1 text-center text-[11px] text-zinc-600 dark:text-zinc-400">
              {tzLabel}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
