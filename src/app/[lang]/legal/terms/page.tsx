import { LegalShell } from "@/components/legal/LegalShell";
import { isAppLocale, locales, type AppLocale } from "@/i18n/config";
import { hreflangAlternates } from "@/i18n/alternates";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const siteBase =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
    page: "terms",
  });
  return {
    title: "Terms of Service",
    description:
      "Terms governing use of Utility Clock: the Services are provided as-is; we are not liable for missed alarms or device failures.",
    alternates: {
      canonical: alt.canonical,
      languages: alt.languages,
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();

  return (
    <LegalShell title="Terms of Service">
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Last updated: May 2, 2026
      </p>
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use
        of Utility Clock websites and browser-based tools (the
        &quot;Services&quot;). By using the Services, you agree to these Terms.
        If you do not agree, do not use the Services.
      </p>

      <h2>1. The Services</h2>
      <p>
        We provide informational and utility features such as alarms, timers,
        stopwatches, and clocks. Features may change, be suspended, or be
        discontinued at any time. We may place advertising on the Services,
        including through third-party networks such as Google AdSense, subject
        to our Privacy Policy.
      </p>

      <h2>2. No professional advice</h2>
      <p>
        The Services are general-purpose tools. They do not constitute medical,
        legal, financial, or safety advice. You are solely responsible for how
        you use timing information in your personal or professional contexts.
      </p>

      <h2>3. Provided &quot;as-is&quot; and &quot;as-available&quot;</h2>
      <p>
        THE SERVICES ARE PROVIDED <strong>AS-IS</strong> AND{" "}
        <strong>AS-AVAILABLE</strong>, WITHOUT WARRANTIES OF ANY KIND, WHETHER
        EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
        NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE
        UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
      </p>

      <h2>4. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL
        UTILITY CLOCK OR ITS SUPPLIERS OR LICENSORS BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
        PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR
        RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICES.
      </p>
      <p>
        <strong>
          We are not liable for missed alarms, late timers, incorrect world-clock
          readings, or any consequence arising from device failure, battery
          drain, operating-system sleep or hibernation, &quot;Do Not
          Disturb&quot; or focus modes, browser tab throttling, notification
          permissions being denied, silent hardware switches, network outages, or
          any other cause outside our reasonable control.
        </strong>{" "}
        You acknowledge that browser-based alarms and notifications depend on
        platform behavior that we do not control.
      </p>
      <p>
        SOME JURISDICTIONS DO NOT ALLOW CERTAIN LIMITATIONS; IN THOSE
        JURISDICTIONS OUR LIABILITY WILL BE LIMITED TO THE GREATEST EXTENT
        PERMITTED BY LAW.
      </p>

      <h2>5. Indemnity</h2>
      <p>
        You will defend, indemnify, and hold harmless Utility Clock and its
        affiliates from any claims, liabilities, damages, losses, and expenses
        arising out of your misuse of the Services or violation of these Terms,
        except to the extent caused by our willful misconduct.
      </p>

      <h2>6. Third-party services</h2>
      <p>
        The Services may link to or integrate third-party sites, analytics, or
        advertising partners. Their terms and privacy policies apply to their
        collection and use of information. We are not responsible for third-party
        practices.
      </p>

      <h2>7. Changes</h2>
      <p>
        We may modify these Terms at any time. We will post the updated Terms on
        this page and revise the &quot;Last updated&quot; date. Continued use
        after changes become effective constitutes acceptance of the revised
        Terms.
      </p>

      <h2>8. Governing law</h2>
      <p>
        Unless a mandatory law of your country provides otherwise, these Terms
        are governed by the laws applicable to the operator of Utility Clock,
        without regard to conflict-of-law rules. Courts in that jurisdiction will
        have exclusive venue, unless prohibited by law.
      </p>

      <h2>9. Contact</h2>
      <p>
        For questions about these Terms, please use the contact method published
        on this website.
      </p>
    </LegalShell>
  );
}
