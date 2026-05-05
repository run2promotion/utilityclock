import type { ToolCategoryId } from "@/data/tool-schema";
import type { AppLocale } from "@/i18n/config";
import { isFeatureEnabled } from "@/lib/feature-flags";

const LOCALE_KEYWORD_SUFFIX: Partial<Record<AppLocale, string>> = {
  en: "precision timer online",
  es: "temporizador preciso en linea",
  fr: "minuteur precis en ligne",
  de: "praeziser timer online",
  pt: "temporizador preciso online",
  hi: "satik online timer",
  ja: "seikaku na onrain taima",
  ar: "moaqqat daqiq online",
};

const CATEGORY_HINT: Record<ToolCategoryId, string> = {
  timer: "countdown",
  alarm: "alarm clock",
  stopwatch: "stopwatch",
  "world-clock": "world time",
};

export function withLocaleKeywordExpansion(
  locale: AppLocale,
  category: ToolCategoryId,
  description: string,
): string {
  if (!isFeatureEnabled("localeKeywordExpansion")) return description;
  const suffix = LOCALE_KEYWORD_SUFFIX[locale];
  if (!suffix) return description;
  return `${description} ${CATEGORY_HINT[category]} ${suffix}.`;
}
