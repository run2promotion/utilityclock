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
    page: "contact",
  });
  return {
    title: "Contact Us · UtilityClock",
    description:
      "Get in touch with the UtilityClock team for feedback, bug reports, feature requests, or partnership inquiries.",
    alternates: {
      canonical: alt.canonical,
      languages: alt.languages,
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();

  return (
    <LegalShell title="Contact Us">
      <p>
        We value your feedback, suggestions, and questions. UtilityClock is built for speed,
        accuracy, and user delight across global timekeeping and utility calculations.
      </p>

      <h2>General Inquiries & Feedback</h2>
      <p>
        If you have noticed a bug, have an idea for a new calculator or converter, or would like
        to report a translation suggestion in any of our 8 supported languages, please reach out to us:
      </p>
      <p className="font-mono text-emerald-600 dark:text-emerald-400">
        support@utilityclock.com
      </p>

      <h2>Editorial & Cultural Inquiries</h2>
      <p>
        For inquiries regarding our Hindu Calendar, Panchang, Festival dates, or cultural content,
        our editorial team reviews astronomical calculations and ephemeris tables regularly.
        Send your notes to:
      </p>
      <p className="font-mono text-emerald-600 dark:text-emerald-400">
        editorial@utilityclock.com
      </p>

      <h2>Response Times</h2>
      <p>
        We strive to reply to all legitimate inquiries within 1 to 2 business days.
        For emergency technical notices regarding server accessibility or security, our infrastructure team is on standby 24/7.
      </p>
    </LegalShell>
  );
}
