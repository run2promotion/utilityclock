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
    page: "about",
  });
  return {
    title: "About us · Our mission",
    description:
      "Why Utility Clock exists: fast, privacy-first browser timing tools built with Next.js — ad-free for now, focused on accuracy you can trust.",
    alternates: {
      canonical: alt.canonical,
      languages: alt.languages,
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params;
  if (!isAppLocale(lang)) notFound();

  return (
    <LegalShell title="Our mission">
      <p>
        Utility Clock exists for a simple reason: everyone deserves timing tools
        that feel instant, stay out of the way, and respect what happens on
        their own device. We are building a family of alarms, timers,
        stopwatches, and world-clock views you can open in any modern browser —
        without installing an app, creating an account, or handing over your
        schedule to a server.
      </p>
      <h2>Fast, calm, and (for now) ad-free</h2>
      <p>
        We believe utility pages should load quickly and stay readable. The
        site is engineered for a snappy first paint and smooth interactions so
        you can set an alarm or start a timer in the moment you need it — not
        after a wall of distractions. We are{" "}
        <strong>ad-free for the time being</strong> while we focus on product
        quality and trust; if we introduce advertising in the future, we will
        update our Privacy Policy and be transparent about what that means for
        cookies and data.
      </p>
      <h2>Privacy-first by design</h2>
      <p>
        Your presets, alarm times, and timer configurations are processed in
        your browser. We do not need a copy of your kitchen timer or your
        meeting countdown on our infrastructure for the tools to work. That
        keeps your day-to-day timing data closer to you and reduces unnecessary
        exposure — a core part of how we think about responsible utility
        software on the web.
      </p>
      <h2>Built on Next.js</h2>
      <p>
        The product is implemented with{" "}
        <a
          href="https://nextjs.org"
          className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
          rel="noopener noreferrer"
          target="_blank"
        >
          Next.js
        </a>
        , React&apos;s server and client model, and modern web APIs. That stack
        helps us ship accessible interfaces, strong SEO for preset pages, and
        predictable performance across devices — from a phone on Wi‑Fi to a
        desktop on wired Ethernet.
      </p>
      <h2>Accuracy you can feel</h2>
      <p>
        Countdowns and clocks should track real time faithfully. We focus on{" "}
        <strong>sub-second visual accuracy</strong> in the UI — updating on
        animation frames where it matters — while being honest that absolute
        perfection depends on your hardware, operating system power
        management, and browser tab throttling. We aim to be as precise as the
        platform allows so what you see matches the moment you care about.
      </p>
      <p>
        If Utility Clock helps you start a meeting on time, pace a workout, or
        wake up once in a while, we are doing our job. Thank you for trusting us
        with a corner of your screen.
      </p>
    </LegalShell>
  );
}
