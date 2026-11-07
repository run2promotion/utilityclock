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
  Clock,
  Compass,
  MapPin,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const GUJARATI_CITIES: Record<string, CityCoordinates> = {
  ahmedabad: STANDARD_CITIES.ahmedabad,
  mumbai: STANDARD_CITIES.mumbai,
  surat: {
    name: "Surat",
    nativeName: "સુરત",
    latitude: 21.1702,
    longitude: 72.8311,
    elevationMeters: 13,
    timezone: "Asia/Kolkata",
  },
  rajkot: {
    name: "Rajkot",
    nativeName: "રાજકોટ",
    latitude: 22.3039,
    longitude: 70.8022,
    elevationMeters: 128,
    timezone: "Asia/Kolkata",
  },
  vadodara: {
    name: "Vadodara",
    nativeName: "વડોદરા",
    latitude: 22.3072,
    longitude: 73.1812,
    elevationMeters: 39,
    timezone: "Asia/Kolkata",
  },
  delhi: STANDARD_CITIES.delhi,
};

const GUJARATI_MONTH_NAV = [
  { index: 0, en: "Kartak", gu: "કારતક", yearStr: "VS 2082" },
  { index: 1, en: "Magshar", gu: "માગશર", yearStr: "VS 2082" },
  { index: 2, en: "Posh", gu: "પોષ", yearStr: "VS 2082" },
  { index: 3, en: "Maha", gu: "મહા", yearStr: "VS 2082" },
  { index: 4, en: "Fagun", gu: "ફાગણ", yearStr: "VS 2082" },
  { index: 5, en: "Chaitra", gu: "ચૈત્ર", yearStr: "VS 2082" },
  { index: 6, en: "Vaishakh", gu: "વૈશાખ", yearStr: "VS 2082" },
  { index: 7, en: "Adhik Jeth", gu: "અધિક જેઠ (પુરુષોત્તમ)", yearStr: "VS 2082 (સ્પેશિયલ)" },
  { index: 8, en: "Jeth", gu: "જેઠ (નિજ)", yearStr: "VS 2082" },
  { index: 9, en: "Ashadh", gu: "અષાઢ", yearStr: "VS 2082" },
  { index: 10, en: "Shravan", gu: "શ્રાવણ", yearStr: "VS 2082" },
  { index: 11, en: "Bhadarvo", gu: "ભાદરવો", yearStr: "VS 2082" },
  { index: 12, en: "Aso", gu: "આસો", yearStr: "VS 2082" },
];

const GUJARATI_WEEKDAYS = [
  { en: "Mon", gu: "સોમ" },
  { en: "Tue", gu: "મંગળ" },
  { en: "Wed", gu: "બુધ" },
  { en: "Thu", gu: "ગુરુ" },
  { en: "Fri", gu: "શુક્ર" },
  { en: "Sat", gu: "શનિ" },
  { en: "Sun", gu: "રવિ" },
];

// Approximate Gregorian month range mapping for 2026 Gujarati months
const GUJARATI_MONTH_GREGORIAN_MONTH_2026: Record<number, number> = {
  0: 10, // Kartak -> Nov 2026 (or Oct 2025)
  1: 11, // Magshar -> Dec
  2: 0,  // Posh -> Jan 2026
  3: 1,  // Maha -> Feb 2026
  4: 2,  // Fagun -> Mar 2026
  5: 3,  // Chaitra -> Apr 2026
  6: 4,  // Vaishakh -> May 2026
  7: 4,  // Adhik Jeth -> Mid May to Mid June 2026
  8: 5,  // Jeth -> Jun 2026
  9: 6,  // Ashadh -> Jul 2026
  10: 7, // Shravan -> Aug 2026
  11: 8, // Bhadarvo -> Sep 2026
  12: 9, // Aso -> Oct 2026
};

type GujaratiCalendarDay = {
  date: Date;
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  panchang: PanchangOutput;
  festivals: FestivalItem[];
  isEkadashi: boolean;
  isPurnima: boolean;
  isAmavasya: boolean;
  isPradosh: boolean;
  gujaratiTithiLabel: string;
};

