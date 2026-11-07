/**
 * Core Astronomical Engine for UtilityClock Panchang & Vedic Calculations
 *
 * Models & Provenance:
 * - Uses Astronomy Engine by Don Cross (MIT License, zero external dependencies).
 * - Solar Theory: VSOP87 (Bretagnon & Francou, 1988) with planetary perturbations,
 *   light travel time / aberration correction (-1/c days), and IAU precession/nutation
 *   to apparent geocentric ecliptic of date (ECT).
 * - Lunar Theory: Montenbruck & Pfleger's adaptation of the Nautical Almanac Office
 *   Improved Lunar Ephemeris (ILE, 1954), derived from E.W. Brown's lunar theories.
 * - Accuracy Standard: Lunar and solar ecliptic coordinates are accurate to within
 *   approximately 1 arcminute (~0.016°), yielding transition time accuracies of
 *   ~1 to 2 minutes for Tithis and Nakshatras. This is suitable for civil, religious,
 *   and cultural Panchang calculations, while remaining lightweight (~35 KB gzipped).
 * - Sidereal Conversion: Lahiri Ayanamsa (Chitra Paksha Ayanamsa), reference epoch J2000.0,
 *   matching Positional Astronomy Centre (Kolkata) / Indian Astronomical Ephemeris standards.
 * - Rise/Set Methodology: Topocentric horizon using 34 arcminutes atmospheric refraction
 *   and 16 arcminutes solar semi-diameter (center-of-Sun zenith = 90° 50').
 */

import {
  Body,
  e_tilt,
  EclipticGeoMoon,
  MakeTime,
  Observer,
  SearchRiseSet,
  SunPosition,
} from "astronomy-engine";

export type CityCoordinates = {
  name: string;
  nativeName: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  timezone: string; // e.g. "Asia/Kolkata"
};

export const STANDARD_CITIES: Record<string, CityCoordinates> = {
  delhi: {
    name: "New Delhi",
    nativeName: "नई दिल्ली",
    latitude: 28.6139,
    longitude: 77.209,
    elevationMeters: 216,
    timezone: "Asia/Kolkata",
  },
  mumbai: {
    name: "Mumbai",
    nativeName: "मुंबई",
    latitude: 19.076,
    longitude: 72.8777,
    elevationMeters: 14,
    timezone: "Asia/Kolkata",
  },
  ahmedabad: {
    name: "Ahmedabad",
    nativeName: "અમદાવાદ",
    latitude: 23.0225,
    longitude: 72.5714,
    elevationMeters: 53,
    timezone: "Asia/Kolkata",
  },
  varanasi: {
    name: "Varanasi (Kashi)",
    nativeName: "वाराणसी (काशी)",
    latitude: 25.3176,
    longitude: 82.9739,
    elevationMeters: 80,
    timezone: "Asia/Kolkata",
  },
  chennai: {
    name: "Chennai",
    nativeName: "சென்னை",
    latitude: 13.0827,
    longitude: 80.2707,
    elevationMeters: 6,
    timezone: "Asia/Kolkata",
  },
  kolkata: {
    name: "Kolkata",
    nativeName: "কলকাতা",
    latitude: 22.5726,
    longitude: 88.3639,
    elevationMeters: 9,
    timezone: "Asia/Kolkata",
  },
  bengaluru: {
    name: "Bengaluru",
    nativeName: "ಬೆಂಗಳೂರು",
    latitude: 12.9716,
    longitude: 77.5946,
    elevationMeters: 920,
    timezone: "Asia/Kolkata",
  },
};

/**
 * Normalizes an angle into the [0, 360) degree interval.
 */
export function normalize360(deg: number): number {
  const mod = deg % 360;
  return mod < 0 ? mod + 360 : mod;
}

/**
 * Calculates Lahiri Ayanamsa (Chitra Paksha Ayanamsa) in degrees for a given date.
 *
 * Source: Indian Astronomical Ephemeris, Positional Astronomy Centre (Govt. of India).
 * - Reference Epoch: J2000.0 (JD 2451545.0, 2000-01-01 12:00:00 TT).
 * - Base value at J2000.0: 23° 51' 25.534" = 23.8570928°.
 * - Precession Rate: 50.290966" / year = 1.3969713° / Julian century.
 * - Time Scale: Terrestrial Time (TT) from J2000 days.
 *
 * @param date Gregorian JavaScript date
 * @param includeNutation If true, adds nutation in longitude (Δψ * cos ε),
 *                        yielding True Ayanamsa (matching Swiss Ephemeris).
 *                        Defaults to false (Mean Ayanamsa, matching Positional Astronomy Centre).
 */
