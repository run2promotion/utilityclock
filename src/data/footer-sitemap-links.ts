/** Canonical English slugs — localized in the URL via routing helpers. */
export const FOOTER_TOP_ALARM_SLUGS = [
  "alarm-for-7-00-am",
  "alarm-for-8-00-am",
  "alarm-for-6-30-am",
  "alarm-for-9-00-am",
  "alarm-for-12-00-pm",
] as const;

export const FOOTER_TOP_TIMER_SLUGS = [
  "10-minute-timer",
  "5-minute-timer",
  "pomodoro-timer",
  "1-minute-timer",
  "egg-timer",
] as const;

export const FOOTER_TOP_STOPWATCH_SLUGS = [
  "simple-stopwatch",
  "online-stopwatch",
  "lap-stopwatch",
  "split-stopwatch",
  "study-stopwatch",
] as const;

/** Holiday countdown timer pages (under /timer/). */
export const FOOTER_TOP_HOLIDAY_TIMER_SLUGS = [
  "christmas-day-usa",
  "thanksgiving-usa",
  "new-years-day-usa",
  "independence-day-usa",
  "labor-day-usa",
] as const;

export type FooterSitemapCategory = "alarm" | "timer" | "stopwatch" | "holidays";

export const FOOTER_SITEMAP_SLUGS: Record<
  Exclude<FooterSitemapCategory, "holidays">,
  readonly string[]
> = {
  alarm: FOOTER_TOP_ALARM_SLUGS,
  timer: FOOTER_TOP_TIMER_SLUGS,
  stopwatch: FOOTER_TOP_STOPWATCH_SLUGS,
};
