"use client";

import { useSettings } from "@/context/settings-context";
import { createAlarmAudio } from "@/lib/alarmSounds";
import { useAlarmWorker } from "@/hooks/useAlarmWorker";
import {
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "idle" | "running" | "paused" | "done";

export type TimerToolProps = {
  initialSeconds?: number;
  /** Shown in the browser tab while the countdown runs */
  pageTitle?: string;
};

function formatMs(ms: number): string {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const PRESETS = [
  { label: "1m", ms: 60_000 },
  { label: "5m", ms: 5 * 60_000 },
  { label: "10m", ms: 10 * 60_000 },
  { label: "1h", ms: 60 * 60_000 },
] as const;

const R = 88;
const CIRC = 2 * Math.PI * R;

type FullscreenDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};

type FullscreenEl = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};

export function TimerTool({ initialSeconds, pageTitle }: TimerToolProps) {
  const { settings } = useSettings();
  const pathname = usePathname();
  const defaultMs = (initialSeconds ?? 5 * 60) * 1000;
  const timeFont = settings.isDigitalFont ? "font-lcd" : "font-sans";

  const [phase, setPhase] = useState<Phase>("idle");
  const [totalMs, setTotalMs] = useState(defaultMs);
  const [endAtMs, setEndAtMs] = useState<number | null>(null);
  const [displayRemaining, setDisplayRemaining] = useState(defaultMs);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const doneRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const endAtRef = useRef<number | null>(null);
  const phaseRef = useRef<Phase>("idle");
  const shellRef = useRef<HTMLDivElement | null>(null);
  const tabBaseTitleRef = useRef<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    tabBaseTitleRef.current = document.title;
  }, []);

  /** Keep baseline tab title in sync when Next.js updates `document.title` after client navigation. */
  useEffect(() => {
    tabBaseTitleRef.current = document.title;
  }, [pathname]);

  useEffect(() => {
    const onFs = () => {
      const doc = document as FullscreenDoc;
      const active =
        document.fullscreenElement === shellRef.current ||
        doc.webkitFullscreenElement === shellRef.current;
      setIsFullscreen(!!active);
    };
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs);
    return () => {
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs);
    };
  }, []);

  useEffect(() => {
    endAtRef.current = endAtMs;
  }, [endAtMs]);

  useEffect(() => {
    setTotalMs(defaultMs);
    setDisplayRemaining(defaultMs);
  }, [defaultMs]);

  const stopRaf = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const playAlarm = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.play().catch(() => {});
    }
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("Timer finished", {
        body: "Your countdown reached zero.",
        tag: "utility-timer",
      });
    }
  }, []);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    setPhase("done");
    setEndAtMs(null);
    endAtRef.current = null;
    setDisplayRemaining(0);
    stopRaf();
    playAlarm();
  }, [playAlarm]);

  const loop = useCallback(() => {
    const end = endAtRef.current;
    if (end === null || phaseRef.current !== "running") return;
    const left = Math.max(0, end - Date.now());
    setDisplayRemaining(left);
    if (left <= 0) {
      finish();
      return;
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [finish]);

  useEffect(() => {
    if (phase !== "running" || endAtMs === null) {
      stopRaf();
      return;
    }
    doneRef.current = false;
    rafRef.current = requestAnimationFrame(loop);
    return () => stopRaf();
  }, [phase, endAtMs, loop]);

  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = createAlarmAudio(settings.alarmSound);
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [settings.alarmSound]);

  const onWorkerDue = useCallback(() => {
    finish();
  }, [finish]);

  useAlarmWorker(
    phase === "running" && endAtMs !== null ? endAtMs : null,
    onWorkerDue,
    phase === "running" && endAtMs !== null,
  );

  const start = (durationMs: number) => {
    doneRef.current = false;
    setTotalMs(durationMs);
    const end = Date.now() + durationMs;
    endAtRef.current = end;
    setEndAtMs(end);
    setDisplayRemaining(durationMs);
    setPhase("running");
  };

  const pause = () => {
    if (phase !== "running" || endAtMs === null) return;
    const left = Math.max(0, endAtMs - Date.now());
    setDisplayRemaining(left);
    endAtRef.current = null;
    setEndAtMs(null);
    setPhase("paused");
  };

  const resume = () => {
    if (phase !== "paused") return;
    doneRef.current = false;
    const end = Date.now() + displayRemaining;
    endAtRef.current = end;
    setEndAtMs(end);
    setPhase("running");
  };

  const reset = () => {
    doneRef.current = false;
    setPhase("idle");
    endAtRef.current = null;
    setEndAtMs(null);
    setTotalMs(defaultMs);
    setDisplayRemaining(defaultMs);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const addMinute = () => {
    if (phase !== "running" || endAtMs === null) return;
    const add = 60_000;
    setTotalMs((t) => t + add);
    setEndAtMs((e) => {
      if (e === null) return e;
      const next = e + add;
      endAtRef.current = next;
      return next;
    });
    setDisplayRemaining((d) => d + add);
  };

  const dismissDone = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    doneRef.current = false;
    setPhase("idle");
    setTotalMs(defaultMs);
    setDisplayRemaining(defaultMs);
  };

  const requestNotify = async () => {
    if (typeof Notification === "undefined") return;
    try {
      await Notification.requestPermission();
    } catch {
      /* ignore */
    }
  };

  const shownMs = phase === "idle" ? totalMs : displayRemaining;
  const progress = totalMs > 0 ? 1 - Math.min(1, shownMs / totalMs) : 0;
  const dashOffset = CIRC * (1 - progress);

  useEffect(() => {
    const base = tabBaseTitleRef.current ?? document.title;
    const name = pageTitle ?? "Timer";
    if (phase === "running" || phase === "paused") {
      document.title = `${formatMs(shownMs)} · ${name}`;
    } else if (phase === "done") {
      document.title = `Time's up · ${name}`;
    } else {
      document.title = base;
    }
  }, [phase, shownMs, pageTitle]);

  useEffect(() => {
    return () => {
      const b = tabBaseTitleRef.current;
      if (b != null) document.title = b;
    };
  }, []);

  const toggleFullscreen = async () => {
    const el = shellRef.current as FullscreenEl | null;
    if (!el) return;
    const doc = document as FullscreenDoc;
    try {
      if (document.fullscreenElement || doc.webkitFullscreenElement) {
        if (document.exitFullscreen) await document.exitFullscreen();
        else await doc.webkitExitFullscreen?.();
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      }
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      ref={shellRef}
      className="mx-auto w-full max-w-lg space-y-8 rounded-2xl bg-white/80 p-4 dark:bg-zinc-950/80 sm:p-6 [&:fullscreen]:bg-white dark:[&:fullscreen]:bg-zinc-950"
    >
      <div className="relative mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center sm:max-w-[320px]">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 200 200"
          aria-hidden
        >
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-zinc-200 dark:text-zinc-800"
          />
          <circle
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-150 ease-linear"
            style={{ color: "var(--primary-clock-color)" }}
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="relative z-10 px-4 text-center">
          <p
            className={`${timeFont} clock-scale-timer tabular-nums tracking-wide text-clock-primary drop-shadow-clock`}
          >
            {formatMs(shownMs)}
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest text-zinc-500">
            {phase === "running"
              ? "Running"
              : phase === "paused"
                ? "Paused"
                : phase === "done"
                  ? "Done"
                  : "Ready"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            disabled={phase === "running"}
            onClick={() => {
              setTotalMs(p.ms);
              setDisplayRemaining(p.ms);
            }}
            className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-40"
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          onClick={toggleFullscreen}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
          aria-pressed={isFullscreen}
          title={isFullscreen ? "Exit full screen" : "Full screen"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" aria-hidden />
          ) : (
            <Maximize2 className="h-4 w-4" aria-hidden />
          )}
          <span className="hidden sm:inline">
            {isFullscreen ? "Exit full screen" : "Full screen"}
          </span>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {phase === "idle" && (
          <button
            type="button"
            onClick={() => start(totalMs)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            <Play className="h-4 w-4" aria-hidden />
            Start
          </button>
        )}

        {phase === "running" && (
          <>
            <button
              type="button"
              onClick={pause}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-700 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-600"
            >
              <Pause className="h-4 w-4" aria-hidden />
              Pause
            </button>
            <button
              type="button"
              onClick={addMinute}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-5 py-3 text-sm font-medium text-zinc-200 hover:bg-zinc-800"
            >
              <Plus className="h-4 w-4" aria-hidden />
              +1 min
            </button>
          </>
        )}

        {phase === "paused" && (
          <>
            <button
              type="button"
              onClick={resume}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              <Play className="h-4 w-4" aria-hidden />
              Resume
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Reset
            </button>
          </>
        )}

        {phase === "done" && (
          <button
            type="button"
            onClick={dismissDone}
            className="rounded-xl bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Dismiss
          </button>
        )}

        {typeof Notification !== "undefined" && Notification.permission !== "granted" && (
          <button
            type="button"
            onClick={requestNotify}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            <Volume2 className="h-4 w-4" aria-hidden />
            Enable notifications
          </button>
        )}
      </div>

      {phase === "done" && (
        <p className="text-center text-sm text-zinc-400" role="status">
          Time is up — sound played (unmute if needed).
        </p>
      )}
    </div>
  );
}

export function TimerToolPlaceholder(props: TimerToolProps) {
  return <TimerTool {...props} />;
}
