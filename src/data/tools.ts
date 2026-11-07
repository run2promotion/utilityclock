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
    seoTitle: "Online Alarm Clock - Set Alarm with Loud Sound & Snooze",
    seoDescription:
      "Free online alarm clock with loud buzzer sounds, gentle wake chimes, customizable snooze, and audio alerts. Keep your browser tab open for reliable timing.",
  },
  timer: {
    id: "timer",
    label: "Timer",
    description: "Count down with preset durations for common tasks.",
    hubPath: "/timer",
    seoTitle: "Online Timer - Free Fullscreen Countdown Timer with Sound",
    seoDescription:
      "Free online countdown timer with loud alarm sound, visual progress rings, and custom minutes or seconds. Features distraction-free fullscreen mode and browser alerts.",
  },
  stopwatch: {
    id: "stopwatch",
    label: "Stopwatch",
    description: "Track elapsed time with a simple stopwatch.",
    hubPath: "/stopwatch",
    seoTitle: "Online Stopwatch - Split Lap Timer with Milliseconds",
    seoDescription:
      "Free precision online stopwatch with millisecond accuracy, split lap times, and fastest/slowest lap highlighting. Clean fullscreen display for study and sports.",
  },
  "world-clock": {
    id: "world-clock",
    label: "World Clock",
    description: "See the current time in major cities around the world.",
    hubPath: "/world-clock",
    seoTitle: "World Clock - Current Local Time in Cities Worldwide",
    seoDescription:
      "Check exact local time, time zones, UTC offsets, and daylight saving time (DST) changes across major cities worldwide. Accurate multi-city time comparison.",
  },
  "date-calendar": {
    id: "date-calendar",
    label: "Date & Calendar",
    description: "Calculate age, days between dates, business days, week numbers, and leap years.",
    hubPath: "/date-calendar",
  },
  calculators: {
    id: "calculators",
    label: "Calculators",
    description: "Fast, browser-based percentage, basic arithmetic, and unit conversion calculators.",
    hubPath: "/calculators",
  },
  productivity: {
    id: "productivity",
    label: "Productivity",
    description: "Sleep cycle calculator, Pomodoro focus timer, hourly chime, and routine planners.",
    hubPath: "/productivity",
  },
  converters: {
    id: "converters",
    label: "Converters",
    description: "Fast, accurate bidirectional unit converters for area, volume, pressure, energy, and more.",
    hubPath: "/converters",
  },
  finance: {
    id: "finance",
    label: "Finance Calculators",
    description: "Online financial calculators for loans, EMI, compound interest, taxes, and margins.",
    hubPath: "/finance",
  },
  text: {
    id: "text",
    label: "Text Tools",
    description: "Fast, private browser-based text formatting, counting, cleaning, and comparison utilities.",
    hubPath: "/text",
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

const DATE_CALENDAR_PAGES: Record<string, ToolDefinition> = {
  "age-calculator": {
    title: "Age Calculator Online",
    description: "Calculate your exact age in years, months, days, total days, and next birthday countdown.",
  },
  "date-difference-calculator": {
    title: "Date Difference Calculator",
    description: "Calculate exact days, weeks, and hours between any two calendar dates.",
  },
  "days-between-dates": {
    title: "Days Between Dates Calculator",
    description: "Count the total number of calendar days between two selected dates.",
  },
  "add-subtract-days": {
    title: "Add or Subtract Days to Date",
    description: "Add or subtract days, weeks, months, or years to calculate past or future target dates.",
  },
  "add-days-to-date": {
    title: "Add Days to Date Calculator",
    description: "Add a specific number of days, weeks, months, or years to any calendar date.",
  },
  "subtract-days-from-date": {
    title: "Subtract Days from Date Calculator",
    description: "Subtract days, weeks, months, or years from any date to find historical dates.",
  },
  "business-days-calculator": {
    title: "Business Days Calculator",
    description: "Calculate working days and weekdays between two dates, automatically excluding weekends.",
  },
  "week-number-calculator": {
    title: "Week Number & Leap Year Calculator",
    description: "Lookup the ISO week number, day of the year, and leap year status for any date.",
  },
  "leap-year-checker": {
    title: "Leap Year Checker",
    description: "Check if any calendar year is a leap year (366 days) or common year (365 days).",
  },
  "days-until-date": {
    title: "Days Until Date Calculator",
    description: "Calculate how many days, hours, and minutes remain until a target date or event.",
  },
  "date-duration-calculator": {
    title: "Date Duration & Timeline Calculator",
    description: "Accurately compute duration in years, months, weeks, and total days between dates.",
  },
};

const CALCULATOR_PAGES: Record<string, ToolDefinition> = {
  "percentage-calculator": {
    title: "Percentage Calculator Online",
    description: "Calculate percentages, percentage change, markups, and fractional ratios quickly in your browser.",
  },
  "basic-calculator": {
    title: "Online Basic Calculator",
    description: "Clean, responsive browser calculator for quick everyday arithmetic and calculations.",
  },
  "unit-converter": {
    title: "Unit Converter Online",
    description: "Convert length, speed, temperature, and weight across metric and imperial systems.",
  },
  "temperature-converter": {
    title: "Temperature Converter (Celsius, Fahrenheit, Kelvin)",
    description: "Convert temperature values accurately between Celsius, Fahrenheit, and Kelvin.",
  },
  "speed-converter": {
    title: "Speed Converter (km/h, mph, m/s, knots)",
    description: "Convert speeds between kilometers per hour, miles per hour, meters per second, and nautical knots.",
  },
  "distance-converter": {
    title: "Distance & Length Converter",
    description: "Convert meters, feet, kilometers, miles, yards, and inches instantly.",
  },
  "time-duration-calculator": {
    title: "Time Duration Calculator",
    description: "Calculate elapsed hours, minutes, and seconds between two times with overnight midnight-crossing support.",
  },
  "time-converter": {
    title: "Time Unit Converter",
    description: "Convert time values accurately between seconds, minutes, hours, days, and weeks.",
  },
  "work-hours-calculator": {
    title: "Work Hours & Overtime Calculator",
    description: "Calculate shift hours, deduct unpaid break times, compute overtime, and estimate gross earnings.",
  },
  "break-time-calculator": {
    title: "Break Time Productivity Calculator",
    description: "Determine optimal work-to-rest intervals based on cognitive ergonomics research.",
  },
};

const PRODUCTIVITY_PAGES: Record<string, ToolDefinition> = {
  "sleep-cycle-calculator": {
    title: "Sleep Cycle Calculator Online",
    description: "Calculate optimal bedtimes and wake-up times aligned with natural 90-minute human sleep cycles.",
  },
  "pomodoro-timer": {
    title: "Pomodoro Focus Timer (25/5 min)",
    description: "Boost your productivity with structured 25-minute deep focus sprints and 5-minute restorative breaks.",
  },
  "interval-timer": {
    title: "Workout & HIIT Interval Timer",
    description: "Track work-to-rest rounds with audible beeps for calisthenics, HIIT, boxing, or gym circuits.",
  },
  "hourly-chime": {
    title: "Hourly Chime Online",
    description: "Enable a pleasant, discreet synthesized hourly chime to keep track of time throughout your workday.",
  },
  "custom-countdown": {
    title: "Custom Event Countdown Timer",
    description: "Create an instant live countdown timer for birthdays, vacations, milestones, or project deadlines.",
  },
  "countdown-to-event": {
    title: "Countdown to Custom Event",
    description: "Set up live event countdowns with days, hours, minutes, and seconds remaining.",
  },
  "focus-planner": {
    title: "Focus Session Planner",
    description: "Plan cognitive work sprints and deep work sessions with proven rest ratios.",
  },
  "focus-session-planner": {
    title: "Focus Session Planner & Task Interval Pacing",
    description: "Structure high-output work sprints with customized interval breaks and focus tracking.",
  },
  "study-timer": {
    title: "Online Study Timer & Focus Sessions",
    description: "Paced study blocks with scheduled micro-breaks for students, exams, and deep reading.",
  },
  "workout-interval-timer": {
    title: "Workout Interval Timer",
    description: "Audio-assisted interval training timer for gym circuits, Tabata, and HIIT rounds.",
  },
  "daily-routine-planner": {
    title: "Daily Routine & Productivity Planner",
    description: "Plan structured daily workflows, break times, and productivity habits.",
  },
};

const CONVERTER_PAGES: Record<string, ToolDefinition> = {
  "area-converter": {
    title: "Area Converter Online",
    description: "Convert area units instantly between square meters, feet, acres, hectares, kilometers, and square miles.",
  },
  "volume-converter": {
    title: "Volume & Capacity Converter",
    description: "Convert liters, gallons, milliliters, cubic meters, cups, fluid ounces, and tablespoons.",
  },
  "pressure-converter": {
    title: "Pressure Converter",
    description: "Convert pressure units between pascals, bar, psi, atmospheres, and mmHg/torr.",
  },
  "energy-converter": {
    title: "Energy & Work Converter",
    description: "Convert joules, kilojoules, calories, kilocalories, watt-hours, kWh, and BTU.",
  },
  "power-converter": {
    title: "Power Converter",
    description: "Convert power between watts, kilowatts, horsepower, and metric PS with exact scientific constants.",
  },
  "data-storage-converter": {
    title: "Data Storage & File Size Converter",
    description: "Convert bits, bytes, KB, MB, GB, TB, and binary kibibytes (KiB, MiB, GiB) accurately.",
  },
  "fuel-economy-converter": {
    title: "Fuel Economy Converter (MPG, L/100km, km/L)",
    description: "Convert gas mileage and consumption between US MPG, UK Imperial MPG, L/100km, and km/L.",
  },
  "angle-converter": {
    title: "Angle Converter (Degrees, Radians, Gradians)",
    description: "Convert angular measurements accurately between degrees, radians, gradians, and turns.",
  },
  "cooking-converter": {
    title: "Cooking Measurement & Ingredient Converter",
    description: "Convert recipe cups, spoons, fluid ounces, grams, and milliliters with ingredient densities.",
  },
  "number-system-converter": {
    title: "Number System Converter (Binary, Hex, Octal, Decimal)",
    description: "Convert numbers across binary (base 2), decimal (base 10), hexadecimal (base 16), and octal (base 8).",
  },
};

const FINANCE_PAGES: Record<string, ToolDefinition> = {
  "loan-emi-calculator": {
    title: "Loan EMI & Mortgage Calculator",
    description: "Calculate monthly loan EMIs, total interest payable, and amortization schedules for home or personal loans.",
  },
  "compound-interest-calculator": {
    title: "Compound Interest Calculator",
    description: "Project investment growth over time with customizable compounding frequencies and regular deposits.",
  },
  "simple-interest-calculator": {
    title: "Simple Interest Calculator",
    description: "Compute simple interest and final balances using principal, annual rate, and duration.",
  },
  "gst-calculator": {
    title: "GST Calculator (Add or Remove Tax)",
    description: "Calculate Goods and Services Tax with customizable tax rates and clean inclusive/exclusive breakdowns.",
  },
  "vat-calculator": {
    title: "VAT Calculator (Value Added Tax)",
    description: "Add or extract VAT from gross prices with international standard and custom tax rates.",
  },
  "discount-calculator": {
    title: "Discount & Sale Price Calculator",
    description: "Calculate final checkout prices, savings amounts, and stacked promotional discounts.",
  },
  "profit-margin-calculator": {
    title: "Profit Margin Calculator",
    description: "Determine gross profit margin percentage and net profit from cost of goods sold and revenue.",
  },
  "markup-calculator": {
    title: "Markup Calculator",
    description: "Calculate selling prices and profit margins based on desired cost markup percentage.",
  },
  "break-even-calculator": {
    title: "Break-Even Point Calculator",
    description: "Calculate break-even production units and sales revenue from fixed and variable costs.",
  },
  "savings-goal-calculator": {
    title: "Savings Goal & Target Contribution Calculator",
    description: "Determine exact monthly savings needed to reach your financial target by a specific deadline.",
  },
};

const TEXT_PAGES: Record<string, ToolDefinition> = {
  "word-counter": {
    title: "Online Word Counter & Text Statistics",
    description: "Count words, characters, sentences, paragraphs, reading time, and speaking time live in your browser.",
  },
  "character-counter": {
    title: "Character Counter & Social Limit Tracker",
    description: "Track exact character counts with and without spaces, including limits for Twitter, SMS, and SEO.",
  },
  "case-converter": {
    title: "Case Converter (UPPERCASE, lowercase, Title Case)",
    description: "Convert text instantly between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.",
  },
  "remove-duplicate-lines": {
    title: "Remove Duplicate Lines Online",
    description: "Clean up repetitive list entries and duplicate lines with case sensitivity and trimming options.",
  },
  "text-sorter": {
    title: "Text & List Sorter Online",
    description: "Sort text lists alphabetically (A-Z, Z-A), numerically, or by length instantaneously.",
  },
  "text-reverser": {
    title: "Text Reverser (Reverse Words, Letters, Flipped)",
    description: "Reverse text, invert letter order, flip upside down, or mirror strings client-side.",
  },
  "whitespace-remover": {
    title: "Whitespace Remover & Extra Spaces Cleaner",
    description: "Strip extra spaces, leading and trailing blanks, consecutive spaces, and tab indents from text.",
  },
  "line-break-remover": {
    title: "Line Break Remover & Text Flattener",
    description: "Remove carriage returns and line breaks to convert multi-line text into a single paragraph or CSV.",
  },
  "lorem-ipsum-generator": {
    title: "Lorem Ipsum Placeholder Text Generator",
    description: "Generate customized dummy text in paragraphs, sentences, or words with optional HTML formatting.",
  },
  "text-diff-checker": {
    title: "Text Diff Checker & Difference Comparator",
    description: "Compare two text snippets side-by-side with visual inline highlighting for additions and removals.",
  },
};

const PAGES: Record<ToolCategoryId, Record<string, ToolDefinition>> = {
  alarm: ALARM_PAGES,
  timer: TIMER_PAGES,
  stopwatch: STOPWATCH_PAGES,
  "world-clock": WORLD_CLOCK_PAGES,
  "date-calendar": DATE_CALENDAR_PAGES,
  calculators: CALCULATOR_PAGES,
  productivity: PRODUCTIVITY_PAGES,
  converters: CONVERTER_PAGES,
  finance: FINANCE_PAGES,
  text: TEXT_PAGES,
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
