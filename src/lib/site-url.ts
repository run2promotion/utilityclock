/**
 * Canonical production URL origin for OG/canonical/sitemap/share links.
 * Set NEXT_PUBLIC_SITE_URL (no trailing slash) — use www if that is your primary host.
 */
export function siteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) return raw.replace(/\/$/, "");
  return "https://utilityclock.com";
}
