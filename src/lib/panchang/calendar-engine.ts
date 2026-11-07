/**
 * Regional Calendar & Era Engine: Vikram Samvat, Shaka Samvat, Amanta & Purnimanta
 *
 * Implements:
 * 1. North Indian Chaitradi Vikram Samvat (Year transition at Chaitra Shukla Pratipada)
 * 2. Gujarati Kartikadi Vikram Samvat (Year transition at Kartak Shukla Pratipada - Bestu Varas)
 * 3. Separation of the Three Shaka Systems:
 *    a. National Saka Calendar (Civil): Fixed solar calendar per IMD / GOI Calendar Reform Committee (1957)
 *       - Chaitra 1 falls on March 22 (normal year) or March 21 (leap year)
 *    b. Traditional Solar Saka Reckoning: Follows solar Mesha Sankranti (mid-April)
 *    c. Traditional Lunisolar Shalivahana Shaka: Follows lunar Chaitra Shukla Pratipada (Gudi Padwa / Ugadi)
 * 4. Purnimanta vs Amanta (Amavasyanta) lunar month rules
 * 5. Astronomical Solar Sankranti-based lunar month naming, dynamic Adhika Masa and Kshaya Masa detection
 */

import {
  MakeTime,
  SearchMoonPhase,
  SunPosition,
} from "astronomy-engine";
import {
  type CityCoordinates,
  getCelestialPositions,
  getLahiriAyanamsa,
  STANDARD_CITIES,
} from "./astronomy";
import { calculateDailyPanchang } from "./panchang-engine";

export const SANSKRIT_MONTHS = [
  "Chaitra (चैत्र / ચૈત્ર)",
  "Vaishakha (वैशाख / વૈશાખ)",
  "Jyeshtha (ज्येष्ठ / જેઠ)",
  "Ashadha (आषाढ़ / અષાઢ)",
  "Shravana (श्रावण / શ્રાવણ)",
  "Bhadrapada (भाद्रपद / ભાદરવો)",
  "Ashvina (आश्विन / આસો)",
  "Kartika (कार्तिक / કારતક)",
  "Margashirsha (मार्गशीर्ष / માગશર)",
  "Pausha (पौष / પોષ)",
  "Magha (माघ / મહા)",
  "Phalguna (फाल्गुन / ફાગણ)",
] as const;

export const GUJARATI_MONTHS = [
  "Kartak (કારતક)",
  "Magshar (માગશર)",
  "Posh (પોષ)",
  "Maha (મહા)",
  "Fagun (ફાગણ)",
  "Chaitra (ચૈત્ર)",
  "Vaishakh (વૈશાખ)",
  "Jeth (જેઠ)",
  "Ashadh (અષાઢ)",
  "Shravan (શ્રાવણ)",
  "Bhadarvo (ભાદરવો)",
  "Aso (આસો)",
] as const;

export const NATIONAL_SAKA_MONTHS = [
  "Chaitra (चैत्र)",
  "Vaishakha (वैशाख)",
  "Jyeshtha (ज्येष्ठ)",
  "Ashadha (आषाढ़)",
  "Shravana (श्रावण)",
  "Bhadra (भाद्रपद / भाद्र)",
  "Ashvina (आश्विन)",
  "Kartika (कार्तिक)",
  "Agrahayana (अग्रहायण / मार्गशीर्ष)",
  "Pausha (पौष)",
  "Magha (माघ)",
  "Phalguna (फाल्गुन)",
] as const;

export type NationalSakaDate = {
  sakaYear: number;
  sakaMonthIndex: number; // 0 to 11
  sakaMonthName: string;
  sakaDay: number; // 1 to 30/31
  isLeap: boolean;
  formatted: string;
};

export type RegionalTradition = "gujarati" | "purnimanta" | "marathi" | "teluguKannada" | "sanskrit";

export type RegionalMonthNameResult = {
  name: string;
  nativeName: string;
  isAdhika: boolean;
  qualifier: "Adhika" | "Nija" | "Regular";
  formatted: string;
};

