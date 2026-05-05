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
import { siteOrigin } from "@/lib/site-url";
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
  const siteUrl = siteOrigin();
  const shareText = encodeURIComponent("Utility Clock - Free browser-based timer and clock tools");
  const shareLinks = [
    { id: "facebook", label: "f", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`, cls: "bg-[#1877f2] text-white" },
    { id: "x", label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl)}&text=${shareText}`, cls: "bg-black text-white" },
    { id: "whatsapp", label: "WA", href: `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(siteUrl)}`, cls: "bg-[#25D366] text-white" },
    { id: "linkedin", label: "in", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`, cls: "bg-[#0a66c2] text-white" },
    { id: "reddit", label: "R", href: `https://www.reddit.com/submit?url=${encodeURIComponent(siteUrl)}&title=${shareText}`, cls: "bg-[#ff4500] text-white" },
  ] as const;

  return (
    <footer
      id="site-footer"
      className="border-t border-zinc-200/90 bg-zinc-50/90 text-xs text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-950/80 dark:text-zinc-400"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
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
          <div className="flex items-center gap-2" aria-label="Share Utility Clock">
            {shareLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-sm px-2 text-[11px] font-semibold ${item.cls}`}
                aria-label={`Share on ${item.id}`}
              >
                {item.label}
              </a>
            ))}
          </div>
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
