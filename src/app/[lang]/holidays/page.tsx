import {
  HOLIDAY_COUNTRIES,
  HOLIDAY_SOURCE_DOCUMENTATION,
  daysUntil,
  getHolidaysByCountry,
  getNextHolidayOccurrence,
  type HolidayCountryId,
} from "@/data/holidays";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { hreflangAlternates } from "@/i18n/alternates";
import { getDictionary } from "@/i18n/dictionary";
import { buildPath } from "@/i18n/routing";
import { ShieldCheck } from "lucide-react";
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
  const alt = hreflangAlternates(siteBase, locale, { type: "holidays" });
  return {
    title: d.holidaysHub.title,
    description: d.holidaysHub.subtitle,
    alternates: {
      canonical: alt.canonical,
      languages: alt.languages,
    },
    openGraph: {
      title: d.holidaysHub.title,
      description: d.holidaysHub.subtitle,
    },
  };
}

function CountryCard({
  countryId,
  locale,
}: {
  countryId: HolidayCountryId;
  locale: AppLocale;
}) {
  const meta = HOLIDAY_COUNTRIES.find((c) => c.id === countryId)!;
  const list = getHolidaysByCountry(countryId);
  const now = new Date();

  return (
    <section className="flex flex-col rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {meta.label}
        </h2>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          {meta.short}
        </span>
      </div>
      <p className="mt-1 text-xs text-zinc-500">
        {list.length} tracked national observances
      </p>

      <ul className="mt-4 flex flex-1 flex-col gap-2.5 text-sm">
        {list.map((h) => {
          const next = getNextHolidayOccurrence(h, now);
          const left = daysUntil(now, next);
          const dateLabel = next.toLocaleDateString(locale, {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const kindLabel =
            h.kind === "fixed"
              ? "Fixed"
              : h.kind === "computed"
                ? "Rule-based"
                : "Calendar table";

          return (
            <li key={h.slug}>
              <Link
                href={buildPath(locale, {
                  type: "tool",
                  category: "timer",
                  canonicalSlug: h.slug,
                })}
                className="group flex items-start justify-between gap-3 rounded-xl border border-zinc-200/80 bg-zinc-50/80 px-3 py-2.5 transition hover:border-emerald-500/40 hover:bg-white dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-emerald-500/30 dark:hover:bg-zinc-900"
              >
                <div className="min-w-0">
                  <span className="block truncate font-medium text-zinc-800 group-hover:text-emerald-700 dark:text-zinc-200 dark:group-hover:text-emerald-400">
                    {h.name}
                  </span>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
                    <span>{dateLabel}</span>
                    <span>·</span>
                    <span className="text-[10px] text-zinc-400">{kindLabel}</span>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-600/15 px-2.5 py-1 text-xs font-semibold tabular-nums text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300">
                  {left === 0 ? "Today" : `${left}d left`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default async function HolidaysHubPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;
  const m = getDictionary(locale);

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
          {m.holidaysHub.title}
        </h1>
        <p className="max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
          {m.holidaysHub.subtitle}
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {HOLIDAY_COUNTRIES.map((c) => (
          <CountryCard key={c.id} countryId={c.id} locale={locale} />
        ))}
      </div>

      {/* Dataset Verification & Sources Information */}
      <footer className="rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-5 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 sm:p-6">
        <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-200">
          <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Official Public Data Sources & Verification</span>
        </div>
        <p className="mt-1 text-zinc-500">
          Last verified: <strong>{HOLIDAY_SOURCE_DOCUMENTATION.lastVerified}</strong>. Holiday dates
          and countdown algorithms use published governmental gazettes and standard astronomical
          calculations.
        </p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {Object.entries(HOLIDAY_SOURCE_DOCUMENTATION.sources).map(([code, src]) => (
            <li key={code} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
              <span className="font-semibold uppercase text-zinc-700 dark:text-zinc-300">
                {code}:
              </span>
              <span>{src}</span>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
