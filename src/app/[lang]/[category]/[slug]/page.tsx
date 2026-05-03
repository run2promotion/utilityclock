import { HolidayCountdown } from "@/components/holidays/HolidayCountdown";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { DynamicSEOContent } from "@/components/seo/DynamicSEOContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { ToolDescription } from "@/components/seo/ToolDescription";
import { PopularToolsAside } from "@/components/tools/PopularToolsAside";
import { AlarmTool } from "@/components/tools/AlarmTool";
import { StopwatchTool } from "@/components/tools/StopwatchTool";
import { TimerTool } from "@/components/tools/TimerTool";
import { WorldClockCityView } from "@/components/tools/WorldClock";
import {
  getAllHolidayTimerSlugs,
  getHolidayBySlug,
  getNextHolidayOccurrence,
  holidayPageDescription,
  holidayPageTitle,
} from "@/data/holidays";
import {
  getToolDefinition,
  getAllToolSlugs,
  type ToolCategoryId,
} from "@/data/tools";
import { hreflangAlternates } from "@/i18n/alternates";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import {
  getLocalizedToolMetadata,
  getLocalizedWorldClockMetadata,
} from "@/i18n/tool-metadata";
import { getDictionary } from "@/i18n/dictionary";
import {
  buildPath,
  getLocalizedCategorySegment,
  localizeToolSlug,
  resolveCanonicalSlug,
  resolveRouteCategory,
} from "@/i18n/routing";
import { resolveWorldClockFromSlug } from "@/data/worldClockSlugs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const siteBase =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function hubNavLabel(
  messages: ReturnType<typeof getDictionary>,
  cat: ToolCategoryId,
): string {
  switch (cat) {
    case "alarm":
      return messages.nav.alarm;
    case "timer":
      return messages.nav.timer;
    case "stopwatch":
      return messages.nav.stopwatch;
    case "world-clock":
      return messages.nav.worldClock;
    default: {
      const _exhaustive: never = cat;
      return _exhaustive;
    }
  }
}

function toolBreadcrumbItems(
  locale: AppLocale,
  messages: ReturnType<typeof getDictionary>,
  category: ToolCategoryId,
  currentTitle: string,
  canonicalUrl: string,
): BreadcrumbItem[] {
  const origin = siteBase.replace(/\/$/, "");
  const homePath = buildPath(locale, { type: "home" });
  const hubPath = buildPath(locale, { type: "hub", category });
  return [
    {
      name: messages.footer.breadcrumbHome,
      href: homePath,
      item: `${origin}${homePath}`,
    },
    {
      name: hubNavLabel(messages, category),
      href: hubPath,
      item: `${origin}${hubPath}`,
    },
    {
      name: currentTitle,
      item: canonicalUrl,
    },
  ];
}

type Props = { params: Promise<{ lang: string; category: string; slug: string }> };

export function generateStaticParams() {
  const out: { lang: string; category: string; slug: string }[] = [];
  for (const lang of locales) {
    const l = lang as AppLocale;
    for (const { category, slug } of getAllToolSlugs()) {
      out.push({
        lang,
        category: getLocalizedCategorySegment(category, l),
        slug: localizeToolSlug(slug, l, category),
      });
    }
    for (const { category, slug } of getAllHolidayTimerSlugs()) {
      out.push({
        lang,
        category: getLocalizedCategorySegment(category, l),
        slug: localizeToolSlug(slug, l, category),
      });
    }
  }
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, category: catSeg, slug: urlSlug } = await params;
  if (!isAppLocale(lang)) return {};
  const locale = lang as AppLocale;
  const resolvedCat = resolveRouteCategory(catSeg, locale);
  if (!resolvedCat || resolvedCat === "holidays") return {};
  const category = resolvedCat as ToolCategoryId;
  const canonicalSlug = resolveCanonicalSlug(urlSlug, locale, category);
  const def = getToolDefinition(category, canonicalSlug);

  if (def) {
    const { title, description } = getLocalizedToolMetadata(
      locale,
      category,
      canonicalSlug,
      def,
    );
    const alt = hreflangAlternates(siteBase, locale, {
      type: "tool",
      category,
      canonicalSlug,
    });
    return {
      title,
      description,
      alternates: {
        canonical: alt.canonical,
        languages: alt.languages,
      },
      openGraph: { title, description },
    };
  }

  if (category === "timer") {
    const h = getHolidayBySlug(canonicalSlug);
    if (h) {
      const next = getNextHolidayOccurrence(h);
      const title = holidayPageTitle(h, next.getFullYear());
      const description = holidayPageDescription(h, next);
      const alt = hreflangAlternates(siteBase, locale, {
        type: "tool",
        category: "timer",
        canonicalSlug,
      });
      return {
        title,
        description,
        alternates: {
          canonical: alt.canonical,
          languages: alt.languages,
        },
        openGraph: { title, description },
      };
    }
  }

  if (category === "world-clock") {
    const wc = resolveWorldClockFromSlug(canonicalSlug);
    if (wc) {
      const { title, description } = getLocalizedWorldClockMetadata(
        locale,
        wc.label,
        wc.timeZone,
      );
      const alt = hreflangAlternates(siteBase, locale, {
        type: "tool",
        category: "world-clock",
        canonicalSlug,
      });
      return {
        title,
        description,
        alternates: {
          canonical: alt.canonical,
          languages: alt.languages,
        },
        openGraph: { title, description },
      };
    }
  }

  return {};
}

