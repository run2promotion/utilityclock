import { BigDigitalClock } from "@/components/clock/BigDigitalClock";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { hreflangAlternates } from "@/i18n/alternates";
import { getDictionary } from "@/i18n/dictionary";
import { buildPath } from "@/i18n/routing";
import { getLocalizedCategoryMeta } from "@/i18n/category-overrides";
import {
  AlarmClock,
  ArrowRightLeft,
  Calculator,
  Calendar,
  CheckCircle2,
  FileText,
  Globe2,
  Hourglass,
  Landmark,
  ShieldCheck,
  Sparkles,
  Watch,
  WifiOff,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteBase =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://utilityclock.com";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isAppLocale(lang)) return {};
  const locale = lang as AppLocale;
  const d = getDictionary(locale);
  const alt = hreflangAlternates(siteBase, locale, { type: "home" });
  return {
    title: d.meta.homeTitle,
    description: d.meta.homeDescription,
    alternates: {
      canonical: alt.canonical,
      languages: alt.languages,
    },
    openGraph: {
      title: d.meta.homeTitle,
      description: d.meta.homeDescription,
    },
  };
}

export default async function LangHomePage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;
  const m = getDictionary(locale);

  const categories = [
    {
      id: "alarm" as const,
      icon: AlarmClock,
      title: getLocalizedCategoryMeta(locale, "alarm").label,
      desc: "Reliable browser alarms with recurring options, multiple schedules, and Web Audio API synthesizer fallbacks.",
      href: buildPath(locale, { type: "hub", category: "alarm" }),
    },
    {
      id: "timer" as const,
      icon: Hourglass,
      title: getLocalizedCategoryMeta(locale, "timer").label,
      desc: "Custom and preset countdowns with visual progress rings, fullscreen mode, and audible notifications.",
      href: buildPath(locale, { type: "hub", category: "timer" }),
    },
    {
      id: "stopwatch" as const,
      icon: Watch,
      title: getLocalizedCategoryMeta(locale, "stopwatch").label,
      desc: "Precision millisecond stopwatch tracking with split times, fastest/slowest lap highlighting, and lap export.",
      href: buildPath(locale, { type: "hub", category: "stopwatch" }),
    },
    {
      id: "world-clock" as const,
      icon: Globe2,
      title: getLocalizedCategoryMeta(locale, "world-clock").label,
      desc: "Live local times across global cities with automatic Daylight Saving Time handling and multi-city overlap planner.",
      href: buildPath(locale, { type: "hub", category: "world-clock" }),
    },
    {
      id: "date-calendar" as const,
      icon: Calendar,
      title: getLocalizedCategoryMeta(locale, "date-calendar").label,
      desc: "Exact biological age calculator, working business days counter, date differences, and leap year checks.",
      href: buildPath(locale, { type: "hub", category: "date-calendar" }),
    },
    {
      id: "calculators" as const,
      icon: Calculator,
      title: getLocalizedCategoryMeta(locale, "calculators").label,
      desc: "Instant percentage calculators, metric-imperial scientific unit converter, and keyboard-accessible basic calculator.",
      href: buildPath(locale, { type: "hub", category: "calculators" }),
    },
    {
      id: "productivity" as const,
      icon: Sparkles,
      title: getLocalizedCategoryMeta(locale, "productivity").label,
      desc: "Ultradian sleep cycle planner, Pomodoro focus sprints, customizable interval HIIT timers, and event countdowns.",
      href: buildPath(locale, { type: "hub", category: "productivity" }),
    },
    {
      id: "converters" as const,
      icon: ArrowRightLeft,
      title: getLocalizedCategoryMeta(locale, "converters").label,
      desc: "Scientific unit conversions across area, volume, pressure, energy, power, fuel economy, and cooking measurements.",
      href: buildPath(locale, { type: "hub", category: "converters" }),
    },
    {
      id: "finance" as const,
      icon: Landmark,
      title: getLocalizedCategoryMeta(locale, "finance").label,
      desc: "Financial loan EMI calculator, compound growth modeling, GST/VAT invoices, profit margins, and savings goals.",
      href: buildPath(locale, { type: "hub", category: "finance" }),
    },
    {
      id: "text" as const,
      icon: FileText,
      title: getLocalizedCategoryMeta(locale, "text").label,
      desc: "Client-side text tools: word & character counting, case conversions, duplicate line removal, and diff comparison.",
      href: buildPath(locale, { type: "hub", category: "text" }),
    },
  ];

  const quickTools = [
    {
      title: "Age Calculator",
      category: "date-calendar" as const,
      slug: "age-calculator",
    },
    {
      title: "Pomodoro Focus Timer",
      category: "productivity" as const,
      slug: "pomodoro-timer",
    },
    {
      title: "Percentage Calculator",
      category: "calculators" as const,
      slug: "percentage-calculator",
    },
    {
      title: "Sleep Cycle Calculator",
      category: "productivity" as const,
      slug: "sleep-cycle-calculator",
    },
    {
      title: "Business Days Calculator",
      category: "date-calendar" as const,
      slug: "business-days-calculator",
    },
    {
      title: "10-Minute Timer",
      category: "timer" as const,
      slug: "10-minute-timer",
    },
    {
      title: "Unit Converter",
      category: "calculators" as const,
      slug: "unit-converter",
    },
    {
      title: "Lap Stopwatch",
      category: "stopwatch" as const,
      slug: "lap-stopwatch",
    },
    {
      title: "Loan EMI Calculator",
      category: "finance" as const,
      slug: "loan-emi-calculator",
    },
    {
      title: "Word Counter",
      category: "text" as const,
      slug: "word-counter",
    },
    {
      title: "Area Converter",
      category: "converters" as const,
      slug: "area-converter",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Introduction */}
      <section className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
          <Zap className="h-3.5 w-3.5" />
          <span>Fast, Privacy-First Browser Utilities</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          {m.home.title}
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {m.home.subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2 sm:justify-start">
          <Link
            href={buildPath(locale, { type: "hub", category: "alarm" })}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500"
          >
            {m.home.ctaAlarm}
          </Link>
          <Link
            href={buildPath(locale, { type: "hub", category: "timer" })}
            className="rounded-xl border border-zinc-300 bg-white/60 px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {m.home.ctaTimers}
          </Link>
          <Link
            href={buildPath(locale, { type: "hub", category: "productivity" })}
            className="rounded-xl border border-zinc-300 bg-white/60 px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            Productivity Suite
          </Link>
        </div>
      </section>

      {/* Main Interactive Digital Clock */}
      <BigDigitalClock />

      {/* Primary Tool Categories */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            Utility Suites & Categories
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Select a suite to open full-featured online calculators, timers, and timing utilities.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white/70 p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
              >
                <div>
                  <div className="inline-flex rounded-xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-zinc-900 transition group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Explore tools</span>
                  <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Shortcuts */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Popular Utility Tools & Shortcuts
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {quickTools.map((t) => (
            <Link
              key={t.slug}
              href={buildPath(locale, {
                type: "tool",
                category: t.category,
                canonicalSlug: t.slug,
              })}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-medium text-zinc-800 transition hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-emerald-500/40 dark:hover:text-emerald-400"
            >
              <span>{t.title}</span>
              <span className="text-zinc-400">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Privacy, Offline & Performance Architecture Commitments */}
      <section className="rounded-3xl border border-zinc-200 bg-zinc-50/80 p-8 dark:border-zinc-800 dark:bg-zinc-900/30 sm:p-10">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
          Engineered for Accuracy, Privacy & Offline Utility
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          UtilityClock is built from the ground up without third-party tracking, heavy analytics scripts, or
          remote calculation servers. Everything computes locally on your device.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">100% Client-Side Privacy</h3>
            </div>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Your alarm times, dates of birth, stopwatch laps, and calculator inputs never leave your
              device. No accounts, cookies, or remote logging.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <WifiOff className="h-5 w-5" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Offline PWA Capable</h3>
            </div>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Equipped with a modern Progressive Web App Service Worker that precaches core tools and audio
              chimes so you can keep working even when disconnected.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">Microsecond Native Precision</h3>
            </div>
            <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Timers rely on high-resolution <code className="text-emerald-600 dark:text-emerald-400">performance.now()</code> and Web Audio synthesis rather than drifted interval loops.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
