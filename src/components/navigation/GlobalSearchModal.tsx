"use client";

import { useI18n } from "@/context/locale-context";
import {
  Calendar,
  Compass,
  FileText,
  Flame,
  Heart,
  Hourglass,
  Landmark,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";

export type SearchEntry = {
  id: string;
  title: string;
  category: string;
  href: string;
  keywords: string[];
  icon: React.ComponentType<{ className?: string }>;
};

// Global searchable directory across all UtilityClock ecosystems
const SEARCH_DIRECTORY: SearchEntry[] = [
  // Clocks & Timers
  { id: "alarm", title: "Online Alarm Clock", category: "Timing", href: "/alarm", keywords: ["alarm", "wake", "bell", "chime"], icon: Hourglass },
  { id: "timer", title: "Countdown Timer", category: "Timing", href: "/timer", keywords: ["timer", "countdown", "interval", "seconds"], icon: Hourglass },
  { id: "stopwatch", title: "Online Stopwatch", category: "Timing", href: "/stopwatch", keywords: ["stopwatch", "lap", "split", "milliseconds"], icon: Hourglass },
  { id: "world-clock", title: "World Clock Hub", category: "Timing", href: "/world-clock", keywords: ["world clock", "time zones", "cities", "utc", "gmt"], icon: Compass },
  { id: "10-minute-timer", title: "10-Minute Timer", category: "Timing", href: "/timer/10-minute-timer", keywords: ["10 min", "break", "tea"], icon: Hourglass },
  { id: "pomodoro-timer", title: "Pomodoro Focus Timer", category: "Productivity", href: "/productivity", keywords: ["pomodoro", "study", "25 minutes", "focus"], icon: Sparkles },
  { id: "sleep-cycle", title: "Sleep Cycle Calculator", category: "Productivity", href: "/productivity", keywords: ["sleep", "bedtime", "wake up", "circadian"], icon: Moon },

  // Calculators & Converters
  { id: "percentage", title: "Percentage Calculator", category: "Calculators", href: "/calculators/percentage-calculator", keywords: ["percent", "ratio", "discount", "increase"], icon: Zap },
  { id: "age-calc", title: "Age Calculator", category: "Date & Calendar", href: "/date-calendar/age-calculator", keywords: ["age", "birthday", "years", "months", "days"], icon: Calendar },
  { id: "business-days", title: "Business Days Calculator", category: "Date & Calendar", href: "/date-calendar/business-days-calculator", keywords: ["working days", "holidays", "business days", "net"], icon: Calendar },
  { id: "loan-emi", title: "Loan EMI Calculator", category: "Finance", href: "/finance/loan-emi-calculator", keywords: ["loan", "emi", "mortgage", "interest", "bank"], icon: Landmark },
  { id: "compound-interest", title: "Compound Interest Calculator", category: "Finance", href: "/finance/compound-interest-calculator", keywords: ["compound", "investment", "future value", "wealth"], icon: Landmark },
  { id: "gst-calc", title: "GST Calculator", category: "Finance", href: "/finance/gst-calculator", keywords: ["gst", "tax", "cgst", "sgst", "invoice"], icon: Landmark },
  { id: "vat-calc", title: "VAT Calculator", category: "Finance", href: "/finance/vat-calculator", keywords: ["vat", "tax", "value added tax", "sales tax"], icon: Landmark },
  { id: "area-conv", title: "Area Converter", category: "Converters", href: "/converters/area-converter", keywords: ["area", "sqm", "sqft", "acres", "hectares"], icon: Zap },
  { id: "volume-conv", title: "Volume Converter", category: "Converters", href: "/converters/volume-converter", keywords: ["volume", "liters", "gallons", "cups", "milliliters"], icon: Zap },
  { id: "data-storage", title: "Data Storage Converter", category: "Converters", href: "/converters/data-storage-converter", keywords: ["data", "gigabytes", "megabytes", "gib", "bytes"], icon: Zap },

  // Content & Text
  { id: "word-counter", title: "Online Word Counter", category: "Text Tools", href: "/text/word-counter", keywords: ["word count", "characters", "sentences", "reading time"], icon: FileText },
  { id: "char-counter", title: "Character Counter", category: "Text Tools", href: "/text/character-counter", keywords: ["characters", "twitter limit", "seo meta", "sms"], icon: FileText },
  { id: "case-converter", title: "Case Converter", category: "Text Tools", href: "/text/case-converter", keywords: ["uppercase", "lowercase", "title case", "camelcase"], icon: FileText },
  { id: "diff-checker", title: "Text Diff Checker", category: "Text Tools", href: "/text/text-diff-checker", keywords: ["diff", "compare text", "differences", "versions"], icon: FileText },

  // Calendar Hub & Panchang
  { id: "calendar-hub", title: "Calendar Discovery Hub (Indian & Regional Calendars)", category: "Calendar", href: "/calendar", keywords: ["calendar", "hindu", "gujarati", "regional calendar", "panchang", "vikram samvat", "shaka"], icon: Calendar },
  { id: "hindu-calendar", title: "Hindu Calendar 2026", category: "Hindu Calendar", href: "/calendar/hindu-calendar", keywords: ["hindu calendar", "vikram samvat", "panchang", "tithi", "vrat"], icon: Calendar },
  { id: "gujarati-calendar", title: "Gujarati Calendar (ગુજરાતી પંચાંગ)", category: "Gujarati Calendar", href: "/calendar/gujarati-calendar", keywords: ["gujarati", "samvat", "choghadiya", "bestu varas"], icon: Sun },
  { id: "today-panchang", title: "Today's Vedic Panchang", category: "Panchang", href: "/panchang", keywords: ["panchang", "today panchang", "tithi", "nakshatra", "yoga", "karana"], icon: Sun },
  { id: "rahu-kaal", title: "Rahu Kaal & Inauspicious Muhurat", category: "Panchang", href: "/panchang#rahu-kaal", keywords: ["rahu kaal", "yamaganda", "inauspicious", "muhurat"], icon: Moon },
  { id: "choghadiya", title: "Choghadiya (Day & Night)", category: "Panchang", href: "/panchang#choghadiya", keywords: ["choghadiya", "shubh", "labh", "amrit", "kaal"], icon: Sun },

  // Festivals
  { id: "all-festivals", title: "Festivals & Holidays Hub", category: "Festivals", href: "/festivals", keywords: ["festivals", "holidays", "diwali", "holi", "navratri", "eid", "christmas"], icon: Flame },
  { id: "diwali", title: "Diwali & Lakshmi Puja Muhurat", category: "Festivals", href: "/festivals#diwali", keywords: ["diwali", "deepavali", "lakshmi puja", "amavasya"], icon: Flame },
  { id: "holi", title: "Holi & Holika Dahan", category: "Festivals", href: "/festivals#holi", keywords: ["holi", "colors", "holika", "phalguna"], icon: Flame },
  { id: "navratri", title: "Navratri & Durga Puja Dates", category: "Festivals", href: "/festivals#navratri", keywords: ["navratri", "durga puja", "garba", "dussehra"], icon: Flame },

  // Devotional
  { id: "devotional-hub", title: "Devotional & Spiritual Library", category: "Devotional", href: "/devotional", keywords: ["aarti", "chalisa", "mantra", "stotra", "puja vidhi"], icon: Sparkles },
  { id: "hanuman-chalisa", title: "Shri Hanuman Chalisa", category: "Devotional", href: "/devotional#hanuman-chalisa", keywords: ["hanuman", "chalisa", "sankat mochan", "bajrangbali"], icon: Sparkles },
  { id: "lakshmi-aarti", title: "Lakshmi Aarti (Om Jai Lakshmi Mata)", category: "Devotional", href: "/devotional#lakshmi-aarti", keywords: ["lakshmi aarti", "om jai lakshmi mata", "diwali aarti"], icon: Sparkles },
  { id: "gayatri-mantra", title: "Gayatri Mantra", category: "Devotional", href: "/devotional#gayatri-mantra", keywords: ["gayatri mantra", "vedic chant", "rigveda", "surya"], icon: Sparkles },

  // Astrology & Kundali
  { id: "astrology-hub", title: "Vedic Astrology & Kundali", category: "Astrology", href: "/astrology", keywords: ["kundali", "birth chart", "horoscope", "rashifal", "zodiac"], icon: Moon },
  { id: "guna-milan", title: "36 Guna Milan (Kundali Matching)", category: "Astrology", href: "/astrology#guna-milan", keywords: ["guna milan", "kundali matching", "marriage compatibility", "ashta koota"], icon: Moon },
  { id: "manglik-dosha", title: "Manglik Dosha Analysis", category: "Astrology", href: "/astrology#manglik-dosha", keywords: ["manglik dosha", "mangal", "mars", "kuja dosha"], icon: Moon },

  // Love Tools
  { id: "love-tools-hub", title: "Love Calculator & Relationship Tools", category: "Love Tools", href: "/love-tools", keywords: ["love calculator", "flames", "zodiac compatibility", "crush match"], icon: Heart },
  { id: "flames-game", title: "FLAMES Relationship Game", category: "Love Tools", href: "/love-tools#flames", keywords: ["flames", "friends", "lovers", "marriage", "enemies"], icon: Heart },
  { id: "zodiac-love", title: "Zodiac Love Compatibility", category: "Love Tools", href: "/love-tools#zodiac-compatibility", keywords: ["zodiac love", "star signs match", "horoscope compatibility"], icon: Heart },
];

export function GlobalSearchModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { locale } = useI18n();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputId = useId();

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle global Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filtered results
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SEARCH_DIRECTORY.slice(0, 10);

    return SEARCH_DIRECTORY.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchCat || matchKeywords;
    }).slice(0, 12);
  }, [query]);

  // Keyboard navigation inside list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault();
      window.location.href = `/${locale}${filtered[selectedIndex].href}`;
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search all tools and features"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-16 backdrop-blur-sm sm:pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-zinc-200 pb-3 dark:border-zinc-800">
          <Search className="h-5 w-5 text-zinc-400" />
          <input
            ref={inputRef}
            id={searchInputId}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search clocks, panchang, festivals, calculators, aartis..."
            className="w-full bg-transparent px-3 text-sm font-medium text-zinc-900 placeholder-zinc-400 focus:outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 sm:inline-block">
              ESC
            </kbd>
          )}
        </div>

        {/* Search Results List */}
        <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-500">
              No results found for &quot;{query}&quot;. Try searching for <em>alarm</em>, <em>panchang</em>, <em>diwali</em>, or <em>loan</em>.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <Link
                  key={item.id}
                  href={`/${locale}${item.href}`}
                  onClick={onClose}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs transition-colors ${
                    isSelected
                      ? "bg-emerald-500/10 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400" />
                    <span className="font-semibold truncate">{item.title}</span>
                  </div>
                  <span className="shrink-0 text-[10px] font-medium text-zinc-400 uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                </Link>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-2 text-[11px] text-zinc-400 dark:border-zinc-800">
          <span>Navigate with <kbd className="font-semibold">↑</kbd> <kbd className="font-semibold">↓</kbd></span>
          <span>Select with <kbd className="font-semibold">↵ Enter</kbd></span>
        </div>
      </div>
    </div>
  );
}
