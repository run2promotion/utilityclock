import { isAppLocale, locales } from "@/i18n/config";
import { permanentRedirect } from "next/navigation";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/**
 * Permanent 301/308 redirect from legacy route /[lang]/hindu-calendar
 * to hierarchical discovery child route /[lang]/calendar/hindu-calendar.
 */
export default async function LegacyHinduCalendarRedirect({ params }: Props) {
  const { lang } = await params;
  const locale = isAppLocale(lang) ? lang : "en";
  permanentRedirect(`/${locale}/calendar/hindu-calendar`);
}
