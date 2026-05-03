import type { ToolDefinition } from "@/data/tool-schema";

/**
 * Top global metro areas with stable IANA time zones for pSEO world-clock routes.
 * Slug pattern: `{slugKey}-time` (e.g. tokyo-time).
 */
export type WorldCityEntry = {
  slugKey: string;
  label: string;
  timeZone: string;
};

const ALL_WORLD_CITIES: readonly WorldCityEntry[] = [
  { slugKey: "tokyo", label: "Tokyo", timeZone: "Asia/Tokyo" },
  { slugKey: "delhi", label: "Delhi", timeZone: "Asia/Kolkata" },
  { slugKey: "shanghai", label: "Shanghai", timeZone: "Asia/Shanghai" },
  { slugKey: "dhaka", label: "Dhaka", timeZone: "Asia/Dhaka" },
  { slugKey: "sao-paulo", label: "São Paulo", timeZone: "America/Sao_Paulo" },
  { slugKey: "cairo", label: "Cairo", timeZone: "Africa/Cairo" },
  { slugKey: "mexico-city", label: "Mexico City", timeZone: "America/Mexico_City" },
  { slugKey: "beijing", label: "Beijing", timeZone: "Asia/Shanghai" },
  { slugKey: "mumbai", label: "Mumbai", timeZone: "Asia/Kolkata" },
  { slugKey: "osaka", label: "Osaka", timeZone: "Asia/Tokyo" },
  { slugKey: "chongqing", label: "Chongqing", timeZone: "Asia/Shanghai" },
  { slugKey: "karachi", label: "Karachi", timeZone: "Asia/Karachi" },
  { slugKey: "kinshasa", label: "Kinshasa", timeZone: "Africa/Kinshasa" },
  { slugKey: "lagos", label: "Lagos", timeZone: "Africa/Lagos" },
  { slugKey: "istanbul", label: "Istanbul", timeZone: "Europe/Istanbul" },
  { slugKey: "buenos-aires", label: "Buenos Aires", timeZone: "America/Argentina/Buenos_Aires" },
  { slugKey: "kolkata", label: "Kolkata", timeZone: "Asia/Kolkata" },
  { slugKey: "manila", label: "Manila", timeZone: "Asia/Manila" },
  { slugKey: "tianjin", label: "Tianjin", timeZone: "Asia/Shanghai" },
  { slugKey: "guangzhou", label: "Guangzhou", timeZone: "Asia/Shanghai" },
  { slugKey: "rio-de-janeiro", label: "Rio de Janeiro", timeZone: "America/Sao_Paulo" },
  { slugKey: "lahore", label: "Lahore", timeZone: "Asia/Karachi" },
  { slugKey: "bangalore", label: "Bangalore", timeZone: "Asia/Kolkata" },
  { slugKey: "shenyang", label: "Shenyang", timeZone: "Asia/Shanghai" },
  { slugKey: "singapore", label: "Singapore", timeZone: "Asia/Singapore" },
  { slugKey: "wuhan", label: "Wuhan", timeZone: "Asia/Shanghai" },
  { slugKey: "jakarta", label: "Jakarta", timeZone: "Asia/Jakarta" },
  { slugKey: "suzhou", label: "Suzhou", timeZone: "Asia/Shanghai" },
  { slugKey: "nairobi", label: "Nairobi", timeZone: "Africa/Nairobi" },
  { slugKey: "new-york", label: "New York", timeZone: "America/New_York" },
  { slugKey: "los-angeles", label: "Los Angeles", timeZone: "America/Los_Angeles" },
  { slugKey: "london", label: "London", timeZone: "Europe/London" },
  { slugKey: "paris", label: "Paris", timeZone: "Europe/Paris" },
  { slugKey: "moscow", label: "Moscow", timeZone: "Europe/Moscow" },
  { slugKey: "chicago", label: "Chicago", timeZone: "America/Chicago" },
  { slugKey: "houston", label: "Houston", timeZone: "America/Chicago" },
  { slugKey: "dallas", label: "Dallas", timeZone: "America/Chicago" },
  { slugKey: "toronto", label: "Toronto", timeZone: "America/Toronto" },
  { slugKey: "philadelphia", label: "Philadelphia", timeZone: "America/New_York" },
  { slugKey: "washington-dc", label: "Washington DC", timeZone: "America/New_York" },
  { slugKey: "miami", label: "Miami", timeZone: "America/New_York" },
  { slugKey: "atlanta", label: "Atlanta", timeZone: "America/New_York" },
  { slugKey: "boston", label: "Boston", timeZone: "America/New_York" },
  { slugKey: "san-francisco", label: "San Francisco", timeZone: "America/Los_Angeles" },
  { slugKey: "phoenix", label: "Phoenix", timeZone: "America/Phoenix" },
  { slugKey: "seattle", label: "Seattle", timeZone: "America/Los_Angeles" },
  { slugKey: "denver", label: "Denver", timeZone: "America/Denver" },
  { slugKey: "detroit", label: "Detroit", timeZone: "America/New_York" },
  { slugKey: "montreal", label: "Montreal", timeZone: "America/Toronto" },
  { slugKey: "vancouver", label: "Vancouver", timeZone: "America/Vancouver" },
  { slugKey: "sydney", label: "Sydney", timeZone: "Australia/Sydney" },
  { slugKey: "melbourne", label: "Melbourne", timeZone: "Australia/Melbourne" },
  { slugKey: "brisbane", label: "Brisbane", timeZone: "Australia/Brisbane" },
  { slugKey: "perth", label: "Perth", timeZone: "Australia/Perth" },
  { slugKey: "auckland", label: "Auckland", timeZone: "Pacific/Auckland" },
  { slugKey: "berlin", label: "Berlin", timeZone: "Europe/Berlin" },
  { slugKey: "madrid", label: "Madrid", timeZone: "Europe/Madrid" },
  { slugKey: "rome", label: "Rome", timeZone: "Europe/Rome" },
  { slugKey: "barcelona", label: "Barcelona", timeZone: "Europe/Madrid" },
  { slugKey: "amsterdam", label: "Amsterdam", timeZone: "Europe/Amsterdam" },
  { slugKey: "vienna", label: "Vienna", timeZone: "Europe/Vienna" },
  { slugKey: "warsaw", label: "Warsaw", timeZone: "Europe/Warsaw" },
  { slugKey: "stockholm", label: "Stockholm", timeZone: "Europe/Stockholm" },
  { slugKey: "zurich", label: "Zurich", timeZone: "Europe/Zurich" },
  { slugKey: "dublin", label: "Dublin", timeZone: "Europe/Dublin" },
  { slugKey: "lisbon", label: "Lisbon", timeZone: "Europe/Lisbon" },
  { slugKey: "athens", label: "Athens", timeZone: "Europe/Athens" },
  { slugKey: "prague", label: "Prague", timeZone: "Europe/Prague" },
  { slugKey: "budapest", label: "Budapest", timeZone: "Europe/Budapest" },
  { slugKey: "bucharest", label: "Bucharest", timeZone: "Europe/Bucharest" },
  { slugKey: "dubai", label: "Dubai", timeZone: "Asia/Dubai" },
  { slugKey: "riyadh", label: "Riyadh", timeZone: "Asia/Riyadh" },
  { slugKey: "tel-aviv", label: "Tel Aviv", timeZone: "Asia/Jerusalem" },
  { slugKey: "johannesburg", label: "Johannesburg", timeZone: "Africa/Johannesburg" },
  { slugKey: "cape-town", label: "Cape Town", timeZone: "Africa/Johannesburg" },
  { slugKey: "casablanca", label: "Casablanca", timeZone: "Africa/Casablanca" },
  { slugKey: "nagoya", label: "Nagoya", timeZone: "Asia/Tokyo" },
  { slugKey: "yokohama", label: "Yokohama", timeZone: "Asia/Tokyo" },
  { slugKey: "kyoto", label: "Kyoto", timeZone: "Asia/Tokyo" },
  { slugKey: "fukuoka", label: "Fukuoka", timeZone: "Asia/Tokyo" },
  { slugKey: "seoul", label: "Seoul", timeZone: "Asia/Seoul" },
  { slugKey: "busan", label: "Busan", timeZone: "Asia/Seoul" },
  { slugKey: "taipei", label: "Taipei", timeZone: "Asia/Taipei" },
  { slugKey: "hong-kong", label: "Hong Kong", timeZone: "Asia/Hong_Kong" },
  { slugKey: "bangkok", label: "Bangkok", timeZone: "Asia/Bangkok" },
  { slugKey: "ho-chi-minh", label: "Ho Chi Minh City", timeZone: "Asia/Ho_Chi_Minh" },
  { slugKey: "hanoi", label: "Hanoi", timeZone: "Asia/Bangkok" },
  { slugKey: "kuala-lumpur", label: "Kuala Lumpur", timeZone: "Asia/Kuala_Lumpur" },
  { slugKey: "chennai", label: "Chennai", timeZone: "Asia/Kolkata" },
  { slugKey: "hyderabad", label: "Hyderabad", timeZone: "Asia/Kolkata" },
  { slugKey: "pune", label: "Pune", timeZone: "Asia/Kolkata" },
  { slugKey: "ahmedabad", label: "Ahmedabad", timeZone: "Asia/Kolkata" },
  { slugKey: "surat", label: "Surat", timeZone: "Asia/Kolkata" },
  { slugKey: "colombo", label: "Colombo", timeZone: "Asia/Colombo" },
  { slugKey: "kathmandu", label: "Kathmandu", timeZone: "Asia/Kathmandu" },
  { slugKey: "tashkent", label: "Tashkent", timeZone: "Asia/Tashkent" },
  { slugKey: "almaty", label: "Almaty", timeZone: "Asia/Almaty" },
  { slugKey: "santiago", label: "Santiago", timeZone: "America/Santiago" },
  { slugKey: "bogota", label: "Bogotá", timeZone: "America/Bogota" },
  { slugKey: "lima", label: "Lima", timeZone: "America/Lima" },
  { slugKey: "caracas", label: "Caracas", timeZone: "America/Caracas" },
  { slugKey: "panama-city", label: "Panama City", timeZone: "America/Panama" },
  { slugKey: "san-juan", label: "San Juan", timeZone: "America/Puerto_Rico" },
  { slugKey: "guadalajara", label: "Guadalajara", timeZone: "America/Mexico_City" },
  { slugKey: "monterrey", label: "Monterrey", timeZone: "America/Mexico_City" },
  { slugKey: "brussels", label: "Brussels", timeZone: "Europe/Brussels" },
  { slugKey: "copenhagen", label: "Copenhagen", timeZone: "Europe/Copenhagen" },
  { slugKey: "oslo", label: "Oslo", timeZone: "Europe/Oslo" },
  { slugKey: "helsinki", label: "Helsinki", timeZone: "Europe/Helsinki" },
  { slugKey: "kiev", label: "Kyiv", timeZone: "Europe/Kyiv" },
  { slugKey: "minneapolis", label: "Minneapolis", timeZone: "America/Chicago" },
  { slugKey: "portland", label: "Portland", timeZone: "America/Los_Angeles" },
  { slugKey: "las-vegas", label: "Las Vegas", timeZone: "America/Los_Angeles" },
  { slugKey: "st-louis", label: "St. Louis", timeZone: "America/Chicago" },
  { slugKey: "tampa", label: "Tampa", timeZone: "America/New_York" },
  { slugKey: "orlando", label: "Orlando", timeZone: "America/New_York" },
  { slugKey: "sacramento", label: "Sacramento", timeZone: "America/Los_Angeles" },
  { slugKey: "kansas-city", label: "Kansas City", timeZone: "America/Chicago" },
  { slugKey: "columbus", label: "Columbus", timeZone: "America/New_York" },
  { slugKey: "charlotte", label: "Charlotte", timeZone: "America/New_York" },
  { slugKey: "indianapolis", label: "Indianapolis", timeZone: "America/Indiana/Indianapolis" },
  { slugKey: "pittsburgh", label: "Pittsburgh", timeZone: "America/New_York" },
  { slugKey: "cincinnati", label: "Cincinnati", timeZone: "America/New_York" },
  { slugKey: "cleveland", label: "Cleveland", timeZone: "America/New_York" },
  { slugKey: "nashville", label: "Nashville", timeZone: "America/Chicago" },
  { slugKey: "salt-lake-city", label: "Salt Lake City", timeZone: "America/Denver" },
  { slugKey: "edmonton", label: "Edmonton", timeZone: "America/Edmonton" },
  { slugKey: "calgary", label: "Calgary", timeZone: "America/Edmonton" },
  { slugKey: "ottawa", label: "Ottawa", timeZone: "America/Toronto" },
  { slugKey: "quebec-city", label: "Quebec City", timeZone: "America/Toronto" },
  { slugKey: "adelaide", label: "Adelaide", timeZone: "Australia/Adelaide" },
  { slugKey: "wellington", label: "Wellington", timeZone: "Pacific/Auckland" },
  { slugKey: "christchurch", label: "Christchurch", timeZone: "Pacific/Auckland" },
  { slugKey: "hobart", label: "Hobart", timeZone: "Australia/Hobart" },
  { slugKey: "darwin", label: "Darwin", timeZone: "Australia/Darwin" },
  { slugKey: "ulaanbaatar", label: "Ulaanbaatar", timeZone: "Asia/Ulaanbaatar" },
  { slugKey: "yangon", label: "Yangon", timeZone: "Asia/Yangon" },
  { slugKey: "phnom-penh", label: "Phnom Penh", timeZone: "Asia/Bangkok" },
  { slugKey: "vientiane", label: "Vientiane", timeZone: "Asia/Bangkok" },
  { slugKey: "bandung", label: "Bandung", timeZone: "Asia/Jakarta" },
  { slugKey: "medan", label: "Medan", timeZone: "Asia/Jakarta" },
  { slugKey: "surabaya", label: "Surabaya", timeZone: "Asia/Jakarta" },
  { slugKey: "doha", label: "Doha", timeZone: "Asia/Qatar" },
  { slugKey: "kuwait-city", label: "Kuwait City", timeZone: "Asia/Kuwait" },
  { slugKey: "muscat", label: "Muscat", timeZone: "Asia/Muscat" },
  { slugKey: "abu-dhabi", label: "Abu Dhabi", timeZone: "Asia/Dubai" },
  { slugKey: "manama", label: "Manama", timeZone: "Asia/Bahrain" },
  { slugKey: "beirut", label: "Beirut", timeZone: "Asia/Beirut" },
  { slugKey: "amman", label: "Amman", timeZone: "Asia/Amman" },
  { slugKey: "baghdad", label: "Baghdad", timeZone: "Asia/Baghdad" },
  { slugKey: "tehran", label: "Tehran", timeZone: "Asia/Tehran" },
  { slugKey: "baku", label: "Baku", timeZone: "Asia/Baku" },
  { slugKey: "tbilisi", label: "Tbilisi", timeZone: "Asia/Tbilisi" },
  { slugKey: "yerevan", label: "Yerevan", timeZone: "Asia/Yerevan" },
];

