import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { hreflangAlternates } from "@/i18n/alternates";
import {
  Calendar,
  Compass,
  Flame,
  Globe2,
  Moon,
  Sparkles,
  Sun,
  ArrowRight,
  Clock,
  Layers,
  BookOpen,
} from "lucide-react";
import { siteOrigin } from "@/lib/site-url";
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
    path: "calendar",
  });

  return {
    title:
      locale === "gu"
        ? "ભારતીય અને પ્રાદેશિક કેલેન્ડર 2026 · પંચાંગ, તિથિ અને તહેવારો હબ"
        : locale === "hi"
        ? "भारतीय एवं क्षेत्रीय कैलेंडर 2026 · पंचांग, तिथि और त्योहार हब"
        : "Indian & Regional Calendars 2026 · Lunisolar, Solar & Festival Hub",
    description:
      locale === "gu"
        ? "હિન્દુ વિક્રમ સંવત, ગુજરાતી અમાવસ્યાન્ત, બંગાળી, મરાઠી, તમિલ, તેલુગુ અને જૈન કેલેન્ડર સાથે તિથિ, વ્રત, તહેવારો અને ચોઘડિયાની સચોટ ગણતરી."
        : locale === "hi"
        ? "हिन्दू विक्रम संवत, गुजराती अमावस्यान्त, बंगाली, मराठी, तमिल, तेलुगु एवं जैन पंचांग के साथ तिथि, व्रत, चौघड़िया एवं पर्वों की प्रामाणिक जानकारी।"
        : "Explore authentic Indian calendars: Hindu Vikram Samvat, Gujarati Amavasyanta, Bengali, Marathi, Tamil, Telugu, Kannada, Malayalam, Odia, Assamese, Punjabi, Nepali, Jain, and ISKCON calendars.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title:
        locale === "gu"
          ? "ભારતીય અને પ્રાદેશિક કેલેન્ડર 2026 · પંચાંગ, તિથિ અને તહેવારો હબ"
          : locale === "hi"
          ? "भारतीय एवं क्षेत्रीय कैलेंडर 2026 · पंचांग, तिथि और त्योहार हब"
          : "Indian & Regional Calendars 2026 · Lunisolar, Solar & Festival Hub",
      description:
        "Comprehensive discovery hub for Indian lunisolar and solar calendars with Vikram Samvat 2082–2083, Shaka 1948, Choghadiya, Tithi, and regional traditions.",
    },
  };
}

type RegionalCalendarCard = {
  id: string;
  name: string;
  nativeName: string;
  era: string;
  system: "Lunisolar (Amavasyanta)" | "Lunisolar (Purnimanta)" | "Solar (Sauramana)" | "Lunisolar (Jain/Vaishnava)";
  status: "active" | "planned";
  href?: string;
  description: string;
  newYearName: string;
  primaryRegions: string[];
};

