"use client";

import { usePathname, useSearchParams } from "next/navigation";

export function EmbedAttributionFromQuery() {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const isEmbedMode = searchParams.get("embed") === "1";

  if (!isEmbedMode) return null;

  const query = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key === "embed") return;
    query.set(key, value);
  });
  query.set("utm_source", "embed");
  query.set("utm_medium", "widget");
  query.set("utm_campaign", "embed_backlink");
  const href = `${pathname}?${query.toString()}`;

  return (
    <div className="pointer-events-auto fixed bottom-1 left-1/2 z-40 -translate-x-1/2 rounded bg-black/70 px-2 py-1 text-[10px] text-zinc-200">
      Powered by{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-emerald-400 underline-offset-2 hover:underline"
      >
        Utility Clock
      </a>
    </div>
  );
}
