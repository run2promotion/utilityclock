"use client";

import { useI18n } from "@/context/locale-context";
import {
  CROSS_NICHE_RELATIONSHIPS,
  ECOSYSTEMS,
  type EcosystemId,
} from "@/config/navigation-ecosystems";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import Link from "next/link";

type InternalLinkingEngineProps = {
  /** Keyword key matching CROSS_NICHE_RELATIONSHIPS (e.g. 'diwali', 'panchang', 'love-tools') */
  relationshipKey?: string;
  /** Current ecosystem to show related ecosystem portals */
  currentEcosystem?: EcosystemId;
  /** Optional custom title */
  sectionTitle?: string;
  /** Optional custom subtitle */
  sectionSubtitle?: string;
};

export function InternalLinkingEngine({
  relationshipKey,
  currentEcosystem = "general-tools",
  sectionTitle,
  sectionSubtitle,
}: InternalLinkingEngineProps) {
  const { locale } = useI18n();

  const bridges = relationshipKey
    ? CROSS_NICHE_RELATIONSHIPS[relationshipKey]
    : undefined;

  const ecoConfig = ECOSYSTEMS[currentEcosystem] ?? ECOSYSTEMS["general-tools"];
  const relatedEcos = ecoConfig.relatedEcosystems
    .map((id) => ECOSYSTEMS[id])
    .filter(Boolean);

  return (
    <section
      aria-label="Related tools and contextual portals"
      className="mt-12 rounded-2xl border border-zinc-200/90 bg-zinc-50/60 p-6 dark:border-zinc-800/80 dark:bg-zinc-900/40"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            {sectionTitle ?? "Connected Tools & Related Resources"}
          </h3>
          <p className="text-xs text-zinc-500">
            {sectionSubtitle ?? "Explore contextual calendars, ritual guides, calculations, and companion utilities."}
          </p>
        </div>
      </div>

      {/* Structured Cross-Niche Entity Bridges */}
      {bridges && bridges.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bridges.map((bridge, idx) => (
            <Link
              key={idx}
              href={`/${locale}${bridge.href}`}
              className="group flex flex-col justify-between rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm transition hover:border-emerald-500/50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/90"
            >
              <div>
                <span className="inline-block rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  {bridge.categoryTag[locale] ?? bridge.categoryTag.en}
                </span>
                <h4 className="mt-2 text-sm font-bold text-zinc-900 transition-colors group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400">
                  {bridge.anchorTitle[locale] ?? bridge.anchorTitle.en}
                </h4>
                <p className="mt-1 text-xs text-zinc-500 line-clamp-2">
                  {bridge.description[locale] ?? bridge.description.en}
                </p>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Explore resource</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Related Ecosystem Discovery Portals */}
      {relatedEcos.length > 0 && (
        <div className="mt-6 pt-5 border-t border-zinc-200/80 dark:border-zinc-800/80">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-3">
            Explore Related Product Ecosystems
          </span>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedEcos.map((eco) => (
              <Link
                key={eco.id}
                href={`/${locale}${eco.primaryPath}`}
                className="flex items-center justify-between rounded-xl border border-zinc-200/70 bg-white/70 px-3.5 py-2.5 text-xs font-semibold transition hover:bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:bg-zinc-800"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Compass className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                  <span className="truncate text-zinc-800 dark:text-zinc-200">
                    {eco.name[locale] ?? eco.name.en}
                  </span>
                </div>
                <ArrowRight className="h-3 w-3 shrink-0 text-zinc-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
