import { VratCalendarExperience } from "@/components/calendar/VratCalendarExperience";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { PURNIMA_2027_I18N } from "@/data/translations-2027";
import { hreflangAlternates } from "@/i18n/alternates";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { siteOrigin } from "@/lib/site-url";
import { Sun } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteBase = siteOrigin();

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isAppLocale(lang)) return {};
  const locale = lang as AppLocale;
  const alternates = hreflangAlternates(siteBase, locale, {
    type: "path",
    path: "calendar/purnima-2027",
  });
  const i18n = PURNIMA_2027_I18N[locale] ?? PURNIMA_2027_I18N.en;

  return {
    title: i18n.title,
    description: i18n.description,
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: i18n.title,
      description: i18n.description,
    },
  };
}

export default async function Purnima2027Page({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;
  const i18n = PURNIMA_2027_I18N[locale] ?? PURNIMA_2027_I18N.en;

  const crumbs: BreadcrumbItem[] = [
    { name: i18n.crumbs.home, href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: i18n.crumbs.parent, href: `/${locale}/calendar`, item: `${siteBase}/${locale}/calendar` },
    { name: i18n.crumbs.current, item: `${siteBase}/${locale}/calendar/purnima-2027` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: i18n.heading,
    description: i18n.description,
    url: `${siteBase}/${locale}/calendar/purnima-2027`,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      name: "UtilityClock",
      url: `${siteBase}/${locale}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        ...(crumb.item ? { item: crumb.item } : {}),
      })),
    },
  };

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs items={crumbs} />

      {/* Header */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
          <Sun className="h-4 w-4" />
          <span>{i18n.badge}</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
          {i18n.heading}
        </h1>

        <p className="max-w-4xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {i18n.intro}
        </p>
      </header>

      {/* Interactive Vrat Viewer (Defaulted to Purnima) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            2027 Purnima Dates & Astronomical Transitions
          </h2>
          <Link
            href={`/${locale}/calendar/hindu-calendar-2027`}
            className="text-xs font-bold text-amber-700 hover:underline dark:text-amber-400"
          >
            ← View Hindu Calendar 2027
          </Link>
        </div>

        <VratCalendarExperience initialType="purnima" year={2027} />
      </section>

      {/* Spiritual Significance & Satyanarayan Puja Guide */}
      <section className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Satyanarayan Vrat & Full Moon Observance Guide
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm">Satyanarayan Katha</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Performed during twilight (Godhuli or Pradosh Kaal) on Purnima. Devotees recite the five
              sacred chapters of the <em>Reva Khanda</em> from Skanda Purana and distribute Panchamrit and
              panjiri prasad to family and seekers.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm">Chandra Arghya</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              At moonrise, offering Arghya (water blended with unboiled milk, white akshat rice, and sandalwood)
              to Chandra Deva soothes mental restlessness, dispels anxiety, and brings planetary harmony
              according to Jyotish shastras.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm">Holy Confluence Snan</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Full moon bathing at sacred Sangams (Prayagraj, Haridwar, Kashi, Nashik) cleanses physical
              and subtle afflictions. Charity of umbrellas, food, clothes, and cows yields lasting punya.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine currentEcosystem="hindu-calendar" />
    </div>
  );
}
