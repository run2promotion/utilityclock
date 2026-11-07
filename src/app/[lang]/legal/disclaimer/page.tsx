import { LegalShell } from "@/components/legal/LegalShell";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { hreflangAlternates } from "@/i18n/alternates";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const siteBase =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://utilityclock.com";

type Props = { params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isAppLocale(lang)) return {};
  const locale = lang as AppLocale;
  const alt = hreflangAlternates(siteBase, locale, {
    type: "legal",
    page: "disclaimer",
  });
  return {
    title: "Legal & Calculation Disclaimer · UtilityClock",
    description:
      "Important disclaimers regarding time precision, financial calculators, astrological insights, and panchang astronomical approximations.",
    alternates: {
      canonical: alt.canonical,
      languages: alt.languages,
    },
  };
}

export default async function DisclaimerPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();

  return (
    <LegalShell title="Disclaimer & Terms of Accuracy">
      <p className="text-xs text-zinc-500">Last updated: May 2026</p>

      <h2>1. General Information Only</h2>
      <p>
        All calculators, converters, astronomical tables, calendars, and utilities provided on
        UtilityClock (https://www.utilityclock.com) are intended solely for educational, planning,
        and informational purposes.
      </p>

      <h2>2. Financial Calculations Disclaimer</h2>
      <p>
        Loan EMI, compound interest, savings milestones, break-even analyses, GST, and VAT calculations
        are mathematical simulations. Real-world lending agreements, mortgage terms, corporate taxes, and
        investment returns will vary depending on financial institutions, tax authorities, compounding
        conventions, and regulatory changes. Nothing on this website constitutes certified financial, legal,
        or tax advice.
      </p>

      <h2>3. Timing & Alarm Reliability</h2>
      <p>
        Browser-based alarms, countdown timers, and stopwatches operate within the limits of host hardware,
        operating system power-saving policies, and browser background tab throttling. Do not rely exclusively
        on browser-based timers for life-critical, medical, industrial, or mission-critical timing requirements.
      </p>

      <h2>4. Astrological & Panchang Data</h2>
      <p>
        Panchang, Tithi, Nakshatra, Muhurat, and astrological compatibility tools are computed using
        astronomical formulas and traditional ephemeris models. These calculations are offered for cultural
        and astrological study; they should not be treated as absolute or definitive guidance for major life decisions.
      </p>
    </LegalShell>
  );
}
