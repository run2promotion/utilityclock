import http from "node:http";

const BASE_URL = process.env.TEST_URL || "http://localhost:3005";

function fetchHeaders(urlPath) {
  return new Promise((resolve, reject) => {
    const fullUrl = new URL(urlPath, BASE_URL);
    http.get(fullUrl, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          location: res.headers.location || "",
          body,
        });
      });
    }).on("error", reject);
  });
}

async function runSeoVerification() {
  console.log("================================================================================");
  console.log("  UTILITYCLOCK LOCAL SEO, REDIRECT & PWA SMOKE TEST SUITE");
  console.log("================================================================================\n");

  const results = [];
  function record(id, title, status, details = "") {
    results.push({ id, title, status, details });
    const mark = status === "PASS" ? "✓ PASS" : "✗ FAIL";
    console.log(`[${mark}] ${id}: ${title} ${details ? `(${details})` : ""}`);
  }

  // 1. Direct root legacy redirects (HTTP 301)
  {
    const r1 = await fetchHeaders("/hindu-calendar");
    const r2 = await fetchHeaders("/gujarati-calendar");
    const passed1 = r1.statusCode === 301 && r1.location.includes("/en/calendar/hindu-calendar");
    const passed2 = r2.statusCode === 301 && r2.location.includes("/en/calendar/gujarati-calendar");
    record(
      "SEO-01-ROOT-LEGACY-301",
      "Root legacy calendar URLs return HTTP 301 to localized calendar hub paths",
      passed1 && passed2 ? "PASS" : "FAIL",
      `/hindu-calendar -> ${r1.statusCode} (${r1.location}), /gujarati-calendar -> ${r2.statusCode} (${r2.location})`,
    );
  }

  // 2. Localized legacy calendar redirects (HTTP 301 for all locales)
  {
    const sampleLocales = ["en", "hi", "gu", "de", "fr", "es", "ja", "ar", "pt"];
    let allPassed = true;
    const failures = [];
    for (const loc of sampleLocales) {
      const res = await fetchHeaders(`/${loc}/hindu-calendar`);
      if (res.statusCode !== 301 || !res.location.includes(`/${loc}/calendar/hindu-calendar`)) {
        allPassed = false;
        failures.push(`${loc}: ${res.statusCode} -> ${res.location}`);
      }
    }
    record(
      "SEO-02-LOCALIZED-LEGACY-301",
      "Localized legacy calendar URLs return HTTP 301 across all locales",
      allPassed ? "PASS" : "FAIL",
      allPassed ? "9/9 locales redirected with 301" : `Failures: ${failures.join(", ")}`,
    );
  }

  // 3. New calendar routes return HTTP 200
  {
    const rHub = await fetchHeaders("/en/calendar");
    const rHindu = await fetchHeaders("/en/calendar/hindu-calendar");
    const rGuj = await fetchHeaders("/en/calendar/gujarati-calendar");
    const passed = rHub.statusCode === 200 && rHindu.statusCode === 200 && rGuj.statusCode === 200;
    record(
      "SEO-03-CALENDAR-ROUTES-200",
      "Parent calendar hub and child calendars return HTTP 200",
      passed ? "PASS" : "FAIL",
      `Hub: ${rHub.statusCode}, Hindu: ${rHindu.statusCode}, Gujarati: ${rGuj.statusCode}`,
    );
  }

  // 4. Canonical and Hreflang Tags
  {
    const rHindu = await fetchHeaders("/en/calendar/hindu-calendar");
    const body = rHindu.body;
    const hasCanonical = body.includes('<link rel="canonical" href="https://utilityclock.com/en/calendar/hindu-calendar"/>');
    const hasXDefault = body.includes('hrefLang="x-default" href="https://utilityclock.com/en/calendar/hindu-calendar"');
    const hasEn = body.includes('hrefLang="en" href="https://utilityclock.com/en/calendar/hindu-calendar"');
    const hasHi = body.includes('hrefLang="hi" href="https://utilityclock.com/hi/calendar/hindu-calendar"');
    const hasGu = body.includes('hrefLang="gu" href="https://utilityclock.com/gu/calendar/hindu-calendar"');
    const passed = hasCanonical && hasXDefault && hasEn && hasHi && hasGu;
    record(
      "SEO-04-CANONICAL-AND-HREFLANG",
      "Self-referential canonical and full hreflang alternate links present",
      passed ? "PASS" : "FAIL",
      `Canonical: ${hasCanonical}, x-default: ${hasXDefault}, en/hi/gu alternates: ${hasEn && hasHi && hasGu}`,
    );
  }

  // 5. Sitemap XML validation
  {
    const rSitemap = await fetchHeaders("/sitemap.xml");
    const is200 = rSitemap.statusCode === 200;
    const isXml = rSitemap.body.includes('<?xml version="1.0" encoding="UTF-8"?>');
    const hasHub = rSitemap.body.includes("<loc>https://utilityclock.com/en/calendar</loc>");
    const hasHindu = rSitemap.body.includes("<loc>https://utilityclock.com/en/calendar/hindu-calendar</loc>");
    const hasGujarati = rSitemap.body.includes("<loc>https://utilityclock.com/en/calendar/gujarati-calendar</loc>");
    const hasPanchang = rSitemap.body.includes("<loc>https://utilityclock.com/en/panchang</loc>");
    const hasAstrology = rSitemap.body.includes("<loc>https://utilityclock.com/en/astrology</loc>");
    const passed = is200 && isXml && hasHub && hasHindu && hasGujarati && hasPanchang && hasAstrology;
    record(
      "SEO-05-SITEMAP-XML-INTEGRITY",
      "sitemap.xml returns HTTP 200 and indexes all new calendar & panchang routes",
      passed ? "PASS" : "FAIL",
      `Status: ${rSitemap.statusCode}, XML header: ${isXml}, Hubs indexed: ${hasHub && hasHindu && hasGujarati}`,
    );
  }

  // 6. Robots.txt
  {
    const rRobots = await fetchHeaders("/robots.txt");
    const passed = rRobots.statusCode === 200 && rRobots.body.includes("Sitemap: https://utilityclock.com/sitemap.xml");
    record(
      "SEO-06-ROBOTS-TXT",
      "robots.txt returns HTTP 200 with sitemap declaration",
      passed ? "PASS" : "FAIL",
      `Status: ${rRobots.statusCode}, Sitemap linked: ${passed}`,
    );
  }

  // 7. PWA Manifest & Service Worker
  {
    const rManifest = await fetchHeaders("/site.webmanifest");
    const rSw = await fetchHeaders("/sw.js");
    let isJson = false;
    try {
      const parsed = JSON.parse(rManifest.body);
      isJson = !!parsed.name;
    } catch {
      isJson = false;
    }
    const isSwJs = rSw.body.includes("self.addEventListener");
    const passed = rManifest.statusCode === 200 && isJson && rSw.statusCode === 200 && isSwJs;
    record(
      "SEO-07-PWA-MANIFEST-AND-SW",
      "site.webmanifest and sw.js return HTTP 200 cleanly without locale redirection",
      passed ? "PASS" : "FAIL",
      `Manifest: ${rManifest.statusCode} (JSON: ${isJson}), SW: ${rSw.statusCode} (JS: ${isSwJs})`,
    );
  }

  console.log("\n================================================================================");
  console.log("  SEO, REDIRECT & PWA TEST SUMMARY");
  console.log("================================================================================");
  console.table(results.map((r) => ({ ID: r.id, Title: r.title, Status: r.status, Details: r.details })));

  const total = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const failed = results.filter((r) => r.status === "FAIL").length;

  console.log(`\nOverall SEO Results: ${passed} PASSED / ${total} TOTAL (${failed} FAILED)`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runSeoVerification();
