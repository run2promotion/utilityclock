import { addDays, startOfDay } from "date-fns";

/** Five supported regions for pSEO holiday countdowns */
export type HolidayCountryId = "usa" | "uk" | "canada" | "australia" | "india";

export type HolidayKind = "fixed" | "computed" | "table";

export type HolidayDefinition = {
  /** URL slug under /timer/ — unique site-wide */
  slug: string;
  /** Short internal id */
  id: string;
  name: string;
  country: HolidayCountryId;
  countryLabel: string;
  kind: HolidayKind;
  /** Fixed: month (1–12) and day; ignored for computed/table */
  month?: number;
  day?: number;
  /** Table: year → month/day for lunar / Hijri-linked observances */
  table?: Record<number, { month: number; day: number }>;
  /** Computed: key into built-in calculators */
  computed?: ComputedHolidayKey;
};

export type ComputedHolidayKey =
  | "easter-western"
  | "good-friday-western"
  | "easter-monday-western"
  | "thanksgiving-usa"
  | "memorial-day-usa"
  | "mlk-day-usa"
  | "presidents-day-usa"
  | "labor-day-usa"
  | "columbus-day-usa"
  | "thanksgiving-canada"
  | "victoria-day-canada"
  | "family-day-canada"
  | "civic-holiday-canada"
  | "early-may-bank-uk"
  | "spring-bank-uk"
  | "kings-birthday-australia";

const COUNTRY_LABEL: Record<HolidayCountryId, string> = {
  usa: "United States",
  uk: "United Kingdom",
  canada: "Canada",
  australia: "Australia",
  india: "India",
};

