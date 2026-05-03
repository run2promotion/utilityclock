/** Mirrors `next-i18n-router` config shape (types not exported from package root). */
export type I18nRouterConfig = {
  locales: readonly string[];
  defaultLocale: string;
  localeCookie?: string;
  prefixDefault?: boolean;
  serverSetCookie?: "if-empty" | "always" | "never";
};

export const locales = [
  "en",
  "de",
  "fr",
  "ja",
  "es",
  "pt",
  "ar",
  "hi",
] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

/** Cookie used by next-i18n-router (avoid generic `NEXT_LOCALE` clashes from other apps). */
export const LOCALE_COOKIE = "UTILITY_CLOCK_LOCALE";

/**
 * `serverSetCookie` defaults to `"always"` in next-i18n-router: when the URL
 * locale differs from the cookie, the cookie is updated to match the URL
 * instead of redirecting. Do not set `serverSetCookie` to `"if-empty"` with
 * localized path segments — it redirects to `/${cookieLocale}${path}` and
 * breaks non-English routes (e.g. `/fr/timer` instead of `/fr/minuteur`).
 */
export const i18nRouterConfig: I18nRouterConfig = {
  locales: [...locales],
  defaultLocale,
  localeCookie: LOCALE_COOKIE,
  prefixDefault: true,
};

export function isAppLocale(s: string): s is AppLocale {
  return (locales as readonly string[]).includes(s);
}
