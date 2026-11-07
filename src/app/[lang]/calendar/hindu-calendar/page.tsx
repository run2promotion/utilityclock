import { HinduCalendarExperience } from "@/components/calendar/HinduCalendarExperience";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { hreflangAlternates } from "@/i18n/alternates";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { siteOrigin } from "@/lib/site-url";
import { Calendar, Compass, Moon, Sparkles, Sun } from "lucide-react";
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
    path: "calendar/hindu-calendar",
  });

  return {
    title:
      locale === "gu"
        ? "હિન્દુ કેલેન્ડર 2026 · વિક્રમ સંવત 2082–2083, તિથિ, વ્રત અને પર્વ"
        : locale === "hi"
        ? "हिन्दू कैलेंडर 2026 · विक्रम संवत 2082–2083, तिथि, व्रत और त्योहार"
        : "Hindu Calendar 2026 · Vikram Samvat, Tithi, Vrat & Festivals",
    description:
      "Authentic Hindu lunisolar calendar with Vikram Samvat 2082–2083, monthly Tithi grids, Ekadashi, Pradosh, Purnima, Amavasya, and major festival dates.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: "Hindu Calendar 2026 · Vikram Samvat, Tithi, Vrat & Festivals",
      description:
        "Authentic Hindu lunisolar calendar with Vikram Samvat 2082–2083, monthly Tithi grids, Ekadashi, Pradosh, Purnima, Amavasya, and major festival dates.",
    },
  };
}

