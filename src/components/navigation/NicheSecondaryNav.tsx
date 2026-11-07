"use client";

import { useI18n } from "@/context/locale-context";
import {
  detectEcosystem,
  ECOSYSTEMS,
  type EcosystemId,
} from "@/config/navigation-ecosystems";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type NicheSecondaryNavProps = {
  ecosystem?: EcosystemId;
  activeItem?: string;
};

export function NicheSecondaryNav({
  ecosystem: overrideEcosystem,
  activeItem: overrideActiveItem,
}: NicheSecondaryNavProps) {
  const pathname = usePathname() ?? "/";
  const { locale } = useI18n();

  const currentEcosystemId = useMemo(() => {
    return overrideEcosystem ?? detectEcosystem(pathname);
  }, [overrideEcosystem, pathname]);

  const config = ECOSYSTEMS[currentEcosystemId] ?? ECOSYSTEMS["general-tools"];

  // Normalize pathname without language prefix for active item comparison
  const cleanRoute = useMemo(() => {
    const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
    return parts.length > 1 ? `/${parts.slice(1).join("/")}` : "/";
  }, [pathname]);

  return (
    <nav
      aria-label={`${config.name[locale] ?? config.name.en} secondary navigation`}
      className="w-full border-b border-zinc-200/90 bg-zinc-50/80 backdrop-blur-sm dark:border-zinc-800/80 dark:bg-zinc-950/70"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-8">
        {/* Niche Ecosystem Title Badge */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/${locale}${config.primaryPath}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-opacity hover:opacity-85 ${config.badgeBg}`}
          >
            <span>{config.name[locale] ?? config.name.en}</span>
          </Link>
        </div>

        {/* Horizontal Scrollable Sub-Navigation Pills */}
        <div className="flex flex-1 items-center gap-1.5 overflow-x-auto py-1 scrollbar-none sm:gap-2">
          {config.secondaryNav.map((item) => {
            const itemTarget = item.href;
            const isExactMatch =
              overrideActiveItem === item.id ||
              cleanRoute === itemTarget ||
              (itemTarget !== "/" && cleanRoute.startsWith(itemTarget));

            return (
              <Link
                key={item.id}
                href={`/${locale}${item.href}`}
                aria-current={isExactMatch ? "page" : undefined}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  isExactMatch
                    ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <span>{item.label[locale] ?? item.label.en}</span>
                {item.badge && (
                  <span className="ml-1 rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-bold text-amber-700 dark:text-amber-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
