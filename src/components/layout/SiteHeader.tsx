"use client";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useI18n } from "@/context/locale-context";
import { useSettings } from "@/context/settings-context";
import { buildPath, parseLocalizedPathname } from "@/i18n/routing";
import type { ToolCategoryId } from "@/data/tool-schema";
import {
  AlarmClock,
  CalendarDays,
  Globe2,
  Hourglass,
  Menu,
  Settings,
  Watch,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function categoryActive(
  pathname: string,
  category: ToolCategoryId,
): boolean {
  const p = parseLocalizedPathname(pathname);
  if (!p) return false;
  if (p.kind === "hub" && p.category === category) return true;
  if (p.kind === "tool" && p.category === category) return true;
  return false;
}

function holidaysActive(pathname: string): boolean {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  return parts.length >= 2 && parts[1] === "holidays";
}

export default function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const { openSettings } = useSettings();
  const { locale, messages } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = [
    {
      category: "alarm" as const,
      label: messages.nav.alarm,
      icon: AlarmClock,
    },
    {
      category: "timer" as const,
      label: messages.nav.timer,
      icon: Hourglass,
    },
    {
      category: "stopwatch" as const,
      label: messages.nav.stopwatch,
      icon: Watch,
    },
    {
      category: "world-clock" as const,
      label: messages.nav.worldClock,
      icon: Globe2,
    },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 border-b border-zinc-200/90 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          href={buildPath(locale, { type: "home" })}
          className="font-semibold tracking-tight text-zinc-900 transition hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400"
        >
          Utility<span className="text-zinc-500">Clock</span>
        </Link>
        <nav className="hidden flex-1 flex-wrap items-center justify-end gap-1 md:flex md:gap-2" aria-label="Main">
          {nav.map(({ category, label, icon: Icon }) => {
            const active = categoryActive(pathname, category);
            return (
              <Link
                key={category}
                href={buildPath(locale, { type: "hub", category })}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition sm:px-3 ${
                  active
                    ? "bg-zinc-200 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                <span>{label}</span>
              </Link>
            );
          })}
          <Link
            href={buildPath(locale, { type: "holidays" })}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition sm:px-3 ${
              holidaysActive(pathname)
                ? "bg-zinc-200 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            <CalendarDays className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
            <span>{messages.nav.holidays}</span>
          </Link>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={openSettings}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 sm:px-3"
            aria-label={messages.nav.settings}
          >
            <Settings className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
            <span>{messages.nav.settings}</span>
          </button>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={openSettings}
            className="inline-flex items-center rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
            aria-label={messages.nav.settings}
          >
            <Settings className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-zinc-200/90 px-4 py-3 dark:border-zinc-800/80 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1" aria-label="Mobile main">
            {nav.map(({ category, label, icon: Icon }) => {
              const active = categoryActive(pathname, category);
              return (
                <Link
                  key={category}
                  href={buildPath(locale, { type: "hub", category })}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-zinc-200 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  <span>{label}</span>
                </Link>
              );
            })}
            <Link
              href={buildPath(locale, { type: "holidays" })}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                holidaysActive(pathname)
                  ? "bg-zinc-200 text-emerald-700 dark:bg-zinc-800 dark:text-emerald-400"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
              }`}
            >
              <CalendarDays className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              <span>{messages.nav.holidays}</span>
            </Link>
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
