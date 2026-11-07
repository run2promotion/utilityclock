/**
 * Panchang Engine: Rigorous Astronomical Panch-Anga Calculations
 *
 * Implements:
 * 1. Tithi: Normalized Moon-Sun angular separation (12° increments)
 * 2. Nakshatra: Normalized sidereal Moon longitude in Lahiri Ayanamsa (13° 20' increments)
 * 3. Yoga: Normalized sum of sidereal Sun and Moon longitudes (13° 20' increments)
 * 4. Karana: Half-Tithi boundaries (6° increments) with fixed & movable sequences
 * 5. Udaya Tithi: Tithi prevailing at local topocentric sunrise
 * 6. Precise Transition Times calculated via bisection root-finding
 * 7. Exact Rahu Kaal, Yamaganda, Gulika, and Abhijit Muhurat based on local sunrise/sunset
 * 8. Real-time Day and Night Choghadiya tables
 */

import {
  type CityCoordinates,
  findAngleTransition,
  getCelestialPositions,
  getSolarDayTimes,
  normalize360,
  STANDARD_CITIES,
} from "./astronomy";

export const TITHI_NAMES = [
  "Pratipada (प्रतिपदा / એકમ)",
  "Dwitiya (द्वितीया / બીજ)",
  "Tritiya (तृतीया / ત્રીજ)",
  "Chaturthi (चतुर्थी / ચોથ)",
  "Panchami (पंचमी / પાંચમ)",
  "Shashthi (षष्ठी / છઠ)",
  "Saptami (सप्तमी / સાતમ)",
  "Ashtami (अष्टमी / આઠમ)",
  "Navami (नवमी / નોમ)",
  "Dashami (दशमी / દસમ)",
  "Ekadashi (एकादशी / અગિયારસ)",
  "Dwadashi (द्वादशी / બારસ)",
  "Trayodashi (त्रयोदशी / તેરસ)",
  "Chaturdashi (चतुर्दशी / ચૌદશ)",
  "Purnima (पूर्णिमा / પૂનમ)", // Tithi 15
  "Pratipada (प्रतिपदा / એકમ)",
  "Dwitiya (द्वितीया / બીજ)",
  "Tritiya (तृतीया / ત્રીજ)",
  "Chaturthi (चतुर्थी / ચોથ)",
  "Panchami (पंचमी / પાંચમ)",
  "Shashthi (षष्ठी / છઠ)",
  "Saptami (सप्तमी / સાતમ)",
  "Ashtami (अष्टमी / આઠમ)",
  "Navami (नवमी / નોમ)",
  "Dashami (दशमी / દસમ)",
  "Ekadashi (एकादशी / અગિયારસ)",
  "Dwadashi (द्वादशी / બારસ)",
  "Trayodashi (त्रयोदशी / તેરસ)",
  "Chaturdashi (चतुर्दशी / ચૌદશ)",
  "Amavasya (अमावस्या / અમાસ)", // Tithi 30
] as const;

export const NAKSHATRA_NAMES = [
  "Ashwini (अश्विनी)",
  "Bharani (भरणी)",
  "Krittika (कृत्तिका)",
  "Rohini (रोहिणी)",
  "Mrigashirsha (मृગશીર્ષ)",
  "Ardra (आर्द्रा)",
  "Punarvasu (पुનર્વસુ)",
  "Pushya (पुષ્ય)",
  "Ashlesha (આશ્લેષા)",
  "Magha (મઘા)",
  "Purva Phalguni (પૂર્વા ફાલ્ગુની)",
  "Uttara Phalguni (ઉત્તરા ફાલ્ગુની)",
  "Hasta (હસ્ત)",
  "Chitra (ચિત્રા)",
  "Swati (સ્વાતિ)",
  "Vishakha (વિશાખા)",
  "Anuradha (અનુરાધા)",
  "Jyeshtha (જ્યેષ્ઠા)",
  "Mula (મૂળ)",
  "Purva Ashadha (પૂર્વાષાઢા)",
  "Uttara Ashadha (ઉત્તરાષાઢા)",
  "Shravana (શ્રાવણ)",
  "Dhanishtha (ધનિષ્ઠા)",
  "Shatabhisha (શતભિષા)",
  "Purva Bhadrapada (પૂર્વા ભાદ્રપદ)",
  "Uttara Bhadrapada (ઉત્તરા ભાદ્રપદ)",
  "Revati (રેવતી)",
] as const;

