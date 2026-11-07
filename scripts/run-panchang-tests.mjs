import { runValidationSuite } from "../src/lib/panchang/test-suite.ts";

console.log("================================================================================");
console.log("  UTILITYCLOCK INDEPENDENT ASTRONOMICAL & PANCHANG VALIDATION SUITE");
console.log("================================================================================\n");

const result = runValidationSuite();

console.table(
  result.records.map((r) => ({
    ID: r.id,
    Type: r.testType,
    Category: r.category,
    Expected: r.expectedValue.slice(0, 35),
    Actual: r.actualValue.slice(0, 38),
    Status: r.status,
  })),
);

// Group by TestType
const typeBreakdown = result.records.reduce((acc, r) => {
  acc[r.testType] = acc[r.testType] || { total: 0, passed: 0, failed: 0 };
  acc[r.testType].total++;
  if (r.status === "PASS") acc[r.testType].passed++;
  else acc[r.testType].failed++;
  return acc;
}, {});

console.log("\n--- TEST CATEGORIZATION SUMMARY ---");
console.table(typeBreakdown);

console.log(`\nOverall Results: ${result.summary.passed} PASSED / ${result.summary.total} TOTAL (${result.summary.failed} FAILED)`);

if (result.summary.failed > 0) {
  console.error("Validation suite FAILED!");
  process.exit(1);
} else {
  console.log("Validation suite PASSED with all criteria met within documented tolerances.");
  process.exit(0);
}
