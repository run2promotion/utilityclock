import { HolidayCountdown } from "@/components/holidays/HolidayCountdown";
import { EmbedBodyClass } from "@/components/embed/EmbedBodyClass";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/nav/Breadcrumbs";
import { DynamicSEOContent } from "@/components/seo/DynamicSEOContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShareBar } from "@/components/seo/ShareBar";
import { ToolDescription } from "@/components/seo/ToolDescription";
import { PopularToolsAside } from "@/components/tools/PopularToolsAside";
import { AlarmTool } from "@/components/tools/AlarmTool";
import { StopwatchTool } from "@/components/tools/StopwatchTool";
import { TimerToolExperience } from "@/components/tools/TimerToolExperience";
import { WorldClockCityView } from "@/components/tools/WorldClock";
import { DateTools } from "@/components/tools/DateTools";
import { CalculatorTools } from "@/components/tools/CalculatorTools";
import { TimeTools } from "@/components/tools/TimeTools";
import { ProductivityTools } from "@/components/tools/ProductivityTools";
import { ConverterTools } from "@/components/tools/ConverterTools";
import { FinanceTools } from "@/components/tools/FinanceTools";
import { TextTools } from "@/components/tools/TextTools";
import { getLocalizedCategoryMeta } from "@/i18n/category-overrides";
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
import { buildSeoMeta } from "@/lib/seo-metadata";
import { withLocaleKeywordExpansion } from "@/lib/locale-seo";
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
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://utilityclock.com";

function hubNavLabel(
  locale: AppLocale,
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
    case "date-calendar":
    case "calculators":
    case "productivity":
    case "converters":
    case "finance":
    case "text":
      return getLocalizedCategoryMeta(locale, cat).label;
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
      name: hubNavLabel(locale, messages, category),
      href: hubPath,
      item: `${origin}${hubPath}`,
    },
    {
      name: currentTitle,
      item: canonicalUrl,
    },
  ];
}