export const YOGA_NAMES = [
  "Vishkambha (વિષ્કંભ)",
  "Priti (પ્રીતિ)",
  "Ayushman (આયુષ્માન)",
  "Saubhagya (સૌભાગ્ય)",
  "Shobhana (શોભન)",
  "Atiganda (અતિગંડ)",
  "Sukarma (સુકર્મા)",
  "Dhriti (ધૃતિ)",
  "Shula (શૂળ)",
  "Ganda (ગંડ)",
  "Vriddhi (વૃદ્ધિ)",
  "Dhruva (ધ્રુવ)",
  "Vyaghata (વ્યાઘાત)",
  "Harshana (હર્ષણ)",
  "Vajra (વજ્ર)",
  "Siddhi (સિદ્ધિ)",
  "Vyatipata (વ્યતીપાત)",
  "Variyan (વરિયાન)",
  "Parigha (પરિઘ)",
  "Shiva (શિવ)",
  "Siddha (સિદ્ધ)",
  "Sadhya (સાધ્ય)",
  "Shubha (શુભ)",
  "Shukla (શુક્લ)",
  "Brahma (બ્રહ્મ)",
  "Indra (ઇન્દ્ર)",
  "Vaidhriti (વૈધૃતિ)",
] as const;

export const MOVABLE_KARANAS = [
  "Bava (બવ)",
  "Balava (બાલવ)",
  "Kaulava (કૌલવ)",
  "Taitila (તૈતિલ)",
  "Gara (ગર)",
  "Vanija (વણિજ)",
  "Vishti / Bhadra (વિષ્ટિ / ભદ્રા)",
] as const;

export const FIXED_KARANAS = {
  0: "Kintughna (કિન્તુઘ્ન)",
  57: "Shakuni (શકુનિ)",
  58: "Chatushpada (ચતુષ્પદ)",
  59: "Naga (નાગ)",
} as const;

export const VARA_NAMES = [
  "Ravivara (Sunday / રવિવાર)",
  "Somavara (Monday / સોમવાર)",
  "Mangalavara (Tuesday / મંગળવાર)",
  "Budhavara (Wednesday / બુધવાર)",
  "Guruvara (Thursday / ગુરુવાર)",
  "Shukravara (Friday / શુક્રવાર)",
  "Shanivara (Saturday / શનિવાર)",
] as const;

export type TithiInfo = {
  index: number; // 1 to 30
  name: string;
  paksha: "Shukla" | "Krishna";
  pakshaName: string;
  fractionComplete: number; // 0 to 1
  endsAt: Date; // Exact transition timestamp
};

export type NakshatraInfo = {
  index: number; // 1 to 27
  name: string;
  pada: number; // 1 to 4
  degreesInNakshatra: number;
  endsAt: Date;
};

export type YogaInfo = {
  index: number; // 1 to 27
  name: string;
  degreesInYoga: number;
  endsAt: Date;
};

export type KaranaInfo = {
  halfTithiIndex: number; // 0 to 59
  name: string;
  isVishtiBhadra: boolean;
  endsAt: Date;
};

export type ChoghadiyaSegment = {
  name: "Amrit" | "Shubh" | "Labh" | "Char" | "Rog" | "Kaal" | "Udveg";
  nativeName: string;
  quality: "Auspicious" | "Good" | "Neutral" | "Inauspicious";
  startTime: Date;
  endTime: Date;
};

