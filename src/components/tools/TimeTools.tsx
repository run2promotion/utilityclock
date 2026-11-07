"use client";

import {
  ArrowRightLeft,
  Briefcase,
  Clock,
  Coffee,
} from "lucide-react";
import { useMemo, useState } from "react";

export type TimeToolSlug =
  | "time-duration-calculator"
  | "time-converter"
  | "work-hours-calculator"
  | "break-time-calculator";

type TimeToolsProps = {
  activeSlug?: TimeToolSlug | string;
  embedOnly?: boolean;
};

export function TimeTools({ activeSlug, embedOnly = false }: TimeToolsProps) {
  const initialTab: TimeToolSlug =
    activeSlug &&
    [
      "time-duration-calculator",
      "time-converter",
      "work-hours-calculator",
      "break-time-calculator",
    ].includes(activeSlug)
      ? (activeSlug as TimeToolSlug)
      : "time-duration-calculator";

  const [currentTool, setCurrentTool] = useState<TimeToolSlug>(initialTab);

  // 1. Time Duration State
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:30");

  // 2. Time Converter State
  const [convertAmount, setConvertAmount] = useState(120);
  const [convertUnit, setConvertUnit] = useState<"seconds" | "minutes" | "hours" | "days">("minutes");

  // 3. Work Hours State
  const [clockIn, setClockIn] = useState("08:30");
  const [clockOut, setClockOut] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState(45);
  const [hourlyWage, setHourlyWage] = useState(25);

  // --- Calculations ---

  // Time Duration
  const durationResult = useMemo(() => {
    if (!startTime || !endTime) return null;
    const [h1, m1] = startTime.split(":").map(Number);
    const [h2, m2] = endTime.split(":").map(Number);
    const min1 = h1 * 60 + m1;
    let min2 = h2 * 60 + m2;
    if (min2 < min1) min2 += 24 * 60; // Crosses midnight

    const diffMinutes = min2 - min1;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    const totalSeconds = diffMinutes * 60;

    return {
      hours,
      minutes,
      totalMinutes: diffMinutes,
      totalSeconds,
      decimalHours: (diffMinutes / 60).toFixed(2),
    };
  }, [startTime, endTime]);

  // Time Converter
  const converterResults = useMemo(() => {
    let totalSeconds = 0;
    if (convertUnit === "seconds") totalSeconds = convertAmount;
    else if (convertUnit === "minutes") totalSeconds = convertAmount * 60;
    else if (convertUnit === "hours") totalSeconds = convertAmount * 3600;
    else if (convertUnit === "days") totalSeconds = convertAmount * 86400;

    return {
      milliseconds: totalSeconds * 1000,
      seconds: totalSeconds,
      minutes: totalSeconds / 60,
      hours: totalSeconds / 3600,
      days: totalSeconds / 86400,
      weeks: totalSeconds / 604800,
    };
  }, [convertAmount, convertUnit]);

  // Work Hours
  const workHoursResult = useMemo(() => {
    if (!clockIn || !clockOut) return null;
    const [h1, m1] = clockIn.split(":").map(Number);
    const [h2, m2] = clockOut.split(":").map(Number);
    const startMin = h1 * 60 + m1;
    let endMin = h2 * 60 + m2;
    if (endMin < startMin) endMin += 24 * 60;

    const rawMinutes = endMin - startMin;
    const paidMinutes = Math.max(0, rawMinutes - breakMinutes);
    const paidHours = paidMinutes / 60;
    const regularHours = Math.min(8, paidHours);
    const overtimeHours = Math.max(0, paidHours - 8);

    const regularPay = regularHours * hourlyWage;
    const overtimePay = overtimeHours * (hourlyWage * 1.5);
    const totalPay = regularPay + overtimePay;

    return {
      rawHours: (rawMinutes / 60).toFixed(2),
      paidHours: paidHours.toFixed(2),
      regularHours: regularHours.toFixed(2),
      overtimeHours: overtimeHours.toFixed(2),
      regularPay: regularPay.toFixed(2),
      overtimePay: overtimePay.toFixed(2),
      totalPay: totalPay.toFixed(2),
      hPart: Math.floor(paidMinutes / 60),
      mPart: paidMinutes % 60,
    };
  }, [clockIn, clockOut, breakMinutes, hourlyWage]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Tool Selector Tabs */}
      {!embedOnly && (
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-zinc-200 bg-white/80 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/60">
          {[
            { id: "time-duration-calculator", label: "Time Duration", icon: Clock },
            { id: "time-converter", label: "Time Converter", icon: ArrowRightLeft },
            { id: "work-hours-calculator", label: "Work Hours Calculator", icon: Briefcase },
            { id: "break-time-calculator", label: "Break Time Ratios", icon: Coffee },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCurrentTool(id as TimeToolSlug)}
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

      {/* 1. Time Duration Calculator */}
      {currentTool === "time-duration-calculator" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Time Duration Calculator
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Calculate elapsed hours, minutes, and decimal time between two timestamps. Supports overnight periods.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Start Time
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              End Time
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
          </div>

          {durationResult && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
              <span className="block font-mono text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 sm:text-5xl">
                {durationResult.hours}h {durationResult.minutes}m
              </span>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Decimal: <strong>{durationResult.decimalHours} hours</strong> · {durationResult.totalMinutes} minutes · {durationResult.totalSeconds.toLocaleString()} seconds
              </p>
            </div>
          )}
        </section>
      )}

      {/* 2. Time Converter */}
      {currentTool === "time-converter" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Time Unit Converter
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Instantly convert time across milliseconds, seconds, minutes, hours, days, and weeks.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Amount
              <input
                type="number"
                min="0"
                step="any"
                value={convertAmount}
                onChange={(e) => setConvertAmount(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              From Unit
              <select
                value={convertUnit}
                onChange={(e) => setConvertUnit(e.target.value as "seconds" | "minutes" | "hours" | "days")}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="seconds">Seconds (s)</option>
                <option value="minutes">Minutes (m)</option>
                <option value="hours">Hours (h)</option>
                <option value="days">Days (d)</option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Seconds", value: converterResults.seconds.toLocaleString() },
              { label: "Minutes", value: converterResults.minutes.toLocaleString() },
              { label: "Hours", value: converterResults.hours.toFixed(4) },
              { label: "Days", value: converterResults.days.toFixed(4) },
              { label: "Weeks", value: converterResults.weeks.toFixed(4) },
              { label: "Milliseconds", value: converterResults.milliseconds.toLocaleString() },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                <span className="text-xs text-zinc-500">{label}</span>
                <p className="mt-1 font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Work Hours Calculator */}
      {currentTool === "work-hours-calculator" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Work Hours & Pay Calculator
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Track daily shift duration, break deductions, overtime hours (over 8h), and estimated gross earnings.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Clock In
              <input
                type="time"
                value={clockIn}
                onChange={(e) => setClockIn(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Clock Out
              <input
                type="time"
                value={clockOut}
                onChange={(e) => setClockOut(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Unpaid Break (mins)
              <input
                type="number"
                min="0"
                max="300"
                value={breakMinutes}
                onChange={(e) => setBreakMinutes(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Hourly Wage ($)
              <input
                type="number"
                min="0"
                step="0.5"
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
          </div>

          {workHoursResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center sm:grid-cols-4">
                <div>
                  <span className="block font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 sm:text-3xl">
                    {workHoursResult.hPart}h {workHoursResult.mPart}m
                  </span>
                  <span className="text-xs font-medium uppercase text-zinc-500">Paid Shift Time</span>
                </div>
                <div>
                  <span className="block font-mono text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                    {workHoursResult.regularHours}h
                  </span>
                  <span className="text-xs font-medium uppercase text-zinc-500">Regular (1.0x)</span>
                </div>
                <div>
                  <span className="block font-mono text-2xl font-bold text-amber-600 dark:text-amber-400 sm:text-3xl">
                    {workHoursResult.overtimeHours}h
                  </span>
                  <span className="text-xs font-medium uppercase text-zinc-500">Overtime (1.5x)</span>
                </div>
                <div>
                  <span className="block font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400 sm:text-3xl">
                    ${workHoursResult.totalPay}
                  </span>
                  <span className="text-xs font-medium uppercase text-zinc-500">Estimated Gross</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. Break Time Calculator */}
      {currentTool === "break-time-calculator" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Break Time Productivity Ratios
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Optimal work-to-rest cadence based on leading research in cognitive ergonomics.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Classic Pomodoro",
                ratio: "25m Work · 5m Rest",
                desc: "Ideal for task initiation, battling procrastination, and tight sprint pacing.",
                cyclesInDay: "14–16 sprints per day",
              },
              {
                title: "Rule of 52 / 17",
                ratio: "52m Work · 17m Rest",
                desc: "Derived from DeskTime telemetry: 10% highest performers focus deeply for ~52m then disconnect completely.",
                cyclesInDay: "6–7 cycles per 8h day",
              },
              {
                title: "Ultradian Rhythm",
                ratio: "90m Work · 20m Rest",
                desc: "Aligned with human biological ultradian cycles for peak creative flow and intellectual stamina.",
                cyclesInDay: "3–4 deep blocks per day",
              },
            ].map(({ title, ratio, desc, cyclesInDay }) => (
              <div key={title} className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-950/70">
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
                  <span className="mt-1 inline-block rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    {ratio}
                  </span>
                  <p className="mt-3 text-xs leading-relaxed text-zinc-500">{desc}</p>
                </div>
                <div className="mt-4 border-t border-zinc-200/80 pt-3 text-[11px] text-zinc-400 dark:border-zinc-800">
                  Cadence: {cyclesInDay}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
