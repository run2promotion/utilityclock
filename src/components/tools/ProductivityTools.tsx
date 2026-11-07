"use client";

import { useSettings } from "@/context/settings-context";
import { useI18n } from "@/context/locale-context";
import { playTone } from "@/lib/alarmSounds";
import {
  Bell,
  Clock,
  Dumbbell,
  Flame,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

export type ProductivityToolSlug =
  | "sleep-cycle-calculator"
  | "pomodoro-timer"
  | "interval-timer"
  | "hourly-chime"
  | "custom-countdown"
  | "focus-planner";

type ProductivityToolsProps = {
  activeSlug?: ProductivityToolSlug | string;
  embedOnly?: boolean;
};

export function ProductivityTools({ activeSlug, embedOnly = false }: ProductivityToolsProps) {
  const { settings } = useSettings();
  const { locale } = useI18n();
  const initialTab: ProductivityToolSlug = useMemo(() => {
    if (!activeSlug) return "sleep-cycle-calculator";
    if (activeSlug === "countdown-to-event") return "custom-countdown";
    if (activeSlug === "focus-session-planner" || activeSlug === "daily-routine-planner") return "focus-planner";
    if (activeSlug === "study-timer") return "pomodoro-timer";
    if (activeSlug === "workout-interval-timer") return "interval-timer";
    return [
      "sleep-cycle-calculator",
      "pomodoro-timer",
      "interval-timer",
      "hourly-chime",
      "custom-countdown",
      "focus-planner",
    ].includes(activeSlug)
      ? (activeSlug as ProductivityToolSlug)
      : "sleep-cycle-calculator";
  }, [activeSlug]);

  const [currentTool, setCurrentTool] = useState<ProductivityToolSlug>(initialTab);

  // 1. Sleep Calculator State
  const [sleepMode, setSleepMode] = useState<"wakeAt" | "sleepNow">("wakeAt");
  const [targetWakeTime, setTargetWakeTime] = useState("07:00");

  // 2. Pomodoro Timer State
  const [pomoPhase, setPomoPhase] = useState<"focus" | "shortBreak" | "longBreak">("focus");
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState(25 * 60);
  const [pomoRunning, setPomoRunning] = useState(false);
  const [pomoRoundsDone, setPomoRoundsDone] = useState(0);

  // 3. Interval Timer State
  const [workSec, setWorkSec] = useState(40);
  const [restSec, setRestSec] = useState(20);
  const [totalRounds, setTotalRounds] = useState(8);
  const [currentRound, setCurrentRound] = useState(1);
  const [intervalPhase, setIntervalPhase] = useState<"work" | "rest" | "idle" | "done">("idle");
  const [intervalSecLeft, setIntervalSecLeft] = useState(40);
  const [intervalRunning, setIntervalRunning] = useState(false);

  // 4. Hourly Chime State
  const [chimeEnabled, setChimeEnabled] = useState(false);
  const [lastChimedHour, setLastChimedHour] = useState<number | null>(null);

  // 5. Custom Event Countdown State
  const [eventTitle, setEventTitle] = useState("Big Milestone");
  const [eventDateTime, setEventDateTime] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    d.setHours(12, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [eventNow, setEventNow] = useState(() => Date.now());

  // --- 1. Sleep Cycle Calculation (90m sleep cycles + 14m average sleep latency) ---
  const sleepSuggestions = useMemo(() => {
    const cycleMinutes = 90;
    const latencyMinutes = 14;

    if (sleepMode === "wakeAt") {
      const [h, m] = targetWakeTime.split(":").map(Number);
      const wakeDate = new Date();
      wakeDate.setHours(h, m, 0, 0);

      // Suggest 6, 5, 4, and 3 cycles backward
      return [6, 5, 4, 3].map((cycles) => {
        const totalMinutes = cycles * cycleMinutes + latencyMinutes;
        const bedDate = new Date(wakeDate.getTime() - totalMinutes * 60 * 1000);
        return {
          cycles,
          hours: (cycles * 1.5).toFixed(1),
          timeStr: bedDate.toLocaleTimeString(locale, {
            hour: "numeric",
            minute: "2-digit",
            hour12: settings.is12Hour,
          }),
          recommended: cycles === 5 || cycles === 6,
        };
      });
    } else {
      // Sleep now
      const now = new Date();
      return [3, 4, 5, 6].map((cycles) => {
        const totalMinutes = cycles * cycleMinutes + latencyMinutes;
        const wakeDate = new Date(now.getTime() + totalMinutes * 60 * 1000);
        return {
          cycles,
          hours: (cycles * 1.5).toFixed(1),
          timeStr: wakeDate.toLocaleTimeString(locale, {
            hour: "numeric",
            minute: "2-digit",
            hour12: settings.is12Hour,
          }),
          recommended: cycles === 5 || cycles === 6,
        };
      });
    }
  }, [sleepMode, targetWakeTime, settings.is12Hour, locale]);

  // --- 2. Pomodoro Timer Logic ---
  const switchPomoPhase = useCallback(
    (nextPhase: "focus" | "shortBreak" | "longBreak") => {
      setPomoPhase(nextPhase);
      const duration =
        nextPhase === "focus"
          ? 25 * 60
          : nextPhase === "shortBreak"
            ? 5 * 60
            : 15 * 60;
      setPomoSecondsLeft(duration);
      playTone(nextPhase === "focus" ? 660 : 880, 0.3, "sine", 0.12);
    },
    [],
  );

  useEffect(() => {
    if (!pomoRunning) return;
    const timer = setInterval(() => {
      setPomoSecondsLeft((prev) => {
        if (prev <= 1) {
          if (pomoPhase === "focus") {
            const nextRound = pomoRoundsDone + 1;
            setPomoRoundsDone(nextRound);
            if (nextRound % 4 === 0) {
              switchPomoPhase("longBreak");
            } else {
              switchPomoPhase("shortBreak");
            }
          } else {
            switchPomoPhase("focus");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pomoRunning, pomoPhase, pomoRoundsDone, switchPomoPhase]);

  const formatMinSec = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // --- 3. Interval Timer Logic ---
  useEffect(() => {
    if (!intervalRunning) return;
    const timer = setInterval(() => {
      setIntervalSecLeft((prev) => {
        // Sound countdown beeps on 3, 2, 1
        if (prev <= 4 && prev > 1) {
          playTone(440, 0.08, "square", 0.06);
        }
        if (prev <= 1) {
          if (intervalPhase === "work") {
            playTone(880, 0.25, "sine", 0.12);
            if (currentRound >= totalRounds) {
              setIntervalPhase("done");
              setIntervalRunning(false);
              return 0;
            }
            setIntervalPhase("rest");
            return restSec;
          } else if (intervalPhase === "rest") {
            playTone(1046, 0.3, "sine", 0.12);
            setCurrentRound((r) => r + 1);
            setIntervalPhase("work");
            return workSec;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [intervalRunning, intervalPhase, currentRound, totalRounds, workSec, restSec]);

  const startInterval = () => {
    if (intervalPhase === "idle" || intervalPhase === "done") {
      setCurrentRound(1);
      setIntervalPhase("work");
      setIntervalSecLeft(workSec);
    }
    setIntervalRunning(true);
    playTone(880, 0.2, "sine", 0.1);
  };

  const resetInterval = () => {
    setIntervalRunning(false);
    setIntervalPhase("idle");
    setCurrentRound(1);
    setIntervalSecLeft(workSec);
  };

  // --- 4. Hourly Chime Logic ---
  useEffect(() => {
    if (!chimeEnabled) return;
    const checkChime = () => {
      const now = new Date();
      const currentMin = now.getMinutes();
      const currentHour = now.getHours();
      if (currentMin === 0 && lastChimedHour !== currentHour) {
        setLastChimedHour(currentHour);
        // Play dual chime
        playTone(587.33, 0.3, "sine", 0.1);
        setTimeout(() => playTone(880, 0.5, "sine", 0.1), 350);
      }
    };
    const id = setInterval(checkChime, 10000);
    return () => clearInterval(id);
  }, [chimeEnabled, lastChimedHour]);

  // --- 5. Custom Event Countdown Tick ---
  useEffect(() => {
    if (currentTool !== "custom-countdown") return;
    const id = setInterval(() => setEventNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [currentTool]);

  const eventCountdownParts = useMemo(() => {
    const target = new Date(eventDateTime).getTime();
    const diffMs = Math.max(0, target - eventNow);
    const totalSec = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return { days, hours, minutes, seconds, isDue: diffMs <= 0 };
  }, [eventDateTime, eventNow]);

  const timeFont = settings.isDigitalFont ? "font-lcd" : "font-sans";

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Tool Selector Tabs */}
      {!embedOnly && (
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-zinc-200 bg-white/80 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/60">
          {[
            { id: "sleep-cycle-calculator", label: "Sleep Cycle Calculator", icon: Moon },
            { id: "pomodoro-timer", label: "Pomodoro Focus Timer", icon: Flame },
            { id: "interval-timer", label: "Workout / Interval Timer", icon: Dumbbell },
            { id: "hourly-chime", label: "Hourly Chime", icon: Bell },
            { id: "custom-countdown", label: "Custom Event Countdown", icon: Clock },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCurrentTool(id as ProductivityToolSlug)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
                currentTool === id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* 1. Sleep Cycle Calculator */}
      {currentTool === "sleep-cycle-calculator" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Sleep Cycle Calculator
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Calculate optimal bedtimes or wake-up times aligned with 90-minute human sleep cycles.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSleepMode("wakeAt")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                sleepMode === "wakeAt"
                  ? "bg-emerald-600 text-white"
                  : "border border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
              }`}
            >
              I want to wake up at...
            </button>
            <button
              type="button"
              onClick={() => setSleepMode("sleepNow")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                sleepMode === "sleepNow"
                  ? "bg-emerald-600 text-white"
                  : "border border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
              }`}
            >
              If I go to bed right now...
            </button>
          </div>

          {sleepMode === "wakeAt" && (
            <div className="max-w-xs space-y-1">
              <label htmlFor="target-wake-time" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                Target Wake-up Time:
              </label>
              <input
                id="target-wake-time"
                type="time"
                value={targetWakeTime}
                onChange={(e) => setTargetWakeTime(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              {sleepMode === "wakeAt" ? "Suggested Bedtimes" : "Suggested Wake-up Times"}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {sleepSuggestions.map((item) => (
                <div
                  key={item.cycles}
                  className={`rounded-2xl border p-4 text-center transition ${
                    item.recommended
                      ? "border-emerald-500/50 bg-emerald-500/10 shadow-sm"
                      : "border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-950/60"
                  }`}
                >
                  <span className="font-mono text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
                    {item.timeStr}
                  </span>
                  <div className="mt-1 text-xs text-zinc-500">
                    <strong>{item.cycles} cycles</strong> ({item.hours}h sleep)
                  </div>
                  {item.recommended && (
                    <span className="mt-2 inline-block rounded-full bg-emerald-600/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Optimal
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-100/60 p-3.5 text-xs text-zinc-500 dark:border-zinc-800/80 dark:bg-zinc-950/60 dark:text-zinc-400">
            <strong>Important notice:</strong> Calculations assume an average of 14 minutes to fall asleep (sleep latency) and standard 90-minute ultradian sleep stages. These calculations are estimations intended for general wellness and routine planning, not medical diagnosis or clinical treatment.
          </div>
        </section>
      )}

      {/* 2. Pomodoro Focus Timer */}
      {currentTool === "pomodoro-timer" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Pomodoro Focus Session Timer
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Work for 25 minutes, followed by a 5-minute break. Every 4 sessions, take an extended 15-minute rest.
            </p>
          </div>

          <div className="flex justify-center gap-2">
            {(
              [
                { id: "focus", label: "Focus (25m)" },
                { id: "shortBreak", label: "Short Break (5m)" },
                { id: "longBreak", label: "Long Break (15m)" },
              ] as const
            ).map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setPomoRunning(false);
                  switchPomoPhase(id);
                }}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                  pomoPhase === id
                    ? "bg-emerald-600 text-white"
                    : "border border-zinc-300 bg-zinc-50 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="py-6">
            <p className={`${timeFont} text-6xl font-bold text-clock-primary drop-shadow-clock sm:text-7xl`}>
              {formatMinSec(pomoSecondsLeft)}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              {pomoPhase === "focus" ? "Deep Focus Block" : "Rest & Rejuvenation"} · Completed: {pomoRoundsDone} Focus Rounds
            </p>
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => setPomoRunning((r) => !r)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
            >
              {pomoRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {pomoRunning ? "Pause" : "Start Focus"}
            </button>
            <button
              type="button"
              onClick={() => {
                setPomoRunning(false);
                switchPomoPhase(pomoPhase);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </section>
      )}

      {/* 3. Workout Interval Timer */}
      {currentTool === "interval-timer" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              HIIT & Workout Interval Timer
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              High-visibility work-rest timer with countdown audio beeps for calisthenics, HIIT, boxing, or circuit drills.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Work Duration (s)
              <input
                type="number"
                min="5"
                max="600"
                value={workSec}
                disabled={intervalRunning}
                onChange={(e) => setWorkSec(Math.max(5, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-center text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Rest Duration (s)
              <input
                type="number"
                min="5"
                max="600"
                value={restSec}
                disabled={intervalRunning}
                onChange={(e) => setRestSec(Math.max(5, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-center text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Total Rounds
              <input
                type="number"
                min="1"
                max="50"
                value={totalRounds}
                disabled={intervalRunning}
                onChange={(e) => setTotalRounds(Math.max(1, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-center text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
          </div>

          <div className="py-4">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                intervalPhase === "work"
                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  : intervalPhase === "rest"
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                    : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {intervalPhase === "idle"
                ? "Ready"
                : intervalPhase === "work"
                  ? `Work · Round ${currentRound}/${totalRounds}`
                  : intervalPhase === "rest"
                    ? `Rest · Preparing Round ${currentRound + 1}`
                    : "Workout Finished!"}
            </span>

            <p className={`${timeFont} mt-3 text-7xl font-bold text-clock-primary drop-shadow-clock sm:text-8xl`}>
              {intervalSecLeft}s
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {!intervalRunning ? (
              <button
                type="button"
                onClick={startInterval}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-500"
              >
                <Play className="h-4 w-4" /> Start Workout
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIntervalRunning(false)}
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-700 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-600"
              >
                <Pause className="h-4 w-4" /> Pause
              </button>
            )}
            <button
              type="button"
              onClick={resetInterval}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-5 py-3 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </section>
      )}

      {/* 4. Hourly Chime */}
      {currentTool === "hourly-chime" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Hourly Bell Chime
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Plays a discreet, pleasant synthesized chime every hour on the hour (:00) while this browser tab stays open.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-8 text-center dark:border-zinc-800 dark:bg-zinc-950/60">
            <div
              className={`rounded-full p-4 transition ${
                chimeEnabled
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {chimeEnabled ? <Volume2 className="h-10 w-10" /> : <VolumeX className="h-10 w-10" />}
            </div>

            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {chimeEnabled
                ? "Hourly chime is Active. Keep this tab open."
                : "Hourly chime is currently Turned Off."}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setChimeEnabled((c) => {
                    const next = !c;
                    if (next) {
                      playTone(587.33, 0.25, "sine", 0.08);
                    }
                    return next;
                  });
                }}
                className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition ${
                  chimeEnabled
                    ? "bg-zinc-700 text-white hover:bg-zinc-600"
                    : "bg-emerald-600 text-white hover:bg-emerald-500"
                }`}
              >
                {chimeEnabled ? "Turn Off Chime" : "Enable Hourly Chime"}
              </button>
              <button
                type="button"
                onClick={() => {
                  playTone(587.33, 0.3, "sine", 0.1);
                  setTimeout(() => playTone(880, 0.5, "sine", 0.1), 350);
                }}
                className="rounded-xl border border-zinc-300 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Test Sound
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 5. Custom Event Countdown */}
      {currentTool === "custom-countdown" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Live Event Countdown
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Set any future date and time to track real-time days, hours, minutes, and seconds.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Event Title
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Target Date & Time
              <input
                type="datetime-local"
                value={eventDateTime}
                onChange={(e) => setEventDateTime(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
            <h3 className="text-base font-semibold text-emerald-800 dark:text-emerald-300">
              {eventTitle}
            </h3>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center sm:gap-4">
              <div className="rounded-xl border border-emerald-500/20 bg-white/50 p-3 dark:bg-zinc-950/50">
                <span className="block font-mono text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                  {eventCountdownParts.days}
                </span>
                <span className="text-[11px] font-semibold uppercase text-zinc-500">Days</span>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-white/50 p-3 dark:bg-zinc-950/50">
                <span className="block font-mono text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                  {eventCountdownParts.hours}
                </span>
                <span className="text-[11px] font-semibold uppercase text-zinc-500">Hours</span>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-white/50 p-3 dark:bg-zinc-950/50">
                <span className="block font-mono text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                  {eventCountdownParts.minutes}
                </span>
                <span className="text-[11px] font-semibold uppercase text-zinc-500">Minutes</span>
              </div>
              <div className="rounded-xl border border-emerald-500/20 bg-white/50 p-3 dark:bg-zinc-950/50">
                <span className="block font-mono text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 sm:text-4xl">
                  {eventCountdownParts.seconds}
                </span>
                <span className="text-[11px] font-semibold uppercase text-zinc-500">Seconds</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
