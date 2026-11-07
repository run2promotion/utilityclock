import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { AstrologyExperience } from "@/components/tools/AstrologyExperience";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { siteOrigin } from "@/lib/site-url";
import { Heart, Moon, Sparkles, Sun } from "lucide-react";
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
  const canonicalUrl = `${siteBase}/${locale}/astrology`;

  return {
    title: "Vedic Astrology & Kundali · 36 Guna Milan, Rashis & Nakshatras",
    description:
      "Vedic astrology portal: Kundali birth charts, 36-point Ashta Koota Guna Milan for marriage matching, Manglik Dosha checks, 12 Rashis, and 27 Nakshatras.",
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteBase}/${l}/astrology`]),
      ),
    },
    openGraph: {
      title: "Vedic Astrology & Kundali · 36 Guna Milan, Rashis & Nakshatras",
      description:
        "Vedic astrology portal: Kundali birth charts, 36-point Ashta Koota Guna Milan for marriage matching, Manglik Dosha checks, 12 Rashis, and 27 Nakshatras.",
    },
  };
}

export default async function AstrologyPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Vedic Astrology", item: `${siteBase}/${locale}/astrology` },
  ];

  const ashtaKootas = [
    { name: "Varna (वर्ण)", points: 1, desc: "Spiritual compatibility, ego harmony, and social temperament." },
    { name: "Vashya (वश्य)", points: 2, desc: "Mutual attraction, influence, and power balance between partners." },
    { name: "Tara (तारा)", points: 3, desc: "Birth star destiny, longevity, and mutual auspiciousness." },
    { name: "Yoni (योनि)", points: 4, desc: "Biological, physical, and instinctual compatibility." },
    { name: "Graha Maitri (ग्रहमैत्री)", points: 5, desc: "Friendship between ruling planetary lords of Moon signs." },
    { name: "Gana (गण)", points: 6, desc: "Temperament category: Deva (divine), Manushya (human), Rakshasa (demonic)." },
    { name: "Bhakoot (भकूट)", points: 7, desc: "Emotional welfare, prosperity, and family growth from Moon position." },
    { name: "Nadi (नाड़ी)", points: 8, desc: "Genetic, health, and physiological harmony (Vata, Pitta, Kapha)." },
  ];

  const rashis = [
    { name: "Mesha (Aries)", element: "Fire", lord: "Mars (Mangala)" },
    { name: "Vrishabha (Taurus)", element: "Earth", lord: "Venus (Shukra)" },
    { name: "Mithuna (Gemini)", element: "Air", lord: "Mercury (Budha)" },
    { name: "Karka (Cancer)", element: "Water", lord: "Moon (Chandra)" },
    { name: "Simha (Leo)", element: "Fire", lord: "Sun (Surya)" },
    { name: "Kanya (Virgo)", element: "Earth", lord: "Mercury (Budha)" },
    { name: "Tula (Libra)", element: "Air", lord: "Venus (Shukra)" },
    { name: "Vrishchika (Scorpio)", element: "Water", lord: "Mars (Mangala)" },
    { name: "Dhanu (Sagittarius)", element: "Fire", lord: "Jupiter (Guru)" },
    { name: "Makara (Capricorn)", element: "Earth", lord: "Saturn (Shani)" },
    { name: "Kumbha (Aquarius)", element: "Air", lord: "Saturn (Shani)" },
    { name: "Meena (Pisces)", element: "Water", lord: "Jupiter (Guru)" },
  ];

  return (
    <div className="space-y-10">
      <Breadcrumbs items={crumbs} />

      {/* Hero Header */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-transparent p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            Jyotish Shastra (ज्योतिष शास्त्र)
          </span>
          <span className="text-xs text-zinc-500">Sidereal Zodiac & Planetary Positions</span>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Vedic Astrology & Kundali Milan
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Discover the principles of Indian astrology: planetary transits (Graha Gochar), Ashta Koota 36-point
          matrimonial compatibility, Manglik Dosha indicators, 12 Rashis, and 27 lunar Nakshatras.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
          <a
            href="#interactive-calculator"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Sparkles className="h-4 w-4" />
            <span>Interactive 36 Guna & Manglik Calculator</span>
          </a>
          <a
            href="#guna-milan"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span>36 Guna Milan System</span>
          </a>
          <Link
            href={`/${locale}/love-tools`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Heart className="h-4 w-4 text-pink-500" />
            <span>Love & Relationship Tools</span>
          </Link>
          <Link
            href={`/${locale}/panchang`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Today&apos;s Nakshatra & Tithi</span>
          </Link>
        </div>
      </div>

      {/* Interactive Astrology Engine */}
      <section id="interactive-calculator" className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Interactive Kundali Milan & Manglik Engine
          </h2>
          <span className="text-xs text-zinc-500">Classical Muhurta Chintamani & Brihat Parashara Rules</span>
        </div>
        <AstrologyExperience />
      </section>

      {/* Educational & Scientific Disclaimer */}
      <div className="rounded-2xl border border-indigo-200/60 bg-indigo-50/40 p-4 text-xs text-zinc-600 dark:border-indigo-900/40 dark:bg-indigo-950/20 dark:text-zinc-400">
        <p className="font-semibold text-zinc-900 dark:text-zinc-200 mb-1">
          Astronomical Precision vs Astrological Interpretation Notice:
        </p>
        <p className="leading-relaxed">
          Planetary positions and nakshatra boundaries are computed using high-precision ephemeris algorithms with the official Lahiri (Chitra Paksha) Ayanamsa.
          Interpretations such as 36 Guna Milan, Manglik Dosha, Rashis, and Divisional Charts (D9 Navamsha, D60 Shashtiamsha) are provided strictly for cultural, traditional, and educational reference.
          Astrology is a traditional cultural heritage system and does not replace professional legal, psychological, or medical counsel.
        </p>
      </div>

      {/* 36 Guna Milan (Ashta Koota) Grid */}
      <section id="guna-milan" className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Ashta Koota Milan: 36 Points of Matrimonial Harmony
          </h2>
          <span className="text-xs text-zinc-500">18+ Points Considered Auspicious</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ashtaKootas.map((k, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200/90 bg-card p-4 shadow-sm dark:border-zinc-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Koota {idx + 1}
                  </span>
                  <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-xs font-black text-indigo-700 dark:text-indigo-300">
                    {k.points} {k.points === 1 ? "pt" : "pts"}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {k.name}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 leading-snug">
                  {k.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 12 Zodiac Rashis Grid */}
      <section id="rashi" className="space-y-4">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Moon className="h-5 w-5 text-indigo-500" />
          The 12 Rashis (द्वादश राशि)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {rashis.map((r, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-200/90 bg-card p-3 text-center dark:border-zinc-800"
            >
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
                {r.element}
              </span>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {r.name}
              </h3>
              <span className="text-[10px] text-zinc-500 block mt-1">
                Lord: {r.lord}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine
        relationshipKey="love-tools"
        currentEcosystem="astrology"
        sectionTitle="Connected Astrological & Compatibility Portals"
      />
    </div>
  );
}