export type PanchangOutput = {
  date: Date;
  city: CityCoordinates;
  solarTimes: {
    sunrise: Date;
    sunset: Date;
    solarNoon: Date;
    dayLengthFormatted: string;
  };
  vara: string;
  udayaTithi: TithiInfo;
  currentTithi: TithiInfo;
  nakshatra: NakshatraInfo;
  yoga: YogaInfo;
  karana: KaranaInfo;
  muhurats: {
    abhijit: { start: Date; end: Date };
    rahuKaal: { start: Date; end: Date };
    yamaganda: { start: Date; end: Date };
    gulika: { start: Date; end: Date };
  };
  dayChoghadiya: ChoghadiyaSegment[];
  nightChoghadiya: ChoghadiyaSegment[];
};

/**
 * Calculates the exact Tithi given an instantaneous date.
 */
export function calculateTithi(date: Date): TithiInfo {
  const pos = getCelestialPositions(date);
  const phase = pos.phaseAngle; // [0, 360)
  const index = Math.floor(phase / 12) + 1; // 1 to 30
  const paksha: "Shukla" | "Krishna" = index <= 15 ? "Shukla" : "Krishna";
  const pakshaName = paksha === "Shukla" ? "Shukla Paksha (સુદ / શુક્લ)" : "Krishna Paksha (વદ / કૃષ્ણ)";

  const degreesIntoTithi = phase % 12;
  const fractionComplete = degreesIntoTithi / 12;

  // Search forward for the exact moment phase reaches index * 12
  const targetAngle = index * 12;
  const searchEnd = new Date(date.getTime() + 30 * 3600000); // 30h forward limit
  const endsAt = findAngleTransition(
    (d) => getCelestialPositions(d).phaseAngle,
    targetAngle,
    date,
    searchEnd,
  );

  return {
    index,
    name: TITHI_NAMES[index - 1],
    paksha,
    pakshaName,
    fractionComplete,
    endsAt,
  };
}

/**
 * Calculates the exact Nakshatra given an instantaneous date.
 */
export function calculateNakshatra(date: Date): NakshatraInfo {
  const pos = getCelestialPositions(date);
  const moonSid = pos.moonSiderealLon;
  const span = 360 / 27; // 13.333333°
  const index = Math.floor(moonSid / span) + 1; // 1 to 27
  const degreesInNakshatra = moonSid % span;
  const pada = Math.floor(degreesInNakshatra / (span / 4)) + 1; // 1 to 4

  const targetAngle = index * span;
  const searchEnd = new Date(date.getTime() + 30 * 3600000);
  const endsAt = findAngleTransition(
    (d) => getCelestialPositions(d).moonSiderealLon,
    targetAngle,
    date,
    searchEnd,
  );

  return {
    index,
    name: NAKSHATRA_NAMES[index - 1],
    pada,
    degreesInNakshatra,
    endsAt,
  };
}

/**
 * Calculates the exact Yoga given an instantaneous date.
 */
export function calculateYoga(date: Date): YogaInfo {
  const pos = getCelestialPositions(date);
  const sum = normalize360(pos.sunSiderealLon + pos.moonSiderealLon);
  const span = 360 / 27;
  const index = Math.floor(sum / span) + 1;
  const degreesInYoga = sum % span;

  const targetAngle = index * span;
  const searchEnd = new Date(date.getTime() + 30 * 3600000);
  const endsAt = findAngleTransition(
    (d) => {
      const p = getCelestialPositions(d);
      return normalize360(p.sunSiderealLon + p.moonSiderealLon);
    },
    targetAngle,
    date,
    searchEnd,
  );

  return {
    index,
    name: YOGA_NAMES[index - 1],
    degreesInYoga,
    endsAt,
  };
}

/**
 * Calculates the exact Karana given an instantaneous date.
 */
