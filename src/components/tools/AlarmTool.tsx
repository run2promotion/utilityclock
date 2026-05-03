"use client";

import { useSettings } from "@/context/settings-context";
import { createAlarmAudio } from "@/lib/alarmSounds";
import { useAlarmWorker } from "@/hooks/useAlarmWorker";
import { useNow } from "@/hooks/useNow";
import { Bell, BellOff, Volume2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type AlarmToolProps = {
  /** 24-hour parts from SEO preset */
  initialPreset?: { hour: number; minute: number };
};

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

function nextAlarmAt(hour24: number, minute: number, from: Date): number {
  const target = new Date(from);
  target.setSeconds(0, 0);
  target.setHours(hour24, minute, 0, 0);
  if (target.getTime() <= from.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return target.getTime();
}

export function AlarmTool({ initialPreset }: AlarmToolProps) {
  const { settings } = useSettings();
  const now = useNow(250);
  const preset12 = initialPreset
    ? toHour12(initialPreset.hour, initialPreset.minute)
    : { hour12: 7, minute: 0, isPM: false };

  const [hour12, setHour12] = useState(preset12.hour12);
  const [minute, setMinute] = useState(preset12.minute);
  const [isPM, setIsPM] = useState(preset12.isPM);

  useEffect(() => {
    if (!initialPreset) return;
    const p = toHour12(initialPreset.hour, initialPreset.minute);
    setHour12(p.hour12);
    setMinute(p.minute);
    setIsPM(p.isPM);
  }, [initialPreset]);

  const [armed, setArmed] = useState(false);
  const [alarmAtMs, setAlarmAtMs] = useState<number | null>(null);
  const [ringing, setRinging] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rangRef = useRef(false);

  const hour24 = useMemo(
    () => toHour24(hour12, minute, isPM),
    [hour12, minute, isPM],
  );

  const displayNext = useMemo(() => {
    if (alarmAtMs === null) return null;
    return new Date(alarmAtMs);
  }, [alarmAtMs]);

  useEffect(() => {
    audioRef.current?.pause();
    audioRef.current = createAlarmAudio(settings.alarmSound);
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [settings.alarmSound]);

  const stopRinging = useCallback(() => {
    setRinging(false);
    rangRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const fireAlarm = useCallback(() => {
    if (rangRef.current) return;
    rangRef.current = true;
    setRinging(true);
    setArmed(false);
    setAlarmAtMs(null);

    const a = audioRef.current;
    if (a) {
      a.play().catch(() => {
        /* autoplay policies: user may need to interact */
      });
    }

    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("Alarm", {
        body: "Your alarm is going off.",
        tag: "utility-alarm",
      });
    }
  }, []);

  useAlarmWorker(armed ? alarmAtMs : null, fireAlarm, armed && alarmAtMs !== null);

  // Safety net: main-thread comparison in case worker is blocked or skewed
  useEffect(() => {
    if (!armed || alarmAtMs === null) return;
    if (Date.now() >= alarmAtMs) {
      fireAlarm();
    }
  }, [armed, alarmAtMs, now, fireAlarm]);

  const arm = () => {
    rangRef.current = false;
    const at = nextAlarmAt(hour24, minute, new Date());
    setAlarmAtMs(at);
    setArmed(true);
  };

  const disarm = () => {
    setArmed(false);
    setAlarmAtMs(null);
    stopRinging();
  };

  const requestNotify = async () => {
    if (typeof Notification === "undefined") return;
    try {
      await Notification.requestPermission();
    } catch {
      /* ignore */
    }
  };

  const notifySupported =
    typeof Notification !== "undefined" && Notification.permission !== "denied";

  const timeFont = settings.isDigitalFont ? "font-lcd" : "font-sans";

  return (
    <div className="mx-auto w-full max-w-lg space-y-8">
      <div className="rounded-2xl border border-zinc-200 bg-white/60 p-6 shadow-inner dark:border-zinc-800 dark:bg-zinc-900/50">
        <p
          className={`${timeFont} clock-scale-alarm-now text-center tabular-nums tracking-widest text-clock-primary drop-shadow-clock`}
        >
          {now.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: settings.is12Hour,
          })}
        </p>
        {settings.showDate ? (
          <p className="mt-2 text-center text-sm text-zinc-500">
            {now.toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        ) : null}
      </div>

      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-200">Set alarm</h2>
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm text-zinc-400">
            Hour
            <select
              className={`rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xl text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 ${settings.isDigitalFont ? "font-lcd" : "font-sans"}`}
              value={hour12}
              onChange={(e) => setHour12(Number(e.target.value))}
              disabled={armed}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-zinc-400">
            Minute
            <select
              className={`rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xl text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 ${settings.isDigitalFont ? "font-lcd" : "font-sans"}`}
              value={minute}
              onChange={(e) => setMinute(Number(e.target.value))}
              disabled={armed}
            >
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, "0")}
                </option>
              ))}
            </select>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                !isPM
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
              onClick={() => setIsPM(false)}
              disabled={armed}
            >
              AM
            </button>
            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                isPM
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
              onClick={() => setIsPM(true)}
              disabled={armed}
            >
              PM
            </button>
          </div>
        </div>

        {displayNext && armed && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Rings next:{" "}
            <span className="text-zinc-800 dark:text-zinc-200">
              {displayNext.toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: settings.is12Hour,
              })}
            </span>
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {!armed ? (
            <button
              type="button"
              onClick={arm}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              <Bell className="h-4 w-4" aria-hidden />
              Start alarm
            </button>
          ) : (
            <button
              type="button"
              onClick={disarm}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-600"
            >
              <BellOff className="h-4 w-4" aria-hidden />
              Cancel alarm
            </button>
          )}
          {notifySupported && Notification.permission !== "granted" && (
            <button
              type="button"
              onClick={requestNotify}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-600 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-800"
            >
              <Volume2 className="h-4 w-4" aria-hidden />
              Enable notifications
            </button>
          )}
        </div>
      </div>

      {ringing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alarm-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-2xl dark:border-emerald-500/40 dark:bg-zinc-900 dark:shadow-emerald-900/30">
            <h2
              id="alarm-title"
              className={`text-3xl text-clock-primary ${settings.isDigitalFont ? "font-lcd" : "font-sans"}`}
            >
              Alarm
            </h2>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">Time&apos;s up.</p>
            <button
              type="button"
              onClick={stopRinging}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
            >
              Stop alarm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
