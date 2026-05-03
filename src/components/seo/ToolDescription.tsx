"use client";

import type { ToolCategoryId } from "@/data/tools";
import {
  getToolDescriptionParagraphs,
  type ToolDescriptionContext,
} from "@/data/toolDescriptionCopy";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";

export type ToolDescriptionProps = ToolDescriptionContext & {
  category: ToolCategoryId;
  slug: string;
};

/**
 * SEO-oriented article block: three paragraphs tailored to category + slug.
 * Paragraphs 2–3 are visually collapsed by default with “Read more”; all text
 * stays in the DOM (no display:none) so crawlers index the full content.
 */
export function ToolDescription({
  category,
  slug,
  pageTitle,
  cityLabel,
}: ToolDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const [p1, p2, p3] = getToolDescriptionParagraphs(category, slug, {
    pageTitle,
    cityLabel,
  });

  return (
    <section
      className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 px-5 py-6 sm:px-8"
      aria-labelledby={`${id}-heading`}
    >
      <h2
        id={`${id}-heading`}
        className="text-lg font-semibold tracking-tight text-zinc-200"
      >
        About this tool
      </h2>

      <div className="mt-4 max-w-none">
        <p className="text-[15px] leading-relaxed text-zinc-400">{p1}</p>

        <div className="relative mt-4">
          <div
            id={`${id}-more`}
            className={
              expanded
                ? "space-y-4"
                : "max-h-[5.25rem] overflow-hidden sm:max-h-[5.5rem]"
            }
          >
            <p className="text-[15px] leading-relaxed text-zinc-400">{p2}</p>
            <p className="text-[15px] leading-relaxed text-zinc-400">{p3}</p>
          </div>
          {!expanded && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent"
              aria-hidden
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-500/95 hover:text-emerald-400"
          aria-expanded={expanded}
          aria-controls={`${id}-more`}
        >
          {expanded ? "Show less" : "Read more"}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </div>
    </section>
  );
}
