"use client";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { GlobalSearchModal } from "@/components/navigation/GlobalSearchModal";
import { NicheSecondaryNav } from "@/components/navigation/NicheSecondaryNav";
import { useI18n } from "@/context/locale-context";
import { useSettings } from "@/context/settings-context";
import type { AppLocale } from "@/i18n/config";
import { buildPath } from "@/i18n/routing";
import {
  Calendar,
  Flame,
  Heart,
  Home,
  LayoutGrid,
  Menu,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type GlobalNavItem = {
  id: string;
  label: Record<AppLocale, string>;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  matchPrefixes: string[];
};

const GLOBAL_NAV_ITEMS: GlobalNavItem[] = [
  {
    id: "home",
    label: {
      en: "Home",
      de: "Start",
      fr: "Accueil",
      ja: "ホーム",
      es: "Inicio",
      pt: "Início",
      ar: "الرئيسية",
      hi: "होम",
      gu: "હોમ",
    },
    href: "",
    icon: Home,
    matchPrefixes: ["/"],
  },
  {
    id: "calendar",
    label: {
      en: "Calendar",
      de: "Kalender",
      fr: "Calendrier",
      ja: "カレンダー",
      es: "Calendario",
      pt: "Calendário",
      ar: "التقويم",
      hi: "कैलेंडर",
      gu: "કેલેન્ડર",
    },
    href: "/calendar",
    icon: Calendar,
    matchPrefixes: ["/calendar", "/hindu-calendar", "/gujarati-calendar", "/date-calendar"],
  },
  {
    id: "panchang",
    label: {
      en: "Panchang",
      de: "Panchang",
      fr: "Panchang",
      ja: "パンチャング",
      es: "Panchang",
      pt: "Panchang",
      ar: "بانتشانغ",
      hi: "पंचांग",
      gu: "પંચાંગ",
    },
    href: "/panchang",
    icon: Sun,
    badge: "Live",
    matchPrefixes: ["/panchang"],
  },
  {
    id: "festivals",
    label: {
      en: "Festivals",
      de: "Feste",
      fr: "Festivals",
      ja: "祭り",
      es: "Festivales",
      pt: "Festivais",
      ar: "المهرجانات",
      hi: "त्योहार",
      gu: "તહેવારો",
    },
    href: "/festivals",
    icon: Flame,
    matchPrefixes: ["/festivals", "/holidays"],
  },
  {
    id: "devotional",
    label: {
      en: "Devotional",
      de: "Andacht",
      fr: "Dévotion",
      ja: "信仰",
      es: "Devocional",
      pt: "Devocional",
      ar: "الروحانيات",
      hi: "भक्ति",
      gu: "ભક્તિ",
    },
    href: "/devotional",
    icon: Sparkles,
    matchPrefixes: ["/devotional"],
  },
  {
    id: "astrology",
    label: {
      en: "Astrology",
      de: "Astrologie",
      fr: "Astrologie",
      ja: "占星術",
      es: "Astrología",
      pt: "Astrologia",
      ar: "التنجيم",
      hi: "ज्योतिष",
      gu: "જ્યોતિષ",
    },
    href: "/astrology",
    icon: Moon,
    matchPrefixes: ["/astrology"],
  },
  {
    id: "love-tools",
    label: {
      en: "Love Tools",
      de: "Liebestools",
      fr: "Amour",
      ja: "恋愛診断",
      es: "Amor",
      pt: "Amor",
      ar: "أدوات الحب",
      hi: "लव टूल्स",
      gu: "લવ ટુલ્સ",
    },
    href: "/love-tools",
    icon: Heart,
    matchPrefixes: ["/love-tools"],
  },
  {
    id: "general-tools",
    label: {
      en: "General Tools",
      de: "Werkzeuge",
      fr: "Outils",
      ja: "一般ツール",
      es: "Herramientas",
      pt: "Ferramentas",
      ar: "الأدوات العامة",
      hi: "सामान्य टूल्स",
      gu: "સામાન્ય ટુલ્સ",
    },
    href: "/timer",
    icon: LayoutGrid,
    matchPrefixes: [
      "/alarm",
      "/timer",
      "/stopwatch",
      "/world-clock",
      "/calculators",
      "/productivity",
      "/converters",
      "/finance",
      "/text",
    ],
  },
];

export default function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const { openSettings } = useSettings();
  const { locale, messages } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Clean route without locale for active tab highlighting
  const cleanRoute = (() => {
    const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    return parts.length > 1 ? `/${parts.slice(1).join("/")}` : "/";
  })();

  const isItemActive = (item: GlobalNavItem) => {
    if (item.id === "home") {
      return cleanRoute === "/" || cleanRoute === "";
    }
    return item.matchPrefixes.some((prefix) => cleanRoute.startsWith(prefix));
  };

  return (
    <>
      <header
        id="site-header"
        className="sticky top-0 z-40 border-b border-zinc-200/90 bg-white/95 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/95"
      >
        {/* Main Global Top Bar */}
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-8">
          {/* Logo */}
          <Link
            href={buildPath(locale, { type: "home" })}
            className="flex items-center gap-1.5 font-bold tracking-tight text-zinc-900 transition hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400 shrink-0"
          >
            <span className="text-lg">Utility<span className="text-emerald-600 dark:text-emerald-400">Clock</span></span>
          </Link>

          {/* Desktop & Tablet Global Ecosystem Navigation */}
          <nav
            className="hidden flex-1 items-center justify-center gap-1 xl:flex"
            aria-label="Global Ecosystems"
          >
            {GLOBAL_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item);
              const label = item.label[locale] ?? item.label.en;
              return (
                <Link
                  key={item.id}
                  href={`/${locale}${item.href}`}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold transition lg:px-2.5 lg:py-1.5 ${
                    active
                      ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden />
                  <span>{label}</span>
                  {item.badge && (
                    <span className="ml-0.5 rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-bold text-emerald-700 dark:text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right utility actions: Search, Language, Settings, Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Trigger Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200/90 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800/80"
              aria-label="Search all tools and features"
            >
              <Search className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden rounded bg-zinc-200/60 px-1 py-0.2 text-[10px] text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 lg:inline-block">
                ⌘K
              </kbd>
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Settings Button */}
            <button
              type="button"
              onClick={openSettings}
              className="inline-flex items-center rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
              aria-label={messages.nav.settings}
            >
              <Settings className="h-4 w-4" aria-hidden />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 xl:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Drawer */}
        {mobileOpen && (
          <div className="border-t border-zinc-200/90 bg-white px-4 py-3 dark:border-zinc-800/80 dark:bg-zinc-950 xl:hidden">
            <nav className="mx-auto flex max-w-6xl flex-col gap-1" aria-label="Mobile main">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="mb-2 flex w-full items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
              >
                <Search className="h-4 w-4 text-zinc-400" />
                <span>Search tools, panchang, festivals...</span>
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                {GLOBAL_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item);
                  const label = item.label[locale] ?? item.label.en;
                  return (
                    <Link
                      key={item.id}
                      href={`/${locale}${item.href}`}
                      className={`inline-flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold transition ${
                        active
                          ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                          : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>
        )}

        {/* Niche-Specific Contextual Secondary Navigation Bar */}
        <NicheSecondaryNav />
      </header>

      {/* Global Interactive Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
