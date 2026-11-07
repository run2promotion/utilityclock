import { FestivalsExperience } from "@/components/festivals/FestivalsExperience";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { hreflangAlternates } from "@/i18n/alternates";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { siteOrigin } from "@/lib/site-url";
import { Calendar, Flame, Sparkles } from "lucide-react";
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
    path: "festivals",
  });

  return {
    title:
      locale === "gu"
        ? "તહેવારો અને પર્વ 2026 · હિન્દુ, ગુજરાતી, જૈન, શીખ અને બૌદ્ધ ઉત્સવ"
        : locale === "hi"
        ? "त्योहार एवं व्रत पर्व 2026 · हिन्दू, गुजराती, जैन, सिख एवं बौद्ध उत्सव"
        : "Festivals & Sacred Holidays 2026 · Hindu, Jain, Sikh & Buddhist Celebrations",
    description:
      "Comprehensive sacred calendar of global and Indian festivals: Diwali, Holi, Navratri, Mahavir Jayanti, Gurpurab, Buddha Purnima, regional harvest celebrations, and countdowns.",
    alternates: {
      canonical: alternates.canonical,
      languages: alternates.languages,
    },
    openGraph: {
      title: "Festivals & Sacred Holidays 2026 · Hindu, Jain, Sikh & Buddhist Celebrations",
      description:
        "Comprehensive sacred calendar of global and Indian festivals: Diwali, Holi, Navratri, Mahavir Jayanti, Gurpurab, Buddha Purnima, regional harvest celebrations, and countdowns.",
    },
  };
}

