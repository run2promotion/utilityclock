import type { ToolCategoryId } from "@/data/tool-schema";
import type { ToolDefinition } from "@/data/tool-schema";
import type { AppLocale } from "./config";
import { getDictionary } from "./dictionary";

/**
 * Cultural time formatting for localized alarm presets across supported locales.
 */
export function formatLocalizedAlarmTime(
  locale: AppLocale,
  h24: number,
  minute: number,
): string {
  const mm = minute.toString().padStart(2, "0");
  const isPM = h24 >= 12;
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;

  switch (locale) {
    case "de":
      // German 24h convention: "6:00 Uhr" or "16:15 Uhr"
      return `${h24}:${mm} Uhr`;
    case "fr":
      // French 24h convention: "06:00" or "16:15"
      return `${h24.toString().padStart(2, "0")}:${mm}`;
    case "es":
    case "pt":
      // Spanish and Portuguese: "6:00 AM" or "4:15 PM"
      return `${h12}:${mm} ${isPM ? "PM" : "AM"}`;
    case "ar":
      // Arabic: "6:00 ص" or "4:15 م"
      return `${h12}:${mm} ${isPM ? "م" : "ص"}`;
    case "ja":
      // Japanese: "午前6:00" or "午後4:15"
      return `${isPM ? "午後" : "午前"}${h12}:${mm}`;
    case "hi":
      // Hindi: "सुबह 6:00", "दोपहर 2:15", "शाम 6:00", "रात 11:45"
      if (h24 >= 4 && h24 < 12) return `सुबह ${h12}:${mm}`;
      if (h24 >= 12 && h24 < 16) return `दोपहर ${h12}:${mm}`;
      if (h24 >= 16 && h24 < 20) return `शाम ${h12}:${mm}`;
      return `रात ${h12}:${mm}`;
    case "gu":
      // Gujarati: "સવારે 6:00", "બપોરે 2:15", "સાંજે 6:00", "રાત્રે 11:45"
      if (h24 >= 4 && h24 < 12) return `સવારે ${h12}:${mm}`;
      if (h24 >= 12 && h24 < 16) return `બપોરે ${h12}:${mm}`;
      if (h24 >= 16 && h24 < 20) return `સાંજે ${h12}:${mm}`;
      return `રાત્રે ${h12}:${mm}`;
    case "en":
    default:
      return `${h12}:${mm} ${isPM ? "PM" : "AM"}`;
  }
}

export function getLocalizedToolMetadata(
  locale: AppLocale,
  category: ToolCategoryId,
  canonicalSlug: string,
  def: ToolDefinition,
): { title: string; description: string } {
  const d = getDictionary(locale);

  // 1. Alarm Presets
  if (category === "alarm" && def.alarm) {
    const formattedTime = formatLocalizedAlarmTime(
      locale,
      def.alarm.hour,
      def.alarm.minute,
    );
    const pattern = d.meta.patterns;
    if ("alarm_preset_title" in pattern && "alarm_preset_desc" in pattern) {
      const p = pattern as Record<string, string>;
      return {
        title: p.alarm_preset_title.replace("{time}", formattedTime),
        description: p.alarm_preset_desc.replace("{time}", formattedTime),
      };
    }
  }

  // 2. Timer Presets (minutes, seconds, hours)
  if (category === "timer") {
    const pattern = d.meta.patterns as Record<string, string>;
    const minMatch = /^(\d+)-minute-timer$/.exec(canonicalSlug);
    if (minMatch && pattern.timer_minutes_title) {
      const n = minMatch[1];
      return {
        title: pattern.timer_minutes_title.replace("{n}", n),
        description: pattern.timer_minutes_desc.replace("{n}", n),
      };
    }

    const secMatch = /^(\d+)-second-timer$/.exec(canonicalSlug);
    if (secMatch && pattern.timer_seconds_title) {
      const n = secMatch[1];
      return {
        title: pattern.timer_seconds_title.replace("{n}", n),
        description: pattern.timer_seconds_desc.replace("{n}", n),
      };
    }

    const hrMatch = /^(\d+)-hour-timer$/.exec(canonicalSlug);
    if (hrMatch && pattern.timer_hours_title) {
      const n = hrMatch[1];
      return {
        title: pattern.timer_hours_title.replace("{n}", n),
        description: pattern.timer_hours_desc.replace("{n}", n),
      };
    }
  }

  // 3. World Clock City Presets
  if (category === "world-clock" && def.worldClock) {
    return getLocalizedWorldClockMetadata(
      locale,
      def.worldClock.label,
      def.worldClock.timeZone,
    );
  }

  if (locale === "en") {
    return { title: def.title, description: def.description };
  }

  return { title: def.title, description: def.description };
}

export function getLocalizedWorldClockMetadata(
  locale: AppLocale,
  cityLabel: string,
  timeZone: string,
): { title: string; description: string } {
  const d = getDictionary(locale);
  const pattern = d.meta.patterns as Record<string, string>;
  const rawTitle = pattern.world_time_title ?? "{city} Time - Current Local Time in {city} Right Now";
  const rawDesc = pattern.world_time_desc ?? "Exact local time in {city} right now. View current date, {tz} time zone, UTC offset, and live digital clock.";

  return {
    title: rawTitle.replace(/\{city\}/g, cityLabel),
    description: rawDesc
      .replace(/\{city\}/g, cityLabel)
      .replace(/\{tz\}/g, timeZone),
  };
}