const REGIONAL_CALENDARS: RegionalCalendarCard[] = [
  {
    id: "hindu-calendar",
    name: "Hindu Calendar",
    nativeName: "हिन्दू पंचांग व कैलेंडर",
    era: "Vikram Samvat 2082–2083 / Shaka 1948",
    system: "Lunisolar (Purnimanta)",
    status: "active",
    href: "/calendar/hindu-calendar",
    description:
      "Classical lunisolar calendar synchronizing lunar months (Chandramana) with solar years. Features 12 lunar months from Chaitra to Phalguna, Shukla/Krishna Paksha, Ekadashi, Pradosh, and all Vedic festivals.",
    newYearName: "Chaitra Shukla Pratipada (Gudi Padwa / Ugadi)",
    primaryRegions: ["North India", "Central India", "Worldwide Hindu Diaspora"],
  },
  {
    id: "gujarati-calendar",
    name: "Gujarati Calendar",
    nativeName: "ગુજરાતી કેલેન્ડર (પંચાંગ)",
    era: "Vikram Samvat 2082",
    system: "Lunisolar (Amavasyanta)",
    status: "active",
    href: "/calendar/gujarati-calendar",
    description:
      "Follows the ancient Amavasyanta convention where lunar months commence the day after Amavasya. Features Kartak to Aso months, Bestu Varas, Labh Pancham, and real-time Day & Night Choghadiya muhurats.",
    newYearName: "Bestu Varas (Kartak Sud Ekam - day following Diwali)",
    primaryRegions: ["Gujarat", "Mumbai", "Worldwide Gujarati Diaspora"],
  },
  {
    id: "bengali-calendar",
    name: "Bengali Calendar",
    nativeName: "বাংলা পঞ্জিকা (Bangabda)",
    era: "Bangabda 1432–1433",
    system: "Solar (Sauramana)",
    status: "planned",
    description:
      "Solar sidereal calendar based on the Surya Siddhanta astronomical model. Governs Durga Puja, Kali Puja, Saraswati Puja, and Poila Boishakh celebrations.",
    newYearName: "Poila Boishakh (First day of Boishakh / Mid-April)",
    primaryRegions: ["West Bengal", "Tripura", "Assam (Barak Valley)", "Bangladesh"],
  },
  {
    id: "marathi-calendar",
    name: "Marathi Calendar",
    nativeName: "मराठी दिनदर्शिका",
    era: "Shaka Samvat 1948",
    system: "Lunisolar (Amavasyanta)",
    status: "planned",
    description:
      "Follows Shalivahana Shaka Samvat and the Amavasyanta lunar month reckoning. Celebrates Gudi Padwa as the New Year, Pola, Ganeshotsav, and Ashadhi Ekadashi Pandharpur Wari.",
    newYearName: "Gudi Padwa (Chaitra Shukla Pratipada)",
    primaryRegions: ["Maharashtra", "Goa", "Konkan region"],
  },
  {
    id: "tamil-calendar",
    name: "Tamil Calendar",
    nativeName: "தமிழ் நாட்காட்டி",
    era: "Tiruvalluvar Aandu 2057",
    system: "Solar (Sauramana)",
    status: "planned",
    description:
      "Sidereal solar calendar synchronized with the Sun's transit through the 12 Nirayana zodiac signs (Rasis) from Chithirai to Panguni. Major celebrations include Puthandu, Pongal, and Karthigai Deepam.",
    newYearName: "Puthandu (Chithirai 1 / Mesha Sankranti)",
    primaryRegions: ["Tamil Nadu", "Puducherry", "Sri Lanka", "Singapore", "Malaysia"],
  },
  {
    id: "telugu-calendar",
    name: "Telugu Calendar",
    nativeName: "తెలుగు పంచాంగం",
    era: "Shaka Samvat 1948 (Krodhi Nama Samvatsara)",
    system: "Lunisolar (Amavasyanta)",
    status: "planned",
    description:
      "Chandramana lunisolar system counting sixty-year Samvatsara cycles according to the Brihaspati cycle. Key observances include Ugadi, Sri Rama Navami, and Bonalu.",
    newYearName: "Ugadi (Chaitra Shuddha Padyami)",
    primaryRegions: ["Andhra Pradesh", "Telangana"],
  },
  {
    id: "kannada-calendar",
    name: "Kannada Calendar",
    nativeName: "ಕನ್ನಡ ಪಂಚಾಂಗ",
    era: "Shaka Samvat 1948",
    system: "Lunisolar (Amavasyanta)",
    status: "planned",
    description:
      "Amavasyanta Chandramana calendar traditional to Karnataka. Begins the year with Yugadi and tracks lunar tithis for Karaga, Varamahalakshmi, and Mysuru Dasara.",
    newYearName: "Yugadi (Chaitra Shuddha Padyami)",
    primaryRegions: ["Karnataka"],
  },
  {
    id: "malayalam-calendar",
    name: "Malayalam Calendar",
    nativeName: "മലയാള പഞ്ചാംഗം (Kollavarsham)",
    era: "Kollam Era 1201–1202",
    system: "Solar (Sauramana)",
    status: "planned",
    description:
      "Solar calendar introduced in 825 CE (Kollavarsham). Months are named after zodiac constellations (Chingam to Karkkidakam). Centerpiece celebrations include Onam and Vishu.",
    newYearName: "1st of Chingam (August–September) / Vishu (Astronomical)",
    primaryRegions: ["Kerala", "Lakshadweep"],
  },
  {
    id: "odia-calendar",
    name: "Odia Calendar",
    nativeName: "ଓଡ଼ିଆ ପଞ୍જીକા (Panjika)",
    era: "Saka Samvat / Anka Era",
    system: "Solar (Sauramana)",
    status: "planned",
    description:
      "Traditional Odia solar calendar synchronized with Sri Jagannath Temple rituals in Puri. Begins the solar year on Pana Sankranti (Maha Vishuva) and guides Rath Yatra.",
    newYearName: "Maha Vishuva Sankranti / Pana Sankranti",
    primaryRegions: ["Odisha"],
  },
  {
    id: "assamese-calendar",
    name: "Assamese Calendar",
    nativeName: "অসমীয়া পঞ্জিকা",
    era: "Bhaskarabda 1432–1433",
    system: "Solar (Sauramana)",
    status: "planned",
    description:
      "Solar calendar originating from Kumar Bhaskaravarman. Divides the year into Bohag, Jeth, Ahar, etc., with cultural focus on the three seasonal Bihu festivals.",
    newYearName: "Bohag Bihu / Rongali Bihu (Mid-April)",
    primaryRegions: ["Assam", "Northeast India"],
  },
  {
    id: "punjabi-calendar",
    name: "Punjabi Calendar",
    nativeName: "ਪੰਜਾਬੀ ਕੈલੰડਰ (Bikrami / Nanakshahi)",
    era: "Bikrami Samvat 2083 / Nanakshahi 558",
    system: "Solar (Sauramana)",
    status: "planned",
    description:
      "Traditional Punjabi solar calendar beginning with the harvest festival of Vaisakhi (month of Vaisakh), tracking Sangrand solar ingress days and agricultural seasons.",
    newYearName: "Vaisakhi (1st of Vaisakh)",
    primaryRegions: ["Punjab", "Haryana", "Delhi"],
  },
  {
    id: "nepali-calendar",
    name: "Nepali Calendar",
    nativeName: "नेपाली पात्रो (Bikram Sambat)",
    era: "Bikram Sambat 2083",
    system: "Solar (Sauramana)",
    status: "planned",
    description:
      "The official civil calendar of Nepal, running approximately 56 years and 8.5 months ahead of the Gregorian calendar. Months range from Baishakh to Chaitra.",
    newYearName: "Nepali New Year (1st of Baishakh / Mid-April)",
    primaryRegions: ["Nepal", "Sikkim", "Darjeeling", "Nepali Diaspora"],
  },
  {
    id: "jain-calendar",
    name: "Jain Calendar",
    nativeName: "જૈન પંચાંગ / जैन पंचांग",
    era: "Vira Nirvana Samvat 2552",
    system: "Lunisolar (Jain/Vaishnava)",
    status: "planned",
    description:
      "Commemorates the Nirvana of Bhagwan Mahavira in 527 BCE. Tracks Jain Tithi, Paryushan Parva, Samvatsari, Mahavir Jayanti, and Oli fast periods.",
    newYearName: "Kartak Sud Ekam (Day after Diwali / Nirvana Mahotsav)",
    primaryRegions: ["Gujarat", "Rajasthan", "Madhya Pradesh", "Maharashtra"],
  },
  {
    id: "iskcon-calendar",
    name: "ISKCON Vaishnava Calendar",
    nativeName: "Gaurabda Panjika",
    era: "Gaurabda 540",
    system: "Lunisolar (Jain/Vaishnava)",
    status: "planned",
    description:
      "Gaudiya Vaishnava lunisolar calendar dating from the divine advent of Sri Chaitanya Mahaprabhu (1486 CE). Focuses on Shuddha Ekadashi, Parana timings, and appearance days.",
    newYearName: "Gaura Purnima (Phalguna Purnima)",
    primaryRegions: ["Global ISKCON Temples & Gaudiya Math"],
  },
];