export default async function HinduCalendarPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Calendar", href: `/${locale}/calendar`, item: `${siteBase}/${locale}/calendar` },
    { name: "Hindu Calendar", item: `${siteBase}/${locale}/calendar/hindu-calendar` },
  ];

  const months = [
    { sanskrit: "Chaitra (चैत्र)", gregorian: "March – April", season: "Vasanta (Spring)", tithiEvents: "Gudi Padwa, Rama Navami, Chaitra Navratri" },
    { sanskrit: "Vaishakha (वैशाख)", gregorian: "April – May", season: "Vasanta (Spring)", tithiEvents: "Akshaya Tritiya, Buddha Purnima, Parashurama Jayanti" },
    { sanskrit: "Jyeshtha (ज्येष्ठ)", gregorian: "May – June", season: "Grishma (Summer)", tithiEvents: "Ganga Dussehra, Vat Savitri Vrat, Nirjala Ekadashi" },
    { sanskrit: "Ashadha (आषाढ़)", gregorian: "June – July", season: "Grishma (Summer)", tithiEvents: "Jagannath Ratha Yatra, Devshayani Ekadashi, Guru Purnima" },
    { sanskrit: "Shravana (श्रावण)", gregorian: "July – August", season: "Varsha (Monsoon)", tithiEvents: "Shravan Somwar Vrats, Nag Panchami, Raksha Bandhan" },
    { sanskrit: "Bhadrapada (भाद्रपद)", gregorian: "August – September", season: "Varsha (Monsoon)", tithiEvents: "Krishna Janmashtami, Ganesh Chaturthi, Anant Chaturdashi" },
    { sanskrit: "Ashvina (आश्विन)", gregorian: "September – October", season: "Sharad (Autumn)", tithiEvents: "Sharad Navratri, Durga Puja, Dussehra, Sharad Purnima" },
    { sanskrit: "Kartika (कार्तिक)", gregorian: "October – November", season: "Sharad (Autumn)", tithiEvents: "Karwa Chauth, Dhanteras, Diwali, Govardhan Puja, Tulsi Vivah" },
    { sanskrit: "Margashirsha (मार्गशीर्ष)", gregorian: "November – December", season: "Hemanta (Pre-winter)", tithiEvents: "Mokshada Ekadashi, Gita Jayanti, Dattatreya Jayanti" },
    { sanskrit: "Pausha (पौष)", gregorian: "December – January", season: "Hemanta (Pre-winter)", tithiEvents: "Pausha Putrada Ekadashi, Makar Sankranti (Solar)" },
    { sanskrit: "Magha (माघ)", gregorian: "January – February", season: "Shishira (Winter)", tithiEvents: "Vasant Panchami, Ratha Saptami, Maha Shivratri preparations" },
    { sanskrit: "Phalguna (फाल्गुन)", gregorian: "February – March", season: "Shishira (Winter)", tithiEvents: "Maha Shivratri, Holika Dahan, Holi (Dhulandi)" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: "Hindu Calendar 2026 (Vikram Samvat 2082–2083)",
    description: "Authentic Hindu lunisolar calendar with Vikram Samvat 2082–2083, monthly Tithi grids, Ekadashi, Pradosh, Purnima, Amavasya, and major festival dates.",
    url: `${siteBase}/${locale}/calendar/hindu-calendar`,
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
      <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            Vikram Samvat 2082–2083
          </span>
          <span className="text-xs text-zinc-500">Shaka Samvat 1948</span>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Hindu Calendar 2026
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          The traditional Hindu lunisolar calendar synchronizes solar cycles (Sauramana) and lunar months (Chandramana).
          Explore the complete 12 lunar months, Shukla and Krishna Paksha divisions, Ekadashi Vrats, Pradosh timings,
          and festival dates calculated according to classical astronomical principles.
        </p>

        {/* Quick Jump Buttons */}
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
          <Link
            href={`/${locale}/calendar/hindu-calendar-2027`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-white shadow-sm transition hover:bg-amber-700 font-bold"
          >
            <Calendar className="h-4 w-4" />
            <span>Explore Hindu Calendar 2027 (VS 2083–2084) →</span>
          </Link>
          <Link
            href={`/${locale}/panchang`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Today&apos;s Live Panchang</span>
          </Link>
          <Link
            href={`/${locale}/festivals#hindu`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Hindu Festivals 2026</span>
          </Link>
          <Link
            href={`/${locale}/calendar/gujarati-calendar`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Compass className="h-4 w-4 text-orange-500" />
            <span>Gujarati Calendar</span>
          </Link>
          <Link
            href={`/${locale}/calendar`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Calendar className="h-4 w-4 text-indigo-500" />
            <span>All Regional Calendars</span>
          </Link>
        </div>
      </div>

      {/* Interactive Hindu Calendar Monthly Explorer */}
      <section id="interactive-hindu-calendar" className="space-y-4">
        <HinduCalendarExperience />
      </section>

      {/* Regional Samvat & Separated Shaka Eras Reference */}
      <section className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Compass className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          Astronomical Eras & Distinct Calendar Conventions (2026)
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">
              North Indian Vikram Samvat (Chaitradi)
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block text-sm">
              VS 2083
            </span>
            <span className="text-zinc-500 mt-1 block leading-snug">
              Transitioned from VS 2082 on March 19, 2026 (Chaitra Shukla Pratipada). Purnimanta lunar month convention applies.
            </span>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="font-bold text-orange-700 dark:text-orange-400 block mb-1">
              Gujarati Vikram Samvat (Kartikadi)
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block text-sm">
              VS 2082 (until Nov 9, 2026)
            </span>
            <span className="text-zinc-500 mt-1 block leading-snug">
              Transitions to VS 2083 on Bestu Varas (Nov 10, 2026 — Kartak Sud Ekam). Amavasyanta month convention applies.
            </span>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-1">
              National Saka Civil Calendar
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block text-sm">
              1948 Saka (From March 22, 2026)
            </span>
            <span className="text-zinc-500 mt-1 block leading-snug">
              Official GOI / IMD civil solar calendar. Chaitra 1 falls on March 22 (normal year); 1947 Saka prior to March 22.
            </span>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">
              Traditional Solar & Lunisolar Shaka
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block text-sm">
              Shaka 1948
            </span>
            <span className="text-zinc-500 mt-1 block leading-snug">
              Lunisolar Shaka commenced March 19, 2026 (Gudi Padwa/Ugadi). Solar Shaka commenced April 14, 2026 (Mesha Sankranti).
            </span>
          </div>
        </div>

        {/* Adhika Masa 2026 Callout */}
        <div className="mt-4 rounded-xl border border-amber-300/60 bg-amber-100/60 p-3.5 text-xs text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200">
          <p className="font-bold mb-0.5">
            Astronomical Ingress Notice — Adhika Jyeshtha in 2026 (અધિક જેઠ / अधिक ज्येष्ठ):
          </p>
          <p className="leading-relaxed">
            In 2026, the Sun remains in sidereal Taurus (Vrishabha) between the New Moon of May 16, 2026 (20:01 UTC) and June 15, 2026 (02:54 UTC), resulting in zero Solar Sankranti during that lunar month.
            Consequently, <strong>May 17 to June 15, 2026 is observed as Adhika Jyeshtha</strong> (Purushottam Maas), followed by <strong>Nija Jyeshtha from June 16 to July 14, 2026</strong>.
          </p>
        </div>
      </section>

      {/* 12 Hindu Months Overview Grid */}
      <section id="monthly" className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" />
            12 Lunar Months (द्वादश मास)
          </h2>
          <span className="text-xs text-zinc-500">Purnimanta & Amavasyanta</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {months.map((m, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200/90 bg-card p-5 shadow-sm dark:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                  Month {idx + 1}
                </span>
                <span className="text-[11px] text-zinc-400">{m.gregorian}</span>
              </div>
              <h3 className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">
                {m.sanskrit}
              </h3>
              <p className="mt-1 text-xs text-zinc-500">
                Ritu: <span className="font-medium text-zinc-700 dark:text-zinc-300">{m.season}</span>
              </p>
              <div className="mt-3 border-t border-zinc-100 pt-2.5 dark:border-zinc-800/80">
                <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Key Festivals & Vrats:
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-snug">
                  {m.tithiEvents}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Principles & Tithi Calculations */}
      <section id="vrat" className="rounded-2xl border border-zinc-200/90 bg-card p-6 shadow-sm dark:border-zinc-800 space-y-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Moon className="h-5 w-5 text-amber-500" />
          The Science of Lunisolar Synchronization
        </h3>
        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          The Hindu calendar operates as a sophisticated lunisolar system. While a solar year contains approximately
          365.242 days, 12 lunar months (each averaging 29.53 solar days) total roughly 354 days—resulting in an 11-day annual variance.
          To maintain strict alignment with agricultural seasons and solar solstices, an intercalary month known as <strong>Adhik Maas</strong> (Purushottam Maas)
          is introduced approximately every 32.5 months (seven times in 19 years).
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pt-2 text-xs">
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">Shukla Paksha</span>
            <span className="text-zinc-500">The waxing fortnight from the New Moon (Amavasya) to the Full Moon (Purnima). Auspicious for beginnings.</span>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">Krishna Paksha</span>
            <span className="text-zinc-500">The waning fortnight from the Full Moon (Purnima) to the New Moon (Amavasya). Favorable for spiritual reflection.</span>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block mb-1">Ekadashi & Pradosh</span>
            <span className="text-zinc-500">The 11th lunar day (Ekadashi) and 13th twilight (Pradosham) dedicated to Lord Vishnu and Lord Shiva.</span>
          </div>
        </div>
      </section>

      {/* 2027 Calendar & Vrat Fasting Hubs */}
      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Upcoming 2027 Calendar & Sacred Fasting Directories
            </h3>
            <p className="text-xs text-zinc-500">
              Plan ahead for Vikram Samvat 2083–2084 with dedicated 2027 lunisolar directories.
            </p>
          </div>
          <Link
            href={`/${locale}/calendar/hindu-calendar-2027`}
            className="text-xs font-bold text-amber-700 hover:underline dark:text-amber-400"
          >
            Full Hindu Calendar 2027 →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <Link
            href={`/${locale}/calendar/ekadashi-2027`}
            className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-amber-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="font-bold text-amber-700 dark:text-amber-400 block">Ekadashi 2027 Dates →</span>
            <span className="text-zinc-500 mt-1 block">All 24 Ekadashi fasting dates with exact Parana timings.</span>
          </Link>
          <Link
            href={`/${locale}/calendar/purnima-2027`}
            className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-amber-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="font-bold text-amber-700 dark:text-amber-400 block">Purnima 2027 Dates →</span>
            <span className="text-zinc-500 mt-1 block">Full moon calendar and Satyanarayan Puja schedule.</span>
          </Link>
          <Link
            href={`/${locale}/calendar/amavasya-2027`}
            className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-amber-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span className="font-bold text-amber-700 dark:text-amber-400 block">Amavasya 2027 Dates →</span>
            <span className="text-zinc-500 mt-1 block">13 new moon dates, Somvati Amavasya, and Pitru Tarpan.</span>
          </Link>
        </div>
      </section>

      {/* Internal Linking Engine Integration */}
      <InternalLinkingEngine
        relationshipKey="panchang"
        currentEcosystem="hindu-calendar"
        sectionTitle="Connected Hindu Calendar & Panchang Resources"
      />
    </div>
  );
}
