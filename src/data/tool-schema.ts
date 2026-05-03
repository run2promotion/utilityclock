export type ToolCategoryId =
  | "alarm"
  | "timer"
  | "stopwatch"
  | "world-clock";

export type CategoryMeta = {
  id: ToolCategoryId;
  label: string;
  description: string;
  hubPath: string;
};

export type AlarmPreset = {
  hour: number;
  minute: number;
};

export type TimerPreset = {
  totalSeconds: number;
};

export type StopwatchPreset = Record<string, never>;

export type WorldClockPreset = {
  timeZone: string;
  label: string;
};

export type ToolDefinition = {
  title: string;
  description: string;
  alarm?: AlarmPreset;
  timer?: TimerPreset;
  stopwatch?: StopwatchPreset;
  worldClock?: WorldClockPreset;
};

export type ToolSlugParams = {
  category: ToolCategoryId;
  slug: string;
};
