"use client";

import { useI18n } from "@/context/locale-context";
import {
  AMAVASYA_2027,
  EKADASHI_2027,
  PURNIMA_2027,
} from "@/data/vrats-2027";
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  Moon,
  Printer,
  Search,
  Share2,
  Sparkles,
  Sun,
} from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

export type VratType = "ekadashi" | "purnima" | "amavasya" | "all";

export interface VratCalendarExperienceProps {
  initialType?: VratType;
  year?: number;
  showTypeSwitcher?: boolean;
}

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

export function VratCalendarExperience({
  initialType = "all",
  year = 2027,
  showTypeSwitcher = true,
}: VratCalendarExperienceProps) {
  const { locale } = useI18n();
  const [activeType, setActiveType] = useState<VratType>(initialType);
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Filter Ekadashis
  const filteredEkadashis = useMemo(() => {
    let list = EKADASHI_2027;
    if (selectedMonth !== "all") {
      list = list.filter((e) => e.date.slice(5, 7) === selectedMonth);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.nativeName.toLowerCase().includes(q) ||
          e.month.toLowerCase().includes(q) ||
          e.significance.toLowerCase().includes(q) ||
          e.deity.toLowerCase().includes(q) ||
          e.date.includes(q),
      );
    }
    return list;
  }, [selectedMonth, searchQuery]);

  // Filter Purnimas
  const filteredPurnimas = useMemo(() => {
    let list = PURNIMA_2027;
    if (selectedMonth !== "all") {
      list = list.filter((p) => p.date.slice(5, 7) === selectedMonth);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nativeName.toLowerCase().includes(q) ||
          p.month.toLowerCase().includes(q) ||
          p.significance.toLowerCase().includes(q) ||
          p.observance.toLowerCase().includes(q) ||
          p.date.includes(q),
      );
    }
    return list;
  }, [selectedMonth, searchQuery]);

  // Filter Amavasyas
  const filteredAmavasyas = useMemo(() => {
    let list = AMAVASYA_2027;
    if (selectedMonth !== "all") {
      list = list.filter((a) => a.date.slice(5, 7) === selectedMonth);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.nativeName.toLowerCase().includes(q) ||
          a.month.toLowerCase().includes(q) ||
          a.significance.toLowerCase().includes(q) ||
          a.observance.toLowerCase().includes(q) ||
          a.date.includes(q),
      );
    }
    return list;
  }, [selectedMonth, searchQuery]);

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
    <div className="w-full space-y-6">
      {/* Controls & Search Bar */}
      <div className="space-y-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder={`Search ${year} observances by name, deity, or month...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-amber-400"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Type Switcher */}
            {showTypeSwitcher && (
              <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-800/80 text-xs">
                <button
                  onClick={() => setActiveType("all")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    activeType === "all"
                      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  All ({EKADASHI_2027.length + PURNIMA_2027.length + AMAVASYA_2027.length})
                </button>
                <button
                  onClick={() => setActiveType("ekadashi")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    activeType === "ekadashi"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  Ekadashi (24)
                </button>
                <button
                  onClick={() => setActiveType("purnima")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    activeType === "purnima"
                      ? "bg-amber-500 text-zinc-900 font-bold shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  Purnima (12)
                </button>
                <button
                  onClick={() => setActiveType("amavasya")}
                  className={`rounded-lg px-2.5 py-1 font-semibold transition ${
                    activeType === "amavasya"
                      ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400"
                  }`}
                >
                  Amavasya (13)
                </button>
              </div>
            )}

            {/* Print and Share buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrint}
                aria-label="Print Observances Directory"
                title="Print Observances"
                className="rounded-xl border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                <Printer className="h-4 w-4" />
              </button>
              <button
                onClick={handleShare}
                aria-label="Share Observances Link"
                title="Copy Link"
                className="inline-flex items-center gap-1 rounded-xl border border-zinc-200 px-2.5 py-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 text-xs"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
                <span className="text-[11px] font-semibold">{copied ? "Copied" : "Share"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Month Pills */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-zinc-100 pt-3 dark:border-zinc-800/80 text-xs">
          <span className="font-semibold text-zinc-400 text-[11px] mr-1">Filter Month:</span>
          {MONTH_FILTERS.map((m) => (
            <button
              key={m.value}
              onClick={() => setSelectedMonth(m.value)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                selectedMonth === m.value
                  ? "bg-amber-600 text-white dark:bg-amber-500"
                  : "bg-zinc-50 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:text-zinc-400"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ekadashi Section */}
      {(activeType === "all" || activeType === "ekadashi") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-600" />
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                Ekadashi Vrat Dates {year} ({filteredEkadashis.length})
              </h2>
            </div>
            <span className="text-xs text-zinc-500">Fast & Parana Timings (IST)</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEkadashis.map((e) => (
              <div
                key={e.id}
                className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
                      {e.paksha} Paksha
                    </span>
                    <span className="text-zinc-500 font-medium">{e.month}</span>
                  </div>

                  <h3 className="mt-3 text-lg font-black text-zinc-900 dark:text-zinc-50">
                    {e.name}
                  </h3>
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {e.nativeName}
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5 text-amber-600" />
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {e.date} ({e.dayOfWeek})
                      </span>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">Parana: </span>
                        <span>{e.paranaTime}</span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {e.significance}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">Deity: {e.deity}</span>
                  <Link
                    href={`/${locale}/panchang?date=${e.date}`}
                    className="font-bold text-amber-700 hover:underline dark:text-amber-400"
                  >
                    View Panchang →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Purnima Section */}
      {(activeType === "all" || activeType === "purnima") && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-amber-500" />
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                Purnima Dates {year} ({filteredPurnimas.length})
              </h2>
            </div>
            <span className="text-xs text-zinc-500">Satyanarayan Puja & Full Moon</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPurnimas.map((p) => (
              <div
                key={p.id}
                className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-amber-400/20 px-2.5 py-0.5 font-bold text-amber-900 dark:text-amber-200">
                      Full Moon
                    </span>
                    <span className="text-zinc-500 font-medium">{p.month}</span>
                  </div>

                  <h3 className="mt-3 text-lg font-black text-zinc-900 dark:text-zinc-50">
                    {p.name}
                  </h3>
                  <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                    {p.nativeName}
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5 text-amber-500" />
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {p.date} ({p.dayOfWeek})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                      <span>Exact Transition: {p.exactTransitionTime}</span>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-amber-50/60 p-2.5 text-xs text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
                    <span className="font-semibold">Ritual: </span>
                    {p.observance}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {p.significance}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end text-xs">
                  <Link
                    href={`/${locale}/panchang?date=${p.date}`}
                    className="font-bold text-amber-700 hover:underline dark:text-amber-400"
                  >
                    View Panchang →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Amavasya Section */}
      {(activeType === "all" || activeType === "amavasya") && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50">
                Amavasya Dates {year} ({filteredAmavasyas.length})
              </h2>
            </div>
            <span className="text-xs text-zinc-500">Pitru Tarpan & New Moon</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAmavasyas.map((a) => (
              <div
                key={a.id}
                className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-indigo-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 font-bold text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300">
                      New Moon
                    </span>
                    <span className="text-zinc-500 font-medium">{a.month}</span>
                  </div>

                  <h3 className="mt-3 text-lg font-black text-zinc-900 dark:text-zinc-50">
                    {a.name}
                  </h3>
                  <div className="text-xs font-semibold text-indigo-700 dark:text-indigo-400">
                    {a.nativeName}
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {a.date} ({a.dayOfWeek})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Exact Transition: {a.exactTransitionTime}</span>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-indigo-50/60 p-2.5 text-xs text-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200">
                    <span className="font-semibold">Ritual: </span>
                    {a.observance}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {a.significance}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end text-xs">
                  <Link
                    href={`/${locale}/panchang?date=${a.date}`}
                    className="font-bold text-indigo-700 hover:underline dark:text-indigo-400"
                  >
                    View Panchang →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}