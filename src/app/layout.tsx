import { SettingsProvider } from "@/context/settings-context";
import { defaultLocale, isAppLocale, type AppLocale } from "@/i18n/config";
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
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Online alarm, timer & clocks",
    template: "%s · Utility Clock",
  },
  description:
    "Fast, browser-based alarm clock, timers, and world time tools with SEO-friendly preset pages.",
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
        <SettingsProvider>{children}</SettingsProvider>
      </body>
    </html>
  );
}
