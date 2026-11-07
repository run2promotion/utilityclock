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

  if (category === "date-calendar") {
    if (slug === "age-calculator") {
      return [
        "The Age Calculator computes your exact biological age down to the precise number of years, months, and days based on the Gregorian calendar. Unlike crude division by 365.25, it accurately accounts for variable month lengths and leap years so that your birthday milestones match reality.",
        "Beyond total age, this tool breaks down your lifespan into total elapsed days, approximate hours, and minutes lived, while also counting down the days and months remaining until your next birthday. It is commonly used for legal documentation, school enrollment checks, retirement planning, and milestone celebrations.",
        "All date calculations happen instantaneously and entirely inside your browser using native JavaScript Date logic. No birth dates, personal names, or query parameters are ever logged or transmitted across the network, guaranteeing total confidentiality.",
      ];
    }
    if (slug === "business-days-calculator") {
      return [
        "The Business Days Calculator determines the exact count of working days between any two dates, automatically excluding Saturdays and Sundays. It is indispensable for sprint planning, legal notice periods, project milestones, freight delivery estimates, and contract performance tracking.",
        "Standard calendar day measurements can be misleading when estimating actual project turnaround. By isolating Mondays through Fridays, project managers and legal professionals can build realistic execution timelines without manual calendar tallying.",
        "Calculations run instantaneously client-side. You can swap start and end dates or adjust time horizons without page reloads, ensuring rapid and private workflow planning.",
      ];
    }
    if (slug === "date-difference-calculator" || slug === "days-between-dates") {
      return [
        "This Date Difference Calculator determines the exact duration between any two dates, expressed simultaneously as years, months, and days, as well as an absolute total day count. It eliminates ambiguity when calculating loan durations, subscription renewals, or anniversary intervals.",
        "Calendar math is notoriously tricky because months have 28, 29, 30, or 31 days. Our algorithm traverses the calendar month-by-month and year-by-year from the earlier date to the later date, providing a breakdown that accurately reflects standard human calendar conventions.",
        "Your dates never leave your computer or smartphone. All differences are computed locally in the browser, making this tool reliable even when working offline or on secure internal networks.",
      ];
    }
    return [
      "Our Date & Calendar tools provide accurate, client-side calendar calculations including date offsets, day counting, week numbering, and leap year validation according to Gregorian calendar rules.",
      "Whether you are planning project schedules, calculating statutory notice deadlines, or determining ISO week numbers for global business reporting, having instantaneous browser-based utilities prevents calendar errors.",
      "Every calculation is conducted on-device with zero server tracking. Bookmark this page for fast, privacy-preserving date math across your desktop and mobile devices.",
    ];
  }

  if (category === "calculators") {
    if (slug === "percentage-calculator") {
      return [
        "The Percentage Calculator solves the three most common percentage challenges in daily finance and analytics: finding a percentage of a number (X% of Y), determining what percentage one number is of another (X is what % of Y), and calculating percentage increase or decrease between two values.",
        "Whether you are calculating retail sales tax, restaurant tips, markdowns, quarterly financial growth, or academic test scores, having quick access to clean mathematical formulas prevents costly arithmetic slips.",
        "All calculations update live as you type using high-precision IEEE 754 floating-point arithmetic. No values are stored remotely, ensuring your financial numbers remain completely private.",
      ];
    }
    if (slug === "unit-converter" || slug.includes("converter")) {
      return [
        "The Unit Converter provides immediate, bidirectional conversions across essential metric and imperial measurement standards, including length, speed, temperature, and mass.",
        "International collaboration often requires switching between meters and feet, Celsius and Fahrenheit, or kilograms and pounds. Our converter uses exact scientific conversion factors to produce clean, rounded results suitable for engineering, cooking, fitness, and travel.",
        "Runs 100% locally in your browser. Perform quick conversions on the fly without ads blocking your view or unnecessary network requests.",
      ];
    }
    return [
      "Our online calculators deliver straightforward, reliable arithmetic and mathematical conversions designed for everyday productivity, finance, and engineering tasks.",
      "With high-contrast keys, instant result rendering, and keyboard accessibility, you can quickly solve mathematical problems without installing desktop software or using ad-heavy apps.",
      "All calculations are computed locally inside your browser session. Your input numbers are never transmitted, stored, or analyzed on any external server.",
    ];
  }

  if (category === "productivity") {
    if (slug === "sleep-cycle-calculator") {
      return [
        "The Sleep Cycle Calculator helps you optimize your wake and bedtime schedule based on the human ultradian sleep cycle, which typically lasts approximately 90 minutes. Waking up at the end of a sleep cycle—rather than during deep slow-wave sleep—helps you feel naturally refreshed and alert.",
        "The calculator accounts for an average 14-minute sleep latency (the time it takes for a relaxed adult to fall asleep) and projects optimal sleep windows spanning 4 to 6 complete cycles (6 to 9 hours of sleep). Note that individual cycle lengths vary between 70 and 110 minutes, so these calculations serve as wellness planning estimates rather than medical advice.",
        "All calculations run instantly on your device. Set your target wake-up time or calculate backward from right now to pick the best bedtime for your natural circadian rhythms.",
      ];
    }
    if (slug === "pomodoro-timer" || slug === "focus-session-planner") {
      return [
        "The Pomodoro Focus Timer structures your workday into high-intensity 25-minute focus sprints followed by restorative 5-minute short breaks and a longer 15-minute recovery after four completed intervals.",
        "By setting a hard boundary on concentration periods, the Pomodoro technique fights procrastination, minimizes cognitive fatigue, and helps maintain deep flow states throughout demanding knowledge-work tasks.",
        "Featuring integrated audio chimes and full keyboard shortcuts (Spacebar to start/pause, R to reset), this timer operates entirely client-side with no sign-ups or productivity trackers needed.",
      ];
    }
    if (slug === "interval-timer") {
      return [
        "The Interval & HIIT Timer lets you configure high-intensity exercise intervals, work-rest ratios, and round counts for Tabata workouts, circuit training, boxing rounds, and physical therapy drills.",
        "Clear visual state colors and distinct high-frequency audio beeps mark the transition between active work periods and rest phases, keeping you focused on your physical form rather than checking the screen.",
        "Built with browser Web Audio synthesis, the timer alert tones play reliably across mobile and desktop devices without requiring any native app downloads.",
      ];
    }
    return [
      "Our Productivity Tools are designed to help you organize your daily routines, protect mental focus, and sustain energy through structured timing intervals and circadian rhythm estimates.",
      "From focus sprints and habit trackers to hourly chimes and sleep cycle planners, these tools remove friction so you can focus on getting deep work done without distraction.",
      "Everything runs locally in your web browser. Enjoy clean, privacy-respecting productivity utilities accessible across all your devices.",
    ];
  }

  if (category === "converters") {
    if (slug === "area-converter") {
      return [
        "The Area Converter provides instantaneous, bidirectional conversion between metric and imperial area measurement units, including square meters, square feet, acres, hectares, square kilometers, and square miles.",
        "Accurate land and floor plan measurements are critical for real estate transactions, architectural drafting, agricultural planning, and civil engineering. This tool uses exact international conversion constants (such as 1 acre = 4,046.8564224 square meters and 1 sq ft = 0.09290304 sq m) to ensure mathematical precision.",
        "All calculations occur instantaneously in your browser. Easily switch between units, adjust decimal precision from 2 to 6 places, and copy converted numbers with a single click.",
      ];
    }
    if (slug === "volume-converter") {
      return [
        "The Volume Converter translates fluid and cubic volumetric measurements across international systems, supporting liters, milliliters, cubic meters, cubic feet, US gallons, imperial quarts, pints, and tablespoons.",
        "Whether you are sizing plumbing pipes, calculating chemical tank capacities, or translating international fluid specifications, accurate volume conversions prevent costly measurement discrepancies.",
        "Runs entirely client-side with zero server latency. Switch source and destination units with one tap, copy results cleanly, and review the exact conversion multiplier used for every step.",
      ];
    }
    if (slug === "pressure-converter") {
      return [
        "The Pressure Converter calculates precise equivalents across common engineering and meteorological pressure scales, including Bar, Pascals (Pa), Kilopascals (kPa), Pounds per Square Inch (PSI), Standard Atmospheres (atm), and Millimeters of Mercury (Torr/mmHg).",
        "From checking vehicle tire pressure specifications in PSI to reading scuba tank bar ratings or lab vacuum pressures in Torr, having instant access to scientific pressure constants simplifies technical workflows.",
        "Every conversion is computed locally using exact SI base standards (1 Bar = 100,000 Pa; 1 atm = 101,325 Pa). No calculations are sent to external servers.",
      ];
    }
    if (slug === "energy-converter") {
      return [
        "The Energy Converter translates work and thermodynamic units including Joules (J), Kilojoules (kJ), Kilowatt-hours (kWh), Food Calories (kcal), British Thermal Units (BTU), and Foot-pounds (ft-lb).",
        "Essential for electrical billing analysis, HVAC thermal sizing, mechanical engineering calculations, and nutritional planning, this tool bridges the gap between mechanical, electrical, and thermal energy representations.",
        "Compute energy conversions on demand with up to 6 decimal places of precision, swap units with a single shortcut, and copy final values directly into your spreadsheets or documentation.",
      ];
    }
    if (slug === "power-converter") {
      return [
        "The Power Converter translates energy transfer rates between Watts (W), Kilowatts (kW), Megawatts (MW), Mechanical Horsepower (hp), Metric Horsepower (PS), and BTUs per hour (BTU/h).",
        "Engineers, automotive enthusiasts, and facility managers regularly convert between mechanical horsepower and electrical kilowatts (1 hp ≈ 745.69987 Watts) when sizing motors, engines, and electrical generators.",
        "Enjoy instantaneous client-side calculation with no network delay. High-contrast displays and quick-copy buttons ensure fast, error-free documentation.",
      ];
    }
    if (slug === "data-storage-converter") {
      return [
        "The Data Storage Converter translates digital file sizes and memory capacities across both decimal metric units (Bytes, KB, MB, GB, TB where 1 KB = 1,000 Bytes) and binary IEC standards (KiB, MiB, GiB where 1 KiB = 1,024 Bytes).",
        "Operating system storage discrepancies often confuse users because hard drive manufacturers market capacity in decimal gigabytes (10^9 bytes), while operating systems report free space in binary gibibytes (2^30 bytes). Our tool makes this discrepancy transparent.",
        "Convert network bandwidth file transfer sizes, hard drive capacities, and RAM specifications without transmitting proprietary file metrics outside your browser.",
      ];
    }
    if (slug === "fuel-economy-converter") {
      return [
        "The Fuel Economy Converter calculates vehicle consumption figures across US Miles per Gallon (MPG), Imperial UK Miles per Gallon, Liters per 100 Kilometers (L/100km), and Kilometers per Liter (km/L).",
        "Because L/100km is an inverse consumption metric (lower numbers mean higher efficiency) while MPG is a distance-per-volume metric (higher numbers mean higher efficiency), conversions require reciprocal calculations rather than simple scalar multiplication.",
        "Easily compare European automobile fuel ratings against North American and Japanese vehicle efficiency standards directly in your browser.",
      ];
    }
    if (slug === "angle-converter") {
      return [
        "The Angle Converter translates geometric and trigonometric rotational measurements between Degrees, Radians, Gradians, Arcminutes, Arcseconds, and Full Revolutions / Turns.",
        "Trigonometric programming and physics simulations rely on radians, whereas surveying and architectural blueprints typically use degrees, arcminutes, and arcseconds. Our calculator uses the exact mathematical constant π for radian conversions.",
        "Get instant, high-precision angle transformations with clean formulas and one-click copy options for CAD and mathematical modeling.",
      ];
    }
    if (slug === "cooking-converter") {
      return [
        "The Cooking Measurement Converter converts kitchen recipe units between cups, tablespoons, teaspoons, milliliters, fluid ounces, grams, and ounces—accounting for ingredient densities.",
        "Because a cup of flour weighs significantly less than a cup of sugar or water, volumetric-to-weight conversions require ingredient-specific densities (e.g. 0.53 g/mL for flour vs 0.85 g/mL for sugar). Our tool applies these precise culinary density factors.",
        "Scale international recipes with confidence. Switch between metric gram weights and American volume cups instantly on your mobile or desktop device.",
      ];
    }
    if (slug === "number-system-converter") {
      return [
        "The Number System Converter translates numerical values across Decimal (Base 10), Binary (Base 2), Hexadecimal (Base 16), and Octal (Base 8) representations.",
        "Computer science students and software developers frequently inspect bitwise flags, hexadecimal memory addresses, and binary byte masks. Our tool converts values live as you type and validates numerical characters for each base.",
        "All number representations update simultaneously with dedicated copy buttons for clean pasting into code editors, debuggers, or documentation.",
      ];
    }
    return [
      "Our Unit Converters deliver exact, scientific measurement translations across physical dimensions, thermodynamics, engineering units, and computational data scales.",
      "Built with strict adherence to International System of Units (SI) standards and standardized conversion factors, these tools eliminate measurement discrepancies in everyday calculations.",
      "Every conversion runs client-side inside your browser sandbox. Enjoy fast, private, ad-free unit conversions on any device.",
    ];
  }

  if (category === "finance") {
    if (slug === "loan-emi-calculator") {
      return [
        "The Loan EMI Calculator determines your Equated Monthly Installment (EMI), total interest payable, and overall loan repayment cost based on loan principal, annual interest rate, and tenure.",
        "Using the standard reducing balance amortisation formula, the calculator projects year-by-year principal repayments and interest amortization schedules for mortgages, auto loans, and personal financing.",
        "Easily toggle between years and months, inspect the total interest-to-principal ratio, and copy your monthly payment figures with complete privacy.",
      ];
    }
    if (slug === "compound-interest-calculator") {
      return [
        "The Compound Interest Calculator visualizes long-term investment growth by factoring in initial principal, recurring monthly contributions, estimated annual return rates, and compounding frequencies.",
        "Compounding interest allows earned returns to generate their own returns over time. Albert Einstein famously described compound interest as the eighth wonder of the world: he who understands it, earns it; he who doesn't, pays it.",
        "Review yearly balance progression tables, compare total deposits against pure interest earnings, and model financial independence targets client-side.",
      ];
    }
    if (slug === "simple-interest-calculator") {
      return [
        "The Simple Interest Calculator computes linear interest on fixed-term loans, short-term debt instruments, and promissory notes where interest is not reinvested into the principal.",
        "Using the straightforward formula I = (P × R × T) / 100, the tool calculates total interest across specified days, months, or years, displaying interest breakdowns per day, month, and year.",
        "A handy reference for evaluating basic car loans, short-term treasury bills, certificate of deposit yields, and personal lending agreements.",
      ];
    }
    if (slug === "gst-calculator") {
      return [
        "The Goods and Services Tax (GST) Calculator calculates exact tax amounts for both GST-Exclusive (adding tax to base prices) and GST-Inclusive (extracting tax from gross totals) billing scenarios.",
        "Includes standard tax slabs (5%, 12%, 18%, 28%) along with custom tax rate inputs. The calculator automatically computes Central GST (CGST), State GST (SGST), and Integrated GST (IGST) breakdowns.",
        "Ensure compliant business invoicing and retail accounting with instant calculations that run entirely in your web browser.",
      ];
    }
    if (slug === "vat-calculator") {
      return [
        "The Value Added Tax (VAT) Calculator helps consumers and businesses add VAT to net prices or reverse-calculate pre-tax base amounts from inclusive receipts.",
        "Different jurisdictions apply varying standard VAT rates (such as 20% in the UK/France, 19% in Germany, or 5% in the UAE). Our tool lets you select standard presets or enter any custom rate.",
        "Accurate tax extraction formulas ensure you never overpay or underreport sales tax on corporate expenses and international trade invoices.",
      ];
    }
    if (slug === "discount-calculator") {
      return [
        "The Discount Calculator computes final checkout prices by applying primary percentage discounts, stacked secondary promotional coupons, and estimated sales tax.",
        "Retail stores frequently advertise stacked discounts (e.g. 25% storewide plus an additional 10% coupon at checkout). Because stacked discounts apply sequentially rather than additively, calculating the true savings requires multi-step math.",
        "Quickly uncover the exact dollar amount saved, the effective total percentage discount, and the post-tax out-of-pocket price before you buy.",
      ];
    }
    if (slug === "profit-margin-calculator") {
      return [
        "The Profit Margin Calculator determines Gross Profit, Gross Profit Margin percentage, and Cost Markup percentage from Cost of Goods Sold (COGS) and Revenue.",
        "Confusing profit margin (profit divided by revenue) with markup (profit divided by cost) is one of the most common mistakes in small business pricing. Our tool clearly displays both metrics side-by-side.",
        "Set profitable product prices and ensure healthy corporate cash flows with immediate arithmetic validation.",
      ];
    }
    if (slug === "markup-calculator") {
      return [
        "The Markup Calculator helps retailers, contractors, and e-commerce merchants determine optimal selling prices by applying a target markup percentage to product costs.",
        "Entering your cost and desired markup percentage instantly reveals the recommended retail price, the net dollar profit, and the resulting gross profit margin percentage.",
        "Streamline wholesale pricing strategies and client project estimates with clean client-side calculations.",
      ];
    }
    if (slug === "break-even-calculator") {
      return [
        "The Break-Even Point Calculator calculates the exact unit sales volume and dollar revenue required to cover all fixed and variable business operating expenses.",
        "By dividing total fixed overhead by the unit contribution margin (selling price minus variable cost per unit), the calculator identifies the zero-loss threshold and models unit volumes needed to reach target profit goals.",
        "An essential planning utility for entrepreneurs, startup founders, and financial analysts preparing commercial feasibility studies.",
      ];
    }
    if (slug === "savings-goal-calculator") {
      return [
        "The Savings Goal Calculator determines the exact monthly contributions needed to reach a targeted financial milestone by a specified deadline, factoring in starting savings and compounding interest.",
        "Whether you are planning an emergency fund, home down payment, college tuition fund, or dream vacation, having a concrete monthly savings target turns abstract goals into achievable daily habits.",
        "Review total out-of-pocket contributions versus compound interest gains with zero account creation or financial tracking.",
      ];
    }
    return [
      "Our Financial Calculators provide accurate, client-side arithmetic for loans, mortgages, compounding investments, sales taxes, business margins, and savings targets.",
      "All calculations are performed locally in your browser session for complete financial privacy. Results are intended for educational and estimation purposes.",
      "Explore loan amortizations, interest breakdowns, and pricing strategies on any device without software downloads or subscriptions.",
    ];
  }

  if (category === "text") {
    if (slug === "word-counter") {
      return [
        "The Online Word Counter provides live word, character, sentence, and paragraph analytics as you type or paste text into your browser.",
        "Calculates estimated reading time (based on 200 words per minute) and speaking time (based on 130 words per minute), while analyzing top keyword frequency and density to help writers and content creators avoid repetitive phrasing.",
        "All text analysis happens locally inside your browser memory. Your documents are never uploaded, logged, or sent to external servers.",
      ];
    }
    if (slug === "character-counter") {
      return [
        "The Character Counter tracks exact character counts with and without spaces, while displaying visual progress bars against standard digital publishing limits.",
        "Features real-time limit indicators for X / Twitter posts (280 characters), SMS text segments (160 characters), Google SEO Title tags (60 characters), Google Meta Descriptions (160 characters), and Instagram bios (150 characters).",
        "Prevent truncated headlines and over-length social posts by verifying your copy before publishing.",
      ];
    }
    if (slug === "case-converter") {
      return [
        "The Case Converter transforms text instantly between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and alternating case.",
        "Software engineers, technical writers, and database administrators regularly need to reformat identifier naming conventions between codebases and documentation.",
        "One-click copy buttons beside each formatted output make it effortless to paste converted strings directly into your code, database scripts, or CMS.",
      ];
    }
    if (slug === "remove-duplicate-lines") {
      return [
        "The Remove Duplicate Lines tool cleans up multi-line text lists, email databases, and log files by eliminating repeated rows with customizable filters.",
        "Supports case-sensitive or case-insensitive matching, line whitespace trimming, and automatic empty line filtering. The tool reports the total original lines, unique lines retained, and duplicate rows purged.",
        "Clean large datasets in milliseconds without compromising data privacy or installing heavy text-processing tools.",
      ];
    }
    if (slug === "text-sorter") {
      return [
        "The Text Sorter organizes multi-line text lists alphabetically (A to Z or Z to A), naturally by numeric values (1, 2, 10), by line length (shortest or longest first), or via random shuffling.",
        "Natural sorting ensures that numbered lists sort properly (so item 10 does not sort before item 2), while the case-insensitive toggle ensures consistent alphabetical order.",
        "Sort names, inventory SKUs, bibliography citations, and keyword research lists cleanly and privately in your browser.",
      ];
    }
    if (slug === "text-reverser") {
      return [
        "The Text Reverser flips strings backwards, inverts the sequence of words, reverses individual letters within words, or generates upside-down text using mirrored Unicode glyphs.",
        "Useful for testing palindromes, reversing biological DNA/RNA sequences, formatting creative typography, or debugging string processing algorithms.",
        "Transforms strings live as you type with dedicated one-click copy buttons for immediate use.",
      ];
    }
    if (slug === "whitespace-remover") {
      return [
        "The Whitespace Remover cleans up messy text by collapsing multiple consecutive spaces into single spaces, trimming margin blanks, removing tab indents, and filtering blank lines.",
        "Copying text from PDFs, OCR scans, and old email threads often introduces irregular indentation and double spaces. This utility restores clean, uniform typography.",
        "Also includes an option to strip all whitespace characters entirely when preparing minified strings, hash inputs, or verification codes.",
      ];
    }
    if (slug === "line-break-remover") {
      return [
        "The Line Break Remover converts multi-line text into a single continuous paragraph, a comma-separated list (CSV), or a custom delimited string.",
        "When copying column data from spreadsheets or PDFs, hard carriage returns often break sentences into disjointed fragments. This tool joins lines cleanly while offering an option to preserve double-newline paragraph breaks.",
        "Flatten multi-line inputs effortlessly for database queries, text messaging, or document reformatting.",
      ];
    }
    if (slug === "lorem-ipsum-generator") {
      return [
        "The Lorem Ipsum Generator creates customized dummy placeholder text in paragraphs, sentences, or word counts for web design mockups, wireframes, and print layouts.",
        "Generates clean Latin placeholder text with options to include the classic 'Lorem ipsum dolor sit amet...' opening phrase and wrap paragraphs in standard HTML <p> tags for easy web development copying.",
        "Quickly populate UI mockups and design prototypes without searching for external placeholder text generators.",
      ];
    }
    if (slug === "text-diff-checker") {
      return [
        "The Text Diff Checker compares two text snippets side-by-side, visually highlighting additions, removals, and modifications line-by-line.",
        "Features color-coded diff rows (green for added content, red for removed lines, amber for modifications) and summarizes total changes detected between Version A and Version B.",
        "Compare contract revisions, code snippets, configuration files, and draft revisions privately inside your browser without uploading proprietary content to third-party diff services.",
      ];
    }
    return [
      "Our Text & Content Utilities offer fast, privacy-preserving formatting, counting, sorting, and cleaning tools running 100% locally in your browser.",
      "Your text is never sent across a network or stored on any server. Enjoy complete confidentiality for confidential documents, passwords, code snippets, and customer lists.",
      "Bookmark these utilities for reliable, instant text manipulation on any desktop or mobile device.",
    ];
  }

  return [
    "This utility page is designed to give you accurate, browser-based time tools without unnecessary complexity. You can use it alongside bookmarks, documentation, or classroom workflows whenever you need a quick reference.",
    "Web-based clocks and timers remain useful because they work across devices and do not require an app store account. They are easy to share with others who need the same preset or time zone context.",
    "For best results, allow notifications or sound where prompted so alerts remain reliable when you step away from the tab. You can always adjust permissions in your browser settings later.",
  ];
}
