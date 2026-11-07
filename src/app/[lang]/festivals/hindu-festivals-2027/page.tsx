import { FestivalsExperience } from "@/components/festivals/FestivalsExperience";
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
    path: "festivals/hindu-festivals-2027",
  });

  return {
    title:
      locale === "gu"
        ? "હિન્દુ તહેવારો 2027 · સંપૂર્ણ તારીખો, વ્રત અને ઉત્સવ કેલેન્ડર"
        : locale === "hi"
        ? "हिन्दू त्योहार 2027 · सम्पूर्ण तिथियाँ, व्रत और उत्सव कैलेंडर"
        : "Hindu Festivals 2027 · Complete Dates, Vrat & Observances Calendar",
    description:
      "Complete 2027 Hindu festival calendar with accurate dates, Tithi timings, fasting guidelines, and rituals for Maha Shivratri, Holi, Rama Navami, Janmashtami, Navratri, and Diwali.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: "Hindu Festivals 2027 · Complete Dates, Vrat & Observances Calendar",
      description:
        "Complete 2027 Hindu festival calendar with accurate dates, Tithi timings, fasting guidelines, and rituals for Maha Shivratri, Holi, Rama Navami, Janmashtami, Navratri, and Diwali.",
    },
  };
}

export default async function HinduFestivals2027Page({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Festivals", href: `/${locale}/festivals`, item: `${siteBase}/${locale}/festivals` },
    { name: "Hindu Festivals 2027", item: `${siteBase}/${locale}/festivals/hindu-festivals-2027` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Hindu Festivals 2027 (सनातन उत्सव व पर्व)",
    description: "Complete 2027 Hindu festival calendar with accurate dates, Tithi timings, fasting guidelines, and rituals.",
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
          <span>Sanatan Calendar 2027 · Sacred Utsav Directory</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
          Hindu Festivals 2027 · सम्पूर्ण हिन्दू त्योहार व व्रत
        </h1>

        <p className="max-w-4xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Explore all auspicious dates, lunisolar Tithis, and time-honored rituals for the 2027 Hindu
          festival calendar. From spring Holi celebrations to autumn Sharad Navratri and Diwali, find
          exact dates computed with classical astronomical algorithms.
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
            <span className="font-bold text-purple-700 dark:text-purple-400">March 6, 2027 (Friday)</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Maha Shivratri</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Phalguna Krishna Chaturdashi. The sacred celestial night of Lord Shiva and Devi Parvati&apos;s
              cosmic union. Fasting, Nishita Kaal Rudrabhishek, and four prahar pujas.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-bold text-purple-700 dark:text-purple-400">March 22–23, 2027</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Holika Dahan & Holi</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Phalguna Purnima and Chaitra Krishna Pratipada. Triumph of Bhakta Prahlada over Holika,
              followed by the joyous festival of vibrant herbal colors and spring songs.
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
            <span className="font-bold text-purple-700 dark:text-purple-400">August 17, 2027 (Tuesday)</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Raksha Bandhan</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Shravana Purnima. Sisters tie protective sacred threads (Rakhi) on brothers&apos; wrists;
              Brahmins observe sacred thread renewal (Upakarma / Yajñopavīta Snan).
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-bold text-purple-700 dark:text-purple-400">August 24, 2027 (Tuesday)</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Krishna Janmashtami</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Bhadrapada Krishna Ashtami in Rohini Nakshatra. Midnight celebration of Bhagavan Sri Krishna&apos;s
              birth in Mathura, with Makhan-Mishri Bhog and Dahi Handi.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-bold text-purple-700 dark:text-purple-400">October 29, 2027 (Friday)</span>
            <h3 className="mt-1 text-base font-black text-zinc-900 dark:text-zinc-50">Diwali (Deepavali)</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Kartika Amavasya. Festival of lights marking Lord Rama&apos;s return to Ayodhya and the worship
              of Maa Mahalakshmi and Lord Ganesha for prosperity, light, and spiritual bliss.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine currentEcosystem="festivals" />
    </div>
  );
}