import { BigDigitalClock } from "@/components/clock/BigDigitalClock";
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

  const highlights = [
    {
      href: buildPath(locale, {
        type: "tool",
        category: "alarm",
        canonicalSlug: "alarm-for-7-00-am",
      }),
      label: m.home.preset7am,
    },
    {
      href: buildPath(locale, {
        type: "tool",
        category: "timer",
        canonicalSlug: "10-minute-timer",
      }),
      label: m.home.preset10m,
    },
    {
      href: buildPath(locale, {
        type: "tool",
        category: "world-clock",
        canonicalSlug: "london-time",
      }),
      label: m.home.presetLondon,
    },
  ];

  return (
    <div className="space-y-12">
      <section className="space-y-4 text-center sm:text-left">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          {m.home.title}
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          {m.home.subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
          <Link
            href={buildPath(locale, { type: "hub", category: "alarm" })}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            {m.home.ctaAlarm}
          </Link>
          <Link
            href={buildPath(locale, { type: "hub", category: "timer" })}
            className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            {m.home.ctaTimers}
          </Link>
        </div>
      </section>

      <BigDigitalClock />

      <section className="space-y-3">
        <h2 className="text-sm font-medium uppercase tracking-wider text-zinc-500">
          {m.home.presetsTitle}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {highlights.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-block rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-emerald-700 hover:border-zinc-300 hover:text-emerald-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-emerald-400/90 dark:hover:border-zinc-700 dark:hover:text-emerald-300"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
