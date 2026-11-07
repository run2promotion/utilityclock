import { GujaratiCalendarExperience } from "@/components/calendar/GujaratiCalendarExperience";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { hreflangAlternates } from "@/i18n/alternates";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { siteOrigin } from "@/lib/site-url";
import { Calendar, Compass, Sparkles, Sun } from "lucide-react";
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
    path: "calendar/gujarati-calendar",
  });

  return {
    title:
      locale === "gu"
        ? "ગુજરાતી કેલેન્ડર 2026 (ગુજરાતી પંચાંગ) · વિક્રમ સંવત, ચોઘડિયા અને તિથિ"
        : locale === "hi"
        ? "गुजराती कैलेंडर 2026 (ગુજરાતી પંચાંગ) · विक्रम संवत, चौघड़िया एवं तिथि"
        : "Gujarati Calendar 2026 (ગુજરાતી પંચાંગ) · Vikram Samvat, Choghadiya & Tithi",
    description:
      "Authentic Gujarati calendar with Vikram Samvat 2082, day & night Choghadiya timings, Gujarati months (Kartak to Aso), Bestu Varas, and festival dates.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: "Gujarati Calendar 2026 (ગુજરાતી પંચાંગ) · Vikram Samvat, Choghadiya & Tithi",
      description:
        "Authentic Gujarati calendar with Vikram Samvat 2082, day & night Choghadiya timings, Gujarati months (Kartak to Aso), Bestu Varas, and festival dates.",
    },
  };
}