export default async function FestivalsPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Festivals Hub", item: `${siteBase}/${locale}/festivals` },
  ];

  const festivalCategories = [
    {
      id: "hindu",
      title: "Hindu Festivals (सनातन पर्व)",
      desc: "Lunisolar observances celebrating deities, celestial alignments, and victory of light over darkness.",
      items: [
        { name: "Maha Shivratri", month: "Phalguna Krishna Chaturdashi", desc: "Great Night of Shiva; night-long vigilance and meditation." },
        { name: "Holi & Holika Dahan", month: "Phalguna Purnima", desc: "Spring festival of colors, joy, and triumph of devotion." },
        { name: "Rama Navami", month: "Chaitra Shukla Navami", desc: "Appearance day of Bhagavan Shri Rama; end of Chaitra Navratri." },
        { name: "Raksha Bandhan", month: "Shravana Purnima", desc: "Sacred bond of protection and affection between siblings." },
        { name: "Krishna Janmashtami", month: "Bhadrapada Krishna Ashtami", desc: "Midnight appearance of Lord Krishna in Rohini Nakshatra." },
        { name: "Ganesh Chaturthi", month: "Bhadrapada Shukla Chaturthi", desc: "10-day celebration welcoming Lord Ganesha, remover of obstacles." },
        { name: "Sharad Navratri & Dussehra", month: "Ashvina Shukla Pratipada to Dashami", desc: "9 divine nights of Maa Durga culminating in Vijayadashami." },
        { name: "Diwali (Deepavali)", month: "Kartika Amavasya", desc: "Festival of Lights, Lakshmi Puja, and new beginnings." },
      ],
    },
    {
      id: "jain",
      title: "Jain Festivals (जैन पर्व)",
      desc: "Sacred spiritual periods centered on non-violence (Ahimsa), self-restraint, and universal forgiveness (Kshamavani).",
      items: [
        { name: "Mahavir Jayanti", month: "Chaitra Shukla Trayodashi", desc: "Birth anniversary of Bhagwan Mahavira, 24th Tirthankara." },
        { name: "Paryushan Parva & Das Lakshana", month: "Bhadrapada", desc: "8 to 10 days of intense spiritual reflection, fasting, and repentance." },
        { name: "Samvatsari (Kshamavani)", month: "Bhadrapada Shukla Panchami", desc: "Forgiveness day with the universal prayer: 'Micchami Dukkadam'." },
        { name: "Diwali (Mahavira Nirvana)", month: "Kartika Amavasya", desc: "Attainment of Moksha (liberation) by Bhagwan Mahavira." },
      ],
    },
    {
      id: "sikh",
      title: "Sikh Festivals (ਗੁਰਪੁਰਬ)",
      desc: "Commemorations of the Sikh Gurus (Gurpurabs), historic defense of human rights, and the founding of the Khalsa.",
      items: [
        { name: "Vaisakhi (Khalsa Sirjana Divas)", month: "Mid-April", desc: "Birth of the Khalsa Panth established by Guru Gobind Singh Ji in 1699." },
        { name: "Bandi Chhor Divas", month: "Kartika (Diwali day)", desc: "Release of Guru Hargobind Sahib Ji and 52 rajahs from Gwalior Fort." },
        { name: "Guru Nanak Gurpurab", month: "Kartika Purnima", desc: "Appearance day of Guru Nanak Dev Ji, founder of Sikhism." },
      ],
    },
    {
      id: "buddhist",
      title: "Buddhist Festivals (बुद्ध पूर्णिमा)",
      desc: "Observances honoring the life milestones of Gautama Buddha and the turning of the Wheel of Dharma.",
      items: [
        { name: "Buddha Purnima (Vesak)", month: "Vaishakha Purnima", desc: "Birth, Enlightenment (Bodhi), and Parinirvana of Gautama Buddha." },
        { name: "Asalha Puja (Dharma Day)", month: "Ashadha Purnima", desc: "Commemoration of the Buddha's first sermon in Sarnath (Dhammacakkappavattana)." },
        { name: "Losar (Tibetan New Year)", month: "February – March", desc: "Traditional Buddhist harvest and renewal celebrations." },
      ],
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Festivals & Sacred Observances 2026",
    description: "Comprehensive sacred calendar of global and Indian festivals: Diwali, Holi, Navratri, Mahavir Jayanti, Gurpurab, Buddha Purnima, and regional celebrations.",
    url: `${siteBase}/${locale}/festivals`,
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
      <div className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
            Sacred Celebrations Calendar
          </span>
          <span className="text-xs text-zinc-500">Universal Interfaith Traditions</span>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Festivals & Sacred Observances 2026
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          From ancient lunisolar festivals celebrating cosmic harmony to harvest rites and spiritual renewal,
          explore authentic dates, significance, and connected rituals across world traditions.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
          <Link
            href={`/${locale}/festivals/hindu-festivals-2027`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-white shadow-sm transition hover:bg-purple-700 font-bold"
          >
            <Sparkles className="h-4 w-4" />
            <span>Hindu Festivals 2027 →</span>
          </Link>
          <Link
            href={`/${locale}/festivals/gujarati-festivals-2027`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 font-bold"
          >
            <Sparkles className="h-4 w-4 text-orange-500" />
            <span>Gujarati Festivals 2027 →</span>
          </Link>
          <Link
            href={`/${locale}/devotional`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Flame className="h-4 w-4 text-purple-500" />
            <span>Devotional Aartis & Puja Vidhi</span>
          </Link>
          <Link
            href={`/${locale}/calendar/hindu-calendar`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Calendar className="h-4 w-4 text-amber-500" />
            <span>Hindu Lunar Calendar</span>
          </Link>
          <Link
            href={`/${locale}/holidays`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Flame className="h-4 w-4 text-rose-500" />
            <span>International Public Holidays</span>
          </Link>
        </div>
      </div>

      {/* Interactive 2026 Festival Explorer */}
      <section id="interactive-festivals" className="space-y-4">
        <FestivalsExperience />
      </section>

      {/* Festival Category Sections */}
      <div className="space-y-8">
        {festivalCategories.map((cat) => (
          <section key={cat.id} id={cat.id} className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Flame className="h-5 w-5 text-purple-500" />
                {cat.title}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">{cat.desc}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {cat.items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200/90 bg-card p-4 shadow-sm dark:border-zinc-800 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 block mb-1">
                      {item.month}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </h3>
                    <p className="mt-1.5 text-xs text-zinc-500 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Internal Linking Engine: Diwali connected relationships */}
      <InternalLinkingEngine
        relationshipKey="diwali"
        currentEcosystem="festivals"
        sectionTitle="Diwali & Festive Ritual Ecosystem Connections"
        sectionSubtitle="Connect sacred festival dates with authentic Puja Vidhis, Aartis, and Lunisolar calendar timings."
      />
    </div>
  );
}
