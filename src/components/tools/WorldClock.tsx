"use client";

import { useSettings } from "@/context/settings-context";
import {
  loadSavedCities,
  saveCities,
  type SavedCity,
} from "@/lib/worldClockStorage";
import { formatInTimeZone } from "date-fns-tz";
import { Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

function useClockTick(intervalMs = 250) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

function zoneToLabel(timeZone: string): string {
  const tail = timeZone.split("/").pop() ?? timeZone;
  return tail.replace(/_/g, " ");
}

function WorldClockReadout({
  timeZone,
  label,
}: {
  timeZone: string;
  label: string;
}) {
  const { settings } = useSettings();
  const now = useClockTick(250);
  const timePattern = settings.is12Hour ? "hh:mm:ss a" : "HH:mm:ss";
  const timeFont = settings.isDigitalFont ? "font-lcd" : "font-sans";

  const timeStr = useMemo(
    () => formatInTimeZone(now, timeZone, timePattern),
    [now, timeZone, timePattern],
  );
  const dateStr = useMemo(
    () => formatInTimeZone(now, timeZone, "EEEE, MMMM d, yyyy"),
    [now, timeZone],
  );
  const offsetStr = useMemo(
    () => formatInTimeZone(now, timeZone, "OOOO"),
    [now, timeZone],
  );

  return (
    <>
      <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">{label}</h2>
      <p
        className={`${timeFont} clock-scale-world mt-4 tabular-nums tracking-wide text-clock-primary drop-shadow-clock`}
      >
        {timeStr}
      </p>
      {settings.showDate ? (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{dateStr}</p>
      ) : null}
      <p className="mt-1 text-xs text-zinc-500">
        {timeZone} · {offsetStr}
      </p>
    </>
  );
}

export type WorldClockCityViewProps = {
  timeZone: string;
  label: string;
};

export function WorldClockCityView({ timeZone, label }: WorldClockCityViewProps) {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white/60 p-8 dark:border-zinc-800 dark:bg-zinc-900/40">
      <WorldClockReadout timeZone={timeZone} label={label} />
    </div>
  );
}

function getAllTimeZones(): string[] {
  if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
    try {
      return Intl.supportedValuesOf("timeZone");
    } catch {
      /* ignore */
    }
  }
  return [
    "UTC",
    "America/New_York",
    "Europe/London",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];
}

export function WorldClockHub() {
  const [cities, setCities] = useState<SavedCity[]>([]);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCities(loadSavedCities());
  }, []);

  const allZones = useMemo(() => getAllTimeZones(), []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: string[] = [];
    for (const z of allZones) {
      if (z.toLowerCase().includes(q)) {
        out.push(z);
        if (out.length >= 40) break;
      }
    }
    return out;
  }, [allZones, query]);

  const persist = useCallback((next: SavedCity[]) => {
    setCities(next);
    saveCities(next);
  }, []);

  const addCity = (timeZone: string) => {
    const label = zoneToLabel(timeZone);
    if (cities.some((c) => c.timeZone === timeZone)) return;
    persist([...cities, { timeZone, label }]);
    setQuery("");
  };

  const removeCity = (timeZone: string) => {
    persist(cities.filter((c) => c.timeZone !== timeZone));
  };

  if (!mounted) {
    return (
      <div className="h-48 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/30" />
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-400">
          Add city
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search time zone (e.g. Tokyo, Europe)"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
            autoComplete="off"
          />
        </div>
        {suggestions.length > 0 && (
          <ul className="max-h-48 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/80">
            {suggestions.map((z) => (
              <li key={z}>
                <button
                  type="button"
                  onClick={() => addCity(z)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-900"
                >
                  <Plus className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                  <span className="font-medium">{zoneToLabel(z)}</span>
                  <span className="truncate text-xs text-zinc-500">{z}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {query.trim().length >= 2 && suggestions.length === 0 && (
          <p className="text-sm text-zinc-500">No matches. Try another spelling.</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cities.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No cities saved yet. Search above to add — your list is stored in this browser only.
          </p>
        ) : (
          cities.map((c) => (
            <div
              key={c.timeZone}
              className="relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 pr-12"
            >
              <button
                type="button"
                onClick={() => removeCity(c.timeZone)}
                className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                aria-label={`Remove ${c.label}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <WorldClockReadout timeZone={c.timeZone} label={c.label} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function WorldClockPlaceholder(props: { timeZone: string; label: string }) {
  return <WorldClockCityView {...props} />;
}