export default async function GujaratiCalendarPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Calendar", href: `/${locale}/calendar`, item: `${siteBase}/${locale}/calendar` },
    { name: "Gujarati Calendar", item: `${siteBase}/${locale}/calendar/gujarati-calendar` },
  ];

  const gujaratiMonths = [
    { name: "Kartak (કારતક)", gregorian: "October – November", festivals: "Bestu Varas (New Year), Bhai Dooj, Labh Pancham, Dev Diwali" },
    { name: "Magshar (માગશર)", gregorian: "November – December", festivals: "Mokshada Ekadashi, Gita Jayanti, Dhanu Sankranti" },
    { name: "Posh (પોષ)", gregorian: "December – January", festivals: "Pausha Putrada Ekadashi, Makar Sankranti (Uttarayan)" },
    { name: "Maha (મહા)", gregorian: "January – February", festivals: "Vasant Panchami, Maha Shivratri, Jaya Ekadashi" },
    { name: "Fagun (ફાગણ)", gregorian: "February – March", festivals: "Holi, Dhuleti, Amalaki Ekadashi" },
    { name: "Chaitra (ચૈત્ર)", gregorian: "March – April", festivals: "Chaitra Navratri, Ram Navami, Hanuman Jayanti" },
    { name: "Vaishakh (વૈશાખ)", gregorian: "April – May", festivals: "Akshaya Tritiya, Narasimha Jayanti, Buddha Purnima" },
    { name: "Jeth (જેઠ)", gregorian: "May – June", festivals: "Vat Savitri Vrat, Ganga Dussehra, Nirjala Ekadashi" },
    { name: "Ashadh (અષાઢ)", gregorian: "June – July", festivals: "Ashadhi Bij (Rath Yatra), Devshayani Ekadashi, Guru Purnima" },
    { name: "Shravan (શ્રાવણ)", gregorian: "July – August", festivals: "Shravan Somvar Vrat, Nag Panchami, Raksha Bandhan, Janmashtami" },
    { name: "Bhadarvo (ભાદરવો)", gregorian: "August – September", festivals: "Ganesh Chaturthi, Samvatsari (Paryushan), Anant Chaturdashi" },
    { name: "Aso (આસો)", gregorian: "September – October", festivals: "Navratri, Sharad Purnima, Dhanteras, Kali Chaudas, Diwali" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: "Gujarati Calendar 2026 (ગુજરાતી પંચાંગ)",
    description: "Authentic Gujarati calendar with Vikram Samvat 2082, day & night Choghadiya timings, Gujarati months (Kartak to Aso), Bestu Varas, and festival dates.",
    url: `${siteBase}/${locale}/calendar/gujarati-calendar`,
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
      <div className="rounded-3xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300">
            વિક્રમ સંવત ૨૦૮૨ (Vikram Samvat 2082)
          </span>
          <span className="text-xs text-zinc-500">Amavasyanta System (અમાવસ્યાન્ત)</span>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Gujarati Calendar 2026 (ગુજરાતી કેલેન્ડર)
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          In the Gujarati tradition, the lunar calendar follows the <em>Amavasyanta</em> convention where each month begins
          immediately following Amavasya (New Moon) and ends on the next Amavasya. The Gujarati New Year (<strong>Bestu Varas</strong>)
          commences on Kartak Sud Ekam, the day after Diwali.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
          <Link
            href={`/${locale}/calendar/gujarati-calendar-2027`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-4 py-2 text-white shadow-sm transition hover:bg-orange-700 font-bold"
          >
            <Calendar className="h-4 w-4" />
            <span>ગુજરાતી કેલેન્ડર 2027 (VS 2083–2084) →</span>
          </Link>
          <Link
            href={`/${locale}/festivals/gujarati-festivals-2027`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Sparkles className="h-4 w-4 text-orange-500" />
            <span>ગુજરાતી તહેવારો 2027</span>
          </Link>
          <Link
            href={`/${locale}/panchang#choghadiya`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Sun className="h-4 w-4 text-orange-500" />
            <span>આજના ચોઘડિયા (Choghadiya)</span>
          </Link>
          <Link
            href={`/${locale}/panchang`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Compass className="h-4 w-4 text-orange-500" />
            <span>દૈનિક પંચાંગ (Panchang)</span>
          </Link>
          <Link
            href={`/${locale}/calendar/hindu-calendar`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Calendar className="h-4 w-4 text-amber-500" />
            <span>All-India Hindu Calendar</span>
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

      {/* Interactive Gujarati Calendar Experience */}
      <section id="interactive-gujarati-calendar" className="space-y-4">
        <GujaratiCalendarExperience />
      </section>

      {/* Gujarati Kartikadi Vikram Samvat Reference */}
      <section className="rounded-2xl border border-orange-200/80 bg-orange-50/40 p-5 dark:border-orange-900/40 dark:bg-orange-950/20">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Compass className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          ગુજરાતી સંવત પરંપરા (Gujarati Kartikadi Vikram Samvat Era)
        </h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
          <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="font-bold text-orange-700 dark:text-orange-400 block mb-1">
              હાલનું વર્ષ (Active Year)
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block text-sm">
              વિક્રમ સંવત ૨૦૮૨ (VS 2082)
            </span>
            <span className="text-zinc-500 mt-1 block leading-snug">
              સમગ્ર ૨૦૨૬ દરમિયાન દિવાળી સુધી વિક્રમ સંવત ૨૦૮૨ અમલમાં રહેશે.
            </span>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="font-bold text-amber-700 dark:text-amber-400 block mb-1">
              નૂતન વર્ષ / બેસતું વર્ષ (Bestu Varas)
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block text-sm">
              ૧૦ નવેમ્બર ૨૦૨૬ (કારતક સુદ એકમ)
            </span>
            <span className="text-zinc-500 mt-1 block leading-snug">
              આ દિવસે વિક્રમ સંવત ૨૦૮૩ નો પ્રારંભ થશે (દિવાળીના બીજા દિવસે).
            </span>
          </div>

          <div className="rounded-xl border border-zinc-200/80 bg-white/80 p-3.5 dark:border-zinc-800 dark:bg-zinc-900/60">
            <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-1">
              અમાવસ્યાન્ત ગણતરી (Amavasyanta System)
            </span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 block text-sm">
              સુદ ૧ થી અમાસ
            </span>
            <span className="text-zinc-500 mt-1 block leading-snug">
              ગુજરાતી કેલેન્ડરમાં પ્રત્યેક મહિનો સુદ એકમથી શરૂ થઈ વદ અમાસે પૂર્ણ થાય છે.
            </span>
          </div>
        </div>

        {/* Adhika Maas Notice */}
        <div className="mt-4 rounded-xl border border-orange-300/60 bg-orange-100/60 p-3.5 text-xs text-orange-950 dark:border-orange-800/60 dark:bg-orange-950/40 dark:text-orange-200">
          <p className="font-bold mb-0.5">
            ખગોળીય સંક્રાંતિ નોંધ — વર્ષ ૨૦૨૬ માં અધિક જેઠ (Adhika Jyeshtha):
          </p>
          <p className="leading-relaxed">
            વર્ષ ૨૦૨૬ માં ૧૬ મે (અમાસ) થી ૧૫ જૂન (અમાસ) દરમિયાન સૂર્ય વૃષભ રાશિમાં જ રહે છે અને કોઈ સંક્રાંતિ થતી નથી. આથી <strong>૧૭ મે થી ૧૫ જૂન ૨૦૨૬ અધિક જેઠ (પુરુષોત્તમ માસ)</strong> રહેશે, અને <strong>૧૬ જૂન થી ૧૪ જુલાઈ ૨૦૨૬ શુદ્ધ (નિજ) જેઠ</strong> રહેશે.
          </p>
        </div>
      </section>

      {/* 12 Gujarati Months Grid */}
      <section id="months" className="space-y-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            ૧૨ ગુજરાતી મહિના (12 Months of the Gujarati Year)
          </h2>
          <span className="text-xs text-zinc-500">Kartak to Aso</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gujaratiMonths.map((m, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200/90 bg-card p-5 shadow-sm dark:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                  મહિનો {idx + 1}
                </span>
                <span className="text-[11px] text-zinc-400">{m.gregorian}</span>
              </div>
              <h3 className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">
                {m.name}
              </h3>
              <div className="mt-3 border-t border-zinc-100 pt-2.5 dark:border-zinc-800/80">
                <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  મુખ્ય વ્રત અને પર્વો:
                </span>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-snug">
                  {m.festivals}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine
        relationshipKey="diwali"
        currentEcosystem="gujarati-calendar"
        sectionTitle="Connected Gujarati Calendar & Festive Observances"
      />
    </div>
  );
}