export type RegionalCalendarState = {
  date: Date;
  city: CityCoordinates;
  vikramSamvatNorth: number; // Chaitradi
  vikramSamvatGujarati: number; // Kartikadi
  shakaSamvat: number; // Backward compatibility alias to lunisolarShaka.year
  nationalSaka: NationalSakaDate;
  traditionalSolarSaka: {
    year: number;
    solarRashiIndex: number;
    solarRashiName: string;
    isPostMeshaSankranti: boolean;
  };
  lunisolarShaka: {
    year: number;
    paksha: "Shukla" | "Krishna";
    tithiName: string;
  };
  amantaMonth: {
    index: number; // 0 to 11 (0 = Chaitra)
    name: string;
    isAdhika: boolean;
    isKshaya: boolean;
  };
  purnimantaMonth: {
    index: number; // 0 to 11
    name: string;
    isAdhika: boolean;
    isKshaya: boolean;
  };
  regionalMonthNames: {
    gujarati: RegionalMonthNameResult;
    northIndianPurnimanta: RegionalMonthNameResult;
    marathiAmanta: RegionalMonthNameResult;
    teluguKannadaAmanta: RegionalMonthNameResult;
  };
  paksha: "Shukla" | "Krishna";
  tithiNumber: number; // 1 to 15
  tithiName: string;
};

/**
 * Returns distinct regional month name tailored to cultural and linguistic traditions.
 * Separates astronomical Adhika detection from regional naming semantics.
 */
