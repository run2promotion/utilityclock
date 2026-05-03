import type { ToolCategoryId } from "@/data/tool-schema";
import type { LegalPageId } from "@/data/legal-pages";
import { isLegalPageId } from "@/data/legal-pages";
import type { AppLocale } from "./config";
import { isAppLocale, locales } from "./config";

export type { LegalPageId } from "@/data/legal-pages";
export { isLegalPageId, LEGAL_PAGE_IDS } from "@/data/legal-pages";

export function buildLegalPath(locale: AppLocale, page: LegalPageId): string {
  return `/${locale}/legal/${page}`;
}

/** URL segment keys including the holidays hub (not a tool category). */
export type RouteCategory = ToolCategoryId | "holidays";

const CATEGORY_SEGMENTS: Record<AppLocale, Record<RouteCategory, string>> = {
  en: {
    alarm: "alarm",
    timer: "timer",
    stopwatch: "stopwatch",
    "world-clock": "world-clock",
    holidays: "holidays",
  },
  de: {
    alarm: "wecker",
    timer: "timer",
    stopwatch: "stoppuhr",
    "world-clock": "weltzeit",
    /** Must match static route folder `holidays` (not localized in the URL). */
    holidays: "holidays",
  },
  fr: {
    alarm: "reveil",
    timer: "minuteur",
    stopwatch: "chronometre",
    "world-clock": "horloge-mondiale",
    holidays: "holidays",
  },
  ja: {
    alarm: "alarm",
    timer: "timer",
    stopwatch: "stopwatch",
    "world-clock": "sekai-tokei",
    holidays: "holidays",
  },
  es: {
    alarm: "alarma",
    timer: "temporizador",
    stopwatch: "cronometro",
    "world-clock": "reloj-mundial",
    holidays: "holidays",
  },
  pt: {
    alarm: "alarme",
    timer: "temporizador",
    stopwatch: "cronometro",
    "world-clock": "relogio-mundial",
    holidays: "holidays",
  },
  ar: {
    alarm: "munabbih",
    timer: "muaqqit",
    stopwatch: "stopwatch",
    "world-clock": "saat-alam",
    holidays: "holidays",
  },
  hi: {
    alarm: "alarm",
    timer: "timer",
    stopwatch: "stopwatch",
    "world-clock": "vishwa-ghadi",
    holidays: "holidays",
  },
};

const ACTIVITY: Record<
  string,
  Record<Exclude<AppLocale, "en">, string>
> = {
  "egg-timer": {
    de: "eier-timer",
    fr: "minuteur-oeuf",
    ja: "egg-timer",
    es: "temporizador-huevo",
    pt: "temporizador-ovo",
    ar: "bayd-timer",
    hi: "anda-timer",
  },
  "pomodoro-timer": {
    de: "pomodoro-timer",
    fr: "minuteur-pomodoro",
    ja: "pomodoro-timer",
    es: "temporizador-pomodoro",
    pt: "temporizador-pomodoro",
    ar: "pomodoro-timer",
    hi: "pomodoro-timer",
  },
  "meditation-timer": {
    de: "meditation-timer",
    fr: "minuteur-meditation",
    ja: "meditation-timer",
    es: "temporizador-meditacion",
    pt: "temporizador-meditacao",
    ar: "tafakkur-timer",
    hi: "dhyan-timer",
  },
  "workout-timer": {
    de: "workout-timer",
    fr: "minuteur-sport",
    ja: "workout-timer",
    es: "temporizador-entrenamiento",
    pt: "temporizador-treino",
    ar: "riyada-timer",
    hi: "workout-timer",
  },
};

function minuteLocalized(n: number, locale: AppLocale): string {
  if (locale === "en") return `${n}-minute-timer`;
  const table: Record<Exclude<AppLocale, "en">, string> = {
    de: `${n}-minuten-timer`,
    fr: `${n}-minutes-chrono`,
    ja: `${n}-fun-timer`,
    es: `${n}-minutos`,
    pt: `${n}-minutos`,
    ar: `${n}-daqaiq`,
    hi: `${n}-minute-timer`,
  };
  return table[locale as Exclude<AppLocale, "en">];
}

function parseMinuteLocalized(
  slug: string,
  locale: AppLocale,
): number | null {
  if (locale === "en") {
    const m = /^(\d+)-minute-timer$/.exec(slug);
    return m ? Number(m[1]) : null;
  }
  const patterns: Record<Exclude<AppLocale, "en">, RegExp> = {
    de: /^(\d+)-minuten-timer$/,
    fr: /^(\d+)-minutes-chrono$/,
    ja: /^(\d+)-fun-timer$/,
    es: /^(\d+)-minutos$/,
    pt: /^(\d+)-minutos$/,
    ar: /^(\d+)-daqaiq$/,
    hi: /^(\d+)-minute-timer$/,
  };
  const p = patterns[locale as Exclude<AppLocale, "en">];
  const m = p.exec(slug);
  return m ? Number(m[1]) : null;
}

const FIXED_TIMER_SLUGS: Record<
  string,
  Record<Exclude<AppLocale, "en">, string>
> = {
  "30-second-timer": {
    de: "30-sekunden-timer",
    fr: "30-secondes-chrono",
    ja: "30-byou-timer",
    es: "30-segundos",
    pt: "30-segundos",
    ar: "30-thanya",
    hi: "30-second-timer",
  },
  "90-second-timer": {
    de: "90-sekunden-timer",
    fr: "90-secondes-chrono",
    ja: "90-byou-timer",
    es: "90-segundos",
    pt: "90-segundos",
    ar: "90-thanya",
    hi: "90-second-timer",
  },
  "2-hour-timer": {
    de: "2-stunden-timer",
    fr: "2-heures-chrono",
    ja: "2-jikan-timer",
    es: "2-horas",
    pt: "2-horas",
    ar: "2-saa",
    hi: "2-hour-timer",
  },
};

