"use client";

import { useSettings } from "@/context/settings-context";
import {
  loadSavedCities,
  saveCities,
  type SavedCity,
} from "@/lib/worldClockStorage";
import { formatInTimeZone } from "date-fns-tz";
import {
  Check,
  Clock,
  Copy,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

function useClockTick(intervalMs = 500) {
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
  const now = useClockTick(500);
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
        suppressHydrationWarning
        className={`${timeFont} clock-scale-world mt-4 tabular-nums tracking-wide text-clock-primary drop-shadow-clock`}
      >
        {timeStr}
      </p>
      {settings.showDate ? (
        <p suppressHydrationWarning className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {dateStr}
        </p>
      ) : null}
      <p suppressHydrationWarning className="mt-1 text-xs text-zinc-500">
        {timeZone} · {offsetStr}
      </p>
    </>
  );
}

export type WorldClockCityViewProps = {
  timeZone: string;
  label: string;
  embedOnly?: boolean;
};

export function WorldClockCityView({ timeZone, label, embedOnly = false }: WorldClockCityViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEmbedMode = embedOnly || searchParams.get("embed") === "1";
  const [embedOrigin, setEmbedOrigin] = useState("");
  const [embedCopied, setEmbedCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmbedOrigin(window.location.origin);
    }
  }, []);

  const embedSrc = `${embedOrigin}${pathname}?embed=1`;
  const iframeCode = `<iframe src="${embedSrc}" width="420" height="260" style="border:0;border-radius:12px;overflow:hidden;" title="Utility Clock World Clock"></iframe>`;

  return (
    <div className="space-y-3">
      <div
        className={`mx-auto w-full max-w-3xl rounded-2xl border border-zinc-200 bg-white/60 p-8 dark:border-zinc-800 dark:bg-zinc-900/40 ${
          embedOnly ? "max-w-full rounded-none border-0 bg-transparent p-4" : ""
        }`}
      >
        <WorldClockReadout timeZone={timeZone} label={label} />
      </div>
      {!isEmbedMode && (
        <section className="mx-auto w-full max-w-3xl space-y-2 rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
            Embed this world clock
          </h3>
          <textarea
            readOnly
            value={iframeCode}
            rows={2}
            className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-2 font-mono text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(iframeCode);
                  setEmbedCopied(true);
                  setTimeout(() => setEmbedCopied(false), 1200);
                } catch {
                  setEmbedCopied(false);
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {embedCopied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
              {embedCopied ? "Copied" : "Copy embed code"}
            </button>
          </div>
        </section>
      )}
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
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Dubai",
    "Asia/Kolkata",
    "Asia/Singapore",
    "Asia/Tokyo",
    "Australia/Sydney",
  ];
}

const DEFAULT_POPULAR_CITIES: SavedCity[] = [
  { timeZone: "America/New_York", label: "New York" },
  { timeZone: "Europe/London", label: "London" },
  { timeZone: "Asia/Tokyo", label: "Tokyo" },
  { timeZone: "Australia/Sydney", label: "Sydney" },
];

