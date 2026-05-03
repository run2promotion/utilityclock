import { buildWorldClockSlugResolverMap } from "@/data/worldCitiesTop100";

/**
 * Resolve SEO slugs like `london-time` when not in tools.ts (e.g. dynamicParams).
 * Merged with the large city list from worldCitiesTop100.
 */
const SLUG_TO_ZONE: Record<string, { timeZone: string; label: string }> = {
  ...buildWorldClockSlugResolverMap(),
  sao: { timeZone: "America/Sao_Paulo", label: "São Paulo" },
};

export function slugKeyFromWorldClockSlug(slug: string): string {
  const withoutSuffix = slug.replace(/-time$/i, "").replace(/-clock$/i, "");
  return withoutSuffix.toLowerCase();
}

export function resolveWorldClockFromSlug(slug: string):
  | { timeZone: string; label: string }
  | undefined {
  const key = slugKeyFromWorldClockSlug(slug);
  return SLUG_TO_ZONE[key];
}

/** Legacy extras only if missing from main tools data */
export function getExtraWorldClockStaticParams(): {
  category: "world-clock";
  slug: string;
}[] {
  return [];
}