export function getLocalizedCategorySegment(
  category: RouteCategory,
  locale: AppLocale,
): string {
  return CATEGORY_SEGMENTS[locale][category];
}

export function resolveRouteCategory(
  segment: string,
  locale: AppLocale,
): RouteCategory | null {
  const row = CATEGORY_SEGMENTS[locale];
  for (const key of Object.keys(row) as RouteCategory[]) {
    if (row[key] === segment) return key;
  }
  /** Shared English URL segments (bookmarks / external links). */
  const enRow = CATEGORY_SEGMENTS.en;
  for (const key of Object.keys(enRow) as RouteCategory[]) {
    if (enRow[key] === segment) return key;
  }
  return null;
}

export function localizeToolSlug(
  canonicalSlug: string,
  locale: AppLocale,
  category: ToolCategoryId,
): string {
  if (locale === "en") return canonicalSlug;
  if (category !== "timer") return canonicalSlug;

  const n = /^(\d+)-minute-timer$/.exec(canonicalSlug)?.[1];
  if (n) return minuteLocalized(Number(n), locale);

  const fixed = FIXED_TIMER_SLUGS[canonicalSlug];
  if (fixed) return fixed[locale as Exclude<AppLocale, "en">];

  const act = ACTIVITY[canonicalSlug];
  if (act) return act[locale as Exclude<AppLocale, "en">];

  return canonicalSlug;
}

export function resolveCanonicalSlug(
  urlSlug: string,
  locale: AppLocale,
  category: ToolCategoryId,
): string {
  if (category !== "timer") return urlSlug;

  if (locale === "en") return urlSlug;

  const pm = parseMinuteLocalized(urlSlug, locale);
  if (pm != null) return `${pm}-minute-timer`;

  for (const [canonical, locs] of Object.entries(FIXED_TIMER_SLUGS)) {
    if (locs[locale as Exclude<AppLocale, "en">] === urlSlug) return canonical;
  }
  for (const [canonical, locs] of Object.entries(ACTIVITY)) {
    if (locs[locale as Exclude<AppLocale, "en">] === urlSlug) return canonical;
  }

  return urlSlug;
}

export type ParsedLocalizedPath =
  | { kind: "home"; locale: AppLocale }
  | { kind: "holidays"; locale: AppLocale }
  | { kind: "legal"; locale: AppLocale; page: LegalPageId }
  | {
      kind: "hub";
      locale: AppLocale;
      category: ToolCategoryId;
    }
  | {
      kind: "tool";
      locale: AppLocale;
      category: ToolCategoryId;
      canonicalSlug: string;
    };

export function parseLocalizedPathname(pathname: string): ParsedLocalizedPath | null {
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  const parts = trimmed.split("/").filter(Boolean);
  if (parts.length === 0) return null;
  const loc = parts[0];
  if (!isAppLocale(loc)) return null;
  const locale = loc;

  if (parts.length === 1) return { kind: "home", locale };

  if (parts.length >= 2 && parts[1] === "legal") {
    if (parts.length === 3 && isLegalPageId(parts[2])) {
      return { kind: "legal", locale, page: parts[2] };
    }
    return null;
  }

  const seg1 = parts[1];
  const cat = resolveRouteCategory(seg1, locale);
  if (cat === "holidays") {
    return parts.length === 2 ? { kind: "holidays", locale } : null;
  }
  if (!cat) return null;

  if (parts.length === 2) {
    return { kind: "hub", locale, category: cat };
  }

  if (parts.length === 3) {
    const slug = parts[2];
    const canonicalSlug = resolveCanonicalSlug(slug, locale, cat);
    return { kind: "tool", locale, category: cat, canonicalSlug };
  }

  return null;
}

export function buildPath(
  locale: AppLocale,
  input:
    | { type: "home" }
    | { type: "holidays" }
    | { type: "hub"; category: ToolCategoryId }
    | { type: "tool"; category: ToolCategoryId; canonicalSlug: string },
): string {
  if (input.type === "home") return `/${locale}`;
  if (input.type === "holidays") {
    return `/${locale}/holidays`;
  }
  const catSeg = getLocalizedCategorySegment(input.category, locale);
  if (input.type === "hub") return `/${locale}/${catSeg}`;
  const slugSeg = localizeToolSlug(
    input.canonicalSlug,
    locale,
    input.category,
  );
  return `/${locale}/${catSeg}/${slugSeg}`;
}

/** Hreflang / sitemap: map each locale → full URL path (no origin). */
export function buildAlternatePaths(
  input:
    | { type: "home" }
    | { type: "holidays" }
    | { type: "legal"; page: LegalPageId }
    | { type: "hub"; category: ToolCategoryId }
    | {
        type: "tool";
        category: ToolCategoryId;
        canonicalSlug: string;
      },
): Record<AppLocale, string> {
  const out = {} as Record<AppLocale, string>;
  for (const locale of locales) {
    if (input.type === "home") out[locale] = buildPath(locale, { type: "home" });
    else if (input.type === "holidays")
      out[locale] = buildPath(locale, { type: "holidays" });
    else if (input.type === "legal")
      out[locale] = buildLegalPath(locale, input.page);
    else if (input.type === "hub")
      out[locale] = buildPath(locale, {
        type: "hub",
        category: input.category,
      });
    else {
      out[locale] = buildPath(locale, {
        type: "tool",
        category: input.category,
        canonicalSlug: input.canonicalSlug,
      });
    }
  }
  return out;
}
