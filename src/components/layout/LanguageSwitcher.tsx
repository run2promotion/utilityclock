"use client";

import { useI18n } from "@/context/locale-context";
import {
  isAppLocale,
  LOCALE_COOKIE,
  locales,
  type AppLocale,
} from "@/i18n/config";
import {
  buildLegalPath,
  buildPath,
  isLegalPageId,
  resolveCanonicalSlug,
  resolveRouteCategory,
} from "@/i18n/routing";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ToolCategoryId } from "@/data/tool-schema";

const NATIVE: Record<AppLocale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  ja: "日本語",
  es: "Español",
  pt: "Português",
  ar: "العربية",
  hi: "हिन्दी",
};

function pathSegments(pathname: string): string[] {
  const raw = pathname.replace(/\/+$/, "") || "/";
  return raw.split("/").filter(Boolean);
}

export function LanguageSwitcher() {
  const { locale } = useI18n();
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const segs = pathSegments(pathname);
  const urlLocale: AppLocale =
    segs[0] && isAppLocale(segs[0]) ? (segs[0] as AppLocale) : locale;

  const switchTo = (next: AppLocale) => {
    if (next === urlLocale) return;
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;

    const s = pathSegments(pathname);
    if (s.length === 0 || !isAppLocale(s[0])) {
      router.push(`/${next}`);
      return;
    }

    const from = s[0] as AppLocale;

    if (s.length === 1) {
      router.push(`/${next}`);
      return;
    }

    if (s.length === 2 && s[1] === "holidays") {
      router.push(`/${next}/holidays`);
      return;
    }

    if (s.length === 2) {
      const cat = resolveRouteCategory(s[1], from);
      if (!cat || cat === "holidays") {
        router.push(`/${next}`);
        return;
      }
      router.push(buildPath(next, { type: "hub", category: cat }));
      return;
    }

    if (s.length === 3) {
      if (s[1] === "legal" && isLegalPageId(s[2])) {
        router.push(buildLegalPath(next, s[2]));
        return;
      }
      const cat = resolveRouteCategory(s[1], from);
      if (!cat || cat === "holidays") {
        router.push(`/${next}`);
        return;
      }
      const canonicalSlug = resolveCanonicalSlug(
        s[2],
        from,
        cat as ToolCategoryId,
      );
      router.push(
        buildPath(next, {
          type: "tool",
          category: cat as ToolCategoryId,
          canonicalSlug,
        }),
      );
      return;
    }

    router.push(`/${next}`);
  };

  return (
    <label className="inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-zinc-600 dark:text-zinc-400">
      <Globe className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
      <select
        className="max-w-[9.5rem] cursor-pointer rounded-md border border-zinc-300 bg-white py-1 pl-2 pr-6 text-xs font-medium text-zinc-800 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200"
        value={urlLocale}
        aria-label="Language"
        onChange={(e) => switchTo(e.target.value as AppLocale)}
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {NATIVE[loc]}
          </option>
        ))}
      </select>
    </label>
  );
}
