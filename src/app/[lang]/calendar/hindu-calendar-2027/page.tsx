import { HinduCalendarExperience } from "@/components/calendar/HinduCalendarExperience";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { hreflangAlternates } from "@/i18n/alternates";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { Calendar, Moon, Sparkles, Sun } from "lucide-react";
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
    path: "calendar/hindu-calendar-2027",
  });

  return {
    title:
      locale === "gu"
        ? "હિન્દુ કેલેન્ડર 2027 · વિક્રમ સંવત 2083–2084, તિથિ, વ્રત અને પર્વ"
        : locale === "hi"
        ? "हिन्दू कैलेंडर 2027 · विक्रम संवत 2083–2084, तिथि, व्रत और त्योहार"
        : "Hindu Calendar 2027 · Vikram Samvat 2083–2084, Tithi, Vrat & Festivals",
    description:
      "Comprehensive 2027 Hindu lunisolar calendar with Vikram Samvat 2083–2084, 12 lunar months, Ekadashi fasts, Purnima, Amavasya, and major Sanatan festival dates.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: "Hindu Calendar 2027 · Vikram Samvat 2083–2084, Tithi, Vrat & Festivals",
      description:
        "Comprehensive 2027 Hindu lunisolar calendar with Vikram Samvat 2083–2084, 12 lunar months, Ekadashi fasts, Purnima, Amavasya, and major Sanatan festival dates.",
    },
  };
}

