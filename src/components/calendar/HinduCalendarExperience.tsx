"use client";

import { useI18n } from "@/context/locale-context";
import { FESTIVALS_2026, type FestivalItem } from "@/data/festivals-2026";
import {
  STANDARD_CITIES,
  type CityCoordinates,
} from "@/lib/panchang/astronomy";
import {
  calculateDailyPanchang,
  type PanchangOutput,
} from "@/lib/panchang/panchang-engine";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Compass,
  Filter,
  MapPin,
  Moon,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

type Tradition = "purnimanta" | "amanta";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type CalendarDay = {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  panchang: PanchangOutput;
  festivals: FestivalItem[];
  isEkadashi: boolean;
  isPurnima: boolean;
  isAmavasya: boolean;
  isPradosh: boolean;
  isSankranti: boolean;
};

export function HinduCalendarExperience() {
  const { locale } = useI18n();

  // Selected year and month (0 = Jan, 11 = Dec)
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(2); // Default March 2026 (Navratri / Holi / VS 2083 transition)
  const [selectedCityKey, setSelectedCityKey] = useState<string>("delhi");
  const [tradition, setTradition] = useState<Tradition>("purnimanta");
  const [filterMode, setFilterMode] = useState<"all" | "vrats" | "festivals">("all");
  const [activeDayModal, setActiveDayModal] = useState<CalendarDay | null>(null);

  const city: CityCoordinates =
    STANDARD_CITIES[selectedCityKey] || STANDARD_CITIES.delhi;

  // Build month calendar grid (Monday-aligned)
  const calendarDays: CalendarDay[] = useMemo(() => {
    const days: CalendarDay[] = [];
    const firstDayOfMonth = new Date(Date.UTC(selectedYear, selectedMonth, 1, 12, 0, 0));
    const lastDayOfMonth = new Date(Date.UTC(selectedYear, selectedMonth + 1, 0, 12, 0, 0));

    // Get day of week for the 1st of the month (0 = Sun, 1 = Mon, ..., 6 = Sat)
    // Convert to Monday = 0, ..., Sunday = 6
    const firstDayIndex = (firstDayOfMonth.getUTCDay() + 6) % 7;

    // Days in previous month to fill leading slots
    const prevMonthLastDay = new Date(Date.UTC(selectedYear, selectedMonth, 0, 12, 0, 0)).getUTCDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(Date.UTC(selectedYear, selectedMonth - 1, prevMonthLastDay - i, 12, 0, 0));
      const dateStr = d.toISOString().slice(0, 10);
      const panchang = calculateDailyPanchang(d, city);
      const festivals = FESTIVALS_2026.filter((f) => f.date === dateStr);
      const tithiNum = panchang.udayaTithi.index;
      days.push({
        date: d,
        dateStr,
        dayNumber: prevMonthLastDay - i,
        isCurrentMonth: false,
        panchang,
        festivals,
        isEkadashi: tithiNum === 11 || tithiNum === 26,
        isPurnima: tithiNum === 15,
        isAmavasya: tithiNum === 30,
        isPradosh: tithiNum === 13 || tithiNum === 28,
        isSankranti: false,
      });
    }

    // Days of current month
    const totalDaysInMonth = lastDayOfMonth.getUTCDate();
    for (let day = 1; day <= totalDaysInMonth; day++) {
      const d = new Date(Date.UTC(selectedYear, selectedMonth, day, 12, 0, 0));
      const dateStr = d.toISOString().slice(0, 10);
      const panchang = calculateDailyPanchang(d, city);
      const festivals = FESTIVALS_2026.filter((f) => f.date === dateStr);
      const tithiNum = panchang.udayaTithi.index;
      days.push({
        date: d,
        dateStr,
        dayNumber: day,
        isCurrentMonth: true,
        panchang,
        festivals,
        isEkadashi: tithiNum === 11 || tithiNum === 26,
        isPurnima: tithiNum === 15,
        isAmavasya: tithiNum === 30,
        isPradosh: tithiNum === 13 || tithiNum === 28,
        isSankranti: false,
      });
    }

    // Days in next month to fill trailing slots to 35 or 42
    const totalSlots = days.length <= 35 ? 35 : 42;
    const remaining = totalSlots - days.length;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(Date.UTC(selectedYear, selectedMonth + 1, day, 12, 0, 0));
      const dateStr = d.toISOString().slice(0, 10);
      const panchang = calculateDailyPanchang(d, city);
      const festivals = FESTIVALS_2026.filter((f) => f.date === dateStr);
      const tithiNum = panchang.udayaTithi.index;
      days.push({
        date: d,
        dateStr,
        dayNumber: day,
        isCurrentMonth: false,
        panchang,
        festivals,
        isEkadashi: tithiNum === 11 || tithiNum === 26,
        isPurnima: tithiNum === 15,
        isAmavasya: tithiNum === 30,
        isPradosh: tithiNum === 13 || tithiNum === 28,
        isSankranti: false,
      });
    }

    return days;
  }, [selectedYear, selectedMonth, city]);

  // Navigate months
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedYear((y) => y - 1);
      setSelectedMonth(11);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedYear((y) => y + 1);
      setSelectedMonth(0);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  // Month summary statistics
  const currentMonthDays = useMemo(
    () => calendarDays.filter((d) => d.isCurrentMonth),
    [calendarDays],
  );

  const ekadashiDays = useMemo(
    () => currentMonthDays.filter((d) => d.isEkadashi),
    [currentMonthDays],
  );

  const purnimaDay = useMemo(
    () => currentMonthDays.find((d) => d.isPurnima),
    [currentMonthDays],
  );

  const amavasyaDay = useMemo(
    () => currentMonthDays.find((d) => d.isAmavasya),
    [currentMonthDays],
  );

  const monthFestivals = useMemo(() => {
    return currentMonthDays.flatMap((d) => d.festivals);
  }, [currentMonthDays]);

  // Format time for local display
  const formatTime = (d: Date) => {
    return d.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: city.timezone,
    });
  };

  // Short Tithi Name extractor
  const getShortTithiName = (fullName: string) => {
    const parts = fullName.split("(");
    return parts[0].trim();
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Interactive Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        {/* Month & Year Navigator */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            aria-label="Previous Month"
            className="rounded-xl border border-zinc-200 p-2 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {MONTH_NAMES[selectedMonth]} {selectedYear}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-medium">
              <span>
                {selectedYear === 2026 && selectedMonth < 2
                  ? "Vikram Samvat 2082"
                  : "Vikram Samvat 2083"}
              </span>
              <span>•</span>
              <span className="text-zinc-500">Shaka 1948</span>
              {selectedYear === 2026 && selectedMonth >= 4 && selectedMonth <= 6 && (
                <>
                  <span>•</span>
                  <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300">
                    Adhika Jyeshtha Period
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleNextMonth}
            aria-label="Next Month"
            className="rounded-xl border border-zinc-200 p-2 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Location & Tradition Options */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Quick Month Select Dropdown */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={idx} value={idx}>
                {name}
              </option>
            ))}
          </select>

          {/* City Selector */}
          <label className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
            <MapPin className="h-4 w-4 text-amber-600" />
            <select
              value={selectedCityKey}
              onChange={(e) => setSelectedCityKey(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-2.5 py-2 font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {Object.entries(STANDARD_CITIES).map(([key, c]) => (
                <option key={key} value={key}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          {/* Tradition Toggle */}
          <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-800/80">
            <button
              onClick={() => setTradition("purnimanta")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                tradition === "purnimanta"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Purnimanta (North)
            </button>
            <button
              onClick={() => setTradition("amanta")}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                tradition === "amanta"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              Amanta (South/West)
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Key Fasting & Festival Highlights Bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3.5">
          <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            Ekadashi Vrats ({ekadashiDays.length})
          </span>
          <div className="mt-1 text-zinc-700 dark:text-zinc-300 font-medium">
            {ekadashiDays.length > 0
              ? ekadashiDays.map((d) => `${MONTH_NAMES[selectedMonth]} ${d.dayNumber}`).join(", ")
              : "None in this period"}
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-3.5">
          <span className="font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
            <Moon className="h-4 w-4" />
            Purnima (Full Moon)
          </span>
          <div className="mt-1 text-zinc-700 dark:text-zinc-300 font-medium">
            {purnimaDay
              ? `${MONTH_NAMES[selectedMonth]} ${purnimaDay.dayNumber} (${formatTime(purnimaDay.panchang.udayaTithi.endsAt)})`
              : "Transitions across month boundary"}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-500/20 bg-zinc-500/5 p-3.5">
          <span className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <Moon className="h-4 w-4 fill-zinc-500 text-zinc-500" />
            Amavasya (New Moon)
          </span>
          <div className="mt-1 text-zinc-700 dark:text-zinc-300 font-medium">
            {amavasyaDay
              ? `${MONTH_NAMES[selectedMonth]} ${amavasyaDay.dayNumber} (${formatTime(amavasyaDay.panchang.udayaTithi.endsAt)})`
              : "Transitions across month boundary"}
          </div>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-3.5">
          <span className="font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
            <Sun className="h-4 w-4" />
            Major Festivals ({monthFestivals.length})
          </span>
          <div className="mt-1 text-zinc-700 dark:text-zinc-300 font-medium truncate">
            {monthFestivals.length > 0
              ? monthFestivals.map((f) => f.name).join(", ")
              : "Standard lunar fortnight observances"}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="font-semibold text-zinc-500 flex items-center gap-1">
          <Filter className="h-3.5 w-3.5" />
          View:
        </span>
        <button
          onClick={() => setFilterMode("all")}
          className={`rounded-full px-3 py-1 font-semibold transition ${
            filterMode === "all"
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          All Days
        </button>
        <button
          onClick={() => setFilterMode("vrats")}
          className={`rounded-full px-3 py-1 font-semibold transition ${
            filterMode === "vrats"
              ? "bg-amber-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          Fasting / Vrat Days Only
        </button>
        <button
          onClick={() => setFilterMode("festivals")}
          className={`rounded-full px-3 py-1 font-semibold transition ${
            filterMode === "festivals"
              ? "bg-rose-600 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          Festivals Only
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50 text-center text-xs font-bold uppercase tracking-wider text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-400">
          {WEEKDAY_NAMES.map((w, idx) => (
            <div
              key={w}
              className={`py-3 ${idx === 6 ? "text-rose-600 dark:text-rose-400" : ""}`}
            >
              {w}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
          {calendarDays.map((day, idx) => {
            const isFasting =
              day.isEkadashi || day.isPurnima || day.isAmavasya || day.isPradosh;
            const hasFestivals = day.festivals.length > 0;

            const isDimmed =
              !day.isCurrentMonth ||
              (filterMode === "vrats" && !isFasting) ||
              (filterMode === "festivals" && !hasFestivals);

            return (
              <div
                key={idx}
                onClick={() => setActiveDayModal(day)}
                className={`group relative flex min-h-[105px] cursor-pointer flex-col justify-between p-2 sm:p-2.5 transition hover:bg-amber-500/10 ${
                  isDimmed ? "opacity-35 bg-zinc-50/50 dark:bg-zinc-950/20" : "bg-white dark:bg-zinc-900"
                } ${day.isPurnima ? "ring-1 ring-inset ring-amber-400/40" : ""} ${
                  day.isAmavasya ? "ring-1 ring-inset ring-zinc-400/30" : ""
                }`}
              >
                {/* Top Row: Date Number and Paksha Indicator */}
                <div className="flex items-start justify-between">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      day.isEkadashi
                        ? "bg-amber-500 text-white"
                        : day.isPurnima
                        ? "bg-amber-400 text-zinc-900 font-black shadow-sm"
                        : day.isAmavasya
                        ? "bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900"
                        : "text-zinc-900 dark:text-zinc-100"
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  <span
                    className={`text-[10px] font-medium ${
                      day.panchang.udayaTithi.paksha === "Shukla"
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-indigo-600 dark:text-indigo-400"
                    }`}
                  >
                    {day.panchang.udayaTithi.paksha === "Shukla" ? "Shukla" : "Krishna"}
                  </span>
                </div>

                {/* Middle Row: Hindu Tithi Name */}
                <div className="my-1">
                  <span className="block truncate text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                    {getShortTithiName(day.panchang.udayaTithi.name)}
                  </span>
                  <span className="block truncate text-[10px] text-zinc-400">
                    {day.panchang.nakshatra.name.split("(")[0].trim()}
                  </span>
                </div>

                {/* Bottom Row: Festival & Fasting Badges */}
                <div className="space-y-1">
                  {day.isEkadashi && (
                    <span className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                      Ekadashi
                    </span>
                  )}
                  {day.isPurnima && (
                    <span className="inline-block rounded bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 dark:text-amber-200">
                      Purnima
                    </span>
                  )}
                  {day.isAmavasya && (
                    <span className="inline-block rounded bg-zinc-200 px-1.5 py-0.5 text-[9px] font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                      Amavasya
                    </span>
                  )}
                  {day.festivals.map((fest) => (
                    <span
                      key={fest.id}
                      className="block truncate rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                      title={fest.name}
                    >
                      {fest.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Detail Modal Sheet */}
      {activeDayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <button
              onClick={() => setActiveDayModal(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <CalendarIcon className="h-4 w-4" />
              <span>{activeDayModal.dateStr}</span>
              <span>•</span>
              <span>{city.name}</span>
            </div>

            <h3 className="mt-1 text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {activeDayModal.date.toLocaleDateString(locale, {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h3>

            {/* Festival Announcements */}
            {activeDayModal.festivals.length > 0 && (
              <div className="mt-4 space-y-2">
                {activeDayModal.festivals.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-950 dark:text-rose-200"
                  >
                    <div className="font-bold text-sm text-rose-700 dark:text-rose-300">
                      {f.name} ({f.nativeName})
                    </div>
                    <p className="mt-1 leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {f.description}
                    </p>
                    <div className="mt-2 text-[11px] font-semibold text-rose-800 dark:text-rose-400">
                      Rituals: {f.rituals.join(" • ")}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Panchang Limb Data Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Udaya Tithi
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-sm mt-0.5">
                  {activeDayModal.panchang.udayaTithi.name}
                </span>
                <span className="text-[11px] text-zinc-500">
                  Ends at {formatTime(activeDayModal.panchang.udayaTithi.endsAt)}
                </span>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Nakshatra
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-sm mt-0.5">
                  {activeDayModal.panchang.nakshatra.name}
                </span>
                <span className="text-[11px] text-zinc-500">
                  Ends at {formatTime(activeDayModal.panchang.nakshatra.endsAt)}
                </span>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Yoga
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-sm mt-0.5">
                  {activeDayModal.panchang.yoga.name}
                </span>
                <span className="text-[11px] text-zinc-500">
                  Ends at {formatTime(activeDayModal.panchang.yoga.endsAt)}
                </span>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Sun Times ({city.name})
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-sm mt-0.5">
                  ↑ {formatTime(activeDayModal.panchang.solarTimes.sunrise)}
                </span>
                <span className="text-[11px] text-zinc-500">
                  ↓ {formatTime(activeDayModal.panchang.solarTimes.sunset)}
                </span>
              </div>
            </div>

            {/* Quick Links & CTA */}
            <div className="mt-5 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href={`/${locale}/panchang?date=${activeDayModal.dateStr}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-700"
              >
                <Compass className="h-4 w-4" />
                <span>Open Full Daily Panchang</span>
              </Link>

              <button
                onClick={() => setActiveDayModal(null)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