export function getRegionalMonthName(
  monthIndex: number, // 0 = Chaitra, 1 = Vaishakha, 2 = Jyeshtha, etc.
  isAdhika: boolean,
  tradition: RegionalTradition = "sanskrit",
): RegionalMonthNameResult {
  const normIdx = ((monthIndex % 12) + 12) % 12;

  const GUJARATI_BASE = [
    { en: "Chaitra", gu: "ચૈત્ર" },
    { en: "Vaishakh", gu: "વૈશાખ" },
    { en: "Jeth", gu: "જેઠ" },
    { en: "Ashadh", gu: "અષાઢ" },
    { en: "Shravan", gu: "શ્રાવણ" },
    { en: "Bhadarvo", gu: "ભાદરવો" },
    { en: "Aso", gu: "આસો" },
    { en: "Kartak", gu: "કારતક" },
    { en: "Magshar", gu: "માગશર" },
    { en: "Posh", gu: "પોષ" },
    { en: "Maha", gu: "મહા" },
    { en: "Fagun", gu: "ફાગણ" },
  ];

  const HINDI_BASE = [
    { en: "Chaitra", hi: "चैत्र" },
    { en: "Vaishakha", hi: "वैशाख" },
    { en: "Jyeshtha", hi: "ज्येष्ठ" },
    { en: "Ashadha", hi: "आषाढ़" },
    { en: "Shravana", hi: "श्रावण" },
    { en: "Bhadrapada", hi: "भाद्रपद" },
    { en: "Ashvina", hi: "आश्विन" },
    { en: "Kartika", hi: "कार्तिक" },
    { en: "Margashirsha", hi: "मार्गशीर्ष" },
    { en: "Pausha", hi: "पौष" },
    { en: "Magha", hi: "माघ" },
    { en: "Phalguna", hi: "फाल्गुन" },
  ];

  const MARATHI_BASE = [
    { en: "Chaitra", mr: "चैत्र" },
    { en: "Vaishakh", mr: "वैशाख" },
    { en: "Jyeshtha", mr: "ज्येष्ठ" },
    { en: "Ashadh", mr: "आषाढ" },
    { en: "Shravan", mr: "श्रावण" },
    { en: "Bhadrapad", mr: "भाद्रपद" },
    { en: "Ashwin", mr: "अश्विन" },
    { en: "Kartik", mr: "कार्तिक" },
    { en: "Margashirsha", mr: "मार्गशीर्ष" },
    { en: "Paush", mr: "पौष" },
    { en: "Magh", mr: "माघ" },
    { en: "Falgun", mr: "फाल्गुन" },
  ];

  const TELUGU_KANNADA_BASE = [
    { en: "Chaitramu", te: "చైత్రము", kn: "ಚೈತ್ರ" },
    { en: "Vaishakhamu", te: "వైశాఖము", kn: "ವೈಶಾಖ" },
    { en: "Jyeshthamu", te: "జ్యేష్ఠము", kn: "ಜ್ಯೇಷ್ಠ" },
    { en: "Ashadhamu", te: "ఆషాఢము", kn: "ಆಷಾಢ" },
    { en: "Shravanamu", te: "శ్రావణము", kn: "ಶ್ರಾವಣ" },
    { en: "Bhadrapadamu", te: "భాద్రపదము", kn: "ಭಾದ್ರಪದ" },
    { en: "Ashwayujamu", te: "ఆశ్వయుజము", kn: "ಆಶ್ವಯುಜ" },
    { en: "Karthikamu", te: "కార్తీకము", kn: "ಕಾರ್ತೀಕ" },
    { en: "Margashiramu", te: "మార్గశిరము", kn: "ಮಾರ್ಗಶಿರ" },
    { en: "Pushyamu", te: "పుష్యము", kn: "ಪುಷ್ಯ" },
    { en: "Maghamu", te: "మాఘము", kn: "ಮಾಘ" },
    { en: "Phalgunamu", te: "ఫాల్గుణము", kn: "ಫಾಲ್ಗುಣ" },
  ];

  if (tradition === "gujarati") {
    const item = GUJARATI_BASE[normIdx];
    const name = isAdhika ? `Adhik ${item.en}` : item.en;
    const nativeName = isAdhika ? `અધિક ${item.gu}` : item.gu;
    return {
      name,
      nativeName,
      isAdhika,
      qualifier: isAdhika ? "Adhika" : "Regular",
      formatted: `${name} (${nativeName})`,
    };
  }

  if (tradition === "marathi") {
    const item = MARATHI_BASE[normIdx];
    const name = isAdhika ? `Adhik ${item.en}` : `Nija ${item.en}`;
    const nativeName = isAdhika ? `अधिक ${item.mr}` : `निज ${item.mr}`;
    return {
      name,
      nativeName,
      isAdhika,
      qualifier: isAdhika ? "Adhika" : "Nija",
      formatted: `${name} (${nativeName})`,
    };
  }

  if (tradition === "teluguKannada") {
    const item = TELUGU_KANNADA_BASE[normIdx];
    const name = isAdhika ? `Adhika ${item.en}` : `Nija ${item.en}`;
    const nativeName = isAdhika ? `అధిక ${item.te} / ಅಧಿಕ ${item.kn}` : `నిజ ${item.te} / ನಿಜ ${item.kn}`;
    return {
      name,
      nativeName,
      isAdhika,
      qualifier: isAdhika ? "Adhika" : "Nija",
      formatted: `${name} (${nativeName})`,
    };
  }

  if (tradition === "purnimanta") {
    const item = HINDI_BASE[normIdx];
    const name = isAdhika ? `Adhika ${item.en}` : item.en;
    const nativeName = isAdhika ? `अधिक ${item.hi}` : item.hi;
    return {
      name,
      nativeName,
      isAdhika,
      qualifier: isAdhika ? "Adhika" : "Regular",
      formatted: `${name} (${nativeName})`,
    };
  }

  // Default Sanskrit
  const base = SANSKRIT_MONTHS[normIdx];
  const name = isAdhika ? `Adhika ${base}` : base;
  return {
    name,
    nativeName: base,
    isAdhika,
    qualifier: isAdhika ? "Adhika" : "Regular",
    formatted: name,
  };
}

/**
 * Astronomical Solar Rashi (Sankranti zodiac sign) where 0 = Aries/Mesha, 1 = Taurus/Vrishabha, ...
 */
