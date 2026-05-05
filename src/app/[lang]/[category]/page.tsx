import { AdSlot } from "@/components/ads/AdSlot";
import { AlarmTool } from "@/components/tools/AlarmTool";
import { StopwatchTool } from "@/components/tools/StopwatchTool";
import { TimerToolExperience } from "@/components/tools/TimerToolExperience";
import { WorldClockHub } from "@/components/tools/WorldClock";
import {
  CATEGORIES,
  getToolDefinition,
  getToolSlugsForCategory,
  type ToolCategoryId,
} from "@/data/tools";
import { getLocalizedCategoryMeta } from "@/i18n/category-overrides";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { hreflangAlternates } from "@/i18n/alternates";
import { getDictionary } from "@/i18n/dictionary";
import {
  buildPath,
  getLocalizedCategorySegment,
  resolveRouteCategory,
} from "@/i18n/routing";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const siteBase =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://utilityclock.com";

type Props = { params: Promise<{ lang: string; category: string }> };

export function generateStaticParams() {
  const ids = Object.keys(CATEGORIES) as ToolCategoryId[];
  const out: { lang: string; category: string }[] = [];
  for (const lang of locales) {
    const l = lang as AppLocale;
    for (const id of ids) {
      out.push({
        lang,
        category: getLocalizedCategorySegment(id, l),
      });
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category: catSeg } = await params;
  if (!isAppLocale(lang)) return {};
  const locale = lang as AppLocale;
  const resolved = resolveRouteCategory(catSeg, locale);
  if (!resolved || resolved === "holidays") return {};
  const category = resolved as ToolCategoryId;
  const meta = getLocalizedCategoryMeta(locale, category);
  const alt = hreflangAlternates(siteBase, locale, {
    type: "hub",
    category,
  });
  return {
    title: meta.label,
    description: meta.description,
    alternates: {
      canonical: alt.canonical,
      languages: alt.languages,
    },
    openGraph: {
      title: meta.label,
      description: meta.description,
    },
  };
}

export default async function CategoryHubPage({ params }: Props) {
  const { lang, category: catSeg } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;
  const resolved = resolveRouteCategory(catSeg, locale);
  if (!resolved || resolved === "holidays") notFound();
  const category = resolved as ToolCategoryId;
  const meta = getLocalizedCategoryMeta(locale, category);
  const slugs = getToolSlugsForCategory(category);
  const dict = getDictionary(locale);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {meta.label}
        </h1>
        <p className="mt-2 max-w-2xl text-zinc-600 dark:text-zinc-400">
          {meta.description}
        </p>
      </div>

      {category === "alarm" && (
        <div className="space-y-4">
          <AlarmTool />
        </div>
      )}

      {category === "timer" && <TimerToolExperience />}

      {category === "stopwatch" && <StopwatchTool />}

      {category === "world-clock" && <WorldClockHub />}

      <AdSlot slotId={`hub-${category}-top`} routeType="hub" />

      <section>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-zinc-500">
          {dict.hub.presetPages}
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {slugs.map((slug) => {
            const def = getToolDefinition(category, slug);
            if (!def) return null;
            const href = buildPath(locale, {
              type: "tool",
              category,
              canonicalSlug: slug,
            });
            return (
              <li key={slug}>
                <Link
                  href={href}
                  className="block rounded-xl border border-zinc-200 bg-white/60 p-4 transition hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700"
                >
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {def.title}
                  </span>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                    {def.description}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="text-sm text-zinc-500">
        <p>{dict.hub.otherCategories}</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {(Object.keys(CATEGORIES) as ToolCategoryId[])
            .filter((c) => c !== category)
            .map((c) => (
              <li key={c}>
                <Link
                  href={buildPath(locale, { type: "hub", category: c })}
                  className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  {getLocalizedCategoryMeta(locale, c).label}
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