export function WorldClockHub({ embedOnly = false }: { embedOnly?: boolean } = {}) {
  const searchParams = useSearchParams();
  const isEmbedMode = embedOnly || searchParams.get("embed") === "1";
  const [cities, setCities] = useState<SavedCity[]>([]);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [plannerOffsetHours, setPlannerOffsetHours] = useState(0);

  useEffect(() => {
    setMounted(true);
    const saved = loadSavedCities();
    if (saved.length > 0) {
      setCities(saved);
    } else {
      setCities(DEFAULT_POPULAR_CITIES);
    }
  }, []);

  const allZones = useMemo(() => getAllTimeZones(), []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: string[] = [];
    for (const z of allZones) {
      if (z.toLowerCase().includes(q)) {
        out.push(z);
        if (out.length >= 35) break;
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

  const loadDefaults = () => {
    persist(DEFAULT_POPULAR_CITIES);
  };

  if (!mounted) {
    return (
      <div className="h-48 animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/30" />
    );
  }

  if (isEmbedMode) {
    const first = cities[0] ?? { timeZone: "UTC", label: "UTC" };
    return <WorldClockCityView timeZone={first.timeZone} label={first.label} embedOnly />;
  }

  return (
    <div className="space-y-8">
      {/* City Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="world-clock-search" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Search city or time zone
          </label>
          {cities.length === 0 && (
            <button
              type="button"
              onClick={loadDefaults}
              className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline dark:text-emerald-400"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Load major world hubs
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            id="world-clock-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city or time zone (e.g. Paris, Tokyo, America/Chicago)"
            className="w-full rounded-xl border border-zinc-300 bg-white py-2.5 pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-600"
            autoComplete="off"
          />
        </div>
        {suggestions.length > 0 && (
          <ul className="max-h-48 overflow-y-auto rounded-xl border border-zinc-300 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950/90">
            {suggestions.map((z) => (
              <li key={z}>
                <button
                  type="button"
                  onClick={() => addCity(z)}
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
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
          <p className="text-xs text-zinc-500">No matches found. Try searching by country, region, or IANA name.</p>
        )}
      </div>

      {/* World Clock Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {cities.map((c) => (
          <div
            key={c.timeZone}
            className="relative rounded-2xl border border-zinc-200 bg-white/70 p-6 pr-12 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <button
              type="button"
              onClick={() => removeCity(c.timeZone)}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-zinc-400 transition hover:bg-zinc-200 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              aria-label={`Remove ${c.label}`}
              title="Remove city"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <WorldClockReadout timeZone={c.timeZone} label={c.label} />
          </div>
        ))}
      </div>

      {/* Multi-City Meeting & Time Planner Comparison */}
      {cities.length > 1 && (
        <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Time Zone Meeting & Overlap Planner
              </h3>
              <p className="text-xs text-zinc-500">
                Slide the time offset to compare the exact local hour across all your saved cities.
              </p>
            </div>
            <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {plannerOffsetHours === 0
                ? "Showing: Current Time"
                : `Offset: +${plannerOffsetHours}h from now`}
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="24"
              step="1"
              value={plannerOffsetHours}
              onChange={(e) => setPlannerOffsetHours(Number(e.target.value))}
              className="h-2 w-full cursor-pointer accent-emerald-600"
              aria-label="Hour offset slider"
            />
            <div className="flex justify-between text-[11px] text-zinc-500">
              <span>Now</span>
              <span>+6 Hours</span>
              <span>+12 Hours</span>
              <span>+18 Hours</span>
              <span>+24 Hours</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500 dark:border-zinc-800">
                  <th className="py-2.5 pr-4 font-semibold">City</th>
                  <th className="py-2.5 pr-4 font-semibold">Planned Time</th>
                  <th className="py-2.5 pr-4 font-semibold">Day</th>
                  <th className="py-2.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60">
                {cities.map((c) => {
                  const targetDate = new Date(Date.now() + plannerOffsetHours * 3600 * 1000);
                  const timeStr = formatInTimeZone(targetDate, c.timeZone, "hh:mm a");
                  const hour24 = Number(formatInTimeZone(targetDate, c.timeZone, "H"));
                  const dayStr = formatInTimeZone(targetDate, c.timeZone, "EEE, MMM d");
                  const isWorkHours = hour24 >= 9 && hour24 <= 17;
                  const isSleepingHours = hour24 >= 22 || hour24 <= 6;

                  return (
                    <tr key={c.timeZone} className="hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40">
                      <td className="py-2.5 pr-4 font-medium text-zinc-900 dark:text-zinc-100">
                        {c.label}
                      </td>
                      <td className="py-2.5 pr-4 font-mono font-semibold text-clock-primary">
                        {timeStr}
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-zinc-500">
                        {dayStr}
                      </td>
                      <td className="py-2.5 text-xs font-semibold">
                        {isWorkHours ? (
                          <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-emerald-700 dark:text-emerald-400">
                            Work Hours
                          </span>
                        ) : isSleepingHours ? (
                          <span className="rounded bg-zinc-200 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            Night
                          </span>
                        ) : (
                          <span className="rounded bg-amber-500/15 px-2 py-0.5 text-amber-700 dark:text-amber-400">
                            Awake (Off-hours)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export function WorldClockPlaceholder(props: { timeZone: string; label: string }) {
  return <WorldClockCityView {...props} />;
}
