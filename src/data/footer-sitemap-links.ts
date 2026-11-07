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

export const FOOTER_TOP_DATE_SLUGS = [
  "age-calculator",
  "business-days-calculator",
  "date-difference-calculator",
  "days-between-dates",
  "days-until-date",
] as const;

export const FOOTER_TOP_CALCULATOR_SLUGS = [
  "percentage-calculator",
  "unit-converter",
  "basic-calculator",
  "temperature-converter",
  "speed-converter",
] as const;

export const FOOTER_TOP_PRODUCTIVITY_SLUGS = [
  "sleep-cycle-calculator",
  "pomodoro-timer",
  "interval-timer",
  "hourly-chime",
  "countdown-to-event",
] as const;

export const FOOTER_TOP_CONVERTER_SLUGS = [
  "area-converter",
  "volume-converter",
  "pressure-converter",
  "data-storage-converter",
  "fuel-economy-converter",
] as const;

export const FOOTER_TOP_FINANCE_SLUGS = [
  "loan-emi-calculator",
  "compound-interest-calculator",
  "gst-calculator",
  "vat-calculator",
  "profit-margin-calculator",
] as const;

export const FOOTER_TOP_TEXT_SLUGS = [
  "word-counter",
  "character-counter",
  "case-converter",
  "remove-duplicate-lines",
  "text-diff-checker",
] as const;

/** Holiday countdown timer pages (under /timer/). */
export const FOOTER_TOP_HOLIDAY_TIMER_SLUGS = [
  "christmas-day-usa",
  "thanksgiving-usa",
  "new-years-day-usa",
  "independence-day-usa",
  "labor-day-usa",
] as const;

export type FooterSitemapCategory =
  | "alarm"
  | "timer"
  | "stopwatch"
  | "holidays"
  | "date-calendar"
  | "calculators"
  | "productivity"
  | "converters"
  | "finance"
  | "text";

export const FOOTER_SITEMAP_SLUGS: Record<
  Exclude<FooterSitemapCategory, "holidays">,
  readonly string[]
> = {
  alarm: FOOTER_TOP_ALARM_SLUGS,
  timer: FOOTER_TOP_TIMER_SLUGS,
  stopwatch: FOOTER_TOP_STOPWATCH_SLUGS,
  "date-calendar": FOOTER_TOP_DATE_SLUGS,
  calculators: FOOTER_TOP_CALCULATOR_SLUGS,
  productivity: FOOTER_TOP_PRODUCTIVITY_SLUGS,
  converters: FOOTER_TOP_CONVERTER_SLUGS,
  finance: FOOTER_TOP_FINANCE_SLUGS,
  text: FOOTER_TOP_TEXT_SLUGS,
};
