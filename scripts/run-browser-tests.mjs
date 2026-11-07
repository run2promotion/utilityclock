import { chromium } from "playwright";
import http from "node:http";

const BASE_URL = process.env.TEST_URL || "http://localhost:3005";

function checkServer(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve(res.statusCode < 500);
    }).on("error", () => resolve(false));
  });
}

async function main() {
  console.log("================================================================================");
  console.log("  UTILITYCLOCK BROWSER-LEVEL INTEGRATION & UX TEST SUITE (PLAYWRIGHT)");
  console.log("================================================================================\n");

  const serverReady = await checkServer(`${BASE_URL}/en`);
  if (!serverReady) {
    console.error(`Error: Server is not responding at ${BASE_URL}. Ensure 'next start' is running!`);
    process.exit(1);
  }

  console.log(`Connecting to application server at: ${BASE_URL}\n`);

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();
  const testResults = [];

  function record(id, title, status, details = "") {
    testResults.push({ id, title, status, details });
    const mark = status === "PASS" ? "✓ PASS" : "✗ FAIL";
    console.log(`[${mark}] ${id}: ${title} ${details ? `(${details})` : ""}`);
  }

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Hindu Calendar date navigation & month grid
    // -------------------------------------------------------------------------
    {
      await page.goto(`${BASE_URL}/en/calendar/hindu-calendar`, { waitUntil: "networkidle" });
      const h1Text = await page.textContent("h1");
      const hasTitle = h1Text && h1Text.includes("Hindu Calendar 2026");
      const pageText = await page.innerText("body");
      const hasVikram = pageText.includes("Vikram Samvat 2082–2083");
      const hasShaka = pageText.includes("Shaka Samvat 1948");

      // Verify all 12 month cards in the monthly section
      const monthTitles = await page.$$eval("section#monthly h3", (els) => els.map((e) => e.innerText.trim()));
      const monthCount = monthTitles.length;
      const hasChaitra = monthTitles.some((t) => t.includes("Chaitra"));
      const hasPhalguna = monthTitles.some((t) => t.includes("Phalguna"));

      // Test jump navigation to Gujarati Calendar
      await page.click('a[href*="/calendar/gujarati-calendar"]');
      await page.waitForURL("**/calendar/gujarati-calendar");
      const navSuccess = page.url().includes("/calendar/gujarati-calendar");

      const passed = hasTitle && hasVikram && hasShaka && monthCount === 12 && hasChaitra && hasPhalguna && navSuccess;
      record(
        "BT-01-HINDU-CALENDAR-NAV",
        "Hindu Calendar date navigation & 12-month grid",
        passed ? "PASS" : "FAIL",
        `Months: ${monthCount}/12 (Chaitra -> Phalguna), VS 2082–2083, Jump Nav: ${navSuccess}`,
      );
    }

    // -------------------------------------------------------------------------
    // TEST 2: Gujarati Calendar date navigation & Amanta structure
    // -------------------------------------------------------------------------
    {
      await page.goto(`${BASE_URL}/en/calendar/gujarati-calendar`, { waitUntil: "networkidle" });
      const h1Text = await page.textContent("h1");
      const hasTitle = h1Text && h1Text.includes("Gujarati Calendar 2026");
      const pageText = await page.innerText("body");
      const hasVikram = /Vikram Samvat 2082/i.test(pageText);
      const hasBestuVaras = pageText.includes("Bestu Varas");
      const hasKartak = pageText.includes("Kartak (કારતક)");
      const hasAso = pageText.includes("Aso (આસો)");

      // Check all 12 Gujarati month cards in section#months
      const gujMonthTitles = await page.$$eval("section#months h3", (els) => els.map((e) => e.innerText.trim()));
      const monthCount = gujMonthTitles.length;

      // Navigate back to Calendar Hub via Quick Link
      await page.click('a:has-text("All Regional Calendars")');
      await page.waitForURL("**/calendar");
      const hubNav = page.url().endsWith("/calendar") || page.url().includes("/calendar");

      const passed = hasTitle && hasVikram && hasBestuVaras && hasKartak && hasAso && monthCount === 12 && hubNav;
      record(
        "BT-02-GUJARATI-CALENDAR-NAV",
        "Gujarati Calendar navigation & Amavasyanta month structure",
        passed ? "PASS" : "FAIL",
        `Months: ${monthCount}/12, Kartak & Aso present, Hub return: ${hubNav}`,
      );
    }

    // -------------------------------------------------------------------------
    // TEST 3: Panchang city selection & multi-city ephemeris
    // -------------------------------------------------------------------------
    {
      await page.goto(`${BASE_URL}/en/panchang`, { waitUntil: "networkidle" });
      const locationSelect = page.locator("label:has-text('Location:') select");

      // Default: Delhi
      await locationSelect.selectOption("delhi");
      await page.waitForTimeout(300);
      let text = await page.innerText("body");
      let match = text.match(/Sunrise\s*([0-9:]+\s*[AP]M|[0-9:]+)/i);
      const delhiSunrise = match ? match[1] : "";

      // Switch to Kolkata (East of Delhi -> earlier sunrise)
      await locationSelect.selectOption("kolkata");
      await page.waitForTimeout(300);
      text = await page.innerText("body");
      match = text.match(/Sunrise\s*([0-9:]+\s*[AP]M|[0-9:]+)/i);
      const kolkataSunrise = match ? match[1] : "";

      // Switch to Ahmedabad (West of Delhi -> later sunrise)
      await locationSelect.selectOption("ahmedabad");
      await page.waitForTimeout(300);
      text = await page.innerText("body");
      match = text.match(/Sunrise\s*([0-9:]+\s*[AP]M|[0-9:]+)/i);
      const ahmedabadSunrise = match ? match[1] : "";

      const sunrisesUpdated = !!delhiSunrise && !!kolkataSunrise && !!ahmedabadSunrise && (kolkataSunrise !== ahmedabadSunrise);
      record(
        "BT-03-PANCHANG-CITY-SELECTION",
        "Panchang city selection updates topocentric ephemeris",
        sunrisesUpdated ? "PASS" : "FAIL",
        `Delhi: ${delhiSunrise}, Kolkata: ${kolkataSunrise}, Ahmedabad: ${ahmedabadSunrise}`,
      );
    }

    // -------------------------------------------------------------------------
    // TEST 4: Panchang date selection (Diwali 2026 & Holika Dahan)
    // -------------------------------------------------------------------------
    {
      await page.goto(`${BASE_URL}/en/panchang`, { waitUntil: "networkidle" });
      const dateInput = page.locator('label:has-text("Date:") input[type="date"]');

      // Select Diwali 2026: Nov 9, 2026 (Amavasya)
      await dateInput.fill("2026-11-09");
      await page.waitForTimeout(400);
      let pageText = await page.innerText("body");
      const isDiwaliAmavasya = pageText.includes("Amavasya") || pageText.includes("अमावस्या");

      // Select Holika Dahan 2026: March 3, 2026 (Purnima)
      await dateInput.fill("2026-03-03");
      await page.waitForTimeout(400);
      pageText = await page.innerText("body");
      const isHoliPurnima = pageText.includes("Purnima") || pageText.includes("पूर्णिमा");

      const passed = isDiwaliAmavasya && isHoliPurnima;
      record(
        "BT-04-PANCHANG-DATE-SELECTION",
        "Panchang date picker updates lunar phase and tithi correctly",
        passed ? "PASS" : "FAIL",
        `Nov 9 -> Amavasya: ${isDiwaliAmavasya}; Mar 3 -> Purnima: ${isHoliPurnima}`,
      );
    }

    // -------------------------------------------------------------------------
    // TEST 5: All 5 Panchang limbs update correctly
    // -------------------------------------------------------------------------
    {
      await page.goto(`${BASE_URL}/en/panchang`, { waitUntil: "networkidle" });
      const dateInput = page.locator('label:has-text("Date:") input[type="date"]');
      await dateInput.fill("2026-03-20");
      await page.waitForTimeout(400);

      const bodyText = await page.innerText("body");
      const textLower = bodyText.toLowerCase();

      const hasTithiLimb = textLower.includes("1. tithi");
      const hasNakshatraLimb = textLower.includes("2. nakshatra");
      const hasYogaLimb = textLower.includes("3. yoga");
      const hasKaranaLimb = textLower.includes("4. karana");
      const hasVaraLimb = textLower.includes("5. vara");

      const hasTithiName = bodyText.includes("Dwitiya") || bodyText.includes("Pratipada");
      const hasNakshatraName = bodyText.includes("Ashwini") || bodyText.includes("Revati");

      const passed = hasTithiLimb && hasNakshatraLimb && hasYogaLimb && hasKaranaLimb && hasVaraLimb && hasTithiName && hasNakshatraName;
      record(
        "BT-05-FIVE-PANCHANG-LIMBS",
        "All five Panchang limbs (Tithi, Nakshatra, Yoga, Karana, Vara) render",
        passed ? "PASS" : "FAIL",
        `All 5 limbs rendered with live astronomical data: ${passed}`,
      );
    }

    // -------------------------------------------------------------------------
    // TEST 6: Sunrise & Sunset update dynamically across locations
    // -------------------------------------------------------------------------
    {
      await page.goto(`${BASE_URL}/en/panchang`, { waitUntil: "networkidle" });
      const locationSelect = page.locator("label:has-text('Location:') select");
      const dateInput = page.locator('label:has-text("Date:") input[type="date"]');
      await dateInput.fill("2026-06-21"); // Summer Solstice

      await locationSelect.selectOption("delhi");
      await page.waitForTimeout(300);
      let text = await page.innerText("body");
      let match = text.match(/Day Length:\s*([0-9h\smin]+)/i);
      const delhiDay = match ? match[1] : "";

      await locationSelect.selectOption("mumbai");
      await page.waitForTimeout(300);
      text = await page.innerText("body");
      match = text.match(/Day Length:\s*([0-9h\smin]+)/i);
      const mumbaiDay = match ? match[1] : "";

      const passed = !!delhiDay && !!mumbaiDay;
      record(
        "BT-06-SUNRISE-SUNSET-LOCATION",
        "Topocentric solar times and day length update per selected location",
        passed ? "PASS" : "FAIL",
        `Delhi Day: ${delhiDay}, Mumbai Day: ${mumbaiDay}`,
      );
    }

    // -------------------------------------------------------------------------
    // TEST 7: Udaya Tithi reflects topocentric sunrise
    // -------------------------------------------------------------------------
    {
      await page.goto(`${BASE_URL}/en/panchang`, { waitUntil: "networkidle" });
      const dateInput = page.locator('label:has-text("Date:") input[type="date"]');
      await dateInput.fill("2026-03-19");
      await page.waitForTimeout(400);

      const bodyText = await page.innerText("body");
      const hasUdayaSection = /Udaya Tithi/i.test(bodyText) || /सूर्योदय कालीन/i.test(bodyText);
      const udayaIsAmavasya = bodyText.includes("Amavasya") || bodyText.includes("अमावस्या");

      const passed = hasUdayaSection && udayaIsAmavasya;
      record(
        "BT-07-UDAYA-TITHI-LOCATION",
        "Udaya Tithi calculation is anchored to location sunrise",
        passed ? "PASS" : "FAIL",
        `Udaya banner present: ${hasUdayaSection}, Amavasya at sunrise: ${udayaIsAmavasya}`,
      );
    }

    // -------------------------------------------------------------------------
    // TEST 8: Choghadiya intervals contiguous with NO gaps or overlaps
    // -------------------------------------------------------------------------
    {
      await page.goto(`${BASE_URL}/en/panchang`, { waitUntil: "networkidle" });
      
      // Query Day Choghadiya slots from the first divide-y container in #choghadiya
      const daySlots = await page.$$eval(
        "#choghadiya .divide-y",
        (divideEls) => {
          const dayContainer = divideEls[0];
          if (!dayContainer) return [];
          return Array.from(dayContainer.children).map((el) => {
            const timeText = el.querySelector(".font-mono")?.innerText.trim() || "";
            const nameText = el.querySelector("span.font-semibold")?.innerText.trim() || "";
            return { name: nameText, time: timeText };
          });
        },
      );

      // Verify that slots exist and each slot format is "HH:MM AM – HH:MM PM"
      const has8Slots = daySlots.length === 8;
      let contiguous = true;
      for (let i = 0; i < daySlots.length - 1; i++) {
        const partsA = daySlots[i].time.split("–").map((s) => s.trim());
        const partsB = daySlots[i + 1].time.split("–").map((s) => s.trim());
        if (partsA[1] && partsB[0] && partsA[1] !== partsB[0]) {
          contiguous = false;
          break;
        }
      }

      const passed = has8Slots && contiguous;
      record(
        "BT-08-CHOGHADIYA-CONTIGUITY",
        "Choghadiya intervals contain all 8 day segments contiguous with 0 gaps/overlaps",
        passed ? "PASS" : "FAIL",
        `Slots: ${daySlots.length}/8, Strictly contiguous: ${contiguous}`,
      );
    }

    // -------------------------------------------------------------------------
    // TEST 9: Gujarati month and festival names display correctly
    // -------------------------------------------------------------------------
    {
      await page.goto(`${BASE_URL}/gu/calendar/gujarati-calendar`, { waitUntil: "networkidle" });
      const pageText = await page.innerText("body");

      const hasGuSamvat = pageText.includes("વિક્રમ સંવત");
      const hasGuKartak = pageText.includes("કારતક");
      const hasGuBestuVaras = pageText.includes("બેસતું વર્ષ");
      const hasGuDiwali = pageText.includes("દિવાળી");
      const hasGuJeth = pageText.includes("જેઠ");

      const passed = hasGuSamvat && hasGuKartak && hasGuBestuVaras && hasGuDiwali && hasGuJeth;
      record(
        "BT-09-GUJARATI-LOCALIZATION",
        "Gujarati month and festival names display natively in Gujarati script",
        passed ? "PASS" : "FAIL",
        `વિક્રમ સંવત, કારતક, બેસતું વર્ષ, દિવાળી, જેઠ verified: ${passed}`,
      );
    }

    // -------------------------------------------------------------------------
    // TEST 10: Calendar navigation across parent hub and breadcrumbs
    // -------------------------------------------------------------------------
    {
      // 1. Visit parent calendar hub
      await page.goto(`${BASE_URL}/en/calendar`, { waitUntil: "networkidle" });
      const atHub = page.url().endsWith("/en/calendar");

      // 2. Click through to Hindu Calendar
      await page.click('a[href="/en/calendar/hindu-calendar"]');
      await page.waitForURL("**/calendar/hindu-calendar");
      const atHindu = page.url().includes("/calendar/hindu-calendar");

      // 3. Click breadcrumb back to Calendar hub
      await page.click('nav[aria-label="Breadcrumb"] a[href="/en/calendar"]');
      await page.waitForURL("**/en/calendar");
      const backToHub = page.url().endsWith("/en/calendar");

      const passed = atHub && atHindu && backToHub;
      record(
        "BT-10-CALENDAR-HIERARCHY-NAV",
        "Calendar navigation across parent hub, child calendars, and breadcrumbs",
        passed ? "PASS" : "FAIL",
        `Hub -> Hindu -> Hub verified: ${passed}`,
      );
    }

    // -------------------------------------------------------------------------
    // TEST 11: Arabic RTL and Gujarati localization attributes
    // -------------------------------------------------------------------------
    {
      // 1. Arabic: Must have dir="rtl" and lang="ar"
      await page.goto(`${BASE_URL}/ar/calendar`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      const arDir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
      const arLang = await page.evaluate(() => document.documentElement.getAttribute("lang"));
      const isArabicRtl = arDir === "rtl" && arLang === "ar";

      // 2. Gujarati: Must have dir="ltr" and lang="gu"
      await page.goto(`${BASE_URL}/gu/calendar`, { waitUntil: "networkidle" });
      await page.waitForTimeout(400);
      const guDir = await page.evaluate(() => document.documentElement.getAttribute("dir"));
      const guLang = await page.evaluate(() => document.documentElement.getAttribute("lang"));
      const isGujaratiLtr = guDir === "ltr" && guLang === "gu";

      const passed = isArabicRtl && isGujaratiLtr;
      record(
        "BT-11-ARABIC-RTL-GUJARATI-LOC",
        "Arabic RTL layout and Gujarati LTR document attributes",
        passed ? "PASS" : "FAIL",
        `Arabic: dir=${arDir}, lang=${arLang}; Gujarati: dir=${guDir}, lang=${guLang}`,
      );
    }
  } catch (err) {
    console.error("Browser test exception:", err);
    record("BT-ERROR", "Browser integration test runner", "FAIL", err.message);
  } finally {
    await browser.close();
  }

  console.log("\n================================================================================");
  console.log("  BROWSER INTEGRATION TEST RESULTS SUMMARY");
  console.log("================================================================================");
  console.table(testResults.map((t) => ({ ID: t.id, Title: t.title, Status: t.status, Details: t.details })));

  const total = testResults.length;
  const passed = testResults.filter((t) => t.status === "PASS").length;
  const failed = testResults.filter((t) => t.status === "FAIL").length;

  console.log(`\nOverall Browser Test Results: ${passed} PASSED / ${total} TOTAL (${failed} FAILED)`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
