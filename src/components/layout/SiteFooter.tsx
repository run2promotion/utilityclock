"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/context/locale-context";
import type { AppLocale } from "@/i18n/config";
import {
  FOOTER_TOP_ALARM_SLUGS,
  FOOTER_TOP_HOLIDAY_TIMER_SLUGS,
  FOOTER_TOP_STOPWATCH_SLUGS,
  FOOTER_TOP_TIMER_SLUGS,
} from "@/data/footer-sitemap-links";
import { getHolidayBySlug } from "@/data/holidays";
import { getToolDefinition, type ToolCategoryId } from "@/data/tools";
import { getLocalizedToolMetadata } from "@/i18n/tool-metadata";
import { buildLegalPath, buildPath } from "@/i18n/routing";
import Link from "next/link";

function toolLinkLabel(
  locale: AppLocale,
  category: ToolCategoryId,
  slug: string,
): string {
  const def = getToolDefinition(category, slug);
  if (def) {
    return getLocalizedToolMetadata(locale, category, slug, def).title;
  }
  if (category === "timer") {
    const h = getHolidayBySlug(slug);
    if (h) return h.name;
  }
  return slug;
}

function FooterLinkColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
        {title}
      </h3>
      <ul className="mt-2 space-y-1.5">{children}</ul>
    </div>
  );
}

export function SiteFooter() {
  const { locale, messages } = useI18n();
  const f = messages.footer;
  const nav = messages.nav;

  return (
    <footer className="border-t border-zinc-200/90 bg-zinc-50/90 text-xs text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-950/80 dark:text-zinc-400">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8">
        <section aria-labelledby="footer-sitemap-heading">
          <h2 id="footer-sitemap-heading" className="sr-only">
            {f.sitemapHeading}
          </h2>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <FooterLinkColumn title={nav.alarm}>
              {FOOTER_TOP_ALARM_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    href={buildPath(locale, {
                      type: "tool",
                      category: "alarm",
                      canonicalSlug: slug,
                    })}
                    className="line-clamp-2 text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
                  >
                    {toolLinkLabel(locale, "alarm", slug)}
                  </Link>
                </li>
              ))}
            </FooterLinkColumn>
            <FooterLinkColumn title={nav.timer}>
              {FOOTER_TOP_TIMER_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    href={buildPath(locale, {
                      type: "tool",
                      category: "timer",
                      canonicalSlug: slug,
                    })}
                    className="line-clamp-2 text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
                  >
                    {toolLinkLabel(locale, "timer", slug)}
                  </Link>
                </li>
              ))}
            </FooterLinkColumn>
            <FooterLinkColumn title={nav.stopwatch}>
              {FOOTER_TOP_STOPWATCH_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    href={buildPath(locale, {
                      type: "tool",
                      category: "stopwatch",
                      canonicalSlug: slug,
                    })}
                    className="line-clamp-2 text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
                  >
                    {toolLinkLabel(locale, "stopwatch", slug)}
                  </Link>
                </li>
              ))}
            </FooterLinkColumn>
            <FooterLinkColumn title={nav.holidays}>
              <li>
                <Link
                  href={buildPath(locale, { type: "holidays" })}
                  className="text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
                >
                  {nav.holidays}
                </Link>
              </li>
              {FOOTER_TOP_HOLIDAY_TIMER_SLUGS.slice(0, 4).map((slug) => (
                <li key={slug}>
                  <Link
                    href={buildPath(locale, {
                      type: "tool",
                      category: "timer",
                      canonicalSlug: slug,
                    })}
                    className="line-clamp-2 text-zinc-700 underline-offset-2 hover:text-zinc-900 hover:underline dark:text-zinc-300 dark:hover:text-zinc-100"
                  >
                    {toolLinkLabel(locale, "timer", slug)}
                  </Link>
                </li>
              ))}
            </FooterLinkColumn>
          </div>
        </section>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-zinc-200/80 pt-6 dark:border-zinc-800/80 sm:flex-row">
          <nav
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
            aria-label={f.legalNavLabel}
          >
            <Link
              href={buildLegalPath(locale, "about")}
              className="underline-offset-2 hover:text-zinc-900 hover:underline dark:hover:text-zinc-200"
            >
              {f.about}
            </Link>
            <Link
              href={buildLegalPath(locale, "privacy")}
              className="underline-offset-2 hover:text-zinc-900 hover:underline dark:hover:text-zinc-200"
            >
              {f.privacy}
            </Link>
            <Link
              href={buildLegalPath(locale, "terms")}
              className="underline-offset-2 hover:text-zinc-900 hover:underline dark:hover:text-zinc-200"
            >
              {f.terms}
            </Link>
            <Link
              href="/sitemap.xml"
              className="underline-offset-2 hover:text-zinc-900 hover:underline dark:hover:text-zinc-200"
            >
              Sitemap
            </Link>
          </nav>
          <p className="text-center sm:text-right">{f.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
