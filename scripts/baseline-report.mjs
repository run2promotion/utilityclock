import fs from "node:fs/promises";
import path from "node:path";

const outDir = path.join(process.cwd(), "scripts", "reports");
const outPath = path.join(outDir, "baseline.json");

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

const snapshot = {
  generatedAt: new Date().toISOString(),
  env: process.env.NODE_ENV ?? "unknown",
  routeHealth: {
    errorBudgetPercent: safeNumber(process.env.BASELINE_ERROR_BUDGET, 1),
    topRoutes: [
      "/en",
      "/en/timer",
      "/en/alarm",
      "/en/stopwatch",
      "/en/world-clock",
    ],
  },
  cwvTargets: {
    lcpMs: 1200,
    inpMs: 200,
    cls: 0.1,
  },
  engagementBaseline: {
    timerStartsPerSession: null,
    timerCompletionRatePercent: null,
    returnVisitorsPercent: null,
  },
  notes:
    "Populate engagementBaseline with production analytics snapshots before enabling new feature flags.",
};

await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(outPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
console.log(`Wrote baseline report to ${outPath}`);