export default async function HinduCalendar2027Page({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Calendar", href: `/${locale}/calendar`, item: `${siteBase}/${locale}/calendar` },
    { name: "Hindu Calendar 2027", item: `${siteBase}/${locale}/calendar/hindu-calendar-2027` },
  ];

  const months2027 = [
    { sanskrit: "Pausha – Magha (पौष – माघ)", gregorian: "January 2027", season: "Shishira (Winter)", events: "Makar Sankranti (Jan 14), Pausha Putrada Ekadashi (Jan 18), Pausha Purnima (Jan 22)" },
    { sanskrit: "Magha – Phalguna (माघ – फाल्गुन)", gregorian: "February 2027", season: "Shishira (Winter)", events: "Mauni Amavasya (Feb 6), Vasant Panchami (Feb 11), Jaya Ekadashi (Feb 16), Magha Purnima (Feb 21)" },
    { sanskrit: "Phalguna – Chaitra (फाल्गुन – चैत्र)", gregorian: "March 2027", season: "Vasanta (Spring)", events: "Maha Shivratri (Mar 6), Vijaya Ekadashi (Mar 4), Holika Dahan (Mar 22), Holi (Mar 23)" },
    { sanskrit: "Chaitra (चैत्र)", gregorian: "April 2027", season: "Vasanta (Spring)", events: "VS 2084 begins (Apr 7), Chaitra Navratri (Apr 7–15), Rama Navami (Apr 15), Hanuman Jayanti (Apr 21)" },
    { sanskrit: "Vaishakha (वैशाख)", gregorian: "May 2027", season: "Grishma (Summer)", events: "Akshaya Tritiya (May 9), Mohini Ekadashi (May 16), Buddha Purnima (May 20)" },
    { sanskrit: "Jyeshtha (ज्येष्ठ)", gregorian: "June 2027", season: "Grishma (Summer)", events: "Ganga Dussehra (Jun 14), Nirjala Ekadashi (Jun 15), Vat Purnima (Jun 18)" },
    { sanskrit: "Ashadha (आषाढ़)", gregorian: "July 2027", season: "Varsha (Monsoon)", events: "Jagannath Ratha Yatra (Jul 5), Devshayani Ekadashi (Jul 15 - Chaturmas begins), Guru Purnima (Jul 18)" },
    { sanskrit: "Shravana (श्रावण)", gregorian: "August 2027", season: "Varsha (Monsoon)", events: "Shravan Somwar Vrats, Nag Panchami (Aug 7), Shravana Putrada Ekadashi (Aug 13), Raksha Bandhan (Aug 17), Krishna Janmashtami (Aug 24)" },
    { sanskrit: "Bhadrapada (भाद्रपद)", gregorian: "September 2027", season: "Sharad (Autumn)", events: "Ganesh Chaturthi (Sep 4), Anant Chaturdashi (Sep 14), Pitru Paksha begins (Sep 15), Sarva Pitru Amavasya (Sep 29)" },
    { sanskrit: "Ashvina (आश्विन)", gregorian: "October 2027", season: "Sharad (Autumn)", events: "Sharad Navratri begins (Sep 30), Durga Ashtami (Oct 8), Dussehra (Oct 10), Sharad Purnima (Oct 15), Karwa Chauth (Oct 18)" },
    { sanskrit: "Kartika (कार्तिक)", gregorian: "November 2027", season: "Hemanta (Pre-winter)", events: "Dhanteras (Oct 27), Diwali (Oct 29), Govardhan Puja & Bestu Varas (Oct 30), Tulsi Vivah (Nov 10), Dev Diwali (Nov 13)" },
    { sanskrit: "Margashirsha – Pausha (मार्गशीर्ष – पौष)", gregorian: "December 2027", season: "Hemanta (Pre-winter)", events: "Mokshada Ekadashi & Gita Jayanti (Dec 9), Dattatreya Jayanti (Dec 13), Saphala Ekadashi (Dec 24)" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: "Hindu Calendar 2027 (Vikram Samvat 2083–2084)",
    description: "Comprehensive 2027 Hindu lunisolar calendar with Vikram Samvat 2083–2084, 12 lunar months, Ekadashi fasts, Purnima, Amavasya, and major Sanatan festival dates.",
    url: `${siteBase}/${locale}/calendar/hindu-calendar-2027`,
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

      {/* Hero Header */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
          <Calendar className="h-4 w-4" />
          <span>Sanatan Lunisolar Panchang · Complete 2027 CE Guide</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
          Hindu Calendar 2027 · Vikram Samvat 2083–2084
        </h1>

        <p className="max-w-4xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Welcome to the authoritative 2027 Hindu Calendar, computed using classical Indian lunisolar
          astronomy and topocentric sunrise principles. Discover precise daily Tithis, Nakshatras,
          the 24 sacred Ekadashi fasts, Purnima, Amavasya, and complete festival schedules.
        </p>
      </header>

      {/* Key Era Transition Badges */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">North Indian Samvat</span>
          <span className="text-base font-black text-amber-700 dark:text-amber-400 mt-1 block">VS 2083 → VS 2084</span>
          <span className="text-zinc-500 mt-1 block">Advances on Chaitra Shukla Pratipada (April 7, 2027)</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">Gujarati Kartikadi</span>
          <span className="text-base font-black text-orange-700 dark:text-orange-400 mt-1 block">VS 2083 → VS 2084</span>
          <span className="text-zinc-500 mt-1 block">Advances on Bestu Varas (October 30, 2027)</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">Adhika Masa Status</span>
          <span className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-1 block">No Adhika Masa (Nija)</span>
          <span className="text-zinc-500 mt-1 block">Standard 12-lunar-month cycle; all 12 Solar Sankrantis occur</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">Shaka Samvat</span>
          <span className="text-base font-black text-indigo-700 dark:text-indigo-400 mt-1 block">Saka 1948 → 1949</span>
          <span className="text-zinc-500 mt-1 block">National Saka year 1949 commences March 22, 2027</span>
        </div>
      </section>

      {/* Main Interactive Hindu Calendar Grid Component (Defaulted to 2027) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            Interactive 2027 Monthly Panchang & Tithi Grid
          </h2>
          <Link
            href={`/${locale}/calendar/hindu-calendar`}
            className="text-xs font-bold text-amber-700 hover:underline dark:text-amber-400"
          >
            ← Switch to 2026 Calendar
          </Link>
        </div>

        <HinduCalendarExperience initialYear={2027} initialMonth={0} />
      </section>

      {/* 2027 Month-by-Month Guide */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            2027 Hindu Calendar Month-by-Month Overview
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Chronological guide through the 12 sacred lunar months of 2027 CE and their prominent observances.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {months2027.map((m, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-700 dark:text-amber-400">{m.gregorian}</span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {m.season}
                </span>
              </div>

              <h3 className="mt-2 text-base font-black text-zinc-900 dark:text-zinc-50">
                {m.sanskrit}
              </h3>

              <div className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">Key Observances: </span>
                {m.events}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fasting & Sacred Observances Summary Table */}
      <section className="space-y-6 rounded-3xl border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            2027 Key Religious Observances & Hubs
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Explore dedicated hubs for specific spiritual austerities and lunisolar observances in 2027.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href={`/${locale}/calendar/ekadashi-2027`}
            className="group rounded-2xl border border-amber-500/20 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">24 Vrat Days</span>
              <Sparkles className="h-4 w-4 text-amber-500" />
            </div>
            <h3 className="mt-2 text-lg font-black text-zinc-900 group-hover:text-amber-700 dark:text-zinc-50 dark:group-hover:text-amber-400">
              Ekadashi 2027 Dates →
            </h3>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
              Complete list of all 24 Ekadashi fasting dates with exact Parana timings and Vrat Kathas.
            </p>
          </Link>

          <Link
            href={`/${locale}/calendar/purnima-2027`}
            className="group rounded-2xl border border-amber-500/20 bg-white p-5 shadow-sm transition hover:border-amber-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-600 dark:text-amber-300 text-sm">12 Full Moons</span>
              <Sun className="h-4 w-4 text-amber-500" />
            </div>
            <h3 className="mt-2 text-lg font-black text-zinc-900 group-hover:text-amber-600 dark:text-zinc-50 dark:group-hover:text-amber-400">
              Purnima 2027 Dates →
            </h3>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
              Full moon transitions, Satyanarayan Puja schedule, Guru Purnima, and Sharad Purnima timings.
            </p>
          </Link>

          <Link
            href={`/${locale}/calendar/amavasya-2027`}
            className="group rounded-2xl border border-indigo-500/20 bg-white p-5 shadow-sm transition hover:border-indigo-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-700 dark:text-indigo-400 text-sm">13 New Moons</span>
              <Moon className="h-4 w-4 text-indigo-500" />
            </div>
            <h3 className="mt-2 text-lg font-black text-zinc-900 group-hover:text-indigo-700 dark:text-zinc-50 dark:group-hover:text-indigo-400">
              Amavasya 2027 Dates →
            </h3>
            <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
              Ancestral Shradh, Pitru Tarpan, Mauni Amavasya, Somvati Amavasya, and Diwali Lakshmi Puja.
            </p>
          </Link>
        </div>
      </section>

      {/* FAQ Deep Dive Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Frequently Asked Questions About Hindu Calendar 2027
        </h2>

        <div className="divide-y divide-zinc-200 rounded-3xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 text-sm">
          <div className="p-5">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
              When does Vikram Samvat 2084 begin in 2027?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              In the classical North Indian (Chaitradi) tradition, Vikram Samvat 2084 commences on
              <strong> April 7, 2027</strong> at sunrise with Chaitra Shukla Pratipada. In the Gujarati
              (Kartikadi) tradition, Vikram Samvat 2084 begins on <strong>October 30, 2027</strong> on
              Bestu Varas (Kartak Sud Ekam), the dawn immediately following Diwali.
            </p>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
              Is there an Adhika Masa (intercalary month) in 2027?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              No. Unlike 2026 (which featured Adhika Jyeshtha), the calendar year 2027 contains no Adhika
              Masa. Exactly one solar ingress (Sankranti) occurs within every Amanta lunar month throughout
              the year, making 2027 a regular 12-lunar-month (Nija) cycle.
            </p>
          </div>

          <div className="p-5">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
              When are the major Hindu festivals in 2027?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Major festival dates for 2027 include: Makar Sankranti on Jan 14, Maha Shivratri on Mar 6,
              Holi on Mar 23, Rama Navami on Apr 15, Raksha Bandhan on Aug 17, Krishna Janmashtami on Aug 24,
              Ganesh Chaturthi on Sep 4, Dussehra on Oct 10, and Diwali on Oct 29.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine currentEcosystem="hindu-calendar" />
    </div>
  );
}