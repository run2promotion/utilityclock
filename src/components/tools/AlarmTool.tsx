"use client";

import { useSettings } from "@/context/settings-context";
import { useI18n } from "@/context/locale-context";
import { AlarmSoundPlayer } from "@/lib/alarmSounds";
import { useAlarmWorker } from "@/hooks/useAlarmWorker";
import { useNow } from "@/hooks/useNow";
import {
  Bell,
  BellOff,
  Info,
  Plus,
  Repeat,
  Trash2,
  Volume2,
  X,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type AlarmToolProps = {
  /** 24-hour parts from SEO preset */
  initialPreset?: { hour: number; minute: number };
  embedOnly?: boolean;
};

export type RecurrenceType = "once" | "daily" | "weekdays" | "weekends";

export type StoredAlarm = {
  id: string;
  hour24: number;
  minute: number;
  label: string;
  recurrence: RecurrenceType;
  enabled: boolean;
};

const STORAGE_KEY = "utilityclock.saved-alarms.v2";

function toHour12(h24: number, m: number) {
  const isPM = h24 >= 12;
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return { hour12: h12, minute: m, isPM };
}

function toHour24(hour12: number, minute: number, isPM: boolean): number {
  if (hour12 === 12) return isPM ? 12 : 0;
  return isPM ? hour12 + 12 : hour12;
}

function formatTimeString(h24: number, minute: number, is12Hour: boolean): string {
  const p = toHour12(h24, minute);
  const minStr = minute.toString().padStart(2, "0");
  if (!is12Hour) {
    return `${h24.toString().padStart(2, "0")}:${minStr}`;
  }
  return `${p.hour12}:${minStr} ${p.isPM ? "PM" : "AM"}`;
}

function isDayMatching(date: Date, recurrence: RecurrenceType): boolean {
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday
  if (recurrence === "once" || recurrence === "daily") return true;
  if (recurrence === "weekdays") return day >= 1 && day <= 5;
  if (recurrence === "weekends") return day === 0 || day === 6;
  return true;
}

/** Calculates the next timestamp this specific alarm should ring. */
function calculateNextAlarm(alarm: StoredAlarm, from: Date = new Date()): number | null {
  if (!alarm.enabled) return null;
  const candidate = new Date(from);
  candidate.setSeconds(0, 0);
  candidate.setHours(alarm.hour24, alarm.minute, 0, 0);

  // If candidate is today but already in the past, start looking from tomorrow
  if (candidate.getTime() <= from.getTime()) {
    candidate.setDate(candidate.getDate() + 1);
  }

  // Find next date matching recurrence
  for (let i = 0; i < 8; i++) {
    if (isDayMatching(candidate, alarm.recurrence)) {
      return candidate.getTime();
    }
    candidate.setDate(candidate.getDate() + 1);
  }
  return null;
}

export function AlarmTool({ initialPreset, embedOnly = false }: AlarmToolProps) {
  const { settings } = useSettings();
  const { locale } = useI18n();
  const searchParams = useSearchParams();
  const isEmbedMode = embedOnly || searchParams.get("embed") === "1";
  const now = useNow(500);

  const preset12 = initialPreset
    ? toHour12(initialPreset.hour, initialPreset.minute)
    : { hour12: 7, minute: 0, isPM: false };

  // New alarm form state
  const [formHour12, setFormHour12] = useState(preset12.hour12);
  const [formMinute, setFormMinute] = useState(preset12.minute);
  const [formIsPM, setFormIsPM] = useState(preset12.isPM);
  const [formLabel, setFormLabel] = useState("");
  const [formRecurrence, setFormRecurrence] = useState<RecurrenceType>("daily");
  const [showAddForm, setShowAddForm] = useState(false);

  // Alarms list
  const [alarms, setAlarms] = useState<StoredAlarm[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  // Ringing state
  const [ringingAlarm, setRingingAlarm] = useState<StoredAlarm | null>(null);
  const playerRef = useRef<AlarmSoundPlayer | null>(null);
  const rangRef = useRef(false);

  // Initialize/update sound player
  useEffect(() => {
    if (!playerRef.current) {
      playerRef.current = new AlarmSoundPlayer(settings.alarmSound);
    } else {
      playerRef.current.setKind(settings.alarmSound);
    }
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [settings.alarmSound]);

  // Persist alarms to localStorage
  const saveAlarms = useCallback((next: StoredAlarm[]) => {
    setAlarms(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  // Ensure initial preset route creates an active alarm if none exists
  useEffect(() => {
    if (!initialPreset) return;
    const p12 = toHour12(initialPreset.hour, initialPreset.minute);
    setFormHour12(p12.hour12);
    setFormMinute(p12.minute);
    setFormIsPM(p12.isPM);

    setAlarms((prev) => {
      const exists = prev.some(
        (a) => a.hour24 === initialPreset.hour && a.minute === initialPreset.minute,
      );
      if (!exists) {
        const newPresetAlarm: StoredAlarm = {
          id: `preset-${initialPreset.hour}-${initialPreset.minute}`,
          hour24: initialPreset.hour,
          minute: initialPreset.minute,
          label: `Alarm ${formatTimeString(initialPreset.hour, initialPreset.minute, true)}`,
          recurrence: "daily",
          enabled: true,
        };
        const next = [newPresetAlarm, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      }
      return prev;
    });
  }, [initialPreset]);

  // Compute next ring time across all enabled alarms
  const { nextDueAlarm, nextDueTime } = useMemo(() => {
    let earliestTime: number | null = null;
    let earliestAlarm: StoredAlarm | null = null;

    for (const a of alarms) {
      if (!a.enabled) continue;
      const at = calculateNextAlarm(a, now);
      if (at !== null) {
        if (earliestTime === null || at < earliestTime) {
          earliestTime = at;
          earliestAlarm = a;
        }
      }
    }

    return { nextDueAlarm: earliestAlarm, nextDueTime: earliestTime };
  }, [alarms, now]);

  const stopRinging = useCallback(() => {
    playerRef.current?.stop();
    setRingingAlarm(null);
    rangRef.current = false;
  }, []);

  const fireAlarm = useCallback(() => {
    if (rangRef.current || !nextDueAlarm) return;
    rangRef.current = true;
    setRingingAlarm(nextDueAlarm);

    // Play sound with fallback
    playerRef.current?.play();

    // Browser Notification
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(`Alarm: ${nextDueAlarm.label}`, {
        body: `It's ${formatTimeString(nextDueAlarm.hour24, nextDueAlarm.minute, settings.is12Hour)}.`,
        tag: `utility-alarm-${nextDueAlarm.id}`,
      });
    }

    // If recurrence was "once", disable it
    if (nextDueAlarm.recurrence === "once") {
      setAlarms((prev) => {
        const next = prev.map((a) => (a.id === nextDueAlarm.id ? { ...a, enabled: false } : a));
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  }, [nextDueAlarm, settings.is12Hour]);

  // Use background web worker for highest timing precision
  useAlarmWorker(nextDueTime, fireAlarm, nextDueTime !== null && !ringingAlarm);

  // Safety net on main thread
  useEffect(() => {
    if (nextDueTime === null || ringingAlarm) return;
    if (Date.now() >= nextDueTime) {
      fireAlarm();
    }
  }, [nextDueTime, now, fireAlarm, ringingAlarm]);

  const primeAudio = useCallback(() => {
    playerRef.current?.prime();
  }, []);

  const handleAddNewAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    primeAudio();
    const h24 = toHour24(formHour12, formMinute, formIsPM);
    const newAlarm: StoredAlarm = {
      id: `alarm-${Date.now()}`,
      hour24: h24,
      minute: formMinute,
      label: formLabel.trim() || `Alarm for ${formatTimeString(h24, formMinute, true)}`,
      recurrence: formRecurrence,
      enabled: true,
    };
    saveAlarms([...alarms, newAlarm]);
    setFormLabel("");
    setShowAddForm(false);
  };

  const toggleAlarm = (id: string) => {
    primeAudio();
    const next = alarms.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
    saveAlarms(next);
  };

  const deleteAlarm = (id: string) => {
    const next = alarms.filter((a) => a.id !== id);
    saveAlarms(next);
  };

  const snoozeAlarm = () => {
    stopRinging();
    if (!ringingAlarm) return;
    // Add 5-minute snooze alarm
    const snoozeDate = new Date(Date.now() + 5 * 60 * 1000);
    const snoozeAlarmObj: StoredAlarm = {
      id: `snooze-${Date.now()}`,
      hour24: snoozeDate.getHours(),
      minute: snoozeDate.getMinutes(),
      label: `Snooze (5m): ${ringingAlarm.label}`,
      recurrence: "once",
      enabled: true,
    };
    saveAlarms([snoozeAlarmObj, ...alarms]);
  };

  const requestNotify = async () => {
    if (typeof Notification === "undefined") return;
    try {
      await Notification.requestPermission();
    } catch {}
  };

  const notifySupported =
    typeof Notification !== "undefined" && Notification.permission !== "denied";
  const timeFont = settings.isDigitalFont ? "font-lcd" : "font-sans";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      {/* Live Digital Clock Header */}
      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-6 shadow-inner dark:border-zinc-800 dark:bg-zinc-900/50">
        <p
          suppressHydrationWarning
          className={`${timeFont} clock-scale-alarm-now text-center tabular-nums tracking-widest text-clock-primary drop-shadow-clock`}
        >
          {now.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: settings.is12Hour,
          })}
        </p>
        {settings.showDate && (
          <p suppressHydrationWarning className="mt-2 text-center text-sm text-zinc-500">
            {now.toLocaleDateString(locale, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Next Upcoming Alarm Banner */}
      {!isEmbedMode && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            {nextDueTime && nextDueAlarm ? (
              <span>
                Next alarm: <strong>{nextDueAlarm.label}</strong> at{" "}
                <strong>{new Date(nextDueTime).toLocaleTimeString(locale, {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: settings.is12Hour,
                })}</strong> ({new Date(nextDueTime).toLocaleDateString(locale, { weekday: "short" })})
              </span>
            ) : (
              <span>No active alarms armed. Add an alarm below.</span>
            )}
          </div>
          {notifySupported && Notification.permission !== "granted" && (
            <button
              type="button"
              onClick={requestNotify}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-white/80 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-white dark:bg-zinc-900 dark:text-emerald-300"
            >
              <Volume2 className="h-3.5 w-3.5" />
              Enable alerts
            </button>
          )}
        </div>
      )}

      {/* Alarms Management Section */}
      {!isEmbedMode && (
        <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Alarms ({alarms.length})
            </h2>
            <button
              type="button"
              onClick={() => {
                primeAudio();
                setShowAddForm((prev) => !prev);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
            >
              {showAddForm ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showAddForm ? "Close" : "Add alarm"}
            </button>
          </div>

          {/* New Alarm Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddNewAlarm}
              className="space-y-4 rounded-xl border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                New Alarm
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex flex-col gap-1 text-xs text-zinc-500">
                  Hour
                  <select
                    className="rounded-lg border border-zinc-300 bg-zinc-50 px-2.5 py-1.5 text-base font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    value={formHour12}
                    onChange={(e) => setFormHour12(Number(e.target.value))}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1 text-xs text-zinc-500">
                  Minute
                  <select
                    className="rounded-lg border border-zinc-300 bg-zinc-50 px-2.5 py-1.5 text-base font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                    value={formMinute}
                    onChange={(e) => setFormMinute(Number(e.target.value))}
                  >
                    {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                      <option key={m} value={m}>
                        {m.toString().padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="flex flex-col justify-end gap-1">
                  <span className="text-xs text-zinc-500">AM / PM</span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
                        !formIsPM
                          ? "bg-emerald-600 text-white"
                          : "border border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                      }`}
                      onClick={() => setFormIsPM(false)}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-lg py-1.5 text-xs font-semibold ${
                        formIsPM
                          ? "bg-emerald-600 text-white"
                          : "border border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                      }`}
                      onClick={() => setFormIsPM(true)}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs text-zinc-500">
                  Label (optional)
                  <input
                    type="text"
                    value={formLabel}
                    onChange={(e) => setFormLabel(e.target.value)}
                    placeholder="e.g. Wake up, Team Standup, Medicine"
                    maxLength={40}
                    className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-zinc-500">
                  Repeat
                  <select
                    value={formRecurrence}
                    onChange={(e) => setFormRecurrence(e.target.value as RecurrenceType)}
                    className="rounded-lg border border-zinc-300 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  >
                    <option value="daily">Every day</option>
                    <option value="weekdays">Weekdays (Mon - Fri)</option>
                    <option value="weekends">Weekends (Sat - Sun)</option>
                    <option value="once">Once</option>
                  </select>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Save alarm
                </button>
              </div>
            </form>
          )}

          {/* List of Alarms */}
          {alarms.length === 0 ? (
            <p className="py-4 text-center text-xs text-zinc-500">
              No alarms configured yet. Click &ldquo;Add alarm&rdquo; to set a reminder.
            </p>
          ) : (
            <ul className="divide-y divide-zinc-200/80 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
              {alarms.map((alarm) => {
                const nextAt = calculateNextAlarm(alarm, now);
                return (
                  <li
                    key={alarm.id}
                    className={`flex items-center justify-between gap-4 p-4 transition ${
                      !alarm.enabled ? "opacity-60" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span
                          className={`text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 ${timeFont}`}
                        >
                          {formatTimeString(alarm.hour24, alarm.minute, settings.is12Hour)}
                        </span>
                        <span className="truncate text-xs font-medium text-zinc-600 dark:text-zinc-300">
                          {alarm.label}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-zinc-500">
                        <span className="capitalize flex items-center gap-1">
                          <Repeat className="h-3 w-3 opacity-70" />
                          {alarm.recurrence === "daily"
                            ? "Daily"
                            : alarm.recurrence === "weekdays"
                              ? "Mon–Fri"
                              : alarm.recurrence === "weekends"
                                ? "Sat–Sun"
                                : "Once"}
                        </span>
                        {alarm.enabled && nextAt && (
                          <span>
                            Rings {new Date(nextAt).toLocaleDateString(locale, { weekday: "short" })}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleAlarm(alarm.id)}
                        className={`rounded-full p-2 transition ${
                          alarm.enabled
                            ? "bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-600/25"
                            : "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-300"
                        }`}
                        title={alarm.enabled ? "Disable alarm" : "Enable alarm"}
                        aria-label={`Toggle alarm for ${alarm.label}`}
                      >
                        {alarm.enabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteAlarm(alarm.id)}
                        className="rounded-full p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-500"
                        title="Delete alarm"
                        aria-label={`Delete ${alarm.label}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Browser limitations note */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5 text-xs text-zinc-600 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-zinc-400">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-zinc-800 dark:text-zinc-200">Browser Technical Limitation:</strong> Web-based alarms run locally within your active browser session. While background tabs and audio synthesize reliably when open, web alarms cannot execute or wake a device if the browser tab is closed, the device enters deep sleep, or the operating system suspends the browser process. For safety-critical alarms, always keep this tab open and set a native hardware backup.
            </p>
          </div>
        </div>
      )}

      {/* Ringing Modal Dialog */}
      {ringingAlarm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alarm-modal-title"
        >
          <div className="w-full max-w-md animate-pulse-subtle rounded-2xl border-2 border-emerald-500 bg-white p-8 text-center shadow-2xl dark:bg-zinc-900 dark:shadow-emerald-950/50">
            <Bell className="mx-auto h-12 w-12 text-emerald-600 dark:text-emerald-400 motion-safe:animate-bounce" />
            <h2
              id="alarm-modal-title"
              className={`mt-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 ${timeFont}`}
            >
              {formatTimeString(ringingAlarm.hour24, ringingAlarm.minute, settings.is12Hour)}
            </h2>
            <p className="mt-2 text-base font-medium text-emerald-600 dark:text-emerald-400">
              {ringingAlarm.label}
            </p>
            <p className="mt-1 text-xs text-zinc-500">Time&apos;s up — sound playing.</p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={snoozeAlarm}
                className="flex-1 rounded-xl border border-zinc-300 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Snooze (5 min)
              </button>
              <button
                type="button"
                onClick={stopRinging}
                className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-500"
              >
                Stop alarm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AlarmToolPlaceholder(props: AlarmToolProps) {
  return <AlarmTool {...props} />;
}
