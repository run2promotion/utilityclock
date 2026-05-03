import type { AppLocale } from "./config";
import { locales } from "./config";
import { buildAlternatePaths } from "./routing";

function siteBase(base: string): string {
  return base.replace(/\/$/, "");
}

export function hreflangAlternates(
  baseUrl: string,
  currentLocale: AppLocale,
  variant: Parameters<typeof buildAlternatePaths>[0],
): { canonical: string; languages: Record<string, string> } {
  const paths = buildAlternatePaths(variant);
  const b = siteBase(baseUrl);
  const languages: Record<string, string> = {
    "x-default": `${b}${paths.en}`,
  };
  for (const loc of locales) {
    languages[loc] = `${b}${paths[loc]}`;
  }
  return {
    canonical: `${b}${paths[currentLocale]}`,
    languages,
  };
}
