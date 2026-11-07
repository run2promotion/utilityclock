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
    path: "festivals/gujarati-festivals-2027",
  });

  return {
    title:
      locale === "gu"
        ? "ગુજરાતી તહેવારો 2027 · ઉત્તરાયણ, નવરાત્રી, દિવાળી, બેસતું વર્ષ અને લાભ પાંચમ"
        : locale === "hi"
        ? "गुजराती त्योहार 2027 · उत्तरायण, नवरात्रि, दिवाली, बेसतू वरस और लाभ पांचम"
        : "Gujarati Festivals 2027 · Complete Dates, Utsav & Vrat (ગુજરાતી તહેવારો)",
    description:
      "Authentic 2027 Gujarati festival directory with exact Tithi timings for Uttarayan, Janmashtami, Navratri Garba, Diwali Lakshmi Pujan, Bestu Varas (Oct 30), and Labh Pancham.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: "Gujarati Festivals 2027 · Complete Dates, Utsav & Vrat (ગુજરાતી તહેવારો)",
      description:
        "Authentic 2027 Gujarati festival directory with exact Tithi timings for Uttarayan, Janmashtami, Navratri Garba, Diwali Lakshmi Pujan, Bestu Varas (Oct 30), and Labh Pancham.",
    },
  };
}

export default async function GujaratiFestivals2027Page({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Festivals", href: `/${locale}/festivals`, item: `${siteBase}/${locale}/festivals` },
    { name: "Gujarati Festivals 2027", item: `${siteBase}/${locale}/festivals/gujarati-festivals-2027` },
  ];

  const gujaratiFestHighlights = [
    { name: "Uttarayan & Vasi Uttarayan", native: "ઉત્તરાયણ અને વાસી ઉત્તરાયણ", date: "Jan 14–15, 2027", desc: "International kite-flying Patang Utsav, Undhiyu-Jalebi feasts, Surya Arghya, and cow seva charity." },
    { name: "Maha Shivratri & Bhavnath", native: "મહા શિવરાત્રી અને ભવનાથ મેળો", date: "Mar 6, 2027", desc: "Junagadh Bhavnath Taleti mela, Naga Babas' sacred Mrigi Kund snan, and all-night Shiva Jagran." },
    { name: "Holi & Dhuleti", native: "હોળી પ્રાગટ્ય અને ધૂળેટી", date: "Mar 22–23, 2027", desc: "Holika Dahan fire pradakshina with coconut and parched grains (Dhani), followed by joyous color play." },
    { name: "Ashadhi Bij (Ratha Yatra)", native: "અષાઢી બીજ (રથયાત્રા)", date: "Jul 5, 2027", desc: "150th historic Jagannath Ratha Yatra in Ahmedabad, Kutchhi New Year celebrations, and rain welcoming." },
    { name: "Janmashtami", native: "શ્રી કૃષ્ણ જન્માષ્ટમી (ગોકુળાષ્ટમી)", date: "Aug 24, 2027", desc: "Dwarkadhish and Dakor temple grand abhishek, midnight birth arti, fast, and Matki Fod Utsav." },
    { name: "Navratri Mahotsav", native: "નવરાત્રી મહોત્સવ (ગરબા)", date: "Sep 30 – Oct 8, 2027", desc: "World's longest dance festival with 9 sacred nights of Raas-Garba worship of Maa Ambe and Jagadamba." },
    { name: "Diwali (Chopda Pujan)", native: "દિવાળી અને ચોપડા પૂજન", date: "Oct 29, 2027", desc: "Aso Vad Amas. Business account book veneration, Lakshmi-Sharda Puja, lighting lamps, and fireworks." },
    { name: "Bestu Varas (Nutan Varsh)", native: "બેસતું વર્ષ (નૂતન વર્ષાભિનંદન)", date: "Oct 30, 2027", desc: "Kartak Sud Ekam. Commencement of Vikram Samvat 2084! Family greetings, temple visits, and Sabras sharing." },
    { name: "Labh Pancham (Saubhagya)", native: "લાભ પાંચમ (સૌભાગ્ય પંચમી)", date: "Nov 3, 2027", desc: "Kartak Sud Pancham. Most auspicious day for reopening shops, offices, and commencing business in VS 2084." },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Gujarati Festivals 2027 (ગુજરાતી તહેવારો)",
    description: "Authentic 2027 Gujarati festival directory with exact Tithi timings for Uttarayan, Janmashtami, Navratri Garba, Diwali, Bestu Varas, and Labh Pancham.",
    url: `${siteBase}/${locale}/festivals/gujarati-festivals-2027`,
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
          <Sparkles className="h-4 w-4" />
          <span>ગુજરાતી સંસ્કૃતિ અને પર્વ · Amavasyanta Tradition 2027</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl lg:text-5xl">
          Gujarati Festivals 2027 · ગુજરાતી તહેવારો અને ઉત્સવ
        </h1>

        <p className="max-w-4xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Explore complete dates and authentic traditions for all major festivals in Gujarat for 2027.
          Includes Makarsankranti (Uttarayan), Ashadhi Bij Ratha Yatra, Janmashtami at Dwarka,
          Navratri Raas-Garba, Diwali Chopda Pujan, Bestu Varas (VS 2084 New Year), and Labh Pancham.
        </p>
      </header>

      {/* Interactive Festival Engine (Defaulted to 2027 & Gujarati category) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
            2027 Gujarati Utsav & Vrat Directory
          </h2>
          <Link
            href={`/${locale}/calendar/gujarati-calendar-2027`}
            className="text-xs font-bold text-orange-700 hover:underline dark:text-orange-400"
          >
            Open Gujarati Calendar 2027 →
          </Link>
        </div>

        <FestivalsExperience initialYear={2027} initialCategory="gujarati" />
      </section>

      {/* Prominent Cultural Celebrations in Gujarat */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Special Cultural Observances of Gujarat in 2027
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Detailed cultural overview of Gujarat&apos;s most cherished public festivities and religious traditions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-xs">
          {gujaratiFestHighlights.map((fest, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-orange-700 dark:text-orange-400">{fest.date}</span>
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-semibold text-orange-800 dark:bg-orange-950/40 dark:text-orange-300">
                  ગુજરાત
                </span>
              </div>

              <h3 className="mt-2 text-base font-black text-zinc-900 dark:text-zinc-50">
                {fest.name}
              </h3>
              <div className="text-xs font-semibold text-zinc-500 mt-0.5">
                {fest.native}
              </div>

              <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {fest.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal Linking Engine */}
      <InternalLinkingEngine currentEcosystem="gujarati-calendar" />
    </div>
  );
}