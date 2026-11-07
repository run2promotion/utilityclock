"use client";

import { useI18n } from "@/context/locale-context";
import {
  detectEcosystem,
  ECOSYSTEMS,
  type EcosystemId,
} from "@/config/navigation-ecosystems";
import { buildLegalPath } from "@/i18n/routing";
import { siteOrigin } from "@/lib/site-url";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export function SiteFooter() {
  const pathname = usePathname() ?? "/";
  const { locale } = useI18n();
  const siteUrl = siteOrigin();

  const currentEcosystemId: EcosystemId = useMemo(() => {
    return detectEcosystem(pathname);
  }, [pathname]);

  const currentEcosystem = ECOSYSTEMS[currentEcosystemId] ?? ECOSYSTEMS["general-tools"];

  const shareText = encodeURIComponent(
    "Utility Clock - Global timekeeping, panchang, calendars, and online utility platform",
  );
  const shareLinks = [
    { id: "facebook", label: "f", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`, cls: "bg-[#1877f2] text-white" },
    { id: "x", label: "X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl)}&text=${shareText}`, cls: "bg-black text-white" },
    { id: "whatsapp", label: "WA", href: `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(siteUrl)}`, cls: "bg-[#25D366] text-white" },
    { id: "linkedin", label: "in", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`, cls: "bg-[#0a66c2] text-white" },
    { id: "reddit", label: "R", href: `https://www.reddit.com/submit?url=${encodeURIComponent(siteUrl)}&title=${shareText}`, cls: "bg-[#ff4500] text-white" },
  ] as const;

  const legalLinks = [
    { id: "about" as const, label: "About UtilityClock" },
    { id: "contact" as const, label: "Contact Us" },
    { id: "privacy" as const, label: "Privacy Policy" },
    { id: "terms" as const, label: "Terms of Service" },
    { id: "disclaimer" as const, label: "Disclaimer" },
    { id: "editorial" as const, label: "Editorial Policy" },
  ];

  return (
    <footer
      id="site-footer"
      className="border-t border-zinc-200/90 bg-zinc-50/90 text-xs text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-950/80 dark:text-zinc-400"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8">
        {/* Niche Ecosystem Title & Tagline in Footer */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200/80 pb-4 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                {currentEcosystem.name[locale] ?? currentEcosystem.name.en}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                Ecosystem Directory
              </span>
            </div>
            <p className="mt-0.5 text-xs text-zinc-500">
              {currentEcosystem.tagline[locale] ?? currentEcosystem.tagline.en}
            </p>
          </div>
          <Link
            href={`/${locale}`}
            className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            ← View All UtilityClock Products
          </Link>
        </div>

        {/* Niche-Specific Contextual Sitemaps */}
        <section aria-labelledby="footer-niche-heading">
          <h2 id="footer-niche-heading" className="sr-only">
            {currentEcosystem.name[locale] ?? currentEcosystem.name.en} Navigation Directory
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {currentEcosystem.footerSections.map((section, idx) => (
              <div key={idx} className="min-w-0">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200">
                  {section.title[locale] ?? section.title.en}
                </h3>
                <ul className="mt-3 space-y-2">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      <Link
                        href={`/${locale}${link.href}`}
                        className="text-zinc-600 transition-colors hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
                      >
                        {link.label[locale] ?? link.label.en}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Global Legal & Corporate Navigation */}
        <div className="mt-10 border-t border-zinc-200/80 pt-6 dark:border-zinc-800/80">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Legal Links */}
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {legalLinks.map((item) => (
                <li key={item.id}>
                  <Link
                    href={buildLegalPath(locale, item.id)}
                    className="hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Share Badges */}
            <div className="flex items-center gap-2" aria-label="Share Utility Clock">
              <span className="text-[11px] text-zinc-400">Share:</span>
              <div className="flex items-center gap-1">
                {shareLinks.map((s) => (
                  <a
                    key={s.id}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold opacity-80 transition hover:opacity-100 ${s.cls}`}
                    aria-label={`Share on ${s.id}`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400">
            <p>© {new Date().getFullYear()} UtilityClock. All rights reserved. Global multi-niche utility platform.</p>
            <p>Calculations, astronomical ephemeris, and timers run 100% in your browser memory.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
