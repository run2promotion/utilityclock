import { LegalShell } from "@/components/legal/LegalShell";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { hreflangAlternates } from "@/i18n/alternates";
import { siteOrigin } from "@/lib/site-url";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const siteBase = siteOrigin();

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
    page: "editorial",
  });
  return {
    title: "Editorial Policy & Standards · UtilityClock",
    description:
      "UtilityClock editorial integrity standards, mathematical formula verification, and cultural accuracy guidelines.",
    alternates: {
      canonical: alt.canonical,
      languages: alt.languages,
    },
  };
}

export default async function EditorialPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();

  return (
    <LegalShell title="Editorial Policy & Accuracy Standards">
      <p className="text-xs text-zinc-500">Last updated: May 2026</p>

      <h2>1. Our Editorial Mission</h2>
      <p>
        UtilityClock is committed to providing globally accessible, rigorously verified, and
        privacy-first digital tools. Whether developing scientific converters, date algorithms,
        or traditional cultural calendars, our commitment is to factual correctness, transparent
        mathematical formulas, and respect for cultural traditions.
      </p>

      <h2>2. Mathematical & Scientific Verification</h2>
      <p>
        All formulas implemented in our calculators and converters are verified against international
        standards bodies, including the International System of Units (SI), NIST, and ISO guidelines.
        Wherever approximations or rounding are required, the exact mathematical constants and rounding
        behaviors are documented clearly in the tool interface.
      </p>

      <h2>3. Cultural & Calendar Authenticity</h2>
      <p>
        Our Hindu, Gujarati, and regional Panchang systems are constructed using established astronomical
        algorithms, Lahiri Ayanamsha conventions, and standard solar-lunar ephemeris tables. We consult
        authentic traditional sources to ensure accurate festival observance dates, Vrat timings, and
        devotional texts.
      </p>

      <h2>4. Fact-Checking & Ongoing Corrections</h2>
      <p>
        We treat errors with urgency. If an astronomical ephemeris, statutory holiday, or formula definition
        contains an inaccuracy, our engineering and editorial team verifies and deploys corrections promptly.
        Readers and users are encouraged to submit corrections to <span className="font-mono text-emerald-600 dark:text-emerald-400">editorial@utilityclock.com</span>.
      </p>

      <h2>5. Independence & Integrity</h2>
      <p>
        UtilityClock does not accept sponsored calculation results or biased rankings. All browser-based tools
        remain uncompromised and accessible freely to all users worldwide.
      </p>
    </LegalShell>
  );
}