export default async function CalendarHubPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Calendar", item: `${siteBase}/${locale}/calendar` },
  ];

  const activeCalendars = REGIONAL_CALENDARS.filter((c) => c.status === "active");
  const plannedCalendars = REGIONAL_CALENDARS.filter((c) => c.status === "planned");

  return (
    <div className="space-y-12">
      <Breadcrumbs items={crumbs} />

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5" />
            Calendar Discovery Hub
          </span>
          <span className="text-xs text-zinc-500">14 Indian & Regional Traditions</span>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Indian & Regional Calendars 2026
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
          India possesses one of the world&apos;s richest astronomical traditions. While modern civil life uses the Gregorian
          calendar, cultural, religious, agricultural, and auspicious timing across India relies on 14 distinct regional lunisolar
          and solar calendar systems. Explore each calendar system, its astronomical principles, and active monthly tools.
        </p>

        {/* Quick Hub Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
          <Link
            href={`/${locale}/calendar/hindu-calendar`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-white shadow-sm transition hover:bg-amber-700"
          >
            <Calendar className="h-4 w-4" />
            <span>Hindu Calendar 2026</span>
          </Link>
          <Link
            href={`/${locale}/calendar/hindu-calendar-2027`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-amber-900 transition hover:bg-amber-500/20 dark:text-amber-300 font-bold"
          >
            <Calendar className="h-4 w-4 text-amber-500" />
            <span>Hindu Calendar 2027 (VS 2083–2084) →</span>
          </Link>
          <Link
            href={`/${locale}/calendar/gujarati-calendar`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2.5 text-white shadow-sm transition hover:bg-orange-700"
          >
            <Sun className="h-4 w-4" />
            <span>Gujarati Calendar 2026</span>
          </Link>
          <Link
            href={`/${locale}/calendar/gujarati-calendar-2027`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-orange-900 transition hover:bg-orange-500/20 dark:text-orange-300 font-bold"
          >
            <Sun className="h-4 w-4 text-orange-500" />
            <span>Gujarati Calendar 2027 →</span>
          </Link>
          <Link
            href={`/${locale}/panchang`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Compass className="h-4 w-4 text-red-500" />
            <span>Live Daily Panchang</span>
          </Link>
          <Link
            href={`/${locale}/festivals`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Flame className="h-4 w-4 text-orange-500" />
            <span>Festivals & Holidays</span>
          </Link>
        </div>
      </div>

      {/* 2027 Calendar & Vrat Fasting Hubs */}
      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              2027 Calendar Ecosystem & Sacred Vrat Portals
            </h3>
            <p className="text-xs text-zinc-500">
              Explore dedicated 2027 calendars with Vikram Samvat 2083–2084, Ekadashi fasts, Purnima, and Amavasya.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <Link
            href={`/${locale}/calendar/hindu-calendar-2027`}
            className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-amber-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition"
          >
            <span className="font-bold text-amber-700 dark:text-amber-400 block">Hindu Calendar 2027 →</span>
            <span className="text-zinc-500 mt-1 block">VS 2083–2084, 12 lunar months, and major festival dates.</span>
          </Link>
          <Link
            href={`/${locale}/calendar/gujarati-calendar-2027`}
            className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-orange-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition"
          >
            <span className="font-bold text-orange-700 dark:text-orange-400 block">Gujarati Calendar 2027 →</span>
            <span className="text-zinc-500 mt-1 block">Bestu Varas (Oct 30), day/night Choghadiya, and Amas Tithis.</span>
          </Link>
          <Link
            href={`/${locale}/calendar/ekadashi-2027`}
            className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-amber-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition"
          >
            <span className="font-bold text-amber-700 dark:text-amber-400 block">Ekadashi 2027 Dates →</span>
            <span className="text-zinc-500 mt-1 block">24 fasting dates with morning Parana windows (IST).</span>
          </Link>
          <Link
            href={`/${locale}/calendar/purnima-2027`}
            className="p-3.5 rounded-xl border border-zinc-200 bg-white hover:border-amber-400 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition"
          >
            <span className="font-bold text-amber-700 dark:text-amber-400 block">Purnima & Amavasya 2027 →</span>
            <span className="text-zinc-500 mt-1 block">Full moon Satyanarayan Puja & 13 new moon Shradh dates.</span>
          </Link>
        </div>
      </section>

      {/* SECTION 1: ACTIVE PRODUCTION CALENDARS (Category A) */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
            Active Online Calendars (Live 2026 Tools)
          </h2>
        </div>
        <p className="text-sm text-zinc-500 mb-6 max-w-2xl">
          These interactive calendar tools are fully implemented with monthly grids, astronomical calculations, Tithi details, and festival dates.
        </p>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {activeCalendars.map((cal) => (
            <div
              key={cal.id}
              className="group flex flex-col justify-between rounded-2xl border border-amber-500/30 bg-gradient-to-b from-white to-amber-50/20 p-6 shadow-sm transition hover:border-amber-500 hover:shadow-md dark:border-amber-500/20 dark:bg-zinc-900/80 dark:to-zinc-900"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Live Tool
                  </span>
                  <span className="text-xs font-medium text-zinc-400">{cal.system}</span>
                </div>

                <h3 className="mt-3 text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                  {cal.name}
                  <span className="text-sm font-normal text-zinc-500">({cal.nativeName})</span>
                </h3>

                <p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  Era: {cal.era}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {cal.description}
                </p>

                <div className="mt-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs space-y-1.5 text-zinc-500">
                  <div>
                    <strong className="text-zinc-700 dark:text-zinc-300">New Year:</strong> {cal.newYearName}
                  </div>
                  <div>
                    <strong className="text-zinc-700 dark:text-zinc-300">Regions:</strong> {cal.primaryRegions.join(", ")}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-200/80 dark:border-zinc-800/80">
                <Link
                  href={`/${locale}${cal.href}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-amber-700"
                >
                  <span>Explore {cal.name} 2026</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: ARCHITECTURAL OVERVIEW OF INDIAN CALENDARS */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 sm:text-2xl">
          <Layers className="h-5 w-5 text-indigo-500" />
          Astronomical Architecture of Indian Calendars
        </h2>
        <p className="mt-2 text-sm text-zinc-500 max-w-3xl leading-relaxed">
          Unlike purely solar calendars (like Gregorian) or purely lunar calendars (like Islamic Hijri), Indian traditional
          calendars fall into three distinct scientific categories:
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Sun className="h-4 w-4" />
              <span>1. Lunisolar (Chandramana)</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Synchronizes lunar months with solar years by inserting an intercalary leap month (<strong>Adhik Maas / Purushottam Maas</strong>)
              roughly every 32.5 months. Each month has 30 lunar days (Tithis) divided into <strong>Shukla Paksha</strong> (Waxing)
              and <strong>Krishna Paksha</strong> (Waning).
            </p>
            <div className="mt-3 text-[11px] text-zinc-500">
              <strong>Examples:</strong> Hindu, Gujarati, Marathi, Telugu, Kannada, Jain calendars.
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
              <Globe2 className="h-4 w-4" />
              <span>2. Solar Sidereal (Sauramana)</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Tracks the movement of the Sun through the 12 Nirayana zodiac signs (Rasis). The moment the Sun enters a new sign
              is called <strong>Sankranti</strong>, which marks the beginning of a new solar month. Years average 365.25 days without need for leap months.
            </p>
            <div className="mt-3 text-[11px] text-zinc-500">
              <strong>Examples:</strong> Tamil, Malayalam (Kollam), Bengali, Odia, Assamese, Punjabi calendars.
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
              <Moon className="h-4 w-4" />
              <span>3. Purnimanta vs Amavasyanta</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              <strong>Purnimanta</strong> (prevalent in North India) ends each month on Purnima (Full Moon), with Krishna Paksha
              starting the month. <strong>Amavasyanta</strong> (Gujarat, Maharashtra, South India) ends the month on Amavasya (New Moon),
              with Shukla Paksha starting the month.
            </p>
            <div className="mt-3 text-[11px] text-zinc-500">
              <strong>Impact:</strong> Same tithi occurs on the exact same astronomical day, but month names differ by 15 days!
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: PLANNED REGIONAL CALENDARS (Category C - In Roadmap) */}
      <section>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
              Regional Calendar Systems (Expansion Roadmap)
            </h2>
          </div>
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            Category C · Planned Systems
          </span>
        </div>
        <p className="text-sm text-zinc-500 mb-6 max-w-3xl">
          The following regional calendars are documented in our astronomical database and scheduled for dedicated interactive
          interfaces in upcoming releases. No mock or incomplete pages are deployed.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plannedCalendars.map((cal) => (
            <div
              key={cal.id}
              className="flex flex-col justify-between rounded-xl border border-zinc-200/90 bg-white/70 p-5 shadow-sm transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60"
            >
              <div>
                <div className="flex items-center justify-between gap-1">
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    Roadmap
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">{cal.system}</span>
                </div>

                <h3 className="mt-2.5 text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {cal.name}
                  <span className="block text-xs font-normal text-zinc-500">{cal.nativeName}</span>
                </h3>

                <p className="mt-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {cal.era}
                </p>

                <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-3">
                  {cal.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 text-[11px] text-zinc-500">
                <div>
                  <strong className="text-zinc-700 dark:text-zinc-300">New Year:</strong> {cal.newYearName}
                </div>
                <div className="mt-0.5">
                  <strong className="text-zinc-700 dark:text-zinc-300">Regions:</strong> {cal.primaryRegions.join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: FREQUENTLY ASKED QUESTIONS */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 sm:text-2xl">
          <BookOpen className="h-5 w-5 text-amber-500" />
          Frequently Asked Questions About Indian Calendars
        </h2>

        <div className="mt-6 divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
          <div className="py-4">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
              Why do Indian festivals occur on different Gregorian dates every year?
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Traditional Indian festivals are governed by lunar Tithis and solar transits (Sankranti). Because a lunar year has approximately
              354 days (about 11 days shorter than the 365.25-day solar year), lunar festival dates drift earlier each year in the Gregorian calendar
              until an Adhik Maas (intercalary leap month) realigns them every ~3 years.
            </p>
          </div>

          <div className="py-4">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
              What is the difference between Vikram Samvat and Shaka Samvat?
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Vikram Samvat was established by King Vikramaditya in 57 BCE (so 2026 CE is Vikram Samvat 2082–2083). Shaka Samvat was established
              in 78 CE (so 2026 CE is Shaka 1948). The National Calendar of India adopts the Shaka Samvat era, while the Vikram Samvat era is widely
              used for religious observances in Northern and Western India.
            </p>
          </div>

          <div className="py-4">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
              Why does the Gujarati New Year start after Diwali?
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              In Gujarat, the calendar year begins with the month of Kartak on Shukla Pratipada (Bestu Varas), which immediately follows Diwali
              (Kartak Amavasya). In North India, the year begins in Chaitra (March–April), while in Tamil Nadu, Kerala, and Bengal, the solar new year
              starts in mid-April.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking Engine to companion portals */}
      <InternalLinkingEngine
        currentEcosystem="hindu-calendar"
        relationshipKey="diwali"
        sectionTitle="Connected Astro & Spiritual Portals"
        sectionSubtitle="Access live Tithi, Nakshatra, Puja Vidhi rituals, and companion relationship tools."
      />
    </div>
  );
}
