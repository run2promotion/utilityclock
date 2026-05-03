import type { ToolCategoryId } from "@/data/tool-schema";
import { formatInTimeZone } from "date-fns-tz";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  category: ToolCategoryId;
  slug: string;
  /** Timer duration in seconds when category is timer */
  timerTotalSeconds?: number;
  worldTimeZone?: string;
  worldLabel?: string;
};

type FaqItem = {
  question: string;
  /** Plain text for FAQPage JSON-LD (`Answer.text`) */
  answerText: string;
  /** Optional rich body; defaults to one paragraph of `answerText` */
  answerBody?: ReactNode;
};

function faqPageJsonLd(items: { question: string; answerText: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answerText,
      },
    })),
  };
}

function FaqAccordionSection({
  heading,
  items,
}: {
  heading: string;
  items: FaqItem[];
}) {
  const ld = faqPageJsonLd(
    items.map(({ question, answerText }) => ({ question, answerText })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <div className="mt-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          {heading}
        </h3>
        <div className="mt-4 space-y-2">
          {items.map((item, i) => (
            <details
              key={`${item.question}-${i}`}
              className="group rounded-xl border border-zinc-800/90 bg-zinc-900/25 open:border-zinc-700/90 open:bg-zinc-900/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-zinc-200 [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 flex-1 pr-2">{item.question}</span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="border-t border-zinc-800/80 px-4 pb-4 pt-1 text-sm leading-relaxed text-zinc-500">
                {item.answerBody ?? <p>{item.answerText}</p>}
              </div>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}

function timerLabelFromSlug(slug: string): string | null {
  const m = slug.match(/^(\d+)-minute-timer$/);
  if (!m) return null;
  return `${m[1]} minute`;
}

export function DynamicSEOContent({
  category,
  slug,
  timerTotalSeconds,
  worldTimeZone,
  worldLabel,
}: Props) {
  const now = new Date();

  if (category === "timer") {
    const fromSlug = timerLabelFromSlug(slug);
    const presetHint =
      fromSlug ??
      (timerTotalSeconds != null && timerTotalSeconds < 120
        ? `${timerTotalSeconds} seconds`
        : timerTotalSeconds != null
          ? `${Math.round(timerTotalSeconds / 60)} minutes`
          : slug.replace(/-/g, " "));

    const timerFaqs: FaqItem[] = [
      {
        question: "How does the countdown work?",
        answerText:
          "The countdown runs entirely in your browser. When you press Start, the page counts down second by second, updates the progress ring, and plays a finish tone at zero if sound is enabled. You can Pause and resume, and use controls like +1 minute on supported presets. Actual accuracy depends on your device clock and whether the browser throttles timers while the tab is in the background.",
        answerBody: (
          <p>
            The countdown runs entirely in your browser. When you press{" "}
            <strong className="font-medium text-zinc-400">Start</strong>, the page counts down second
            by second, updates the progress ring, and plays a finish tone at zero if sound is
            enabled. You can <strong className="font-medium text-zinc-400">Pause</strong> and
            resume, and use controls like{" "}
            <strong className="font-medium text-zinc-400">+1 minute</strong> on supported presets.
            Actual accuracy depends on your device clock and whether the browser throttles timers
            while the tab is in the background.
          </p>
        ),
      },
      {
        question: "Will it ring if I close the tab?",
        answerText:
          "Usually no. If you close this tab or leave the site, the JavaScript timer is torn down and you will not get the on-page finish alert. Keep the timer open in a tab (even in the background) and allow notifications when prompted for the most reliable reminder. Background tabs may be throttled by the browser or OS, so do not rely on this tool for safety-critical timing.",
        answerBody: (
          <p>
            Usually <strong className="font-medium text-zinc-400">no</strong>. If you close this tab
            or leave the site, the JavaScript timer is torn down and you will not get the on-page
            finish alert. Keep the timer open in a tab (even in the background) and allow{" "}
            <strong className="font-medium text-zinc-400">notifications</strong> when prompted for
            the most reliable reminder. Background tabs may be throttled by the browser or OS, so
            do not rely on this tool for safety-critical timing.
          </p>
        ),
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          How to use this timer
        </h2>
        <p className="mt-1 text-xs text-zinc-600">Preset: {presetHint}</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>
            Choose your duration with quick presets or start from the default shown on this page.
          </li>
          <li>
            Click <strong className="font-medium text-zinc-400">Start</strong> — the ring shows
            remaining time; use <strong className="font-medium text-zinc-400">Pause</strong> or{" "}
            <strong className="font-medium text-zinc-400">+1 min</strong> while running if needed.
          </li>
          <li>
            Allow notifications if prompted so you get an alert when working in another window;
            unmute audio for the finish tone.
          </li>
        </ol>

        <FaqAccordionSection heading="Frequently asked questions" items={timerFaqs} />
      </section>
    );
  }

  if (category === "world-clock" && worldTimeZone && worldLabel) {
    const offset = formatInTimeZone(now, worldTimeZone, "XXX");
    const longName = formatInTimeZone(now, worldTimeZone, "OOOO");

    const offsetAnswerText = `The current offset from UTC for ${worldLabel} is ${offset} (${longName}). This value updates live on the clock above when regional rules or daylight saving transitions change the effective offset.`;

    const dstAnswerText = `This page uses the IANA time zone "${worldTimeZone}". If ${worldLabel} observes daylight saving time under current regional law, the offset and live clock adjust automatically on transition dates. Many equatorial and some other regions do not use DST; in those cases the offset typically stays the same all year unless policymakers change the rules.`;

    const worldFaqs: FaqItem[] = [
      {
        question: "What is the UTC offset for this city?",
        answerText: offsetAnswerText,
        answerBody: (
          <p>
            The current offset from UTC for{" "}
            <strong className="font-medium text-zinc-400">{worldLabel}</strong> is{" "}
            <strong className="font-medium text-zinc-400">{offset}</strong> ({longName}). This value
            updates live on the clock above when regional rules or daylight saving transitions
            change the effective offset.
          </p>
        ),
      },
      {
        question: "Does this city follow Daylight Savings?",
        answerText: dstAnswerText,
        answerBody: (
          <p>
            This page uses the IANA time zone{" "}
            <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-xs text-zinc-400">
              {worldTimeZone}
            </code>
            . If <strong className="font-medium text-zinc-400">{worldLabel}</strong> observes
            daylight saving time under current regional law, the offset and live clock adjust
            automatically on transition dates. Many equatorial and some other regions do not use
            DST; in those cases the offset typically stays the same all year unless policymakers
            change the rules.
          </p>
        ),
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Time zone details
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-500">
          <strong className="font-medium text-zinc-400">{worldLabel}</strong> uses the IANA zone{" "}
          <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-xs text-zinc-400">
            {worldTimeZone}
          </code>
          . The current offset from UTC is{" "}
          <strong className="font-medium text-zinc-400">{offset}</strong> ({longName}). Daylight
          saving time is reflected automatically in the live clock above.
        </p>

        <FaqAccordionSection heading="Frequently asked questions" items={worldFaqs} />
      </section>
    );
  }

  if (category === "alarm") {
    const alarmFaqs: FaqItem[] = [
      {
        question: "Does it work in the background?",
        answerText:
          "Yes, in most browsers the page can keep running in a background tab, but mobile and desktop power-saving modes may slow timers or defer audio. Keep the tab open, allow notifications if prompted, and unmute audio for the most reliable alarm experience.",
        answerBody: (
          <p>
            Yes — in most browsers the page can keep running in a background tab, but mobile and
            desktop power-saving modes may slow timers or defer audio. Keep the tab open, allow{" "}
            <strong className="font-medium text-zinc-400">notifications</strong> if prompted, and
            unmute audio for the most reliable alarm experience.
          </p>
        ),
      },
      {
        question: "Which day does the alarm fire?",
        answerText:
          "The alarm targets the next occurrence of the clock time you chose: today if that time is still in the future, otherwise tomorrow. It does not repeat on its own unless you set that behavior in a future version.",
        answerBody: (
          <p>
            The alarm targets the <strong className="font-medium text-zinc-400">next</strong>{" "}
            occurrence of the clock time you chose: today if that time is still in the future,
            otherwise tomorrow. It does not repeat on its own unless you set that behavior in a
            future version.
          </p>
        ),
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Quick guide
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-500">
          Pick your wake time, allow sound or notifications, and keep the tab open until the alarm
          fires.
        </p>

        <FaqAccordionSection heading="Frequently asked questions" items={alarmFaqs} />
      </section>
    );
  }

  if (category === "stopwatch") {
    const stopwatchFaqs: FaqItem[] = [
      {
        question: "How precise is this stopwatch?",
        answerText:
          "The display updates in your browser using high-resolution timers where available. For lab-grade measurements use dedicated hardware; this tool is intended for everyday timing, workouts, and meetings.",
        answerBody: (
          <p>
            The display updates in your browser using high-resolution timers where available. For
            lab-grade measurements use dedicated hardware; this tool is intended for everyday
            timing, workouts, and meetings.
          </p>
        ),
      },
      {
        question: "Can I export lap times?",
        answerText:
          "Yes. Use the Lap button while running, then Export laps (or copy) to move splits into a spreadsheet, training log, or notes app.",
        answerBody: (
          <p>
            Yes. Use the <strong className="font-medium text-zinc-400">Lap</strong> button while
            running, then{" "}
            <strong className="font-medium text-zinc-400">Export laps</strong> (or copy) to move
            splits into a spreadsheet, training log, or notes app.
          </p>
        ),
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Using this stopwatch
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-500">
          Press <strong className="font-medium text-zinc-400">Start</strong> to run,{" "}
          <strong className="font-medium text-zinc-400">Lap</strong> for splits, and{" "}
          <strong className="font-medium text-zinc-400">Export laps</strong> to copy results to your
          clipboard for spreadsheets or notes.
        </p>

        <FaqAccordionSection heading="Frequently asked questions" items={stopwatchFaqs} />
      </section>
    );
  }

  return null;
}
