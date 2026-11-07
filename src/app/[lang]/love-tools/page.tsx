import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { InternalLinkingEngine } from "@/components/navigation/InternalLinkingEngine";
import { LoveToolsExperience } from "@/components/tools/LoveToolsExperience";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { siteOrigin } from "@/lib/site-url";
import { Moon, Sparkles } from "lucide-react";
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
  const canonicalUrl = `${siteBase}/${locale}/love-tools`;

  return {
    title: "Love Calculator & Relationship Compatibility · FLAMES, Zodiac & Numerology",
    description:
      "Fun and engaging relationship tools: True Love Calculator, classic FLAMES name test, Friendship score, Zodiac sign compatibility, and Life Path Numerology.",
    alternates: {
      canonical: canonicalUrl,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteBase}/${l}/love-tools`]),
      ),
    },
    openGraph: {
      title: "Love Calculator & Relationship Compatibility · FLAMES, Zodiac & Numerology",
      description:
        "Fun and engaging relationship tools: True Love Calculator, classic FLAMES name test, Friendship score, Zodiac sign compatibility, and Life Path Numerology.",
    },
  };
}

export default async function LoveToolsPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;

  const crumbs: BreadcrumbItem[] = [
    { name: "Home", href: `/${locale}`, item: `${siteBase}/${locale}` },
    { name: "Love & Relationship Tools", item: `${siteBase}/${locale}/love-tools` },
  ];

  return (
    <div className="space-y-10">
      <Breadcrumbs items={crumbs} />

      {/* Hero Header */}
      <div className="rounded-3xl border border-pink-500/20 bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-700 dark:text-pink-300">
            Relationship Calculators & Games
          </span>
          <span className="text-xs text-zinc-500">Playful & Insightful Compatibility</span>
        </div>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Love & Relationship Tools
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Explore relationship chemistry through fun name compatibility tests, the nostalgic FLAMES game,
          friendship affinity checks, and astrological element matches.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
          <Link
            href={`/${locale}/astrology#guna-milan`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-pink-600 px-4 py-2 text-white shadow-sm transition hover:bg-pink-700"
          >
            <Sparkles className="h-4 w-4" />
            <span>Vedic 36 Guna Milan</span>
          </Link>
          <Link
            href={`/${locale}/astrology`}
            className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-zinc-800 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <Moon className="h-4 w-4 text-indigo-500" />
            <span>Zodiac Astrological Charts</span>
          </Link>
        </div>
      </div>

      {/* Interactive Tools Experience */}
      <LoveToolsExperience />

      {/* Internal Linking Engine */}
      <InternalLinkingEngine
        relationshipKey="love-tools"
        currentEcosystem="love-tools"
        sectionTitle="Connected Astrological & Compatibility Portals"
      />
    </div>
  );
}
