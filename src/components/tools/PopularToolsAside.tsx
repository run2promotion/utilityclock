import { getWorldClockPeerEntries } from "@/data/worldCitiesTop100";
import { getDictionary } from "@/i18n/dictionary";
import { buildPath } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/config";
import type { ToolCategoryId } from "@/data/tool-schema";
import Link from "next/link";

function hubLinks(
  locale: AppLocale,
  categories: ToolCategoryId[],
  labels: Record<ToolCategoryId, string>,
) {
  return categories.map((cat) => ({
    href: buildPath(locale, { type: "hub", category: cat }),
    label: labels[cat],
  }));
}

export function PopularToolsAside({
  locale,
  category,
  worldTimeZone,
  excludeWorldSlug,
}: {
  locale: AppLocale;
  category: ToolCategoryId;
  worldTimeZone?: string;
  excludeWorldSlug?: string;
}) {
  const t = getDictionary(locale);
  const title = t.footer.popularToolsTitle;
  const nav = t.nav;

  const labelMap: Record<ToolCategoryId, string> = {
    alarm: nav.alarm,
    timer: nav.timer,
    stopwatch: nav.stopwatch,
    "world-clock": nav.worldClock,
  };

  let links: { href: string; label: string }[] = [];

  if (category === "world-clock" && worldTimeZone && excludeWorldSlug) {
    links = getWorldClockPeerEntries(
      worldTimeZone,
      excludeWorldSlug,
      6,
    ).map((p) => ({
      href: buildPath(locale, {
        type: "tool",
        category: "world-clock",
        canonicalSlug: p.canonicalSlug,
      }),
      label: p.label,
    }));
    if (links.length === 0) {
      links = hubLinks(locale, ["alarm", "timer"], labelMap);
    }
  } else if (category === "alarm") {
    links = hubLinks(locale, ["timer", "stopwatch"], labelMap);
  } else if (category === "timer") {
    links = hubLinks(locale, ["alarm", "stopwatch"], labelMap);
  } else if (category === "stopwatch") {
    links = hubLinks(locale, ["alarm", "timer"], labelMap);
  }

  if (links.length === 0) return null;

  return (
    <aside className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 lg:sticky lg:top-20">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