/** Gregorian Easter Sunday (Western) — Anonymous Gregorian algorithm */
export function easterSundayWestern(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function nthWeekdayOfMonth(
  year: number,
  monthIndex0: number,
  weekday: number,
  n: number,
): Date {
  const first = new Date(year, monthIndex0, 1);
  const firstDow = first.getDay();
  const offset = (weekday - firstDow + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  return new Date(year, monthIndex0, day);
}

function lastWeekdayOfMonth(
  year: number,
  monthIndex0: number,
  weekday: number,
): Date {
  const last = new Date(year, monthIndex0 + 1, 0);
  const lastD = last.getDate();
  const lastDow = last.getDay();
  const diff = (lastDow - weekday + 7) % 7;
  return new Date(year, monthIndex0, lastD - diff);
}

function mondayBeforeMay25(year: number): Date {
  const may25 = new Date(year, 4, 25);
  const dow = may25.getDay();
  const diff = (dow + 6) % 7;
  return addDays(may25, -diff);
}

function thanksgivingUSA(year: number): Date {
  return nthWeekdayOfMonth(year, 10, 4, 4);
}

function thanksgivingCanada(year: number): Date {
  return nthWeekdayOfMonth(year, 9, 1, 2);
}

function computedDate(key: ComputedHolidayKey, year: number): Date {
  const easter = easterSundayWestern(year);
  switch (key) {
    case "easter-western":
      return easter;
    case "good-friday-western":
      return addDays(easter, -2);
    case "easter-monday-western":
      return addDays(easter, 1);
    case "thanksgiving-usa":
      return thanksgivingUSA(year);
    case "memorial-day-usa":
      return lastWeekdayOfMonth(year, 4, 1);
    case "mlk-day-usa":
      return nthWeekdayOfMonth(year, 0, 1, 3);
    case "presidents-day-usa":
      return nthWeekdayOfMonth(year, 1, 1, 3);
    case "labor-day-usa":
      return nthWeekdayOfMonth(year, 8, 1, 1);
    case "columbus-day-usa":
      return nthWeekdayOfMonth(year, 9, 1, 2);
    case "thanksgiving-canada":
      return thanksgivingCanada(year);
    case "victoria-day-canada":
      return mondayBeforeMay25(year);
    case "family-day-canada":
      return nthWeekdayOfMonth(year, 1, 1, 3);
    case "civic-holiday-canada":
      return nthWeekdayOfMonth(year, 7, 1, 1);
    case "early-may-bank-uk":
      return nthWeekdayOfMonth(year, 4, 1, 1);
    case "spring-bank-uk":
      return lastWeekdayOfMonth(year, 4, 1);
    case "kings-birthday-australia":
      return nthWeekdayOfMonth(year, 5, 1, 2);
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}

/** Hindu / Islamic movable dates — authoritative local calendars vary; values are typical civil observance dates for countdown UX (2024–2035). */
const DIWALI_TABLE: Record<number, { month: number; day: number }> = {
  2024: { month: 11, day: 1 },
  2025: { month: 10, day: 20 },
  2026: { month: 11, day: 8 },
  2027: { month: 10, day: 29 },
  2028: { month: 10, day: 17 },
  2029: { month: 11, day: 5 },
  2030: { month: 10, day: 25 },
  2031: { month: 11, day: 14 },
  2032: { month: 11, day: 2 },
  2033: { month: 10, day: 22 },
  2034: { month: 11, day: 11 },
  2035: { month: 10, day: 31 },
  2036: { month: 10, day: 20 },
  2037: { month: 11, day: 8 },
  2038: { month: 10, day: 28 },
  2039: { month: 11, day: 16 },
  2040: { month: 11, day: 4 },
  2041: { month: 10, day: 24 },
  2042: { month: 11, day: 12 },
};

const HOLI_TABLE: Record<number, { month: number; day: number }> = {
  2024: { month: 3, day: 25 },
  2025: { month: 3, day: 14 },
  2026: { month: 3, day: 3 },
  2027: { month: 3, day: 22 },
  2028: { month: 3, day: 11 },
  2029: { month: 3, day: 28 },
  2030: { month: 3, day: 18 },
  2031: { month: 3, day: 8 },
  2032: { month: 3, day: 27 },
  2033: { month: 3, day: 16 },
  2034: { month: 3, day: 5 },
  2035: { month: 3, day: 25 },
  2036: { month: 3, day: 14 },
  2037: { month: 3, day: 4 },
  2038: { month: 3, day: 23 },
  2039: { month: 3, day: 12 },
  2040: { month: 3, day: 31 },
  2041: { month: 3, day: 20 },
  2042: { month: 3, day: 9 },
};

const EID_FITR_TABLE: Record<number, { month: number; day: number }> = {
  2024: { month: 4, day: 10 },
  2025: { month: 3, day: 30 },
  2026: { month: 3, day: 20 },
  2027: { month: 3, day: 10 },
  2028: { month: 2, day: 27 },
  2029: { month: 2, day: 15 },
  2030: { month: 2, day: 4 },
  2031: { month: 1, day: 25 },
  2032: { month: 1, day: 14 },
  2033: { month: 1, day: 3 },
  2034: { month: 12, day: 24 },
  2035: { month: 12, day: 14 },
  2036: { month: 12, day: 3 },
  2037: { month: 11, day: 23 },
  2038: { month: 11, day: 12 },
  2039: { month: 11, day: 1 },
  2040: { month: 10, day: 21 },
  2041: { month: 10, day: 10 },
  2042: { month: 9, day: 30 },
};

const EID_ADHA_TABLE: Record<number, { month: number; day: number }> = {
  2024: { month: 6, day: 16 },
  2025: { month: 6, day: 6 },
  2026: { month: 5, day: 27 },
  2027: { month: 5, day: 17 },
  2028: { month: 5, day: 6 },
  2029: { month: 4, day: 25 },
  2030: { month: 4, day: 15 },
  2031: { month: 4, day: 5 },
  2032: { month: 3, day: 24 },
  2033: { month: 3, day: 14 },
  2034: { month: 3, day: 3 },
  2035: { month: 2, day: 21 },
  2036: { month: 2, day: 10 },
  2037: { month: 1, day: 30 },
  2038: { month: 1, day: 20 },
  2039: { month: 1, day: 9 },
  2040: { month: 12, day: 29 },
  2041: { month: 12, day: 18 },
  2042: { month: 12, day: 7 },
};

function tableForSlug(slug: string): Record<number, { month: number; day: number }> | undefined {
  if (slug === "diwali-india") return DIWALI_TABLE;
  if (slug === "holi-india") return HOLI_TABLE;
  if (slug === "eid-al-fitr-india") return EID_FITR_TABLE;
  if (slug === "eid-al-adha-india") return EID_ADHA_TABLE;
  return undefined;
}

function dateFromParts(year: number, month: number, day: number): Date {
  return startOfDay(new Date(year, month - 1, day));
}

export function getHolidayDateForYear(
  h: HolidayDefinition,
  year: number,
): Date | null {
  if (h.kind === "fixed" && h.month != null && h.day != null) {
    return dateFromParts(year, h.month, h.day);
  }
  if (h.kind === "computed" && h.computed) {
    return startOfDay(computedDate(h.computed, year));
  }
  if (h.kind === "table") {
    const tbl = h.table ?? tableForSlug(h.slug);
    if (!tbl) return null;
    const row = tbl[year];
    if (!row) return null;
    return dateFromParts(year, row.month, row.day);
  }
  return null;
}

/**
 * Next occurrence at local start-of-day. After a holiday passes, the next calendar year
 * (or next table row year) is used automatically.
 */
export function getNextHolidayOccurrence(
  h: HolidayDefinition,
  from: Date = new Date(),
): Date {
  const ref = startOfDay(from);
  let y = ref.getFullYear();

  for (let step = 0; step < 60; step++) {
    const d = getHolidayDateForYear(h, y);
    if (d) {
      const ds = startOfDay(d);
      if (ds.getTime() >= ref.getTime()) return ds;
    }
    y += 1;
  }

  return ref;
}

export const HOLIDAYS: HolidayDefinition[] = [
  // ——— USA ———
  {
    slug: "new-years-day-usa",
    id: "ny-usa",
    name: "New Year's Day",
    country: "usa",
    countryLabel: COUNTRY_LABEL.usa,
    kind: "fixed",
    month: 1,
    day: 1,
  },
  {
    slug: "mlk-day-usa",
    id: "mlk-usa",
    name: "Martin Luther King Jr. Day",
    country: "usa",
    countryLabel: COUNTRY_LABEL.usa,
    kind: "computed",
    computed: "mlk-day-usa",
  },
  {
    slug: "presidents-day-usa",
    id: "pres-usa",
    name: "Presidents' Day",
    country: "usa",
    countryLabel: COUNTRY_LABEL.usa,
    kind: "computed",
    computed: "presidents-day-usa",
  },
  {
    slug: "memorial-day-usa",
    id: "mem-usa",
    name: "Memorial Day",
    country: "usa",
    countryLabel: COUNTRY_LABEL.usa,
    kind: "computed",
    computed: "memorial-day-usa",
  },
  {
    slug: "juneteenth-usa",
    id: "jun-usa",
    name: "Juneteenth",
    country: "usa",
    countryLabel: COUNTRY_LABEL.usa,
    kind: "fixed",
    month: 6,
    day: 19,
  },
  {
    slug: "independence-day-usa",
    id: "jul4-usa",
    name: "Independence Day",
    country: "usa",
    countryLabel: COUNTRY_LABEL.usa,
    kind: "fixed",
    month: 7,
    day: 4,
  },
  {
    slug: "labor-day-usa",
    id: "lab-usa",
    name: "Labor Day",
    country: "usa",
    countryLabel: COUNTRY_LABEL.usa,
    kind: "computed",
    computed: "labor-day-usa",
  },
  {
    slug: "columbus-day-usa",
    id: "col-usa",
    name: "Columbus Day",
    country: "usa",
    countryLabel: COUNTRY_LABEL.usa,
    kind: "computed",
    computed: "columbus-day-usa",
  },
  {
    slug: "veterans-day-usa",
    id: "vet-usa",
    name: "Veterans Day",
    country: "usa",
    countryLabel: COUNTRY_LABEL.usa,
    kind: "fixed",
    month: 11,
    day: 11,
  },
  {
    slug: "thanksgiving-usa",
    id: "tg-usa",
    name: "Thanksgiving",
    country: "usa",
    countryLabel: COUNTRY_LABEL.usa,
    kind: "computed",
    computed: "thanksgiving-usa",
  },
  {
    slug: "christmas-day-usa",
    id: "xmas-usa",
    name: "Christmas Day",
    country: "usa",
    countryLabel: COUNTRY_LABEL.usa,
    kind: "fixed",
    month: 12,
    day: 25,
  },

  // ——— UK ———
  {
    slug: "new-years-day-uk",
    id: "ny-uk",
    name: "New Year's Day",
    country: "uk",
    countryLabel: COUNTRY_LABEL.uk,
    kind: "fixed",
    month: 1,
    day: 1,
  },
  {
    slug: "good-friday-uk",
    id: "gf-uk",
    name: "Good Friday",
    country: "uk",
    countryLabel: COUNTRY_LABEL.uk,
    kind: "computed",
    computed: "good-friday-western",
  },
  {
    slug: "easter-monday-uk",
    id: "em-uk",
    name: "Easter Monday",
    country: "uk",
    countryLabel: COUNTRY_LABEL.uk,
    kind: "computed",
    computed: "easter-monday-western",
  },
  {
    slug: "early-may-bank-holiday-uk",
    id: "emb-uk",
    name: "Early May Bank Holiday",
    country: "uk",
    countryLabel: COUNTRY_LABEL.uk,
    kind: "computed",
    computed: "early-may-bank-uk",
  },
  {
    slug: "spring-bank-holiday-uk",
    id: "sb-uk",
    name: "Spring Bank Holiday",
    country: "uk",
    countryLabel: COUNTRY_LABEL.uk,
    kind: "computed",
    computed: "spring-bank-uk",
  },
  {
    slug: "christmas-day-uk",
    id: "xmas-uk",
    name: "Christmas Day",
    country: "uk",
    countryLabel: COUNTRY_LABEL.uk,
    kind: "fixed",
    month: 12,
    day: 25,
  },
  {
    slug: "boxing-day-uk",
    id: "box-uk",
    name: "Boxing Day",
    country: "uk",
    countryLabel: COUNTRY_LABEL.uk,
    kind: "fixed",
    month: 12,
    day: 26,
  },

  // ——— Canada ———
  {
    slug: "new-years-day-canada",
    id: "ny-ca",
    name: "New Year's Day",
    country: "canada",
    countryLabel: COUNTRY_LABEL.canada,
    kind: "fixed",
    month: 1,
    day: 1,
  },
  {
    slug: "family-day-canada",
    id: "fam-ca",
    name: "Family Day",
    country: "canada",
    countryLabel: COUNTRY_LABEL.canada,
    kind: "computed",
    computed: "family-day-canada",
  },
  {
    slug: "good-friday-canada",
    id: "gf-ca",
    name: "Good Friday",
    country: "canada",
    countryLabel: COUNTRY_LABEL.canada,
    kind: "computed",
    computed: "good-friday-western",
  },
  {
    slug: "victoria-day-canada",
    id: "vic-ca",
    name: "Victoria Day",
    country: "canada",
    countryLabel: COUNTRY_LABEL.canada,
    kind: "computed",
    computed: "victoria-day-canada",
  },
  {
    slug: "canada-day-canada",
    id: "cd-ca",
    name: "Canada Day",
    country: "canada",
    countryLabel: COUNTRY_LABEL.canada,
    kind: "fixed",
    month: 7,
    day: 1,
  },
  {
    slug: "civic-holiday-canada",
    id: "civic-ca",
    name: "Civic Holiday",
    country: "canada",
    countryLabel: COUNTRY_LABEL.canada,
    kind: "computed",
    computed: "civic-holiday-canada",
  },
  {
    slug: "labour-day-canada",
    id: "lab-ca",
    name: "Labour Day",
    country: "canada",
    countryLabel: COUNTRY_LABEL.canada,
    kind: "computed",
    computed: "labor-day-usa",
  },
  {
    slug: "thanksgiving-canada",
    id: "tg-ca",
    name: "Thanksgiving",
    country: "canada",
    countryLabel: COUNTRY_LABEL.canada,
    kind: "computed",
    computed: "thanksgiving-canada",
  },
  {
    slug: "remembrance-day-canada",
    id: "rem-ca",
    name: "Remembrance Day",
    country: "canada",
    countryLabel: COUNTRY_LABEL.canada,
    kind: "fixed",
    month: 11,
    day: 11,
  },
  {
    slug: "christmas-day-canada",
    id: "xmas-ca",
    name: "Christmas Day",
    country: "canada",
    countryLabel: COUNTRY_LABEL.canada,
    kind: "fixed",
    month: 12,
    day: 25,
  },

  // ——— Australia ———
  {
    slug: "new-years-day-australia",
    id: "ny-au",
    name: "New Year's Day",
    country: "australia",
    countryLabel: COUNTRY_LABEL.australia,
    kind: "fixed",
    month: 1,
    day: 1,
  },
  {
    slug: "australia-day",
    id: "aus-day",
    name: "Australia Day",
    country: "australia",
    countryLabel: COUNTRY_LABEL.australia,
    kind: "fixed",
    month: 1,
    day: 26,
  },
  {
    slug: "good-friday-australia",
    id: "gf-au",
    name: "Good Friday",
    country: "australia",
    countryLabel: COUNTRY_LABEL.australia,
    kind: "computed",
    computed: "good-friday-western",
  },
  {
    slug: "easter-monday-australia",
    id: "em-au",
    name: "Easter Monday",
    country: "australia",
    countryLabel: COUNTRY_LABEL.australia,
    kind: "computed",
    computed: "easter-monday-western",
  },
  {
    slug: "anzac-day-australia",
    id: "anz-au",
    name: "Anzac Day",
    country: "australia",
    countryLabel: COUNTRY_LABEL.australia,
    kind: "fixed",
    month: 4,
    day: 25,
  },
  {
    slug: "kings-birthday-australia",
    id: "kb-au",
    name: "King's Birthday",
    country: "australia",
    countryLabel: COUNTRY_LABEL.australia,
    kind: "computed",
    computed: "kings-birthday-australia",
  },
  {
    slug: "christmas-day-australia",
    id: "xmas-au",
    name: "Christmas Day",
    country: "australia",
    countryLabel: COUNTRY_LABEL.australia,
    kind: "fixed",
    month: 12,
    day: 25,
  },
  {
    slug: "boxing-day-australia",
    id: "box-au",
    name: "Boxing Day",
    country: "australia",
    countryLabel: COUNTRY_LABEL.australia,
    kind: "fixed",
    month: 12,
    day: 26,
  },

  // ——— India ———
  {
    slug: "republic-day-india",
    id: "rep-in",
    name: "Republic Day",
    country: "india",
    countryLabel: COUNTRY_LABEL.india,
    kind: "fixed",
    month: 1,
    day: 26,
  },
  {
    slug: "holi-india",
    id: "holi-in",
    name: "Holi",
    country: "india",
    countryLabel: COUNTRY_LABEL.india,
    kind: "table",
    table: HOLI_TABLE,
  },
  {
    slug: "eid-al-fitr-india",
    id: "fitr-in",
    name: "Eid al-Fitr",
    country: "india",
    countryLabel: COUNTRY_LABEL.india,
    kind: "table",
    table: EID_FITR_TABLE,
  },
  {
    slug: "independence-day-india",
    id: "ind-in",
    name: "Independence Day",
    country: "india",
    countryLabel: COUNTRY_LABEL.india,
    kind: "fixed",
    month: 8,
    day: 15,
  },
  {
    slug: "eid-al-adha-india",
    id: "adha-in",
    name: "Eid al-Adha",
    country: "india",
    countryLabel: COUNTRY_LABEL.india,
    kind: "table",
    table: EID_ADHA_TABLE,
  },
  {
    slug: "gandhi-jayanti-india",
    id: "gandhi-in",
    name: "Gandhi Jayanti",
    country: "india",
    countryLabel: COUNTRY_LABEL.india,
    kind: "fixed",
    month: 10,
    day: 2,
  },
  {
    slug: "diwali-india",
    id: "diwali-in",
    name: "Diwali",
    country: "india",
    countryLabel: COUNTRY_LABEL.india,
    kind: "table",
    table: DIWALI_TABLE,
  },
];

const bySlug = new Map<string, HolidayDefinition>(
  HOLIDAYS.map((h) => [h.slug, h]),
);

export function getHolidayBySlug(slug: string): HolidayDefinition | undefined {
  return bySlug.get(slug);
}

export function getHolidaysByCountry(
  country: HolidayCountryId,
): HolidayDefinition[] {
  return HOLIDAYS.filter((h) => h.country === country);
}

export const HOLIDAY_COUNTRIES: {
  id: HolidayCountryId;
  label: string;
  short: string;
}[] = [
  { id: "usa", label: "United States", short: "USA" },
  { id: "uk", label: "United Kingdom", short: "UK" },
  { id: "canada", label: "Canada", short: "CA" },
  { id: "australia", label: "Australia", short: "AU" },
  { id: "india", label: "India", short: "IN" },
];

export function getAllHolidayTimerSlugs(): { category: "timer"; slug: string }[] {
  return HOLIDAYS.map((h) => ({ category: "timer" as const, slug: h.slug }));
}

export function daysUntil(from: Date, target: Date): number {
  const a = startOfDay(from).getTime();
  const b = startOfDay(target).getTime();
  return Math.ceil((b - a) / 86_400_000);
}

/** ~200 words for countdown landing pages */
export function buildHolidaySeoArticle(
  h: HolidayDefinition,
  targetYear: number,
  nextDate: Date,
): string {
  const locale = "en-US";
  const dateStr = nextDate.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const country = h.countryLabel;
  const name = h.name;

  const intro = `Everything you need to know about ${name} ${targetYear}, how many days are left until the next observance, and how people mark the occasion in ${country}. This page keeps a live countdown to the upcoming date (${dateStr} in your local calendar) so you can plan time off, travel, meals, and family traditions with confidence.`;

  const mid = `Public holidays and major cultural observances shift between fixed calendar dates and rules-based dates: some events always fall on the same month and day, while others follow lunar calendars, ecclesiastical cycles, or long weekend conventions. When a date has already passed, our timer automatically rolls forward to the next year’s occurrence so the countdown stays meaningful without manual resets.`;

  const tail = `Celebrations vary by region, community, and personal tradition—parades, religious services, fireworks, feasts, reflection, and quiet family time are all common. Use the live days-hours-minutes-seconds readout above as a shared reference for classrooms, workplaces, community boards, and messaging groups. Bookmark this countdown to return anytime you need a quick answer to “how long until ${name}?” for ${country}.`;

  const extra = `Whether you are coordinating travel, school breaks, retail promotions, worship schedules, or a simple reminder at home, a dependable countdown reduces last-minute stress. Share the page with colleagues and relatives so everyone references the same target instant, especially when the observance moves on the calendar from one year to the next.`;

  return `${intro} ${mid} ${tail} ${extra}`;
}

export function holidayPageTitle(h: HolidayDefinition, year: number): string {
  return `${h.name} ${year} countdown — ${h.countryLabel}`;
}

export function holidayPageDescription(
  h: HolidayDefinition,
  nextDate: Date,
): string {
  const d = nextDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return `Live countdown to ${h.name} (${d}) in ${h.countryLabel}. Days, hours, minutes, and seconds until the next observance—auto-advances after the date passes.`;
}