export function getSolarRashi(date: Date): { index: number; name: string } {
  const pos = getCelestialPositions(date);
  const rashiIndex = Math.floor(pos.sunSiderealLon / 30);
  const RASHI_NAMES = [
    "Mesha (Aries)",
    "Vrishabha (Taurus)",
    "Mithuna (Gemini)",
    "Karka (Cancer)",
    "Simha (Leo)",
    "Kanya (Virgo)",
    "Tula (Libra)",
    "Vrishchika (Scorpio)",
    "Dhanu (Sagittarius)",
    "Makara (Capricorn)",
    "Kumbha (Aquarius)",
    "Meena (Pisces)",
  ];
  return { index: rashiIndex, name: RASHI_NAMES[rashiIndex] };
}

/**
 * Checks whether a given Gregorian year is a leap year.
 */
export function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Converts a Gregorian date into the official Indian National Saka Civil Calendar.
 *
 * Established by the Calendar Reform Committee (1957) and published in the Gazette of India:
 * - Epoch: Year 1 Saka = 78 CE.
 * - Saka Year = Gregorian - 78 (from Chaitra 1) or Gregorian - 79 (before Chaitra 1).
 * - Leap year: coincides with Gregorian leap years (Saka year + 78 is a leap year).
 * - Normal Year: Chaitra 1 begins on March 22; Chaitra has 30 days.
 * - Leap Year: Chaitra 1 begins on March 21; Chaitra has 31 days.
 * - Months 2-6 (Vaishakha to Bhadra) have 31 days each.
 * - Months 7-12 (Ashvina to Phalguna) have 30 days each.
 */
export function gregorianToNationalSaka(date: Date): NationalSakaDate {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth(); // 0 = Jan, 1 = Feb, 2 = Mar, etc.
  const d = date.getUTCDate();

  const isCurrentYearLeap = isGregorianLeapYear(y);
  const chaitraStartDay = isCurrentYearLeap ? 21 : 22;

  // Determine if date is before Chaitra 1 of current Gregorian year
  const isBeforeNewYear = m < 2 || (m === 2 && d < chaitraStartDay);
  const sakaYear = isBeforeNewYear ? y - 79 : y - 78;

  const chaitra1Year = isBeforeNewYear ? y - 1 : y;
  const chaitra1IsLeap = isGregorianLeapYear(chaitra1Year);
  const chaitra1Date = new Date(Date.UTC(chaitra1Year, 2, chaitra1IsLeap ? 21 : 22));

  const diffMs = date.getTime() - chaitra1Date.getTime();
  const diffDays = Math.floor(diffMs / 86400000);

  const monthLengths = [
    chaitra1IsLeap ? 31 : 30, // 0: Chaitra
    31,                       // 1: Vaishakha
    31,                       // 2: Jyeshtha
    31,                       // 3: Ashadha
    31,                       // 4: Shravana
    31,                       // 5: Bhadra
    30,                       // 6: Ashvina
    30,                       // 7: Kartika
    30,                       // 8: Agrahayana
    30,                       // 9: Pausha
    30,                       // 10: Magha
    30,                       // 11: Phalguna
  ];

  let remainingDays = diffDays;
  let monthIdx = 0;
  for (let i = 0; i < 12; i++) {
    if (remainingDays < monthLengths[i]) {
      monthIdx = i;
      break;
    }
    remainingDays -= monthLengths[i];
  }
  const sakaDay = remainingDays + 1;

  const monthName = NATIONAL_SAKA_MONTHS[monthIdx];
  return {
    sakaYear,
    sakaMonthIndex: monthIdx,
    sakaMonthName: monthName,
    sakaDay,
    isLeap: chaitra1IsLeap,
    formatted: `${monthName} ${sakaDay}, ${sakaYear} Saka`,
  };
}

/**
 * Given a date, finds the preceding and succeeding New Moons (Amavasya conjunctions)
 * using high-precision bisection on the lunar phase.
 */
