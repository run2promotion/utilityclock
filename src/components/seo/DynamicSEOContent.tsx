import type { ToolCategoryId } from "@/data/tool-schema";
import type { AppLocale } from "@/i18n/config";
import { formatInTimeZone } from "date-fns-tz";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  locale: AppLocale;
  category: ToolCategoryId;
  slug: string;
  /** Timer duration in seconds when category is timer */
  timerTotalSeconds?: number;
  worldTimeZone?: string;
  worldLabel?: string;
};

type LocaleStrings = {
  intro: string;
  howToUse: string;
  commonUseCases: string;
  technicalPrecision: string;
  faqHeading: string;
};

const I18N: Record<AppLocale, LocaleStrings> = {
  en: {
    intro: "Introduction",
    howToUse: "How to Use",
    commonUseCases: "Common Use Cases",
    technicalPrecision: "Technical Precision",
    faqHeading: "Frequently asked questions",
  },
  de: {
    intro: "Einführung",
    howToUse: "Anwendung",
    commonUseCases: "Häufige Einsatzfälle",
    technicalPrecision: "Technische Präzision",
    faqHeading: "Häufige Fragen",
  },
  fr: {
    intro: "Introduction",
    howToUse: "Comment l’utiliser",
    commonUseCases: "Cas d’usage fréquents",
    technicalPrecision: "Précision technique",
    faqHeading: "Questions fréquentes",
  },
  ja: {
    intro: "概要",
    howToUse: "使い方",
    commonUseCases: "よくある利用シーン",
    technicalPrecision: "技術的な精度",
    faqHeading: "よくある質問",
  },
  es: {
    intro: "Introducción",
    howToUse: "Cómo usarlo",
    commonUseCases: "Casos de uso comunes",
    technicalPrecision: "Precisión técnica",
    faqHeading: "Preguntas frecuentes",
  },
  pt: {
    intro: "Introdução",
    howToUse: "Como usar",
    commonUseCases: "Casos de uso comuns",
    technicalPrecision: "Precisão técnica",
    faqHeading: "Perguntas frequentes",
  },
  ar: {
    intro: "مقدمة",
    howToUse: "طريقة الاستخدام",
    commonUseCases: "حالات استخدام شائعة",
    technicalPrecision: "الدقة التقنية",
    faqHeading: "الأسئلة الشائعة",
  },
  hi: {
    intro: "परिचय",
    howToUse: "इस्तेमाल कैसे करें",
    commonUseCases: "सामान्य उपयोग",
    technicalPrecision: "तकनीकी सटीकता",
    faqHeading: "अक्सर पूछे जाने वाले सवाल",
  },
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
  locale,
  category,
  slug,
  timerTotalSeconds,
  worldTimeZone,
  worldLabel,
}: Props) {
  const t = I18N[locale] ?? I18N.en;
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
      {
        question: "Is this timer free and no-install?",
        answerText:
          "Yes. Utility Clock is free to use, browser-based, and no-install. You can open a timer page instantly and start counting down without creating an account or downloading an app.",
      },
      {
        question: "Can I use this timer on mobile?",
        answerText:
          "Yes, it works on modern mobile browsers. For best reliability, keep the tab open, disable battery-saving restrictions for the browser, and allow notifications if you need reminders while switching apps.",
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t.intro}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          This {presetHint} timer is designed for people who need a fast, precise, browser-based
          countdown without installing software. Whether you are cooking, revising for exams,
          running a workout block, or pacing a short team task, you can open this page and start
          immediately. The interface emphasizes readability, quick controls, and low friction so
          that you spend your attention on your task instead of configuration steps. Because the
          tool is free and no-install, it is useful across laptops, shared office machines, tablets,
          and phones where app installation is restricted.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Timer pages also support preset-driven workflows: open a known duration, confirm once, and
          run. This is especially effective for repeated routines such as break intervals, deep work
          blocks, brewing windows, reading sprints, and classroom transitions. Keeping stable
          dedicated URLs for common durations also helps teams and creators share standard timing
          links that everyone can launch in one click.
        </p>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.howToUse}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>
            Confirm the timer duration you want to run. You can use this preset immediately or
            switch to a nearby preset depending on your task window.
          </li>
          <li>
            Press <strong className="font-medium text-zinc-400">Start</strong> to begin the
            countdown. While running, track remaining time in the center display and progress ring.
            If plans change mid-session, use pause, resume, reset, or quick adjustment controls.
          </li>
          <li>
            Enable notifications and keep sound available so finish alerts are easier to notice while
            you work in another tab or application. For longer sessions, keep the timer tab open in
            the background rather than closing it.
          </li>
          <li>
            When the timer ends, treat the finish state as an action trigger: start your next step,
            log completion, take a break, or move into the following sprint with the same page.
          </li>
        </ol>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t.commonUseCases}
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>
            <strong className="font-medium text-zinc-300">Kitchen timing:</strong> egg boiling,
            steeping tea, oven checks, and recipe step pacing.
          </li>
          <li>
            <strong className="font-medium text-zinc-300">Study sessions:</strong> focused revision
            blocks, spaced repetitions, and short recap intervals.
          </li>
          <li>
            <strong className="font-medium text-zinc-300">Wellness routines:</strong> breathing
            cycles, meditation rounds, stretch breaks, and hydration reminders.
          </li>
          <li>
            <strong className="font-medium text-zinc-300">Work productivity:</strong> pomodoro-style
            deep work, meeting timeboxing, and task transition control.
          </li>
          <li>
            <strong className="font-medium text-zinc-300">Training intervals:</strong> warm-up,
            rest windows, and repeated circuit timing.
          </li>
        </ul>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t.technicalPrecision}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Utility Clock timers run locally in your browser for privacy-first behavior: your countdown
          state is handled on-device, not in a cloud account. This no-install architecture reduces
          setup friction while still giving precision updates and responsive control actions. In
          active tabs, the display updates with smooth timing feedback. In background tabs, actual
          precision can be influenced by browser throttling and operating-system power policies, so
          high-stakes timing should always include a secondary backup alarm.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Even with those platform constraints, the tool is engineered for dependable everyday use:
          quick startup, clear status states, accurate remaining-time calculations, and practical
          finish notifications. This combination makes it a solid free browser-based timer for
          day-to-day work and personal routines.
        </p>

        <FaqAccordionSection heading={t.faqHeading} items={timerFaqs} />
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
      {
        question: "Is this clock synchronized in real time?",
        answerText:
          "The page continuously updates using your device clock and timezone conversion rules from the browser. It is suitable for daily scheduling and reference, but mission-critical synchronization should use authoritative time infrastructure.",
      },
      {
        question: "Can I use world clock pages for meeting planning?",
        answerText:
          "Yes. World clock pages are useful for checking local times before calls, handoffs, and launches. They help you compare city-specific local time and DST shifts quickly from a shareable URL.",
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t.intro}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          This browser-based world clock helps you check current local time in{" "}
          <strong className="font-medium text-zinc-400">{worldLabel}</strong> without installing
          extra software. It is designed for fast planning workflows: comparing city times, checking
          handoff windows, and reducing mistakes caused by daylight-saving changes.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          <strong className="font-medium text-zinc-400">{worldLabel}</strong> uses the IANA zone{" "}
          <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-xs text-zinc-400">
            {worldTimeZone}
          </code>
          . The current offset from UTC is{" "}
          <strong className="font-medium text-zinc-400">{offset}</strong> ({longName}). Daylight
          saving time is reflected automatically in the live clock above.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          For global teams, this removes guesswork. Instead of mentally converting offsets or relying
          on stale charts, everyone can reference the same city page and see the current local time
          state instantly. That lowers scheduling mistakes and improves communication quality around
          handoffs, support windows, and meeting commitments.
        </p>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.howToUse}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Open the city page you care about and check the live time display.</li>
          <li>Compare that time against your local schedule before booking meetings or calls.</li>
          <li>Re-check near transition dates because DST offsets can change local time alignment.</li>
        </ol>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t.commonUseCases}
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Cross-region meeting planning between distributed teams.</li>
          <li>Coordinating product launches and live event start times.</li>
          <li>Checking market open/close windows across financial centers.</li>
          <li>Travel preparation with destination-local time awareness.</li>
          <li>Customer support shift overlap planning across time zones.</li>
        </ul>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t.technicalPrecision}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          The page resolves timezone math locally in your browser using the IANA timezone database
          available in modern JavaScript engines. That means no-install usage and privacy-friendly
          behavior, because your viewing activity does not require an account or uploaded schedule.
          Precision is appropriate for everyday planning, while mission-critical compliance workflows
          should still validate against dedicated enterprise time systems.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          In short, you get a practical mix of speed, privacy, and precision: free no-install access
          with clear timezone labeling and live offset updates. That makes this world clock page a
          reliable day-to-day reference for international operations, travel planning, and
          cross-border collaboration.
        </p>

        <FaqAccordionSection heading={t.faqHeading} items={worldFaqs} />
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
      {
        question: "Is this alarm free and no-install?",
        answerText:
          "Yes. Utility Clock alarms are free, browser-based, and no-install. You can open an alarm preset URL and start using it immediately.",
      },
      {
        question: "Can alarms work when my laptop sleeps?",
        answerText:
          "Sleep and hibernation behavior depends on your operating system. If the device sleeps, browser timers may pause. Keep the device awake for critical reminders.",
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t.intro}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          This free browser-based alarm helps you set precise reminders without installing software.
          It is useful for wake-up times, break reminders, medication prompts, and meeting starts.
          Because alarm pages are URL-driven, you can bookmark commonly used times and launch them
          quickly across devices.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          The interface focuses on reliability and visibility: clear current state, direct controls,
          optional sound, and notification integration. For day-to-day use, this no-install approach
          keeps friction low while still supporting practical precision.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Because each alarm preset can live at a shareable URL, you can build repeatable workflows
          for routines that occur daily or weekly. Teachers, remote teams, students, and shift
          workers often use this pattern to reduce setup time and keep reminders consistent from one
          session to the next.
        </p>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.howToUse}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Select a preset time or navigate to a dedicated alarm page for your target time.</li>
          <li>Start the alarm and allow sound/notifications so alerts are noticeable.</li>
          <li>Keep the tab open and device awake if the reminder is important.</li>
          <li>Dismiss after firing, or reopen another preset for your next reminder cycle.</li>
        </ol>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t.commonUseCases}
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Morning wake-up and backup wake reminders.</li>
          <li>Short break reminders during deep work blocks.</li>
          <li>Medication, hydration, or routine interval prompts.</li>
          <li>Meeting start alerts and handoff reminders.</li>
          <li>Exam/study block boundary notifications.</li>
        </ul>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t.technicalPrecision}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Alarm calculations are handled locally in your browser for better privacy and no-install
          convenience. Precision is high for active sessions, but system sleep policies, muted audio,
          and restricted notifications can affect delivery. Use this as a dependable everyday utility
          and keep a secondary backup for high-risk schedules.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          This local-first model also means you can start quickly on shared or restricted devices
          where app installs are not possible. The combination of browser-based access, clear status
          states, and notification support gives you a strong practical baseline for everyday alarm
          needs.
        </p>

        <FaqAccordionSection heading={t.faqHeading} items={alarmFaqs} />
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
      {
        question: "Is this stopwatch free and browser-based?",
        answerText:
          "Yes. It is free, browser-based, no-install, and suitable for everyday timing tasks such as workouts, study sessions, and meetings.",
      },
      {
        question: "Does it work on mobile and desktop?",
        answerText:
          "Yes, it works on modern mobile and desktop browsers. For long sessions, keep the page open and avoid aggressive battery-saving restrictions.",
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t.intro}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          This no-install stopwatch is built for quick precision timing in the browser. It is ideal
          when you need an immediate timer for training sets, speaking practice, classroom drills,
          lab observations, or daily routines. You can start instantly, capture laps, and copy
          results without app setup.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          The UI is optimized for clarity and repeat use: readable elapsed time, reliable control
          buttons, and practical lap tracking. Being free and browser-based makes it easy to use
          across shared machines, temporary environments, and mobile devices.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Beyond sports, stopwatch timing is useful for process improvement. You can benchmark
          repeated tasks, compare methods, and track incremental speed gains over time. Since no
          installation is required, it is easy to adopt across classrooms, teams, and quick personal
          experiments.
        </p>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.howToUse}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Press Start to begin elapsed-time tracking immediately.</li>
          <li>Use Lap at checkpoints to capture split markers during activity.</li>
          <li>Pause and resume as needed, then export or copy lap data for records.</li>
          <li>Reset to begin a new run with clean timing state.</li>
        </ol>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t.commonUseCases}
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Workout intervals and round-based training sessions.</li>
          <li>Classroom activity timing and speaking drills.</li>
          <li>Meeting segment pacing and presentation rehearsal.</li>
          <li>Study sprints and focused reading sessions.</li>
          <li>Simple field/lab observations where approximate precision is enough.</li>
        </ul>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {t.technicalPrecision}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Stopwatch updates are computed locally in your browser, which supports privacy-friendly and
          no-install usage. Display precision is suitable for common productivity and training use
          cases. For compliance-grade measurement, use dedicated certified timing hardware.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          For most daily timing workflows, this provides the right trade-off: fast startup, clear
          controls, and dependable browser precision. When legal, scientific, or regulatory standards
          apply, treat this stopwatch as a convenience layer and verify with specialized equipment.
        </p>

        <FaqAccordionSection heading={t.faqHeading} items={stopwatchFaqs} />
      </section>
    );
  }

  return null;
}
