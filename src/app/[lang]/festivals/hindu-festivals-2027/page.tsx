import { FestivalsExperience } from "@/components/festivals/FestivalsExperience";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { HINDU_FESTIVALS_2027_I18N } from "@/data/translations-2027";
import { hreflangAlternates } from "@/i18n/alternates";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { siteOrigin } from "@/lib/site-url";
import { Sparkles } from "lucide-react";
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
    path: "festivals/hindu-festivals-2027",
  });
  const i18n = HINDU_FESTIVALS_2027_I18N[locale] ?? HINDU_FESTIVALS_2027_I18N.en;

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

export default async function HinduFestivals2027Page({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;
  const i18n = HINDU_FESTIVALS_2027_I18N[locale] ?? HINDU_FESTIVALS_2027_I18N.en;

  const crumbs: BreadcrumbItem[] = [
    { name: i18n.crumbs.home, href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: i18n.crumbs.parent, href: `/${locale}/festivals`, item: `${siteBase}/${locale}/festivals` },
    { name: i18n.crumbs.current, item: `${siteBase}/${locale}/festivals/hindu-festivals-2027` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: i18n.heading,
    description: i18n.description,
    url: `${siteBase}/${locale}/festivals/hindu-festivals-2027`,
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
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-bold text-purple-800 dark:text-purple-300">
          <Sparkles className="h-4 w-4" />
          <span>{i18n.badge}</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
          {i18n.heading}
        </h1>

        <p className="max-w-4xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {i18n.intro}
        </p>
      </header>

      {/* Interactive Festival Engine (Defaulted to 2027 & Hindu category) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            2027 Festival Directory, Search & Countdown
          </h2>
          <Link
            href={`/${locale}/festivals`}
            className="text-xs font-bold text-purple-700 hover:underline dark:text-purple-400"
          >
            ← View All Festival Hubs
          </Link>
        </div>

        <FestivalsExperience initialYear={2027} initialCategory="hindu" />
      </section>

      {/* Major Festive Highlights Guide */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Chronology of Major 2027 Sanatan Celebrations
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Key milestone dates and religious significance of prime Hindu festivals in 2027.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-bold text-purple-700 dark:text-purple-400">January 15, 2027 (Friday)</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Makar Sankranti (Punya Kaal)</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Solar ingress occurs on Jan 14 at 21:05 IST; scriptural Punya Kaal bathing, charity,
              and public holiday are observed on Friday, Jan 15 morning.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-bold text-purple-700 dark:text-purple-400">March 6, 2027 (Saturday)</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Maha Shivratri</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Phalguna Krishna Chaturdashi. Sacred celestial night of Lord Shiva and Devi Parvati&apos;s
              cosmic union. Fasting, Nishita Kaal Rudrabhishek, and four prahar pujas.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-bold text-purple-700 dark:text-purple-400">March 21–22, 2027</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Holika Dahan & Holi</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Holika Dahan bonfire lit on Sunday night, March 21 during Pradosh Kaal. Joyful Dhulandi
              color celebration follows on Monday, March 22.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-bold text-purple-700 dark:text-purple-400">April 7–15, 2027</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Chaitra Navratri & Rama Navami</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Chaitra Shukla Pratipada (Gudi Padwa / Ugadi / VS 2084 start) through Chaitra Shukla Navami
              celebrating the divine appearance of Maryada Purushottam Lord Sri Rama.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-bold text-purple-700 dark:text-purple-400">April 20, 2027 (Tuesday)</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Hanuman Jayanti</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Chaitra Purnima Udaya Tithi. Appearance day of Lord Hanuman; recitation of Hanuman Chalisa
              and Sundarkand across shrines nationwide.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-bold text-purple-700 dark:text-purple-400">August 24–25, 2027</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Krishna Janmashtami</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Smartha fast on Tuesday, Aug 24 (Nishita Kaal Ashtami). Vaishnava, ISKCON, and pan-Indian public
              holiday observed on Wednesday, Aug 25 (Udaya Ashtami) with Dahi Handi.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-bold text-purple-700 dark:text-purple-400">October 9–10, 2027</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Dussehra & Durga Visarjan</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Ravana Dahan observed on Saturday, Oct 9 in North India (Aparahna Kaal). Bengal Durga Visarjan
              and South Indian Vidyarambham observed on Sunday, Oct 10 morning (Udaya Dashami).
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-bold text-purple-700 dark:text-purple-400">October 29, 2027 (Friday)</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Diwali (Deepavali)</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Kartika Amavasya. Festival of lights marking Lord Rama&apos;s return to Ayodhya and the worship
              of Maa Mahalakshmi and Lord Ganesha in Pradosh Kaal for prosperity and peace.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine currentEcosystem="festivals" />
    </div>
  );
}