export function findLunarMonthBoundaries(date: Date): { prevNewMoon: Date; nextNewMoon: Date } {
  const targetTime = MakeTime(date);
  const startSearch = targetTime.AddDays(-35);

  let prevNM: Date = new Date(date.getTime() - 29.53 * 86400000);
  let nextNM: Date = new Date(date.getTime() + 29.53 * 86400000);
  let searchT = startSearch;

  for (let i = 0; i < 3; i++) {
    const nm = SearchMoonPhase(0, searchT, 35);
    if (!nm) break;
    if (nm.date.getTime() <= date.getTime()) {
      prevNM = nm.date;
    } else {
      nextNM = nm.date;
      break;
    }
    searchT = nm.AddDays(1);
  }

  return { prevNewMoon: prevNM, nextNewMoon: nextNM };
}

/**
 * Calculates complete regional calendar state adhering to:
 * - North Indian Chaitradi rules (increments on Chaitra Shukla Pratipada)
 * - Gujarati Kartikadi rules (increments on Kartak Shukla Pratipada - Bestu Varas)
 * - Three distinct Shaka conventions (National Civil, Traditional Solar, and Lunisolar)
 * - Dynamic Adhika Masa and Kshaya Masa detection from sidereal Sankranti ingress
 * - Purnimanta vs Amanta lunar month mappings
 */