export function GujaratiCalendarExperience() {
  const { locale } = useI18n();

  // Selected Gujarati month index (0 to 12)
  const [selectedGujMonthIndex, setSelectedGujMonthIndex] = useState<number>(4); // Fagun / March 2026 default
  const [selectedCityKey, setSelectedCityKey] = useState<string>("ahmedabad");
  const [activeDayModal, setActiveDayModal] = useState<GujaratiCalendarDay | null>(null);
  const [showChoghadiyaCard, setShowChoghadiyaCard] = useState<boolean>(true);

  const city: CityCoordinates =
    GUJARATI_CITIES[selectedCityKey] || GUJARATI_CITIES.ahmedabad;

  // Selected Gregorian month corresponding to the selected Gujarati month
  const gregMonth = GUJARATI_MONTH_GREGORIAN_MONTH_2026[selectedGujMonthIndex] ?? 2;
  const year = 2026;

  // Build calendar days
  const calendarDays: GujaratiCalendarDay[] = useMemo(() => {
    const days: GujaratiCalendarDay[] = [];
    const firstDayOfMonth = new Date(Date.UTC(year, gregMonth, 1, 12, 0, 0));
    const lastDayOfMonth = new Date(Date.UTC(year, gregMonth + 1, 0, 12, 0, 0));

    const firstDayIndex = (firstDayOfMonth.getUTCDay() + 6) % 7;
    const prevMonthLastDay = new Date(Date.UTC(year, gregMonth, 0, 12, 0, 0)).getUTCDate();

    // Helper to format Gujarati Tithi label
    const formatGujTithi = (p: PanchangOutput) => {
      const paksha = p.udayaTithi.paksha === "Shukla" ? "સુદ" : "વદ";
      const tithiNum = p.udayaTithi.index;
      if (tithiNum === 15) return "પૂનમ";
      if (tithiNum === 30) return "અમાસ";
      const numInPaksha = tithiNum <= 15 ? tithiNum : tithiNum - 15;
      const GUJ_NUM_NAMES: Record<number, string> = {
        1: "એકમ",
        2: "બીજ",
        3: "ત્રીજ",
        4: "ચોથ",
        5: "પાંચમ",
        6: "છઠ",
        7: "સાતમ",
        8: "આઠમ",
        9: "નોમ",
        10: "દસમ",
        11: "અગિયારસ",
        12: "બારસ",
        13: "તેરસ",
        14: "ચૌદશ",
      };
      return `${paksha} ${GUJ_NUM_NAMES[numInPaksha] || numInPaksha}`;
    };

    // Leading padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(Date.UTC(year, gregMonth - 1, prevMonthLastDay - i, 12, 0, 0));
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
        gujaratiTithiLabel: formatGujTithi(panchang),
      });
    }

    // Current month days
    const totalDays = lastDayOfMonth.getUTCDate();
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(Date.UTC(year, gregMonth, day, 12, 0, 0));
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
        gujaratiTithiLabel: formatGujTithi(panchang),
      });
    }

    // Trailing padding to 35 or 42
    const totalSlots = days.length <= 35 ? 35 : 42;
    const remaining = totalSlots - days.length;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(Date.UTC(year, gregMonth + 1, day, 12, 0, 0));
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
        gujaratiTithiLabel: formatGujTithi(panchang),
      });
    }

    return days;
  }, [gregMonth, year, city]);

  const currentGujMonth = GUJARATI_MONTH_NAV[selectedGujMonthIndex];

  // Daily Panchang for today
  const todayPanchang = useMemo(() => {
    return calculateDailyPanchang(new Date(), city);
  }, [city]);

  // Format time
  const formatTime = (d: Date) => {
    return d.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: city.timezone,
    });
  };

  // Get Choghadiya nature styling
  const getChoghadiyaColor = (name: string) => {
    switch (name) {
      case "Amrit":
      case "Shubh":
      case "Labh":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
      case "Char":
        return "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800";
      default:
        return "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Gujarati Month & City Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-orange-500/20 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setSelectedGujMonthIndex((prev) => (prev === 0 ? 12 : prev - 1))
            }
            aria-label="Previous Month"
            className="rounded-xl border border-zinc-200 p-2 text-zinc-700 transition hover:bg-orange-50 hover:text-orange-700 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div>
            <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
              {currentGujMonth.gu} ({currentGujMonth.en})
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-orange-700 dark:text-orange-400">
              <span>{currentGujMonth.yearStr}</span>
              <span>•</span>
              <span className="text-zinc-500">અમાવસ્યાન્ત પદ્ધતિ (Amavasyanta)</span>
            </div>
          </div>

          <button
            onClick={() =>
              setSelectedGujMonthIndex((prev) => (prev === 12 ? 0 : prev + 1))
            }
            aria-label="Next Month"
            className="rounded-xl border border-zinc-200 p-2 text-zinc-700 transition hover:bg-orange-50 hover:text-orange-700 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* City and Month Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <select
            value={selectedGujMonthIndex}
            onChange={(e) => setSelectedGujMonthIndex(Number(e.target.value))}
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
          >
            {GUJARATI_MONTH_NAV.map((m) => (
              <option key={m.index} value={m.index}>
                {m.gu} ({m.en})
              </option>
            ))}
          </select>

          <label className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
            <MapPin className="h-4 w-4 text-orange-600" />
            <select
              value={selectedCityKey}
              onChange={(e) => setSelectedCityKey(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-2.5 py-2 font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {Object.entries(GUJARATI_CITIES).map(([key, c]) => (
                <option key={key} value={key}>
                  {c.nativeName} ({c.name})
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={() => setShowChoghadiyaCard((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 font-semibold text-orange-800 transition hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/60 dark:text-orange-300"
          >
            <Clock className="h-4 w-4" />
            <span>ચોઘડિયા પેનલ</span>
          </button>
        </div>
      </div>

      {/* Real-time Day Choghadiya Highlights Widget */}
      {showChoghadiyaCard && (
        <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-orange-500/20 pb-3">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-orange-600" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                આજના દિવસના ચોઘડિયા — {city.nativeName} (Day Choghadiya)
              </h3>
            </div>
            <span className="text-xs font-semibold text-zinc-500">
              સૂર્યોદય: {formatTime(todayPanchang.solarTimes.sunrise)} • સૂર્યાસ્ત: {formatTime(todayPanchang.solarTimes.sunset)}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8 text-xs">
            {todayPanchang.dayChoghadiya.map((slot, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border p-2.5 text-center ${getChoghadiyaColor(slot.name)}`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  ચોઘડિયું {idx + 1}
                </span>
                <span className="font-bold text-sm block mt-0.5">
                  {slot.name}
                </span>
                <span className="text-[10px] font-medium block mt-1">
                  {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> અમૃત, શુભ, લાભ = શ્રેષ્ઠ મુહૂર્ત
              </span>
              <span className="flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span> ચલ = સામાન્ય મુહૂર્ત
              </span>
              <span className="flex items-center gap-1 font-semibold text-rose-700 dark:text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span> રોગ, કાળ, ઉદ્વેગ = અશુભ સમય
              </span>
            </div>
            <Link
              href={`/${locale}/panchang#choghadiya`}
              className="font-bold text-orange-600 hover:underline dark:text-orange-400"
            >
              રાત્રિના ચોઘડિયા જુઓ →
            </Link>
          </div>
        </div>
      )}

      {/* Gujarati Calendar Grid */}
      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Weekday headers in Gujarati */}
        <div className="grid grid-cols-7 border-b border-zinc-200 bg-orange-50/50 text-center text-xs font-bold uppercase tracking-wider text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300">
          {GUJARATI_WEEKDAYS.map((w, idx) => (
            <div
              key={w.en}
              className={`py-3 ${idx === 6 ? "text-rose-600 dark:text-rose-400" : ""}`}
            >
              <span>{w.gu}</span>
              <span className="text-[10px] text-zinc-400 font-normal ml-1">({w.en})</span>
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-zinc-200 dark:divide-zinc-800 text-xs">
          {calendarDays.map((day, idx) => {
            return (
              <div
                key={idx}
                onClick={() => setActiveDayModal(day)}
                className={`group relative flex min-h-[105px] cursor-pointer flex-col justify-between p-2 sm:p-2.5 transition hover:bg-orange-500/10 ${
                  !day.isCurrentMonth ? "opacity-35 bg-zinc-50/50 dark:bg-zinc-950/20" : "bg-white dark:bg-zinc-900"
                } ${day.isPurnima ? "ring-1 ring-inset ring-amber-400/50" : ""} ${
                  day.isAmavasya ? "ring-1 ring-inset ring-zinc-400/30" : ""
                }`}
              >
                {/* Top: Solar Date and Gujarati Tithi Paksha */}
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
                    className={`text-[10px] font-bold ${
                      day.panchang.udayaTithi.paksha === "Shukla"
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-indigo-600 dark:text-indigo-400"
                    }`}
                  >
                    {day.gujaratiTithiLabel}
                  </span>
                </div>

                {/* Nakshatra */}
                <div className="my-1">
                  <span className="block truncate text-[10px] text-zinc-400">
                    {day.panchang.nakshatra.name.split("(")[0].trim()}
                  </span>
                </div>

                {/* Bottom Badges */}
                <div className="space-y-1">
                  {day.isEkadashi && (
                    <span className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                      અગિયારસ
                    </span>
                  )}
                  {day.isPurnima && (
                    <span className="inline-block rounded bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-900 dark:text-amber-200">
                      પૂનમ
                    </span>
                  )}
                  {day.isAmavasya && (
                    <span className="inline-block rounded bg-zinc-200 px-1.5 py-0.5 text-[9px] font-bold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                      અમાસ
                    </span>
                  )}
                  {day.festivals.map((fest) => (
                    <span
                      key={fest.id}
                      className="block truncate rounded bg-rose-50 px-1.5 py-0.5 text-[9px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                      title={fest.nativeName || fest.name}
                    >
                      {fest.nativeName.split("/")[1]?.trim() || fest.nativeName.split("/")[0]?.trim() || fest.name}
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

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
              <CalendarIcon className="h-4 w-4" />
              <span>{activeDayModal.dateStr}</span>
              <span>•</span>
              <span>{city.nativeName} ({city.name})</span>
            </div>

            <h3 className="mt-1 text-2xl font-black text-zinc-900 dark:text-zinc-50">
              {activeDayModal.gujaratiTithiLabel} — {activeDayModal.dayNumber} {GUJARATI_MONTH_NAV[selectedGujMonthIndex].gu}
            </h3>

            {activeDayModal.festivals.length > 0 && (
              <div className="mt-4 space-y-2">
                {activeDayModal.festivals.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-2xl border border-orange-500/20 bg-orange-500/10 p-3.5 text-xs text-orange-950 dark:text-orange-200"
                  >
                    <div className="font-bold text-sm text-orange-700 dark:text-orange-300">
                      {f.nativeName} ({f.name})
                    </div>
                    <p className="mt-1 leading-relaxed text-zinc-700 dark:text-zinc-300">
                      {f.description}
                    </p>
                    <div className="mt-2 text-[11px] font-semibold text-orange-800 dark:text-orange-400">
                      મહત્વ: {f.significance}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  સૂર્યોદયકાલીન તિથિ
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-sm mt-0.5">
                  {activeDayModal.panchang.udayaTithi.name}
                </span>
                <span className="text-[11px] text-zinc-500">
                  સમાપ્તિ: {formatTime(activeDayModal.panchang.udayaTithi.endsAt)}
                </span>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  નક્ષત્ર
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-sm mt-0.5">
                  {activeDayModal.panchang.nakshatra.name}
                </span>
                <span className="text-[11px] text-zinc-500">
                  સમાપ્તિ: {formatTime(activeDayModal.panchang.nakshatra.endsAt)}
                </span>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  સૂર્ય સમય ({city.nativeName})
                </span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block text-sm mt-0.5">
                  ↑ {formatTime(activeDayModal.panchang.solarTimes.sunrise)}
                </span>
                <span className="text-[11px] text-zinc-500">
                  ↓ {formatTime(activeDayModal.panchang.solarTimes.sunset)}
                </span>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  રાહુ કાળ
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400 block text-sm mt-0.5">
                  {formatTime(activeDayModal.panchang.muhurats.rahuKaal.start)} – {formatTime(activeDayModal.panchang.muhurats.rahuKaal.end)}
                </span>
                <span className="text-[11px] text-zinc-500">
                  અશુભ મુહૂર્ત
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href={`/${locale}/panchang?date=${activeDayModal.dateStr}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-orange-700"
              >
                <Compass className="h-4 w-4" />
                <span>સંપૂર્ણ પંચાંગ અને ચોઘડિયા</span>
              </Link>

              <button
                onClick={() => setActiveDayModal(null)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                બંધ કરો
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