export function calculateKarana(date: Date): KaranaInfo {
  const pos = getCelestialPositions(date);
  const halfTithiIndex = Math.floor(pos.phaseAngle / 6); // 0 to 59

  let name = "";
  if (halfTithiIndex === 0) name = FIXED_KARANAS[0];
  else if (halfTithiIndex >= 57) name = FIXED_KARANAS[halfTithiIndex as 57 | 58 | 59];
  else {
    const movableIdx = (halfTithiIndex - 1) % 7;
    name = MOVABLE_KARANAS[movableIdx];
  }

  const isVishtiBhadra = name.includes("Vishti");

  const targetAngle = (halfTithiIndex + 1) * 6;
  const searchEnd = new Date(date.getTime() + 18 * 3600000);
  const endsAt = findAngleTransition(
    (d) => getCelestialPositions(d).phaseAngle,
    targetAngle,
    date,
    searchEnd,
  );

  return {
    halfTithiIndex,
    name,
    isVishtiBhadra,
    endsAt,
  };
}

// Classical Choghadiya sequence per weekday starting at Sunrise
const CHOGHADIYA_DAY_ORDER: Record<number, Array<ChoghadiyaSegment["name"]>> = {
  0: ["Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg"], // Sun
  1: ["Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit"], // Mon
  2: ["Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog"], // Tue
  3: ["Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh"], // Wed
  4: ["Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal", "Shubh"], // Thu
  5: ["Char", "Labh", "Amrit", "Kaal", "Shubh", "Rog", "Udveg", "Char"], // Fri
  6: ["Kaal", "Shubh", "Rog", "Udveg", "Char", "Labh", "Amrit", "Kaal"], // Sat
};

// Classical Choghadiya sequence per weekday starting at Sunset
const CHOGHADIYA_NIGHT_ORDER: Record<number, Array<ChoghadiyaSegment["name"]>> = {
  0: ["Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh"], // Sun night
  1: ["Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char"], // Mon night
  2: ["Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal"], // Tue night
  3: ["Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg"], // Wed night
  4: ["Amrit", "Char", "Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit"], // Thu night
  5: ["Rog", "Kaal", "Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog"], // Fri night
  6: ["Labh", "Udveg", "Shubh", "Amrit", "Char", "Rog", "Kaal", "Labh"], // Sat night
};

const CHOGHADIYA_META: Record<
  ChoghadiyaSegment["name"],
  { nativeName: string; quality: ChoghadiyaSegment["quality"] }
> = {
  Amrit: { nativeName: "Amrit (અમૃત / अमृत)", quality: "Auspicious" },
  Shubh: { nativeName: "Shubh (શુભ / शुभ)", quality: "Auspicious" },
  Labh: { nativeName: "Labh (લાભ / लाभ)", quality: "Auspicious" },
  Char: { nativeName: "Char (ચલ / ચંચળ)", quality: "Neutral" },
  Rog: { nativeName: "Rog (રોગ / रोग)", quality: "Inauspicious" },
  Kaal: { nativeName: "Kaal (કાળ / काल)", quality: "Inauspicious" },
  Udveg: { nativeName: "Udveg (ઉદ્વેગ / उद्वेग)", quality: "Inauspicious" },
};

/**
 * Computes full Panchang parameters for a given civil calendar date and city.
 * Correctly applies the Udaya Tithi rule based on local topocentric sunrise.
 */
