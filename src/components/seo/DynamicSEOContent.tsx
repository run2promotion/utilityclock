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
  gu: {
    intro: "પરિચય",
    howToUse: "ઉપયોગ કરવાની રીત",
    commonUseCases: "સામાન્ય ઉપયોગો",
    technicalPrecision: "તકનીકી ચોકસાઈ",
    faqHeading: "વારંવાર પૂછાતા પ્રશ્નો",
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

  if (category === "date-calendar") {
    const dateFaqs: FaqItem[] = [
      {
        question: "How is biological age calculated exactly?",
        answerText:
          "Age is calculated by measuring the calendar difference between your birth date and the current date, accounting for varying month lengths (28, 29, 30, or 31 days) and leap years. Rather than dividing total days by 365.25, the tool calculates complete elapsed calendar years, followed by elapsed calendar months, and finally the remaining days.",
        answerBody: (
          <p>
            Age is calculated by measuring the calendar difference between your birth date and the
            current date, accounting for varying month lengths (28, 29, 30, or 31 days) and leap years.
            Rather than dividing total days by 365.25, the tool calculates complete elapsed calendar
            years, followed by elapsed calendar months, and finally the remaining days.
          </p>
        ),
      },
      {
        question: "How does the Business Days Calculator work?",
        answerText:
          "The Business Days Calculator iterates across each calendar day between the start and end dates and excludes Saturdays and Sundays. Because statutory public holidays vary widely by national and regional jurisdiction, this tool calculates standard 5-day Monday–Friday business weeks.",
        answerBody: (
          <p>
            The Business Days Calculator iterates across each calendar day between the start and end
            dates and excludes Saturdays and Sundays. Because statutory public holidays vary widely by
            national, state, and corporate jurisdiction, this tool calculates standard 5-day
            Monday–Friday business weeks.
          </p>
        ),
      },
      {
        question: "How are leap years determined in the Gregorian calendar?",
        answerText:
          "A year is a leap year if it is evenly divisible by 4, except for century end years (ending in 00), which must also be divisible by 400. For example, the year 2000 was a leap year, but 1900 and 2100 are not.",
        answerBody: (
          <p>
            Under the Gregorian calendar, a year is a leap year if it is evenly divisible by 4, except
            for century end years (ending in 00), which must also be divisible by 400. For example, the
            year 2000 was a leap year, but 1900 and 2100 are not.
          </p>
        ),
      },
      {
        question: "Is my personal date of birth or schedule saved anywhere?",
        answerText:
          "No. All calendar calculations take place strictly inside your browser session using native JavaScript Date math. No dates, queries, or personal information are sent to any remote server or stored in cookies.",
        answerBody: (
          <p>
            No. All calendar calculations take place strictly inside your browser session using native
            JavaScript Date math. No dates, queries, or personal information are sent to any remote
            server or stored in tracking cookies.
          </p>
        ),
      },
      {
        question: "Can I use these date tools offline?",
        answerText:
          "Yes. Once loaded in your browser or installed as a Progressive Web App (PWA), all date calculators function fully offline without an internet connection.",
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t.intro}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Our browser-based Date and Calendar utilities provide fast, mathematically precise calculations
          for everyday scheduling, milestone tracking, and project planning. Whether you need to calculate
          your exact age in years, months, and days, count working business days between deadlines, or
          determine how many days remain until a significant future event, these tools deliver instantaneous
          answers without advertisements or software installation.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Standard calendar arithmetic can easily lead to off-by-one errors due to varying month lengths
          (28 to 31 days) and quadrennial leap years. Our calculation algorithms strictly adhere to the
          international Gregorian calendar standard (ISO 8601), ensuring consistent and verified results
          for contracts, payroll periods, and personal anniversaries.
        </p>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.howToUse}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Select the specific calculator you need (Age, Date Difference, Business Days, etc.).</li>
          <li>Enter your start and end dates using the calendar date picker or direct typing.</li>
          <li>Results update instantly with full breakdowns in years, months, weeks, and total days.</li>
          <li>Use quick shortcut buttons (such as Today, +30 Days, +90 Days) to expedite common calculations.</li>
        </ol>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.commonUseCases}</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Determining statutory age for passport, driver license, or retirement eligibility.</li>
          <li>Calculating net business days for agile software sprints and construction milestones.</li>
          <li>Computing invoice payment terms (e.g. Net 30, Net 60) and statutory notice periods.</li>
          <li>Tracking days until academic exams, product launches, or weddings.</li>
          <li>Verifying ISO calendar week numbers for global corporate operations.</li>
        </ul>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.technicalPrecision}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Calculations are computed locally using exact millisecond epoch timestamps and localized
          Gregorian date components. Because all operations execute directly in your browser, your dates
          remain 100% private and calculations work with zero network latency.
        </p>

        <FaqAccordionSection heading={t.faqHeading} items={dateFaqs} />
      </section>
    );
  }

  if (category === "calculators") {
    const calcFaqs: FaqItem[] = [
      {
        question: "How are percentages calculated?",
        answerText:
          "Percentage of a number is calculated as (Percentage / 100) * Base. The ratio of two numbers is (Part / Total) * 100. Percentage change between an old and new value is ((New - Old) / Old) * 100.",
        answerBody: (
          <p>
            Three standard formulas are supported:
            <br />
            1. <strong>Value:</strong> (Percentage ÷ 100) × Base
            <br />
            2. <strong>Proportion:</strong> (Part ÷ Total) × 100
            <br />
            3. <strong>Percentage change:</strong> ((New Value − Old Value) ÷ |Old Value|) × 100
          </p>
        ),
      },
      {
        question: "Which conversion constants are used for unit conversions?",
        answerText:
          "All conversions utilize exact international scientific standards: 1 inch = 2.54 cm, 1 mile = 1.609344 km, 1 pound = 0.45359237 kg, and °F = (°C * 9/5) + 32.",
        answerBody: (
          <p>
            Conversions adhere to NIST and International System of Units (SI) standards: 1 inch is exactly
            2.54 cm, 1 international mile is 1.609344 km, 1 pound avoirdupois is exactly 0.45359237 kg,
            and temperature conversions use the exact ratio (°F = °C × 9/5 + 32).
          </p>
        ),
      },
      {
        question: "Can I use the basic calculator with my computer keyboard?",
        answerText:
          "Yes. The basic calculator supports both clicking the on-screen high-contrast keypad and direct keyboard input (numbers 0–9, +, -, *, /, Enter for equals, and Escape or C for clear).",
      },
      {
        question: "Are my numbers or calculations tracked?",
        answerText:
          "No. All mathematical operations are processed in local memory inside your web browser. No figures are logged, transmitted, or shared.",
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t.intro}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Our online calculators provide immediate, accurate arithmetic and scientific conversion tools
          engineered for daily productivity, finance, and engineering tasks. Whether you need to calculate
          sales discounts, markup percentages, tips, or convert between metric and imperial measurement
          units, our tools offer a clean, clutter-free interface with instant feedback.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Unlike ad-cluttered calculator websites that lag and show intrusive popups, UtilityClock
          calculators are lightweight, keyboard-accessible, and execute directly on your device using
          IEEE 754 floating-point precision.
        </p>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.howToUse}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Select the calculator type: Percentage, Unit Converter, or Basic Calculator.</li>
          <li>Input your numerical values into the labeled fields or use the on-screen keypad.</li>
          <li>Calculations update dynamically as you type without requiring page refreshes.</li>
          <li>Switch units or percentage modes instantly using the intuitive mode toggles.</li>
        </ol>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.commonUseCases}</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Calculating retail discounts, sales taxes, and restaurant gratuities.</li>
          <li>Analyzing quarterly revenue growth and profit margin percentage changes.</li>
          <li>Converting speed and distance units for international travel and running paces.</li>
          <li>Translating oven cooking temperatures between Celsius and Fahrenheit.</li>
          <li>Performing rapid desktop math without switching away from your browser workspace.</li>
        </ul>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.technicalPrecision}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          All computations utilize standard double-precision 64-bit floating point arithmetic.
          Rounding is performed transparently to four significant decimal places to eliminate common
          binary floating-point display artifacts while preserving precision.
        </p>

        <FaqAccordionSection heading={t.faqHeading} items={calcFaqs} />
      </section>
    );
  }

  if (category === "productivity") {
    const prodFaqs: FaqItem[] = [
      {
        question: "How does the Sleep Cycle Calculator work?",
        answerText:
          "The Sleep Cycle Calculator models sleep architecture around the typical 90-minute human ultradian cycle, which progresses through light sleep, deep slow-wave sleep, and REM. Waking up at the completion of a full cycle helps prevent sleep inertia (grogginess). The tool adds an average 14-minute sleep latency to estimate optimal bedtimes and wake times across 4 to 6 cycles.",
        answerBody: (
          <p>
            The Sleep Cycle Calculator models sleep architecture around the typical 90-minute human
            ultradian cycle, which progresses through light sleep, deep slow-wave sleep, and REM. Waking
            up at the completion of a full cycle helps prevent sleep inertia (grogginess). The tool adds
            an average 14-minute sleep latency to estimate optimal bedtimes and wake times across 4 to 6
            cycles. <em>Note: Results are wellness estimates and do not constitute medical advice.</em>
          </p>
        ),
      },
      {
        question: "What is the Pomodoro Technique?",
        answerText:
          "The Pomodoro Technique is a time management method developed by Francesco Cirillo. It uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by 5-minute short breaks, and a 15-minute long break after four consecutive work intervals.",
        answerBody: (
          <p>
            The Pomodoro Technique is a time management method developed by Francesco Cirillo. It uses a
            timer to break down work into intervals, traditionally 25 minutes in length, separated by
            5-minute short breaks, and a 15-minute long break after four consecutive work intervals. This
            rhythm helps sustain focus, reduce cognitive fatigue, and overcome procrastination.
          </p>
        ),
      },
      {
        question: "Will the timer chimes sound if the tab is in the background?",
        answerText:
          "Yes. Our timers utilize the browser Web Audio API with audio context unlocking on initial click. As long as the browser tab remains open, finish chimes and interval beeps will play audibly.",
        answerBody: (
          <p>
            Yes. Our timers utilize the browser Web Audio API with audio context unlocking on your
            initial interaction. As long as the browser tab remains open (even in the background),
            finish chimes and interval beeps will play audibly.
          </p>
        ),
      },
      {
        question: "How does the Interval / HIIT Timer function?",
        answerText:
          "You configure active Work duration, passive Rest duration, and total number of rounds. The timer guides you through each segment with distinct high-contrast color shifts and audible indicator beeps at each transition.",
      },
      {
        question: "Is any productivity or routine data stored remotely?",
        answerText:
          "No. All timer states, event countdowns, and chime preferences are stored strictly in local browser memory (localStorage). Your routines and habits remain private to your device.",
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t.intro}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Our Productivity utilities help you structure your workday, protect mental energy, and align
          your daily habits with natural circadian rhythms. From Pomodoro sprint timers and HIIT interval
          trainers to sleep cycle estimators and event countdowns, these tools reduce friction and help you
          build sustainable daily focus without subscriptions or heavyweight native software.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Time-blocking and interval pacing are proven strategies for knowledge workers, students, and
          athletes. By turning vague intentions into structured, bounded intervals with clear sensory cues,
          you can stay in flow while avoiding burnout.
        </p>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.howToUse}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Choose your productivity tool: Sleep Cycles, Pomodoro Focus, Interval Timer, or Event Countdown.</li>
          <li>For timers, press Start or press Spacebar on your keyboard to initiate countdowns.</li>
          <li>Listen for synthesized audio chimes when transitions occur.</li>
          <li>Adjust presets or customize interval durations to suit your personal energy levels.</li>
        </ol>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.commonUseCases}</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Planning bedtime and wake-up schedules to wake up naturally refreshed.</li>
          <li>Deep focus programming, writing, and research sessions using 25/5 Pomodoro blocks.</li>
          <li>High-Intensity Interval Training (HIIT), Tabata drills, and circuit conditioning.</li>
          <li>Setting hourly chimes to prompt posture checks, hydration, and eye relaxation.</li>
          <li>Tracking milestone countdowns for project launches, product releases, or exams.</li>
        </ul>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.technicalPrecision}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Timers leverage performance.now() timestamps and Web Audio API synthesized oscillators.
          This prevents timer drift and ensures crisp, reliable alert tones that function across modern
          desktop and mobile browsers without requiring external audio file downloads.
        </p>

        <FaqAccordionSection heading={t.faqHeading} items={prodFaqs} />
      </section>
    );
  }

  if (category === "converters") {
    const converterFaqs: FaqItem[] = [
      {
        question: "How accurate are the unit conversions?",
        answerText:
          "All unit conversions use exact international scientific constants defined by the International System of Units (SI), NIST, and ISO standards (e.g., 1 acre = 4046.8564224 m², 1 bar = 100,000 Pa, and 1 hp = 745.69987 Watts). Computations are performed in 64-bit IEEE 754 floating-point precision.",
      },
      {
        question: "How does the Cooking Converter handle ingredient densities?",
        answerText:
          "Because kitchen ingredients vary in density, a volumetric cup of flour weighs approximately 120 grams while a cup of granulated sugar weighs approximately 200 grams. Our cooking converter incorporates ingredient-specific density factors so you can accurately convert between weight (grams/ounces) and volume (cups/tablespoons).",
      },
      {
        question: "Why do decimal gigabytes (GB) differ from binary gibibytes (GiB)?",
        answerText:
          "Storage drive manufacturers use the decimal system where 1 GB = 1,000,000,000 bytes (10^9). Operating systems such as Windows calculate storage using the binary IEC system where 1 GiB = 1,073,741,824 bytes (2^30). Our data storage converter bridges this gap, showing exact equivalents across decimal and binary standards.",
      },
      {
        question: "How does the fuel economy conversion work between MPG and L/100km?",
        answerText:
          "Miles per Gallon (MPG) measures distance per unit volume, whereas Liters per 100 Kilometers (L/100km) measures volume consumed per fixed distance. Because these metrics are inversely related, the formula uses reciprocal division: L/100km = 235.214583 / US_MPG. Lower L/100km indicates better efficiency.",
      },
      {
        question: "Can I adjust decimal precision or copy conversion results?",
        answerText:
          "Yes. You can select between 2, 4, or 6 decimal places of precision. A dedicated Copy button lets you transfer the converted value directly to your clipboard with one click.",
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t.intro}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Our suite of unit converters provides instant, bidirectional measurement calculations across
          engineering, scientific, computing, automotive, and culinary domains. Designed for professionals,
          students, and travelers, every converter applies exact SI and ISO mathematical factors with zero
          server roundtrips.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Whether you need to convert mechanical horsepower to kilowatts, translate European vehicle fuel
          ratings, scale culinary baking recipes, or convert binary and hexadecimal memory addresses,
          these tools deliver immediate, ad-free accuracy directly on your device.
        </p>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.howToUse}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Select your source unit and enter the numerical value to convert.</li>
          <li>Select the desired target unit from the dropdown list.</li>
          <li>Use the Swap button (⇄) to instantly invert the conversion direction.</li>
          <li>Adjust decimal precision (2, 4, or 6 places) to suit your documentation requirements.</li>
          <li>Click the Copy button to copy the formatted result directly to your clipboard.</li>
        </ol>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.commonUseCases}</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Architectural floor plan drafting and land area conversions (acres, hectares, square meters).</li>
          <li>Translating automobile tire pressure and scuba tank ratings between Bar, PSI, and kPa.</li>
          <li>Sizing electrical generators and motors between mechanical horsepower (hp) and kilowatts (kW).</li>
          <li>Calculating digital file transfers, server disk space, and network bandwidth in decimal vs binary units.</li>
          <li>Adapting international cooking recipes between volumetric cups and gram weights.</li>
        </ul>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.technicalPrecision}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          All calculations are performed client-side using IEEE 754 64-bit floating point arithmetic and
          standard international conversion constants. No data is sent over the network, ensuring complete
          privacy and instantaneous performance.
        </p>

        <FaqAccordionSection heading={t.faqHeading} items={converterFaqs} />
      </section>
    );
  }

  if (category === "finance") {
    const financeFaqs: FaqItem[] = [
      {
        question: "How is the monthly Loan EMI calculated?",
        answerText:
          "Loan EMI is computed using the standard reducing-balance amortisation formula: EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1], where P is loan principal, r is the monthly interest rate (annual rate / 12 / 100), and n is the total number of monthly payments. The calculator also produces a full annual amortization schedule.",
      },
      {
        question: "What is the difference between Profit Margin and Markup?",
        answerText:
          "Profit Margin is the percentage of the selling price that is profit: Margin % = (Profit / Revenue) × 100. Markup is the percentage added to the original cost to establish the selling price: Markup % = (Profit / Cost) × 100. A 50% markup corresponds to a 33.33% profit margin.",
      },
      {
        question: "Can I enter custom GST or VAT rates?",
        answerText:
          "Yes. Our tax calculators provide quick presets for common global tax brackets (such as 5%, 12%, 18%, 20%, 28%) and allow you to enter any custom percentage rate to match your specific country, province, or product tax jurisdiction.",
      },
      {
        question: "Does the Break-Even Calculator support target profit goals?",
        answerText:
          "Yes. In addition to calculating the zero-loss break-even volume (Fixed Costs / Unit Contribution Margin), you can enter a desired target profit amount to discover the exact sales units and turnover needed to reach that profit goal.",
      },
      {
        question: "Are financial calculations private and secure?",
        answerText:
          "Yes. All financial formulas execute 100% locally in your browser memory. No loan amounts, income figures, tax numbers, or corporate revenue data are ever transmitted to any remote server.",
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t.intro}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Our Financial Calculators provide precise mathematical tools for personal finance, mortgage
          planning, sales taxation, retail pricing, and business operations. Each calculator provides
          immediate results, customizable currency formatting, and transparent mathematical formulas.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          From modeling long-term compound wealth growth and loan amortization schedules to calculating
          GST/VAT invoices, unit contribution break-even points, and savings milestones, these utilities
          empower sound financial decisions without fees or subscriptions.
        </p>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.howToUse}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Select the currency display symbol that matches your local currency ($, €, £, ₹, ¥, etc.).</li>
          <li>Enter your financial figures such as principal, interest rate, tenure, or costs.</li>
          <li>Results update instantaneously as you type or adjust inputs.</li>
          <li>Review breakdowns, amortisation tables, and graphical progress indicators.</li>
          <li>Click the Copy button to quickly capture any calculated metric.</li>
        </ol>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.commonUseCases}</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Determining monthly mortgage and auto loan payments with interest-to-principal ratios.</li>
          <li>Simulating long-term retirement savings growth with monthly deposits and compounding frequency.</li>
          <li>Calculating business invoice taxes with CGST/SGST splits or extracting pre-tax VAT.</li>
          <li>Setting retail product pricing strategies using margin and markup comparisons.</li>
          <li>Determining monthly savings amounts needed to hit a future financial goal by a set deadline.</li>
        </ul>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.technicalPrecision}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          All financial calculations are implemented using exact algebraic formulas and formatted via the
          browser Internationalization API (Intl.NumberFormat). Calculations are provided for educational
          and planning purposes and do not constitute professional financial or legal advice.
        </p>

        <FaqAccordionSection heading={t.faqHeading} items={financeFaqs} />
      </section>
    );
  }

  if (category === "text") {
    const textFaqs: FaqItem[] = [
      {
        question: "Is my text data stored or sent to any server?",
        answerText:
          "No. All text manipulation, counting, formatting, sorting, and diff comparisons execute 100% locally within your browser sandbox. Your text is never transmitted over the internet or saved to external databases.",
      },
      {
        question: "How are reading and speaking times estimated?",
        answerText:
          "Reading time is calculated using an industry-standard average of 200 words per minute for adult reading. Speaking time is based on 130 words per minute, which represents standard conversational speech pace for presentations and audio scripts.",
      },
      {
        question: "What case conversions are supported?",
        answerText:
          "The Case Converter supports UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, alternating case, and inverse case with one-click copy options.",
      },
      {
        question: "Can the Diff Checker handle large code or text blocks?",
        answerText:
          "Yes. The Diff Checker runs an in-memory line-by-line comparison algorithm that highlights added, deleted, and modified lines in real time, making it easy to review contract drafts, code snippets, and configuration files.",
      },
      {
        question: "Can I remove duplicates while ignoring case or trimming whitespace?",
        answerText:
          "Yes. The Duplicate Lines remover includes independent toggles for case sensitivity, whitespace trimming, and filtering out empty lines so you can clean datasets exactly as needed.",
      },
    ];

    return (
      <section className="mt-12 border-t border-zinc-800/80 pt-10">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">{t.intro}</h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Our Text Utilities deliver fast, secure, browser-based content formatting, counting, sorting,
          and cleaning tools. Built with a strict privacy-first architecture, all text operations happen
          entirely inside your browser with zero server data collection.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Whether you need to audit social media post character limits, reformat code variable names across
          naming conventions, deduplicate customer email lists, compare contract revisions, or generate
          Lorem Ipsum placeholder copy, these tools streamline your digital workspace.
        </p>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.howToUse}</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Paste or type your text into the input field.</li>
          <li>Metrics and transformed outputs update instantaneously in real time.</li>
          <li>Adjust formatting options (such as case sensitivity, delimiters, or sorting criteria).</li>
          <li>Click the Copy button to capture the transformed text into your clipboard.</li>
        </ol>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.commonUseCases}</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-500">
          <li>Monitoring character limits for X (Twitter) posts, SMS messages, and Google SEO title tags.</li>
          <li>Converting identifier naming conventions between camelCase, snake_case, and kebab-case for developers.</li>
          <li>Removing duplicate lines and extra whitespace from database dumps, spreadsheets, and CSV exports.</li>
          <li>Flattening multi-line paragraphs copied from PDFs into continuous sentences.</li>
          <li>Comparing draft revisions side-by-side with visual change indicators.</li>
        </ul>

        <h3 className="mt-8 text-base font-semibold text-zinc-800 dark:text-zinc-200">{t.technicalPrecision}</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          Text processing utilizes native JavaScript string APIs and regular expressions running entirely in
          the browser main thread. No analytics, tracking pixels, or third-party servers ever receive your text.
        </p>

        <FaqAccordionSection heading={t.faqHeading} items={textFaqs} />
      </section>
    );
  }

  return null;
}