/** First 100 entries for “top cities” pSEO routes */
export const WORLD_TOP_100_CITIES = ALL_WORLD_CITIES.slice(0, 100);

/**
 * Other cities in the same IANA zone (for cross-linking), excluding the current page slug.
 * `excludeCanonicalSlug` is e.g. `tokyo-time`.
 */
export function getWorldClockPeerEntries(
  timeZone: string,
  excludeCanonicalSlug: string,
  limit: number,
): { canonicalSlug: string; label: string }[] {
  const key = excludeCanonicalSlug
    .replace(/-time$/i, "")
    .replace(/-clock$/i, "")
    .toLowerCase();
  const out: { canonicalSlug: string; label: string }[] = [];
  for (const c of ALL_WORLD_CITIES) {
    if (c.timeZone !== timeZone) continue;
    if (c.slugKey === key) continue;
    out.push({ canonicalSlug: `${c.slugKey}-time`, label: c.label });
    if (out.length >= limit) break;
  }
  return out;
}

export function buildWorldClockPages(): Record<string, ToolDefinition> {
  const out: Record<string, ToolDefinition> = {};
  for (const c of WORLD_TOP_100_CITIES) {
    const slug = `${c.slugKey}-time`;
    out[slug] = {
      title: `Current time in ${c.label}`,
      description: `See the live local time, date, and UTC offset for ${c.label} (${c.timeZone}) in your browser.`,
      worldClock: { timeZone: c.timeZone, label: c.label },
    };
  }
  return out;
}

/** Resolver map from full list (covers slugs beyond the first 100 published routes). */
export function buildWorldClockSlugResolverMap(): Record<
  string,
  { timeZone: string; label: string }
> {
  const map: Record<string, { timeZone: string; label: string }> = {};
  for (const c of ALL_WORLD_CITIES) {
    map[c.slugKey] = { timeZone: c.timeZone, label: c.label };
  }
  return map;
}
