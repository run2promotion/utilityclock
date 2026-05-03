import type { ToolCategoryId } from "@/data/tools";

/** New pSEO pattern: alarm-for-6-15-am */
function parseAlarmSlug(slug: string): string | null {
  const m = slug.match(/^alarm-for-(\d{1,2})-(\d{2})-(am|pm)$/i);
  if (!m) return null;
  const h12 = Number(m[1]);
  const ap = m[3].toUpperCase();
  return `${h12}:${m[2]} ${ap === "AM" ? "AM" : "PM"}`;
}

export type ToolDescriptionContext = {
  /** Resolved world city name when not in tools.ts */
  cityLabel?: string;
  /** Page title from metadata when helpful */
  pageTitle?: string;
};

/**
 * Returns three SEO paragraphs for the given route. Used by ToolDescription.
 */
export function getToolDescriptionParagraphs(
  category: ToolCategoryId,
  slug: string,
  ctx: ToolDescriptionContext = {},
): [string, string, string] {
  const { cityLabel, pageTitle } = ctx;

  if (category === "timer") {
    if (slug === "10-minute-timer" || slug.includes("10-minute")) {
      return [
        "A ten-minute countdown is one of the most practical formats for short breaks during focused work. Stepping away from the screen for a full ten minutes helps your eyes recover, resets attention, and makes it easier to return to deep work without burning out.",
        "Many productivity systems use ten-minute blocks between longer sessions to stretch, hydrate, or briefly reset your mental model of the task at hand. This page gives you a reliable browser-based timer so you do not have to install an app or hunt through phone settings when you only need a simple, repeatable interval.",
        "Because the timer runs locally in your browser, you can keep it open in a tab while you move around your space or switch to another window. When the countdown ends, you get a clear alert so you can transition back to work—or start another focused sprint—on your own terms.",
      ];
    }
    if (slug === "5-minute-timer" || slug.includes("5-minute")) {
      return [
        "Five minutes is long enough to brew tea, tidy a desk, or reset between meetings, but short enough that you will not lose momentum on the day’s main goals. A five-minute timer turns an vague “I’ll take a quick break” into a bounded habit you can repeat without guilt.",
        "Short timers are also useful in the kitchen, for stretching routines, or as a gentle boundary when you want to limit how long you spend on email or social feeds. This tool keeps the interface minimal so you can start the countdown in one click and stay focused on what you are doing offline.",
        "Using a dedicated timer page instead of a phone alarm reduces context switching: you stay in the same environment where you are already working. When time is up, the alert reminds you to close the loop and move to the next task without drifting.",
      ];
    }
    if (slug === "25-minute-timer" || slug.includes("25-minute")) {
      return [
        "Twenty-five minutes is the classic length of a single Pomodoro-style focus block: long enough to make real progress on a task, but short enough that maintaining concentration feels achievable. Pairing it with a short break afterward is a proven way to sustain energy through an afternoon of knowledge work.",
        "This preset is aimed at students, developers, writers, and anyone who needs a structured rhythm without installing heavyweight productivity software. You get a clear digital countdown, optional notifications, and a finish signal when the block is complete.",
        "Keeping the timer in the browser means it works across operating systems and does not depend on a specific app store. You can bookmark this URL, share it with a team, or open it on any machine where you already have a web browser available.",
      ];
    }
    return [
      "Countdown timers help you turn intentions into time-boxed actions. Whether you are cooking, exercising, studying, or batching administrative work, seeing the remaining time reduces procrastination and makes the end of the session predictable.",
      "This page offers a straightforward online timer with presets and an audible finish so you are not constantly checking the clock. It is designed for people who want utility without accounts, sign-ups, or installing another native app.",
      "Browser-based timers work well alongside calendars and task lists: the timer handles the current slice of time, while your other tools handle planning. When the alarm fires, you can decide whether to repeat the same duration or switch to a different kind of work.",
    ];
  }

  if (category === "alarm") {
    const alarmLabel = parseAlarmSlug(slug);
    if (alarmLabel) {
      return [
        `Setting an alarm for ${alarmLabel} gives you a reliable cue for waking up, starting a meeting, or switching contexts without watching the clock. Browser-based alarms are easy to adjust when plans change and work well alongside calendar apps.`,
        `Fifteen-minute increments cover most scheduling needs: you can align with transit, school bells, medication, or broadcast times. Keeping the alarm in a pinned tab means you get audio and optional desktop notifications even when another window has focus.`,
        `This page uses your chosen local time, rings at the next occurrence of that clock time (today or tomorrow), and continues to work when the tab is in the background thanks to a lightweight worker-based tick. Test the volume once so you are not surprised when it matters.`,
      ];
    }
    if (slug.includes("6") && slug.includes("am")) {
      return [
        "Waking at six in the morning is a goal for many people who want quieter hours before email, school runs, or commuting crowds. A dependable alarm—especially one you can test for volume and notifications—makes that habit easier to repeat than relying on willpower alone.",
        "Morning routines built around a fixed wake time tend to stabilize sleep schedules over weeks, not days. Whether your six AM alarm supports exercise, journaling, or uninterrupted project time, anchoring the day to a consistent start reduces decision fatigue later on.",
        "This online alarm runs in your browser with sound and optional desktop notifications, so you can set it the night before or adjust it when plans change. It complements a phone alarm for heavy sleepers who want a second signal from a device that is already open on the desk.",
      ];
    }
    if (slug.includes("7") && slug.includes("am")) {
      return [
        "A seven AM wake-up is a common choice for professionals balancing family schedules, school start times, and personal priorities. Setting an alarm for that exact time helps your body adapt to a rhythm instead of drifting toward inconsistent wake times.",
        "Strong morning routines often include hydration, light movement, and a few minutes of planning. When your alarm fires at seven, you have a predictable cue to begin those steps instead of scrolling in bed.",
        "Using a web-based alarm means you can keep your phone on silent and still get a reliable alert from your laptop or tablet. That separation can improve sleep hygiene while preserving punctuality for the start of your day.",
      ];
    }
    if (slug.includes("8") && slug.includes("am")) {
      return [
        "An eight o’clock alarm fits many nine-to-five schedules and gives a buffer before the first meeting or class. Knowing the alarm will sound at the same time each weekday reinforces circadian alignment, especially when combined with a consistent bedtime.",
        "Morning light exposure after an eight AM wake-up supports alertness and mood. Pairing your alarm with opening blinds or stepping outside—even briefly—can make the transition from sleep to focus feel less abrupt.",
        "This browser alarm is useful when you work from home and want a desktop-based reminder separate from mobile notifications. You can preview the sound level and enable notifications if you step away from the machine before it rings.",
      ];
    }
    if (slug.includes("530") || slug.includes("5-30") || slug.includes("5:30")) {
      return [
        "A 5:30 PM alarm is ideal for end-of-day boundaries: closing the laptop, leaving the office, or starting dinner before evening commitments. Audible reminders help when you are deep in flow and might otherwise work past a healthy stop time.",
        "Many remote workers use a late-afternoon alarm to signal the transition from professional to personal mode. That cue reduces burnout by making “off” time explicit rather than ambiguous.",
        "This tool rings at the preset time with sound and optional notifications, so you can trust the signal even if you are in another tab or briefly away from the screen with audio enabled.",
      ];
    }
    if (slug.includes("730") || slug.includes("7-30") || slug.includes("7:30")) {
      return [
        "A 7:30 PM alarm can anchor evening routines: workouts, family time, or preparing for the next day. When the day has been long, a scheduled reminder prevents important habits from being skipped.",
        "Evening alarms also help manage medication, cooking times, or logging off from side projects. A dedicated alarm page avoids cluttering your calendar with one-off reminders.",
        "Because this alarm works in the browser, you can set it on a shared household computer or a work laptop without tying the reminder to a single person’s phone account.",
      ];
    }
    return [
      "Online alarms are a simple way to commit to a specific clock time without digging through device settings. They are especially handy when you are already working in a browser and want a desktop-level alert.",
      "Consistent wake or reminder times support better sleep hygiene and reduce the stress of guessing whether you will notice the clock. Pairing an alarm with a short routine makes the transition into the next activity smoother.",
      "This page uses your preset hour and minute, plays an audible alert at the right moment, and can show a browser notification if you grant permission—helpful when the tab is not in focus.",
    ];
  }

  if (category === "stopwatch") {
    return [
      "A stopwatch is the right tool when you need to measure elapsed time rather than count down to zero. Athletes, facilitators, and engineers use stopwatches to capture splits, compare attempts, and keep meetings within budget.",
      "Unlike a wall clock, a digital stopwatch with lap memory lets you record multiple segments in one session. That makes it easier to analyze performance trends or document how long each phase of a process actually takes.",
      "Running the stopwatch in the browser keeps your workflow lightweight: no install step, and you can reset or copy results when you are done. Lap data can be exported for notes, spreadsheets, or training logs.",
    ];
  }

  if (category === "world-clock") {
    const place =
      cityLabel ??
      (pageTitle?.replace(/^Current time in\s*/i, "").trim() || "this location");
    return [
      `Knowing the current local time in ${place} matters for scheduling calls, shipping cutoffs, and travel plans. A dedicated world clock view shows not only the clock face but also the calendar date and how the zone relates to UTC, which changes with daylight saving rules.`,
      `Businesses with distributed teams use city-specific clocks to avoid messaging colleagues during their night hours. Students and families coordinating across countries benefit from the same at-a-glance context without manual math.`,
      `This page updates continuously so you can keep it open during a meeting or trip planning session. The time zone identifier reflects the official IANA name used by operating systems and calendars worldwide, which helps when you configure invites or booking systems.`,
    ];
  }

  return [
    "This utility page is designed to give you accurate, browser-based time tools without unnecessary complexity. You can use it alongside bookmarks, documentation, or classroom workflows whenever you need a quick reference.",
    "Web-based clocks and timers remain useful because they work across devices and do not require an app store account. They are easy to share with others who need the same preset or time zone context.",
    "For best results, allow notifications or sound where prompted so alerts remain reliable when you step away from the tab. You can always adjust permissions in your browser settings later.",
  ];
}
