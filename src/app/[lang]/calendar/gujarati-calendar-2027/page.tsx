import { GujaratiCalendarExperience } from "@/components/calendar/GujaratiCalendarExperience";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { hreflangAlternates } from "@/i18n/alternates";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { Calendar } from "lucide-react";
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
    path: "calendar/gujarati-calendar-2027",
  });

  return {
    title:
      locale === "gu"
        ? "ગુજરાતી કેલેન્ડર 2027 · વિક્રમ સંવત 2083–2084, ચોઘડિયા, તિથિ અને તહેવારો"
        : locale === "hi"
        ? "गुजराती कैलेंडर 2027 · विक्रम संवत 2083–2084, चौघड़िया, तिथि और पर्व"
        : "Gujarati Calendar 2027 · Vikram Samvat 2083–2084, Choghadiya & Festivals",
    description:
      "Authentic Gujarati lunisolar calendar for 2027 with Vikram Samvat 2083–2084, Bestu Varas (Oct 30), day/night Choghadiya, Amavasyanta Tithi grids, and festivals.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: "Gujarati Calendar 2027 · Vikram Samvat 2083–2084, Choghadiya & Festivals",
      description:
        "Authentic Gujarati lunisolar calendar for 2027 with Vikram Samvat 2083–2084, Bestu Varas (Oct 30), day/night Choghadiya, Amavasyanta Tithi grids, and festivals.",
    },
  };
}

