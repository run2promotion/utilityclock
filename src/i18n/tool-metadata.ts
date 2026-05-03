import type { ToolCategoryId } from "@/data/tool-schema";
import type { ToolDefinition } from "@/data/tool-schema";
import type { AppLocale } from "./config";
import { getDictionary } from "./dictionary";

export function getLocalizedToolMetadata(
  locale: AppLocale,
  category: ToolCategoryId,
  canonicalSlug: string,
  def: ToolDefinition,
): { title: string; description: string } {
  if (locale === "en") {
    return { title: def.title, description: def.description };
  }

  const d = getDictionary(locale);
  const m = /^(\d+)-minute-timer$/.exec(canonicalSlug);
  if (m && category === "timer") {
    const n = m[1];
    return {
      title: d.meta.patterns.timer_minutes_title.replace("{n}", n),
      description: d.meta.patterns.timer_minutes_desc.replace("{n}", n),
    };
  }

  return { title: def.title, description: def.description };
}

export function getLocalizedWorldClockMetadata(
  locale: AppLocale,
  cityLabel: string,
  timeZone: string,
): { title: string; description: string } {
  const d = getDictionary(locale);
  return {
    title: d.meta.patterns.world_time_title.replace("{city}", cityLabel),
    description: d.meta.patterns.world_time_desc
      .replace("{city}", cityLabel)
      .replace("{tz}", timeZone),
  };
}
