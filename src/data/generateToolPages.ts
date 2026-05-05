import type { ToolDefinition } from "@/data/tool-schema";

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

/** e.g. 6:15 AM for metadata */
export function formatAlarmClockLabel(h24: number, minute: number): string {
  const isPM = h24 >= 12;
  let h12 = h24 % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${pad2(minute)} ${isPM ? "PM" : "AM"}`;
}

/**
 * Every 15 minutes across a 24h cycle → 96 slugs like alarm-for-6-15-am
 */
export function buildAlarmPages(): Record<string, ToolDefinition> {
  const out: Record<string, ToolDefinition> = {};
  const minutes = [0, 15, 30, 45] as const;

  for (let h24 = 0; h24 < 24; h24++) {
    for (const minute of minutes) {
      const isPM = h24 >= 12;
      let h12 = h24 % 12;
      if (h12 === 0) h12 = 12;
      const period = isPM ? "pm" : "am";
      const slug = `alarm-for-${h12}-${pad2(minute)}-${period}`;
      const label = formatAlarmClockLabel(h24, minute);
      out[slug] = {
        title: `Set alarm for ${label} online`,
        description: `Free browser alarm preset for ${label}. Sound alert and optional notifications — works when the tab is in the background.`,
        alarm: { hour: h24, minute },
      };
    }
  }
  return out;
}

const ACTIVITY_TIMERS: {
  slug: string;
  seconds: number;
  title: string;
  description: string;
}[] = [
  {
    slug: "egg-timer",
    seconds: 300,
    title: "Egg timer online (5 minutes)",
    description:
      "Soft-to-medium egg countdown preset. Adjust your stove; we handle the time.",
  },
  {
    slug: "pomodoro-timer",
    seconds: 1500,
    title: "Pomodoro timer online (25 minutes)",
    description:
      "Focus block timer aligned with the Pomodoro Technique — one click to start.",
  },
  {
    slug: "meditation-timer",
    seconds: 600,
    title: "Meditation timer online (10 minutes)",
    description:
      "Ten-minute mindfulness or breathing session with a gentle finish alert.",
  },
  {
    slug: "workout-timer",
    seconds: 2700,
    title: "Workout timer online (45 minutes)",
    description:
      "Forty-five minute training or class block — keep the tab open for alerts.",
  },
];

const STUDY_CLUSTER_TIMERS: {
  slug: string;
  seconds: number;
  title: string;
  description: string;
}[] = [
  {
    slug: "study-session-timer",
    seconds: 50 * 60,
    title: "Study session timer (50 minutes)",
    description:
      "Fifty-minute deep-work countdown for focused study blocks with a clear finish alert.",
  },
  {
    slug: "short-study-break-timer",
    seconds: 10 * 60,
    title: "Short study break timer (10 minutes)",
    description:
      "Ten-minute reset timer between study rounds to maintain focus and avoid burnout.",
  },
  {
    slug: "exam-practice-timer",
    seconds: 90 * 60,
    title: "Exam practice timer (90 minutes)",
    description:
      "Ninety-minute mock exam countdown for timed practice and pacing drills.",
  },
  {
    slug: "reading-sprint-timer",
    seconds: 30 * 60,
    title: "Reading sprint timer (30 minutes)",
    description:
      "Thirty-minute reading sprint timer for revision, comprehension drills, and book sessions.",
  },
];

/** Minutes 1–120 + second-based presets + activity slugs (pSEO scale). */
export function buildTimerPages(): Record<string, ToolDefinition> {
  const out: Record<string, ToolDefinition> = {};

  for (let m = 1; m <= 120; m++) {
    const slug = `${m}-minute-timer`;
    out[slug] = {
      title: `${m} minute timer online`,
      description: `Count down ${m} minute${m === 1 ? "" : "s"} in your browser with a visible ring, optional notifications, and an audible finish.`,
      timer: { totalSeconds: m * 60 },
    };
  }

  out["30-second-timer"] = {
    title: "30 second timer online",
    description:
      "Half-minute countdown for quick tasks, stretches, or short transitions.",
    timer: { totalSeconds: 30 },
  };
  out["90-second-timer"] = {
    title: "90 second timer online",
    description:
      "Ninety-second countdown — useful for short exercises and micro-breaks.",
    timer: { totalSeconds: 90 },
  };
  out["2-hour-timer"] = {
    title: "2 hour timer online",
    description:
      "Two-hour countdown for long sessions, travel buffers, or events.",
    timer: { totalSeconds: 7200 },
  };

  for (const t of ACTIVITY_TIMERS) {
    out[t.slug] = {
      title: t.title,
      description: t.description,
      timer: { totalSeconds: t.seconds },
    };
  }

  for (const t of STUDY_CLUSTER_TIMERS) {
    out[t.slug] = {
      title: t.title,
      description: t.description,
      timer: { totalSeconds: t.seconds },
    };
  }

  return out;
}

const STOPWATCH_VARIANTS: { slug: string; title: string; description: string }[] = [
  {
    slug: "simple-stopwatch",
    title: "Simple online stopwatch",
    description: "Start, pause, lap, and export splits — lightweight stopwatch in your browser.",
  },
  {
    slug: "online-stopwatch",
    title: "Online stopwatch with laps",
    description: "No install: measure elapsed time with millisecond display and lap memory.",
  },
  {
    slug: "lap-stopwatch",
    title: "Lap timer online",
    description: "Record lap splits for running, meetings, or experiments with one click.",
  },
  {
    slug: "split-stopwatch",
    title: "Split timer online",
    description: "Capture split times and copy results for logs, coaching, or research.",
  },
  {
    slug: "study-stopwatch",
    title: "Study stopwatch online",
    description: "Track how long you study per session with laps for each topic block.",
  },
  {
    slug: "sports-stopwatch",
    title: "Sports stopwatch online",
    description: "High-precision timing with centiseconds for training and informal events.",
  },
  {
    slug: "meeting-stopwatch",
    title: "Meeting timer stopwatch",
    description: "Time-box discussions and capture segment lengths with lap export.",
  },
  {
    slug: "cooking-stopwatch",
    title: "Cooking stopwatch online",
    description: "Measure multi-step recipe stages with laps for each phase.",
  },
  {
    slug: "science-stopwatch",
    title: "Lab stopwatch online",
    description: "Simple elapsed-time tool for classroom demos and quick measurements.",
  },
  {
    slug: "classroom-stopwatch",
    title: "Classroom stopwatch online",
    description: "Large readable digits for projector use — laps for activities and tests.",
  },
];

export function buildStopwatchPages(): Record<string, ToolDefinition> {
  const out: Record<string, ToolDefinition> = {};
  for (const s of STOPWATCH_VARIANTS) {
    out[s.slug] = {
      title: s.title,
      description: s.description,
      stopwatch: {},
    };
  }
  return out;
}

/** Legacy URLs from early SEO slugs → same presets as generated keys */
export function buildLegacyAlarmAliases(
  generated: Record<string, ToolDefinition>,
): Record<string, ToolDefinition> {
  const aliases: Record<string, ToolDefinition> = {};
  const add = (from: string, toKey: string) => {
    const target = generated[toKey];
    if (target) aliases[from] = target;
  };
  add("alarm-for-6am", "alarm-for-6-00-am");
  add("alarm-for-7am", "alarm-for-7-00-am");
  add("alarm-for-8am", "alarm-for-8-00-am");
  add("alarm-for-530pm", "alarm-for-5-30-pm");
  add("alarm-for-730pm", "alarm-for-7-30-pm");
  return aliases;
}
