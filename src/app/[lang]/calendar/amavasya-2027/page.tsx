import { VratCalendarExperience } from "@/components/calendar/VratCalendarExperience";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { hreflangAlternates } from "@/i18n/alternates";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { Moon } from "lucide-react";
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
    path: "calendar/amavasya-2027",
  });

  return {
    title:
      locale === "gu"
        ? "અમાવસ્યા 2027 તારીખો · 13 અમાસ કેલેન્ડર અને પિતૃતર્પણ"
        : locale === "hi"
        ? "अमावस्या 2027 तिथियाँ · सम्पूर्ण 13 नवीन चन्द्र कैलेंडर एवं पितृ तर्पण"
        : "Amavasya 2027 Dates · 13 New Moon Calendar & Pitru Tarpan",
    description:
      "All 13 Amavasya (New Moon) dates in 2027 with exact transition timings, Somvati Amavasya, Mauni Amavasya, Sarva Pitru Shradh, and Diwali Lakshmi Pujan.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: "Amavasya 2027 Dates · 13 New Moon Calendar & Pitru Tarpan",
      description:
        "All 13 Amavasya (New Moon) dates in 2027 with exact transition timings, Somvati Amavasya, Mauni Amavasya, Sarva Pitru Shradh, and Diwali Lakshmi Pujan.",
    },
  };
}

export default async function Amavasya2027Page({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Calendar", href: `/${locale}/calendar`, item: `${siteBase}/${locale}/calendar` },
    { name: "Amavasya 2027", item: `${siteBase}/${locale}/calendar/amavasya-2027` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: "Amavasya 2027 Dates (New Moon Calendar)",
    description: "All 13 Amavasya new moon dates in 2027 with exact IST transition times, Pitru Tarpan guidelines, and religious significance.",
    url: `${siteBase}/${locale}/calendar/amavasya-2027`,
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
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-800 dark:text-indigo-300">
          <Moon className="h-4 w-4" />
          <span>Lunisolar New Moon Directory 2027 · Pitru Shradh & Tarpan</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
          Amavasya 2027 Dates · 13 New Moon Calendar (अमावस्या)
        </h1>

        <p className="max-w-4xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Amavasya (the new moon day / 30th lunar day) marks the conclusion of the Krishna Paksha fortnight
          and is sacred for ancestral offerings (Pitru Tarpan, Shradh, and Pinda Daan). Due to the
          29.53-day synodic lunar cycle, 2027 contains <strong>13 Amavasyas</strong>, commencing with
          Pausha Amavasya on Jan 8 and concluding with a second Pausha Amavasya on Dec 28.
        </p>
      </header>

      {/* Key Amavasya Highlights Grid */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-indigo-500/20 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">Total New Moons</span>
          <span className="text-base font-black text-indigo-700 dark:text-indigo-400 mt-1 block">13 Amavasyas</span>
          <span className="text-zinc-500 mt-1 block">Two Pausha Amavasyas fall in the single 2027 solar year</span>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">Supreme Amavasya</span>
          <span className="text-base font-black text-amber-700 dark:text-amber-400 mt-1 block">Mauni Amavasya</span>
          <span className="text-zinc-500 mt-1 block">February 6, 2027 · Silent contemplation & Sangam Snan</span>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">Somvati Occurrences</span>
          <span className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-1 block">2 Somvati Days</span>
          <span className="text-zinc-500 mt-1 block">March 8 (Phalguna) and August 2 (Hariyali Amavasya)</span>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">Ancestral Culmination</span>
          <span className="text-base font-black text-purple-700 dark:text-purple-400 mt-1 block">Mahalaya Shradh</span>
          <span className="text-zinc-500 mt-1 block">September 29, 2027 · Sarva Pitru Amavasya offerings</span>
        </div>
      </section>

      {/* Interactive Vrat Viewer (Defaulted to Amavasya) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            2027 Amavasya Dates & Exact Transition Timings
          </h2>
          <Link
            href={`/${locale}/calendar/hindu-calendar-2027`}
            className="text-xs font-bold text-indigo-700 hover:underline dark:text-indigo-400"
          >
            ← View Hindu Calendar 2027
          </Link>
        </div>

        <VratCalendarExperience initialType="amavasya" year={2027} />
      </section>

      {/* Pitru Tarpan & Shradh Guidelines */}
      <section className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Ancestral Rites, Pitru Tarpan & Somvati Amavasya Rules
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">Pitru Tarpan & Kutup Muhurat</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Ancestral oblations with water, black sesame seeds (til), and sacred Kusha grass should be
              offered during Kutup and Rohina Muhurats (around midday). Tarpan alleviates Pitru Dosha and
              ensures familial peace and longevity.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">Somvati Amavasya Vrat</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              When Amavasya coincides with a Monday, it becomes <strong>Somvati Amavasya</strong>. Married
              women perform 108 circumambulations (Parikrama) around the sacred Peepal tree, offering raw milk
              and sacred threads for spousal longevity and household prosperity.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">Diwali & Deepdaan</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Kartika Amavasya (October 29, 2027) is the darkest night of the year, transformed into the
              festival of light through Deepdaan (clay lamps) and grand Lakshmi-Ganesha Pujan, welcoming
              auspiciousness, wealth, and inner enlightenment.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine currentEcosystem="hindu-calendar" />
    </div>
  );
}