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
    page: "privacy",
  });
  return {
    title: "Privacy Policy",
    description:
      "How Utility Clock handles cookies, local device processing, and Google AdSense — AdSense-oriented disclosures for transparency and consent.",
    alternates: {
      canonical: alt.canonical,
      languages: alt.languages,
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();

  return (
    <LegalShell title="Privacy Policy">
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        Last updated: May 2, 2026
      </p>
      <p>
        This Privacy Policy describes how Utility Clock (&quot;we&quot;,
        &quot;us&quot;, or &quot;our&quot;) collects, uses, and shares information
        when you use our websites and browser-based timing utilities (the
        &quot;Services&quot;). We provide this notice to help you make informed
        choices and to meet common expectations for sites that monetize with{" "}
        <strong>Google AdSense</strong> or similar display advertising.
      </p>

      <h2>1. Information we collect</h2>
      <p>
        Depending on how you use the Services, information may include: (a){" "}
        <strong>technical and usage data</strong> sent automatically by your
        browser (such as IP address, general location derived from IP, device
        type, browser version, pages visited, and timestamps); (b){" "}
        <strong>cookie and similar technologies</strong> as described below; and
        (c) information you voluntarily send us if we offer a contact method.
      </p>

      <h2>2. Cookies and similar technologies</h2>
      <p>We and our partners may use cookies and similar storage for purposes such as:</p>
      <ul>
        <li>
          <strong>Essential and functional preferences:</strong> for example,
          remembering your language choice, display options, or other settings you
          configure in the app shell so the experience stays consistent between
          visits.
        </li>
        <li>
          <strong>Measurement and improvement:</strong> understanding which pages
          load slowly or which flows confuse users so we can fix them.
        </li>
        <li>
          <strong>Advertising and personalization (where enabled):</strong> if we
          serve third-party ads (including through Google AdSense), cookies and
          advertising identifiers may be used to show you more relevant ads,
          cap how often you see a campaign, measure ad delivery, and detect fraud.
          Personalized ads rely on data collected over time from this and other
          sites or apps that use advertising partners.
        </li>
      </ul>
      <p>
        Where required by law, we will seek appropriate consent before using
        non-essential cookies (for example marketing or personalization
        categories) and provide controls consistent with the Google EU User
        Consent Policy and similar frameworks.
      </p>

      <h2>3. Local processing on your device</h2>
      <p>
        <strong>
          Alarm schedules, active timers, stopwatch state, and similar runtime
          data are processed locally in your browser
        </strong>{" "}
        using web storage and in-memory state so the tools can ring, tick, and
        recover after a refresh where designed to do so. We do not operate a
        login-based cloud backup of your personal alarm list as part of the core
        product experience described here. Do not rely on the Services as the
        only record of safety-critical events — keep separate backups where
        needed.
      </p>

      <h2>4. Third-party advertising (Google AdSense)</h2>
      <p>
        We may use <strong>Google AdSense</strong> or other Google advertising
        products to show ads on our pages. Google may use cookies and other
        technologies to collect or receive information from our Services and
        elsewhere on the Internet and use that data to provide measurement
        services and targeted ads. You can learn more about how Google uses
        data when you use our partners&apos; sites or apps by visiting{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
          rel="noopener noreferrer"
          target="_blank"
        >
          Google&apos;s Privacy &amp; Terms
        </a>
        . Google offers controls such as the{" "}
        <a
          href="https://adssettings.google.com"
          className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
          rel="noopener noreferrer"
          target="_blank"
        >
          Ads Settings
        </a>{" "}
        page and industry opt-outs where available.
      </p>

      <h2>5. Retention</h2>
      <p>
        Server logs and analytics retention periods vary by vendor and
        configuration. Cookie lifetimes depend on each cookie&apos;s purpose.
        Locally stored timing preferences persist until you clear site data or we
        overwrite them with a newer value.
      </p>

      <h2>6. Children</h2>
      <p>
        The Services are not directed to children under 13 (or the age required
        by your jurisdiction), and we do not knowingly collect personal
        information from children for targeted advertising.
      </p>

      <h2>7. International visitors</h2>
      <p>
        If you access the Services from outside the country where our servers or
        vendors operate, your information may be transferred to and processed in
        countries that may not provide the same level of data protection as your
        home country. We rely on appropriate safeguards where required.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will post the
        revised version on this page and update the &quot;Last updated&quot; date
        above. Material changes may be communicated through an additional notice
        on the site where appropriate.
      </p>

      <h2>9. Contact</h2>
      <p>
        For privacy-related questions, please use the contact method published on
        this website (for example a support email or form). If none is listed,
        you may still exercise browser- and device-level controls for cookies and
        ad personalization as described above.
      </p>
    </LegalShell>
  );
}
