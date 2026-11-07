"use client";

import { useI18n } from "@/context/locale-context";
import { type FestivalCategory } from "@/data/festivals-2026";
import { ALL_FESTIVALS, getFestivalsForYear } from "@/data/festivals-registry";
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  Compass,
  LayoutGrid,
  ListOrdered,
  Printer,
  Search,
  Share2,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

const CATEGORY_TABS: { id: "all" | FestivalCategory; label: string; iconName: string }[] = [
  { id: "all", label: "All Celebrations", iconName: "Sparkles" },
  { id: "hindu", label: "Hindu (सनातन)", iconName: "Sun" },
  { id: "gujarati", label: "Gujarati (ગુજરાતી)", iconName: "Compass" },
  { id: "jain", label: "Jain (જૈન)", iconName: "Flame" },
  { id: "sikh", label: "Sikh (ਸਿੱਖ)", iconName: "Sparkles" },
  { id: "buddhist", label: "Buddhist (બૌદ્ધ)", iconName: "Sun" },
];

const MONTH_FILTERS = [
  { value: "all", label: "All Months" },
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

export interface FestivalsExperienceProps {
  initialYear?: number | "all";
  initialCategory?: "all" | FestivalCategory;
}

export function FestivalsExperience({
  initialYear = 2026,
  initialCategory = "all",
}: FestivalsExperienceProps = {}) {
  const { locale } = useI18n();

  const [selectedYear, setSelectedYear] = useState<number | "all">(initialYear);
  const [activeCategory, setActiveCategory] = useState<"all" | FestivalCategory>(initialCategory);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [copied, setCopied] = useState<boolean>(false);

  // Today reference
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Filtered festivals
  const filteredFestivals = useMemo(() => {
    let list =
      selectedYear === "all"
        ? ALL_FESTIVALS
        : getFestivalsForYear(selectedYear);

    // Category filter
    if (activeCategory !== "all") {
      list = list.filter((f) => f.category === activeCategory);
    }

    // Month filter
    if (selectedMonth !== "all") {
      list = list.filter((f) => f.date.slice(5, 7) === selectedMonth);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.nativeName.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.lunarMonth.toLowerCase().includes(q) ||
          f.significance.toLowerCase().includes(q) ||
          f.rituals.some((r) => r.toLowerCase().includes(q)) ||
          f.date.includes(q),
      );
    }

    return list;
  }, [selectedYear, activeCategory, selectedMonth, searchQuery]);

  // Upcoming major festivals
  const upcomingFestivals = useMemo(() => {
    const pool =
      selectedYear === "all"
        ? ALL_FESTIVALS
        : getFestivalsForYear(selectedYear);
    const future = pool.filter((f) => f.date >= todayStr && f.isMajor);
    return future.slice(0, 3);
  }, [selectedYear, todayStr]);

  // Calculate days remaining
  const getDaysRemaining = (targetDateStr: string) => {
    const target = new Date(`${targetDateStr}T00:00:00Z`).getTime();
    const today = new Date(`${todayStr}T00:00:00Z`).getTime();
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today!";
    if (diff === 1) return "Tomorrow";
    if (diff > 1) return `in ${diff} days`;
    return `${Math.abs(diff)} days ago`;
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Upcoming Festivals Live Countdown Hero Bar */}
      {upcomingFestivals.length > 0 && (
        <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent p-6 shadow-sm print:hidden">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Upcoming Major Observances ({selectedYear === "all" ? "2026–2027" : selectedYear})
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {upcomingFestivals.map((f) => (
              <div
                key={f.id}
                className="rounded-2xl border border-zinc-200/90 bg-white/90 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-purple-700 dark:text-purple-300">
                      {f.date}
                    </span>
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-200">
                      {getDaysRemaining(f.date)}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-50">
                    {f.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {f.nativeName}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-zinc-400">
                    {f.tithi}
                  </span>
                  <Link
                    href={`/${locale}/panchang?date=${f.date}`}
                    className="text-xs font-bold text-purple-600 hover:underline dark:text-purple-400"
                  >
                    Panchang →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Search & Filter Controls */}
      <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 print:hidden">
        {/* Search Bar, Year Switcher & Layout Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search festivals by name, Hindi/Gujarati script, month, or ritual..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-purple-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Year Switcher Pills */}
            <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-800/80 text-xs">
              <button
                onClick={() => setSelectedYear(2027)}
                className={`rounded-lg px-2.5 py-1 font-bold transition ${
                  selectedYear === 2027
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                }`}
              >
                2027
              </button>
              <button
                onClick={() => setSelectedYear(2026)}
                className={`rounded-lg px-2.5 py-1 font-bold transition ${
                  selectedYear === 2026
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                }`}
              >
                2026
              </button>
              <button
                onClick={() => setSelectedYear("all")}
                className={`rounded-lg px-2.5 py-1 font-bold transition ${
                  selectedYear === "all"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
                }`}
              >
                All
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-800/80">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid View"
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "grid"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("timeline")}
                aria-label="Timeline View"
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "timeline"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                }`}
              >
                <ListOrdered className="h-4 w-4" />
              </button>
            </div>

            {/* Print and Share buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrint}
                aria-label="Print Festivals Directory"
                title="Print Festivals"
                className="rounded-xl border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Printer className="h-4 w-4" />
              </button>
              <button
                onClick={handleShare}
                aria-label="Share Festival Directory"
                title="Copy Directory Link"
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 text-xs"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
                <span className="text-[11px] font-semibold">{copied ? "Copied" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800/80 text-xs">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`rounded-xl px-3 py-1.5 font-semibold transition ${
                activeCategory === tab.id
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Month Pills */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-zinc-100 pt-3 dark:border-zinc-800/80 text-xs">
          <span className="font-semibold text-zinc-400 text-[11px] mr-1">
            Month:
          </span>
          {MONTH_FILTERS.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelectedMonth(m.value)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                selectedMonth === m.value
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-50 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-400"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Current Filter Summary */}
      <div className="flex items-center justify-between text-xs text-zinc-500 font-medium">
        <span>
          Showing <strong>{filteredFestivals.length}</strong> festivals & observances in 2026
        </span>
        {(activeCategory !== "all" || selectedMonth !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setActiveCategory("all");
              setSelectedMonth("all");
              setSearchQuery("");
            }}
            className="text-purple-600 hover:underline dark:text-purple-400 font-semibold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid View Layout */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFestivals.map((f) => (
            <div
              key={f.id}
              className="flex flex-col justify-between rounded-3xl border border-zinc-200/90 bg-card p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-purple-500/15 px-2.5 py-0.5 text-[10px] font-bold text-purple-800 dark:text-purple-300">
                    {f.categoryLabel}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">
                    {f.dayOfWeek}
                  </span>
                </div>

                <h3 className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {f.name}
                </h3>
                <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                  {f.nativeName}
                </div>

                <div className="mt-3 flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-1.5 text-xs text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
                  <CalendarIcon className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{f.date}</span>
                  <span>•</span>
                  <span>{f.tithi}</span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {f.description}
                </p>

                {/* Rituals List */}
                <div className="mt-3 border-t border-zinc-100 pt-2.5 dark:border-zinc-800/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                    Key Observances & Rituals:
                  </span>
                  <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {f.rituals.map((r, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="mt-1 h-1 w-1 rounded-full bg-purple-500 shrink-0"></span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400 font-medium">
                  {f.lunarMonth}
                </span>
                <Link
                  href={`/${locale}/panchang?date=${f.date}`}
                  className="inline-flex items-center gap-1 rounded-xl bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-800 transition hover:bg-purple-100 hover:text-purple-800 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                >
                  <Compass className="h-3.5 w-3.5 text-purple-600" />
                  <span>View Day Panchang</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Timeline View Layout */
        <div className="relative border-l-2 border-purple-500/30 pl-6 ml-4 space-y-6">
          {filteredFestivals.map((f) => (
            <div key={f.id} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-purple-600 dark:border-zinc-900 ring-2 ring-purple-500/20"></div>

              <div className="rounded-2xl border border-zinc-200/90 bg-card p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                      {f.date} ({f.dayOfWeek})
                    </span>
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800 dark:bg-purple-900/60 dark:text-purple-200">
                      {f.categoryLabel}
                    </span>
                  </div>

                  <Link
                    href={`/${locale}/panchang?date=${f.date}`}
                    className="text-xs font-bold text-purple-600 hover:underline dark:text-purple-400 flex items-center gap-1"
                  >
                    <span>Full Panchang</span>
                    <span>→</span>
                  </Link>
                </div>

                <h3 className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-50">
                  {f.name} <span className="text-sm font-normal text-amber-700 dark:text-amber-400">({f.nativeName})</span>
                </h3>

                <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                  {f.description}
                </p>

                <div className="mt-2 text-[11px] text-zinc-500 font-medium">
                  Tithi: <strong className="text-zinc-700 dark:text-zinc-300">{f.tithi}</strong> • Month: <strong>{f.lunarMonth}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
