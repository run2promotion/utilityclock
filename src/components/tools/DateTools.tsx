"use client";

import {
  Calendar,
  CalendarDays,
  CalendarRange,
  Clock,
  Plus,
  Briefcase,
} from "lucide-react";
import { useI18n } from "@/context/locale-context";
import { useMemo, useState } from "react";

export type DateToolSlug =
  | "age-calculator"
  | "date-difference-calculator"
  | "days-between-dates"
  | "add-subtract-days"
  | "business-days-calculator"
  | "week-number-calculator"
  | "leap-year-checker"
  | "days-until-date";

type DateToolsProps = {
  activeSlug?: DateToolSlug | string;
  embedOnly?: boolean;
};

// Helper: Format YYYY-MM-DD
function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getIsoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function DateTools({ activeSlug, embedOnly = false }: DateToolsProps) {
  const { locale } = useI18n();
  const todayStr = useMemo(() => toIsoDate(new Date()), []);
  const initialTab: DateToolSlug = useMemo(() => {
    if (!activeSlug) return "age-calculator";
    if (activeSlug === "add-days-to-date" || activeSlug === "subtract-days-from-date") {
      return "add-subtract-days";
    }
    if (activeSlug === "date-duration-calculator") {
      return "date-difference-calculator";
    }
    return [
      "age-calculator",
      "date-difference-calculator",
      "days-between-dates",
      "add-subtract-days",
      "business-days-calculator",
      "week-number-calculator",
      "leap-year-checker",
      "days-until-date",
    ].includes(activeSlug)
      ? (activeSlug as DateToolSlug)
      : "age-calculator";
  }, [activeSlug]);

  const [currentTool, setCurrentTool] = useState<DateToolSlug>(initialTab);

  // 1. Age Calculator State
  const [birthDate, setBirthDate] = useState("2000-01-01");

  // 2. Date Difference State
  const [diffStart, setDiffStart] = useState("2026-01-01");
  const [diffEnd, setDiffEnd] = useState(todayStr);

  // 3. Add/Subtract State
  const [calcBaseDate, setCalcBaseDate] = useState(todayStr);
  const [addAmount, setAddAmount] = useState(30);
  const [addUnit, setAddUnit] = useState<"days" | "weeks" | "months" | "years">("days");
  const [calcOperation, setCalcOperation] = useState<"add" | "subtract">(
    activeSlug === "subtract-days-from-date" ? "subtract" : "add",
  );

  // 4. Business Days State
  const [bizStart, setBizStart] = useState(todayStr);
  const [bizEnd, setBizEnd] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return toIsoDate(d);
  });

  // 5. Week & Leap Year State
  const [lookupDate, setLookupDate] = useState(todayStr);

  // 6. Days Until Date State
  const [targetEventDate, setTargetEventDate] = useState("2027-01-01");
  const [eventName, setEventName] = useState("New Year");

  // --- Calculations ---

  // Age calculation
  const ageResults = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(`${birthDate}T00:00:00`);
    const now = new Date();
    if (isNaN(birth.getTime()) || birth > now) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const totalDays = Math.floor((now.getTime() - birth.getTime()) / 86400000);
    const totalHours = totalDays * 24;

    // Next birthday
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysToNext = Math.ceil((nextBday.getTime() - now.getTime()) / 86400000);

    return {
      years,
      months,
      days,
      totalDays,
      totalHours,
      daysToNext,
      nextBirthdayDayOfWeek: nextBday.toLocaleDateString(locale, { weekday: "long" }),
    };
  }, [birthDate, locale]);

  // Date difference calculation
  const diffResults = useMemo(() => {
    if (!diffStart || !diffEnd) return null;
    const d1 = new Date(`${diffStart}T00:00:00`);
    const d2 = new Date(`${diffEnd}T00:00:00`);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const earlier = d1 < d2 ? d1 : d2;
    const later = d1 < d2 ? d2 : d1;
    const totalMs = later.getTime() - earlier.getTime();
    const totalDays = Math.round(totalMs / 86400000);
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;

    return {
      totalDays,
      weeks,
      remDays,
      hours: totalDays * 24,
      isSame: totalDays === 0,
    };
  }, [diffStart, diffEnd]);

  // Add / Subtract calculation
  const addSubtractResult = useMemo(() => {
    if (!calcBaseDate) return null;
    const d = new Date(`${calcBaseDate}T00:00:00`);
    if (isNaN(d.getTime())) return null;

    const multiplier = calcOperation === "add" ? 1 : -1;
    const count = addAmount * multiplier;

    if (addUnit === "days") {
      d.setDate(d.getDate() + count);
    } else if (addUnit === "weeks") {
      d.setDate(d.getDate() + count * 7);
    } else if (addUnit === "months") {
      d.setMonth(d.getMonth() + count);
    } else if (addUnit === "years") {
      d.setFullYear(d.getFullYear() + count);
    }

    return {
      formatted: d.toLocaleDateString(locale, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      iso: toIsoDate(d),
    };
  }, [calcBaseDate, addAmount, addUnit, calcOperation, locale]);

  // Business days calculation
  const bizResults = useMemo(() => {
    if (!bizStart || !bizEnd) return null;
    const d1 = new Date(`${bizStart}T00:00:00`);
    const d2 = new Date(`${bizEnd}T00:00:00`);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;

    let businessDays = 0;
    let weekendDays = 0;
    const curr = new Date(start);

    while (curr <= end) {
      const day = curr.getDay();
      if (day === 0 || day === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      curr.setDate(curr.getDate() + 1);
    }

    const totalDays = businessDays + weekendDays;
    return { businessDays, weekendDays, totalDays };
  }, [bizStart, bizEnd]);

  // Lookup results (week number + leap year)
  const lookupResults = useMemo(() => {
    if (!lookupDate) return null;
    const d = new Date(`${lookupDate}T00:00:00`);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const week = getIsoWeek(d);
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((d.getTime() - startOfYear.getTime()) / 86400000) + 1;
    const leap = isLeapYear(year);

    return {
      year,
      week,
      dayOfYear,
      leap,
      daysInYear: leap ? 366 : 365,
    };
  }, [lookupDate]);

  // Days until date
  const untilResults = useMemo(() => {
    if (!targetEventDate) return null;
    const target = new Date(`${targetEventDate}T00:00:00`);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (isNaN(target.getTime())) return null;

    const diffDays = Math.ceil((target.getTime() - today.getTime()) / 86400000);
    return {
      diffDays,
      isPast: diffDays < 0,
      isToday: diffDays === 0,
      weekday: target.toLocaleDateString(locale, { weekday: "long" }),
    };
  }, [targetEventDate, locale]);

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      {/* Tool Selector Tabs */}
      {!embedOnly && (
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-zinc-200 bg-white/80 p-1.5 dark:border-zinc-800 dark:bg-zinc-900/60">
          {[
            { id: "age-calculator", label: "Age Calculator", icon: Calendar },
            { id: "date-difference-calculator", label: "Date Difference", icon: CalendarRange },
            { id: "add-subtract-days", label: "Add / Subtract Days", icon: Plus },
            { id: "business-days-calculator", label: "Business Days", icon: Briefcase },
            { id: "week-number-calculator", label: "Week & Leap Year", icon: CalendarDays },
            { id: "days-until-date", label: "Days Until Date", icon: Clock },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCurrentTool(id as DateToolSlug)}
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

      {/* 1. Age Calculator Panel */}
      {currentTool === "age-calculator" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Age Calculator
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Calculate your exact age in years, months, and days, total days lived, and next birthday countdown.
            </p>
          </div>

          <div className="max-w-xs space-y-1">
            <label htmlFor="birthdate-input" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Date of Birth:
            </label>
            <input
              id="birthdate-input"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          {ageResults ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
                <div>
                  <span className="block text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 sm:text-4xl">
                    {ageResults.years}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Years
                  </span>
                </div>
                <div>
                  <span className="block text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 sm:text-4xl">
                    {ageResults.months}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Months
                  </span>
                </div>
                <div>
                  <span className="block text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 sm:text-4xl">
                    {ageResults.days}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Days
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                  <span className="text-xs text-zinc-500">Total Lifetime Days</span>
                  <p className="mt-1 font-mono text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {ageResults.totalDays.toLocaleString()} days
                  </p>
                  <span className="text-xs text-zinc-400">≈ {ageResults.totalHours.toLocaleString()} hours</span>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/60">
                  <span className="text-xs text-zinc-500">Next Birthday Countdown</span>
                  <p className="mt-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {ageResults.daysToNext} days away
                  </p>
                  <span className="text-xs text-zinc-400">Falls on a {ageResults.nextBirthdayDayOfWeek}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">Please select a valid past date of birth.</p>
          )}
        </section>
      )}

      {/* 2. Date Difference / Days Between Dates */}
      {(currentTool === "date-difference-calculator" || currentTool === "days-between-dates") && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Date Difference Calculator
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Calculate total days, weeks, and hours elapsed between two arbitrary calendar dates.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Start Date
              <input
                type="date"
                value={diffStart}
                onChange={(e) => setDiffStart(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              End Date
              <input
                type="date"
                value={diffEnd}
                onChange={(e) => setDiffEnd(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
          </div>

          {diffResults && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
              <span className="block font-mono text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 sm:text-5xl">
                {diffResults.totalDays} Days
              </span>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                Equivalent to <strong>{diffResults.weeks} weeks</strong> and <strong>{diffResults.remDays} days</strong> ({diffResults.hours.toLocaleString()} hours).
              </p>
            </div>
          )}
        </section>
      )}

      {/* 3. Add / Subtract Days to/from Date */}
      {currentTool === "add-subtract-days" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Add or Subtract Days from Date
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Compute past or future dates by adding or subtracting days, weeks, months, or years.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Base Date
              <input
                type="date"
                value={calcBaseDate}
                onChange={(e) => setCalcBaseDate(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Operation
              <select
                value={calcOperation}
                onChange={(e) => setCalcOperation(e.target.value as "add" | "subtract")}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="add">Add (+)</option>
                <option value="subtract">Subtract (-)</option>
              </select>
            </label>

            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Amount
              <input
                type="number"
                min="0"
                max="9999"
                value={addAmount}
                onChange={(e) => setAddAmount(Math.max(0, Number(e.target.value)))}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>

            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Unit
              <select
                value={addUnit}
                onChange={(e) => setAddUnit(e.target.value as "days" | "weeks" | "months" | "years")}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </label>
          </div>

          {addSubtractResult && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Calculated Target Date
              </span>
              <p className="mt-2 text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                {addSubtractResult.formatted}
              </p>
              <span className="mt-1 font-mono text-sm text-emerald-700 dark:text-emerald-400">
                {addSubtractResult.iso}
              </span>
            </div>
          )}
        </section>
      )}

      {/* 4. Business Days Calculator */}
      {currentTool === "business-days-calculator" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Business Days Calculator
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Calculate the number of working days between two dates, automatically excluding Saturdays and Sundays.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Start Date
              <input
                type="date"
                value={bizStart}
                onChange={(e) => setBizStart(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              End Date
              <input
                type="date"
                value={bizEnd}
                onChange={(e) => setBizEnd(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
          </div>

          {bizResults && (
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-5 text-center dark:border-zinc-800 dark:bg-zinc-950/70">
              <div>
                <span className="block text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-4xl">
                  {bizResults.businessDays}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Work Days (Mon–Fri)
                </span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-zinc-700 dark:text-zinc-300 sm:text-4xl">
                  {bizResults.weekendDays}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Weekend Days
                </span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                  {bizResults.totalDays}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Total Calendar Days
                </span>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 5. Week Number & Leap Year */}
      {(currentTool === "week-number-calculator" || currentTool === "leap-year-checker") && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Week Number & Leap Year Checker
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Check the official ISO week number, day of the year (1–366), and leap year status for any date.
            </p>
          </div>

          <div className="max-w-xs space-y-1">
            <label htmlFor="lookup-date-input" className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Select Date:
            </label>
            <input
              id="lookup-date-input"
              type="date"
              value={lookupDate}
              onChange={(e) => setLookupDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>

          {lookupResults && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-center dark:border-zinc-800 dark:bg-zinc-950/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  ISO Week Number
                </span>
                <p className="mt-2 font-mono text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  Week {lookupResults.week}
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-center dark:border-zinc-800 dark:bg-zinc-950/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Day of the Year
                </span>
                <p className="mt-2 font-mono text-4xl font-extrabold text-zinc-900 dark:text-zinc-100">
                  Day {lookupResults.dayOfYear}
                </p>
                <span className="text-xs text-zinc-400">out of {lookupResults.daysInYear}</span>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-center dark:border-zinc-800 dark:bg-zinc-950/60">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Year {lookupResults.year}
                </span>
                <p
                  className={`mt-2 text-2xl font-bold ${
                    lookupResults.leap ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {lookupResults.leap ? "Leap Year (366d)" : "Common Year (365d)"}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* 6. Days Until Date */}
      {currentTool === "days-until-date" && (
        <section className="space-y-6 rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Days Until Date Countdown
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Calculate exactly how many days remain until a goal, vacation, deadline, or milestone.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Event Name
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Vacation, Wedding, Project Launch"
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
            <label className="space-y-1 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Target Date
              <input
                type="date"
                value={targetEventDate}
                onChange={(e) => setTargetEventDate(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </label>
          </div>

          {untilResults && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                {eventName || "Target Date"} Countdown
              </span>
              <p className="mt-2 font-mono text-5xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {untilResults.isToday
                  ? "Today!"
                  : untilResults.isPast
                    ? `${Math.abs(untilResults.diffDays)} Days Ago`
                    : `${untilResults.diffDays} Days Left`}
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                Falls on a <strong>{untilResults.weekday}</strong> ({targetEventDate}).
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
