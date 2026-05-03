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
  Settings,
  Watch,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/90 bg-white/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link
          href={buildPath(locale, { type: "home" })}
          className="font-semibold tracking-tight text-zinc-900 transition hover:text-emerald-600 dark:text-zinc-100 dark:hover:text-emerald-400"
        >
          Utility<span className="text-zinc-500">Clock</span>
        </Link>
        <nav
          className="flex flex-1 flex-wrap items-center justify-end gap-1 sm:gap-2"
          aria-label="Main"
        >
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
                <span className="hidden sm:inline">{label}</span>
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
            <span className="hidden sm:inline">{messages.nav.holidays}</span>
          </Link>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={openSettings}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 sm:px-3"
            aria-label={messages.nav.settings}
          >
            <Settings className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
            <span className="hidden sm:inline">{messages.nav.settings}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
