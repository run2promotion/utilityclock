import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { PanchangExperience } from "@/components/tools/PanchangExperience";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { Clock, Compass, ShieldAlert, Sun } from "lucide-react";
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
  const canonicalUrl = `${siteBase}/${locale}/panchang`;

  return {
    title: "Today's Vedic Panchang · Daily Tithi, Nakshatra, Rahu Kaal & Choghadiya",
    description:
      "Accurate daily Hindu Vedic Panchang with Tithi, Nakshatra, Yoga, Karana, Abhijit Muhurat, Rahu Kaal timings, day & night Choghadiya, and Sunrise/Sunset.",
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteBase}/${l}/panchang`]),
      ),
    },
    openGraph: {
      title: "Today's Vedic Panchang · Daily Tithi, Nakshatra, Rahu Kaal & Choghadiya",
      description:
        "Accurate daily Hindu Vedic Panchang with Tithi, Nakshatra, Yoga, Karana, Abhijit Muhurat, Rahu Kaal timings, day & night Choghadiya, and Sunrise/Sunset.",
    },
  };
}

export default async function PanchangPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Daily Panchang", item: `${siteBase}/${locale}/panchang` },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: "Today's Vedic Panchang & Muhurat (दैनिक पंचांग)",
    description: "Accurate daily Hindu Vedic Panchang with Tithi, Nakshatra, Yoga, Karana, Abhijit Muhurat, Rahu Kaal timings, day & night Choghadiya, and Sunrise/Sunset.",
    url: `${siteBase}/${locale}/panchang`,
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
      <div className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-300">
            Dainik Vedic Panchang (दैनिक पंचांग)
          </span>
          <span className="text-xs text-zinc-500">Solar & Lunar Ephemeris</span>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Today&apos;s Panchang & Muhurat
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          The Panch-Anga (five limbs) forms the cornerstone of classical Indian astronomy and timekeeping.
          Review the five essential cosmic parameters—Tithi (Lunar Day), Vara (Solar Day), Nakshatra (Constellation),
          Yoga (Angular Sum), and Karana (Half-Tithi)—alongside auspicious Abhijit Muhurat and inauspicious Rahu Kaal.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
          <a
            href="#choghadiya"
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-white shadow-sm transition hover:bg-red-700"
          >
            <Clock className="h-4 w-4" />
            <span>Today&apos;s Choghadiya</span>
          </a>
          <a
            href="#rahu-kaal"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <span>Rahu Kaal Timings</span>
          </a>
          <Link
            href={`/${locale}/calendar/hindu-calendar`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Compass className="h-4 w-4 text-amber-500" />
            <span>Full Month Calendar</span>
          </Link>
        </div>
      </div>

      {/* Live Interactive Panchang Engine */}
      <section id="live-panchang">
        <PanchangExperience />
      </section>

      {/* The 5 Limbs (Pancha Anga) Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Sun className="h-5 w-5 text-red-500" />
          The Five Cosmic Limbs (पंच-अंग)
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200/90 bg-card p-5 shadow-sm dark:border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              1. Tithi (तिथि)
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Lunar Day Angle
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Formed by each 12° angular longitudinal separation between the Moon and Sun. 15 Tithis in Shukla Paksha and 15 in Krishna Paksha.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-card p-5 shadow-sm dark:border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              2. Vara (वार)
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Solar Weekday
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              The 7 days of the week, each governed by a planetary deity: Ravivara (Sun), Somavara (Moon), Mangalavara (Mars), Budhavara (Mercury), Guruvara (Jupiter), Shukravara (Venus), Shanivara (Saturn).
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-card p-5 shadow-sm dark:border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              3. Nakshatra (नक्षत्र)
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Lunar Mansion
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              The 27 asterisms of 13° 20&apos; each through which the Moon traverses the zodiac, subdivided into 4 Padas of 3° 20&apos; (Navamsha).
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-card p-5 shadow-sm dark:border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              4. Yoga (योग)
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Angular Longitude Sum
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Sum of the solar and lunar longitudes divided into 27 specific Yogas (such as Vishkambha, Priti, Ayushman, Saubhagya, Shobhana, Sukarma).
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-card p-5 shadow-sm dark:border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              5. Karana (करण)
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Half-Tithi
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Half of a Tithi (6° separation). There are 11 Karanas: 7 movable (Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti/Bhadra) and 4 fixed (Shakuni, Chatushpada, Naga, Kintughna).
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-card p-5 shadow-sm dark:border-zinc-800 space-y-2">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Abhijit & Shubh Muhurat
            </span>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Midday Auspicious Window
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              The 8th Muhurta of the day, approximately 24 minutes before and after local solar noon. Excellent for commencing important initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Rahu Kaal Table */}
      <section id="rahu-kaal" className="rounded-2xl border border-zinc-200/90 bg-card p-6 shadow-sm dark:border-zinc-800 space-y-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-red-500" />
          Weekly Rahu Kaal Schedule (राहुकाल समय)
        </h3>
        <p className="text-xs text-zinc-500">
          Rahu Kaal lasts approximately 90 minutes each day and represents an unfavorable window for initiating commercial contracts, journeys, or ceremonies.
        </p>

        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="p-3">Weekday</th>
                <th className="p-3">Governing Planet</th>
                <th className="p-3">Standard Rahu Kaal Period</th>
                <th className="p-3">Eighth Portion (Ashtama Bhaga)</th>
              </tr>
            </thead>
            <tbody className="divide-y text-zinc-700 dark:text-zinc-300">
              <tr className="hover:bg-muted/30"><td className="p-3 font-semibold">Sunday (रविवार)</td><td className="p-3">Surya (Sun)</td><td className="p-3 text-red-600 dark:text-red-400 font-bold">04:30 PM – 06:00 PM</td><td className="p-3">8th Part</td></tr>
              <tr className="hover:bg-muted/30"><td className="p-3 font-semibold">Monday (सोमवार)</td><td className="p-3">Chandra (Moon)</td><td className="p-3 text-red-600 dark:text-red-400 font-bold">07:30 AM – 09:00 AM</td><td className="p-3">2nd Part</td></tr>
              <tr className="hover:bg-muted/30"><td className="p-3 font-semibold">Tuesday (मंगलवार)</td><td className="p-3">Mangala (Mars)</td><td className="p-3 text-red-600 dark:text-red-400 font-bold">03:00 PM – 04:30 PM</td><td className="p-3">7th Part</td></tr>
              <tr className="hover:bg-muted/30"><td className="p-3 font-semibold">Wednesday (बुधवार)</td><td className="p-3">Budha (Mercury)</td><td className="p-3 text-red-600 dark:text-red-400 font-bold">12:00 PM – 01:30 PM</td><td className="p-3">5th Part</td></tr>
              <tr className="hover:bg-muted/30"><td className="p-3 font-semibold">Thursday (गुरुवार)</td><td className="p-3">Guru (Jupiter)</td><td className="p-3 text-red-600 dark:text-red-400 font-bold">01:30 PM – 03:00 PM</td><td className="p-3">6th Part</td></tr>
              <tr className="hover:bg-muted/30"><td className="p-3 font-semibold">Friday (शुक्रवार)</td><td className="p-3">Shukra (Venus)</td><td className="p-3 text-red-600 dark:text-red-400 font-bold">10:30 AM – 12:00 PM</td><td className="p-3">4th Part</td></tr>
              <tr className="hover:bg-muted/30"><td className="p-3 font-semibold">Saturday (शनिवार)</td><td className="p-3">Shani (Saturn)</td><td className="p-3 text-red-600 dark:text-red-400 font-bold">09:00 AM – 10:30 AM</td><td className="p-3">3rd Part</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Choghadiya Overview */}
      <section id="choghadiya" className="rounded-2xl border border-zinc-200/90 bg-card p-6 shadow-sm dark:border-zinc-800 space-y-4">
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Clock className="h-5 w-5 text-red-500" />
          Choghadiya Muhurat Principles (ચોઘડિયા)
        </h3>
        <p className="text-xs text-zinc-500">
          Each day (sunrise to sunset) and night (sunset to sunrise) is divided into 8 equal Choghadiya segments (~90 minutes each):
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300">
            <span className="font-bold block">Amrit (अमृत)</span>
            <span>Highly auspicious for all ceremonies.</span>
          </div>
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300">
            <span className="font-bold block">Shubh (शुभ)</span>
            <span>Auspicious for religious rites and beginnings.</span>
          </div>
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300">
            <span className="font-bold block">Labh (लाभ)</span>
            <span>Auspicious for commercial trade and study.</span>
          </div>
          <div className="p-3 rounded-xl border border-zinc-300 bg-muted/40 text-zinc-700 dark:text-zinc-300">
            <span className="font-bold block">Char (चल)</span>
            <span>Neutral / good for transit and journeys.</span>
          </div>
        </div>
      </section>

      {/* Astronomical Methodology & Precision Transparency Notice */}
      <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4 text-xs text-zinc-600 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-zinc-400">
        <p className="font-semibold text-zinc-900 dark:text-zinc-200 mb-1">
          Astronomical Ephemeris & Precision Disclosure:
        </p>
        <p className="leading-relaxed">
          Panchang calculations are computed in real-time in the browser using the open-source <strong>Astronomy Engine</strong> (VSOP87 planetary theory for the Sun and Montenbruck & Pfleger&apos;s Improved Lunar Ephemeris formulation for the Moon).
          Sidereal longitudes utilize the official <strong>Lahiri (Chitra Paksha) Ayanamsa</strong> standard.
          Theoretical positions are accurate to within ~1 arcminute (~0.016°), corresponding to ~1 to 2 minutes in Tithi and Nakshatra transition timestamps.
          Topocentric sunrise and sunset include 34 arcminutes atmospheric refraction and 16 arcminutes solar semi-diameter; local meteorological variations (temperature, barometric pressure, elevation) may cause ±1 to 2 minute variations in observed horizon events.
        </p>
      </div>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine
        relationshipKey="panchang"
        currentEcosystem="panchang"
        sectionTitle="Connected Vedic Astronomy & Calendar Portals"
      />
    </div>
  );
}
