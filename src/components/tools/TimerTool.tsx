"use client";

import { useSettings } from "@/context/settings-context";
import { createAlarmAudio } from "@/lib/alarmSounds";
import { useAlarmWorker } from "@/hooks/useAlarmWorker";
import {
  Check,
  Copy,
  Code2,
  Maximize2,
  Minus,
  Minimize2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Share2,
  Volume2,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

type Phase = "idle" | "running" | "paused" | "done";

export type TimerToolProps = {
  initialSeconds?: number;
  /** Shown in the browser tab while the countdown runs */
  pageTitle?: string;
  embedOnly?: boolean;
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

const MAX_CUSTOM_HOURS = 99;

type FullscreenDoc = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
};

type FullscreenEl = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};

export function TimerTool({ initialSeconds, pageTitle, embedOnly = false }: TimerToolProps) {
  const { settings } = useSettings();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryT = searchParams.get("t");
  const queryEmbed = searchParams.get("embed");
  const isEmbedMode = embedOnly || queryEmbed === "1";
  const querySeconds = queryT ? Number.parseInt(queryT, 10) : NaN;
  const fromQuery = Number.isFinite(querySeconds) && querySeconds > 0 ? querySeconds : undefined;
  const defaultMs = (fromQuery ?? initialSeconds ?? 5 * 60) * 1000;
  const timeFont = settings.isDigitalFont ? "font-lcd" : "font-sans";

  const [phase, setPhase] = useState<Phase>("idle");
  const [totalMs, setTotalMs] = useState(defaultMs);
  const [endAtMs, setEndAtMs] = useState<number | null>(null);
  const [displayRemaining, setDisplayRemaining] = useState(defaultMs);
  const [customHours, setCustomHours] = useState("0");
  const [customMinutes, setCustomMinutes] = useState("5");
  const [customSeconds, setCustomSeconds] = useState("0");
  const [embedOrigin, setEmbedOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [clockScale, setClockScale] = useState(1);

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
    const wholeSeconds = Math.max(1, Math.ceil(defaultMs / 1000));
    const h = Math.floor(wholeSeconds / 3600);
    const m = Math.floor((wholeSeconds % 3600) / 60);
    const s = wholeSeconds % 60;
    setCustomHours(String(h));
    setCustomMinutes(String(m));
    setCustomSeconds(String(s));
  }, [defaultMs]);

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

  const playAlarm = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.currentTime = 0;
      a.play().catch(() => {});
    }
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("Timer finished", {
        body: "Your countdown reached zero.",
        tag: "utility-timer",
      });
    }
  }, []);

  const primeAudio = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    const prevMuted = a.muted;
    a.muted = true;
    a.currentTime = 0;
    a.play()
      .then(() => {
        a.pause();
        a.currentTime = 0;
        a.muted = prevMuted;
      })
      .catch(() => {
        a.muted = prevMuted;
      });
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
    primeAudio();
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

  const applyCustomDuration = () => {
    if (phase === "running") return;
    const h = Math.min(MAX_CUSTOM_HOURS, Math.max(0, Number.parseInt(customHours || "0", 10) || 0));
    const m = Math.min(59, Math.max(0, Number.parseInt(customMinutes || "0", 10) || 0));
    const s = Math.min(59, Math.max(0, Number.parseInt(customSeconds || "0", 10) || 0));
    const ms = (h * 3600 + m * 60 + s) * 1000;
    const next = ms > 0 ? ms : 1000;
    setTotalMs(next);
    setDisplayRemaining(next);
    if (phase === "done") setPhase("idle");
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
  const embedSeconds = Math.max(1, Math.ceil(totalMs / 1000));
  const embedSrc = `${embedOrigin}${pathname}?t=${embedSeconds}&embed=1`;
  const iframeCode = `<iframe src="${embedSrc}" width="420" height="480" style="border:0;border-radius:12px;overflow:hidden;" title="Utility Clock Timer"></iframe>`;
  const shareUrl = embedOrigin ? `${embedOrigin}${pathname}` : pathname;
  const shareText = pageTitle ?? "Utility Clock Timer";
  const encUrl = encodeURIComponent(shareUrl);
  const encText = encodeURIComponent(shareText);
  const shareLinks = [
    {
      id: "facebook",
      label: "f",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`,
      cls: "bg-[#1877f2] text-white",
    },
    {
      id: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encUrl}&text=${encText}`,
      cls: "bg-black text-white",
    },
    {
      id: "whatsapp",
      label: "WA",
      href: `https://api.whatsapp.com/send?text=${encText}%20${encUrl}`,
      cls: "bg-[#25D366] text-white",
    },
    {
      id: "blogger",
      label: "B",
      href: `https://www.blogger.com/blog-this.g?u=${encUrl}&n=${encText}`,
      cls: "bg-[#f57d00] text-white",
    },
    {
      id: "reddit",
      label: "R",
      href: `https://www.reddit.com/submit?url=${encUrl}&title=${encText}`,
      cls: "bg-[#ff4500] text-white",
    },
    {
      id: "tumblr",
      label: "T",
      href: `https://www.tumblr.com/widgets/share/tool?canonicalUrl=${encUrl}&title=${encText}`,
      cls: "bg-[#35465c] text-white",
    },
    {
      id: "pinterest",
      label: "P",
      href: `https://pinterest.com/pin/create/button/?url=${encUrl}&description=${encText}`,
      cls: "bg-[#e60023] text-white",
    },
    {
      id: "linkedin",
      label: "in",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`,
      cls: "bg-[#0a66c2] text-white",
    },
  ] as const;

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

  const shareCurrent = async () => {
    setShareMenuOpen((v) => !v);
  };

  const shrinkClock = () => {
    setClockScale((v) => Math.max(0.8, Math.round((v - 0.1) * 10) / 10));
  };

  const growClock = () => {
    setClockScale((v) => Math.min(1.8, Math.round((v + 0.1) * 10) / 10));
  };

  return (
    <div
      ref={shellRef}
      className="mx-auto w-full max-w-3xl space-y-8 rounded-2xl bg-white/80 p-4 dark:bg-zinc-950/80 sm:p-6 [&:fullscreen]:bg-white dark:[&:fullscreen]:bg-zinc-950"
      style={{ "--clock-scale": clockScale } as CSSProperties}
    >
      {!isEmbedMode && <div className="flex items-center justify-end gap-2 text-zinc-300">
        <button
          type="button"
          onClick={shareCurrent}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-600 hover:bg-zinc-800"
          title={shareCopied ? "Copied" : "Share"}
          aria-label={shareCopied ? "Link copied" : "Share timer"}
        >
          <Share2 className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={shrinkClock}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-600 hover:bg-zinc-800"
          title="Smaller timer"
          aria-label="Smaller timer"
        >
          <Minus className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={growClock}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-600 hover:bg-zinc-800"
          title="Bigger timer"
          aria-label="Bigger timer"
        >
          <Plus className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-600 hover:bg-zinc-800"
          title={isFullscreen ? "Exit full screen" : "Full page"}
          aria-label={isFullscreen ? "Exit full screen" : "Full page"}
          aria-pressed={isFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" aria-hidden />
          ) : (
            <Maximize2 className="h-4 w-4" aria-hidden />
          )}
        </button>
      </div>}

      {!isEmbedMode && shareMenuOpen && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/60 p-2">
          {shareLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-sm px-2 text-xs font-semibold ${item.cls}`}
              aria-label={`Share on ${item.id}`}
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(shareUrl);
                setShareCopied(true);
                setTimeout(() => setShareCopied(false), 1200);
              } catch {
                setShareCopied(false);
              }
            }}
            className="inline-flex h-9 items-center gap-1 rounded-sm border border-zinc-600 px-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
          >
            {shareCopied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
            {shareCopied ? "Copied" : "Copy"}
          </button>
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
            className="inline-flex h-9 items-center gap-1 rounded-sm border border-zinc-600 px-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800"
          >
            <Code2 className="h-3.5 w-3.5" aria-hidden />
            {embedCopied ? "Embed copied" : "Embed"}
          </button>
        </div>
      )}

      <div className="mx-auto w-full max-w-3xl rounded-2xl border border-zinc-800/80 bg-zinc-900/50 px-4 py-8 sm:px-8 sm:py-10">
        <div className="text-center">
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

      {!isEmbedMode && <div className="flex flex-wrap items-center justify-center gap-2">
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
      </div>}

      {phase === "idle" && !isFullscreen && !isEmbedMode && (
        <section className="space-y-3 rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Set timer</h3>
        <div className="grid grid-cols-3 gap-2">
          <label className="space-y-1 text-xs text-zinc-500">
            <span>Hours</span>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={customHours}
              onChange={(e) => setCustomHours(e.target.value.replace(/[^\d]/g, ""))}
              className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="space-y-1 text-xs text-zinc-500">
            <span>Minutes</span>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value.replace(/[^\d]/g, ""))}
              className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
          <label className="space-y-1 text-xs text-zinc-500">
            <span>Seconds</span>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              value={customSeconds}
              onChange={(e) => setCustomSeconds(e.target.value.replace(/[^\d]/g, ""))}
              className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>
        </div>
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">Applies to start button and embed snippet.</p>
          <button
            type="button"
            onClick={applyCustomDuration}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Set timer
          </button>
        </div>
        </section>
      )}

      {phase === "idle" && !isFullscreen && !isEmbedMode && (
        <section className="space-y-2 rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Embed this timer</h3>
        <p className="text-xs text-zinc-500">
          Copy and paste this iframe into your website to show the current timer preset.
        </p>
        <textarea
          readOnly
          value={iframeCode}
          rows={3}
          className="w-full rounded-md border border-zinc-300 bg-zinc-50 p-2 font-mono text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(iframeCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 1400);
              } catch {
                setCopied(false);
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? "Copied" : "Copy embed code"}
          </button>
        </div>
        </section>
      )}

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

        {!isEmbedMode && typeof Notification !== "undefined" && Notification.permission !== "granted" && (
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
