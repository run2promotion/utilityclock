import {
  HOLIDAY_COUNTRIES,
  daysUntil,
  getHolidaysByCountry,
  getNextHolidayOccurrence,
  type HolidayCountryId,
} from "@/data/holidays";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { hreflangAlternates } from "@/i18n/alternates";
import { getDictionary } from "@/i18n/dictionary";
import { buildPath } from "@/i18n/routing";
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
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {meta.label}
      </h2>
      <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
        {meta.short}
      </p>
      <ul className="mt-4 flex flex-1 flex-col gap-3 text-sm">
        {list.map((h) => {
          const next = getNextHolidayOccurrence(h, now);
          const left = daysUntil(now, next);
          const dateLabel = next.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
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
                <span className="min-w-0 font-medium text-zinc-800 dark:text-zinc-200">
                  <span className="block truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                    {h.name}
                  </span>
                  <span className="mt-0.5 block text-xs font-normal text-zinc-500">
                    {dateLabel}
                  </span>
                </span>
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
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {m.holidaysHub.title}
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          {m.holidaysHub.subtitle}
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {HOLIDAY_COUNTRIES.map((c) => (
          <CountryCard key={c.id} countryId={c.id} locale={locale} />
        ))}
      </div>
    </div>
  );
}
