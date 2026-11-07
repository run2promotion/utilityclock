"use client";

import { useI18n } from "@/context/locale-context";
import { FESTIVALS_2026 } from "@/data/festivals-2026";
import {
  STANDARD_CITIES,
  getCelestialPositions,
} from "@/lib/panchang/astronomy";
import {
  calculateDailyPanchang,
  type PanchangOutput,
} from "@/lib/panchang/panchang-engine";
import {
  Clock,
  Compass,
  MapPin,
  Moon,
  ShieldAlert,
  Sparkles,
  Sun,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

const RASHI_NAMES = [
  "Mesha (Aries / મેષ)",
  "Vrishabha (Taurus / વૃષભ)",
  "Mithuna (Gemini / મિથુન)",
  "Karka (Cancer / કર્ક)",
  "Simha (Leo / સિંહ)",
  "Kanya (Virgo / કન્યા)",
  "Tula (Libra / તુલા)",
  "Vrishchika (Scorpio / વૃશ્ચિક)",
  "Dhanu (Sagittarius / ધનુ)",
  "Makara (Capricorn / મકર)",
  "Kumbha (Aquarius / કુંભ)",
  "Meena (Pisces / મીન)",
];

const POPULAR_CITIES = [
  { key: "delhi", label: "Delhi" },
  { key: "mumbai", label: "Mumbai" },
  { key: "ahmedabad", label: "Ahmedabad" },
  { key: "bengaluru", label: "Bengaluru" },
  { key: "kolkata", label: "Kolkata" },
  { key: "chennai", label: "Chennai" },
  { key: "london", label: "London" },
  { key: "new_york", label: "New York" },
];

export function PanchangExperience() {
  const { locale } = useI18n();
  const [selectedCityKey, setSelectedCityKey] = useState<string>("delhi");
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    () => new Date().toISOString().slice(0, 10),
  );
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Check URL query parameters on mount safely in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlDate = params.get("date");
      if (urlDate && /^\d{4}-\d{2}-\d{2}$/.test(urlDate)) {
        setSelectedDateStr(urlDate);
      }
      const urlCity = params.get("city");
      if (urlCity && STANDARD_CITIES[urlCity]) {
        setSelectedCityKey(urlCity);
      }
    }
  }, []);

  const city = STANDARD_CITIES[selectedCityKey] || STANDARD_CITIES.delhi;

  const panchang: PanchangOutput = useMemo(() => {
    const d = new Date(`${selectedDateStr}T12:00:00Z`);
    return calculateDailyPanchang(d, city);
  }, [selectedDateStr, city]);

  const celestialPositions = useMemo(() => {
    const d = new Date(`${selectedDateStr}T12:00:00Z`);
    return getCelestialPositions(d);
  }, [selectedDateStr]);

  const sunRashi = useMemo(() => {
    const idx = Math.floor(celestialPositions.sunSiderealLon / 30);
    return RASHI_NAMES[((idx % 12) + 12) % 12];
  }, [celestialPositions]);

  const moonRashi = useMemo(() => {
    const idx = Math.floor(celestialPositions.moonSiderealLon / 30);
    return RASHI_NAMES[((idx % 12) + 12) % 12];
  }, [celestialPositions]);

  // Brahma Muhurat: 96 to 48 minutes before local sunrise
  const brahmaMuhurat = useMemo(() => {
    const sr = panchang.solarTimes.sunrise.getTime();
    return {
      start: new Date(sr - 96 * 60000),
      end: new Date(sr - 48 * 60000),
    };
  }, [panchang]);

  // Festivals on this date
  const festivalsOnDate = useMemo(() => {
    return FESTIVALS_2026.filter((f) => f.date === selectedDateStr);
  }, [selectedDateStr]);

  const now = new Date();
  const isToday = selectedDateStr === now.toISOString().slice(0, 10);

  // Time formatter for local city display
  const formatTime = (d: Date) => {
    return d.toLocaleTimeString(locale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: city.timezone,
    });
  };

  const isCurrentTimeInRange = (start: Date, end: Date) => {
    if (!isToday) return false;
    const t = now.getTime();
    return t >= start.getTime() && t <= end.getTime();
  };

  // Day navigation helpers
  const handleShiftDay = (deltaDays: number) => {
    const cur = new Date(`${selectedDateStr}T12:00:00Z`);
    cur.setUTCDate(cur.getUTCDate() + deltaDays);
    setSelectedDateStr(cur.toISOString().slice(0, 10));
  };

  const handleSetToday = () => {
    setSelectedDateStr(now.toISOString().slice(0, 10));
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/${locale}/panchang?date=${selectedDateStr}&city=${selectedCityKey}`;
      navigator.clipboard?.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Vrat / Observance flag check
  const tithiNum = panchang.udayaTithi.index;
  const isEkadashi = tithiNum === 11 || tithiNum === 26;
  const isPurnima = tithiNum === 15;
  const isAmavasya = tithiNum === 30;
  const isPradosh = tithiNum === 13 || tithiNum === 28;

  return (
    <div className="w-full space-y-8">
      {/* City & Date Interactive Controller */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <MapPin className="h-4 w-4 text-red-500" />
            <span>Location:</span>
            <select
              value={selectedCityKey}
              onChange={(e) => setSelectedCityKey(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            >
              {Object.entries(STANDARD_CITIES).map(([key, c]) => (
                <option key={key} value={key}>
                  {c.name} ({c.nativeName})
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            <CalendarIcon className="h-4 w-4 text-red-500" />
            <span>Date:</span>
            <input
              type="date"
              value={selectedDateStr}
              onChange={(e) => setSelectedDateStr(e.target.value)}
              className="rounded-xl border border-zinc-300 bg-white px-2.5 py-1 text-xs font-medium text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            />
          </label>
        </div>

        {/* Quick Day Shifters & Share Button */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => handleShiftDay(-1)}
            aria-label="Previous Day"
            className="rounded-xl border border-zinc-200 p-2 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleSetToday}
            className={`rounded-xl px-3 py-1.5 font-semibold transition ${
              isToday
                ? "bg-red-600 text-white"
                : "border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handleShiftDay(1)}
            aria-label="Next Day"
            className="rounded-xl border border-zinc-200 p-2 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 py-1.5 font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
            title="Copy shareable link"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-zinc-500" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Popular City Quick-Select Pills */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <span className="font-semibold text-zinc-400 text-[11px] mr-1">
          Popular Cities:
        </span>
        {POPULAR_CITIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedCityKey(c.key)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              selectedCityKey === c.key
                ? "bg-red-600 text-white font-semibold shadow-sm"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Active Fast / Festival Banner if applicable */}
      {(festivalsOnDate.length > 0 || isEkadashi || isPurnima || isAmavasya || isPradosh) && (
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Observance & Fasting Notice
            </span>
            {isEkadashi && (
              <span className="rounded-full bg-amber-500 text-white px-2 py-0.5 text-[10px] font-bold">
                ★ Ekadashi Vrat
              </span>
            )}
            {isPurnima && (
              <span className="rounded-full bg-amber-400 text-zinc-900 px-2 py-0.5 text-[10px] font-bold">
                🌕 Purnima Vrat
              </span>
            )}
            {isAmavasya && (
              <span className="rounded-full bg-zinc-800 text-white px-2 py-0.5 text-[10px] font-bold">
                🌑 Amavasya (Pitru Tarpan)
              </span>
            )}
            {isPradosh && (
              <span className="rounded-full bg-purple-100 text-purple-800 px-2 py-0.5 text-[10px] font-bold dark:bg-purple-950 dark:text-purple-300">
                Pradosh Vrat
              </span>
            )}
          </div>

          {festivalsOnDate.map((f) => (
            <div key={f.id} className="mt-2">
              <h4 className="text-base font-black text-zinc-900 dark:text-zinc-50">
                {f.name} ({f.nativeName})
              </h4>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {f.description}
              </p>
              <div className="mt-1.5 text-[11px] font-semibold text-amber-800 dark:text-amber-300">
                Significance: {f.significance}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Solar Ephemeris & Udaya Tithi Banner */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Udaya Tithi (सूर्योदय कालीन)
            </span>
            <Sun className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-50">
            {panchang.udayaTithi.name}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            {panchang.udayaTithi.pakshaName}
          </div>
          <div className="mt-2 text-[11px] font-medium text-amber-700 dark:text-amber-300">
            Ends at {formatTime(panchang.udayaTithi.endsAt)}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-card p-4 shadow-sm dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Local Sunrise & Sunset
            </span>
            <Clock className="h-4 w-4 text-orange-500" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-zinc-400 block">Sunrise</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {formatTime(panchang.solarTimes.sunrise)}
              </span>
            </div>
            <div>
              <span className="text-xs text-zinc-400 block">Sunset</span>
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {formatTime(panchang.solarTimes.sunset)}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-zinc-400">
            Day Length: <strong className="text-zinc-600 dark:text-zinc-300">{panchang.solarTimes.dayLengthFormatted}</strong>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Abhijit Muhurat (अभिजीत)
            </span>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-50">
            {formatTime(panchang.muhurats.abhijit.start)} – {formatTime(panchang.muhurats.abhijit.end)}
          </div>
          <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            {isCurrentTimeInRange(panchang.muhurats.abhijit.start, panchang.muhurats.abhijit.end) ? (
              <span className="inline-flex items-center gap-1 font-bold animate-pulse">
                ● Active Auspicious Window
              </span>
            ) : (
              "Prime Auspicious Time"
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Rahu Kaal (राहुकाल)
            </span>
            <ShieldAlert className="h-4 w-4 text-red-500" />
          </div>
          <div className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-50">
            {formatTime(panchang.muhurats.rahuKaal.start)} – {formatTime(panchang.muhurats.rahuKaal.end)}
          </div>
          <div className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
            {isCurrentTimeInRange(panchang.muhurats.rahuKaal.start, panchang.muhurats.rahuKaal.end) ? (
              <span className="inline-flex items-center gap-1 font-bold animate-pulse text-red-600">
                ⚠️ Rahu Kaal Active Now
              </span>
            ) : (
              "Avoid Inauspicious Ventures"
            )}
          </div>
        </div>
      </div>

      {/* The 5 Limbs (Pancha Anga) Live Data Grid */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Compass className="h-5 w-5 text-red-500" />
          Exact Panch-Anga Parameters (पंचांग अंग)
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              1. Tithi (तिथि)
            </span>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {panchang.currentTithi.name}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              Ends at {formatTime(panchang.currentTithi.endsAt)}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              2. Nakshatra (नक्षत्र)
            </span>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {panchang.nakshatra.name} (Pada {panchang.nakshatra.pada})
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              Ends at {formatTime(panchang.nakshatra.endsAt)}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              3. Yoga (योग)
            </span>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {panchang.yoga.name}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              Ends at {formatTime(panchang.yoga.endsAt)}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              4. Karana (करण)
            </span>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>{panchang.karana.name}</span>
              {panchang.karana.isVishtiBhadra && (
                <span className="rounded bg-red-100 px-1.5 py-0.2 text-[10px] font-bold text-red-700 dark:bg-red-950 dark:text-red-300">
                  Bhadra
                </span>
              )}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              Ends at {formatTime(panchang.karana.endsAt)}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              5. Vara (वार)
            </span>
            <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {panchang.vara}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              Vedic Solar Day
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Auspicious & Inauspicious Muhurats */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Auspicious & Inauspicious Timings (शुभ एवं अशुभ मुहूर्त)
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          {/* Brahma Muhurat */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
              Brahma Muhurat (ब्रह्म मुहूर्त)
            </span>
            <div className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {formatTime(brahmaMuhurat.start)} – {formatTime(brahmaMuhurat.end)}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              Pre-dawn meditation & spiritual practice (48 mins duration).
            </p>
          </div>

          {/* Abhijit Muhurat */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
              Abhijit Muhurat (अभिजीत मुहूर्त)
            </span>
            <div className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {formatTime(panchang.muhurats.abhijit.start)} – {formatTime(panchang.muhurats.abhijit.end)}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              Midday supreme window; destroys all minor doshas.
            </p>
          </div>

          {/* Yamaganda */}
          <div className="rounded-2xl border border-amber-500/20 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
            <span className="font-bold text-amber-800 dark:text-amber-300 block">
              Yamaganda (यमगण्ड)
            </span>
            <div className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {formatTime(panchang.muhurats.yamaganda.start)} – {formatTime(panchang.muhurats.yamaganda.end)}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              Inauspicious daytime segment governed by Yama.
            </p>
          </div>

          {/* Gulika Kaal */}
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-50/40 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
            <span className="font-bold text-indigo-800 dark:text-indigo-300 block">
              Gulika Kaal (गुलिक काल)
            </span>
            <div className="mt-1 text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {formatTime(panchang.muhurats.gulika.start)} – {formatTime(panchang.muhurats.gulika.end)}
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">
              Governed by Saturn; actions started here tend to repeat.
            </p>
          </div>
        </div>
      </div>

      {/* Planetary & Sidereal Ephemeris Status */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Moon className="h-5 w-5 text-amber-500" />
          Planetary Positions & Ephemeris (ग्रह स्थिति)
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Sun Sign (सूर्य राशि)
            </span>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block">
              {sunRashi}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Sidereal Nirayana Longitude: {celestialPositions.sunSiderealLon.toFixed(2)}°
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Moon Sign (चन्द्र राशि)
            </span>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block">
              {moonRashi}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Sidereal Nirayana Longitude: {celestialPositions.moonSiderealLon.toFixed(2)}°
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Lahiri Ayanamsa (चित्रापक्ष)
            </span>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block">
              {celestialPositions.ayanamsa.toFixed(4)}°
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Chitra Paksha / IMD Kolkata Standard
            </span>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Ayana & Season (ऋतु)
            </span>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block">
              Uttarayan (उत्तरायण)
            </span>
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Northern Solstitial Movement
            </span>
          </div>
        </div>
      </div>

      {/* Day & Night Choghadiya Tables */}
      <div id="choghadiya" className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            Day & Night Choghadiya (આજના ચોઘડિયા)
          </h3>
          <span className="text-xs text-zinc-500">Topocentric 8-fold partitions</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Day Choghadiya */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 mb-3">
              <Sun className="h-4 w-4" />
              <span>Day Choghadiya (દિવસના ચોઘડિયા)</span>
            </div>
            <div className="divide-y divide-zinc-100 text-xs dark:divide-zinc-800/80">
              {panchang.dayChoghadiya.map((c, i) => {
                const active = isCurrentTimeInRange(c.startTime, c.endTime);
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors ${
                      active ? "bg-amber-500/15 font-bold" : "hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {c.nativeName}
                      </span>
                      {active && (
                        <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] text-white">
                          Now
                        </span>
                      )}
                    </div>
                    <div className="text-zinc-500 font-mono">
                      {formatTime(c.startTime)} – {formatTime(c.endTime)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Night Choghadiya */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-3">
              <Moon className="h-4 w-4" />
              <span>Night Choghadiya (રાત્રિના ચોઘડિયા)</span>
            </div>
            <div className="divide-y divide-zinc-100 text-xs dark:divide-zinc-800/80">
              {panchang.nightChoghadiya.map((c, i) => {
                const active = isCurrentTimeInRange(c.startTime, c.endTime);
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between py-2 px-2.5 rounded-lg transition-colors ${
                      active ? "bg-indigo-500/15 font-bold" : "hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {c.nativeName}
                      </span>
                      {active && (
                        <span className="rounded-full bg-indigo-500 px-1.5 py-0.5 text-[9px] text-white">
                          Now
                        </span>
                      )}
                    </div>
                    <div className="text-zinc-500 font-mono">
                      {formatTime(c.startTime)} – {formatTime(c.endTime)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
