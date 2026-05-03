import { LEGAL_PAGE_IDS } from "@/data/legal-pages";
import { getAllHolidayTimerSlugs } from "@/data/holidays";
import { CATEGORIES, getAllToolSlugs } from "@/data/tools";
import type { ToolCategoryId } from "@/data/tool-schema";
import { hreflangAlternates } from "@/i18n/alternates";
import { locales } from "@/i18n/config";
import type { MetadataRoute } from "next";

/** Sitemap URLs should always point to production origin. */
const base = "https://utilityclock.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Root homepage for discovery; localized home pages are listed below.
  out.push({
    url: `${base}/`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1,
  });

  const homeAlt = hreflangAlternates(base, "en", { type: "home" });
  for (const lang of locales) {
    out.push({
      url: homeAlt.languages[lang],
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
      alternates: { languages: homeAlt.languages },
    });
  }

  const holidaysAlt = hreflangAlternates(base, "en", { type: "holidays" });
  for (const lang of locales) {
    out.push({
      url: holidaysAlt.languages[lang],
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages: holidaysAlt.languages },
    });
  }

  for (const page of LEGAL_PAGE_IDS) {
    const alt = hreflangAlternates(base, "en", { type: "legal", page });
    for (const lang of locales) {
      out.push({
        url: alt.languages[lang],
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.3,
        alternates: { languages: alt.languages },
      });
    }
  }

  const hubIds = Object.keys(CATEGORIES) as ToolCategoryId[];
  for (const category of hubIds) {
    const alt = hreflangAlternates(base, "en", { type: "hub", category });
    for (const lang of locales) {
      out.push({
        url: alt.languages[lang],
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
        alternates: { languages: alt.languages },
      });
    }
  }

  for (const { category, slug } of getAllToolSlugs()) {
    const alt = hreflangAlternates(base, "en", {
      type: "tool",
      category,
      canonicalSlug: slug,
    });
    for (const lang of locales) {
      out.push({
        url: alt.languages[lang],
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: alt.languages },
      });
    }
  }

  for (const { category, slug } of getAllHolidayTimerSlugs()) {
    const alt = hreflangAlternates(base, "en", {
      type: "tool",
      category,
      canonicalSlug: slug,
    });
    for (const lang of locales) {
      out.push({
        url: alt.languages[lang],
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages: alt.languages },
      });
    }
  }

  return out;
}