type Props = {
  params: Promise<{ lang: string; category: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function withBenefit(title: string, category: ToolCategoryId): string {
  if (title.includes(" - ")) return title;
  const benefit: Record<ToolCategoryId, string> = {
    alarm: "Set a Precise Wake Reminder",
    timer: "Start a Fast Countdown",
    stopwatch: "Track Time with Accurate Laps",
    "world-clock": "See Live Local Time Instantly",
    "date-calendar": "Calculate Dates & Business Days",
    calculators: "Fast Accurate Online Calculation",
    productivity: "Optimize Your Routine & Focus",
    converters: "Fast Accurate Unit Conversion",
    finance: "Calculate EMI, Interest & Margins",
    text: "Format, Count & Clean Text Online",
  };
  return `${title} - ${benefit[category]}`;
}

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
    const localized = getLocalizedToolMetadata(
      locale,
      category,
      canonicalSlug,
      def,
    );
    const { title, description } = buildSeoMeta({
      title: withBenefit(localized.title, category),
      description: withLocaleKeywordExpansion(locale, category, localized.description),
    });
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
      const meta = buildSeoMeta({
        title: `${holidayPageTitle(h, next.getFullYear())} - Start Free Countdown`,
        description: withLocaleKeywordExpansion(
          locale,
          "timer",
          holidayPageDescription(h, next),
        ),
      });
      const alt = hreflangAlternates(siteBase, locale, {
        type: "tool",
        category: "timer",
        canonicalSlug,
      });
      return {
        title: meta.title,
        description: meta.description,
        alternates: {
          canonical: alt.canonical,
          languages: alt.languages,
        },
        openGraph: { title: meta.title, description: meta.description },
      };
    }
  }

  if (category === "world-clock") {
    const wc = resolveWorldClockFromSlug(canonicalSlug);
    if (wc) {
      const localized = getLocalizedWorldClockMetadata(
        locale,
        wc.label,
        wc.timeZone,
      );
      const { title, description } = buildSeoMeta({
        title: withBenefit(localized.title, "world-clock"),
        description: withLocaleKeywordExpansion(
          locale,
          "world-clock",
          localized.description,
        ),
      });
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

export default async function ToolSlugPage({ params, searchParams }: Props) {
  const { lang, category: catSeg, slug: urlSlug } = await params;
  const sp = await searchParams;
  const embedMode = sp.embed === "1";
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
    if (embedMode) {
      return (
        <>
          <EmbedBodyClass active />
          <div className="w-full">
            <HolidayCountdown holiday={holiday} />
          </div>
        </>
      );
    }
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_220px] lg:items-start">
        <div className="min-w-0 space-y-6">
          <Breadcrumbs items={crumbs} />
          <JsonLd name={jsonName} description={jsonDesc} url={canonicalUrl} />
          <ShareBar url={canonicalUrl} title={jsonName} />
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

  if (embedMode && category === "timer" && def?.timer) {
    return (
      <>
        <EmbedBodyClass active />
        <div className="w-full">
          <TimerToolExperience
            initialSeconds={def.timer.totalSeconds}
            pageTitle={def.title}
            embedOnly
          />
        </div>
      </>
    );
  }

  if (embedMode && category === "alarm" && def?.alarm) {
    return (
      <>
        <EmbedBodyClass active />
        <div className="w-full">
          <AlarmTool
            initialPreset={{ hour: def.alarm.hour, minute: def.alarm.minute }}
            embedOnly
          />
        </div>
      </>
    );
  }

  if (embedMode && category === "stopwatch" && def?.stopwatch !== undefined) {
    return (
      <>
        <EmbedBodyClass active />
        <div className="w-full">
          <StopwatchTool embedOnly />
        </div>
      </>
    );
  }

  if (embedMode && category === "world-clock" && worldResolved) {
    return (
      <>
        <EmbedBodyClass active />
        <div className="w-full">
          <WorldClockCityView
            timeZone={worldResolved.timeZone}
            label={worldResolved.label}
            embedOnly
          />
        </div>
      </>
    );
  }

  if (embedMode && category === "date-calendar") {
    return (
      <>
        <EmbedBodyClass active />
        <div className="w-full">
          <DateTools activeSlug={canonicalSlug} />
        </div>
      </>
    );
  }

  if (embedMode && category === "calculators") {
    const isTime = [
      "time-duration-calculator",
      "time-converter",
      "work-hours-calculator",
      "break-time-calculator",
    ].includes(canonicalSlug);
    return (
      <>
        <EmbedBodyClass active />
        <div className="w-full">
          {isTime ? (
            <TimeTools activeSlug={canonicalSlug} embedOnly />
          ) : (
            <CalculatorTools activeSlug={canonicalSlug} />
          )}
        </div>
      </>
    );
  }

  if (embedMode && category === "productivity") {
    return (
      <>
        <EmbedBodyClass active />
        <div className="w-full">
          <ProductivityTools activeSlug={canonicalSlug} />
        </div>
      </>
    );
  }

  if (embedMode && category === "converters") {
    return (
      <>
        <EmbedBodyClass active />
        <div className="w-full">
          <ConverterTools activeSlug={canonicalSlug} embedOnly />
        </div>
      </>
    );
  }

  if (embedMode && category === "finance") {
    return (
      <>
        <EmbedBodyClass active />
        <div className="w-full">
          <FinanceTools activeSlug={canonicalSlug} embedOnly />
        </div>
      </>
    );
  }

  if (embedMode && category === "text") {
    return (
      <>
        <EmbedBodyClass active />
        <div className="w-full">
          <TextTools activeSlug={canonicalSlug} embedOnly />
        </div>
      </>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_220px] lg:items-start">
      <div className="min-w-0 space-y-8">
        <div className="embed-hidden">
          <Breadcrumbs items={crumbs} />
        </div>
        <JsonLd
          name={jsonName}
          description={jsonDesc}
          url={canonicalUrl}
        />
        <header className="embed-hidden">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {h1Title}
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-400">{jsonDesc}</p>
        </header>

        <div className="embed-hidden">
          <ShareBar url={canonicalUrl} title={h1Title} />
        </div>

        {category === "alarm" && def?.alarm && (
          <AlarmTool initialPreset={{ hour: def.alarm.hour, minute: def.alarm.minute }} />
        )}

        {category === "timer" && def?.timer && (
          <TimerToolExperience
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

        {category === "date-calendar" && (
          <DateTools activeSlug={canonicalSlug} />
        )}

        {category === "calculators" &&
          ([
            "time-duration-calculator",
            "time-converter",
            "work-hours-calculator",
            "break-time-calculator",
          ].includes(canonicalSlug) ? (
            <TimeTools activeSlug={canonicalSlug} />
          ) : (
            <CalculatorTools activeSlug={canonicalSlug} />
          ))}

        {category === "productivity" && (
          <ProductivityTools activeSlug={canonicalSlug} />
        )}

        {category === "converters" && (
          <ConverterTools activeSlug={canonicalSlug} />
        )}

        {category === "finance" && (
          <FinanceTools activeSlug={canonicalSlug} />
        )}

        {category === "text" && (
          <TextTools activeSlug={canonicalSlug} />
        )}

        <div className="embed-hidden">
          <ToolDescription
            category={category}
            slug={canonicalSlug}
            pageTitle={h1Title}
            cityLabel={worldResolved?.label}
          />
        </div>

        <div className="embed-hidden">
          <DynamicSEOContent
            locale={locale}
            category={category}
            slug={canonicalSlug}
            timerTotalSeconds={def?.timer?.totalSeconds}
            worldTimeZone={worldResolved?.timeZone}
            worldLabel={worldResolved?.label}
          />
        </div>
      </div>
      <div className="embed-hidden">
        <PopularToolsAside
          locale={locale}
          category={category}
          worldTimeZone={worldResolved?.timeZone}
          excludeWorldSlug={category === "world-clock" ? canonicalSlug : undefined}
        />
      </div>
    </div>
  );
}