export function calculateDailyPanchang(
  date: Date,
  city: CityCoordinates = STANDARD_CITIES.delhi,
): PanchangOutput {
  const solar = getSolarDayTimes(date, city);
  const sunrise = solar ? solar.sunrise : new Date(date);
  const sunset = solar ? solar.sunset : new Date(date.getTime() + 12 * 3600000);
  const solarNoon = solar ? solar.solarNoon : new Date(date.getTime() + 6 * 3600000);
  const nextSunrise = solar ? solar.nextSunrise : new Date(date.getTime() + 24 * 3600000);

  // Udaya Tithi: Tithi active at local sunrise
  const udayaTithi = calculateTithi(sunrise);
  const currentTithi = calculateTithi(date);
  const nakshatra = calculateNakshatra(date);
  const yoga = calculateYoga(date);
  const karana = calculateKarana(date);

  const weekday = sunrise.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const vara = VARA_NAMES[weekday];

  // Divide daylight into 8 equal parts for Day Choghadiya and Rahu Kaal
  const daySegmentMs = (sunset.getTime() - sunrise.getTime()) / 8;
  const nightSegmentMs = (nextSunrise.getTime() - sunset.getTime()) / 8;

  // Rahu Kaal Eighth Part schedule (1-indexed portion of daytime):
  // Sun: 8th, Mon: 2nd, Tue: 7th, Wed: 5th, Thu: 6th, Fri: 4th, Sat: 3rd
  const rahuPortionMap = [8, 2, 7, 5, 6, 4, 3];
  const yamagandaPortionMap = [5, 4, 3, 2, 1, 7, 6];
  const gulikaPortionMap = [7, 6, 5, 4, 3, 2, 1];

  const rahuPart = rahuPortionMap[weekday] - 1;
  const yamaPart = yamagandaPortionMap[weekday] - 1;
  const guliPart = gulikaPortionMap[weekday] - 1;

  const rahuKaal = {
    start: new Date(sunrise.getTime() + rahuPart * daySegmentMs),
    end: new Date(sunrise.getTime() + (rahuPart + 1) * daySegmentMs),
  };
  const yamaganda = {
    start: new Date(sunrise.getTime() + yamaPart * daySegmentMs),
    end: new Date(sunrise.getTime() + (yamaPart + 1) * daySegmentMs),
  };
  const gulika = {
    start: new Date(sunrise.getTime() + guliPart * daySegmentMs),
    end: new Date(sunrise.getTime() + (guliPart + 1) * daySegmentMs),
  };

  // Abhijit Muhurat: 8th Muhurta of 15 daytime Muhurtas (centered on Solar Noon)
  const muhurtaDurationMs = (sunset.getTime() - sunrise.getTime()) / 15;
  const abhijit = {
    start: new Date(solarNoon.getTime() - muhurtaDurationMs / 2),
    end: new Date(solarNoon.getTime() + muhurtaDurationMs / 2),
  };

  // Day Choghadiya
  const dayOrder = CHOGHADIYA_DAY_ORDER[weekday] || CHOGHADIYA_DAY_ORDER[0];
  const dayChoghadiya: ChoghadiyaSegment[] = dayOrder.map((name, i) => ({
    name,
    nativeName: CHOGHADIYA_META[name].nativeName,
    quality: CHOGHADIYA_META[name].quality,
    startTime: new Date(sunrise.getTime() + i * daySegmentMs),
    endTime: new Date(sunrise.getTime() + (i + 1) * daySegmentMs),
  }));

  // Night Choghadiya
  const nightOrder = CHOGHADIYA_NIGHT_ORDER[weekday] || CHOGHADIYA_NIGHT_ORDER[0];
  const nightChoghadiya: ChoghadiyaSegment[] = nightOrder.map((name, i) => ({
    name,
    nativeName: CHOGHADIYA_META[name].nativeName,
    quality: CHOGHADIYA_META[name].quality,
    startTime: new Date(sunset.getTime() + i * nightSegmentMs),
    endTime: new Date(sunset.getTime() + (i + 1) * nightSegmentMs),
  }));

  const dayLengthHours = Math.floor((solar?.dayLengthMinutes ?? 720) / 60);
  const dayLengthMins = Math.round((solar?.dayLengthMinutes ?? 720) % 60);

  return {
    date,
    city,
    solarTimes: {
      sunrise,
      sunset,
      solarNoon,
      dayLengthFormatted: `${dayLengthHours}h ${dayLengthMins}m`,
    },
    vara,
    udayaTithi,
    currentTithi,
    nakshatra,
    yoga,
    karana,
    muhurats: {
      abhijit,
      rahuKaal,
      yamaganda,
      gulika,
    },
    dayChoghadiya,
    nightChoghadiya,
  };
}
