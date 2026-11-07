/**
 * Unified Multi-Year Sacred Festival & Observances Registry (2026–2027)
 *
 * Centralizes retrieval, search, upcoming countdowns, and Tithi mapping
 * across Sanatan Hindu, Gujarati, Jain, Sikh, and Buddhist traditions.
 */

import { FESTIVALS_2026, type FestivalCategory, type FestivalItem } from "./festivals-2026";
import { FESTIVALS_2027 } from "./festivals-2027";

export type { FestivalCategory, FestivalItem };

export const ALL_FESTIVALS: FestivalItem[] = [
  ...FESTIVALS_2026,
  ...FESTIVALS_2027,
];

/**
 * Get festivals for a specific calendar year (2026 or 2027)
 */
export function getFestivalsForYear(year: number): FestivalItem[] {
  const prefix = `${year}-`;
  return ALL_FESTIVALS.filter((f) => f.date.startsWith(prefix));
}

/**
 * Filter festivals by year and category
 */
export function getFestivalsByYearAndCategory(
  year: number,
  category: "all" | FestivalCategory,
): FestivalItem[] {
  let list = getFestivalsForYear(year);
  if (category !== "all") {
    list = list.filter((f) => f.category === category);
  }
  return list;
}

/**
 * Get upcoming festivals from a reference date
 */
export function getUpcomingFestivalsMultiYear(
  fromDate: Date = new Date(),
  limit: number = 3,
): FestivalItem[] {
  const dateStr = fromDate.toISOString().slice(0, 10);
  const future = ALL_FESTIVALS.filter((f) => f.date >= dateStr);
  if (future.length >= limit) {
    return future.slice(0, limit);
  }
  return future;
}

/**
 * Find a festival by its unique slug ID
 */
export function getFestivalById(id: string): FestivalItem | undefined {
  return ALL_FESTIVALS.find((f) => f.id === id);
}

/**
 * Find all festivals falling on a specific date (YYYY-MM-DD)
 */
export function getFestivalsByDate(dateStr: string): FestivalItem[] {
  return ALL_FESTIVALS.filter((f) => f.date === dateStr);
}

/**
 * Search festivals by query string across all years or for a specific year
 */
export function searchFestivalsMultiYear(
  query: string,
  year?: number,
): FestivalItem[] {
  const q = query.trim().toLowerCase();
  const list = year ? getFestivalsForYear(year) : ALL_FESTIVALS;
  if (!q) return list;

  return list.filter((f) => {
    return (
      f.name.toLowerCase().includes(q) ||
      f.nativeName.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.lunarMonth.toLowerCase().includes(q) ||
      f.categoryLabel.toLowerCase().includes(q) ||
      f.significance.toLowerCase().includes(q) ||
      f.rituals.some((r) => r.toLowerCase().includes(q)) ||
      f.date.includes(q)
    );
  });
}
