import { VratCalendarExperience } from "@/components/calendar/VratCalendarExperience";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { AMAVASYA_2027_I18N } from "@/data/translations-2027";
import { hreflangAlternates } from "@/i18n/alternates";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { siteOrigin } from "@/lib/site-url";
import { Moon } from "lucide-react";
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
    path: "calendar/amavasya-2027",
  });
  const i18n = AMAVASYA_2027_I18N[locale] ?? AMAVASYA_2027_I18N.en;

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

export default async function Amavasya2027Page({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;
  const i18n = AMAVASYA_2027_I18N[locale] ?? AMAVASYA_2027_I18N.en;

  const crumbs: BreadcrumbItem[] = [
    { name: i18n.crumbs.home, href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: i18n.crumbs.parent, href: `/${locale}/calendar`, item: `${siteBase}/${locale}/calendar` },
    { name: i18n.crumbs.current, item: `${siteBase}/${locale}/calendar/amavasya-2027` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: i18n.heading,
    description: i18n.description,
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
          <span>{i18n.badge}</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
          {i18n.heading}
        </h1>

        <p className="max-w-4xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {i18n.intro}
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

      {/* Pitru Tarpan & Ancestral Guidelines */}
      <section className="space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Pitru Tarpan & Amavasya Spiritual Guidelines
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">1. Tarpan Vidhi</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Facing South during Aparahna Kaal (afternoon), offer water blended with black sesame (til)
              and Kusha grass. This pacifies departed ancestors (Pitrus) and dissolves Pitru Dosha afflictions.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">2. Panchabali Charity</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Offer sanctified food portions (Gogras) to five sacred entities: cows (Go-bali), dogs (Shvan-bali),
              crows (Kaka-bali), ants (Kitadi-bali), and spiritual seekers or deities (Devadi-bali).
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <h3 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">3. Inauspicious Initiations</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Amavasya is an inward-focused lunar phase. Commercial venture launches, griha pravesh, weddings,
              and purchasing property are generally avoided, redirecting energy toward contemplation and ancestral gratitude.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine currentEcosystem="hindu-calendar" />
    </div>
  );
}