export default async function GujaratiCalendar2027Page({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Calendar", href: `/${locale}/calendar`, item: `${siteBase}/${locale}/calendar` },
    { name: "Gujarati Calendar 2027", item: `${siteBase}/${locale}/calendar/gujarati-calendar-2027` },
  ];

  const gujaratiMonths2027 = [
    { name: "Posh (પોષ)", vs: "VS 2083", greg: "Jan 2027", keyFest: "Uttarayan / Makarsankranti (Jan 14), Posh Sud Ekadashi (Jan 18)" },
    { name: "Maha (મહા)", vs: "VS 2083", greg: "Feb 2027", keyFest: "Maha Sud Pancham - Vasant Panchami (Feb 11), Maha Shivratri preparations" },
    { name: "Fagun (ફાગણ)", vs: "VS 2083", greg: "Mar 2027", keyFest: "Maha Shivratri (Mar 6), Holi / Hutashani (Mar 22), Dhuleti (Mar 23)" },
    { name: "Chaitra (ચૈત્ર)", vs: "VS 2083", greg: "Apr 2027", keyFest: "Chaitra Navratri (Apr 7–15), Ram Navami (Apr 15), Hanuman Jayanti (Apr 21)" },
    { name: "Vaishakh (વૈશાખ)", vs: "VS 2083", greg: "May 2027", keyFest: "Akhatrij / Akshaya Tritiya (May 9), Mohini Ekadashi (May 16)" },
    { name: "Jeth (જેઠ)", vs: "VS 2083", greg: "Jun 2027", keyFest: "Ganga Dussehra (Jun 14), Nirjala Ekadashi (Jun 15), Vat Savitri (Jun 18)" },
    { name: "Ashadh (અષાઢ)", vs: "VS 2083", greg: "Jul 2027", keyFest: "Ashadhi Bij - Ratha Yatra (Jul 5), Devshayani Ekadashi (Jul 15), Guru Purnima (Jul 18)" },
    { name: "Shravan (શ્રાવણ)", vs: "VS 2083", greg: "Aug 2027", keyFest: "Pavitra Shravan Somvar, Rakshabandhan (Aug 17), Janmashtami (Aug 24)" },
    { name: "Bhadarvo (ભાદરવો)", vs: "VS 2083", greg: "Sep 2027", keyFest: "Ganesh Chaturthi (Sep 4), Samvatsari (Jain), Shraddha Paksha begins (Sep 15)" },
    { name: "Aso (આસો)", vs: "VS 2083", greg: "Oct 2027", keyFest: "Navratri Garba (Sep 30–Oct 8), Dussehra (Oct 10), Sharad Poonam (Oct 15), Diwali (Oct 29)" },
    { name: "Kartak (કારતક)", vs: "VS 2084", greg: "Nov 2027", keyFest: "Bestu Varas - Nutan Varsh (Oct 30), Bhai Bij (Oct 31), Labh Pancham (Nov 3), Dev Diwali (Nov 13)" },
    { name: "Magshar (માગશર)", vs: "VS 2084", greg: "Dec 2027", keyFest: "Gita Jayanti & Mokshada Ekadashi (Dec 9), Dattatreya Jayanti (Dec 13)" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: "Gujarati Calendar 2027 (વિક્રમ સંવત 2083–2084)",
    description: "Authentic Gujarati lunisolar calendar for 2027 with Vikram Samvat 2083–2084, Bestu Varas (Oct 30), day/night Choghadiya, Amavasyanta Tithi grids, and festivals.",
    url: `${siteBase}/${locale}/calendar/gujarati-calendar-2027`,
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
        <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3.5 py-1 text-xs font-bold text-orange-800 dark:text-orange-300">
          <Calendar className="h-4 w-4" />
          <span>ગુજરાતી પંચાંગ અને કેલેન્ડર · Vikram Samvat 2083–2084</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
          Gujarati Calendar 2027 · વિક્રમ સંવત 2083–2084
        </h1>

        <p className="max-w-4xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Authentic Gujarati Amavasyanta calendar for 2027. Includes topocentric sunrise timings,
          live Day & Night Choghadiya tables for Ahmedabad, Surat, Rajkot, Vadodara, and Mumbai,
          and exact Tithi dates for Uttarayan, Janmashtami, Navratri, Diwali, and Bestu Varas.
        </p>
      </header>

      {/* Gujarati Tradition Highlights */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-xs">
        <div className="rounded-2xl border border-orange-500/20 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">Kartikadi Samvat</span>
          <span className="text-base font-black text-orange-700 dark:text-orange-400 mt-1 block">VS 2083 → VS 2084</span>
          <span className="text-zinc-500 mt-1 block">Bestu Varas (નૂતન વર્ષ) celebrated on October 30, 2027</span>
        </div>

        <div className="rounded-2xl border border-orange-500/20 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">Month System</span>
          <span className="text-base font-black text-amber-700 dark:text-amber-400 mt-1 block">અમાવસ્યાન્ત (Amavasyanta)</span>
          <span className="text-zinc-500 mt-1 block">Month ends with Amas; Sud (સુદ) is followed by Vad (વદ)</span>
        </div>

        <div className="rounded-2xl border border-orange-500/20 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">2027 Adhika Masa</span>
          <span className="text-base font-black text-emerald-700 dark:text-emerald-400 mt-1 block">કોઈ અધિક માસ નથી</span>
          <span className="text-zinc-500 mt-1 block">12 standard Gujarati months without intercalary addition</span>
        </div>

        <div className="rounded-2xl border border-orange-500/20 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <span className="font-bold uppercase tracking-wider text-zinc-400 block text-[10px]">Shubh Muhurat</span>
          <span className="text-base font-black text-indigo-700 dark:text-indigo-400 mt-1 block">ચોઘડિયા અને પંચાંગ</span>
          <span className="text-zinc-500 mt-1 block">Amrit, Shubh, and Labh Choghadiya timings computed daily</span>
        </div>
      </section>

      {/* Main Interactive Gujarati Calendar Experience */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            Interactive Gujarati Calendar & Choghadiya 2027
          </h2>
          <Link
            href={`/${locale}/calendar/gujarati-calendar`}
            className="text-xs font-bold text-orange-700 hover:underline dark:text-orange-400"
          >
            ← Switch to 2026 Gujarati Calendar
          </Link>
        </div>

        <GujaratiCalendarExperience initialYear={2027} initialMonthIndex={0} />
      </section>

      {/* 12 Months of 2027 in Gujarati Tradition */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            2027 Gujarati Months Directory (વિક્રમ સંવત ૨૦૮૩–૨૦૮૪)
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Overview of all 12 Gujarati months in 2027 CE with Gregorian calendar mapping and prominent Utsavs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gujaratiMonths2027.map((m, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-orange-700 dark:text-orange-400">{m.vs}</span>
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-800 dark:bg-orange-950/40 dark:text-orange-300">
                  {m.greg}
                </span>
              </div>

              <h3 className="mt-2 text-lg font-black text-zinc-900 dark:text-zinc-50">
                {m.name}
              </h3>

              <div className="mt-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">મુખ્ય તહેવારો: </span>
                {m.keyFest}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine currentEcosystem="gujarati-calendar" />
    </div>
  );
}