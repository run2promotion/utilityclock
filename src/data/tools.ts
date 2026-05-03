import {
  buildAlarmPages,
  buildLegacyAlarmAliases,
  buildStopwatchPages,
  buildTimerPages,
} from "@/data/generateToolPages";
import { buildWorldClockPages } from "@/data/worldCitiesTop100";
import type {
  CategoryMeta,
  ToolCategoryId,
  ToolDefinition,
  ToolSlugParams,
} from "@/data/tool-schema";

export type {
  AlarmPreset,
  CategoryMeta,
  StopwatchPreset,
  TimerPreset,
  ToolCategoryId,
  ToolDefinition,
  ToolSlugParams,
  WorldClockPreset,
} from "@/data/tool-schema";

export const CATEGORIES: Record<ToolCategoryId, CategoryMeta> = {
  alarm: {
    id: "alarm",
    label: "Alarm Clock",
    description:
      "Set an online alarm with sound and optional browser notifications.",
    hubPath: "/alarm",
  },
  timer: {
    id: "timer",
    label: "Timer",
    description: "Count down with preset durations for common tasks.",
    hubPath: "/timer",
  },
  stopwatch: {
    id: "stopwatch",
    label: "Stopwatch",
    description: "Track elapsed time with a simple stopwatch.",
    hubPath: "/stopwatch",
  },
  "world-clock": {
    id: "world-clock",
    label: "World Clock",
    description: "See the current time in major cities around the world.",
    hubPath: "/world-clock",
  },
};

const generatedAlarms = buildAlarmPages();
const ALARM_PAGES: Record<string, ToolDefinition> = {
  ...generatedAlarms,
  ...buildLegacyAlarmAliases(generatedAlarms),
};

const TIMER_PAGES = buildTimerPages();
const STOPWATCH_PAGES = buildStopwatchPages();
const WORLD_CLOCK_PAGES = buildWorldClockPages();

const PAGES: Record<ToolCategoryId, Record<string, ToolDefinition>> = {
  alarm: ALARM_PAGES,
  timer: TIMER_PAGES,
  stopwatch: STOPWATCH_PAGES,
  "world-clock": WORLD_CLOCK_PAGES,
};

export function isToolCategoryId(value: string): value is ToolCategoryId {
  return Object.prototype.hasOwnProperty.call(CATEGORIES, value);
}

export function getCategoryMeta(category: ToolCategoryId): CategoryMeta {
  return CATEGORIES[category];
}

export function getToolDefinition(
  category: ToolCategoryId,
  slug: string,
): ToolDefinition | undefined {
  return PAGES[category]?.[slug];
}

export function getToolSlugsForCategory(
  category: ToolCategoryId,
): string[] {
  return Object.keys(PAGES[category] ?? {});
}

export function getAllToolSlugs(): ToolSlugParams[] {
  const out: ToolSlugParams[] = [];
  (Object.keys(PAGES) as ToolCategoryId[]).forEach((category) => {
    Object.keys(PAGES[category]).forEach((slug) => {
      out.push({ category, slug });
    });
  });
  return out;
}
