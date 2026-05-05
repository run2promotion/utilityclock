import { PwaBoot } from "@/components/pwa/PwaBoot";
import { SettingsProvider } from "@/context/settings-context";
import { defaultLocale, isAppLocale, type AppLocale } from "@/i18n/config";
import { buildSeoMeta } from "@/lib/seo-metadata";
import { isFeatureEnabled } from "@/lib/feature-flags";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Share_Tech_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-lcd",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://utilityclock.com";
const rootMeta = buildSeoMeta({
  title: "Online Timer Clock - Precision Browser Tools",
  description:
    "Use Utility Clock for precision alarms, timers, stopwatches, and world clocks. Free, browser-based, no-install timing tools built for fast daily use.",
});
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Utility Clock",
  url: siteUrl,
  description: rootMeta.description,
  brand: {
    "@type": "Brand",
    name: "Utility Clock",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon.svg"],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
  title: {
    default: rootMeta.title,
    template: "%s",
  },
  description: rootMeta.description,
  openGraph: {
    title: rootMeta.title,
    description: rootMeta.description,
    url: siteUrl,
    siteName: "Utility Clock",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const raw = h.get("x-next-i18n-router-locale");
  const locale: AppLocale =
    raw && isAppLocale(raw) ? raw : defaultLocale;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`dark ${geistSans.variable} ${geistMono.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="font-sans flex min-h-full flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {isFeatureEnabled("pwaReliability") ? <PwaBoot /> : null}
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