export function calculateRegionalCalendar(
  date: Date,
  city: CityCoordinates = STANDARD_CITIES.delhi,
): RegionalCalendarState {
  const panchang = calculateDailyPanchang(date, city);
  const tithi = panchang.udayaTithi;
  const gregYear = date.getUTCFullYear();

  // Find exact Amanta lunar month boundaries (preceding and succeeding New Moons)
  const { prevNewMoon, nextNewMoon } = findLunarMonthBoundaries(date);

  // Determine Sun sidereal longitude at prevNM and nextNM
  const getSunSidLonAt = (d: Date) => {
    const sun = SunPosition(d);
    const ayanamsa = getLahiriAyanamsa(d);
    const mod = (sun.elon - ayanamsa) % 360;
    return mod < 0 ? mod + 360 : mod;
  };

  const sunLonPrev = getSunSidLonAt(prevNewMoon);
  const sunLonNext = getSunSidLonAt(nextNewMoon);
  const rashiPrev = Math.floor(sunLonPrev / 30);
  const rashiNext = Math.floor(sunLonNext / 30);

  // Adhika Masa detection: Sun did not cross a Rashi boundary between the two New Moons
  const isAdhika = rashiPrev === rashiNext;
  // Kshaya Masa detection: Sun crossed two Rashi boundaries in a single lunar month
  const isKshaya = ((rashiNext - rashiPrev + 12) % 12) === 2;

  // In Vedic lunisolar calendar, the Amanta lunar month is named after the Solar Rashi
  // entered by the Sun. Sun in Meena(11) -> Chaitra(0), Sun in Mesha(0) -> Vaishakha(1),
  // Sun in Vrishabha(1) -> Jyeshtha(2), etc.
  const amantaMonthIndex = (rashiPrev + 1) % 12;

  // In Purnimanta tradition:
  // - In regular months (isAdhika === false), Shukla Paksha shares the Amanta month name,
  //   while Krishna Paksha belongs to the upcoming month (leads by 1 month).
  // - In an Adhika Masa (isAdhika === true), both Shukla and Krishna Pakshas belong to the
  //   intercalary month itself (e.g. Adhika Jyeshtha Shukla, then Adhika Jyeshtha Krishna),
  //   because the intercalated unit wraps as a contiguous lunar month between the regular halves.
  let purnimantaMonthIndex = amantaMonthIndex;
  if (!isAdhika && tithi.paksha === "Krishna") {
    purnimantaMonthIndex = (amantaMonthIndex + 1) % 12;
  }

  // Vikram Samvat North Indian (Chaitradi):
  // Increments on Chaitra Shukla Pratipada.
  // Before Chaitra Shukla Pratipada in Gregorian year Y, Vikram Samvat is Y + 56.
  // After Chaitra Shukla Pratipada commences, Vikram Samvat is Y + 57.
  let vikramSamvatNorth = gregYear + 57;
  const isPreChaitraShukla =
    date.getUTCMonth() < 4 && (amantaMonthIndex >= 9 || (amantaMonthIndex === 0 && tithi.paksha === "Krishna"));

  if (isPreChaitraShukla) {
    vikramSamvatNorth = gregYear + 56;
  }

  // Gujarati Vikram Samvat (Kartikadi):
  // Year begins on Kartak Shukla Pratipada (Bestu Varas - day after Diwali, in October/November).
  // All through 2026 up until Diwali (Nov 9, 2026), Gujarat is in VS 2082.
  // On Bestu Varas (Nov 10, 2026), Gujarat enters VS 2083.
  let vikramSamvatGujarati = gregYear + 56;
  const isPostDiwali =
    (date.getUTCMonth() === 10 && date.getUTCDate() >= 10) || date.getUTCMonth() === 11;
  if (isPostDiwali) {
    vikramSamvatGujarati = gregYear + 57;
  }

  // Shaka Conventions:
  // 1. National Saka (Civil Solar):
  const nationalSaka = gregorianToNationalSaka(date);

  // 2. Traditional Solar Saka (Mesha Sankranti in mid-April):
  const currentSolarRashi = getSolarRashi(date);
  const isPostMeshaSankranti =
    date.getUTCMonth() > 3 || (date.getUTCMonth() === 3 && date.getUTCDate() >= 14);
  const traditionalSolarSakaYear = isPostMeshaSankranti ? gregYear - 78 : gregYear - 79;

  // 3. Lunisolar Shalivahana Shaka (Chaitra Shukla Pratipada):
  const lunisolarShakaYear = isPreChaitraShukla ? gregYear - 79 : gregYear - 78;

  const baseAmantaName = SANSKRIT_MONTHS[amantaMonthIndex];
  const basePurnimantaName = SANSKRIT_MONTHS[purnimantaMonthIndex];

  const amantaMonthName = isAdhika ? `Adhika ${baseAmantaName}` : baseAmantaName;
  const purnimantaMonthName = isAdhika ? `Adhika ${basePurnimantaName}` : basePurnimantaName;

  return {
    date,
    city,
    vikramSamvatNorth,
    vikramSamvatGujarati,
    shakaSamvat: lunisolarShakaYear, // backward compatibility
    nationalSaka,
    traditionalSolarSaka: {
      year: traditionalSolarSakaYear,
      solarRashiIndex: currentSolarRashi.index,
      solarRashiName: currentSolarRashi.name,
      isPostMeshaSankranti,
    },
    lunisolarShaka: {
      year: lunisolarShakaYear,
      paksha: tithi.paksha,
      tithiName: tithi.name,
    },
    amantaMonth: {
      index: amantaMonthIndex,
      name: amantaMonthName,
      isAdhika,
      isKshaya,
    },
    purnimantaMonth: {
      index: purnimantaMonthIndex,
      name: purnimantaMonthName,
      isAdhika,
      isKshaya,
    },
    regionalMonthNames: {
      gujarati: getRegionalMonthName(amantaMonthIndex, isAdhika, "gujarati"),
      northIndianPurnimanta: getRegionalMonthName(purnimantaMonthIndex, isAdhika, "purnimanta"),
      marathiAmanta: getRegionalMonthName(amantaMonthIndex, isAdhika, "marathi"),
      teluguKannadaAmanta: getRegionalMonthName(amantaMonthIndex, isAdhika, "teluguKannada"),
    },
    paksha: tithi.paksha,
    tithiNumber: ((tithi.index - 1) % 15) + 1,
    tithiName: tithi.name,
  };
}
