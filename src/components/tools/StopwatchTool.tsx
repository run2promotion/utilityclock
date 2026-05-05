"use client";

import { useSettings } from "@/context/settings-context";
import { Check, ClipboardCopy, Copy, Flag, Pause, Play, RotateCcw } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export type LapRow = {
  id: number;
  lapIndex: number;
  /** Split since previous lap */
  lapMs: number;
  /** Elapsed when lap was taken */
  totalMs: number;
};

function formatStopwatch(ms: number): string {
  const clamped = Math.max(0, ms);
  const cs = Math.floor(clamped / 10) % 100;
  const s = Math.floor(clamped / 1000) % 60;
  const m = Math.floor(clamped / 60000) % 60;
  const h = Math.floor(clamped / 3600000);
  const pad = (n: number, len: number) => n.toString().padStart(len, "0");
  return `${pad(h, 2)}:${pad(m, 2)}:${pad(s, 2)}.${pad(cs, 2)}`;
}

function formatShort(ms: number): string {
  return formatStopwatch(ms);
}

export function StopwatchTool({ embedOnly = false }: { embedOnly?: boolean } = {}) {
  const { settings } = useSettings();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isEmbedMode = embedOnly || searchParams.get("embed") === "1";
  const timeFont = settings.isDigitalFont ? "font-lcd" : "font-mono";
  const [running, setRunning] = useState(false);
  const [displayMs, setDisplayMs] = useState(0);
  const [laps, setLaps] = useState<LapRow[]>([]);
  const [copyState, setCopyState] = useState<"idle" | "ok" | "err">("idle");
  const [embedOrigin, setEmbedOrigin] = useState("");
  const [embedCopied, setEmbedCopied] = useState(false);

  const baseMsRef = useRef(0);
  const segmentStartRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const lapCounter = useRef(0);
  const lastLapTotalRef = useRef(0);
  const autoStartedRef = useRef(false);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmbedOrigin(window.location.origin);
    }
  }, []);

  const stopRaf = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const readElapsed = useCallback(() => {
    const seg = segmentStartRef.current;
    if (seg === null) return baseMsRef.current;
    return baseMsRef.current + (performance.now() - seg);
  }, []);

  const tick = useCallback(() => {
    if (!runningRef.current) return;
    setDisplayMs(readElapsed());
    rafRef.current = requestAnimationFrame(tick);
  }, [readElapsed]);

  useEffect(() => {
    if (!running) {
      stopRaf();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => stopRaf();
  }, [running, tick]);

  const start = useCallback(() => {
    if (running) return;
    segmentStartRef.current = performance.now();
    setRunning(true);
  }, [running]);

  useEffect(() => {
    if (!isEmbedMode) return;
    if (autoStartedRef.current) return;
    autoStartedRef.current = true;
    start();
  }, [isEmbedMode, start]);

  const pause = () => {
    if (!running) return;
    const seg = segmentStartRef.current;
    if (seg !== null) {
      baseMsRef.current += performance.now() - seg;
      segmentStartRef.current = null;
    }
    setDisplayMs(baseMsRef.current);
    setRunning(false);
  };

  const reset = () => {
    stopRaf();
    baseMsRef.current = 0;
    segmentStartRef.current = null;
    lastLapTotalRef.current = 0;
    lapCounter.current = 0;
    setDisplayMs(0);
    setLaps([]);
    setRunning(false);
  };

  const lap = () => {
    if (!running) return;
    const total = readElapsed();
    const lapMs = total - lastLapTotalRef.current;
    lastLapTotalRef.current = total;
    lapCounter.current += 1;
    setLaps((prev) => [
      {
        id: Date.now() + lapCounter.current,
        lapIndex: lapCounter.current,
        lapMs,
        totalMs: total,
      },
      ...prev,
    ]);
  };

  const exportLaps = async () => {
    const lines = [
      `Total\t${formatShort(displayMs)}`,
      "",
      "Lap\tSplit\tCumulative",
      ...laps
        .slice()
        .reverse()
        .map(
          (r) =>
            `${r.lapIndex}\t${formatShort(r.lapMs)}\t${formatShort(r.totalMs)}`,
        ),
    ];
    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("ok");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("err");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  const hasStarted = displayMs > 0 || running || laps.length > 0;
  const embedSrc = `${embedOrigin}${pathname}?embed=1`;
  const iframeCode = `<iframe src="${embedSrc}" width="420" height="320" style="border:0;border-radius:12px;overflow:hidden;" title="Utility Clock Stopwatch"></iframe>`;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
        <p
          className={`${timeFont} clock-scale-stopwatch tabular-nums tracking-tight text-clock-primary drop-shadow-clock`}
          style={{ fontFeatureSettings: '"tnum"' }}
        >
          {formatStopwatch(displayMs)}
        </p>
        <p className="mt-2 text-xs text-zinc-500">Hours · minutes · seconds · centiseconds</p>
      </div>

      {!isEmbedMode && <div className="flex flex-wrap items-center justify-center gap-3">
        {!running ? (
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            <Play className="h-4 w-4" aria-hidden />
            {hasStarted ? "Resume" : "Start"}
          </button>
        ) : (
          <button
            type="button"
            onClick={pause}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-700 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-600"
          >
            <Pause className="h-4 w-4" aria-hidden />
            Pause
          </button>
        )}

        <button
          type="button"
          onClick={lap}
          disabled={!running}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-5 py-3 text-sm font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
        >
          <Flag className="h-4 w-4" aria-hidden />
          Lap
        </button>

        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Reset
        </button>

        <button
          type="button"
          onClick={exportLaps}
          disabled={laps.length === 0}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-40"
        >
          <ClipboardCopy className="h-4 w-4" aria-hidden />
          {copyState === "ok"
            ? "Copied"
            : copyState === "err"
              ? "Failed"
              : "Export laps"}
        </button>
      </div>}

      {!isEmbedMode && laps.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-zinc-400">Laps</h3>
          <ul className="max-h-56 overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/60 font-mono text-sm tabular-nums">
            {laps.map((r) => (
              <li
                key={r.id}
                className="flex justify-between gap-4 border-b border-zinc-800/80 px-4 py-2 last:border-0"
              >
                <span className="text-zinc-500">Lap {r.lapIndex}</span>
                <span className="text-clock-primary">{formatShort(r.lapMs)}</span>
                <span className="text-zinc-400">{formatShort(r.totalMs)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isEmbedMode && (
        <section className="space-y-2 rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Embed this stopwatch</h3>
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

export function StopwatchPlaceholder() {
  return <StopwatchTool />;
}
