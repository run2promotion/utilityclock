import { VratCalendarExperience } from "@/components/calendar/VratCalendarExperience";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { hreflangAlternates } from "@/i18n/alternates";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { Sparkles } from "lucide-react";
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
  const alternates = hreflangAlternates(siteBase, locale, {
    type: "path",
    path: "calendar/ekadashi-2027",
  });

  return {
    title:
      locale === "gu"
        ? "એકાદશી 2027 તારીખો · તમામ 24 વ્રત કેલેન્ડર અને પારણા સમય"
        : locale === "hi"
        ? "एकादशी 2027 तिथियाँ · सम्पूर्ण 24 व्रत कैलेंडर एवं पारणा समय"
        : "Ekadashi 2027 Dates · Complete 24 Vrat Calendar & Parana Timings",
    description:
      "All 24 Ekadashi dates in 2027 with exact fast dates, morning Parana timing windows, Shukla/Krishna Paksha details, presiding deities, and fasting rules.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: "Ekadashi 2027 Dates · Complete 24 Vrat Calendar & Parana Timings",
      description:
        "All 24 Ekadashi dates in 2027 with exact fast dates, morning Parana timing windows, Shukla/Krishna Paksha details, presiding deities, and fasting rules.",
    },
  };
}

export default async function Ekadashi2027Page({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Calendar", href: `/${locale}/calendar`, item: `${siteBase}/${locale}/calendar` },
    { name: "Ekadashi 2027", item: `${siteBase}/${locale}/calendar/ekadashi-2027` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: "Ekadashi 2027 Dates Calendar & Parana Timings",
    description: "All 24 Ekadashi fasting dates in 2027 with exact morning Parana timing windows, deity worship, and spiritual significance.",
    url: `${siteBase}/${locale}/calendar/ekadashi-2027`,
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
          <Sparkles className="h-4 w-4" />
          <span>Vedic Fasting Directory 2027 · 24 Sacred Ekadashis</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
          Ekadashi 2027 Dates · 24 Vrat Calendar & Parana Timings
        </h1>

        <p className="max-w-4xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Ekadashi (the 11th lunar day of each fortnight) is revered as the supreme fasting day in Sanatan
          tradition, dedicated to Lord Vishnu and Sri Krishna. Because 2027 contains no intercalary month
          (Adhika Masa), exactly 24 sacred Ekadashis occur this year. Find verified fasting dates and
          accurate morning Parana windows calculated in Indian Standard Time (IST).
        </p>
      </header>

      {/* Interactive Vrat Viewer (Defaulted to Ekadashi) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            2027 Ekadashi Fasting Directory & Search
          </h2>
          <Link
            href={`/${locale}/calendar/hindu-calendar-2027`}
            className="text-xs font-bold text-amber-700 hover:underline dark:text-amber-400"
          >
            ← View Hindu Calendar 2027
          </Link>
        </div>

        <VratCalendarExperience initialType="ekadashi" year={2027} />
      </section>

      {/* Scriptural Fasting Guidelines */}
      <section className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Classical Ekadashi Fasting & Parana Guidelines
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm">1. Fasting Types</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Devotees choose between <strong>Nirjala</strong> (complete waterless fast),
              <strong> Sajala</strong> (water and fresh juices only), or <strong>Phalahari</strong> (milk,
              fruits, sabudana, and sendha namak rock salt). Grains, pulses, rice, onions, and garlic are
              strictly prohibited.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm">2. Parana Timing Rules</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Fasting must be broken during the <strong>Parana window</strong> on the following Dwadashi
              morning after sunrise. Parana must strictly avoid <em>Hari Vasara</em> (the first quarter of
              Dwadashi Tithi) and must be completed before Dwadashi Tithi ends.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            <h3 className="font-bold text-amber-800 dark:text-amber-300 text-sm">3. Spiritual Fruit</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              As described in the <em>Padma Purana</em> and <em>Brahma Vaivarta Purana</em>, observing Ekadashi
              bestows spiritual liberation, cleanses deep-seated karmas, stabilizes the mind and senses, and
              awakens unalloyed devotion to Lord Narayana.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine currentEcosystem="hindu-calendar" />
    </div>
  );
}