export function getLahiriAyanamsa(date: Date, includeNutation = false): number {
  const time = MakeTime(date);
  const T = time.tt / 36525.0; // Terrestrial Time Julian centuries from J2000.0
  const meanAyanamsa = 23.8570928 + 1.3969713 * T - 0.0003086 * T * T;

  if (!includeNutation) {
    return meanAyanamsa;
  }

  // True Ayanamsa includes the nutation component in longitude
  const et = e_tilt(time);
  const toblRad = et.tobl * (Math.PI / 180);
  const nutationLonDeg = (et.dpsi / 3600) * Math.cos(toblRad);
  return meanAyanamsa + nutationLonDeg;
}

export type CelestialPositions = {
  date: Date;
  ayanamsa: number;
  sunTropicalLon: number;
  moonTropicalLon: number;
  sunSiderealLon: number;
  moonSiderealLon: number;
  phaseAngle: number; // (Moon - Sun) mod 360
};

/**
 * Computes exact geocentric tropical and sidereal coordinates of the Sun and Moon.
 */
export function getCelestialPositions(date: Date): CelestialPositions {
  const sunPos = SunPosition(date);
  const moonPos = EclipticGeoMoon(date);
  const ayanamsa = getLahiriAyanamsa(date);

  const sunTropicalLon = normalize360(sunPos.elon);
  const moonTropicalLon = normalize360(moonPos.lon);

  const sunSiderealLon = normalize360(sunTropicalLon - ayanamsa);
  const moonSiderealLon = normalize360(moonTropicalLon - ayanamsa);
  const phaseAngle = normalize360(moonTropicalLon - sunTropicalLon);

  return {
    date,
    ayanamsa,
    sunTropicalLon,
    moonTropicalLon,
    sunSiderealLon,
    moonSiderealLon,
    phaseAngle,
  };
}

export type SolarDayTimes = {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  nextSunrise: Date;
  dayLengthMinutes: number;
  nightLengthMinutes: number;
};

/**
 * Calculates topocentric sunrise, sunset, and solar day parameters for a given city and date.
 */
export function getSolarDayTimes(date: Date, city: CityCoordinates): SolarDayTimes | null {
  const observer = new Observer(city.latitude, city.longitude, city.elevationMeters);

  // Search start from local midnight (00:00:00 of the given date in local time)
  // Construct UTC timestamp representing beginning of local day
  const baseMidnight = new Date(date);
  baseMidnight.setUTCHours(0, 0, 0, 0);
  // Offset by longitude to approximate local midnight
  const approxLocalMidnight = new Date(
    baseMidnight.getTime() - (city.longitude / 15) * 3600000,
  );

  const riseEvent = SearchRiseSet(Body.Sun, observer, +1, approxLocalMidnight, 1.5);
  if (!riseEvent) return null;

  const setEvent = SearchRiseSet(Body.Sun, observer, -1, riseEvent.date, 1.2);
  if (!setEvent) return null;

  const nextRiseEvent = SearchRiseSet(Body.Sun, observer, +1, setEvent.date, 1.2);
  if (!nextRiseEvent) return null;

  const sunrise = riseEvent.date;
  const sunset = setEvent.date;
  const nextSunrise = nextRiseEvent.date;

  const dayLengthMs = sunset.getTime() - sunrise.getTime();
  const nightLengthMs = nextSunrise.getTime() - sunset.getTime();
  const solarNoon = new Date(sunrise.getTime() + dayLengthMs / 2);

  return {
    sunrise,
    sunset,
    solarNoon,
    nextSunrise,
    dayLengthMinutes: dayLengthMs / 60000,
    nightLengthMinutes: nightLengthMs / 60000,
  };
}

/**
 * Numerical root-finding via bisection to determine the exact transition timestamp
 * where an astronomical angle reaches a target modulo 360°.
 *
 * @param getAngle Function returning angle in degrees [0, 360) at date t
 * @param targetAngle Target threshold angle in degrees
 * @param tStart Search interval start
 * @param tEnd Search interval end
 * @param toleranceMinutes Precision tolerance in minutes (default 0.1 min / 6 seconds)
 */
export function findAngleTransition(
  getAngle: (d: Date) => number,
  targetAngle: number,
  tStart: Date,
  tEnd: Date,
  toleranceMinutes = 0.1,
): Date {
  let low = tStart.getTime();
  let high = tEnd.getTime();
  const target = normalize360(targetAngle);

  // Measure angular difference in a continuous monotonically increasing frame
  const initialAngle = getAngle(tStart);
  let initialDiff = normalize360(target - initialAngle);
  if (initialDiff === 0) initialDiff = 360;

  while ((high - low) / 60000 > toleranceMinutes) {
    const mid = (low + high) / 2;
    const midDate = new Date(mid);
    const midAngle = getAngle(midDate);
    const traveled = normalize360(midAngle - initialAngle);

    if (traveled < initialDiff) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return new Date((low + high) / 2);
}