export default async function ToolSlugPage({ params }: Props) {
  const { lang, category: catSeg, slug: urlSlug } = await params;
  if (!isAppLocale(lang)) notFound();
  const locale = lang as AppLocale;
  const resolvedCat = resolveRouteCategory(catSeg, locale);
  if (!resolvedCat || resolvedCat === "holidays") notFound();
  const category = resolvedCat as ToolCategoryId;
  const canonicalSlug = resolveCanonicalSlug(urlSlug, locale, category);
  const def = getToolDefinition(category, canonicalSlug);
  const holiday = category === "timer" ? getHolidayBySlug(canonicalSlug) : undefined;

  const worldResolved =
    category === "world-clock"
      ? (def?.worldClock ?? resolveWorldClockFromSlug(canonicalSlug))
      : undefined;

  if (!def && category === "timer" && !holiday) notFound();
  if (!def && category !== "world-clock" && category !== "timer") notFound();
  if (category === "world-clock" && !worldResolved) notFound();

  const canonicalUrl = hreflangAlternates(siteBase, locale, {
    type: "tool",
    category,
    canonicalSlug,
  }).canonical;

  const messages = getDictionary(locale);

  if (holiday) {
    const next = getNextHolidayOccurrence(holiday);
    const jsonName = holidayPageTitle(holiday, next.getFullYear());
    const jsonDesc = holidayPageDescription(holiday, next);
    const crumbs = toolBreadcrumbItems(
      locale,
      messages,
      category,
      jsonName,
      canonicalUrl,
    );
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_220px] lg:items-start">
        <div className="min-w-0 space-y-6">
          <Breadcrumbs items={crumbs} />
          <JsonLd name={jsonName} description={jsonDesc} url={canonicalUrl} />
          <HolidayCountdown holiday={holiday} />
        </div>
        <PopularToolsAside locale={locale} category={category} />
      </div>
    );
  }

  let h1Title: string;
  let jsonName: string;
  let jsonDesc: string;
  if (category === "world-clock" && worldResolved) {
    const m = getLocalizedWorldClockMetadata(
      locale,
      worldResolved.label,
      worldResolved.timeZone,
    );
    h1Title = m.title;
    jsonName = m.title;
    jsonDesc = m.description;
  } else if (def) {
    const m = getLocalizedToolMetadata(locale, category, canonicalSlug, def);
    h1Title = m.title;
    jsonName = m.title;
    jsonDesc = m.description;
  } else {
    h1Title = `World clock — ${worldResolved?.label ?? canonicalSlug}`;
    jsonName = h1Title;
    jsonDesc = `Current time and date in ${worldResolved?.label} (${worldResolved?.timeZone}).`;
  }

  const crumbs = toolBreadcrumbItems(locale, messages, category, h1Title, canonicalUrl);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_220px] lg:items-start">
      <div className="min-w-0 space-y-8">
        <Breadcrumbs items={crumbs} />
        <JsonLd
          name={jsonName}
          description={jsonDesc}
          url={canonicalUrl}
        />
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {h1Title}
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-400">{jsonDesc}</p>
        </header>

        {category === "alarm" && def?.alarm && (
          <AlarmTool initialPreset={{ hour: def.alarm.hour, minute: def.alarm.minute }} />
        )}

        {category === "timer" && def?.timer && (
          <TimerTool
            initialSeconds={def.timer.totalSeconds}
            pageTitle={def.title}
          />
        )}

        {category === "stopwatch" && def?.stopwatch !== undefined && <StopwatchTool />}

        {category === "world-clock" && worldResolved && (
          <WorldClockCityView
            timeZone={worldResolved.timeZone}
            label={worldResolved.label}
          />
        )}

        <ToolDescription
          category={category}
          slug={canonicalSlug}
          pageTitle={h1Title}
          cityLabel={worldResolved?.label}
        />

        <DynamicSEOContent
          category={category}
          slug={canonicalSlug}
          timerTotalSeconds={def?.timer?.totalSeconds}
          worldTimeZone={worldResolved?.timeZone}
          worldLabel={worldResolved?.label}
        />
      </div>
      <PopularToolsAside
        locale={locale}
        category={category}
        worldTimeZone={worldResolved?.timeZone}
        excludeWorldSlug={category === "world-clock" ? canonicalSlug : undefined}
      />
    </div>
  );
}
