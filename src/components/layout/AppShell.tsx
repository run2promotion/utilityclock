import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { EmbedAttributionFromQuery } from "@/components/embed/EmbedAttributionFromQuery";
import { EmbedModeFromQuery } from "@/components/embed/EmbedModeFromQuery";
import { SiteFooter } from "@/components/layout/SiteFooter";

const SiteHeader = dynamic(() => import("./SiteHeader"), {
  ssr: true,
  loading: () => (
    <header
      className="sticky top-0 z-50 h-14 border-b border-zinc-200/90 bg-white/85 dark:border-zinc-800/80 dark:bg-zinc-950/85"
      aria-hidden
    />
  ),
});

/**
 * Layout reserves horizontal padding + max-width for future side-rail ads,
 * and extra bottom padding for a future bottom banner.
 * Placeholder regions use stable IDs for AdSense / Ezoic / AdThrive containers.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <EmbedModeFromQuery />
      <EmbedAttributionFromQuery />
      <SiteHeader />
      <div className="relative flex flex-1">
        {/* Left rail — reserved for programmatic ads; keep empty for layout tests */}
        <aside
          id="sidebar-ad-left"
          className="hidden w-[min(160px,14vw)] shrink-0 xl:block"
          aria-hidden
        />

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-8 sm:px-8 sm:pb-32">
          {children}
        </main>

        <aside
          id="sidebar-ad-right"
          className="hidden w-[min(160px,14vw)] shrink-0 xl:block"
          aria-hidden
        />
      </div>

      <SiteFooter />

      {/* Bottom leaderboard / anchor slot */}
      <div
        id="banner-ad-bottom"
        className="mx-auto mt-auto min-h-[90px] w-full max-w-6xl px-4 pb-4 sm:px-8"
        aria-hidden
      />
    </div>
  );
}
