import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { BookOpen, Sparkles, Sun } from "lucide-react";
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
  const canonicalUrl = `${siteBase}/${locale}/devotional`;

  return {
    title: "Devotional & Spiritual Library · Aartis, Chalisas, Mantras & Puja Vidhi",
    description:
      "Authentic Vedic mantras, sacred Aartis, revered Chalisas, Stotras, Vrat Kathas, and step-by-step Puja Vidhi with pure Sanskrit texts and meanings.",
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteBase}/${l}/devotional`]),
      ),
    },
    openGraph: {
      title: "Devotional & Spiritual Library · Aartis, Chalisas, Mantras & Puja Vidhi",
      description:
        "Authentic Vedic mantras, sacred Aartis, revered Chalisas, Stotras, Vrat Kathas, and step-by-step Puja Vidhi with pure Sanskrit texts and meanings.",
    },
  };
}

export default async function DevotionalPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Devotional Library", item: `${siteBase}/${locale}/devotional` },
  ];

  const prayers = [
    {
      id: "aarti",
      title: "Sacred Aartis (आरती संग्रह)",
      items: [
        { name: "Shri Lakshmi Aarti", deity: "Goddess Lakshmi", desc: "Om Jai Lakshmi Mata - sung during Diwali and Friday twilight worship." },
        { name: "Shri Ganesh Aarti", deity: "Lord Ganesha", desc: "Jai Ganesh Jai Ganesh Deva - invoked at the beginning of all auspicious ceremonies." },
        { name: "Shri Hanuman Aarti", deity: "Lord Hanuman", desc: "Aarti Kije Hanuman Lala Ki - remover of fear, afflictions, and sorrow." },
        { name: "Shri Shiv Aarti", deity: "Lord Shiva", desc: "Om Jai Shiv Omkara - eternal evening hymn to Mahadeva." },
      ],
    },
    {
      id: "chalisa",
      title: "Revered Chalisas (चालीसा संग्रह)",
      items: [
        { name: "Shri Hanuman Chalisa", deity: "Goswami Tulsidas", desc: "40 sacred verses invoking the divine strength, wisdom, and protection of Hanuman Ji." },
        { name: "Shri Shiv Chalisa", deity: "Lord Shiva", desc: "40 verses praising the glory, compassion, and boons of Lord Shankara." },
        { name: "Shri Durga Chalisa", deity: "Maa Durga", desc: "Sacred hymn to the Supreme Divine Mother for inner courage and victory over obstacles." },
        { name: "Shri Gayatri Chalisa", deity: "Maa Gayatri", desc: "Devotional verses seeking spiritual illumination, wisdom, and righteousness." },
      ],
    },
    {
      id: "mantra",
      title: "Vedic Mantras (वैदिक महामंत्र)",
      items: [
        { name: "Gayatri Mahamantra", source: "Rigveda 3.62.10", desc: "Om Bhur Bhuvaḥ Svaḥ Tat-Savitur Vareṇyaṃ Bhargo Devasya Dhīmahi Dhiyo Yo Naḥ Pracodayāt." },
        { name: "Maha Mrityunjaya Mantra", source: "Rigveda 7.59.12", desc: "Om Tryambakaṃ Yajāmahe Sugandhiṃ Puṣṭi-Vardhanam Urvārukam-Iva Bandhanān Mṛtyor-Mukṣīya Māmṛtāt." },
        { name: "Shanti Mantra", source: "Upanishads", desc: "Om Sarve Bhavantu Sukhinah Sarve Santu Niramayah - universal prayer for peace and health." },
      ],
    },
  ];

  return (
    <div className="space-y-10">
      <Breadcrumbs items={crumbs} />

      {/* Hero Header */}
      <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
            Bhakti & Upasana (भक्ति व उपासना)
          </span>
          <span className="text-xs text-zinc-500">Pure Texts & Authentic Recitation</span>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Devotional & Spiritual Library
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Immerse yourself in authentic Indian spiritual hymns, traditional Aartis, 40-verse Chalisas,
          Vedic chanting mantras, and complete Puja Vidhi protocols for auspicious occasions.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
          <a
            href="#chalisa"
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-white shadow-sm transition hover:bg-rose-700"
          >
            <Sparkles className="h-4 w-4" />
            <span>Hanuman Chalisa</span>
          </a>
          <a
            href="#mantra"
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <BookOpen className="h-4 w-4 text-rose-500" />
            <span>Vedic Mantras</span>
          </a>
          <Link
            href={`/${locale}/panchang`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Sun className="h-4 w-4 text-amber-500" />
            <span>Daily Puja Muhurat</span>
          </Link>
        </div>
      </div>

      {/* Devotional Collections */}
      <div className="space-y-8">
        {prayers.map((sec) => (
          <section key={sec.id} id={sec.id} className="space-y-4">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-rose-500" />
              {sec.title}
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sec.items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200/90 bg-card p-5 shadow-sm dark:border-zinc-800"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
                    {"source" in item ? item.source : item.deity}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs text-zinc-500 leading-relaxed font-serif italic">
                    &quot;{item.desc}&quot;
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Internal Linking Engine: Diwali connected relationships */}
      <InternalLinkingEngine
        relationshipKey="diwali"
        currentEcosystem="devotional"
        sectionTitle="Connected Puja Vidhi & Festival Guides"
      />
    </div>
  );
}
