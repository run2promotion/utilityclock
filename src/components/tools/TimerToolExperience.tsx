"use client";

import { TimerTool } from "@/components/tools/TimerTool";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { useEffect, useMemo, useState } from "react";

type TimerToolExperienceProps = {
  initialSeconds?: number;
  pageTitle?: string;
  embedOnly?: boolean;
};

type WorkflowMode = {
  id: string;
  label: string;
  description: string;
  presetSeconds: number;
};

const MODES: WorkflowMode[] = [
  {
    id: "classic",
    label: "Classic",
    description: "Default countdown timer behavior.",
    presetSeconds: 5 * 60,
  },
  {
    id: "study",
    label: "Study Session",
    description: "50-minute deep-focus session.",
    presetSeconds: 50 * 60,
  },
  {
    id: "workout",
    label: "Workout Interval",
    description: "45-minute training block.",
    presetSeconds: 45 * 60,
  },
  {
    id: "kitchen",
    label: "Kitchen Prep",
    description: "15-minute cooking checkpoint.",
    presetSeconds: 15 * 60,
  },
  {
    id: "meeting",
    label: "Meeting Countdown",
    description: "30-minute timebox for calls.",
    presetSeconds: 30 * 60,
  },
];

const RETENTION_STORAGE_KEY = "utilityclock.timer.recent.v1";
const MAX_RECENTS = 8;

function saveRecentPreset(seconds: number) {
  try {
    const raw = localStorage.getItem(RETENTION_STORAGE_KEY);
    const prev = raw ? (JSON.parse(raw) as number[]) : [];
    const merged = [seconds, ...prev.filter((v) => v !== seconds)].slice(0, MAX_RECENTS);
    localStorage.setItem(RETENTION_STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem("utilityclock.timer.last.v1", String(seconds));
  } catch {
    /* ignore malformed storage */
  }
}

function readRecents(): number[] {
  try {
    const raw = localStorage.getItem(RETENTION_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as number[]) : [];
    return parsed.filter((n) => Number.isFinite(n) && n > 0).slice(0, MAX_RECENTS);
  } catch {
    return [];
  }
}

function humanize(seconds: number): string {
  if (seconds % 3600 === 0) return `${seconds / 3600}h`;
  if (seconds % 60 === 0) return `${seconds / 60}m`;
  return `${seconds}s`;
}

export function TimerToolExperience({
  initialSeconds,
  pageTitle,
  embedOnly = false,
}: TimerToolExperienceProps) {
  const workflowEnabled = isFeatureEnabled("workflowModes");
  const retentionEnabled = isFeatureEnabled("retentionLayer");
  const [selectedModeId, setSelectedModeId] = useState<string>("classic");
  const [recent, setRecent] = useState<number[]>([]);
  const [lastSeconds, setLastSeconds] = useState<number | null>(null);
  const [instanceKey, setInstanceKey] = useState(0);
  const selectedMode = MODES.find((m) => m.id === selectedModeId) ?? MODES[0];

  const startSeconds = useMemo(() => {
    if (!workflowEnabled) return initialSeconds;
    return selectedMode.presetSeconds;
  }, [workflowEnabled, selectedMode, initialSeconds]);

  useEffect(() => {
    if (!retentionEnabled) return;
    setRecent(readRecents());
    try {
      const raw = localStorage.getItem("utilityclock.timer.last.v1");
      const parsed = raw ? Number(raw) : NaN;
      setLastSeconds(Number.isFinite(parsed) && parsed > 0 ? parsed : null);
    } catch {
      setLastSeconds(null);
    }
  }, [retentionEnabled, instanceKey]);

  const runPreset = (seconds: number) => {
    saveRecentPreset(seconds);
    if (workflowEnabled) {
      const mode = MODES.find((m) => m.presetSeconds === seconds);
      if (mode) setSelectedModeId(mode.id);
    }
    setInstanceKey((k) => k + 1);
  };

  return (
    <div className="space-y-4">
      {!embedOnly && workflowEnabled && (
        <section className="rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Workflow modes</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  setSelectedModeId(mode.id);
                  runPreset(mode.presetSeconds);
                }}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition ${
                  mode.id === selectedModeId
                    ? "border-emerald-500 bg-emerald-500/10 text-zinc-900 dark:text-zinc-100"
                    : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                <p className="font-semibold">{mode.label}</p>
                <p className="mt-1 text-[11px] opacity-80">{mode.description}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {!embedOnly && retentionEnabled && recent.length > 0 && (
        <section className="rounded-xl border border-zinc-200 bg-white/80 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Recent presets</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {recent.map((seconds) => (
              <button
                key={seconds}
                type="button"
                onClick={() => runPreset(seconds)}
                className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {humanize(seconds)}
              </button>
            ))}
          </div>
          {lastSeconds ? (
            <button
              type="button"
              onClick={() => runPreset(lastSeconds)}
              className="mt-3 rounded-md border border-emerald-500/60 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300"
            >
              Repeat last session ({humanize(lastSeconds)})
            </button>
          ) : null}
        </section>
      )}

      <TimerTool
        key={`${selectedMode.id}-${instanceKey}`}
        initialSeconds={startSeconds}
        pageTitle={pageTitle}
        embedOnly={embedOnly}
      />
    </div>
  );
}
